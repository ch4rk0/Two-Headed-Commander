import { useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useBannedCards } from '../../hooks/useBannedCards';
import { useAllDiscussions, type VoteSummary } from '../../hooks/useAllDiscussions';
import { useAuth } from '../../contexts/AuthContext';
import type { BannedCard, BanReason } from '../../data/banned-cards.seed';
import { getCardImageUrl } from '../../scryfallCache';
import CardDiscussion from '../../components/admin/CardDiscussion';

function cardDocId(name: string) {
  return name.replace(/[^a-zA-Z0-9\-_' ]/g, '_');
}

type SortKey = 'name' | 'cat' | 'dateAdded' | 'updatedAt' | 'hidden' | 'votes_up' | 'votes_neutral' | 'votes_down';
type SortDir = 'asc' | 'desc';
type VoteFilter = 'all' | 'any' | 'keep' | 'unban' | 'contested' | 'none';

const VOTE_FILTERS: { value: VoteFilter; label: string }[] = [
  { value: 'all',       label: 'All (vote filter)' },
  { value: 'any',       label: 'Has any votes' },
  { value: 'keep',      label: 'Has keep votes (↑)' },
  { value: 'unban',     label: 'Has unban votes (↓)' },
  { value: 'contested', label: 'Contested (↑ & ↓)' },
  { value: 'none',      label: 'No votes' },
];

const CATS = [
  'banned-commander','extra-turn','tutor','fast-mana',
  'big-life','life-manip','combo','hard-stax','misc','commander',
];

const PILLS = [
  { value: 'pill-edh',  label: 'EDH (Commander)' },
  { value: 'pill-2hg',  label: '2HG (Two-Headed Giant)' },
  { value: 'pill-both', label: 'Both EDH & 2HG' },
  { value: 'pill-2hc',  label: '2HC specific' },
  { value: 'pill-new',      label: 'Newly banned' },
  { value: 'pill-unbanned', label: 'Newly unbanned' },
];

function today() { return new Date().toISOString().slice(0, 10); }

const EMPTY_CARD: BannedCard = {
  name: '', type: '', cat: 'misc', pill: 'pill-2hc',
  origin: 'Banned — 2HC specific', reason: { en: '', fr: '' },
  image: '', hidden: false, dateAdded: today(),
};

function localImg(name: string) {
  return '/images/cards/' + name.replace(/[^a-zA-Z0-9\-_' ]/g, '_').replace(/\s+/g, '_') + '.jpg';
}

function getReason(r: BanReason): { en: string; fr: string } {
  if (!r || typeof r === 'string') return { en: '', fr: '' };
  return r;
}

// ── Card form ─────────────────────────────────────────────────────

interface CardFormProps {
  initial: BannedCard;
  isNew: boolean;
  allCards: BannedCard[];
  onSave: (card: BannedCard) => Promise<void>;
  onCancel: () => void;
}

function CardForm({ initial, isNew, allCards, onSave, onCancel }: CardFormProps) {
  const [card, setCard] = useState<BannedCard>({ ...initial, reason: getReason(initial.reason) });
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!card.name.trim()) { alert('Enter a card name before uploading an image.'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `card-images/${card.name.replace(/[^a-zA-Z0-9\-_' ]/g, '_')}.${ext}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImgFailed(false);
      set('image', url);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const set = <K extends keyof BannedCard>(key: K, val: BannedCard[K]) =>
    setCard(c => ({ ...c, [key]: val }));

  const setReason = (lang: 'en' | 'fr', val: string) =>
    setCard(c => ({ ...c, reason: { ...getReason(c.reason), [lang]: val } }));

  const handleSave = async () => {
    if (!card.name.trim()) { alert('Name is required.'); return; }
    if (isNew && allCards.some(c => c.name === card.name.trim())) {
      alert(`"${card.name}" is already on the ban list.`); return;
    }
    setSaving(true);
    try { await onSave(card); } finally { setSaving(false); }
  };

  const imgSrc = card.image || (card.name ? localImg(card.name) : '');

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-page-title">{isNew ? 'Add Card' : `Edit — ${initial.name}`}</h1>
        <div style={{ display: 'flex', gap: '.75rem' }}>
          <button className="admin-btn-sm" onClick={onCancel}>← Back</button>
          <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Card'}
          </button>
        </div>
      </div>

      <div className="admin-card-form">
        {/* Sidebar: image + visibility */}
        <div className="admin-card-form-aside">
          <div className="admin-card-img-preview">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={card.name}
                onError={async e => {
                  if (!imgFailed) {
                    setImgFailed(true);
                    e.currentTarget.onerror = null;
                    const url = await getCardImageUrl(card.name);
                    if (url) e.currentTarget.src = url;
                  }
                }}
              />
            ) : (
              <div className="admin-card-img-placeholder">Enter a name to preview</div>
            )}
          </div>
          <div style={{ marginTop: '.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            <button
              className="admin-btn-sm"
              style={{ width: '100%' }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
          </div>

          <div className="admin-field-row" style={{ marginTop: '.5rem' }}>
            <label>Or paste image URL</label>
            <input
              className="admin-input"
              placeholder="Auto-loaded from card name if blank"
              value={card.image ?? ''}
              onChange={e => { setImgFailed(false); set('image', e.target.value); }}
            />
          </div>
          <label className="admin-card-hidden-toggle">
            <input type="checkbox" checked={!!card.hidden}
              onChange={e => set('hidden', e.target.checked)} />
            <span>Hidden from public list</span>
          </label>
        </div>

        {/* Main fields */}
        <div className="admin-card-form-fields">
          <div className="admin-field-row">
            <label>Card Name *</label>
            <input className="admin-input" value={card.name}
              onChange={e => { setImgFailed(false); set('name', e.target.value); }}
              disabled={!isNew} placeholder="Exact card name" />
          </div>
          <div className="admin-field-row">
            <label>Type Line</label>
            <input className="admin-input" value={card.type}
              onChange={e => set('type', e.target.value)}
              placeholder="e.g. Legendary Creature — Human Wizard" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem 1.25rem' }}>
            <div className="admin-field-row">
              <label>Category</label>
              <select className="admin-input" value={card.cat}
                onChange={e => set('cat', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-field-row">
              <label>Pill Badge</label>
              <select className="admin-input" value={card.pill}
                onChange={e => set('pill', e.target.value)}>
                {PILLS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem 1.25rem' }}>
            <div className="admin-field-row">
              <label>Origin / Ban Tag</label>
              <input className="admin-input" value={card.origin}
                onChange={e => set('origin', e.target.value)}
                placeholder="e.g. Banned — 2HC specific" />
            </div>
            <div className="admin-field-row">
              <label>Date Added</label>
              <input className="admin-input" type="date" value={card.dateAdded ?? today()}
                onChange={e => set('dateAdded', e.target.value)} />
            </div>
          </div>
          <div className="admin-field-row">
            <label>Ban Reason (EN)</label>
            <textarea className="admin-input" rows={5}
              value={getReason(card.reason).en}
              onChange={e => setReason('en', e.target.value)}
              placeholder="Leave blank for cards banned without extended explanation" />
          </div>
          <div className="admin-field-row">
            <label>Ban Reason (FR)</label>
            <textarea className="admin-input" rows={5}
              value={getReason(card.reason).fr}
              onChange={e => setReason('fr', e.target.value)}
              placeholder="Laisser vide pour les cartes sans raison étendue" />
          </div>
        </div>
      </div>

      {!isNew && (
        <>
          <hr className="card-discussion-divider" />
          <CardDiscussion cardName={initial.name} />
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

type View = { mode: 'list' } | { mode: 'edit'; card: BannedCard } | { mode: 'new' };

export default function BanListEditor() {
  const { cards, loading } = useBannedCards();
  const discussions = useAllDiscussions();
  const { user } = useAuth();
  const [view, setView]           = useState<View>({ mode: 'list' });
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('all');
  const [sortKey, setSortKey]     = useState<SortKey>('updatedAt');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');

  function getVotes(cardName: string): VoteSummary {
    return discussions[cardDocId(cardName)] ?? { up: 0, neutral: 0, down: 0 };
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return <span className="sort-indicator inactive">⇅</span>;
    return <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  }

  const saveCard = async (updated: BannedCard) => {
    const r = getReason(updated.reason);
    const card = {
      ...updated,
      reason: (r.en || r.fr) ? r : '',
      updatedBy: user?.email ?? 'unknown',
      updatedAt: today(),
    };
    const newCards = view.mode === 'new'
      ? [...cards, card]
      : cards.map(c => c.name === card.name ? card : c);
    await updateDoc(doc(db, 'banned_cards', 'list'), { cards: newCards });
    setView({ mode: 'list' });
  };

  const deleteCard = async (name: string) => {
    if (!confirm(`Remove "${name}" from the ban list?`)) return;
    await updateDoc(doc(db, 'banned_cards', 'list'), { cards: cards.filter(c => c.name !== name) });
  };

  const toggleHidden = async (card: BannedCard) => {
    const newCards = cards.map(c => c.name === card.name ? { ...c, hidden: !c.hidden } : c);
    await updateDoc(doc(db, 'banned_cards', 'list'), { cards: newCards });
  };

  if (loading) return <div className="admin-loading">Loading ban list…</div>;

  if (view.mode === 'new')
    return <CardForm initial={EMPTY_CARD} isNew allCards={cards}
      onSave={saveCard} onCancel={() => setView({ mode: 'list' })} />;

  if (view.mode === 'edit')
    return <CardForm initial={view.card} isNew={false} allCards={cards}
      onSave={saveCard} onCancel={() => setView({ mode: 'list' })} />;

  const filtered = cards.filter(c => {
    if (filter !== 'all' && c.cat !== filter) return false;
    if (!c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (voteFilter !== 'all') {
      const vs = getVotes(c.name);
      const total = vs.up + vs.neutral + vs.down;
      if (voteFilter === 'any'       && total === 0) return false;
      if (voteFilter === 'keep'      && vs.up === 0) return false;
      if (voteFilter === 'unban'     && vs.down === 0) return false;
      if (voteFilter === 'contested' && (vs.up === 0 || vs.down === 0)) return false;
      if (voteFilter === 'none'      && total > 0) return false;
    }
    return true;
  });

  const visible = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'name':         return dir * a.name.localeCompare(b.name);
      case 'cat':          return dir * a.cat.localeCompare(b.cat);
      case 'dateAdded':    return dir * (a.dateAdded ?? '').localeCompare(b.dateAdded ?? '');
      case 'updatedAt':    return dir * (a.updatedAt ?? '').localeCompare(b.updatedAt ?? '');
      case 'hidden':       return dir * (Number(a.hidden ?? false) - Number(b.hidden ?? false));
      case 'votes_up':     return dir * (getVotes(a.name).up - getVotes(b.name).up);
      case 'votes_neutral': return dir * (getVotes(a.name).neutral - getVotes(b.name).neutral);
      case 'votes_down':   return dir * (getVotes(a.name).down - getVotes(b.name).down);
      default: return 0;
    }
  });

  return (
    <div className="admin-section" style={{ maxWidth: 'none' }}>
      <div className="admin-section-header">
        <h1 className="admin-page-title">Ban List</h1>
        <button className="admin-btn-primary" onClick={() => setView({ mode: 'new' })}>+ Add Card</button>
      </div>

      <div className="admin-filters">
        <input className="admin-input admin-search" placeholder="Search cards…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="admin-input" value={filter} onChange={e => setFilter(e.target.value)}>
          {['all', ...CATS].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="admin-input" value={voteFilter} onChange={e => setVoteFilter(e.target.value as VoteFilter)}>
          {VOTE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <span className="admin-empty" style={{ marginLeft: 'auto' }}>
          {visible.length} card{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th className="sortable-th" onClick={() => handleSort('name')}>
              Name {sortIndicator('name')}
            </th>
            <th className="sortable-th" onClick={() => handleSort('cat')}>
              Category {sortIndicator('cat')}
            </th>
            <th className="sortable-th" onClick={() => handleSort('dateAdded')}>
              Date Added {sortIndicator('dateAdded')}
            </th>
            <th className="sortable-th" onClick={() => handleSort('updatedAt')}>
              Last Updated {sortIndicator('updatedAt')}
            </th>
            <th>Pill</th>
            <th>
              <span title="Sort by keep votes" className="sortable-th" onClick={() => handleSort('votes_up')} style={{ marginRight: '.3rem' }}>
                ↑{sortIndicator('votes_up')}
              </span>
              <span title="Sort by neutral votes" className="sortable-th" onClick={() => handleSort('votes_neutral')} style={{ marginRight: '.3rem' }}>
                —{sortIndicator('votes_neutral')}
              </span>
              <span title="Sort by unban votes" className="sortable-th" onClick={() => handleSort('votes_down')}>
                ↓{sortIndicator('votes_down')}
              </span>
            </th>
            <th className="sortable-th" onClick={() => handleSort('hidden')}>
              Visibility {sortIndicator('hidden')}
            </th>
            <th style={{ width: 130 }}></th>
          </tr>
        </thead>
        <tbody>
          {visible.map(card => {
            const vs = getVotes(card.name);
            return (
              <tr key={card.name} style={{ opacity: card.hidden ? .4 : 1 }}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{card.name}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text2)' }}>{card.type}</div>
                </td>
                <td><span className="admin-ban-cat">{card.cat}</span></td>
                <td style={{ fontSize: '.8rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                  {card.dateAdded ?? '—'}
                </td>
                <td style={{ fontSize: '.75rem', color: 'var(--text2)' }}>
                  {card.updatedBy ? (
                    <><span title={card.updatedBy}>{card.updatedBy.split('@')[0]}</span><br />{card.updatedAt}</>
                  ) : '—'}
                </td>
                <td><span className={'ban-pill ' + card.pill} style={{ fontSize: '.7rem' }}>{card.pill}</span></td>
                <td>
                  <div className="admin-vote-counts">
                    <span className="vote-count-up" title="Keep banned">↑ {vs.up}</span>
                    <span className="vote-count-neutral" title="Neutral">— {vs.neutral}</span>
                    <span className="vote-count-down" title="Unban">↓ {vs.down}</span>
                  </div>
                </td>
                <td>
                  <button className={`admin-toggle ${card.hidden ? 'draft' : 'published'}`}
                    onClick={() => toggleHidden(card)}>
                    {card.hidden ? 'Hidden' : 'Visible'}
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-btn-sm" onClick={() => setView({ mode: 'edit', card })}>Edit</button>
                    <button className="admin-btn-sm danger" onClick={() => deleteCard(card.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

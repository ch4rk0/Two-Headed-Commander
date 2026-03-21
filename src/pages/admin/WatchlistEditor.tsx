import { useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useBannedCards } from '../../hooks/useBannedCards';
import type { WatchlistCard, WatchDiscuss } from '../../data/banned-cards.seed';

const CATS = ['combo', 'stax', 'ramp', 'extra-turn', 'land', 'tutor', 'wipe', 'other'];

const today = () => new Date().toISOString().slice(0, 10);

const emptyCard = (): Partial<WatchlistCard> => ({ cat: 'combo', hidden: false, dateAdded: today(), discuss: { en: '', fr: '' } });

const getDiscuss = (d: WatchDiscuss | undefined): { en: string; fr: string } => {
  if (!d) return { en: '', fr: '' };
  if (typeof d === 'string') return { en: d, fr: '' };  // migrate legacy plain-string from Firestore
  return d;
};

type View = { mode: 'list' } | { mode: 'edit'; card: WatchlistCard } | { mode: 'new' };

export default function WatchlistEditor() {
  const { watchlist, loading } = useBannedCards();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [form, setForm] = useState<Partial<WatchlistCard>>(emptyCard());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openNew = () => { setForm(emptyCard()); setView({ mode: 'new' }); };
  const openEdit = (card: WatchlistCard) => { setForm({ ...card }); setView({ mode: 'edit', card }); };
  const backToList = () => setView({ mode: 'list' });

  const setF = <K extends keyof WatchlistCard>(k: K, v: WatchlistCard[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const setDiscuss = (lang: 'en' | 'fr', val: string) =>
    setForm(prev => ({ ...prev, discuss: { ...getDiscuss(prev.discuss), [lang]: val } }));

  const toggleHidden = async (card: WatchlistCard) => {
    const updated = watchlist.map(c =>
      c.name === card.name ? { ...c, hidden: !c.hidden } : c
    );
    await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: updated });
  };

  const deleteCard = async (name: string) => {
    if (!confirm(`Remove "${name}" from the watchlist?`)) return;
    const updated = watchlist.filter(c => c.name !== name);
    await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: updated });
  };

  const uploadImage = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const name = (form.name ?? 'card').replace(/\s+/g, '-').toLowerCase();
      const sRef = storageRef(storage, `card-images/${name}.${ext}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      setF('image', url);
    } finally {
      setUploading(false);
    }
  };

  const saveCard = async () => {
    if (!form.name?.trim() || !form.type?.trim()) {
      alert('Name and type are required');
      return;
    }
    setSaving(true);
    try {
      const d = getDiscuss(form.discuss);
      const card: WatchlistCard = {
        name: form.name!,
        type: form.type!,
        cat: form.cat ?? 'combo',
        discuss: (d.en || d.fr) ? d : '',
        hidden: form.hidden ?? false,
        dateAdded: form.dateAdded ?? today(),
        ...(form.image ? { image: form.image } : {}),
      };
      let updated: WatchlistCard[];
      if (view.mode === 'new') {
        updated = [...watchlist, card];
      } else {
        updated = watchlist.map(c => c.name === (view as { mode: 'edit'; card: WatchlistCard }).card.name ? card : c);
      }
      await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: updated });
      backToList();
    } catch (err) {
      console.error('Failed to save watchlist card:', err);
      alert('Save failed — check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading watchlist…</div>;

  /* ── LIST VIEW ── */
  if (view.mode === 'list') {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h1 className="admin-page-title">Watchlist Editor</h1>
          <button className="admin-btn-primary" onClick={openNew}>+ Add Card</button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}></th>
              <th>Name / Type</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(card => (
              <tr key={card.name} style={{ opacity: card.hidden ? 0.45 : 1 }}>
                <td>
                  <img
                    className="admin-ban-thumb"
                    src={card.image ?? `/images/cards/${card.name.replace(/\s+/g, '-').toLowerCase()}.jpg`}
                    alt={card.name}
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card.name)}&format=image&version=small`;
                    }}
                  />
                </td>
                <td>
                  <strong>{card.name}</strong><br />
                  <small style={{ color: 'var(--muted)' }}>{card.type}</small>
                </td>
                <td>{card.cat}</td>
                <td>{card.dateAdded ?? '—'}</td>
                <td>
                  <button
                    className={`admin-btn-sm${card.hidden ? ' danger' : ''}`}
                    onClick={() => toggleHidden(card)}
                    title={card.hidden ? 'Hidden — click to show' : 'Visible — click to hide'}
                  >
                    {card.hidden ? 'Hidden' : 'Visible'}
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-btn-sm" onClick={() => openEdit(card)}>Edit</button>
                    <button className="admin-btn-sm danger" onClick={() => deleteCard(card.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── FORM VIEW (new / edit) ── */
  const isNew = view.mode === 'new';
  const discuss = getDiscuss(form.discuss);
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <button className="admin-btn-sm" onClick={backToList}>← Back</button>
        <h1 className="admin-page-title">{isNew ? 'Add Watchlist Card' : `Edit: ${form.name}`}</h1>
      </div>

      <div className="admin-card-form">
        {/* Aside: image + upload */}
        <aside className="admin-card-form-aside">
          <img
            className="admin-card-img-preview"
            src={
              form.image
                ? form.image
                : form.name
                  ? `/images/cards/${form.name.replace(/\s+/g, '-').toLowerCase()}.jpg`
                  : '/images/cards/placeholder.jpg'
            }
            alt={form.name ?? ''}
            onError={e => {
              if (form.name) {
                (e.target as HTMLImageElement).src =
                  `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(form.name)}&format=image&version=normal`;
              }
            }}
          />
          <input
            className="admin-input"
            placeholder="Image URL (optional)"
            value={form.image ?? ''}
            onChange={e => setF('image', e.target.value || undefined)}
          />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadImage} />
          <button className="admin-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload Image'}
          </button>

          <label className="admin-card-hidden-toggle">
            <input type="checkbox" checked={form.hidden ?? false} onChange={e => setF('hidden', e.target.checked)} />
            Hide from public list
          </label>
        </aside>

        {/* Main fields */}
        <div className="admin-card-form-fields">
          <div className="admin-field-row">
            <label>Name *</label>
            <input className="admin-input" value={form.name ?? ''} onChange={e => setF('name', e.target.value)} />
          </div>
          <div className="admin-field-row">
            <label>Type *</label>
            <input className="admin-input" placeholder="e.g. Instant" value={form.type ?? ''} onChange={e => setF('type', e.target.value)} />
          </div>
          <div className="admin-field-row">
            <label>Category</label>
            <select className="admin-input" value={form.cat ?? 'combo'} onChange={e => setF('cat', e.target.value)}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field-row">
            <label>Date Added</label>
            <input className="admin-input" type="date" value={form.dateAdded ?? today()} onChange={e => setF('dateAdded', e.target.value)} />
          </div>
          <div className="admin-field-row">
            <label>Discussion Note (EN)</label>
            <textarea className="admin-input" rows={5}
              value={discuss.en}
              onChange={e => setDiscuss('en', e.target.value)}
              placeholder="Discussion note in English" />
          </div>
          <div className="admin-field-row">
            <label>Discussion Note (FR)</label>
            <textarea className="admin-input" rows={5}
              value={discuss.fr}
              onChange={e => setDiscuss('fr', e.target.value)}
              placeholder="Note de discussion en français" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="admin-btn-primary" onClick={saveCard} disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Add to Watchlist' : 'Save Changes'}
            </button>
            <button className="admin-btn-sm" onClick={backToList}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

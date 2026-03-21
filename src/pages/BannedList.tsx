import { useState, useCallback } from 'react';
import { useLang } from '../contexts/LangContext';
import { useBannedCards } from '../hooks/useBannedCards';
import { PageParticles } from '../components/Particles';
import type { BannedCard, WatchlistCard } from '../data/banned-cards.seed';

// ── Data ──────────────────────────────────────────────────────────────────

const BAN_PHILOSOPHY = [
  { en: 'Magic\'s diversity of playstyles is a strength — the ban list exists to address <strong>genuine imbalance</strong>, not to eliminate strategies that some players simply dislike.', fr: 'La diversité des styles de jeu de Magic est une force — la liste de bannissement existe pour remédier aux <strong>véritables déséquilibres</strong>, et non pour éliminer des stratégies que certains joueurs n\'aiment tout simplement pas.' },
  { en: 'The ban list is a <strong>living tool, not a permanent verdict</strong> — cards can be added or removed as the meta and community feedback evolves.', fr: 'La liste de bannissement est un <strong>outil évolutif, pas un verdict permanent</strong> — des cartes peuvent être ajoutées ou retirées selon l\'évolution de la méta et des retours de la communauté.' },
  { en: 'The goal is to <strong>maximise the number of viable decks</strong> and encourage a varied meta, while keeping the format competitive and accessible.', fr: 'L\'objectif est de <strong>maximiser le nombre de decks viables</strong> et d\'encourager une méta variée, tout en maintenant le format compétitif et accessible.' },
];

const BAN_CRITERIA = [
  { en: 'Cards that force everyone to build around them, homogenizing the meta', fr: 'Cartes qui forcent tout le monde à construire autour d\'elles, homogénéisant la méta' },
  { en: 'Cards whose cost is too low relative to their actual impact', fr: 'Cartes dont le coût est trop faible par rapport à leur impact réel' },
  { en: 'Cards enabling combos too fast or with insufficient mana investment', fr: 'Cartes permettant des combos trop rapides ou avec un investissement de mana insuffisant' },
  { en: 'Cards too oppressive against reasonably or minimally optimized decks', fr: 'Cartes trop oppressives contre des decks raisonnablement ou minimalement optimisés' },
  { en: 'Cards that exploit 2HG\'s high shared life totals disproportionately', fr: 'Cartes qui exploitent de manière disproportionnée les totaux de vie élevés du 2TG' },
  { en: 'Cards that stall, drag out, or make games unresolvable within one hour — mass land destruction and highly random effects that remove agency are incompatible with the format\'s structure', fr: 'Cartes qui bloquent, prolongent ou rendent les parties irrésolvables en une heure — la destruction de terres en masse et les effets très aléatoires qui suppriment l\'initiative sont incompatibles avec la structure du format' },
];

const ET_MANIFESTO = {
  prosTitle: { en: 'Why They\'re Great Cards', fr: 'Pourquoi ce sont de Bonnes Cartes' },
  pros: [
    { en: 'In solo Commander, extra turns require <strong>real mana investment</strong>, reward careful setup, and remain answerable — a legitimate expression of blue\'s identity.', fr: 'En Commander solo, les tours supplémentaires nécessitent un <strong>véritable investissement de mana</strong>, récompensent une préparation minutieuse et restent contrables — une expression légitime de l\'identité bleue.' },
    { en: 'The design space — protecting a planeswalker, clocking an opponent, resolving a combo — is <strong>valid, skillful gameplay</strong> in their native formats.', fr: 'L\'espace de conception — protéger un planeswalker, faire pression sur un adversaire, résoudre un combo — représente un <strong>gameplay valide et habile</strong> dans leurs formats natifs.' },
  ],
  consTitle: { en: 'Why They\'re Banned Here', fr: 'Pourquoi Ils Sont Bannis Ici' },
  cons: [
    { en: 'In Two-Headed Commander, one extra turn is <strong>two players untapping simultaneously</strong> — the power doubles with no increase in cost.', fr: 'Dans Two-Headed Commander, un tour supplémentaire représente <strong>deux joueurs se dégageant simultanément</strong> — la puissance double sans augmentation du coût.' },
    { en: 'Turn chains are a <strong>degenerate, unfun win pattern</strong> — the opposing team sits idle while two players loop turns with no meaningful interaction possible.', fr: 'Les chaînes de tours sont un <strong>schéma de victoire dégénéré et frustrant</strong> — l\'équipe adverse reste inactive pendant que deux joueurs enchaînent les tours sans interaction significative possible.' },
  ],
  verdict: { en: 'The format rewards <strong>board-present, decisive wins</strong>. Every extra turn card is banned not for individual power level — but because the entire category produces gameplay that undermines what makes Two-Headed Commander worth playing.', fr: 'Le format récompense les <strong>victoires décisives et présentes sur le plateau</strong>. Chaque carte de tour supplémentaire est bannie non pas pour son niveau de puissance individuel — mais parce que toute la catégorie produit un gameplay qui compromet ce qui rend Two-Headed Commander valable à jouer.' },
};

const FILTER_BUTTONS = [
  { filter: 'all',              label: { en: 'All',                 fr: 'Tout'                   } },
  { filter: 'banned-commander', label: { en: 'Banned as Commander', fr: 'Banni comme commandant' } },
  { filter: 'tutor',            label: { en: 'Tutors',              fr: 'Tuteurs'                } },
  { filter: 'fast-mana',        label: { en: 'Fast Mana',           fr: 'Mana Rapide'            } },
  { filter: 'big-life',         label: { en: 'Big Life Total',      fr: 'Grand Total de Vie'     } },
  { filter: 'life-manip',       label: { en: 'Life Manipulation',   fr: 'Manipulation de Vie'    } },
  { filter: 'combo',            label: { en: 'Combo',               fr: 'Combo'                  } },
  { filter: 'hard-stax',        label: { en: 'Hard Stax',           fr: 'Hard Stax'              } },
  { filter: 'misc',             label: { en: 'Misc',                fr: 'Divers'                 } },
  { filter: 'commander',        label: { en: 'Commander Ban',       fr: 'Banni en Commander'     } },
];

const ORIGIN_FR: Record<string, string> = {
  'Banned — 2HC specific': 'Banni — spécifique 2HC',
  'Banned in 2HC': 'Banni en 2HC',
  'Banned — 2HG specific': 'Banni — spécifique 2TG',
  'Banned — EDH banned list': 'Banni — liste officielle EDH',
  'Banned — alt win condition': 'Banni — condition de victoire alternative',
  'Banned — alternate win condition': 'Banni — condition de victoire alternative',
  'Banned — combo enabler': 'Banni — facilitateur de combo',
  'Banned — combo tutor': 'Banni — recherche de combo',
  'Banned — combo win condition': 'Banni — condition de victoire par combo',
  'Banned — control combo': 'Banni — combo de contrôle',
  "Banned — council's dilemma": "Banni — dilemme du conseil",
  'Banned — draw engine': 'Banni — moteur de pioche',
  'Banned — extra turns (see manifesto)': 'Banni — tours supplémentaires (voir manifeste)',
  'Banned — fast mana': 'Banni — mana rapide',
  'Banned — fast mana / infinite combo': 'Banni — mana rapide / combo infini',
  'Banned — free cheat': 'Banni — déploiement gratuit',
  'Banned — free mana counter': 'Banni — contre-sort à mana gratuit',
  'Banned — free spell cheat': 'Banni — lancement gratuit de sort',
  'Banned — free tutor': 'Banni — recherche gratuite',
  'Banned — game-winning threat': 'Banni — menace décisive',
  'Banned — infinite combo': 'Banni — combo infini',
  'Banned — infinite mana': 'Banni — mana infini',
  'Banned — instant win combo': 'Banni — combo de victoire instantanée',
  'Banned — library cheat': 'Banni — mise en jeu depuis la bibliothèque',
  'Banned — library mill combo': 'Banni — combo de défausse de bibliothèque',
  'Banned — life drain': 'Banni — drainage de points de vie',
  'Banned — lock combo': 'Banni — combo de verrouillage',
  'Banned — mana/life combo': 'Banni — combo mana/vie',
  'Banned — targeted life halving': 'Banni — réduction ciblée des points de vie',
  'Banned — tutor': 'Banni — recherche',
};

const PILL_KEY: Record<string, string> = {
  'pill-edh': 'pill.edh', 'pill-2hg': 'pill.2hg', 'pill-both': 'pill.both',
  'pill-2hc': 'pill.2hc', 'pill-new': 'pill.new',
};

function localImg(name: string) {
  return '/images/cards/' + name.replace(/[^a-zA-Z0-9\-_' ]/g, '_').replace(/\s+/g, '_') + '.jpg';
}

function scryfallImg(name: string) {
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&version=normal`;
}

function scryfallLink(name: string) {
  return `https://scryfall.com/search?q=!${encodeURIComponent('"' + name + '"')}`;
}

// ── Card Modal ─────────────────────────────────────────────────────────────

interface ModalState {
  card: BannedCard | WatchlistCard;
  isWatchlist: boolean;
}

function CardModal({ state, onClose, T, L, lang }: { state: ModalState; onClose: () => void; T: (k: string) => string; L: (f: any) => string; lang: string }) {
  const { card, isWatchlist } = state;
  const bc = card as BannedCard;

  return (
    <div id="card-modal" className="open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <button id="modal-close" aria-label="Close" onClick={onClose}>✕</button>
        <div className="modal-img-wrap">
          <img
            id="modal-img"
            src={localImg(card.name)}
            alt={card.name}
            onError={e => { const img = e.currentTarget; img.src = scryfallImg(card.name); img.onerror = null; }}
          />
        </div>
        <div className="modal-info">
          <div id="modal-name">{card.name}</div>
          <div id="modal-type">{card.type}</div>
          {isWatchlist ? (
            <span id="modal-pill" className="ban-pill pill-watch">{T('pill.watch')}</span>
          ) : (
            <>
              <span id="modal-pill" className={`ban-pill ${bc.pill}`}>{T(PILL_KEY[bc.pill] ?? 'pill.edh')}</span>
            </>
          )}
          <hr className="modal-divider" />
          {isWatchlist && (card as WatchlistCard).discuss ? (
            <>
              <div id="modal-why-label" className="ban-why-label">{T('modal.discuss-note')}</div>
              <p id="modal-why" className="ban-why">{L((card as WatchlistCard).discuss)}</p>
            </>
          ) : !isWatchlist && bc.reason ? (
            <>
              <div id="modal-why-label" className="ban-why-label">{T('modal.ban-reason')}</div>
              <p id="modal-why" className="ban-why">{L(bc.reason)}</p>
            </>
          ) : null}
          <div className="ban-footer">
            {!isWatchlist && bc.origin && (
              <span id="modal-origin" className="ban-origin">
                {lang === 'fr' && ORIGIN_FR[bc.origin] ? ORIGIN_FR[bc.origin] : bc.origin}
              </span>
            )}
            <a id="modal-scryfall" className="modal-scryfall-link" href={scryfallLink(card.name)} target="_blank" rel="noopener noreferrer">
              {T('modal.scryfall')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card tile ──────────────────────────────────────────────────────────────

function CardTile({ card, isWatchlist, onClick, T }: { card: BannedCard | WatchlistCard; isWatchlist: boolean; onClick: () => void; T: (k: string) => string }) {
  const bc = card as BannedCard;
  const pillLabel = isWatchlist ? T('pill.watch') : T(PILL_KEY[bc.pill] ?? 'pill.edh');
  const pillClass = isWatchlist ? 'pill-watch' : bc.pill;

  return (
    <div
      className={`ban-card${!isWatchlist && bc.cat === 'banned-commander' ? ' cmdr-ban' : ''}${isWatchlist ? ' watch-card' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="ban-card-img-wrap">
        <img
          className="ban-card-img"
          src={localImg(card.name)}
          alt={card.name}
          loading="lazy"
          onError={e => {
            const img = e.currentTarget;
            img.src = scryfallImg(card.name);
            img.onerror = () => img.closest('.ban-card-img-wrap')?.classList.add('img-error');
          }}
        />
        <div className="ban-card-overlay">
          <span className={`ban-pill ${pillClass}`}>{pillLabel}</span>
        </div>
      </div>
      <div className="ban-card-label">{card.name}</div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function BannedList() {
  const { T, L, lang } = useLang();
  const { cards, watchlist, loading } = useBannedCards();
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [etOpen, setEtOpen]     = useState(false);
  const [modal, setModal]       = useState<ModalState | null>(null);

  const openModal = useCallback((card: BannedCard | WatchlistCard, isWatchlist: boolean) => {
    setModal({ card, isWatchlist });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    document.body.style.overflow = '';
  }, []);

  // cards excluding extra-turn (shown separately in manifesto)
  const displayCards = cards.filter(c => c.cat !== 'extra-turn' && !c.hidden);
  const etCards      = cards.filter(c => c.cat === 'extra-turn' && !c.hidden);

  const visible = displayCards.filter(c =>
    (filter === 'all' || c.cat === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text2)' }}>Loading…</div>;

  return (
    <>
      <PageParticles />

      {modal && <CardModal state={modal} onClose={closeModal} T={T} L={L} lang={lang} />}

      <section id="banned">
        <div className="container">
          <div className="sec-label">{T('sec.banned-label')}</div>
          <h2 className="sec-title">{T('sec.banned-title')}</h2>

          <div className="skip-to-cards-wrap">
            <button className="skip-to-cards-btn" onClick={() => document.getElementById('card-grid-anchor')?.scrollIntoView({ behavior: 'smooth' })}>{T('btn.skip-cards')}</button>
            <button className="skip-to-cards-btn" onClick={() => document.getElementById('watchlist')?.scrollIntoView({ behavior: 'smooth' })}>{T('btn.skip-watchlist')}</button>
          </div>

          {/* Ban philosophy */}
          <div id="manifesto" className="ban-philosophy">
            <div className="manifesto-header">
              <div className="manifesto-icon">⚖</div>
              <div>
                <div className="manifesto-heading">{T('sec.manifesto-title')}</div>
                <div className="manifesto-sub">{T('sec.manifesto-sub')}</div>
              </div>
            </div>
            <div className="ban-phil-body">
              <div className="ban-phil-principles">
                {BAN_PHILOSOPHY.map((p, i) => <p key={i} className="ban-phil-text" dangerouslySetInnerHTML={{ __html: L(p) }} />)}
              </div>
              <div>
                <div className="ban-criteria-title">{T('sec.criteria-title')}</div>
                <ol className="ban-criteria-list">
                  {BAN_CRITERIA.map((c, i) => <li key={i}>{L(c)}</li>)}
                </ol>
              </div>
            </div>
          </div>

          {/* Extra turns manifesto */}
          <div className="extraturn-manifesto">
            <div className="manifesto-header">
              <div className="manifesto-icon">⏳</div>
              <div>
                <div className="manifesto-heading">{T('sec.et-title')}</div>
                <div className="manifesto-sub">{T('sec.et-sub')}</div>
              </div>
            </div>
            <div className="manifesto-body">
              <div>
                <div className="manifesto-col-title green">{L(ET_MANIFESTO.prosTitle)}</div>
                {ET_MANIFESTO.pros.map((p, i) => (
                  <div key={i} className="manifesto-point">
                    <span className="manifesto-bullet">✦</span>
                    <p className="manifesto-text" dangerouslySetInnerHTML={{ __html: L(p) }} />
                  </div>
                ))}
              </div>
              <div>
                <div className="manifesto-col-title red">{L(ET_MANIFESTO.consTitle)}</div>
                {ET_MANIFESTO.cons.map((c, i) => (
                  <div key={i} className="manifesto-point">
                    <span className="manifesto-bullet">✖</span>
                    <p className="manifesto-text" dangerouslySetInnerHTML={{ __html: L(c) }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="manifesto-footer">
              <p className="manifesto-verdict" dangerouslySetInnerHTML={{ __html: L(ET_MANIFESTO.verdict) }} />
            </div>
            <div className="et-toggle-wrap">
              <button className="et-toggle-btn" onClick={() => setEtOpen(o => !o)}>
                {etOpen ? T('btn.et-hide') : T('btn.et-show')}
              </button>
              {etOpen && (
                <div className="et-card-list">
                  {etCards.map(c => <span key={c.name} className="et-card-name">{c.name}</span>)}
                </div>
              )}
            </div>
          </div>

          {/* Filters + grid */}
          <div id="card-grid-anchor" />
          <div className="filter-row">
            {FILTER_BUTTONS.map(b => (
              <button key={b.filter} className={`filt${filter === b.filter ? ' on' : ''}`} onClick={() => setFilter(b.filter)}>
                {L(b.label)}
              </button>
            ))}
          </div>
          <div className="search-row">
            <input type="text" id="card-search" placeholder={T('search.placeholder')} value={search} onChange={e => setSearch(e.target.value)} autoComplete="off" />
          </div>
          <p className="ban-count">
            {T('ban.showing')} <span>{visible.length}</span> {T('ban.of')} <span>{displayCards.length}</span> {T('ban.cards')}
          </p>
          <div className="banned-grid">
            {visible.map(card => (
              <CardTile key={card.name} card={card} isWatchlist={false} onClick={() => openModal(card, false)} T={T} />
            ))}
          </div>
        </div>
      </section>

      <section id="watchlist">
        <div className="container">
          <div className="sec-label">{T('sec.watch-label')}</div>
          <h2 className="sec-title">{T('sec.watch-title')}</h2>
          <p className="sec-intro">{T('sec.watch-intro')}</p>
          <div className="banned-grid">
            {watchlist.filter(c => !c.hidden).map(card => (
              <CardTile key={card.name} card={card} isWatchlist onClick={() => openModal(card, true)} T={T} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

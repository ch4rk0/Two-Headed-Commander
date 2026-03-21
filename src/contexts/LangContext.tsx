import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Lang = 'en' | 'fr';

// ── All EN/FR strings (ported from js/i18n.js) ────────────────────────────
const LANG_STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    'nav.how-to-play':    'How to Play',
    'nav.run-event':      'Run an Event',
    'nav.banned':         'Banned List',
    'footer.note':        'This is a fan-made format. Magic: The Gathering is property of Wizards of the Coast. Banned list and rulings may be updated as the format evolves — last updated March 2026.',
    'footer.privacy':     'Privacy Policy',
    'footer.cookies':     'Cookie Settings',
    'hero.desc':          'Two allies. Four commanders. One shared fate.<br>The sovereignty of Commander meets the brotherhood of Two-Headed Giant.',
    'hero.cta':           'Learn the Rules ↓',
    'badge.per-team':     'Per Team',
    'badge.shared-life':  'Shared Life',
    'badge.card-decks':   'Card Decks',
    'badge.commanders':   'Commanders',
    'sec.how-label':      'The Codex',
    'sec.how-title':      'How to Play',
    'sec.diff-label':     'Rule Modifications',
    'sec.diff-title':     'Key Differences',
    'sec.diff-intro':     'Two-Headed Commander is not simply stacking two formats together — specific rules from each parent format are modified, preserved, or replaced.',
    'sec.lgs-label':      'Local Game Store',
    'sec.lgs-title':      'Why Run This Format?',
    'sec.lgs-intro':      'Two-Headed Commander is designed to be LGS-friendly — exciting to spectate, fast to organise, and rewarding for players of all experience levels who want a team experience.',
    'sec.event-title':    'Event Structure',
    'sec.event-sub':      'Recommended LGS Tournament Format',
    'sec.col-how':        'How the Night Runs',
    'sec.col-timing':     'Timing Rules',
    'sec.round-note-lbl': 'Why 50-minute rounds shape the ban list:',
    'sec.banned-label':   'The Forbidden Codex',
    'sec.banned-title':   'Banned Cards',
    'btn.skip-cards':     '↓ Skip to card list',
    'btn.skip-watchlist': '↓ Skip to watchlist',
    'sec.manifesto-title':'Ban Philosophy',
    'sec.manifesto-sub':  'The principles behind every decision on this list',
    'sec.criteria-title': 'Six criteria justify a ban',
    'sec.et-title':       'On Extra Turns: A Format Statement',
    'sec.et-sub':         'Why every extra turn card is banned — as a category',
    'btn.et-show':        'See the banned cards ▾',
    'btn.et-hide':        'Hide banned cards ▴',
    'search.placeholder': 'Search banned cards…',
    'ban.showing':        'Showing',
    'ban.of':             'of',
    'ban.cards':          'banned cards',
    'sec.watch-label':    'Under Discussion',
    'sec.watch-title':    'Watchlist',
    'sec.watch-intro':    'These cards are legal to play but are regularly discussed among the ban committee.',
    'cta.rules-lead':     'Curious about the underlying Two-Headed Giant rules?',
    'cta.rules-btn':      'View Official Two-Headed Giant Rules ↗',
    'cta.wizards-btn':    'Two-Headed Giant on Wizards.com ↗',
    'modal.rules-title':  'Official Two-Headed Giant Rules',
    'modal.rules-source': 'Source: MtG Comprehensive Rules · June 2025',
    'modal.rules-note':   '(Official rules are provided in English only)',
    'modal.ban-reason':   'Why it\'s banned',
    'modal.scryfall':     'View on Scryfall ↗',
    'pill.edh':           'EDH Ban',
    'pill.2hg':           '2HG Ban',
    'pill.both':          'EDH + 2HG',
    'pill.2hc':           '2HC-Specific',
    'pill.new':           'New Ban',
    'pill.watch':         'Watchlist',
    'page.home':          'Two-Headed Commander — 2v2 MTG Format',
    'page.how':           'How to Play — Two-Headed Commander',
    'page.run':           'Run an Event — Two-Headed Commander',
    'page.banned':        'Banned List — Two-Headed Commander',
    'cookie.title':       'Before you explore',
    'cookie.desc':        'We use <strong>Google Analytics</strong> to understand how visitors use this site.',
    'cookie.footer-note': 'You can change your mind at any time via the Cookie Settings link in the footer.',
    'cookie.privacy':     'Read our Privacy Policy →',
    'cookie.reload-alert':'Analytics has already loaded this session. Reload the page to apply your new choice — reload now?',
    'cookie.decline':     'No thanks, decline',
    'cookie.accept':      'Accept analytics',
  },
  fr: {
    'nav.how-to-play':    'Comment Jouer',
    'nav.run-event':      'Organiser un Événement',
    'nav.banned':         'Cartes Bannies',
    'footer.note':        'Ceci est un format créé par des fans. Magic: The Gathering est la propriété de Wizards of the Coast. La liste de bannissement et les règles peuvent évoluer — dernière mise à jour mars 2026.',
    'footer.privacy':     'Politique de Confidentialité',
    'footer.cookies':     'Paramètres des Cookies',
    'hero.desc':          'Deux alliés. Quatre commandants. Un destin commun.<br>La souveraineté du Commander rencontre la fraternité du Géant à Deux Têtes.',
    'hero.cta':           'Apprendre les Règles ↓',
    'badge.per-team':     'Par Équipe',
    'badge.shared-life':  'Points de Vie',
    'badge.card-decks':   'Decks de Cartes',
    'badge.commanders':   'Commandants',
    'sec.how-label':      'Le Codex',
    'sec.how-title':      'Comment Jouer',
    'sec.diff-label':     'Modifications des Règles',
    'sec.diff-title':     'Différences Clés',
    'sec.diff-intro':     'Two-Headed Commander n\'est pas simplement l\'empilement de deux formats — des règles spécifiques de chaque format parent sont modifiées, préservées ou remplacées.',
    'sec.lgs-label':      'Boutique de Jeux',
    'sec.lgs-title':      'Pourquoi Organiser Ce Format ?',
    'sec.lgs-intro':      'Two-Headed Commander est conçu pour être adapté aux boutiques — passionnant à observer, rapide à organiser et gratifiant pour les joueurs de tous niveaux.',
    'sec.event-title':    'Structure de l\'Événement',
    'sec.event-sub':      'Format de Tournoi LGS Recommandé',
    'sec.col-how':        'Déroulement de la Soirée',
    'sec.col-timing':     'Règles de Timing',
    'sec.round-note-lbl': 'Pourquoi les rondes de 50 minutes façonnent la liste de bannissement :',
    'sec.banned-label':   'Le Codex Interdit',
    'sec.banned-title':   'Cartes Bannies',
    'btn.skip-cards':     '↓ Aller à la liste de cartes',
    'btn.skip-watchlist': '↓ Aller à la liste de surveillance',
    'sec.manifesto-title':'Philosophie de Bannissement',
    'sec.manifesto-sub':  'Les principes derrière chaque décision sur cette liste',
    'sec.criteria-title': 'Six critères justifient un bannissement',
    'sec.et-title':       'Sur les Tours Supplémentaires : Une Position du Format',
    'sec.et-sub':         'Pourquoi chaque carte de tour supplémentaire est bannie — en tant que catégorie',
    'btn.et-show':        'Voir les cartes bannies ▾',
    'btn.et-hide':        'Masquer les cartes bannies ▴',
    'search.placeholder': 'Rechercher des cartes bannies…',
    'ban.showing':        'Affichage de',
    'ban.of':             'sur',
    'ban.cards':          'cartes bannies',
    'sec.watch-label':    'En Discussion',
    'sec.watch-title':    'Liste de Surveillance',
    'sec.watch-intro':    'Ces cartes sont légales mais font régulièrement l\'objet de discussions au sein du comité de bannissement.',
    'cta.rules-lead':     'Curieux des règles sous-jacentes du Géant à Deux Têtes ?',
    'cta.rules-btn':      'Voir les Règles Officielles du Géant à Deux Têtes ↗',
    'cta.wizards-btn':    'Géant à Deux Têtes sur Wizards.com ↗',
    'modal.rules-title':  'Règles Officielles du Géant à Deux Têtes',
    'modal.rules-source': 'Source : Règles Complètes de MtG · Juin 2025',
    'modal.rules-note':   '(Les règles officielles sont disponibles en anglais uniquement)',
    'modal.ban-reason':   'Pourquoi c\'est banni',
    'modal.scryfall':     'Voir sur Scryfall ↗',
    'pill.edh':           'Banni EDH',
    'pill.2hg':           'Banni 2HG',
    'pill.both':          'EDH + 2HG',
    'pill.2hc':           'Spécifique 2HC',
    'pill.new':           'Nouveau Banni',
    'pill.watch':         'Surveillance',
    'page.home':          'Two-Headed Commander — Format MTG 2v2',
    'page.how':           'Comment Jouer — Two-Headed Commander',
    'page.run':           'Organiser un Événement — Two-Headed Commander',
    'page.banned':        'Cartes Bannies — Two-Headed Commander',
    'cookie.title':       'Avant de continuer',
    'cookie.desc':        'Nous utilisons <strong>Google Analytics</strong> pour comprendre comment les visiteurs utilisent ce site.',
    'cookie.footer-note': 'Vous pouvez changer d\'avis à tout moment via le lien Paramètres des Cookies dans le pied de page.',
    'cookie.privacy':     'Lire notre Politique de Confidentialité →',
    'cookie.reload-alert':'Les cookies analytiques sont déjà chargés pour cette session. Rechargez la page pour appliquer votre nouveau choix — recharger maintenant ?',
    'cookie.decline':     'Non merci, refuser',
    'cookie.accept':      'Accepter les cookies analytiques',
  },
};

// ── Expose window.T early so cookie-consent.js (loaded before React) can use it
(function exposeWindowT() {
  const lang: Lang = (() => {
    try {
      const s = localStorage.getItem('thc_lang');
      if (s === 'en' || s === 'fr') return s as Lang;
    } catch {}
    return (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  })();
  (window as unknown as Record<string, unknown>).T = (key: string) =>
    LANG_STRINGS[lang]?.[key] ?? LANG_STRINGS.en?.[key] ?? key;
})();

// ─────────────────────────────────────────────────────────────────────────

interface LangContextType {
  lang: Lang;
  T: (key: string) => string;
  L: (field: string | { en: string; fr: string } | undefined | null) => string;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType | null>(null);

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem('thc_lang');
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {}
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('fr') ? 'fr' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('thc_lang', l); } catch {}
    document.documentElement.lang = l;
  }, []);

  const T = useCallback((key: string): string => {
    return LANG_STRINGS[lang]?.[key] ?? LANG_STRINGS.en?.[key] ?? key;
  }, [lang]);

  const L = useCallback((field: string | { en: string; fr: string } | undefined | null): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] ?? field.en ?? '';
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, T, L, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}

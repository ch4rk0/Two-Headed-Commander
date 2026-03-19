/* ════════════════════════════════════════════════════════════════
   i18n.js — language switching (EN / FR)

   HOW IT WORKS
   ────────────
   • window.LANG      current language code ('en' or 'fr')
   • window.T(key)    returns a UI string in the current language
   • window.L(field)  returns the right text from a bilingual field
                      { en: '...', fr: '...' }
   • window.setLang(lang)  switches language, persists to localStorage,
                            re-renders the current page

   This file must be the FIRST script loaded on every page so that
   window.LANG is set before content.js runs.
   ════════════════════════════════════════════════════════════════ */

var LANG_STRINGS = {

  en: {
    /* ── Navigation ──────────────────────────────────────────── */
    'nav.how-to-play':    'How to Play',
    'nav.run-event':      'Run an Event',
    'nav.banned':         'Banned List',

    /* ── Footer ──────────────────────────────────────────────── */
    'footer.note':        'This is a fan-made format. Magic: The Gathering is property of Wizards of the Coast. Banned list and rulings may be updated as the format evolves — last updated March 2026.',
    'footer.privacy':     'Privacy Policy',
    'footer.cookies':     'Cookie Settings',

    /* ── Hero ────────────────────────────────────────────────── */
    'hero.desc':          'Two allies. Four commanders. One shared fate.<br>The sovereignty of Commander meets the brotherhood of Two-Headed Giant.',
    'hero.cta':           'Learn the Rules ↓',
    'badge.per-team':     'Per Team',
    'badge.shared-life':  'Shared Life',
    'badge.card-decks':   'Card Decks',
    'badge.commanders':   'Commanders',

    /* ── How to Play ─────────────────────────────────────────── */
    'sec.how-label':      'The Codex',
    'sec.how-title':      'How to Play',

    /* ── Key Differences ─────────────────────────────────────── */
    'sec.diff-label':     'Rule Modifications',
    'sec.diff-title':     'Key Differences',
    'sec.diff-intro':     'Two-Headed Commander is not simply stacking two formats together — specific rules from each parent format are modified, preserved, or replaced.',

    /* ── LGS / Run an Event ──────────────────────────────────── */
    'sec.lgs-label':      'Local Game Store',
    'sec.lgs-title':      'Why Run This Format?',
    'sec.lgs-intro':      'Two-Headed Commander is designed to be LGS-friendly — exciting to spectate, fast to organise, and rewarding for players of all experience levels who want a team experience.',
    'sec.event-title':    'Event Structure',
    'sec.event-sub':      'Recommended LGS Tournament Format',
    'sec.col-how':        'How the Night Runs',
    'sec.col-timing':     'Timing Rules',
    'sec.round-note-lbl': 'Why 50-minute rounds shape the ban list:',

    /* ── Banned List ─────────────────────────────────────────── */
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

    /* ── Watchlist ───────────────────────────────────────────── */
    'sec.watch-label':    'Under Discussion',
    'sec.watch-title':    'Watchlist',
    'sec.watch-intro':    'These cards are legal to play but are regularly discussed among the ban committee.',

    /* ── Rules CTA & Modal ───────────────────────────────────── */
    'cta.rules-lead':     'Curious about the underlying Two-Headed Giant rules?',
    'cta.rules-btn':      'View Official Two-Headed Giant Rules ↗',
    'cta.wizards-btn':    'Two-Headed Giant on Wizards.com ↗',
    'modal.rules-title':  'Official Two-Headed Giant Rules',
    'modal.rules-source': 'Source: MtG Comprehensive Rules · June 2025',
    'modal.rules-note':   '(Official rules are provided in English only)',

    /* ── Card Modal ──────────────────────────────────────────── */
    'modal.scryfall':     'View on Scryfall ↗',
    'pill.edh':           'EDH Ban',
    'pill.2hg':           '2HG Ban',
    'pill.both':          'EDH + 2HG',
    'pill.2hc':           '2HC-Specific',
    'pill.new':           'New Ban',
    'pill.watch':         'Watchlist',

    /* ── Page titles ─────────────────────────────────────────── */
    'page.home':          'Two-Headed Commander — 2v2 MTG Format',
    'page.how':           'How to Play — Two-Headed Commander',
    'page.run':           'Run an Event — Two-Headed Commander',
    'page.banned':        'Banned List — Two-Headed Commander',

    /* ── Cookie consent ──────────────────────────────────────── */
    'cookie.title':       'Before you explore',
    'cookie.desc':        'We use <strong>Google Analytics</strong> to understand how visitors use this site — which pages are read, how long people stay, and where they come from. No data is collected until you choose to accept.',
    'cookie.footer-note': 'You can change your mind at any time via the <strong>Cookie Settings</strong> link in the footer.',
    'cookie.privacy':     'Read our Privacy Policy →',
    'cookie.decline':     'No thanks, decline',
    'cookie.accept':      'Accept analytics',
    'cookie.reload-alert':'Google Analytics was already loaded this session.\n\nClick OK to reload the page — then decline to stop data collection.',
  },

  fr: {
    /* ── Navigation ──────────────────────────────────────────── */
    'nav.how-to-play':    'Comment Jouer',
    'nav.run-event':      'Organiser un Événement',
    'nav.banned':         'Cartes Bannies',

    /* ── Footer ──────────────────────────────────────────────── */
    'footer.note':        'Ceci est un format créé par des fans. Magic: The Gathering est la propriété de Wizards of the Coast. La liste de bannissement et les règles peuvent évoluer — dernière mise à jour mars 2026.',
    'footer.privacy':     'Politique de Confidentialité',
    'footer.cookies':     'Paramètres des Cookies',

    /* ── Hero ────────────────────────────────────────────────── */
    'hero.desc':          'Deux alliés. Quatre commandants. Un destin commun.<br>La souveraineté du Commander rencontre la fraternité du Géant à Deux Têtes.',
    'hero.cta':           'Apprendre les Règles ↓',
    'badge.per-team':     'Par Équipe',
    'badge.shared-life':  'Points de Vie',
    'badge.card-decks':   'Decks de Cartes',
    'badge.commanders':   'Commandants',

    /* ── How to Play ─────────────────────────────────────────── */
    'sec.how-label':      'Le Codex',
    'sec.how-title':      'Comment Jouer',

    /* ── Key Differences ─────────────────────────────────────── */
    'sec.diff-label':     'Modifications des Règles',
    'sec.diff-title':     'Différences Clés',
    'sec.diff-intro':     'Two-Headed Commander n\'est pas simplement l\'empilement de deux formats — des règles spécifiques de chaque format parent sont modifiées, préservées ou remplacées.',

    /* ── LGS / Run an Event ──────────────────────────────────── */
    'sec.lgs-label':      'Boutique de Jeux',
    'sec.lgs-title':      'Pourquoi Organiser Ce Format ?',
    'sec.lgs-intro':      'Two-Headed Commander est conçu pour être adapté aux boutiques — passionnant à observer, rapide à organiser et gratifiant pour les joueurs de tous niveaux souhaitant une expérience d\'équipe.',
    'sec.event-title':    'Structure de l\'Événement',
    'sec.event-sub':      'Format de Tournoi LGS Recommandé',
    'sec.col-how':        'Déroulement de la Soirée',
    'sec.col-timing':     'Règles de Timing',
    'sec.round-note-lbl': 'Pourquoi les rondes de 50 minutes façonnent la liste de bannissement :',

    /* ── Banned List ─────────────────────────────────────────── */
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

    /* ── Watchlist ───────────────────────────────────────────── */
    'sec.watch-label':    'En Discussion',
    'sec.watch-title':    'Liste de Surveillance',
    'sec.watch-intro':    'Ces cartes sont légales mais font régulièrement l\'objet de discussions au sein du comité de bannissement.',

    /* ── Rules CTA & Modal ───────────────────────────────────── */
    'cta.rules-lead':     'Curieux des règles sous-jacentes du Géant à Deux Têtes ?',
    'cta.rules-btn':      'Voir les Règles Officielles du Géant à Deux Têtes ↗',
    'cta.wizards-btn':    'Géant à Deux Têtes sur Wizards.com ↗',
    'modal.rules-title':  'Règles Officielles du Géant à Deux Têtes',
    'modal.rules-source': 'Source : Règles Complètes de MtG · Juin 2025',
    'modal.rules-note':   '(Les règles officielles sont disponibles en anglais uniquement)',

    /* ── Card Modal ──────────────────────────────────────────── */
    'modal.scryfall':     'Voir sur Scryfall ↗',
    'pill.edh':           'Banni EDH',
    'pill.2hg':           'Banni 2HG',
    'pill.both':          'EDH + 2HG',
    'pill.2hc':           'Spécifique 2HC',
    'pill.new':           'Nouveau Banni',
    'pill.watch':         'Surveillance',

    /* ── Page titles ─────────────────────────────────────────── */
    'page.home':          'Two-Headed Commander — Format MTG 2v2',
    'page.how':           'Comment Jouer — Two-Headed Commander',
    'page.run':           'Organiser un Événement — Two-Headed Commander',
    'page.banned':        'Cartes Bannies — Two-Headed Commander',

    /* ── Cookie consent ──────────────────────────────────────── */
    'cookie.title':       'Avant de continuer',
    'cookie.desc':        'Nous utilisons <strong>Google Analytics</strong> pour comprendre comment les visiteurs utilisent ce site — quelles pages sont lues, combien de temps les gens restent et d\'où ils viennent. Aucune donnée n\'est collectée tant que vous n\'avez pas choisi d\'accepter.',
    'cookie.footer-note': 'Vous pouvez changer d\'avis à tout moment via le lien <strong>Paramètres des Cookies</strong> dans le pied de page.',
    'cookie.privacy':     'Lire notre Politique de Confidentialité →',
    'cookie.decline':     'Non merci, refuser',
    'cookie.accept':      'Accepter les cookies analytiques',
    'cookie.reload-alert':'Google Analytics était déjà chargé pour cette session.\n\nCliquez OK pour recharger la page — puis refusez pour arrêter la collecte de données.',
  },
};

/* ── Language detection ──────────────────────────────────────── */
window.LANG = (function () {
  var stored = null;
  try { stored = localStorage.getItem('thc_lang'); } catch (e) {}
  if (stored === 'en' || stored === 'fr') return stored;
  var browser = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  return browser.startsWith('fr') ? 'fr' : 'en';
}());

/* ── Helpers ─────────────────────────────────────────────────── */

/* T(key) — UI string in current language, falls back to EN */
window.T = function (key) {
  return (LANG_STRINGS[window.LANG] || {})[key] ||
         (LANG_STRINGS.en || {})[key] ||
         key;
};

/* L(field) — pick language from a bilingual object { en, fr }
   If field is a plain string (legacy), returns it unchanged      */
window.L = function (field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[window.LANG] || field.en || '';
};

/* ── Apply translations to static data-i18n elements ─────────── */
function applyTranslations () {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = window.T(el.getAttribute('data-i18n'));
  });
  /* Update html[lang] attribute */
  document.documentElement.lang = window.LANG;
  /* Update toggle button label */
  var btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = window.LANG === 'en' ? 'FR' : 'EN';
}

/* ── Language switch ─────────────────────────────────────────── */
window.setLang = function (lang) {
  window.LANG = lang;
  try { localStorage.setItem('thc_lang', lang); } catch (e) {}
  applyTranslations();
  /* Re-render the current SPA page if the router exposes a hook */
  if (typeof window._rerenderPage === 'function') window._rerenderPage();
};

/* ── DOM ready: inject toggle button + apply translations ──────── */
document.addEventListener('DOMContentLoaded', function () {
  applyTranslations();

  /* Inject the EN/FR toggle as a list item at the end of .nav-links */
  var navLinks = document.querySelector('.nav-links');
  if (navLinks && !document.getElementById('lang-toggle')) {
    var btn = document.createElement('button');
    btn.id        = 'lang-toggle';
    btn.className = 'lang-toggle-btn';
    btn.textContent = window.LANG === 'en' ? 'FR' : 'EN';
    btn.setAttribute('aria-label', 'Switch language / Changer de langue');
    btn.addEventListener('click', function () {
      window.setLang(window.LANG === 'en' ? 'fr' : 'en');
    });
    var li = document.createElement('li');
    li.className = 'nav-lang-item';
    li.appendChild(btn);
    navLinks.appendChild(li);
  }
});

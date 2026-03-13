/* ════════════════════════════════════════════════════════════════
   content.js — all static page text and section rendering
   Edit the data objects below to change any on-page text.
   ════════════════════════════════════════════════════════════════

   SECTIONS
   ────────
   1.  HERO
   2.  HOW TO PLAY
   3.  KEY DIFFERENCES
   4.  LGS / WHY RUN THIS FORMAT
   5.  BANNED LIST  (manifestos + filter UI)
   6.  WATCHLIST

   ════════════════════════════════════════════════════════════════ */


/* ── 1. HERO ─────────────────────────────────────────────────── */

var HERO_BADGES = [
  { num: '2',   label: 'Per Team'    },
  { num: '60',  label: 'Shared Life' },
  { num: '100', label: 'Card Decks'  },
  { num: '4',   label: 'Commanders'  },
];

function renderHero() {
  var badges = HERO_BADGES.map(function (b, i) {
    return (i > 0 ? '<span class="badge-sep">✦</span>' : '') +
      '<div class="badge-item">' +
        '<span class="badge-number">' + b.num + '</span>' +
        '<span class="badge-label">'  + b.label + '</span>' +
      '</div>';
  }).join('');

  document.querySelector('section.hero').innerHTML =
    '<div class="hero-content">' +
      '<span class="hero-crest">⚔ ⚔</span>' +
      '<h1 class="hero-title">Two-Headed<br><span class="line2">Commander</span></h1>' +
      '<div class="hero-rule-badge">' + badges + '</div>' +
      '<p class="hero-desc">Two allies. Four commanders. One shared fate.<br>The sovereignty of Commander meets the brotherhood of Two-Headed Giant.</p>' +
      '<a href="how-to-play.html" class="hero-cta">Learn the Rules ↓</a>' +
    '</div>';
}


/* ── 2. HOW TO PLAY ──────────────────────────────────────────── */

var HOW_TO_PLAY_STEPS = [
  {
    num: 'I',
    title: 'Form Your Alliance',
    text: 'Two players form a team. Each player builds their own <strong>100-card Commander deck</strong>, following standard Commander singleton rules — one copy of each card (except basic lands), built around a chosen legendary creature as their Commander.',
    callout: '✦ Each teammate selects their own Commander independently',
  },
  {
    num: 'II',
    title: 'Shared Life Total',
    text: 'Each team begins with a <strong>shared life total of 60</strong>, following Two-Headed Giant rules. All damage dealt to either player reduces this shared pool. Life gain by either teammate increases the shared total.',
    callout: '✦ Poison counters are also shared — 15 poison = team defeat',
  },
  {
    num: 'III',
    title: 'Simultaneous Turns',
    text: 'Both teammates <strong>take their turn simultaneously</strong>. The team shares a single combat phase — both players may attack and both draw during their draw step. Each player maintains their own mana pool and hand.',
    callout: '✦ Only the second team draw on their first turn',
  },
  {
    num: 'IV',
    title: 'Commander Rules Remain',
    text: 'All standard Commander rules apply: the <strong>commander tax</strong> (+2 per prior casting) applies per commander individually, and <strong>commander damage</strong> is tracked per-commander per player (21 combat damage from one commander eliminates that player\'s team).',
    callout: '✦ Color identity rules still apply to each deck separately',
  },
  {
    num: 'V',
    title: 'Winning &amp; Losing',
    text: 'A team loses when their <strong>shared life total reaches 0</strong>, when either player receives 21 commander damage from a single commander, when either player accumulates 15 or more poison counters, or when either player must draw from an empty library. Teams win and lose together.',
  },
];

function renderHowToPlay() {
  var steps = HOW_TO_PLAY_STEPS.map(function (s) {
    return '<div class="step">' +
      '<div class="step-num">' + s.num + '</div>' +
      '<div class="step-content">' +
        '<div class="step-title">' + s.title + '</div>' +
        '<p class="step-text">' + s.text + '</p>' +
        (s.callout ? '<span class="step-callout">' + s.callout + '</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  document.getElementById('how').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">The Codex</div>' +
      '<h2 class="sec-title">How to Play</h2>' +
      '<p class="sec-intro">Two-Headed Commander fuses the singleton deckbuilding and legendary commanders of EDH with the cooperative, simultaneous-turn structure of Two-Headed Giant.</p>' +
      '<div class="steps">' + steps + '</div>' +
    '</div>';
}


/* ── 3. KEY DIFFERENCES ──────────────────────────────────────── */

var KEY_DIFFERENCES = [
  {
    color: 'purple', icon: '🛡',
    title: 'Shared Life: 60, Not 30',
    text: 'Standard 2HG uses 30 life per team. Here, teams start at <strong>60 life</strong> to accommodate Commander\'s longer, more complex games and prevent aggro from ending games before commanders hit the table.',
    tag: 'Modified from 2HG', tagClass: 'tag-modified',
  },
  {
    color: 'gold', icon: '👑',
    title: 'Four Commanders, Four Threats',
    text: 'Each player controls their own Commander. Opponents must track and respond to <strong>two separate commanders</strong> per team. Synergistic commander pairs — one threat, one support — are the heart of the format\'s strategy.',
    tag: 'New to this format', tagClass: 'tag-new',
  },
  {
    color: 'red', icon: '⚡',
    title: 'No Mana Sharing',
    text: 'Players <strong>do not share mana pools</strong>. Each player taps their own lands and uses their own mana. This prevents degenerate pooling interactions while preserving individual deck identity.',
    tag: 'Modified from 2HG', tagClass: 'tag-modified',
  },
  {
    color: 'teal', icon: '🤝',
    title: 'Open Communication',
    text: 'Teammates may freely discuss strategy, show each other their hands, and coordinate plays openly. There is no hidden information between allies — secrets are only kept from opponents.',
    tag: 'Inherited from 2HG', tagClass: 'tag-same',
  },
  {
    color: 'purple', icon: '☠',
    title: 'Infect &amp; Poison',
    text: 'Poison counters are tracked per-team. At <strong>15 poison counters</strong> (scaled from the standard 10) the team loses — adjusted to match the higher life total of this format.',
    tag: 'Modified from 2HG', tagClass: 'tag-modified',
  },
  {
    color: 'gold', icon: '🎯',
    title: 'Targeting Restrictions',
    text: 'You cannot target your teammate with harmful spells but <strong>can</strong> target them with beneficial effects. "Each opponent" deals damage to each opposing player but only reduces the shared life total once per damage source.',
    tag: 'Inherited from 2HG', tagClass: 'tag-same',
  },
];

function renderDifferences() {
  var cards = KEY_DIFFERENCES.map(function (d) {
    return '<div class="diff-card ' + d.color + '">' +
      '<span class="diff-icon">' + d.icon + '</span>' +
      '<div class="diff-title">' + d.title + '</div>' +
      '<p class="diff-text">' + d.text + '</p>' +
      '<span class="diff-tag ' + d.tagClass + '">' + d.tag + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('differences').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">Rule Modifications</div>' +
      '<h2 class="sec-title">Key Differences</h2>' +
      '<p class="sec-intro">Two-Headed Commander is not simply stacking two formats together — specific rules from each parent format are modified, preserved, or replaced.</p>' +
      '<div class="diff-grid">' + cards + '</div>' +
    '</div>';
}


/* ── 4. LGS / WHY RUN THIS FORMAT ───────────────────────────── */

var LGS_TILES = [
  {
    icon: '🎲',
    title: 'Built-in Socialising',
    text: 'Random team assignments every event mean players regularly partner with someone new. The 10-minute deck selection window becomes a high-energy moment of discovery — two strangers rapidly figuring out which of their decks synergise best.',
  },
  {
    icon: '⏱',
    title: 'Predictable Round Times',
    text: 'Hard 1-hour rounds with 3 extra turns then draw keep the event on schedule. Games rarely approach the time limit since both formats incentivise decisive play — teams that drag the game out risk the clock as much as opponents.',
  },
  {
    icon: '🃏',
    title: 'Two Decks Per Player',
    text: 'Each player registers two decks and chooses one after teams are announced. This rewards both collection breadth and format knowledge — knowing when to pivot from your go-wide deck to your combo deck based on your partner\'s list is a real skill.',
  },
  {
    icon: '🏆',
    title: 'Competitive with Heart',
    text: 'Three rounds of best-of-one keeps the night tight and the energy high. Because teams are randomised, strong players carry weaker ones and everyone contributes — reducing the gap between competitive and casual players in a way 1v1 events rarely achieve.',
  },
  {
    icon: '🔧',
    title: 'Curated for Fairness',
    text: 'The ban list specifically removes cards that create degenerate loops, lock games down indefinitely, or produce wins through attrition rather than board presence. Players are rewarded for building efficient, proactive decks — not prison strategies.',
  },
  {
    icon: '✨',
    title: 'Memorable Moments',
    text: 'Two commanders in play at once means twice the legendary synergy, twice the unexpected interactions, and twice the stories to tell. Team victories feel earned and shared — Commander\'s social magic amplified by partnership.',
  },
  {
    icon: '💰',
    title: 'Budget Friendly by Design',
    text: 'Most of the expensive cards that are staples in cEDH are banned in this format. Players compete on equal footing without needing to invest in the priciest cards in the game — a well-built budget deck can win the whole event.',
  },
];

var EVENT_STEPS = [
  'Players register <strong>two legal decks</strong> before the event begins. Both decks must comply with the Two-Headed Commander banned list.',
  '<strong>Teams are randomly assigned</strong> at the start of the event. Neither player knows their partner until the draw — fostering new connections every event.',
  'Teammates have <strong>10 minutes</strong> to discuss both of their registered decks and choose which one each player will pilot for the night. Once selected, the deck cannot be changed between rounds.',
  'Play <strong>3 rounds</strong> of Swiss pairings. Teams are matched against randomly selected opponents each round — there is no intentional draw or concession for seeding.',
  'At the end of 3 rounds, the team with the best record wins. Tiebreakers are resolved by total game wins, then life total differential at time.',
];

var TIMING_ROWS = [
  { label: 'Team Reveal &amp; Deck Selection',     value: '10 min'      },
  { label: 'Round Duration (Hard Limit)',           value: '60 min'      },
  { label: 'Extra Turns After Time Called',         value: '3 turns'     },
  { label: 'Result if No Winner After Extra Turns', value: 'Draw'        },
  { label: 'Rounds Per Event',                      value: '3 rounds'    },
  { label: 'Format',                                value: 'Best of One' },
];

var ROUND_NOTE = 'The time constraint removes hard stax, mass land destruction, and other slow-attrition strategies from the competitive space. A deck that wins by locking opponents out of mana for 45 minutes doesn\'t produce a result before the clock — so those strategies were removed from the format entirely. Players are rewarded for building toward a <em>decisive, board-based win</em>, not a prolonged prison.';

function renderLgs() {
  var tiles = LGS_TILES.map(function (t) {
    return '<div class="lgs-card">' +
      '<span class="lgs-icon">' + t.icon + '</span>' +
      '<div class="lgs-title">' + t.title + '</div>' +
      '<p class="lgs-text">' + t.text + '</p>' +
    '</div>';
  }).join('');

  var eventSteps = EVENT_STEPS.map(function (text, i) {
    return '<div class="event-step">' +
      '<div class="event-step-num">' + (i + 1) + '</div>' +
      '<p class="event-step-text">' + text + '</p>' +
    '</div>';
  }).join('');

  var timingRows = TIMING_ROWS.map(function (r) {
    return '<div class="timing-row">' +
      '<span class="timing-label">' + r.label + '</span>' +
      '<span class="timing-value">' + r.value + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('lgs').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">Local Game Store</div>' +
      '<h2 class="sec-title">Why Run This Format?</h2>' +
      '<p class="sec-intro">Two-Headed Commander is designed to be LGS-friendly — exciting to spectate, fast to organise, and rewarding for players of all experience levels who want a team experience.</p>' +
      '<div class="lgs-grid">' + tiles + '</div>' +
      '<div class="event-block">' +
        '<div class="event-header">' +
          '<div class="event-header-icon">📋</div>' +
          '<div>' +
            '<div class="event-header-title">Event Structure</div>' +
            '<div class="event-header-sub">Recommended LGS Tournament Format</div>' +
          '</div>' +
        '</div>' +
        '<div class="event-body">' +
          '<div>' +
            '<div class="event-col-title">How the Night Runs</div>' +
            '<div class="event-steps">' + eventSteps + '</div>' +
          '</div>' +
          '<div>' +
            '<div class="event-col-title">Timing Rules</div>' +
            '<div class="timing-grid">' + timingRows + '</div>' +
            '<div class="round-note"><strong>Why 1-hour rounds shape the ban list:</strong> ' + ROUND_NOTE + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


/* ── 5. BANNED LIST ──────────────────────────────────────────── */

var BAN_PHILOSOPHY = [
  'Magic\'s diversity of playstyles is a strength — the ban list exists to address <strong>genuine imbalance</strong>, not to eliminate strategies that some players simply dislike.',
  'The ban list is a <strong>living tool, not a permanent verdict</strong> — cards can be added or removed as the meta and community feedback evolves.',
  'The goal is to <strong>maximise the number of viable decks</strong> and encourage a varied meta, while keeping the format competitive and accessible.',
];

var BAN_CRITERIA = [
  'Cards that force everyone to build around them, homogenizing the meta',
  'Cards whose cost is too low relative to their actual impact',
  'Cards enabling combos too fast or with insufficient mana investment',
  'Cards too oppressive against reasonably or minimally optimized decks',
  'Cards that exploit 2HG\'s high shared life totals disproportionately',
  'Cards that stall, drag out, or make games unresolvable within one hour — mass land destruction and highly random effects that remove agency are incompatible with the format\'s structure',
];

var EXTRA_TURN_MANIFESTO = {
  prosTitle: 'Why They\'re Great Cards',
  pros: [
    'In solo Commander, extra turns require <strong>real mana investment</strong>, reward careful setup, and remain answerable — a legitimate expression of blue\'s identity.',
    'The design space — protecting a planeswalker, clocking an opponent, resolving a combo — is <strong>valid, skillful gameplay</strong> in their native formats.',
  ],
  consTitle: 'Why They\'re Banned Here',
  cons: [
    'In Two-Headed Commander, one extra turn is <strong>two players untapping simultaneously</strong> — the power doubles with no increase in cost.',
    'Turn chains are a <strong>degenerate, unfun win pattern</strong> — the opposing team sits idle while two players loop turns with no meaningful interaction possible.',
  ],
  verdict: 'The format rewards <strong>board-present, decisive wins</strong>. Every extra turn card is banned not for individual power level — but because the entire category produces gameplay that undermines what makes Two-Headed Commander worth playing.',
};

var FILTER_BUTTONS = [
  { filter: 'all',              label: 'All',                active: true },
  { filter: 'banned-commander', label: 'Banned as Commander'              },
  { filter: 'extra-turn',       label: 'Extra Turns'                      },
  { filter: 'tutor',            label: 'Tutors'                           },
  { filter: 'fast-mana',        label: 'Fast Mana'                        },
  { filter: 'big-life',         label: 'Big Life Total'                   },
  { filter: 'life-manip',       label: 'Life Manipulation'                },
  { filter: 'combo',            label: 'Combo'                            },
  { filter: 'hard-stax',        label: 'Hard Stax'                        },
  { filter: 'misc',             label: 'Misc'                             },
  { filter: 'official',         label: 'Official'                         },
];

function renderBanned() {
  var philosophy = BAN_PHILOSOPHY.map(function (p) {
    return '<p class="ban-phil-text">' + p + '</p>';
  }).join('');

  var criteria = BAN_CRITERIA.map(function (c) {
    return '<li>' + c + '</li>';
  }).join('');

  var pros = EXTRA_TURN_MANIFESTO.pros.map(function (p) {
    return '<div class="manifesto-point"><span class="manifesto-bullet">✦</span><p class="manifesto-text">' + p + '</p></div>';
  }).join('');

  var cons = EXTRA_TURN_MANIFESTO.cons.map(function (p) {
    return '<div class="manifesto-point"><span class="manifesto-bullet">✖</span><p class="manifesto-text">' + p + '</p></div>';
  }).join('');

  var filterBtns = FILTER_BUTTONS.map(function (b) {
    return '<button class="filt' + (b.active ? ' on' : '') + '" data-filter="' + b.filter + '">' + b.label + '</button>';
  }).join('');

  document.getElementById('banned').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">The Forbidden Codex</div>' +
      '<h2 class="sec-title">Banned Cards</h2>' +
      '<p class="sec-intro">These cards are forbidden in Two-Headed Commander. The ban source reflects whether the restriction originates in Commander, Two-Headed Giant, or is unique to this format\'s cooperative dynamics.</p>' +

      '<div id="manifesto" class="ban-philosophy">' +
        '<div class="manifesto-header">' +
          '<div class="manifesto-icon">⚖</div>' +
          '<div>' +
            '<div class="manifesto-heading">Ban Philosophy</div>' +
            '<div class="manifesto-sub">The principles behind every decision on this list</div>' +
          '</div>' +
        '</div>' +
        '<div class="ban-phil-body">' +
          '<div class="ban-phil-principles">' + philosophy + '</div>' +
          '<div>' +
            '<div class="ban-criteria-title">Six criteria justify a ban</div>' +
            '<ol class="ban-criteria-list">' + criteria + '</ol>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="extraturn-manifesto">' +
        '<div class="manifesto-header">' +
          '<div class="manifesto-icon">⏳</div>' +
          '<div>' +
            '<div class="manifesto-heading">On Extra Turns: A Format Statement</div>' +
            '<div class="manifesto-sub">Why every extra turn card is banned — as a category</div>' +
          '</div>' +
        '</div>' +
        '<div class="manifesto-body">' +
          '<div><div class="manifesto-col-title green">' + EXTRA_TURN_MANIFESTO.prosTitle + '</div>' + pros + '</div>' +
          '<div><div class="manifesto-col-title red">'   + EXTRA_TURN_MANIFESTO.consTitle + '</div>' + cons + '</div>' +
        '</div>' +
        '<div class="manifesto-footer">' +
          '<p class="manifesto-verdict">' + EXTRA_TURN_MANIFESTO.verdict + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="filter-row">' + filterBtns + '</div>' +
      '<div class="search-row"><input type="text" id="card-search" placeholder="Search banned cards…" autocomplete="off"></div>' +
      '<p class="ban-count">Showing <span id="visible-count">0</span> of <span id="total-count">0</span> banned cards</p>' +
      '<div class="banned-grid" id="banned-grid"></div>' +
    '</div>';
}


/* ── 6. WATCHLIST ────────────────────────────────────────────── */

function renderWatchlistSection() {
  document.getElementById('watchlist').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">Under Discussion</div>' +
      '<h2 class="sec-title">Watchlist</h2>' +
      '<p class="sec-intro">These cards are legal to play but are being actively reviewed by the format committee. They may be added to the ban list in a future update.</p>' +
      '<div class="watch-notice">' +
        '<p>Watchlisted cards can still be played at your events. Click any card to read why it\'s being discussed. This list reflects ongoing community conversation, not final rulings.</p>' +
      '</div>' +
      '<div class="banned-grid" id="watchlist-grid"></div>' +
    '</div>';
}

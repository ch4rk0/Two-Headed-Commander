/* ════════════════════════════════════════════════════════════════
   content.js — all static page text and section rendering
   Edit the data objects below to change any on-page text.
   ════════════════════════════════════════════════════════════════

   SECTIONS
   ────────
   1.  HERO
   2.  HOW TO PLAY
   3.  KEY DIFFERENCES
   4.  TWO-HEADED GIANT FOUNDATION
   5.  LGS / WHY RUN THIS FORMAT
   6.  BANNED LIST  (manifestos + filter UI)
   7.  WATCHLIST

   ════════════════════════════════════════════════════════════════ */


/* ── 1. HERO ─────────────────────────────────────────────────── */

var HERO_BADGES = [
  { num: '2',   key: 'badge.per-team'   },
  { num: '60',  key: 'badge.shared-life'},
  { num: '100', key: 'badge.card-decks' },
  { num: '4',   key: 'badge.commanders' },
];

function renderHero() {
  var badges = HERO_BADGES.map(function (b, i) {
    return (i > 0 ? '<span class="badge-sep">✦</span>' : '') +
      '<div class="badge-item">' +
        '<span class="badge-number">' + b.num + '</span>' +
        '<span class="badge-label">'  + T(b.key) + '</span>' +
      '</div>';
  }).join('');

  document.querySelector('section.hero').innerHTML =
    '<div class="hero-content">' +
      '<h1 class="hero-title">Two-Headed<br><span class="line2">Commander</span></h1>' +
      '<div class="hero-rule-badge">' + badges + '</div>' +
      '<p class="hero-desc">' + T('hero.desc') + '</p>' +
      '<a href="how-to-play.html" class="hero-cta">' + T('hero.cta') + '</a>' +
    '</div>';
}


/* ── 2. HOW TO PLAY ──────────────────────────────────────────── */

var HOW_TO_PLAY_STEPS = [
  {
    num: 'I',
    title: { en: 'Form Your Alliance', fr: 'Formez Votre Alliance' },
    text: {
      en: 'Two players form a team. Each player builds their own <strong>100-card Commander deck</strong>, following standard Commander singleton rules — one copy of each card (except basic lands), built around a chosen legendary creature as their Commander.',
      fr: 'Deux joueurs forment une équipe. Chaque joueur construit son propre <strong>deck Commander de 100 cartes</strong>, en suivant les règles Commander standard — une copie de chaque carte (sauf les terres de base), construite autour d\'une créature légendaire choisie comme commandant.',
    },
    callout: {
      en: '✦ Each teammate selects their own Commander independently',
      fr: '✦ Chaque coéquipier choisit son propre commandant indépendamment',
    },
  },
  {
    num: 'II',
    title: { en: 'Shared Life Total', fr: 'Total de Vie Partagé' },
    text: {
      en: 'Each team begins with a <strong>shared life total of 60</strong>, following Two-Headed Giant rules. All damage dealt to either player reduces this shared pool. Life gain by either teammate increases the shared total.',
      fr: 'Chaque équipe commence avec un <strong>total de vie partagé de 60</strong>, conformément aux règles du Géant à Deux Têtes. Tous les dégâts infligés à l\'un ou l\'autre joueur réduisent ce total commun. Les gains de vie d\'un coéquipier augmentent le total partagé.',
    },
    callout: {
      en: '✦ Poison counters are tracked per player — the team loses when either player reaches 15',
      fr: '✦ Les marqueurs poison sont comptés par joueur — l\'équipe perd lorsqu\'un joueur atteint 15',
    },
  },
  {
    num: 'III',
    title: { en: 'Simultaneous Turns', fr: 'Tours Simultanés' },
    text: {
      en: 'Both teammates <strong>take their turn simultaneously</strong>. The team shares a single combat phase — both players may attack and both draw during their draw step. Each player maintains their own mana pool and hand.',
      fr: 'Les deux coéquipiers <strong>jouent leur tour simultanément</strong>. L\'équipe partage une seule phase de combat — les deux joueurs peuvent attaquer et les deux piochent durant leur phase de pioche. Chaque joueur gère sa propre réserve de mana et sa main.',
    },
    callout: {
      en: '✦ Starting team skip their draw on their first turn',
      fr: '✦ L\'équipe qui commence passe sa pioche au premier tour',
    },
  },
  {
    num: 'IV',
    title: { en: 'Commander Rules Remain', fr: 'Les Règles Commander S\'Appliquent' },
    text: {
      en: 'All standard Commander rules apply: the <strong>commander tax</strong> (+2 per prior casting) applies per commander individually, and <strong>commander damage</strong> is tracked per-commander per player (21 combat damage from one commander eliminates that player\'s team).',
      fr: 'Toutes les règles Commander standard s\'appliquent : la <strong>taxe de commandant</strong> (+2 par lancement précédent) s\'applique par commandant individuellement, et les <strong>dégâts de commandant</strong> sont suivis par commandant par joueur (21 dégâts de combat d\'un même commandant élimine l\'équipe de ce joueur).',
    },
    callout: {
      en: '✦ Color identity rules still apply to each deck separately',
      fr: '✦ Les règles d\'identité de couleur s\'appliquent à chaque deck séparément',
    },
  },
  {
    num: 'V',
    title: { en: 'Winning &amp; Losing', fr: 'Victoire &amp; Défaite' },
    text: {
      en: 'A team loses when their <strong>shared life total reaches 0</strong>, when either player receives 21 commander damage from a single commander, when either player accumulates 15 or more poison counters, or when either player must draw from an empty library. Teams win and lose together.',
      fr: 'Une équipe perd lorsque son <strong>total de vie partagé atteint 0</strong>, lorsqu\'un joueur reçoit 21 dégâts de commandant d\'un seul commandant, lorsqu\'un joueur accumule 15 marqueurs poison ou plus, ou lorsqu\'un joueur doit piocher depuis une bibliothèque vide. Les équipes gagnent et perdent ensemble.',
    },
  },
];

function renderHowToPlay() {
  var steps = HOW_TO_PLAY_STEPS.map(function (s) {
    return '<div class="step">' +
      '<div class="step-num">' + s.num + '</div>' +
      '<div class="step-content">' +
        '<div class="step-title">' + L(s.title) + '</div>' +
        '<p class="step-text">' + L(s.text) + '</p>' +
        (s.callout ? '<span class="step-callout">' + L(s.callout) + '</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  document.getElementById('how').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">' + T('sec.how-label') + '</div>' +
      '<h2 class="sec-title">' + T('sec.how-title') + '</h2>' +
      '<div class="steps">' + steps + '</div>' +
    '</div>';
}


/* ── 3. KEY DIFFERENCES ──────────────────────────────────────── */

var KEY_DIFFERENCES = [
  {
    color: 'purple',
    title: { en: 'Shared Life: 60, Not 30', fr: 'Vie Partagée : 60, Pas 30' },
    text: {
      en: 'Standard 2HG uses 30 life per team. Here, teams start at <strong>60 life</strong> to accommodate Commander\'s longer, more complex games and prevent aggro from ending games before commanders hit the table.',
      fr: 'Le 2TG standard utilise 30 points de vie par équipe. Ici, les équipes commencent à <strong>60 points de vie</strong> pour s\'adapter aux parties Commander plus longues et complexes, et éviter que l\'agressivité termine les parties avant que les commandants n\'entrent en jeu.',
    },
    tag: { en: 'Modified from 2HG', fr: 'Modifié du 2TG' }, tagClass: 'tag-modified',
  },
  {
    color: 'gold',
    title: { en: 'Four Commanders, Four Threats', fr: 'Quatre Commandants, Quatre Menaces' },
    text: {
      en: 'Each player controls their own Commander. Opponents must track and respond to <strong>two separate commanders</strong> per team. Synergistic commander pairs — one threat, one support — are the heart of the format\'s strategy.',
      fr: 'Chaque joueur contrôle son propre commandant. Les adversaires doivent surveiller et répondre à <strong>deux commandants distincts</strong> par équipe. Les duos de commandants synergiques — une menace, un soutien — sont au cœur de la stratégie du format.',
    },
    tag: { en: 'New to this format', fr: 'Nouveau dans ce format' }, tagClass: 'tag-new',
  },
  {
    color: 'teal',
    title: { en: 'Open Communication', fr: 'Communication Ouverte' },
    text: {
      en: 'Teammates may freely discuss strategy, show each other their hands, and coordinate plays openly. There is no hidden information between allies — secrets are only kept from opponents.',
      fr: 'Les coéquipiers peuvent librement discuter de stratégie, se montrer leurs mains et coordonner leurs actions ouvertement. Il n\'y a pas d\'information cachée entre alliés — les secrets ne sont gardés que des adversaires.',
    },
    tag: { en: 'Inherited from 2HG', fr: 'Hérité du 2TG' }, tagClass: 'tag-same',
  },
  {
    color: 'purple',
    title: { en: 'Infect &amp; Poison', fr: 'Infecter &amp; Poison' },
    text: {
      en: 'Poison counters are tracked <strong>per player</strong>, not shared. A team loses when <strong>either</strong> player accumulates 15 or more poison counters — scaled up from the standard 10 to match the higher life total of this format.',
      fr: 'Les marqueurs poison sont comptés <strong>par joueur</strong>, pas en commun. Une équipe perd lorsque <strong>l\'un des</strong> joueurs accumule 15 marqueurs poison ou plus — augmenté du seuil standard de 10 pour correspondre au total de vie plus élevé de ce format.',
    },
    tag: { en: 'Inherited from 2HG', fr: 'Hérité du 2TG' }, tagClass: 'tag-same',
  },
];

function renderDifferences() {
  var cards = KEY_DIFFERENCES.map(function (d) {
    return '<div class="diff-card ' + d.color + '">' +
      '<div class="diff-title">' + L(d.title) + '</div>' +
      '<p class="diff-text">' + L(d.text) + '</p>' +
      '<span class="diff-tag ' + d.tagClass + '">' + L(d.tag) + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('differences').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">' + T('sec.diff-label') + '</div>' +
      '<h2 class="sec-title">' + T('sec.diff-title') + '</h2>' +
      '<p class="sec-intro">' + T('sec.diff-intro') + '</p>' +
      '<div class="diff-grid">' + cards + '</div>' +
    '</div>';
}


/* ── 4. TWO-HEADED GIANT OFFICIAL RULES ──────────────────────── */
/* Verbatim from MtG Comprehensive Rules, June 6 2025 edition    */

var TWO_HG_OFFICIAL_RULES = [
  {
    title: 'Overview',
    subs: [{ entries: [
      { type: 'text', text: 'Two-Headed Giant (THG) is a multiplayer variant of Magic: The Gathering in which two teams of two players compete against each other. The variant introduces fundamental rule changes: shared life totals, shared turns, unique combat rules, and team-based win/loss conditions. All rules below are extracted directly from the June 6, 2025 edition of the Magic: The Gathering Comprehensive Rules.' },
    ]}],
  },
  {
    title: '1. Game Setup',
    subs: [
      { title: '1.1 Teams and Seating', entries: [
        { type: 'rule', ref: '810.1', text: 'Two-Headed Giant games are played with two teams of two players each.' },
        { type: 'rule', ref: '810.3', text: 'Each team sits together on one side of the table. Each team decides the order in which its players sit.' },
      ]},
      { title: '1.2 Deck Construction — Limited Play', entries: [
        { type: 'rule', ref: '100.4c', text: 'In limited play involving the Two-Headed Giant multiplayer variant, all cards in a team\'s card pool but not in either player\'s deck are in that team\'s sideboard.' },
      ]},
      { title: '1.3 Starting Life Total', entries: [
        { type: 'rule', ref: '810.4',  text: 'Each team has a shared life total, which starts at 30 life.' },
        { type: 'rule', ref: '103.4a', text: 'In a Two-Headed Giant game, each team\'s starting life total is 30.' },
        { type: 'rule', ref: '119.1a', text: 'In a Two-Headed Giant game, each team\'s starting life total is 30. See rule 810, "Two-Headed Giant Variant."' },
      ]},
      { title: '1.4 Shared Team Turns', entries: [
        { type: 'rule', ref: '810.2',  text: 'The Two-Headed Giant variant uses the shared team turns option. (See rule 805.)' },
        { type: 'rule', ref: '805.1',  text: 'Some multiplayer games between teams use the shared team turns option. It\'s always used in the Two-Headed Giant variant (see rule 810) and the Archenemy casual variant (see rule 904). It can be used only if the members of each team are sitting in adjacent seats.' },
        { type: 'rule', ref: '805.2',  text: 'Within each team, the player seated in the rightmost seat from that team\'s perspective is the primary player. If the players on a team can\'t agree on a choice, such as which creatures attack or what order triggered abilities are put on the stack, the primary player makes that choice.' },
        { type: 'rule', ref: '805.4',  text: 'Each team takes turns rather than each player.' },
        { type: 'rule', ref: '805.4a', text: 'The team whose turn it is is the active team. Each other team is a nonactive team.' },
        { type: 'rule', ref: '805.4b', text: 'Each player on a team draws a card during that team\'s draw step.' },
        { type: 'rule', ref: '805.4c', text: 'Each player on a team may play a land during each of that team\'s turns.' },
        { type: 'rule', ref: '805.5',  text: 'Teams have priority, not individual players.' },
        { type: 'rule', ref: '805.5a', text: 'A player may cast a spell, activate an ability, or take a special action when their team has priority.' },
      ]},
      { title: '1.5 First Turn', entries: [
        { type: 'rule', ref: '810.6',  text: 'The team who plays first skips the draw step of its first turn.' },
        { type: 'rule', ref: '103.8b', text: 'In a Two-Headed Giant game, the team who plays first skips the draw step of their first turn.' },
        { type: 'rule', ref: '800.7',  text: 'In a multiplayer game other than a Two-Headed Giant game, the starting player doesn\'t skip the draw step of their first turn. In a Two-Headed Giant game, the team who plays first skips the draw step of their first turn. See rule 103.8.' },
      ]},
    ],
  },
  {
    title: '2. Team Resources and Shared Elements',
    subs: [
      { entries: [
        { type: 'rule', ref: '810.5', text: 'With the exception of life total and poison counters, a team\'s resources (cards in hand, mana, and so on) are not shared in the Two-Headed Giant variant. Teammates may review each other\'s hands and discuss strategies at any time. Teammates can\'t manipulate each other\'s cards or permanents.' },
        { type: 'note', text: 'In summary: life totals and poison counters are shared; all other resources (hand, mana, permanents) belong to individual players.' },
      ]},
      { title: '2.1 Drawing Cards', entries: [
        { type: 'rule', ref: '121.2d', text: 'If more than one player is instructed to draw cards in a game that\'s using the shared team turns option (such as a Two-Headed Giant game), first each player on the active team, in whatever order that team likes, performs their draws, then each player on each nonactive team in turn order does the same.' },
      ]},
    ],
  },
  {
    title: '3. Life Totals',
    subs: [
      { entries: [
        { type: 'rule',    ref: '810.9', text: 'Damage, loss of life, and gaining life happen to each player individually. The result is applied to the team\'s shared life total.' },
        { type: 'example', text: 'A player casts Flame Rift, which reads, "Flame Rift deals 4 damage to each player." Each team is dealt a total of 8 damage.' },
      ]},
      { title: '3.1 Individual Life Total References', entries: [
        { type: 'rule',    ref: '810.9a', text: 'If a cost or effect needs to know the value of an individual player\'s life total, that cost or effect uses the team\'s life total instead.' },
        { type: 'example', text: 'A player on a team that has 17 life is targeted by Beacon of Immortality ("Double target player\'s life total"). That player gains 17 life, so the team winds up at 34 life.' },
        { type: 'example', text: 'A player controls Test of Endurance ("At the beginning of your upkeep, if you have 50 or more life, you win the game"). The team wins the game if their team\'s life total is 50 or more.' },
        { type: 'example', text: 'A player on a team that has 11 life controls Lurking Evil ("Pay half your life, rounded up: Lurking Evil becomes a 4/4 Horror creature with flying"). That player must pay 6 life. The team winds up at 5 life.' },
      ]},
      { title: '3.2 Paying Life', entries: [
        { type: 'rule', ref: '119.4a', text: 'If a cost or effect allows a player to pay an amount of life greater than 0 in a Two-Headed Giant game, the player may do so only if their team\'s life total is greater than or equal to the total amount of life both team members are paying for that cost or effect. If a player pays life, the payment is subtracted from their team\'s life total.' },
        { type: 'rule', ref: '810.9b', text: 'If a cost or effect allows both members of a team to pay life simultaneously, the total amount of life they pay may not exceed their team\'s life total. (Players can always pay 0 life.)' },
      ]},
      { title: '3.3 Setting Life Totals', entries: [
        { type: 'rule',    ref: '810.9c', text: 'If an effect sets a single player\'s life total to a specific number, the player gains or loses the necessary amount of life to end up with the new total. The team\'s life total is adjusted by the amount of life that player gained or lost.' },
        { type: 'example', text: 'A player on a team that has 25 life is targeted by an ability that reads, "Target player\'s life total becomes 10." That player\'s life total is considered to be 25, so that player loses 15 life. The team winds up at 10 life.' },
        { type: 'rule',    ref: '810.9d', text: 'If an effect would set the life total of each player on a team to a number, that team chooses one of its members. On that team, only that player is affected.' },
        { type: 'example', text: 'One team has 7 life and the other has 13 life. A player casts Repay in Kind ("Each player\'s life total becomes the lowest life total among all players"). Each team chooses one of its members to be affected. The chosen player on the team with 13 life loses 6 life, so that team\'s life total winds up at 7.' },
      ]},
      { title: '3.4 Life Restrictions', entries: [
        { type: 'rule', ref: '810.9e', text: 'A player can\'t exchange life totals with their teammate. If an effect would cause that to occur, the exchange won\'t happen.' },
        { type: 'rule', ref: '810.9f', text: 'If an effect instructs a player to redistribute any number of players\' life totals, that player may not affect more than one member of each team this way.' },
        { type: 'rule', ref: '810.9g', text: 'If an effect says that a player can\'t gain life, no player on that player\'s team can gain life.' },
        { type: 'rule', ref: '810.9h', text: 'If an effect says that a player can\'t lose life, no player on that player\'s team can lose life or pay any amount of life other than 0.' },
      ]},
    ],
  },
  {
    title: '4. Poison Counters',
    subs: [
      { entries: [
        { type: 'rule',   ref: '810.10',  text: 'Effects that cause players to get poison counters happen to each player individually. The poison counters are shared by the team.' },
        { type: 'rule',   ref: '810.10a', text: 'If an effect needs to know how many poison counters an individual player has, that effect uses the number of poison counters that player\'s team has. If an effect needs to know how many poison counters a player\'s opponents have, that effect uses the number of poison counters opposing teams have.' },
        { type: 'rule',   ref: '810.10b', text: 'If an effect says that a player loses poison counters, that player\'s team loses that many poison counters.' },
        { type: 'rule',   ref: '810.10c', text: 'If an effect says that a player can\'t get poison counters, no player on that player\'s team can get poison counters.' },
        { type: 'rule',   ref: '810.10d', text: 'If a rule or effect needs to know what kinds of counters an individual player has, that effect uses the kinds of counters that player has and the kinds of counters that player\'s team has. A player is "poisoned" if that player\'s team has one or more poison counters.' },
        { type: 'change', text: 'Rule 810.10d is updated in 2025 to also account for all counter types on the player (not just poison), and clarifies the "poisoned" definition.' },
      ]},
      { title: '4.1 Proliferate and Poison', entries: [
        { type: 'rule',   ref: '701.34b', text: 'In a Two-Headed Giant game, poison counters are shared by the team. If more than one player on a team is chosen this way, only one of those players can be given an additional poison counter. The player who proliferates chooses which player that is. See rule 810, "Two-Headed Giant Variant."' },
        { type: 'change', text: 'The 2025 Proliferate rule (701.34b) is now more concise and explicitly states only one player per team can receive the additional poison counter when proliferating, replacing the older 701.24c wording.' },
      ]},
    ],
  },
  {
    title: '5. Combat Rules',
    subs: [
      { entries: [
        { type: 'rule',   ref: '810.7', text: 'The Two-Headed Giant variant uses the combat rules for the shared team turns option (see rule 805.10).' },
        { type: 'change', text: 'In the 2025 rules, the detailed THG combat rules have been consolidated into rule 805.10 (Shared Team Turns Option) and are no longer repeated separately under 810.7. This avoids duplication and ensures consistency across all variants using shared team turns.' },
      ]},
      { title: '5.1 Attacking', entries: [
        { type: 'rule',   ref: '805.10a', text: 'Each team\'s creatures attack the other team as a group. During the combat phase, the active team is the attacking team and each player on the active team is an attacking player. Likewise, the nonactive team is the defending team and each player on the nonactive team is a defending player.' },
        { type: 'rule',   ref: '805.10b', text: 'As the declare attackers step begins, the active team declares attackers. For each attacking creature, the attacking team announces which defending player, planeswalker, or battle that creature is attacking. The active team has one combined attack, and that set of attacking creatures must be legal as a whole. See rule 508.1.' },
        { type: 'change', text: 'Rule 805.10b (2025) now includes battles as valid attack targets, reflecting the introduction of the Battle card type. Previously only players and planeswalkers could be attacked.' },
      ]},
      { title: '5.2 "Attacking Player" Reference', entries: [
        { type: 'rule', ref: '805.10c', text: 'Any rule, object, or effect that refers to an "attacking player" refers to one specific attacking player, not to all attacking players. If an ability of a blocking creature refers to an attacking player, or a spell or ability refers to both a blocking creature and an attacking player, then unless otherwise specified, the attacking player it\'s referring to is the player who controls the attacking creature that blocking creature is blocking. If a spell or ability could apply to multiple blocking creatures, the appropriate attacking player is individually determined for each of those blocking creatures. If there are multiple attacking players that could be chosen, the controller of the spell or ability chooses one.' },
      ]},
      { title: '5.3 Blocking', entries: [
        { type: 'rule',   ref: '805.10d', text: 'As the declare blockers step begins, the defending team declares blockers. Creatures controlled by the defending players can block creatures attacking any player on the defending team, attacking a planeswalker controlled by one of those players, or a battle protected by one of those players. The defending team has one combined block, and that set of blocking creatures must be legal as a whole. See rule 509.1.' },
        { type: 'change', text: 'Rule 805.10d (2025) extends blocking eligibility to include creatures attacking battles protected by defending players, in addition to creatures attacking players or their planeswalkers.' },
      ]},
      { title: '5.4 "Defending Player" Reference', entries: [
        { type: 'rule',   ref: '805.10e', text: 'Any rule, object, or effect that refers to a "defending player" refers to one specific defending player, not to all of the defending players. If an ability of an attacking creature refers to a defending player, or a spell or ability refers to both an attacking creature and a defending player, then unless otherwise specified, the defending player it\'s referring to is the player that creature is attacking, the controller of the planeswalker that creature is attacking, or the protector of the battle that creature is attacking. If that creature is no longer attacking, the defending player it\'s referring to is the player/planeswalker controller/battle protector the creature was attacking before it was removed from combat. If there are multiple defending players that could be chosen, the controller of the spell or ability chooses one.' },
        { type: 'change', text: 'The 2025 "defending player" definition (805.10e) is significantly expanded to handle battles and planeswalkers with greater precision, and clarifies behavior when a creature is removed from combat mid-resolution.' },
      ]},
      { title: '5.5 Damage Assignment', entries: [
        { type: 'rule', ref: '805.10f', text: 'As the combat damage step begins, the active team announces how each attacking creature will assign its combat damage. Then the defending team announces how each blocking creature will assign its combat damage. See rule 510.1.' },
      ]},
    ],
  },
  {
    title: '6. Winning and Losing',
    subs: [
      { entries: [
        { type: 'rule', ref: '810.8', text: 'The Two-Headed Giant variant uses the normal rules for winning or losing the game (see rule 104), with the following additions and specifications.' },
      ]},
      { title: '6.1 Team Win/Loss', entries: [
        { type: 'rule',    ref: '810.8a', text: 'Players win and lose the game only as a team, not as individuals. If either player on a team loses the game, the team loses the game. If either player on a team wins the game, the entire team wins the game. If an effect says that a player can\'t win the game, that player\'s team can\'t win the game. If an effect says that a player can\'t lose the game, that player\'s team can\'t lose the game.' },
        { type: 'example', text: 'A player controls Transcendence ("You don\'t lose the game for having 0 or less life"). If that player\'s team\'s life total is 0 or less, that team doesn\'t lose the game.' },
        { type: 'example', text: 'A player attempts to draw a card while there are no cards in that player\'s library. That player loses the game, so that player\'s entire team loses the game.' },
        { type: 'example', text: 'A player controls Platinum Angel ("You can\'t lose the game and your opponents can\'t win the game"). Neither that player nor their teammate can lose the game while Platinum Angel is on the battlefield, and neither player on the opposing team can win the game.' },
      ]},
      { title: '6.2 Conceding', entries: [
        { type: 'rule', ref: '810.8b', text: 'If a player concedes, their team leaves the game immediately. That team loses the game.' },
      ]},
      { title: '6.3 State-Based Loss Conditions', entries: [
        { type: 'rule',   ref: '810.8c', text: 'If a team\'s life total is 0 or less, the team loses the game. (This is a state-based action. See rule 704.)' },
        { type: 'rule',   ref: '810.8d', text: 'If a team has fifteen or more poison counters, that team loses the game. (This is a state-based action. See rule 704.)' },
        { type: 'rule',   ref: '704.6a', text: 'In a Two-Headed Giant game, if a team has 0 or less life, that team loses the game. See rule 810, "Two-Headed Giant Variant."' },
        { type: 'rule',   ref: '704.6b', text: 'In a Two-Headed Giant game, if a team has fifteen or more poison counters, that team loses the game. See rule 810, "Two-Headed Giant Variant."' },
        { type: 'rule',   ref: '704.5c', text: 'If a player has ten or more poison counters, that player loses the game. Ignore this rule in Two-Headed Giant games; see rule 704.6b instead.' },
        { type: 'change', text: 'In the 2025 rules, Two-Headed Giant state-based actions are now housed under rule 704.6 (a new sub-section for variant-specific state-based actions) rather than inline with 704.5.' },
        { type: 'note',   text: 'Note: In standard games a player loses at 10 poison counters. In Two-Headed Giant, the threshold is 15 counters and it applies to the whole team.' },
      ]},
    ],
  },
  {
    title: '7. Two-Headed Giant Planechase',
    subs: [{ entries: [
      { type: 'rule',   ref: '901.12',  text: 'A Two-Headed Giant Planechase game uses all the rules for the Two-Headed Giant multiplayer variant and all the rules for the Planechase casual variant, with the following additions.' },
      { type: 'rule',   ref: '901.12a', text: 'Each player has their own planar deck.' },
      { type: 'rule',   ref: '901.12b', text: 'The planar controller is normally the primary player of the active team. However, if the current planar controller\'s team would leave the game, instead the primary player of the next team in turn order that wouldn\'t leave the game becomes the planar controller, then the old planar controller\'s team leaves the game. The new planar controller retains that designation until they leave the game or a different team becomes the active team, whichever comes first.' },
      { type: 'rule',   ref: '901.12c', text: 'Even though the face-up plane or phenomenon is controlled by just one player, any ability of that plane or phenomenon that refers to "you" applies to both members of the planar controller\'s team.' },
      { type: 'rule',   ref: '901.12d', text: 'Since each member of the active team is an active player, each of them may roll the planar die. Each player\'s cost to roll the planar die is based on the number of times that particular player has already rolled the planar die that turn.' },
      { type: 'change', text: 'Rules 901.12c and 901.12d are new additions in 2025, clarifying "you" references on plane cards and the planar die roll costs per player in THG Planechase games.' },
    ]}],
  },
  {
    title: '8. Archenemy Commander Interaction',
    subs: [{ entries: [
      { type: 'rule',   ref: '904.13b', text: 'The archenemy starts with 60 life. The opposing team has a shared life total that starts at 60 life rather than individual life totals. The use of a shared life total is detailed in rules 810.8 and 810.9 of the Two-Headed Giant variant.' },
      { type: 'rule',   ref: '904.13c', text: 'Poison counters are not shared [in Archenemy Commander]. If the archenemy has ten or more poison counters, they lose the game. If any individual member of the opposing team has ten or more poison counters, they lose the game. (This is a state-based action. See rule 704.)' },
      { type: 'change', text: 'Rule 904.13 (Archenemy Commander Option) is new in 2025. It directly references the Two-Headed Giant shared life total rules (810.8 and 810.9) for the opposing team, but notably does NOT share poison counters (unlike standard THG).' },
    ]}],
  },
  {
    title: '9. Scaling the Variant (Three-Headed Giant and Beyond)',
    subs: [{ entries: [
      { type: 'rule', ref: '810.11', text: 'The Two-Headed Giant variant can also be played with equally sized teams of more than two players. For each player a team has beyond the second, that team\'s starting life total is increased by 15 and the number of poison counters required for the team to lose is increased by five. (These variants are called Three-Headed Giant, Four-Headed Giant, and so on.)' },
    ]}],
  },
  {
    title: '10. Key Glossary Terms',
    subs: [{ entries: [
      { type: 'gloss', term: 'Two-Headed Giant Variant',  text: 'A multiplayer variant played among two-player teams that each have a shared life total and take a simultaneous turn. See rule 810, "Two-Headed Giant Variant."' },
      { type: 'gloss', term: 'Shared Life Total',         text: 'In the Two-Headed Giant multiplayer variant, each team has a "shared life total" rather than each player having an individual life total. See rule 810, "Two-Headed Giant Variant."' },
      { type: 'gloss', term: 'Shared Team Turns Option',  text: 'An option that may be used in certain multiplayer variants, such as Two-Headed Giant and Archenemy. See rule 805, "Shared Team Turns Option."' },
      { type: 'gloss', term: 'Defending Team',            text: 'The team who can be attacked, and whose planeswalkers can be attacked, during the combat phase of a Two-Headed Giant game. See rule 805.10.' },
      { type: 'gloss', term: 'Poisoned',                  text: 'In Two-Headed Giant, a player is "poisoned" if that player\'s team has one or more poison counters. See rule 810.10d.' },
    ]}],
  },
];

function renderRulesModal() {
  var noteHtml = window.LANG === 'fr'
    ? '<p class="rm-lang-note">' + T('modal.rules-note') + '</p>'
    : '';

  var html = noteHtml + TWO_HG_OFFICIAL_RULES.map(function (section) {
    var subsHtml = section.subs.map(function (sub) {
      var entriesHtml = sub.entries.map(function (e) {
        switch (e.type) {
          case 'rule':    return '<div class="rm-rule"><span class="rm-ref">Rule ' + e.ref + ':</span> ' + e.text + '</div>';
          case 'example': return '<div class="rm-example"><span class="rm-ex-label">Example:</span> ' + e.text + '</div>';
          case 'change':  return '<div class="rm-change"><span class="rm-change-label">⚑ 2025 Change:</span> ' + e.text + '</div>';
          case 'note':    return '<div class="rm-note">' + e.text + '</div>';
          case 'text':    return '<p class="rm-text">' + e.text + '</p>';
          case 'gloss':   return '<div class="rm-gloss"><span class="rm-gloss-term">' + e.term + ':</span> ' + e.text + '</div>';
          default: return '';
        }
      }).join('');
      return (sub.title ? '<div class="rm-sub-title">' + sub.title + '</div>' : '') + entriesHtml;
    }).join('');
    return '<div class="rm-section"><div class="rm-section-title">' + section.title + '</div>' + subsHtml + '</div>';
  }).join('');

  document.getElementById('rules-modal-body').innerHTML = html;
}


/* ── 5. LGS / WHY RUN THIS FORMAT ───────────────────────────── */

var LGS_TILES = [
  {
    title: { en: 'Built-in Socialising',   fr: 'Socialisation Intégrée'   },
    image: 'images/lgs/built-in-socialising.jpg',
    text: {
      en: 'Random teams every event. Two strangers get 10 minutes to figure out which of their decks pair best — and walk away with a new connection.',
      fr: 'Des équipes aléatoires à chaque événement. Deux inconnus ont 10 minutes pour déterminer quels decks s\'associent le mieux — et repartent avec une nouvelle connexion.',
    },
  },
  {
    title: { en: 'Timed Rounds',           fr: 'Rondes Chronométrées'     },
    image: 'images/lgs/predictable-round-times.jpeg',
    text: {
      en: 'Hard 50-minute rounds with 3 extra turns then draw keep the night on schedule. Teams that stall risk the clock as much as their opponents.',
      fr: 'Des rondes strictes de 50 minutes avec 3 tours supplémentaires puis match nul maintiennent la soirée dans les délais. Les équipes qui traînent risquent l\'horloge autant que leurs adversaires.',
    },
  },
  {
    title: { en: 'Two Decks Per Player',   fr: 'Deux Decks par Joueur'    },
    image: 'images/lgs/two-decks-per-player.jpg',
    text: {
      en: 'Each player registers two decks and picks one after teams are revealed. Format knowledge and collection depth both matter.',
      fr: 'Chaque joueur enregistre deux decks et en choisit un après la révélation des équipes. La connaissance du format et la profondeur de la collection comptent toutes les deux.',
    },
  },
  {
    title: { en: 'Competitive with Heart', fr: 'Compétitif avec Cœur'     },
    image: 'images/lgs/competitive-with-heart.jpg',
    text: {
      en: 'Three rounds of best-of-one, randomised teams. Strong players lift weaker ones — closing the gap between competitive and casual in ways 1v1 rarely does.',
      fr: 'Trois rondes en partie unique, équipes aléatoires. Les joueurs forts élèvent les plus faibles — comblant l\'écart entre compétitif et casual d\'une façon que le 1v1 fait rarement.',
    },
  },
  {
    title: { en: 'Curated for Fairness',   fr: 'Équilibré pour l\'Équité' },
    image: 'images/lgs/curated-for-fairness.jpg',
    text: {
      en: 'The ban list removes infinite loops, lock strategies, and attrition wins. Proactive, board-based play is rewarded.',
      fr: 'La liste de bannissement supprime les boucles infinies, les stratégies de verrouillage et les victoires par attrition. Le jeu proactif basé sur le plateau est récompensé.',
    },
  },
  {
    title: { en: 'Memorable Moments',      fr: 'Moments Mémorables'       },
    image: 'images/lgs/memorable-moments.jpeg',
    text: {
      en: 'Two commanders in play means twice the synergy and twice the stories. Team victories feel earned and shared.',
      fr: 'Deux commandants en jeu signifient deux fois plus de synergies et deux fois plus d\'histoires. Les victoires d\'équipe se sentent méritées et partagées.',
    },
  },
  {
    title: { en: 'Budget Friendly',        fr: 'Accessible au Budget'     },
    image: 'images/lgs/budget-friendly.jpg',
    text: {
      en: 'Most cEDH staples are banned here. A well-built budget deck can win the whole event.',
      fr: 'La plupart des incontournables cEDH sont bannis ici. Un deck bien construit avec un budget limité peut remporter tout l\'événement.',
    },
  },
];

var EVENT_STEPS = [
  {
    en: 'Players register <strong>two legal decks</strong> before the event begins. Both decks must comply with the Two-Headed Commander banned list.',
    fr: 'Les joueurs enregistrent <strong>deux decks légaux</strong> avant le début de l\'événement. Les deux decks doivent respecter la liste de bannissement de Two-Headed Commander.',
  },
  {
    en: '<strong>Teams are randomly assigned</strong> at the start of the event. Neither player knows their partner until the draw — fostering new connections every event.',
    fr: '<strong>Les équipes sont assignées aléatoirement</strong> au début de l\'événement. Aucun joueur ne connaît son partenaire avant le tirage — favorisant de nouvelles connexions à chaque événement.',
  },
  {
    en: 'Teammates have <strong>10 minutes</strong> to discuss both of their registered decks and choose which one each player will pilot for the night. Once selected, the deck cannot be changed between rounds.',
    fr: 'Les coéquipiers ont <strong>10 minutes</strong> pour discuter de leurs deux decks enregistrés et choisir lequel chaque joueur pilotera pour la soirée. Une fois sélectionné, le deck ne peut pas être changé entre les rondes.',
  },
  {
    en: 'Play <strong>3 rounds</strong> of Swiss pairings. Teams are matched against randomly selected opponents each round — there is no intentional draw or concession for seeding.',
    fr: 'Jouez <strong>3 rondes</strong> en système suisse. Les équipes sont appariées contre des adversaires sélectionnés aléatoirement à chaque ronde — il n\'y a pas de match nul intentionnel ou de concession pour le classement.',
  },
  {
    en: 'At the end of 3 rounds, the team with the best record wins. Tiebreakers are resolved by total game wins, then life total differential at time.',
    fr: 'À la fin des 3 rondes, l\'équipe avec le meilleur bilan remporte l\'événement. Les égalités sont départagées par le nombre total de victoires, puis par le différentiel de points de vie au moment du temps.',
  },
];

var TIMING_ROWS = [
  { label: { en: 'Team Reveal &amp; Deck Selection',     fr: 'Révélation des Équipes &amp; Sélection'  }, value: '10 min'                                    },
  { label: { en: 'Round Duration (Hard Limit)',           fr: 'Durée de Ronde (Limite Stricte)'         }, value: '50 min'                                    },
  { label: { en: 'Extra Turns After Time Called',         fr: 'Tours Supplémentaires Après le Temps'   }, value: { en: '3 turns',     fr: '3 tours'           }},
  { label: { en: 'Result if No Winner After Extra Turns', fr: 'Résultat Sans Gagnant Après les Tours'  }, value: { en: 'Draw',        fr: 'Match nul'         }},
  { label: { en: 'Rounds Per Event',                      fr: 'Rondes par Événement'                   }, value: { en: '3 rounds',    fr: '3 rondes'          }},
  { label: { en: 'Format',                                fr: 'Format'                                 }, value: { en: 'Best of One', fr: 'Partie Unique'     }},
];

var ROUND_NOTE = {
  en: 'The time constraint removes hard stax, mass land destruction, and other slow-attrition strategies from the competitive space. A deck that wins by locking opponents out of mana for 45 minutes doesn\'t produce a result before the clock — so those strategies were removed from the format entirely. Players are rewarded for building toward a <em>decisive, board-based win</em>, not a prolonged prison.',
  fr: 'La contrainte de temps supprime le hard stax, la destruction massive de terrains et autres stratégies d\'attrition lente de l\'espace compétitif. Un deck qui gagne en bloquant les adversaires sans mana pendant 45 minutes ne produit pas de résultat avant l\'horloge — ces stratégies ont donc été retirées du format entièrement. Les joueurs sont récompensés pour avoir construit vers une <em>victoire décisive basée sur le plateau</em>, pas une prison prolongée.',
};

function renderLgs() {
  var tiles = LGS_TILES.map(function (t) {
    var bgStyle = t.image
      ? ' style="background-image: url(\'' + t.image.replace(/'/g, '%27') + '\')"'
      : '';
    return '<div class="lgs-card"' + bgStyle + '>' +
      '<div class="lgs-card-content">' +
        '<div class="lgs-title">' + L(t.title) + '</div>' +
        '<p class="lgs-text">' + L(t.text) + '</p>' +
      '</div>' +
    '</div>';
  }).join('');

  var eventSteps = EVENT_STEPS.map(function (step, i) {
    return '<div class="event-step">' +
      '<div class="event-step-num">' + (i + 1) + '</div>' +
      '<p class="event-step-text">' + L(step) + '</p>' +
    '</div>';
  }).join('');

  var timingRows = TIMING_ROWS.map(function (r) {
    return '<div class="timing-row">' +
      '<span class="timing-label">' + L(r.label) + '</span>' +
      '<span class="timing-value">' + L(r.value) + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('lgs').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">' + T('sec.lgs-label') + '</div>' +
      '<h2 class="sec-title">' + T('sec.lgs-title') + '</h2>' +
      '<p class="sec-intro">' + T('sec.lgs-intro') + '</p>' +
      '<div class="lgs-grid">' + tiles + '</div>' +
      '<div class="event-block">' +
        '<div class="event-header">' +
          '<div>' +
            '<div class="event-header-title">' + T('sec.event-title') + '</div>' +
            '<div class="event-header-sub">' + T('sec.event-sub') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="event-body">' +
          '<div>' +
            '<div class="event-col-title">' + T('sec.col-how') + '</div>' +
            '<div class="event-steps">' + eventSteps + '</div>' +
          '</div>' +
          '<div>' +
            '<div class="event-col-title">' + T('sec.col-timing') + '</div>' +
            '<div class="timing-grid">' + timingRows + '</div>' +
            '<div class="round-note"><strong>' + T('sec.round-note-lbl') + '</strong> ' + L(ROUND_NOTE) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


/* ── 6. BANNED LIST ──────────────────────────────────────────── */

var BAN_PHILOSOPHY = [
  {
    en: 'Magic\'s diversity of playstyles is a strength — the ban list exists to address <strong>genuine imbalance</strong>, not to eliminate strategies that some players simply dislike.',
    fr: 'La diversité des styles de jeu de Magic est une force — la liste de bannissement existe pour remédier aux <strong>véritables déséquilibres</strong>, et non pour éliminer des stratégies que certains joueurs n\'aiment tout simplement pas.',
  },
  {
    en: 'The ban list is a <strong>living tool, not a permanent verdict</strong> — cards can be added or removed as the meta and community feedback evolves.',
    fr: 'La liste de bannissement est un <strong>outil évolutif, pas un verdict permanent</strong> — des cartes peuvent être ajoutées ou retirées selon l\'évolution de la méta et des retours de la communauté.',
  },
  {
    en: 'The goal is to <strong>maximise the number of viable decks</strong> and encourage a varied meta, while keeping the format competitive and accessible.',
    fr: 'L\'objectif est de <strong>maximiser le nombre de decks viables</strong> et d\'encourager une méta variée, tout en maintenant le format compétitif et accessible.',
  },
];

var BAN_CRITERIA = [
  { en: 'Cards that force everyone to build around them, homogenizing the meta',              fr: 'Cartes qui forcent tout le monde à construire autour d\'elles, homogénéisant la méta'            },
  { en: 'Cards whose cost is too low relative to their actual impact',                        fr: 'Cartes dont le coût est trop faible par rapport à leur impact réel'                               },
  { en: 'Cards enabling combos too fast or with insufficient mana investment',                fr: 'Cartes permettant des combos trop rapides ou avec un investissement de mana insuffisant'           },
  { en: 'Cards too oppressive against reasonably or minimally optimized decks',               fr: 'Cartes trop oppressives contre des decks raisonnablement ou minimalement optimisés'               },
  { en: 'Cards that exploit 2HG\'s high shared life totals disproportionately',              fr: 'Cartes qui exploitent de manière disproportionnée les totaux de vie élevés du 2TG'                },
  { en: 'Cards that stall, drag out, or make games unresolvable within one hour — mass land destruction and highly random effects that remove agency are incompatible with the format\'s structure',
    fr: 'Cartes qui bloquent, prolongent ou rendent les parties irrésolvables en une heure — la destruction de terres en masse et les effets très aléatoires qui suppriment l\'initiative sont incompatibles avec la structure du format' },
];

var EXTRA_TURN_MANIFESTO = {
  prosTitle: { en: 'Why They\'re Great Cards', fr: 'Pourquoi ce sont de Bonnes Cartes' },
  pros: [
    {
      en: 'In solo Commander, extra turns require <strong>real mana investment</strong>, reward careful setup, and remain answerable — a legitimate expression of blue\'s identity.',
      fr: 'En Commander solo, les tours supplémentaires nécessitent un <strong>véritable investissement de mana</strong>, récompensent une préparation minutieuse et restent contrables — une expression légitime de l\'identité bleue.',
    },
    {
      en: 'The design space — protecting a planeswalker, clocking an opponent, resolving a combo — is <strong>valid, skillful gameplay</strong> in their native formats.',
      fr: 'L\'espace de conception — protéger un planeswalker, faire pression sur un adversaire, résoudre un combo — représente un <strong>gameplay valide et habile</strong> dans leurs formats natifs.',
    },
  ],
  consTitle: { en: 'Why They\'re Banned Here', fr: 'Pourquoi Ils Sont Bannis Ici' },
  cons: [
    {
      en: 'In Two-Headed Commander, one extra turn is <strong>two players untapping simultaneously</strong> — the power doubles with no increase in cost.',
      fr: 'Dans Two-Headed Commander, un tour supplémentaire représente <strong>deux joueurs se dégageant simultanément</strong> — la puissance double sans augmentation du coût.',
    },
    {
      en: 'Turn chains are a <strong>degenerate, unfun win pattern</strong> — the opposing team sits idle while two players loop turns with no meaningful interaction possible.',
      fr: 'Les chaînes de tours sont un <strong>schéma de victoire dégénéré et frustrant</strong> — l\'équipe adverse reste inactive pendant que deux joueurs enchaînent les tours sans interaction significative possible.',
    },
  ],
  verdict: {
    en: 'The format rewards <strong>board-present, decisive wins</strong>. Every extra turn card is banned not for individual power level — but because the entire category produces gameplay that undermines what makes Two-Headed Commander worth playing.',
    fr: 'Le format récompense les <strong>victoires décisives et présentes sur le plateau</strong>. Chaque carte de tour supplémentaire est bannie non pas pour son niveau de puissance individuel — mais parce que toute la catégorie produit un gameplay qui compromet ce qui rend Two-Headed Commander valable à jouer.',
  },
};

var FILTER_BUTTONS = [
  { filter: 'all',              label: { en: 'All',                 fr: 'Tout'                   }, active: true },
  { filter: 'banned-commander', label: { en: 'Banned as Commander', fr: 'Banni comme commandant' }              },
  { filter: 'tutor',            label: { en: 'Tutors',              fr: 'Tuteurs'                }              },
  { filter: 'fast-mana',        label: { en: 'Fast Mana',           fr: 'Mana Rapide'            }              },
  { filter: 'big-life',         label: { en: 'Big Life Total',      fr: 'Grand Total de Vie'     }              },
  { filter: 'life-manip',       label: { en: 'Life Manipulation',   fr: 'Manipulation de Vie'    }              },
  { filter: 'combo',            label: { en: 'Combo',               fr: 'Combo'                  }              },
  { filter: 'hard-stax',        label: { en: 'Hard Stax',           fr: 'Hard Stax'              }              },
  { filter: 'misc',             label: { en: 'Misc',                fr: 'Divers'                 }              },
  { filter: 'commander',        label: { en: 'Commander Ban',       fr: 'Banni en Commander'     }              },
];

function renderBanned() {
  var philosophy = BAN_PHILOSOPHY.map(function (p) {
    return '<p class="ban-phil-text">' + L(p) + '</p>';
  }).join('');

  var criteria = BAN_CRITERIA.map(function (c) {
    return '<li>' + L(c) + '</li>';
  }).join('');

  var etCards = BANNED_CARDS.filter(function (c) { return c.cat === 'extra-turn'; });
  var etNames = etCards.map(function (c) { return '<span class="et-card-name">' + c.name + '</span>'; }).join('');

  var pros = EXTRA_TURN_MANIFESTO.pros.map(function (p) {
    return '<div class="manifesto-point"><span class="manifesto-bullet">✦</span><p class="manifesto-text">' + L(p) + '</p></div>';
  }).join('');

  var cons = EXTRA_TURN_MANIFESTO.cons.map(function (p) {
    return '<div class="manifesto-point"><span class="manifesto-bullet">✖</span><p class="manifesto-text">' + L(p) + '</p></div>';
  }).join('');

  var filterBtns = FILTER_BUTTONS.map(function (b) {
    return '<button class="filt' + (b.active ? ' on' : '') + '" data-filter="' + b.filter + '">' + L(b.label) + '</button>';
  }).join('');

  document.getElementById('banned').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">' + T('sec.banned-label') + '</div>' +
      '<h2 class="sec-title">' + T('sec.banned-title') + '</h2>' +
      '<div class="skip-to-cards-wrap">' +
        '<button class="skip-to-cards-btn" id="skip-to-cards">' + T('btn.skip-cards') + '</button>' +
        '<button class="skip-to-cards-btn" id="skip-to-watchlist">' + T('btn.skip-watchlist') + '</button>' +
      '</div>' +

      '<div id="manifesto" class="ban-philosophy">' +
        '<div class="manifesto-header">' +
          '<div class="manifesto-icon">⚖</div>' +
          '<div>' +
            '<div class="manifesto-heading">' + T('sec.manifesto-title') + '</div>' +
            '<div class="manifesto-sub">' + T('sec.manifesto-sub') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ban-phil-body">' +
          '<div class="ban-phil-principles">' + philosophy + '</div>' +
          '<div>' +
            '<div class="ban-criteria-title">' + T('sec.criteria-title') + '</div>' +
            '<ol class="ban-criteria-list">' + criteria + '</ol>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="extraturn-manifesto">' +
        '<div class="manifesto-header">' +
          '<div class="manifesto-icon">⏳</div>' +
          '<div>' +
            '<div class="manifesto-heading">' + T('sec.et-title') + '</div>' +
            '<div class="manifesto-sub">' + T('sec.et-sub') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="manifesto-body">' +
          '<div><div class="manifesto-col-title green">' + L(EXTRA_TURN_MANIFESTO.prosTitle) + '</div>' + pros + '</div>' +
          '<div><div class="manifesto-col-title red">'   + L(EXTRA_TURN_MANIFESTO.consTitle) + '</div>' + cons + '</div>' +
        '</div>' +
        '<div class="manifesto-footer">' +
          '<p class="manifesto-verdict">' + L(EXTRA_TURN_MANIFESTO.verdict) + '</p>' +
        '</div>' +
        '<div class="et-toggle-wrap">' +
          '<button class="et-toggle-btn" id="et-toggle">' + T('btn.et-show') + '</button>' +
          '<div class="et-card-list" id="et-card-list">' + etNames + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="filter-row">' + filterBtns + '</div>' +
      '<div class="search-row"><input type="text" id="card-search" placeholder="' + T('search.placeholder') + '" autocomplete="off"></div>' +
      '<p class="ban-count">' + T('ban.showing') + ' <span id="visible-count">0</span> ' + T('ban.of') + ' <span id="total-count">0</span> ' + T('ban.cards') + '</p>' +
      '<div class="banned-grid" id="banned-grid"></div>' +
    '</div>';
}


/* ── 7. WATCHLIST ────────────────────────────────────────────── */

function renderWatchlistSection() {
  document.getElementById('watchlist').innerHTML =
    '<div class="container">' +
      '<div class="sec-label">' + T('sec.watch-label') + '</div>' +
      '<h2 class="sec-title">' + T('sec.watch-title') + '</h2>' +
      '<p class="sec-intro">' + T('sec.watch-intro') + '</p>' +
      '<div class="banned-grid" id="watchlist-grid"></div>' +
    '</div>';
}

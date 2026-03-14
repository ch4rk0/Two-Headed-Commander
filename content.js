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
    callout: '✦ Poison counters are tracked per player — the team loses when either player reaches 15',
  },
  {
    num: 'III',
    title: 'Simultaneous Turns',
    text: 'Both teammates <strong>take their turn simultaneously</strong>. The team shares a single combat phase — both players may attack and both draw during their draw step. Each player maintains their own mana pool and hand.',
    callout: '✦ Starting team skip their draw on their first turn',
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
    text: 'Poison counters are tracked <strong>per player</strong>, not shared. A team loses when <strong>either</strong> player accumulates 15 or more poison counters — scaled up from the standard 10 to match the higher life total of this format.',
    tag: 'Inherited from 2HG', tagClass: 'tag-same',
  },
  {
    color: 'gold', icon: '🎯',
    title: 'Targeting Restrictions',
    text: 'You cannot target your teammate with harmful spells but <strong>can</strong> target them with beneficial effects. A spell dealing damage to "each opponent" deals that damage to <strong>each player</strong> on the opposing team separately — the shared life total is reduced by the full sum.',
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
  var html = TWO_HG_OFFICIAL_RULES.map(function (section) {
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
    icon: '🎲',
    title: 'Built-in Socialising',
    text: 'Random team assignments every event mean players regularly partner with someone new. The 10-minute deck selection window becomes a high-energy moment of discovery — two strangers rapidly figuring out which of their decks synergise best.',
  },
  {
    icon: '⏱',
    title: 'Predictable Round Times',
    text: 'Hard 50 minutes rounds with 3 extra turns then draw keep the event on schedule. Games rarely approach the time limit since both formats incentivise decisive play — teams that drag the game out risk the clock as much as opponents.',
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

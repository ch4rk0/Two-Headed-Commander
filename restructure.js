var fs = require('fs');
var content = fs.readFileSync('C:/Users/Admin/Desktop/files/banned-cards.js', 'utf8');

var match = content.match(/const BANNED_CARDS\s*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) { console.error('Could not find BANNED_CARDS array'); process.exit(1); }

var cards;
try { cards = eval(match[1]); } catch(e) { console.error('Eval error:', e.message); process.exit(1); }

console.log('Loaded', cards.length, 'cards');

// --- Cat mapping ---
// Keys: card name -> new cat
var catMap = {
  // banned-commander
  "Braids, Cabal Minion":          "banned-commander",
  "Emrakul, the Promised End":     "banned-commander",
  "Grim Monolith":                 "banned-commander",
  "Magda, Brazen Outlaw":          "banned-commander",
  "Krark, the Thumbless":          "banned-commander",
  "Sisay, Weatherlight Captain":   "banned-commander",
  "Zur the Enchanter":             "banned-commander",

  // extra-turn (additions to existing extra-turn cards)
  "Seedtime":                      "extra-turn",
  "Emrakul, the Aeons Torn":       "extra-turn",
  // Note: Time Vault was extra-turn, task says keep extra-turn cards... but task also says:
  // "fast-mana: also move Time Vault" - checking the task again...
  // Task says: fast-mana "also move these to fast-mana: ... Time Vault ..."
  "Time Vault":                    "fast-mana",

  // fast-mana (all old "land" cat except Grim Monolith -> banned-commander)
  "Ancient Tomb":                  "fast-mana",
  "Basalt Monolith":               "fast-mana",
  "Chrome Mox":                    "fast-mana",
  "Gaea's Cradle":                 "fast-mana",
  "Lion's Eye Diamond":            "fast-mana",
  "Lotus Petal":                   "fast-mana",
  "Mana Vault":                    "fast-mana",
  "Mishra's Workshop":             "fast-mana",
  "Mox Amber":                     "fast-mana",
  "Mox Diamond":                   "fast-mana",
  "Mox Opal":                      "fast-mana",
  "Sol Ring":                      "fast-mana",
  "Black Lotus":                   "fast-mana",
  "Mox Emerald":                   "fast-mana",
  "Mox Jet":                       "fast-mana",
  "Mox Pearl":                     "fast-mana",
  "Mox Ruby":                      "fast-mana",
  "Mox Sapphire":                  "fast-mana",
  "Jeweled Lotus":                 "fast-mana",
  "Mana Crypt":                    "fast-mana",
  "Tolarian Academy":              "fast-mana",
  "Fastbond":                      "fast-mana",
  "Dockside Extortionist":         "fast-mana",
  "Rofellos, Llanowar Emissary":   "fast-mana",
  "Primeval Titan":                "fast-mana",
  "Channel":                       "fast-mana",
  "Kinnan, Bonder Prodigy":        "fast-mana",
  "Library of Alexandria":         "fast-mana",
  // also from land cat
  "Karakas":                       "fast-mana",  // wait - Karakas is in hard-stax per task
  "Fastbond":                      "fast-mana",
  // land cat extras that aren't mentioned explicitly - keep as fast-mana
  "Nature's Rhythm":               "fast-mana",  // was land
  "Simian Spirit Guide":           "fast-mana",  // was land
  "Elvish Spirit Guide":           "fast-mana",  // was land

  // big-life
  "Ad Nauseam":                    "big-life",
  "Necropotence":                  "big-life",
  "Necrologia":                    "big-life",
  "Necrodominance":                "big-life",
  "Doom Whisperer":                "big-life",
  "Treasonous Ogre":               "big-life",
  "Bolas's Citadel":               "big-life",
  "Yawgmoth's Bargain":            "big-life",
  "Aetherflux Reservoir":          "big-life",
  "Test of Endurance":             "big-life",
  "Felidar Sovereign":             "big-life",

  // life-manip
  "Sorin Markov":                  "life-manip",
  "Magister Sphinx":               "life-manip",
  "Tree of Perdition":             "life-manip",
  "Heartless Hidetsugu":           "life-manip",
  "Scourge of the Skyclaves":      "life-manip",
  "Grievous Wound":                "life-manip",
  "Secret of Bloodbending":        "life-manip",
  "The Lord of Pain":              "life-manip",
  "Biorhythm":                     "life-manip",
  "The Legend of Kuruk":           "life-manip",

  // hard-stax
  "Drannith Magistrate":           "hard-stax",
  "Erayo, Soratami Ascendant":     "hard-stax",
  "Hullbreacher":                  "hard-stax",
  "Leovold, Emissary of Trest":    "hard-stax",
  "Limited Resources":             "hard-stax",
  "Iona, Shield of Emeria":        "hard-stax",
  "Silence":                       "hard-stax",
  "Fierce Guardianship":           "hard-stax",
  "Pact of Negation":              "hard-stax",
  "Deflecting Swat":               "hard-stax",
  "Flamescroll Celebrant":         "hard-stax",
  "Discontinuity":                 "hard-stax",
  "Sensei's Divining Top":         "hard-stax",
  "Worst Fears":                   "hard-stax",
  "Mindslaver":                    "hard-stax",
  "Karakas":                       "hard-stax",
  "Trade Secrets":                 "hard-stax",
  "Grand Arbiter Augustin IV":     "hard-stax",  // was 2hc, fits hard-stax

  // combo
  "Flash":                         "combo",
  "Protean Hulk":                  "combo",
  "Food Chain":                    "combo",
  "Isochron Scepter":              "combo",
  "Underworld Breach":             "combo",
  "Painter's Servant":             "combo",
  "Chain of Smog":                 "combo",
  "Cloud of Faeries":              "combo",
  "Peregrine Drake":               "combo",
  "Thassa's Oracle":               "combo",
  "Walking Ballista":              "combo",
  "Mycosynth Lattice":             "combo",
  "Oath of Druids":                "combo",
  "Mana Drain":                    "combo",
  "Summoner's Pact":               "combo",
  "Dualcaster Mage":               "combo",
  "Nadu, Winged Wisdom":           "combo",
  "Paradox Engine":                "combo",
  "Recurring Nightmare":           "combo",
  "Tinker":                        "combo",
  "Griselbrand":                   "combo",
  "Prophet of Kruphix":            "combo",
  "Upheaval":                      "combo",
  // others in combo section not mentioned specifically
  "Vivi Ornitier":                 "combo",
  "Winota, Joiner of Forces":      "combo",
  "Yuriko, the Tiger's Shadow":    "combo",
  "Jeska's Will":                  "combo",
  "Baral, Chief of Compliance":    "combo",
  "Invasion of Ikoria":            "combo",    // was tutor
  "Transmute Artifact":            "combo",    // was tutor

  // official
  "Chaos Orb":                     "official",
  "Falling Star":                  "official",
  "Shahrazad":                     "official",
  "Lutri, the Spellchaser":        "official",
  "Ancestral Recall":              "official",
  "Balance":                       "official",

  // misc
  "Etali, Primal Conqueror":       "misc",
  "Expropriate":                   "misc",
  "Golos, Tireless Pilgrim":       "misc",
  "Rise of the Eldrazi":           "misc",
  "Sundering Titan":               "misc",
  "Sylvan Primordial":             "misc",
  "Zhulodok, Void Gorger":         "misc",
  "Lost Isle Calling":             "misc",
  "Regenerations Restored":        "misc",
  "The Dominion Bracelet":         "misc",
};

// Apply cat remapping
var unmapped = [];
cards.forEach(function(c) {
  if (catMap.hasOwnProperty(c.name)) {
    c.cat = catMap[c.name];
  } else {
    // Cards not in catMap: keep their existing cat if it's valid in new system
    // extra-turn cards that aren't listed -> stay extra-turn
    // tutor cards that aren't listed (and aren't Sisay) -> stay tutor
    if (c.cat === 'extra-turn' || c.cat === 'tutor') {
      // keep as-is (already valid new cats)
    } else {
      unmapped.push(c.name + ' (was: ' + c.cat + ')');
    }
  }
});

if (unmapped.length > 0) {
  console.log('\nWARNING - unmapped cards (need manual review):');
  unmapped.forEach(function(n) { console.log(' ', n); });
}

// Check for any remaining old cats
var badCats = [];
cards.forEach(function(c) {
  var valid = ['banned-commander','extra-turn','tutor','fast-mana','big-life','combo','hard-stax','life-manip','misc','official'];
  if (valid.indexOf(c.cat) === -1) {
    badCats.push(c.name + ' -> ' + c.cat);
  }
});
if (badCats.length > 0) {
  console.log('\nERROR - cards with invalid/old cats:');
  badCats.forEach(function(n) { console.log(' ', n); });
  process.exit(1);
}

// Deduplicate (keep first occurrence)
var seen = {};
var unique = [];
cards.forEach(function(c) {
  if (!seen[c.name]) {
    seen[c.name] = true;
    unique.push(c);
  }
});
console.log('\nAfter dedup:', unique.length, 'unique cards');

// Group by new cat
var groups = {
  'banned-commander': [],
  'extra-turn': [],
  'tutor': [],
  'fast-mana': [],
  'big-life': [],
  'life-manip': [],
  'combo': [],
  'hard-stax': [],
  'misc': [],
  'official': [],
};

unique.forEach(function(c) {
  if (!groups[c.cat]) {
    console.error('Unknown cat:', c.cat, 'for', c.name);
    process.exit(1);
  }
  groups[c.cat].push(c);
});

// Sort within each group alphabetically by name
Object.keys(groups).forEach(function(cat) {
  groups[cat].sort(function(a, b) { return a.name.localeCompare(b.name); });
});

// Build new file content
function formatCard(c) {
  // We need to produce a single-line entry matching original style
  // Use JSON.stringify for string values to handle special chars properly
  var name = JSON.stringify(c.name);
  var type = JSON.stringify(c.type);
  var cat = JSON.stringify(c.cat);
  var pill = JSON.stringify(c.pill);
  var origin = JSON.stringify(c.origin);
  var reason = JSON.stringify(c.reason);
  return '  { name: ' + name + ', type: ' + type + ', cat: ' + cat + ', pill: ' + pill + ', origin: ' + origin + ', reason: ' + reason + ' },';
}

var sectionHeaders = {
  'banned-commander': '// ── BANNED AS COMMANDER ONLY ──────────────────────────────────',
  'extra-turn':       '// ── EXTRA TURNS ────────────────────────────────────────────────',
  'tutor':            '// ── TUTORS ─────────────────────────────────────────────────────',
  'fast-mana':        '// ── FAST MANA ──────────────────────────────────────────────────',
  'big-life':         '// ── BIG LIFE TOTAL ─────────────────────────────────────────────',
  'life-manip':       '// ── LIFE MANIPULATION ──────────────────────────────────────────',
  'combo':            '// ── COMBO ──────────────────────────────────────────────────────',
  'hard-stax':        '// ── HARD STAX ──────────────────────────────────────────────────',
  'misc':             '// ── MISC ───────────────────────────────────────────────────────',
  'official':         '// ── OFFICIAL ───────────────────────────────────────────────────',
};

var order = ['banned-commander','extra-turn','tutor','fast-mana','big-life','life-manip','combo','hard-stax','misc','official'];

var lines = [];
lines.push('/* ════════════════════════════════════════════════════════════════');
lines.push('   TWO-HEADED COMMANDER — banned-cards.js');
lines.push('   ════════════════════════════════════════════════════════════════');
lines.push('');
lines.push('   HOW TO ADD A CARD');
lines.push('   ─────────────────');
lines.push('   Copy any existing entry and change the fields:');
lines.push('');
lines.push('     { name, type, cat, pill, origin, reason }');
lines.push('');
lines.push('   VALID VALUES FOR cat (used by the filter buttons):');
lines.push('     "banned-commander" → Banned as Commander Only filter');
lines.push('     "extra-turn"       → Extra Turns filter');
lines.push('     "tutor"            → Tutors filter');
lines.push('     "fast-mana"        → Fast Mana filter');
lines.push('     "big-life"         → Big Life Total filter');
lines.push('     "life-manip"       → Life Manipulation filter');
lines.push('     "combo"            → Combo filter');
lines.push('     "hard-stax"        → Hard Stax filter');
lines.push('     "misc"             → Misc filter');
lines.push('     "official"         → Official filter');
lines.push('');
lines.push('   VALID VALUES FOR pill (the coloured tag in the card header):');
lines.push('     "pill-edh"    → purple  — banned in EDH');
lines.push('     "pill-2hg"    → gold    — banned in Two-Headed Giant');
lines.push('     "pill-both"   → red     — banned in both EDH and 2HG');
lines.push('     "pill-2hc"    → blue    — unique ban for this format');
lines.push('');
lines.push('   ════════════════════════════════════════════════════════════════ */');
lines.push('');
lines.push('const BANNED_CARDS = [');
lines.push('');

order.forEach(function(cat) {
  lines.push('  ' + sectionHeaders[cat]);
  lines.push('');
  groups[cat].forEach(function(c) {
    lines.push(formatCard(c));
  });
  lines.push('');
});

lines.push('];');
lines.push('');

var output = lines.join('\n');
fs.writeFileSync('C:/Users/Admin/Desktop/files/banned-cards.js', output, 'utf8');
console.log('\nFile written successfully!');

// Summary
order.forEach(function(cat) {
  console.log(cat.padEnd(20) + ': ' + groups[cat].length + ' cards');
});

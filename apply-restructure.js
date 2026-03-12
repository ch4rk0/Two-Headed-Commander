var fs = require('fs');
var content = fs.readFileSync('banned-cards.js', 'utf8');

// Parse cards by extracting each { ... } object on a single line
var cards = [];
var lines = content.split('\n');
lines.forEach(function(line) {
  var m = line.match(/^\s*\{(.+)\},?\s*$/);
  if (!m) return;
  var inner = m[1];
  var obj = {};
  var fields = ['name','type','cat','pill','origin','reason'];
  fields.forEach(function(f) {
    var r = new RegExp(f + ':\\s*"((?:[^"\\\\]|\\\\.)*)"');
    var fm = inner.match(r);
    if (fm) obj[f] = fm[1].replace(/\\"/g, '"');
  });
  if (obj.name && obj.cat) cards.push(obj);
});
console.log('Parsed', cards.length, 'cards');

// catMap from restructure.js
var catMap = {
  // banned-commander
  "Braids, Cabal Minion":          "banned-commander",
  "Emrakul, the Promised End":     "banned-commander",
  "Grim Monolith":                 "banned-commander",
  "Magda, Brazen Outlaw":          "banned-commander",
  "Krark, the Thumbless":          "banned-commander",
  "Sisay, Weatherlight Captain":   "banned-commander",
  "Zur the Enchanter":             "banned-commander",
  // extra-turn
  "Seedtime":                      "extra-turn",
  "Emrakul, the Aeons Torn":       "extra-turn",
  "Time Vault":                    "fast-mana",
  // fast-mana
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
  "Nature's Rhythm":               "fast-mana",
  "Simian Spirit Guide":           "fast-mana",
  "Elvish Spirit Guide":           "fast-mana",
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
  "Grand Arbiter Augustin IV":     "hard-stax",
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
  "Vivi Ornitier":                 "combo",
  "Winota, Joiner of Forces":      "combo",
  "Yuriko, the Tiger's Shadow":    "combo",
  "Jeska's Will":                  "combo",
  "Baral, Chief of Compliance":    "combo",
  "Invasion of Ikoria":            "combo",
  "Transmute Artifact":            "combo",
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

var validCats = ['banned-commander','extra-turn','tutor','fast-mana','big-life','life-manip','combo','hard-stax','misc','official'];

// Apply cat remapping
var unmapped = [];
cards.forEach(function(c) {
  if (catMap.hasOwnProperty(c.name)) {
    c.cat = catMap[c.name];
  } else {
    if (c.cat === 'extra-turn' || c.cat === 'tutor') {
      // keep as-is
    } else {
      unmapped.push(c.name + ' (was: ' + c.cat + ')');
    }
  }
});

if (unmapped.length > 0) {
  console.log('\nWARNING - unmapped cards:');
  unmapped.forEach(function(n) { console.log('  ', n); });
}

// Check for bad cats
var badCats = [];
cards.forEach(function(c) {
  if (validCats.indexOf(c.cat) === -1) {
    badCats.push(c.name + ' -> ' + c.cat);
  }
});
if (badCats.length > 0) {
  console.log('\nERROR - cards with invalid cats:');
  badCats.forEach(function(n) { console.log('  ', n); });
  process.exit(1);
}

// Deduplicate (keep first occurrence)
var seen = {};
var unique = [];
cards.forEach(function(c) {
  if (!seen[c.name]) {
    seen[c.name] = true;
    unique.push(c);
  } else {
    console.log('DUPLICATE removed:', c.name);
  }
});
console.log('\nAfter dedup:', unique.length, 'unique cards');

// Group by cat
var groups = {};
validCats.forEach(function(cat) { groups[cat] = []; });
unique.forEach(function(c) { groups[c.cat].push(c); });

// Sort alphabetically within each group
validCats.forEach(function(cat) {
  groups[cat].sort(function(a, b) { return a.name.localeCompare(b.name); });
});

// Print summary
console.log('');
validCats.forEach(function(cat) {
  console.log(cat.padEnd(20) + ': ' + groups[cat].length + ' cards');
});

// Section headers
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

function esc(s) {
  return s ? s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '';
}

function formatCard(c) {
  return '  { name: "' + esc(c.name) + '", type: "' + esc(c.type) + '", cat: "' + c.cat + '", pill: "' + c.pill + '", origin: "' + esc(c.origin || '') + '", reason: "' + esc(c.reason || '') + '" },';
}

var outLines = [];
outLines.push('/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
outLines.push('   TWO-HEADED COMMANDER \u2014 banned-cards.js');
outLines.push('   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
outLines.push('');
outLines.push('   HOW TO ADD A CARD');
outLines.push('   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
outLines.push('   Copy any existing entry and change the fields:');
outLines.push('');
outLines.push('     { name, type, cat, pill, origin, reason }');
outLines.push('');
outLines.push('   VALID VALUES FOR cat (used by the filter buttons):');
outLines.push('     "banned-commander" \u2192 Banned as Commander Only filter');
outLines.push('     "extra-turn"       \u2192 Extra Turns filter');
outLines.push('     "tutor"            \u2192 Tutors filter');
outLines.push('     "fast-mana"        \u2192 Fast Mana filter');
outLines.push('     "big-life"         \u2192 Big Life Total filter');
outLines.push('     "life-manip"       \u2192 Life Manipulation filter');
outLines.push('     "combo"            \u2192 Combo filter');
outLines.push('     "hard-stax"        \u2192 Hard Stax filter');
outLines.push('     "misc"             \u2192 Misc filter');
outLines.push('     "official"         \u2192 Official filter');
outLines.push('');
outLines.push('   VALID VALUES FOR pill (the coloured tag in the card header):');
outLines.push('     "pill-edh"    \u2192 purple  \u2014 banned in EDH');
outLines.push('     "pill-2hg"    \u2192 gold    \u2014 banned in Two-Headed Giant');
outLines.push('     "pill-both"   \u2192 red     \u2014 banned in both EDH and 2HG');
outLines.push('     "pill-2hc"    \u2192 blue    \u2014 unique ban for this format');
outLines.push('');
outLines.push('   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */');
outLines.push('');
outLines.push('const BANNED_CARDS = [');
outLines.push('');

validCats.forEach(function(cat) {
  outLines.push('  ' + sectionHeaders[cat]);
  outLines.push('');
  groups[cat].forEach(function(c) {
    outLines.push(formatCard(c));
  });
  outLines.push('');
});

outLines.push('];');
outLines.push('');

// Preserve WATCHLIST_CARDS if present
var watchlistMatch = content.match(/\n(const WATCHLIST_CARDS[\s\S]+)$/);
if (watchlistMatch) {
  outLines.push(watchlistMatch[1].trimEnd());
  outLines.push('');
}

var output = outLines.join('\n');
fs.writeFileSync('banned-cards.js', output, 'utf8');
console.log('\nFile written successfully!');

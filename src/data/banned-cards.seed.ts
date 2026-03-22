export type BanReason    = '' | { en: string; fr: string };
export type WatchDiscuss = '' | { en: string; fr: string };

export interface BannedCard {
  name: string;
  type: string;
  cat: string;
  pill: string;
  origin: string;
  reason: BanReason;
  image?: string;     // custom image URL override (otherwise derived from name)
  hidden?: boolean;   // if true, not shown on the public ban list
  dateAdded?: string; // ISO date string e.g. "2026-03-21"
  updatedBy?: string; // email of last admin to save this card
  updatedAt?: string; // ISO date string of last save
}

export interface WatchlistCard {
  name: string;
  type: string;
  cat: string;
  discuss: WatchDiscuss;
  image?: string;
  hidden?: boolean;
  dateAdded?: string;
  updatedBy?: string; // email of last admin to save this card
  updatedAt?: string; // ISO date string of last save
}

export const BANNED_CARDS_SEED: BannedCard[] = [

  // ── BANNED AS COMMANDER ONLY ──────────────────────────────────

  { name: "Braids, Cabal Minion", type: "Legendary Creature — Human Minion", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Each player sacrifices a permanent at the beginning of their upkeep. Braids decks are usually built to play it early and have a lot of expendable permanents. While this commander can adversely affect a player's teammate, the forced resource denial from an uncontested early Braids can often lead to non-games.", fr: "Chaque joueur sacrifie un permanent lors de son entretien. Les decks Braids sont généralement construits pour la jouer tôt et disposent de nombreux permanents jetables. Bien que ce commandant puisse affecter négativement le coéquipier de son joueur, le déni de ressources forcé d'une Braids non contestée en début de partie peut souvent mener à des non-parties." } },
  { name: "Krark, the Thumbless", type: "Legendary Creature — Goblin Shaman", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Flip a coin on each instant or sorcery — win to copy it; lose to return to hand. This commander usually helms storm decks, aiming at chaining a lot of spells early. The fact that it has the partner ability enables the use of two additional colors. The constant coin flip mechanic often leads to exceedingly long turns.", fr: "Lancez une pièce pour chaque éphémère ou rituel — pile pour en faire une copie ; face pour le renvoyer en main. Ce commandant chapeaute généralement des decks storm qui cherchent à enchaîner de nombreux sorts tôt. Le fait qu'il possède la capacité partenaire permet l'accès à deux couleurs supplémentaires. La mécanique de lancer de pièce répétée mène souvent à des tours excessivement longs." } },
  { name: "Magda, Brazen Outlaw", type: "Legendary Creature — Dwarf Berserker", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Tapped dwarves create Treasure tokens; five Treasures deploy any artifact or Dragon for free. Treasures are now very easy to produce and the deck can tutor overwhelming board states too quickly, with minimal mana investment.", fr: "Les nains engagés créent des jetons Trésor ; cinq Trésors permettent de déployer gratuitement n'importe quel artefact ou Dragon. Les Trésors sont désormais très faciles à produire et le deck peut chercher des états de plateau écrasants trop rapidement, avec un investissement en mana minimal." } },
  { name: "Sisay, Weatherlight Captain", type: "Legendary Creature — Human Soldier", cat: "banned-commander", pill: "pill-edh", origin: "Banned — tutor", reason: { en: "Taps for mana equal to her power to tutor a legendary permanent of that CMC or less directly into play. With any power boost, chains legendary permanents onto the battlefield for free. Once on the battlefield it leads to repetitive game play and can take many different lines to counter interaction.", fr: "S'engage pour une quantité de mana égale à sa force afin de chercher un permanent légendaire dont la valeur de mana est inférieure ou égale et de le mettre directement en jeu. Avec n'importe quelle augmentation de force, elle enchaîne les permanents légendaires sur le champ de bataille gratuitement. Une fois en jeu, elle génère un gameplay répétitif et peut emprunter de nombreuses lignes différentes pour contrer les interactions." } },
  { name: "Zur the Enchanter", type: "Legendary Creature — Human Wizard", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Whenever Zur attacks, tutor any enchantment with CMC 3 or less directly into play. There is a large number of oppressive enchantments in this color combination, and Zur can put them on the battlefield too consistently, leading to repetitive game play.", fr: "Chaque fois que Zur attaque, cherchez n'importe quel enchantement avec une valeur de mana de 3 ou moins et mettez-le directement en jeu. Il existe un grand nombre d'enchantements oppressifs dans cette combinaison de couleurs, et Zur peut les mettre sur le champ de bataille de manière trop régulière, menant à un jeu répétitif." } },
  { name: "Etali, Primal Conqueror", type: "Legendary Creature — Elder Dinosaur", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — free spell cheat", reason: { en: "When it enters, cast the top card of each opponent's library for free. Even with the 2HC ban list, Etali is in the most explosive color combination and can be cast as early as turn 1, and often on turn 3. Its trigger helps accumulating resources too quickly, and often generates more copies of Etali, leading to an unsurmountable board state.", fr: "Quand il arrive sur le champ de bataille, lancez gratuitement la carte du dessus de la bibliothèque de chaque adversaire. Même avec la liste de bannissement du 2HC, Etali se trouve dans la combinaison de couleurs la plus explosive et peut être lancé dès le tour 1, et souvent au tour 3. Sa capacité déclenchée accumule les ressources trop rapidement, et génère souvent des copies supplémentaires d'Etali, menant à un état de plateau insurmontable." } },
  { name: "Kinnan, Bonder Prodigy", type: "Legendary Creature — Human Druid", cat: "banned-commander", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "All nonland mana sources produce one additional mana. Costing only 2 mana, Kinnan is both an enabler and a win condition on its own, and has combo potential with a large number of cards in the format. Given other bannings he is fine in the deck, but is deemed too oppressive as a commander.", fr: "Toutes les sources de mana qui ne sont pas des terrains produisent un mana supplémentaire. Ne coûtant que 2 manas, Kinnan est à la fois un facilitateur et une condition de victoire en lui-même, et possède un potentiel de combo avec un grand nombre de cartes dans le format. Compte tenu des autres bannissements, il est acceptable dans un deck, mais est jugé trop oppressif comme commandant." } },

  // ── EXTRA TURNS ────────────────────────────────────────────────

  { name: "Alchemist's Gambit", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Alrund's Epiphany", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Beacon of Tomorrows", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Lost Isle Calling", type: "Instant", cat: "extra-turn", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Capture of Jingzhou", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Chance for Glory", type: "Instant", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Emrakul, the Aeons Torn", type: "Legendary Creature — Eldrazi", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Final Fortune", type: "Instant", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Glorious End", type: "Instant", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Gonti's Aether Heart", type: "Legendary Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Ichormoon Gauntlet", type: "Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Karn's Temporal Sundering", type: "Legendary Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Last Chance", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Lighthouse Chronologist", type: "Creature — Human Wizard", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Magistrate's Scepter", type: "Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Magosi, the Waterveil", type: "Land", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Medomai the Ageless", type: "Legendary Creature — Sphinx", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Mu Yanling", type: "Legendary Planeswalker", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Nexus of Fate", type: "Instant", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Notorious Throng", type: "Tribal Sorcery — Rogue", cat: "extra-turn", pill: "pill-2hg", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Part the Waterveil", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Plea for Power", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Ral Zarek", type: "Legendary Planeswalker", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Sage of Hours", type: "Creature — Human Wizard", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Regenerations Restored", type: "Sorcery", cat: "extra-turn", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Rise of the Eldrazi", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — free cheat", reason: "" },
  { name: "Savor the Moment", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Seedtime", type: "Instant", cat: "extra-turn", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Teferi, Master of Time", type: "Legendary Planeswalker", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Teferi, Timebender", type: "Legendary Planeswalker", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Temporal Extortion", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Temporal Manipulation", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Temporal Mastery", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Temporal Trespass", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Time Sieve", type: "Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Time Stretch", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Time Walk", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Time Warp", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Timesifter", type: "Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Timestream Navigator", type: "Creature — Human Pirate", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Twice Upon a Time // Unlikely Meeting", type: "Instant — Adventure", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Ugin's Nexus", type: "Legendary Artifact", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Ultimecia, Time Sorceress // Ultimecia, Omnipotent", type: "Legendary Creature — Human Wizard", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Walk the Aeons", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Wanderwine Prophets", type: "Creature — Merfolk Wizard", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Warrior's Oath", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Wormfang Manta", type: "Creature — Nightmare Fish Beast", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Expropriate", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — council's dilemma", reason: "" },
  { name: "Stitch in Time", type: "Sorcery", cat: "extra-turn", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },

  // ── TUTORS ─────────────────────────────────────────────────────

  { name: "Academy Rector", type: "Creature — Human Cleric", cat: "tutor", pill: "pill-edh", origin: "Banned in 2HC", reason: { en: "When it dies, tutors any enchantment directly into play for free. Sacrificing it with any free outlet instantly deploys Omniscience, or any other game-ending enchantment at zero mana cost. In 2HC, a teammate providing sacrifice support makes this trivially consistent on turns 2–3.", fr: "Quand il meurt, cherchez n'importe quel enchantement et mettez-le directement en jeu gratuitement. Le sacrifier avec n'importe quel débouché gratuit déploie instantanément Omniscience, ou tout autre enchantement décisif, pour un coût nul. En 2HC, un coéquipier fournissant un support de sacrifice rend cela trivialement régulier dès les tours 2–3." } },
  { name: "Beseech the Mirror", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Birthing Pod", type: "Artifact", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Buried Alive", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Chord of Calling", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Defense of the Heart", type: "Enchantment", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Demonic Consultation", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — combo tutor", reason: "" },
  { name: "Demonic Counsel", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Demonic Tutor", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Diabolic Intent", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Eladamri's Call", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Eldritch Evolution", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Enlightened Tutor", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Entomb", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Finale of Devastation", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Gamble", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Gifts Ungiven", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Green Sun's Zenith", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Hermit Druid", type: "Creature — Human Druid", cat: "combo", pill: "pill-edh", origin: "Banned — library mill combo", reason: "" },
  { name: "Imperial Seal", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Intuition", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Lim-Dûl's Vault", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Mystical Tutor", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Natural Order", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Neoform", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Pattern of Rebirth", type: "Enchantment — Aura", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Personal Tutor", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Razaketh, the Foulblooded", type: "Legendary Creature — Demon", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Scheming Symmetry", type: "Sorcery", cat: "tutor", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Survival of the Fittest", type: "Enchantment", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Sylvan Tutor", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Tainted Pact", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — combo tutor", reason: "" },
  { name: "Time of Need", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Traverse the Ulvenwald", type: "Sorcery", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Vampiric Tutor", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Wishclaw Talisman", type: "Artifact", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Worldly Tutor", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — tutor", reason: "" },
  { name: "Summoner's Pact", type: "Instant", cat: "tutor", pill: "pill-edh", origin: "Banned — free tutor", reason: "" },

  // ── FAST MANA ──────────────────────────────────────────────────

  { name: "Grim Monolith", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana / infinite combo", reason: "" },
  { name: "Ancient Tomb", type: "Land", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "City of Traitors", type: "Land", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Basalt Monolith", type: "Artifact", cat: "combo", pill: "pill-edh", origin: "Banned — fast mana / infinite combo", reason: { en: "Taps for three colorless, untaps for three. With Rings of Brighthearth, Kinnan, Zirda and many others, produces infinite colorless mana — a two-card combo. Even standalone it's a powerful accelerant leading to game-ending plays several turns ahead of the curve.", fr: "S'engage pour trois manas incolores, se désengage pour trois manas. Avec Rings of Brighthearth, Kinnan, Zirda et de nombreuses autres cartes, produit des manas incolores infinis — un combo à deux cartes. Même seul, c'est un puissant accélérateur permettant des jeux décisifs plusieurs tours avant la courbe normale." } },
  { name: "Black Lotus", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Channel", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Chrome Mox", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Dockside Extortionist", type: "Creature — Goblin Pirate", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Fastbond", type: "Enchantment", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Gaea's Cradle", type: "Legendary Land", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Jeweled Lotus", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Library of Alexandria", type: "Land", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Lion's Eye Diamond", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Lotus Petal", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mana Crypt", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Mana Vault", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mishra's Workshop", type: "Land", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mox Amber", type: "Legendary Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mox Diamond", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mox Emerald", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Mox Jet", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Mox Opal", type: "Legendary Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned — fast mana", reason: "" },
  { name: "Mox Pearl", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Mox Ruby", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Mox Sapphire", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Primeval Titan", type: "Creature — Giant", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Rofellos, Llanowar Emissary", type: "Legendary Creature — Elf Druid", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Sol Ring", type: "Artifact", cat: "fast-mana", pill: "pill-edh", origin: "Banned in 2HC", reason: "" },
  { name: "Time Vault", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Tolarian Academy", type: "Legendary Land", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },

  // ── BIG LIFE TOTAL ─────────────────────────────────────────────

  { name: "Ad Nauseam", type: "Instant", cat: "big-life", pill: "pill-edh", origin: "Banned — combo enabler", reason: "" },
  { name: "Aetherflux Reservoir", type: "Artifact", cat: "big-life", pill: "pill-edh", origin: "Banned — alternate win condition", reason: { en: "Deals 50 damage to a target by paying 50 life. Teams starting at 60 life enables the damage ability immediately.", fr: "Inflige 50 blessures à une cible en payant 50 points de vie. Les équipes démarrant à 60 points de vie peuvent activer la capacité de blessures immédiatement." } },
  { name: "Bolas's Citadel", type: "Legendary Artifact", cat: "big-life", pill: "pill-edh", origin: "Banned — infinite combo", reason: "" },
  { name: "Doom Whisperer", type: "Creature — Nightmare Demon", cat: "big-life", pill: "pill-edh", origin: "Banned — combo enabler", reason: "" },
  { name: "Felidar Sovereign", type: "Creature — Cat Beast", cat: "big-life", pill: "pill-edh", origin: "Banned — alt win condition", reason: "" },
  { name: "Hatred", type: "Instant", cat: "big-life", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Necrodominance", type: "Enchantment", cat: "big-life", pill: "pill-edh", origin: "Banned — draw engine", reason: "" },
  { name: "Necrologia", type: "Instant", cat: "big-life", pill: "pill-edh", origin: "Banned — draw engine", reason: "" },
  { name: "Necropotence", type: "Enchantment", cat: "big-life", pill: "pill-edh", origin: "Banned — draw engine", reason: "" },
  { name: "Test of Endurance", type: "Enchantment", cat: "big-life", pill: "pill-edh", origin: "Banned — alt win condition", reason: "" },
  { name: "Treasonous Ogre", type: "Creature — Ogre Shaman", cat: "big-life", pill: "pill-edh", origin: "Banned — mana/life combo", reason: "" },
  { name: "Yawgmoth's Bargain", type: "Enchantment", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },

  // ── LIFE MANIPULATION ──────────────────────────────────────────

  { name: "Biorhythm", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Grievous Wound", type: "Sorcery", cat: "life-manip", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Sets a player's maximum life total to a reduced amount. In 2HC, damaging the enchanted player affects the entire shared life pool. Combined with any cheap source of repeatable damage from both players, it reprensents way too much damage for a 5-mana card.", fr: "Réduit le total de points de vie maximum d'un joueur. En 2HC, blesser le joueur enchanté affecte le total de points de vie partagé de toute l'équipe. Combiné à n'importe quelle source bon marché de blessures répétées des deux joueurs, cela représente bien trop de blessures pour une carte à 5 manas." } },
  { name: "Havoc Festival", type: "Enchantment", cat: "life-manip", pill: "pill-edh", origin: "Banned — life drain", reason: { en: "Players can't gain life and each player loses half their life rounded up at each of their upkeeps. In 2HC, both players are affected in succession, which represents a 75% life swing in one turn.", fr: "Les joueurs ne peuvent pas gagner de points de vie et chaque joueur perd la moitié de ses points de vie (arrondi à la hausse) lors de chacun de leurs entretiens. En 2HC, les deux joueurs sont affectés successivement, ce qui représente une variation de 75% des points de vie en un seul tour." } },
  { name: "Heartless Hidetsugu", type: "Legendary Creature — Ogre Shaman", cat: "life-manip", pill: "pill-edh", origin: "Banned — targeted life halving", reason: { en: "Tap to deal damage equal to half each opponent's life total rounded down. In 2HC, both players are dealt damage at the same time when the ability resolves, which means that any team with an even life total dies immediately.", fr: "Engagez pour infliger des blessures égales à la moitié du total de points de vie de chaque adversaire, arrondi à la baisse. En 2HC, les deux joueurs subissent les blessures simultanément lors de la résolution de la capacité, ce qui signifie que toute équipe avec un total de points de vie pair meurt immédiatement." } },
  { name: "Magister Sphinx", type: "Artifact Creature — Sphinx", cat: "life-manip", pill: "pill-edh", origin: "Banned — alt win condition", reason: "" },
  { name: "Scourge of the Skyclaves", type: "Creature — Demon", cat: "life-manip", pill: "pill-2hg", origin: "Banned — 2HG specific", reason: { en: "When cast with kicker, it reduces all teams' life totals by 75% when it enters, as both players are affected successively.", fr: "Lancé avec le bonus de débarquement, il réduit les totaux de points de vie de toutes les équipes de 75% lors de son arrivée sur le champ de bataille, les deux joueurs étant affectés successivement." } },
  { name: "Secret of Bloodbending", type: "Sorcery", cat: "extra-turn", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Sorin Markov", type: "Legendary Planeswalker", cat: "life-manip", pill: "pill-edh", origin: "Banned — alt win condition", reason: { en: "Second ability sets target player's life to 10. In 2HC, targeting any opposing player sets the entire team's shared pool to 10 regardless of their starting total — a 50-life swing in a single planeswalker activation. Furthermore, its ultimate enables a team to control the entire opposing team, as turns and phases are shared in 2HC.", fr: "La deuxième capacité fixe le total de points de vie d'un joueur cible à 10. En 2HC, cibler n'importe quel joueur adverse fixe le total partagé de toute l'équipe à 10, quelle que soit leur valeur de départ — une variation de 50 points de vie en une seule activation de planeswalker. De plus, son emblème permet à une équipe de contrôler l'équipe adverse en entier, les tours et les phases étant partagés en 2HC." } },
  { name: "The Legend of Kuruk // Avatar Kuruk", type: "Legendary Enchantment", cat: "extra-turn", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Tree of Perdition", type: "Creature — Plant", cat: "life-manip", pill: "pill-edh", origin: "Banned — alt win condition", reason: { en: "Tap to exchange its toughness (13) with target opponent's life total. In 2HC, this sets the entire team's shared life to 13. This can put the opposing team at lethal range in a single tap activation, and can be lethal when combined with toughness-reducing effects.", fr: "Engagez pour échanger sa robustesse (13) avec le total de points de vie d'un joueur adverse cible. En 2HC, cela fixe le total de points de vie partagé de l'équipe entière à 13. Cela peut mettre l'équipe adverse à portée létale en une seule activation, et peut être fatal combiné à des effets réduisant la robustesse." } },

  // ── COMBO ──────────────────────────────────────────────────────

  { name: "Chain of Smog", type: "Sorcery", cat: "combo", pill: "pill-edh", origin: "Banned — infinite combo", reason: { en: "Creates an infinite loop with Witherbloom Apprentice or Professor Onyx, that drains all opponents to zero. A two-card, two-mana instant win requiring no board setup beyond two specific cards.", fr: "Crée une boucle infinie avec Witherbloom Apprentice ou Professor Onyx qui draine tous les adversaires à zéro. Un combo instantané à deux cartes et deux manas ne nécessitant aucune préparation sur le plateau au-delà de ces deux cartes spécifiques." } },
  { name: "Cloud of Faeries", type: "Creature — Faerie", cat: "combo", pill: "pill-edh", origin: "Banned — infinite mana", reason: "" },
  { name: "Dualcaster Mage", type: "Creature — Human Wizard", cat: "combo", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Flash creature that copies a spell on entry. It can generate an infinite number of copies with any instant or sorcery that creates a copy with haste, a fast combo that can occur with almost no setup and without warning.", fr: "Créature avec flash qui copie un sort lors de son arrivée sur le champ de bataille. Elle peut générer un nombre infini de copies avec n'importe quel éphémère ou rituel qui crée une copie avec l'initiative, un combo rapide qui peut survenir avec presque aucune préparation et sans avertissement." } },
  { name: "Flash", type: "Instant", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Food Chain", type: "Enchantment", cat: "combo", pill: "pill-edh", origin: "Banned — infinite mana", reason: "" },
  { name: "Griselbrand", type: "Legendary Creature — Demon", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Isochron Scepter", type: "Artifact", cat: "misc", pill: "pill-edh", origin: "Banned — infinite combo", reason: "" },
  { name: "Mana Drain", type: "Instant", cat: "misc", pill: "pill-edh", origin: "Banned — free mana counter", reason: "" },
  { name: "Nadu, Winged Wisdom", type: "Legendary Creature — Bird Wizard", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Oath of Druids", type: "Enchantment", cat: "tutor", pill: "pill-edh", origin: "Banned — library cheat", reason: "" },
  { name: "Painter's Servant", type: "Artifact Creature — Scarecrow", cat: "combo", pill: "pill-edh", origin: "Banned — lock combo", reason: "" },
  { name: "Peregrine Drake", type: "Creature — Drake", cat: "combo", pill: "pill-edh", origin: "Banned — infinite mana", reason: { en: "Untaps five lands on entry. In blink, copy or bounce decks, can generate overwhelming quantities of mana very quickly and has multiple infinite combo applications.", fr: "Désengage cinq terrains lors de son arrivée sur le champ de bataille. Dans les decks de clignotement, de copie ou de retour en main, il peut générer des quantités écrasantes de mana très rapidement et possède de multiples applications de combo infini." } },
  { name: "Prophet of Kruphix", type: "Creature — Human Wizard", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Protean Hulk", type: "Creature — Beast", cat: "combo", pill: "pill-edh", origin: "Banned — instant win combo", reason: "" },
  { name: "Recurring Nightmare", type: "Enchantment", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Thassa's Oracle", type: "Creature — Merfolk Wizard", cat: "combo", pill: "pill-edh", origin: "Banned — instant win combo", reason: "" },
  { name: "Tinker", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Underworld Breach", type: "Enchantment", cat: "combo", pill: "pill-edh", origin: "Banned — infinite combo", reason: "" },
  { name: "Upheaval", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Walking Ballista", type: "Artifact Creature — Construct", cat: "combo", pill: "pill-edh", origin: "Banned — combo win condition", reason: "" },

  // ── HARD STAX ──────────────────────────────────────────────────

  { name: "Armageddon", type: "Sorcery", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Back to Basics", type: "Enchantment", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Cataclysm", type: "Sorcery", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Drannith Magistrate", type: "Creature — Human Wizard", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Flamescroll Celebrant // Revel in Silence", type: "Creature — Human Shaman", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Global Ruin", type: "Sorcery", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Humility", type: "Enchantment", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Impending Disaster", type: "Enchantment", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Jokulhaups", type: "Sorcery", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Mycosynth Lattice", type: "Artifact", cat: "hard-stax", pill: "pill-edh", origin: "Banned — lock combo", reason: "" },
  { name: "Ravages of War", type: "Sorcery", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Stasis", type: "Enchantment", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Static Orb", type: "Artifact", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Strip Mine", type: "Land", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Sunder", type: "Instant", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "The Tabernacle at Pendrell Vale", type: "Legendary Land", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Wasteland", type: "Land", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Winter Moon", type: "Enchantment", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Winter Orb", type: "Artifact", cat: "hard-stax", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },

  // ── MISC ───────────────────────────────────────────────────────

  { name: "Deflecting Swat", type: "Instant", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Fierce Guardianship", type: "Instant", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Mindslaver", type: "Legendary Artifact", cat: "misc", pill: "pill-edh", origin: "Banned — control combo", reason: { en: "Activate to control an opponent's entire next turn. In 2HC, taking control of one opposing player's turn means controlling the entire team's turn. Combined with Academy Ruins or any other artifact recursion effect, creates an infinite loop permanently controlling the opposing team.", fr: "Activez pour contrôler le prochain tour complet d'un adversaire. En 2HC, prendre le contrôle du tour d'un joueur adverse signifie contrôler le tour de toute l'équipe. Combiné à Academy Ruins ou tout autre effet de récursion d'artefact, crée une boucle infinie contrôlant en permanence l'équipe adverse." } },
  { name: "Pact of Negation", type: "Instant", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Sensei's Divining Top", type: "Artifact", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Repeated activations can extend game time considerably. It is also a very cheap combo piece with any effect that enables recasting it from the top of the deck.", fr: "Des activations répétées peuvent considérablement allonger la durée de la partie. C'est également une pièce de combo très bon marché avec tout effet permettant de le relancer depuis le dessus du deck." } },
  { name: "Emrakul, the Promised End", type: "Legendary Creature — Eldrazi", cat: "misc", pill: "pill-edh", origin: "Banned — game-winning threat", reason: { en: "When cast, control an opponent's next turn. In 2HC, taking control of one opposing player's turn means controlling the entire team's turn — which is twice as backbreaking as in one-one-one play.", fr: "Quand il est lancé, contrôlez le prochain tour d'un adversaire. En 2HC, prendre le contrôle du tour d'un joueur adverse signifie contrôler le tour de toute l'équipe — ce qui est deux fois plus pénalisant qu'en jeu individuel." } },
  { name: "Golos, Tireless Pilgrim", type: "Legendary Artifact Creature — Scout", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Sundering Titan", type: "Artifact Creature — Golem", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "The Dominion Bracelet", type: "Legendary Artifact — Equipment", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: "" },
  { name: "Worst Fears", type: "Sorcery", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Control target player until end of turn. In 2HC, taking control of one opposing player's turn means controlling the entire team's turn — which is twice as backbreaking as in one-one-one play.", fr: "Contrôlez un joueur cible jusqu'à la fin du tour. En 2HC, prendre le contrôle du tour d'un joueur adverse signifie contrôler le tour de toute l'équipe — ce qui est deux fois plus pénalisant qu'en jeu individuel." } },
  { name: "Discontinuity", type: "Instant", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Ends the current turn, exiling all spells on the stack. Cast during the opposing team's shared turn, this denies both players any spell casting for that entire turn — a two-for-one turn denial creating an uninterruptible window for the casting team.", fr: "Termine le tour actuel, exilant tous les sorts sur la pile. Lancé pendant le tour partagé de l'équipe adverse, cela prive les deux joueurs de tout lancement de sort pour ce tour entier — un déni de tour double créant une fenêtre ininterruptible pour l'équipe qui lance le sort." } },
  { name: "Hurkyl's Final Meditation", type: "Legendary Sorcery", cat: "misc", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Time Stop", type: "Instant", cat: "misc", pill: "pill-edh", origin: "Banned — extra turns (see manifesto)", reason: "" },
  { name: "Silence", type: "Instant", cat: "misc", pill: "pill-2hc", origin: "Banned — 2HC specific", reason: { en: "Each opponent can't cast spells this turn. In 2HC, casting Silence denies the entire opposing team any spell casting — which would be fine to protect a win, and on par with cards such as Voice of Victory — but when cast during the opposing team's upkeep, it basically functions as a one-mana extra turn spell.", fr: "Chaque adversaire ne peut pas lancer de sorts ce tour-ci. En 2HC, lancer Silence prive l'équipe adverse entière de tout lancement de sort — ce qui serait acceptable pour protéger une victoire, et comparable à des cartes comme Voice of Victory — mais lancé pendant l'entretien de l'équipe adverse, il fonctionne essentiellement comme un sort de tour supplémentaire à un mana." } },

  // ── OFFICIAL ───────────────────────────────────────────────────

  { name: "Sylvan Primordial", type: "Creature — Avatar", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Iona, Shield of Emeria", type: "Legendary Creature — Angel", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Ancestral Recall", type: "Instant", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Balance", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Chaos Orb", type: "Artifact", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Falling Star", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Leovold, Emissary of Trest", type: "Legendary Creature — Elf Advisor", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },
  { name: "Lutri, the Spellchaser", type: "Legendary Creature — Otter Wizard", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: { en: "Banned as a companion only, because in a 100-card singleton format every red-blue deck automatically qualifies for Lutri at zero deck-building cost — a free eighth card in the opening hand that copies any instant or sorcery on ETB with no restriction possible.", fr: "Banni uniquement comme compagnon, car dans un format singleton de 100 cartes, chaque deck rouge-bleu se qualifie automatiquement pour Lutri sans aucun coût de construction — une huitième carte gratuite en main de départ qui copie n'importe quel éphémère ou rituel lors de son arrivée sur le champ de bataille, sans restriction possible." } },
  { name: "Shahrazad", type: "Sorcery", cat: "commander", pill: "pill-edh", origin: "Banned — EDH banned list", reason: "" },

];

export const WATCHLIST_CARDS_SEED: WatchlistCard[] = [

  { name: "Splinter's Technique",       type: "Sorcery",                              cat: "combo",  discuss: "" },
  { name: "Rograkh, Son of Rohgahh",    type: "Legendary Creature — Kobold Warrior",  cat: "combo",  discuss: { en: "Being watched as a commander.", fr: "Surveillé en tant que commandant." } },
  { name: "Vivi Ornitier",              type: "Legendary Creature — Human Wizard",    cat: "combo",  discuss: { en: "Being watched as a commander. Vivi's spell-based trigger enables a spellslinger engine where a teammate casting instants and sorceries contributes to the same trigger pool — accelerating his damage or copy output at a rate no solo format accounts for. In 2HC the shared turn means both players' casts fire his ability in the same window, compressing his win timeline significantly. Under review for whether the cooperative spell density makes him too consistent as a commander.", fr: "Surveillé en tant que commandant. La capacité déclenchée de Vivi par les sorts permet un moteur de lanceur de sorts où un coéquipier lançant des éphémères et des rituels contribue au même bassin de déclenchements — accélérant ses dégâts ou sa production de copies à un rythme qu'aucun format solo ne prend en compte. En 2TG, le tour partagé signifie que les lancers des deux joueurs activent sa capacité dans la même fenêtre, comprimant considérablement son calendrier de victoire. À l'étude pour savoir si la densité coopérative de sorts le rend trop cohérent en tant que commandant." } },
  { name: "Winota, Joiner of Forces",   type: "Legendary Creature — Human Warrior",   cat: "combo",  discuss: { en: "Being watched as a commander. Whenever a non-Human creature attacks, look at the top six cards and put a Human into play with haste for free. In 2HC, both teammates attacking with non-Humans trigger Winota multiple times in the same combat — potentially deploying four to six free Humans with haste in a single attack step. The volume of free bodies created in one swing may be too high for the format's pace. Already banned in Pioneer for similar reasons.", fr: "Surveillée en tant que commandante. Chaque fois qu'une créature non-Humaine attaque, regardez les six premières cartes et mettez un Humain en jeu avec la célérité gratuitement. En 2TG, les deux coéquipiers attaquant avec des non-Humains déclenchent Winota plusieurs fois dans le même combat — déployant potentiellement quatre à six Humains gratuits avec la célérité en une seule étape d'attaque. Le volume de corps créés en un seul swing pourrait être trop élevé pour le rythme du format. Déjà bannie en Pioneer pour des raisons similaires." } },
  { name: "Yuriko, the Tiger's Shadow",  type: "Legendary Creature — Human Ninja",    cat: "combo",  discuss: { en: "Being watched as a commander. Yuriko has commander ninjutsu — she enters from the command zone whenever any unblocked creature connects, bypassing the commander tax entirely and making her effectively impossible to permanently answer. Whenever she deals combat damage, each player loses life equal to a revealed card's mana cost and you draw it. In 2HC, this drains both opposing players simultaneously on each hit while drawing cards — a commander that ignores tax, generates inevitability, and is nearly impossible to lock out once a teammate provides any evasion.", fr: "Surveillée en tant que commandante. Yuriko possède le ninjutsu de commandant — elle entre depuis la zone de commandement chaque fois qu'une créature non bloquée touche, contournant entièrement la taxe de commandant et la rendant pratiquement impossible à répondre définitivement. Chaque fois qu'elle inflige des dégâts de combat, chaque joueur perd des points de vie égaux au coût de mana d'une carte révélée et vous la piochez. En 2TG, cela draine les deux joueurs adverses simultanément à chaque touche tout en piochant des cartes." } },
  { name: "Grand Arbiter Augustin IV",   type: "Legendary Creature — Human Advisor",   cat: "2hc",   discuss: { en: "Being watched as a commander. He makes white spells cost 1 less, blue spells cost 1 less, and all opponents' spells cost 1 more. In 2HC, both opposing players pay his tax on every spell during their shared turn — effectively doubling the tax pressure compared to solo Commander. Combined with a teammate also running white or blue, the mana discount accelerates both players simultaneously while both opponents are perpetually slowed on every play. Under review for whether this passive double-tax is too oppressive in a cooperative context.", fr: "Surveillé en tant que commandant. Il rend les sorts blancs moins chers de 1, les sorts bleus moins chers de 1, et tous les sorts des adversaires plus chers de 1. En 2TG, les deux joueurs adverses paient sa taxe sur chaque sort pendant leur tour partagé — doublant effectivement la pression fiscale par rapport au Commandant solo. À l'étude pour savoir si cette double taxe passive est trop oppressive dans un contexte coopératif." } },
  { name: "Nature's Rhythm",             type: "Sorcery",                              cat: "land",   discuss: { en: "Under review for its mana acceleration potential in 2HC. Its effect scales with the combined board state of both teammates — in 2HC, threshold conditions for additional value are met far earlier than in solo Commander. Being monitored for whether the ramp output or card advantage it provides breaks the format's intended mana curve when both players are contributing permanents to the trigger condition.", fr: "À l'étude pour son potentiel d'accélération de mana en 2TG. Son effet évolue avec l'état de jeu combiné des deux coéquipiers — en 2TG, les conditions de seuil pour une valeur supplémentaire sont atteintes bien plus tôt qu'en Commandant solo. Surveillé pour savoir si la production de mana ou l'avantage de carte qu'il fournit brise la courbe de mana prévue du format." } },
  { name: "Invasion of Ikoria",          type: "Battle — Siege",                       cat: "tutor",  discuss: { en: "On entry, tutors any non-Human creature from the library to hand — a versatile one-card tutor for any combo piece or finisher. In 2HC, a teammate can immediately attack the Battle and flip it, deploying its back face in the same turn the first player tutored their piece. The combination of instant creature tutor plus a powerful flip trigger accessible in one team turn creates a two-for-one play that's very difficult to disrupt without coordinated instant-speed interaction from both opponents.", fr: "À l'entrée, tutore n'importe quelle créature non-Humaine depuis la bibliothèque en main — un tuteur polyvalent pour n'importe quelle pièce de combo ou finisseur. En 2TG, un coéquipier peut immédiatement attaquer la Bataille et la retourner, déployant sa face arrière dans le même tour où le premier joueur a tutoré sa pièce." } },
  { name: "Transmute Artifact",          type: "Instant",                              cat: "tutor",  discuss: { en: "Sacrifice an artifact to tutor any artifact of equal or greater mana cost directly into play. In 2HC, any expendable mana rock can be sacrificed to immediately deploy any game-ending artifact — effectively a free deployment of Blightsteel Colossus, Darksteel Forge, or any combo piece at a fraction of its real cost. Under discussion for whether its zero-extra-mana artifact deployment is too efficient when a teammate holds protection to ensure the target resolves.", fr: "Sacrifiez un artefact pour tutorer n'importe quel artefact d'un coût de mana égal ou supérieur directement en jeu. En 2TG, n'importe quelle pierre à mana dépensable peut être sacrifiée pour déployer immédiatement un artefact de fin de partie. En discussion pour savoir si son déploiement d'artefact sans mana supplémentaire est trop efficace quand un coéquipier détient la protection." } },
  { name: "Simian Spirit Guide",         type: "Creature — Ape Shaman",                cat: "land",   discuss: { en: "Exile from hand to add one red mana — a free mana source banned in Modern for enabling turn-one plays that bypass normal development. In 2HC, both players potentially holding Spirit Guides in their opening hands creates a combined turn-one tempo that compresses the early game dramatically. Being monitored alongside Elvish Spirit Guide for whether zero-cost mana from the opening hand enables starts that are too far ahead of what fair development can answer.", fr: "Exilez depuis la main pour ajouter un mana rouge — une source de mana gratuite bannie en Modern pour permettre des jeux au premier tour contournant le développement normal. En 2TG, les deux joueurs tenant potentiellement des Spirit Guides dans leur main de départ créent un tempo combiné au premier tour qui compresse considérablement le début de partie. Surveillé aux côtés de l'Elvish Spirit Guide." } },
  { name: "Elvish Spirit Guide",         type: "Creature — Elf Shaman",                cat: "land",   discuss: { en: "Exile from hand to add one green mana — functionally identical to Simian Spirit Guide. In 2HC, green's already high ramp density combined with a free mana source on the opening hand means the casting team can develop their board one to two turns ahead of any fair response. Being monitored alongside Simian Spirit Guide for whether free-mana accelerants from hand collectively push the format's turn-one power ceiling too high.", fr: "Exilez depuis la main pour ajouter un mana vert — fonctionnellement identique au Simian Spirit Guide. En 2TG, la densité de mana déjà élevée du vert combinée à une source de mana gratuite en main de départ signifie que l'équipe qui joue peut développer son jeu d'un à deux tours devant toute réponse équitable. Surveillé aux côtés du Simian Spirit Guide." } },
  { name: "Jeska's Will",                type: "Instant",                              cat: "combo",  discuss: { en: "For each opponent, choose to add three red mana or exile the top card of that opponent's library and allow casting it this turn. In 2HC with two opponents, this produces six red mana, accesses two opposing library tops, or splits between both — all for two mana. The mana burst alone exceeds any fair ramp spell. In 2HC, the presence of two opponents makes the maximum ceiling of this card significantly higher than in any solo format, creating a high floor of at minimum six free mana mid-game.", fr: "Pour chaque adversaire, choisissez d'ajouter trois manas rouges ou d'exiler la carte du dessus de la bibliothèque de cet adversaire et permettre de la lancer ce tour. En 2TG avec deux adversaires, cela produit six manas rouges, accède aux sommets de deux bibliothèques adverses, ou se divise entre les deux — le tout pour deux manas. La seule explosion de mana dépasse n'importe quel sort de mana équitable." } },
  { name: "Baral, Chief of Compliance",  type: "Legendary Creature — Human Wizard",   cat: "combo",  discuss: { en: "Being watched as a commander. Makes each instant and sorcery cost 1 less to cast. Whenever you counter a spell, draw a card then discard a card. In 2HC, Baral's cost reduction benefits the teammate's instants and sorceries as well — a passive discount across two players' spell packages is significantly stronger than in solo Commander. Combined with the card-filtering from counters and a teammate running interaction, Baral creates a mana and card advantage advantage that compounds every turn cycle.", fr: "Surveillé en tant que commandant. Rend chaque éphémère et rituel moins cher de 1 à lancer. Chaque fois que vous contrecarrez un sort, piochez une carte puis défaussez-vous d'une carte. En 2TG, la réduction de coût de Baral bénéficie également aux éphémères et rituels du coéquipier — une remise passive sur les paquets de sorts de deux joueurs est significativement plus forte qu'en Commandant solo." } },

];

import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LangContext';
import { PageParticles } from '../components/Particles';

const LGS_TILES = [
  { title: { en: 'Built-in Socialising', fr: 'Socialisation Intégrée' }, image: 'images/lgs/built-in-socialising.jpg', text: { en: 'Random teams every event. Two strangers get 10 minutes to figure out which of their decks pair best — and walk away with a new connection.', fr: 'Des équipes aléatoires à chaque événement. Deux inconnus ont 10 minutes pour déterminer quels decks s\'associent le mieux — et repartent avec une nouvelle connexion.' } },
  { title: { en: 'Timed Rounds', fr: 'Rondes Chronométrées' }, image: 'images/lgs/predictable-round-times.jpeg', text: { en: 'Hard 50-minute rounds with 3 extra turns then draw keep the night on schedule. Teams that stall risk the clock as much as their opponents.', fr: 'Des rondes strictes de 50 minutes avec 3 tours supplémentaires puis match nul maintiennent la soirée dans les délais. Les équipes qui traînent risquent l\'horloge autant que leurs adversaires.' } },
  { title: { en: 'Two Decks Per Player', fr: 'Deux Decks par Joueur' }, image: 'images/lgs/two-decks-per-player.jpg', text: { en: 'Each player registers two decks and picks one after teams are revealed. Format knowledge and collection depth both matter.', fr: 'Chaque joueur enregistre deux decks et en choisit un après la révélation des équipes. La connaissance du format et la profondeur de la collection comptent toutes les deux.' } },
  { title: { en: 'Competitive with Heart', fr: 'Compétitif avec Cœur' }, image: 'images/lgs/competitive-with-heart.jpg', text: { en: 'Three rounds of best-of-one, randomised teams. Strong players lift weaker ones — closing the gap between competitive and casual in ways 1v1 rarely does.', fr: 'Trois rondes en partie unique, équipes aléatoires. Les joueurs forts élèvent les plus faibles — comblant l\'écart entre compétitif et casual d\'une façon que le 1v1 fait rarement.' } },
  { title: { en: 'Curated for Fairness', fr: 'Équilibré pour l\'Équité' }, image: 'images/lgs/curated-for-fairness.jpg', text: { en: 'The ban list removes infinite loops, lock strategies, and attrition wins. Proactive, board-based play is rewarded.', fr: 'La liste de bannissement supprime les boucles infinies, les stratégies de verrouillage et les victoires par attrition. Le jeu proactif basé sur le plateau est récompensé.' } },
  { title: { en: 'Memorable Moments', fr: 'Moments Mémorables' }, image: 'images/lgs/memorable-moments.jpeg', text: { en: 'Two commanders in play means twice the synergy and twice the stories. Team victories feel earned and shared.', fr: 'Deux commandants en jeu signifient deux fois plus de synergies et deux fois plus d\'histoires. Les victoires d\'équipe se sentent méritées et partagées.' } },
  { title: { en: 'Budget Friendly', fr: 'Accessible au Budget' }, image: 'images/lgs/budget-friendly.jpg', text: { en: 'Most cEDH staples are banned here. A well-built budget deck can win the whole event.', fr: 'La plupart des incontournables cEDH sont bannis ici. Un deck bien construit avec un budget limité peut remporter tout l\'événement.' } },
];

const EVENT_STEPS = [
  { en: 'Players register <strong>two legal decks</strong> before the event begins. Both decks must comply with the Two-Headed Commander banned list.', fr: 'Les joueurs enregistrent <strong>deux decks légaux</strong> avant le début de l\'événement. Les deux decks doivent respecter la liste de bannissement de Two-Headed Commander.' },
  { en: '<strong>Teams are randomly assigned</strong> at the start of the event. Neither player knows their partner until the draw — fostering new connections every event.', fr: '<strong>Les équipes sont assignées aléatoirement</strong> au début de l\'événement. Aucun joueur ne connaît son partenaire avant le tirage — favorisant de nouvelles connexions à chaque événement.' },
  { en: 'Teammates have <strong>10 minutes</strong> to discuss both of their registered decks and choose which one each player will pilot for the night. Once selected, the deck cannot be changed between rounds.', fr: 'Les coéquipiers ont <strong>10 minutes</strong> pour discuter de leurs deux decks enregistrés et choisir lequel chaque joueur pilotera pour la soirée. Une fois sélectionné, le deck ne peut pas être changé entre les rondes.' },
  { en: 'Both players on a team must pilot <strong>different commanders</strong> — this rule exists to encourage build diversity within the format. In the rare case where it can\'t be avoided (each player registered only one deck, and both share the same commander), <strong>the team draw is redone</strong>.', fr: 'Les deux joueurs d\'une même équipe doivent piloter des <strong>commandants différents</strong> — cette règle existe pour favoriser la diversité de construction dans le format. Dans les rares cas où ce serait impossible (chaque joueur n\'a enregistré qu\'un seul deck, et les deux ont le même commander), <strong>les équipes sont relancées</strong>.' },
  { en: 'Play <strong>3 rounds</strong> of Swiss pairings. Teams are matched against randomly selected opponents each round — there is no intentional draw or concession for seeding.', fr: 'Jouez <strong>3 rondes</strong> en système suisse. Les équipes sont appariées contre des adversaires sélectionnés aléatoirement à chaque ronde — il n\'y a pas de match nul intentionnel ou de concession pour le classement.' },
  { en: 'At the end of 3 rounds, the team with the best record wins. Tiebreakers are resolved by total game wins, then life total differential at time.', fr: 'À la fin des 3 rondes, l\'équipe avec le meilleur bilan remporte l\'événement. Les égalités sont départagées par le nombre total de victoires, puis par le différentiel de points de vie au moment du temps.' },
];

const TIMING_ROWS: { label: { en: string; fr: string }; value: string | { en: string; fr: string } }[] = [
  { label: { en: 'Team Reveal & Deck Selection', fr: 'Révélation des Équipes & Sélection' }, value: '10 min' },
  { label: { en: 'Round Duration (Hard Limit)', fr: 'Durée de Ronde (Limite Stricte)' }, value: '50 min' },
  { label: { en: 'Extra Turns After Time Called', fr: 'Tours Supplémentaires Après le Temps' }, value: { en: '3 turns', fr: '3 tours' } },
  { label: { en: 'Result if No Winner After Extra Turns', fr: 'Résultat Sans Gagnant Après les Tours' }, value: { en: 'Draw', fr: 'Match nul' } },
  { label: { en: 'Rounds Per Event', fr: 'Rondes par Événement' }, value: { en: '3 rounds', fr: '3 rondes' } },
  { label: { en: 'Format', fr: 'Format' }, value: { en: 'Best of One', fr: 'Partie Unique' } },
];

const ROUND_NOTE = {
  en: 'The time constraint removes hard stax, mass land destruction, and other slow-attrition strategies from the competitive space. A deck that wins by locking opponents out of mana for 45 minutes doesn\'t produce a result before the clock — so those strategies were removed from the format entirely. Players are rewarded for building toward a <em>decisive, board-based win</em>, not a prolonged prison.',
  fr: 'La contrainte de temps supprime le hard stax, la destruction massive de terrains et autres stratégies d\'attrition lente de l\'espace compétitif. Un deck qui gagne en bloquant les adversaires sans mana pendant 45 minutes ne produit pas de résultat avant l\'horloge — ces stratégies ont donc été retirées du format entièrement. Les joueurs sont récompensés pour avoir construit vers une <em>victoire décisive basée sur le plateau</em>, pas une prison prolongée.',
};

export default function RunAnEvent() {
  const { T, L } = useLang();

  return (
    <>
      <Helmet>
        <title>Run an Event — Two-Headed Commander</title>
        <meta name="description" content="Everything you need to run a Two-Headed Commander event at your local game store — format structure, timing rules, deck registration, and Swiss pairings." />
        <link rel="canonical" href="https://twoheadedcommander.com/run-an-event" />
        <meta property="og:url" content="https://twoheadedcommander.com/run-an-event" />
        <meta property="og:title" content="Run an Event — Two-Headed Commander" />
        <meta property="og:description" content="Everything you need to run a Two-Headed Commander event at your local game store — format structure, timing rules, deck registration, and Swiss pairings." />
        <meta property="og:image"       content="https://twoheadedcommander.com/favicon/apple-touch-icon.png" />
        <meta property="og:image:alt"   content="Two-Headed Commander logo" />
        <link rel="alternate" hrefLang="en"        href="https://twoheadedcommander.com/run-an-event" />
        <link rel="alternate" hrefLang="fr"        href="https://twoheadedcommander.com/run-an-event" />
        <link rel="alternate" hrefLang="x-default" href="https://twoheadedcommander.com/run-an-event" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          "name": "Two-Headed Commander Event",
          "description": "A Two-Headed Commander tournament: 3 rounds of Swiss pairings, random teams, 50-minute rounds with 2 registered decks per player.",
          "url": "https://twoheadedcommander.com/run-an-event",
          "organizer": {
            "@type": "Organization",
            "name": "Two-Headed Commander",
            "url": "https://twoheadedcommander.com/"
          },
          "sport": "Magic: The Gathering"
        })}</script>
      </Helmet>
      <PageParticles />
      <section id="lgs">
        <div className="container">
          <div className="sec-label">{T('sec.lgs-label')}</div>
          <h1 className="sec-title">{T('sec.lgs-title')}</h1>
          <p className="sec-intro">{T('sec.lgs-intro')}</p>

          <div className="lgs-grid">
            {LGS_TILES.map((t, i) => (
              <div key={i} className="lgs-card" style={{ backgroundImage: `url('${t.image}')` }}>
                <div className="lgs-card-content">
                  <h2 className="lgs-title">{L(t.title)}</h2>
                  <p className="lgs-text">{L(t.text)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="event-block">
            <div className="event-header">
              <div>
                <h2 className="event-header-title">{T('sec.event-title')}</h2>
                <div className="event-header-sub">{T('sec.event-sub')}</div>
              </div>
            </div>
            <div className="event-body">
              <div>
                <h3 className="event-col-title">{T('sec.col-how')}</h3>
                <div className="event-steps">
                  {EVENT_STEPS.map((step, i) => (
                    <div key={i} className="event-step">
                      <div className="event-step-num">{i + 1}</div>
                      <p className="event-step-text" dangerouslySetInnerHTML={{ __html: L(step) }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="event-col-title">{T('sec.col-timing')}</h3>
                <div className="timing-grid">
                  {TIMING_ROWS.map((r, i) => (
                    <div key={i} className="timing-row">
                      <span className="timing-label" dangerouslySetInnerHTML={{ __html: L(r.label) }} />
                      <span className="timing-value">{typeof r.value === 'string' ? r.value : L(r.value)}</span>
                    </div>
                  ))}
                </div>
                <div className="round-note">
                  <strong>{T('sec.round-note-lbl')}</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: L(ROUND_NOTE) }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LangContext';
import { HeroParticles, PageParticles } from '../components/Particles';

const HERO_BADGES = [
  { num: '2',   key: 'badge.per-team'    },
  { num: '60',  key: 'badge.shared-life' },
  { num: '100', key: 'badge.card-decks'  },
  { num: '4',   key: 'badge.commanders'  },
];

export default function Home() {
  const { T } = useLang();
  return (
    <>
      <Helmet>
        <title>Two-Headed Commander — 2v2 MTG Format</title>
        <meta name="description" content="Two-Headed Commander is a fan-made MTG format — 2 players, 4 commanders, 60 shared life. Discover the rules, ban list, and how to run events at your local game store." />
        <link rel="canonical" href="https://twoheadedcommander.com/" />
        <meta property="og:title"       content="Two-Headed Commander — 2v2 MTG Format" />
        <meta property="og:description" content="Two-Headed Commander is a fan-made MTG format — 2 players, 4 commanders, 60 shared life. Discover the rules, ban list, and how to run events at your local game store." />
        <meta property="og:url"         content="https://twoheadedcommander.com/" />
        <meta property="og:image"       content="https://twoheadedcommander.com/favicon/apple-touch-icon.png" />
        <meta property="og:image:alt"   content="Two-Headed Commander logo" />
        <link rel="alternate" hrefLang="en"        href="https://twoheadedcommander.com/" />
        <link rel="alternate" hrefLang="fr"        href="https://twoheadedcommander.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://twoheadedcommander.com/" />
      </Helmet>
      <PageParticles />
      <section className="hero">
        <div className="hero-bg-anim" />
        <HeroParticles />
        <img src="/images/characters/orc-zombie.png"  alt="" className="hero-char hero-char-left"  />
        <img src="/images/characters/human-elf.png"   alt="" className="hero-char hero-char-right" />
        <div className="hero-content">
          <h1 className="hero-title">
            <img src="/images/logo-vertical.png" alt="Two-Headed Commander" className="hero-logo-img" />
          </h1>
          <div className="hero-rule-badge">
            {HERO_BADGES.map((b, i) => (
              <span key={b.key} style={{ display: 'contents' }}>
                {i > 0 && <span className="badge-sep">✦</span>}
                <div className="badge-item">
                  <span className="badge-number">{b.num}</span>
                  <span className="badge-label">{T(b.key)}</span>
                </div>
              </span>
            ))}
          </div>
          <p className="hero-desc" dangerouslySetInnerHTML={{ __html: T('hero.desc') }} />
          <Link to="/how-to-play" className="hero-cta">{T('hero.cta')}</Link>
        </div>
      </section>
    </>
  );
}

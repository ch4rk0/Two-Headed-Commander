import { Helmet } from 'react-helmet-async';
import { PageParticles } from '../components/Particles';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Two-Headed Commander</title>
        <meta name="description" content="Privacy policy for Two-Headed Commander — how we use Google Analytics and what data we collect." />
        <link rel="canonical" href="https://twoheadedcommander.com/privacy" />
        <meta property="og:title"       content="Privacy Policy — Two-Headed Commander" />
        <meta property="og:description" content="Privacy policy for Two-Headed Commander — how we use Google Analytics and what data we collect." />
        <meta property="og:url"         content="https://twoheadedcommander.com/privacy" />
        <meta property="og:image"       content="https://twoheadedcommander.com/favicon/apple-touch-icon.png" />
        <meta property="og:image:alt"   content="Two-Headed Commander logo" />
        <link rel="alternate" hrefLang="en"        href="https://twoheadedcommander.com/privacy" />
        <link rel="alternate" hrefLang="fr"        href="https://twoheadedcommander.com/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://twoheadedcommander.com/privacy" />
      </Helmet>
      <PageParticles />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', maxWidth: 740, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Cormorant SC', serif", color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '2rem' }}>Privacy Policy</h1>

        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Two-Headed Commander is a fan-made website. We take your privacy seriously and collect only what is needed to understand how the site is used.
        </p>

        <h2 style={{ fontFamily: "'Cormorant SC', serif", color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.75rem', marginTop: '2rem' }}>Google Analytics</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          With your consent, we use Google Analytics to collect anonymised data about page visits, session duration, and navigation patterns. This data helps us understand which content is most useful and improve the site accordingly. No personally identifiable information is collected.
        </p>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Analytics only loads after you explicitly accept cookies. You can withdraw consent at any time via the Cookie Settings link in the footer.
        </p>

        <h2 style={{ fontFamily: "'Cormorant SC', serif", color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.75rem', marginTop: '2rem' }}>Cookies</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          We store a single cookie (<code style={{ background: 'rgba(255,255,255,.07)', padding: '.1em .35em', borderRadius: 3 }}>thc_cookie</code>) to remember your analytics preference, and a second (<code style={{ background: 'rgba(255,255,255,.07)', padding: '.1em .35em', borderRadius: 3 }}>thc_lang</code>) to remember your language choice. Neither contains personal data.
        </p>

        <h2 style={{ fontFamily: "'Cormorant SC', serif", color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.75rem', marginTop: '2rem' }}>Third Parties</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Card images are loaded on demand from <a href="https://scryfall.com" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>Scryfall</a>. Their privacy policy governs any data collected by their CDN. We do not share any data with other third parties.
        </p>

        <h2 style={{ fontFamily: "'Cormorant SC', serif", color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.75rem', marginTop: '2rem' }}>Contact</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>
          This is a fan-made project. Magic: The Gathering is property of Wizards of the Coast. If you have questions about this privacy policy, please reach out via the community channels listed on the site.
        </p>

        <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginTop: '2rem', fontSize: '.85rem', opacity: .6 }}>
          Last updated: {__BUILD_DATE__}
        </p>
      </div>
    </>
  );
}

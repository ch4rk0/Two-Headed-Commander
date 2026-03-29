import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function Nav() {
  const { T, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const { posts } = useBlogPosts();
  const hasBlog = posts.length > 0;

  // Close menu on resize
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <img src="/images/logo-horizontal.png" alt="Two-Headed Commander" className="nav-logo-img" />
        </Link>

        <button
          id="nav-hamburger"
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li>
            <NavLink to="/how-to-play" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>
              {T('nav.how-to-play')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/run-an-event" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>
              {T('nav.run-event')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/banned-list" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>
              {T('nav.banned')}
            </NavLink>
          </li>
          {hasBlog && (
            <li>
              <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>
                {T('nav.blog')}
              </NavLink>
            </li>
          )}
          <li className="nav-lang-item">
            <button
              id="lang-toggle"
              className="lang-toggle-btn"
              aria-label="Switch language / Changer de langue"
              onClick={() => { setLang(lang === 'en' ? 'fr' : 'en'); setMenuOpen(false); }}
            >
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
          </li>
        </ul>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}

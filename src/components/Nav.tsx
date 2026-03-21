import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';

export default function Nav() {
  const { T, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

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
          Two&#8209;Headed <span>Commander</span>
        </Link>

        <button
          id="nav-hamburger"
          className={`hamburger${menuOpen ? ' open' : ''}`}
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

import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';

export default function Footer() {
  const { T } = useLang();
  return (
    <footer>
      <div className="footer-logo">Two&#8209;Headed <span>Commander</span></div>
      <p className="footer-note">{T('footer.note')}</p>
      <div className="footer-legal">
        <Link to="/privacy" className="footer-legal-link">{T('footer.privacy')}</Link>
        <button className="footer-legal-link footer-legal-btn" onClick={() => (window as any).showCookiePreferences?.()}>
          {T('footer.cookies')}
        </button>
      </div>
      <p className="footer-version">{__BUILD_VERSION__}</p>
    </footer>
  );
}

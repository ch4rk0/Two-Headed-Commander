import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/admin',           end: true,  icon: '⊞', label: 'Dashboard'  },
  { to: '/admin/blog',      end: false, icon: '✎', label: 'Blog'        },
  { to: '/admin/banlist',   end: false, icon: '⚔', label: 'Ban List'    },
  { to: '/admin/watchlist', end: false, icon: '◎', label: 'Watchlist'   },
  { to: '/admin/users',     end: false, icon: '◈', label: 'Users'       },
];

function LoginScreen({ signIn, error }: { signIn: () => void; error: string | null }) {
  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-crest">⚔</div>
          <div className="admin-login-brand-name">
            Two&#8209;Headed<br /><span>Commander</span>
          </div>
        </div>
        <div className="admin-login-divider" />
        <h1 className="admin-login-heading">Admin Panel</h1>
        <p className="admin-login-sub">Sign in with an authorised Google account to continue.</p>
        {error && <p className="admin-login-error">{error}</p>}
        <button className="admin-google-btn" onClick={signIn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, isAdmin, loading, signIn, signOut, error } = useAuth();
  const [expanded, setExpanded] = useState(true);

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (!user || !isAdmin) return <LoginScreen signIn={signIn} error={error} />;

  return (
    <div className={`admin-shell${expanded ? ' expanded' : ''}`}>

      {/* Compact icon rail — hidden when expanded */}
      <div className="admin-rail">
        <div className="admin-rail-logo">⚔</div>
        <div className="admin-rail-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-rail-btn${isActive ? ' active' : ''}`}
              title={item.label}
            >
              <span className="admin-rail-icon">{item.icon}</span>
            </NavLink>
          ))}
        </div>
        <button
          className="admin-rail-toggle"
          onClick={() => setExpanded(true)}
          aria-label="Expand menu"
          title="Expand menu"
        >▸</button>
        <button className="admin-rail-signout" onClick={signOut} title="Sign out" aria-label="Sign out">⏻</button>
      </div>

      {/* Expanded label panel — hidden when compact */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <span className="admin-panel-title">THC Admin</span>
          <button
            className="admin-panel-toggle"
            onClick={() => setExpanded(false)}
            aria-label="Collapse menu"
            title="Collapse menu"
          >◂</button>
        </div>
        <div className="admin-panel-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-panel-link${isActive ? ' active' : ''}`}
            >
              <span className="admin-panel-link-icon">{item.icon}</span>
              <span className="admin-panel-link-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="admin-panel-footer">
          <span className="admin-panel-email">{user.email}</span>
        </div>
      </div>

      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}

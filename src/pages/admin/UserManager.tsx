import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ConfigDoc {
  emails: string[];
  superadmin: string;
}

export default function UserManager() {
  const { user, isSuperAdmin } = useAuth();
  const [config, setConfig]     = useState<ConfigDoc>({ emails: [], superadmin: '' });
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving]     = useState(false);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'config', 'allowed_emails')).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setConfig({ emails: d.emails ?? [], superadmin: d.superadmin ?? '' });
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <div className="admin-loading">Loading…</div>;

  if (!isSuperAdmin) {
    return (
      <div className="admin-section">
        <h1 className="admin-page-title">Authorised Users</h1>
        <p className="admin-page-sub" style={{ color: 'var(--text2)', marginTop: '1rem' }}>
          Only the superadmin can add or remove users.
        </p>
        <ul className="admin-user-list">
          {config.emails.map(email => (
            <li key={email} className="admin-user-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span>{email}</span>
                {email === config.superadmin && <span className="admin-role-badge superadmin">Superadmin</span>}
                {email === user?.email && <span className="admin-role-badge you">You</span>}
              </div>
            </li>
          ))}
          {config.emails.length === 0 && <li className="admin-empty">No users yet.</li>}
        </ul>
      </div>
    );
  }

  const saveConfig = async (next: ConfigDoc) => {
    setSaving(true);
    await setDoc(doc(db, 'config', 'allowed_emails'), next);
    setConfig(next);
    setSaving(false);
  };

  const add = () => {
    const e = newEmail.trim().toLowerCase();
    if (!e || config.emails.includes(e)) return;
    saveConfig({ ...config, emails: [...config.emails, e] });
    setNewEmail('');
  };

  const remove = (email: string) => {
    if (email === user?.email) return alert('You cannot remove yourself.');
    saveConfig({ ...config, emails: config.emails.filter(e => e !== email) });
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Authorised Users</h1>
      <p className="admin-page-sub">Only these Google accounts can access the admin panel.</p>

      {/* Superadmin indicator */}
      <div className="admin-superadmin-block">
        <div className="admin-superadmin-label">
          <span className="admin-role-badge superadmin">Superadmin</span>
          <span className="admin-superadmin-email">{config.superadmin}</span>
        </div>
      </div>

      {/* Add user */}
      <div className="admin-user-add">
        <input
          className="admin-input"
          type="email"
          placeholder="friend@gmail.com"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="admin-btn-primary" onClick={add} disabled={saving}>Add</button>
      </div>

      {/* User list */}
      <ul className="admin-user-list">
        {config.emails.map(email => (
          <li key={email} className="admin-user-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span>{email}</span>
              {email === config.superadmin && <span className="admin-role-badge superadmin">Superadmin</span>}
              {email === user?.email && <span className="admin-role-badge you">You</span>}
            </div>
            {email !== user?.email && (
              <button className="admin-btn-sm danger" onClick={() => remove(email)} disabled={saving}>Remove</button>
            )}
          </li>
        ))}
        {config.emails.length === 0 && <li className="admin-empty">No users yet.</li>}
      </ul>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function UserManager() {
  const { user } = useAuth();
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'config', 'allowed_emails')).then(snap => {
      if (snap.exists()) setEmails(snap.data().emails ?? []);
    });
  }, []);

  const save = async (list: string[]) => {
    setSaving(true);
    await setDoc(doc(db, 'config', 'allowed_emails'), { emails: list });
    setEmails(list);
    setSaving(false);
  };

  const add = () => {
    const e = newEmail.trim().toLowerCase();
    if (!e || emails.includes(e)) return;
    save([...emails, e]);
    setNewEmail('');
  };

  const remove = (email: string) => {
    if (email === user?.email) return alert('You cannot remove yourself.');
    save(emails.filter(e => e !== email));
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Authorised Users</h1>
      <p className="admin-page-sub">Only these Google accounts can access the admin panel.</p>

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

      <ul className="admin-user-list">
        {emails.map(email => (
          <li key={email} className="admin-user-item">
            <span>{email}</span>
            {email === user?.email
              ? <span className="admin-user-you">(you)</span>
              : <button className="admin-btn-sm danger" onClick={() => remove(email)}>Remove</button>
            }
          </li>
        ))}
        {emails.length === 0 && <li className="admin-empty">No users yet.</li>}
      </ul>
    </div>
  );
}

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { BANNED_CARDS_SEED, WATCHLIST_CARDS_SEED } from '../../data/banned-cards.seed';
import { BLOG_POSTS_SEED } from '../../data/blog-posts.seed';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const seed = async () => {
    if (!confirm('This will overwrite banned_cards and blog_posts in Firestore with the seed data. Continue?')) return;
    setSeeding(true);
    try {
      await setDoc(doc(db, 'banned_cards', 'list'), {
        cards: BANNED_CARDS_SEED,
        watchlist: WATCHLIST_CARDS_SEED,
      });
      for (const post of BLOG_POSTS_SEED) {
        await setDoc(doc(db, 'blog_posts', post.slug), post);
      }
      setSeedDone(true);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Welcome back, {user?.displayName ?? user?.email}.</p>

      <div className="admin-dashboard-setup">
        <div className="admin-dashboard-setup-label">One-time setup</div>
        <p className="admin-dashboard-setup-desc">
          Populate Firestore with the existing ban list and blog post data. Only needed once on a fresh project.
        </p>
        <button className="admin-btn-primary" onClick={seed} disabled={seeding || seedDone}>
          {seeding ? 'Seeding…' : seedDone ? 'Seeded ✓' : 'Seed Database'}
        </button>
      </div>
    </div>
  );
}

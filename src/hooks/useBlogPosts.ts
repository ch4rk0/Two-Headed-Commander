import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { BlogPost } from '../data/blog-posts.seed';

export function useBlogPosts(adminMode = false) {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, 'blog_posts');
    const q = adminMode
      ? query(col, orderBy('date', 'desc'))
      : query(col, where('published', '==', true), orderBy('date', 'desc'));

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ ...d.data(), slug: d.id } as BlogPost)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [adminMode]);

  return { posts, loading };
}

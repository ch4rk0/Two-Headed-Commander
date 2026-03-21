import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { BannedCard, WatchlistCard } from '../data/banned-cards.seed';

export function useBannedCards() {
  const [cards, setCards]         = useState<BannedCard[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistCard[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'banned_cards', 'list'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCards(data.cards ?? []);
        setWatchlist(data.watchlist ?? []);
      }
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { cards, watchlist, loading };
}

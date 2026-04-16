import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface VoteSummary {
  up: number;
  neutral: number;
  down: number;
}

/** Subscribes to the entire card_discussions collection and returns a map
 *  of sanitized doc ID → vote summary. */
export function useAllDiscussions(): Record<string, VoteSummary> {
  const [summaries, setSummaries] = useState<Record<string, VoteSummary>>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'card_discussions'), snapshot => {
      const result: Record<string, VoteSummary> = {};
      snapshot.forEach(docSnap => {
        const votes: Record<string, string> = docSnap.data().votes ?? {};
        result[docSnap.id] = {
          up:      Object.values(votes).filter(v => v === 'up').length,
          neutral: Object.values(votes).filter(v => v === 'neutral').length,
          down:    Object.values(votes).filter(v => v === 'down').length,
        };
      });
      setSummaries(result);
    });
    return unsub;
  }, []);

  return summaries;
}

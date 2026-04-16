import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, FieldPath } from 'firebase/firestore';
import { db } from '../firebase';

export type VoteValue = 'up' | 'down' | 'neutral';

export interface DiscussionNote {
  id: string;
  authorEmail: string;
  text: string;
  createdAt: string;
  editedAt?: string;
}

function docId(cardName: string) {
  return cardName.replace(/[^a-zA-Z0-9\-_' ]/g, '_');
}

export function useCardDiscussion(cardName: string) {
  const [votes, setVotes]   = useState<Record<string, VoteValue>>({});
  const [notes, setNotes]   = useState<DiscussionNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardName) return;
    const ref = doc(db, 'card_discussions', docId(cardName));
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setVotes(data.votes ?? {});
        setNotes(data.notes ?? []);
      } else {
        setVotes({});
        setNotes([]);
      }
      setLoading(false);
    });
    return unsub;
  }, [cardName]);

  const setVote = async (userEmail: string, value: VoteValue) => {
    const ref = doc(db, 'card_discussions', docId(cardName));
    try {
      await updateDoc(ref, new FieldPath('votes', userEmail), value);
    } catch {
      await setDoc(ref, { votes: { [userEmail]: value }, notes: [] });
    }
  };

  const addNote = async (userEmail: string, text: string) => {
    const ref = doc(db, 'card_discussions', docId(cardName));
    const newNote: DiscussionNote = {
      id: crypto.randomUUID(),
      authorEmail: userEmail,
      text,
      createdAt: new Date().toISOString(),
    };
    await setDoc(ref, { notes: [...notes, newNote] }, { merge: true });
  };

  const editNote = async (noteId: string, newText: string) => {
    const ref = doc(db, 'card_discussions', docId(cardName));
    const updated = notes.map(n =>
      n.id === noteId ? { ...n, text: newText, editedAt: new Date().toISOString() } : n
    );
    await updateDoc(ref, { notes: updated });
  };

  const deleteNote = async (noteId: string) => {
    const ref = doc(db, 'card_discussions', docId(cardName));
    await updateDoc(ref, { notes: notes.filter(n => n.id !== noteId) });
  };

  return { votes, notes, loading, setVote, addNote, editNote, deleteNote };
}

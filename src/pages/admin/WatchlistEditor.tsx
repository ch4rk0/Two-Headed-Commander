import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useBannedCards } from '../../hooks/useBannedCards';
import type { WatchlistCard } from '../../data/banned-cards.seed';

export default function WatchlistEditor() {
  const { watchlist, loading } = useBannedCards();
  const [editing, setEditing]  = useState<Record<string, string>>({});
  const [saving, setSaving]    = useState<string | null>(null);
  const [addOpen, setAddOpen]  = useState(false);
  const [newCard, setNewCard]  = useState<Partial<WatchlistCard>>({ cat: 'combo' });

  const getEdit = (name: string, discuss: string) => editing[name] ?? discuss;

  const saveDiscuss = async (card: WatchlistCard) => {
    setSaving(card.name);
    const updated = watchlist.map(c =>
      c.name === card.name ? { ...c, discuss: editing[card.name] ?? c.discuss } : c
    );
    await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: updated });
    setSaving(null);
  };

  const deleteCard = async (name: string) => {
    if (!confirm(`Remove "${name}" from the watchlist?`)) return;
    const updated = watchlist.filter(c => c.name !== name);
    await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: updated });
  };

  const addCard = async () => {
    if (!newCard.name || !newCard.type) return alert('Name and type are required');
    const card: WatchlistCard = { name: newCard.name!, type: newCard.type!, cat: newCard.cat ?? 'combo', discuss: '' };
    await updateDoc(doc(db, 'banned_cards', 'list'), { watchlist: [...watchlist, card] });
    setNewCard({ cat: 'combo' });
    setAddOpen(false);
  };

  if (loading) return <div className="admin-loading">Loading watchlist…</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-page-title">Watchlist Editor</h1>
        <button className="admin-btn-primary" onClick={() => setAddOpen(o => !o)}>+ Add Card</button>
      </div>

      {addOpen && (
        <div className="admin-add-card-form">
          <h3>Add to Watchlist</h3>
          <div className="admin-field-row"><label>Name *</label><input className="admin-input" value={newCard.name ?? ''} onChange={e => setNewCard(n => ({ ...n, name: e.target.value }))} /></div>
          <div className="admin-field-row"><label>Type *</label><input className="admin-input" value={newCard.type ?? ''} onChange={e => setNewCard(n => ({ ...n, type: e.target.value }))} /></div>
          <div className="admin-field-row"><label>Category</label><input className="admin-input" value={newCard.cat ?? ''} onChange={e => setNewCard(n => ({ ...n, cat: e.target.value }))} /></div>
          <button className="admin-btn-primary" onClick={addCard}>Add to Watchlist</button>
        </div>
      )}

      <div className="admin-ban-list">
        {watchlist.map(card => {
          const ed = getEdit(card.name, card.discuss);
          const dirty = editing[card.name] !== undefined;
          return (
            <div key={card.name} className="admin-ban-card">
              <div className="admin-ban-card-header">
                <strong>{card.name}</strong>
                <button className="admin-btn-sm danger" onClick={() => deleteCard(card.name)}>Delete</button>
              </div>
              <div className="admin-field-row">
                <label>Discussion note</label>
                <textarea className="admin-input" rows={4} value={ed}
                  onChange={e => setEditing(prev => ({ ...prev, [card.name]: e.target.value }))} />
              </div>
              {dirty && (
                <button className="admin-btn-primary" onClick={() => saveDiscuss(card)} disabled={saving === card.name}>
                  {saving === card.name ? 'Saving…' : 'Save'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

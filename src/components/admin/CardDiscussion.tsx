import { useState } from 'react';
import { useCardDiscussion, type VoteValue, type DiscussionNote } from '../../hooks/useCardDiscussion';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  cardName: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function CardDiscussion({ cardName }: Props) {
  const { user } = useAuth();
  const { votes, notes, loading, setVote, addNote, editNote, deleteNote } = useCardDiscussion(cardName);
  const [noteText, setNoteText]   = useState('');
  const [posting, setPosting]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText]   = useState('');

  const email   = user?.email ?? '';
  const myVote  = votes[email] ?? 'neutral';
  const upCount = Object.values(votes).filter(v => v === 'up').length;
  const downCount = Object.values(votes).filter(v => v === 'down').length;
  const neutralCount = Object.values(votes).filter(v => v === 'neutral').length;

  const handleVote = (value: VoteValue) => {
    if (!email) return;
    setVote(email, value);
  };

  const handlePost = async () => {
    if (!noteText.trim() || !email) return;
    setPosting(true);
    try {
      await addNote(email, noteText.trim());
      setNoteText('');
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    await editNote(id, editText.trim());
    setEditingId(null);
  };

  const handleDelete = async (note: DiscussionNote) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(note.id);
  };

  const startEdit = (note: DiscussionNote) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  if (loading) return null;

  return (
    <div className="card-discussion">
      <div className="card-discussion-header">
        <h3 className="card-discussion-title">Admin Discussion</h3>
      </div>

      {/* Votes */}
      <div className="card-discussion-votes">
        <span className="card-discussion-votes-label">Banned:</span>
        <div className="card-discussion-vote-btns">
          <button
            className={`card-vote-btn up ${myVote === 'up' ? 'active' : ''}`}
            onClick={() => handleVote('up')}
            title="Keep banned"
          >
            👍 <span className="card-vote-count">{upCount}</span>
          </button>
          <button
            className={`card-vote-btn neutral ${myVote === 'neutral' ? 'active' : ''}`}
            onClick={() => handleVote('neutral')}
            title="Neutral"
          >
            — <span className="card-vote-count">{neutralCount}</span>
          </button>
          <button
            className={`card-vote-btn down ${myVote === 'down' ? 'active' : ''}`}
            onClick={() => handleVote('down')}
            title="Unban"
          >
            👎 <span className="card-vote-count">{downCount}</span>
          </button>
        </div>
      </div>

      {/* Notes thread */}
      <div className="card-discussion-notes">
        {notes.length === 0 && (
          <p className="admin-empty" style={{ marginBottom: '.75rem' }}>No notes yet.</p>
        )}
        {notes.map(note => (
          <div key={note.id} className="card-discussion-note">
            <div className="card-discussion-note-header">
              <span className="card-discussion-note-author">{note.authorEmail.split('@')[0]}</span>
              <span className="card-discussion-note-date">{formatDate(note.createdAt)}</span>
              {note.editedAt && <span className="card-discussion-note-edited">(edited)</span>}
              {note.authorEmail === email && editingId !== note.id && (
                <div className="card-discussion-note-actions">
                  <button className="admin-btn-sm" onClick={() => startEdit(note)}>Edit</button>
                  <button className="admin-btn-sm danger" onClick={() => handleDelete(note)}>Delete</button>
                </div>
              )}
            </div>
            {editingId === note.id ? (
              <div className="card-discussion-edit">
                <textarea
                  className="admin-input"
                  rows={3}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.4rem' }}>
                  <button className="admin-btn-primary" onClick={() => handleEdit(note.id)}>Save</button>
                  <button className="admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <p className="card-discussion-note-text">{note.text}</p>
            )}
          </div>
        ))}
      </div>

      {/* Add note */}
      <div className="card-discussion-add">
        <textarea
          className="admin-input"
          rows={3}
          placeholder="Add a note… (Ctrl+Enter to post)"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost(); }}
        />
        <button
          className="admin-btn-primary"
          style={{ alignSelf: 'flex-end' }}
          onClick={handlePost}
          disabled={posting || !noteText.trim()}
        >
          {posting ? 'Posting…' : 'Post Note'}
        </button>
      </div>
    </div>
  );
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ── Firebase mocks ─────────────────────────────────────────────────────────
vi.mock('../../../firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  doc:        vi.fn(() => 'mock-ref'),
  onSnapshot: vi.fn((_ref, cb) => {
    cb({ exists: () => false });
    return () => {};
  }),
  updateDoc:  vi.fn().mockResolvedValue(undefined),
  setDoc:     vi.fn().mockResolvedValue(undefined),
  FieldPath:  class FieldPath {
    segments: string[];
    constructor(...segments: string[]) { this.segments = segments; }
  },
}));

// ── Auth mock ──────────────────────────────────────────────────────────────
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: { email: 'admin@example.com' } })),
}));

import CardDiscussion from '../CardDiscussion';
import { onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';

const mockOnSnapshot = vi.mocked(onSnapshot);
const mockSetDoc     = vi.mocked(setDoc);
const mockUpdateDoc  = vi.mocked(updateDoc);
const mockUseAuth    = vi.mocked(useAuth);

function snapshotWith(data: Record<string, unknown> | null) {
  const impl = (_ref: unknown, cb: (snap: unknown) => void) => {
    if (data === null) {
      cb({ exists: () => false });
    } else {
      cb({ exists: () => true, data: () => data });
    }
    return () => {};
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockOnSnapshot.mockImplementation(impl as any);
}

describe('CardDiscussion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { email: 'admin@example.com' } } as ReturnType<typeof useAuth>);
    snapshotWith(null);
  });

  it('renders the Admin Discussion title', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByText('Admin Discussion')).toBeInTheDocument();
  });

  it('renders the three vote buttons', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByTitle('Keep banned')).toBeInTheDocument();
    expect(screen.getByTitle('Neutral')).toBeInTheDocument();
    expect(screen.getByTitle('Unban')).toBeInTheDocument();
  });

  it('shows "Banned:" label', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByText('Banned:')).toBeInTheDocument();
  });

  it('shows zero counts when no votes exist', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    const counts = screen.getAllByText('0');
    expect(counts.length).toBeGreaterThanOrEqual(3);
  });

  it('highlights the current user\'s active vote', () => {
    snapshotWith({ votes: { 'admin@example.com': 'up' }, notes: [] });
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByTitle('Keep banned')).toHaveClass('active');
    expect(screen.getByTitle('Neutral')).not.toHaveClass('active');
    expect(screen.getByTitle('Unban')).not.toHaveClass('active');
  });

  it('shows correct vote counts', () => {
    snapshotWith({
      votes: { 'a@a.com': 'up', 'b@b.com': 'up', 'c@c.com': 'down' },
      notes: [],
    });
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    // 2 up, 1 down, 0 neutral
    const upBtn = screen.getByTitle('Keep banned');
    const downBtn = screen.getByTitle('Unban');
    expect(upBtn.querySelector('.card-vote-count')?.textContent).toBe('2');
    expect(downBtn.querySelector('.card-vote-count')?.textContent).toBe('1');
  });

  it('calls setVote when a vote button is clicked', async () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    fireEvent.click(screen.getByTitle('Keep banned'));
    await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalled());
  });

  it('shows "No notes yet." when thread is empty', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByText('No notes yet.')).toBeInTheDocument();
  });

  it('renders existing notes with author and text', () => {
    snapshotWith({
      votes: {},
      notes: [{
        id: 'n1',
        authorEmail: 'admin@example.com',
        text: 'This card needs to go.',
        createdAt: '2026-01-01T00:00:00.000Z',
      }],
    });
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByText('This card needs to go.')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('shows Edit and Delete only for own notes', () => {
    snapshotWith({
      votes: {},
      notes: [
        { id: 'n1', authorEmail: 'admin@example.com', text: 'Mine', createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 'n2', authorEmail: 'other@example.com', text: 'Theirs', createdAt: '2026-01-01T00:00:00.000Z' },
      ],
    });
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    // Only one Edit and one Delete button (for own note)
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);
  });

  it('shows edit textarea when Edit is clicked', async () => {
    snapshotWith({
      votes: {},
      notes: [{ id: 'n1', authorEmail: 'admin@example.com', text: 'Original', createdAt: '2026-01-01T00:00:00.000Z' }],
    });
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => expect(screen.getByDisplayValue('Original')).toBeInTheDocument());
  });

  it('posts a new note when Post Note is clicked', async () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    const textarea = screen.getByPlaceholderText(/Add a note/);
    fireEvent.change(textarea, { target: { value: 'New note text' } });
    fireEvent.click(screen.getByRole('button', { name: 'Post Note' }));
    await waitFor(() => expect(mockSetDoc).toHaveBeenCalledWith(
      'mock-ref',
      expect.objectContaining({
        notes: expect.arrayContaining([
          expect.objectContaining({ text: 'New note text', authorEmail: 'admin@example.com' }),
        ]),
      }),
      { merge: true },
    ));
  });

  it('Post Note button is disabled when textarea is empty', () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    expect(screen.getByRole('button', { name: 'Post Note' })).toBeDisabled();
  });

  it('clears textarea after posting', async () => {
    render(<CardDiscussion cardName="Braids, Cabal Minion" />);
    const textarea = screen.getByPlaceholderText(/Add a note/);
    fireEvent.change(textarea, { target: { value: 'Something' } });
    fireEvent.click(screen.getByRole('button', { name: 'Post Note' }));
    await waitFor(() => expect(textarea).toHaveValue(''));
  });
});

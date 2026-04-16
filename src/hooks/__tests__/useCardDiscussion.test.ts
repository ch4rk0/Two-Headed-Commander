import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// ── Firebase mocks ─────────────────────────────────────────────────────────
const mockOnSnapshot = vi.fn();
const mockUpdateDoc  = vi.fn();
const mockSetDoc     = vi.fn();
const mockDoc        = vi.fn(() => 'mock-ref');

vi.mock('../../firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  doc:        (...args: unknown[]) => mockDoc(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  updateDoc:  (...args: unknown[]) => mockUpdateDoc(...args),
  setDoc:     (...args: unknown[]) => mockSetDoc(...args),
  FieldPath:  class FieldPath {
    segments: string[];
    constructor(...segments: string[]) { this.segments = segments; }
  },
}));

import { useCardDiscussion } from '../useCardDiscussion';

// Helper: simulate Firestore snapshot arriving with given data
function fireSnapshot(cb: (snap: unknown) => void, data: Record<string, unknown> | null) {
  if (data === null) {
    cb({ exists: () => false });
  } else {
    cb({ exists: () => true, data: () => data });
  }
}

describe('useCardDiscussion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshot.mockImplementation((_ref, cb) => {
      fireSnapshot(cb, null); // empty doc by default
      return () => {};
    });
    mockUpdateDoc.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
  });

  it('returns empty votes and notes when document does not exist', () => {
    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));
    expect(result.current.votes).toEqual({});
    expect(result.current.notes).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('loads votes and notes from snapshot', () => {
    mockOnSnapshot.mockImplementation((_ref, cb) => {
      fireSnapshot(cb, {
        votes: { 'admin@example.com': 'up' },
        notes: [{ id: '1', authorEmail: 'admin@example.com', text: 'Test note', createdAt: '2026-01-01T00:00:00.000Z' }],
      });
      return () => {};
    });

    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));
    expect(result.current.votes).toEqual({ 'admin@example.com': 'up' });
    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].text).toBe('Test note');
  });

  it('uses FieldPath to set vote (handles dots in email)', async () => {
    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));

    await act(async () => {
      await result.current.setVote('user@hotmail.com', 'up');
    });

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [, fieldPath, value] = mockUpdateDoc.mock.calls[0];
    // FieldPath segments must be ['votes', 'user@hotmail.com'] — not a dot-notation string
    expect(fieldPath.segments).toEqual(['votes', 'user@hotmail.com']);
    expect(value).toBe('up');
  });

  it('creates document via setDoc when updateDoc fails (first vote)', async () => {
    mockUpdateDoc.mockRejectedValueOnce(new Error('No document'));

    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));

    await act(async () => {
      await result.current.setVote('user@example.com', 'down');
    });

    expect(mockSetDoc).toHaveBeenCalledWith(
      'mock-ref',
      { votes: { 'user@example.com': 'down' }, notes: [] },
    );
  });

  it('sanitizes card name with special characters for doc ID', () => {
    renderHook(() => useCardDiscussion('Fire // Ice'));
    expect(mockDoc).toHaveBeenCalledWith({}, 'card_discussions', 'Fire __ Ice');
  });

  it('adds a note via setDoc with merge', async () => {
    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));

    await act(async () => {
      await result.current.addNote('admin@example.com', 'This card is broken');
    });

    expect(mockSetDoc).toHaveBeenCalledWith(
      'mock-ref',
      expect.objectContaining({
        notes: expect.arrayContaining([
          expect.objectContaining({
            authorEmail: 'admin@example.com',
            text: 'This card is broken',
          }),
        ]),
      }),
      { merge: true },
    );
  });

  it('edits a note by ID', async () => {
    mockOnSnapshot.mockImplementation((_ref, cb) => {
      fireSnapshot(cb, {
        votes: {},
        notes: [{ id: 'note-1', authorEmail: 'admin@example.com', text: 'Original', createdAt: '2026-01-01T00:00:00.000Z' }],
      });
      return () => {};
    });

    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));

    await act(async () => {
      await result.current.editNote('note-1', 'Updated text');
    });

    const [, update] = mockUpdateDoc.mock.calls[0];
    expect(update.notes[0].text).toBe('Updated text');
    expect(update.notes[0].editedAt).toBeDefined();
  });

  it('deletes a note by ID', async () => {
    mockOnSnapshot.mockImplementation((_ref, cb) => {
      fireSnapshot(cb, {
        votes: {},
        notes: [
          { id: 'note-1', authorEmail: 'a@a.com', text: 'Keep', createdAt: '2026-01-01T00:00:00.000Z' },
          { id: 'note-2', authorEmail: 'b@b.com', text: 'Delete me', createdAt: '2026-01-01T00:00:00.000Z' },
        ],
      });
      return () => {};
    });

    const { result } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));

    await act(async () => {
      await result.current.deleteNote('note-2');
    });

    const [, update] = mockUpdateDoc.mock.calls[0];
    expect(update.notes).toHaveLength(1);
    expect(update.notes[0].id).toBe('note-1');
  });

  it('unsubscribes from onSnapshot on unmount', () => {
    const unsubscribe = vi.fn();
    mockOnSnapshot.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useCardDiscussion('Braids, Cabal Minion'));
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});

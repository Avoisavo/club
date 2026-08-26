import { STORAGE_KEY, defaultNotes, type Note } from "./board";

export type Board = { loaded: boolean; notes: Note[] };

/**
 * The board lives outside React so the pinned notes can be read straight from
 * localStorage on the client without a hydration mismatch on the server.
 */
const EMPTY: Board = { loaded: false, notes: [] };
let snapshot: Board = EMPTY;
const listeners = new Set<() => void>();

function read(): Note[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultNotes();
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : defaultNotes();
  } catch {
    return defaultNotes();
  }
}

function write(notes: Note[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    /* board is fuller than the quota allows — keep going in memory */
  }
}

export function subscribe(listener: () => void) {
  if (!snapshot.loaded) snapshot = { loaded: true, notes: read() };
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getSnapshot = () => snapshot;
export const getServerSnapshot = () => EMPTY;

export function setNotes(update: Note[] | ((prev: Note[]) => Note[])) {
  const notes =
    typeof update === "function" ? update(snapshot.notes) : update;
  snapshot = { loaded: true, notes };
  write(notes);
  listeners.forEach((l) => l());
}

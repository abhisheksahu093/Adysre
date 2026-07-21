/**
 * Design Playground - undo/redo over the command stack.
 *
 * The history stores INVERSES, not snapshots: each entry is the command that
 * undoes a change plus the command that redoes it. A 10,000-node document
 * therefore costs a few hundred bytes per edit instead of a full copy.
 */

import type { Command } from './commands';
import type { Document } from './types';

export interface HistoryEntry {
  /** Label for the (Phase 3) history timeline; the command's own type. */
  type: string;
  undo: Command;
  redo: Command;
}

export interface History {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

/** How many steps are kept. Beyond this the oldest are dropped. */
export const HISTORY_LIMIT = 200;

export const emptyHistory: History = { past: [], future: [] };

/**
 * Apply a command and record it.
 *
 * Doing anything new clears the redo stack - the standard contract: history is
 * a line, not a tree, and a fresh edit is the new end of it.
 */
export function commit(
  doc: Document,
  history: History,
  command: Command,
): { doc: Document; history: History } {
  const undo = command.invert(doc);
  const next = command.apply(doc);
  const past = [...history.past, { type: command.type, undo, redo: command }].slice(-HISTORY_LIMIT);
  return { doc: next, history: { past, future: [] } };
}

export function undo(doc: Document, history: History): { doc: Document; history: History } {
  const entry = history.past[history.past.length - 1];
  if (!entry) return { doc, history };
  return {
    doc: entry.undo.apply(doc),
    history: { past: history.past.slice(0, -1), future: [entry, ...history.future] },
  };
}

export function redo(doc: Document, history: History): { doc: Document; history: History } {
  const [entry, ...rest] = history.future;
  if (!entry) return { doc, history };
  return {
    doc: entry.redo.apply(doc),
    history: { past: [...history.past, entry].slice(-HISTORY_LIMIT), future: rest },
  };
}

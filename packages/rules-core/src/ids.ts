/**
 * Node identity.
 *
 * Every node carries an id because the whole engine addresses nodes by one: a
 * trace points at the condition that decided the outcome, a diagnostic attaches
 * to the row that caused it, and a builder tracks which row is being dragged
 * without relying on array position.
 *
 * Ids are generated here rather than by the host so that a rule built in code,
 * a rule imported from JSON and a rule drawn in the builder are all the same
 * kind of document. They are short and random rather than sequential: a
 * sequential id would collide the moment two branches were built separately and
 * then merged, which is exactly what an import does.
 */

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * A random 10-character id, prefixed by node kind so a raw AST stays readable
 * when someone is reading the JSON rather than the UI.
 *
 * @param prefix - `g` for a group, `c` for a condition, `a` for an action.
 */
export function createNodeId(prefix: string): string {
  // `crypto` where it exists (browser, Node 19+, edge runtimes), and a
  // deterministic-enough fallback where it does not. This is an identifier, not
  // a secret: uniqueness is the requirement, unpredictability is not.
  const random =
    typeof globalThis.crypto?.getRandomValues === 'function'
      ? Array.from(globalThis.crypto.getRandomValues(new Uint8Array(10)))
      : Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));

  const body = random.map((byte) => ALPHABET[byte % ALPHABET.length]).join('');
  return `${prefix}_${body}`;
}

/**
 * An id factory a caller can make deterministic.
 *
 * Tests and snapshot comparisons need a document that is identical across runs,
 * and a golden file full of random ids compares equal to nothing. Passing a
 * counter-backed factory is how a caller opts into that, without the engine
 * carrying a "test mode" it would have to keep working.
 */
export type IdFactory = (prefix: string) => string;

/** Sequential ids: `g_1`, `c_2`. For tests and fixtures. */
export function sequentialIds(): IdFactory {
  let next = 0;
  return (prefix) => {
    next += 1;
    return `${prefix}_${next}`;
  };
}

/**
 * Short, URL-safe slugs for dynamic QR codes - the `/q/<slug>` a QR encodes.
 *
 * Base58 (no 0/O/I/l) from the platform CSPRNG: unguessable, case-safe, and
 * readable if someone ever types one. No external dependency.
 */

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function generateSlug(length = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}

/** True when the string is a plausible slug (defends the public redirect route). */
export function isSlug(value: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{4,16}$/.test(value);
}

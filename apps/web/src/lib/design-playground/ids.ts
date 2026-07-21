/**
 * UUIDv7 ids for document entities.
 *
 * v7 rather than v4 because the repo standardises on it
 * (`documents/DATABASE_ARCHITECTURE.md`): the leading 48-bit timestamp keeps
 * ids sortable by creation time, which keeps index locality when a document is
 * persisted and makes a node's age readable from its id while debugging.
 */

/** Random bytes from the platform CSPRNG, with a deterministic-free fallback. */
function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export function createId(): string {
  // crypto.randomUUID is v4; v7 has to be assembled by hand.
  const timestamp = BigInt(Date.now());
  const bytes = randomBytes(16);

  // 48-bit big-endian timestamp.
  for (let i = 0; i < 6; i += 1) {
    bytes[i] = Number((timestamp >> BigInt(8 * (5 - i))) & 0xffn);
  }
  // Version 7 in the high nibble of byte 6, RFC 4122 variant in byte 8.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x70;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

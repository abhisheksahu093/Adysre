import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Envelope encryption for secret variables and cookie values.
 *
 * Ciphertext is stored in one self-describing column:
 *
 *   v1:<key id>:<base64 iv>:<base64 ciphertext>:<base64 auth tag>
 *
 * Self-describing because the alternative is a schema change every time
 * anything about the encryption changes. The version allows the algorithm to
 * move; the key id allows keys to ROTATE: a new key encrypts new values while
 * old values remain readable, which is what makes rotation an operation rather
 * than a migration.
 *
 * AES-256-GCM, so a tampered ciphertext fails to decrypt instead of decrypting
 * to garbage. `decrypt` returns null on any failure and never throws details:
 * an error message that distinguished "wrong key" from "corrupt data" would be
 * an oracle.
 */

const VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12;
const KEY_BYTES = 32;

/** Env var holding the base64 32-byte key. Generate: `openssl rand -base64 32`. */
export const KEY_ENV = 'API_STUDIO_SECRET_KEY';
/** Optional: previous keys, comma separated, kept readable during rotation. */
export const PREVIOUS_KEYS_ENV = 'API_STUDIO_SECRET_KEYS_PREVIOUS';

export class SecretStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretStorageError';
  }
}

function parseKey(raw: string): Buffer | null {
  const key = Buffer.from(raw.trim(), 'base64');
  return key.length === KEY_BYTES ? key : null;
}

/** Short, non-reversible label for a key, so ciphertext says which key made it. */
function keyId(key: Buffer): string {
  return createHash('sha256').update(key).digest('hex').slice(0, 8);
}

/** The key new values are encrypted with, or `null` when none is configured. */
function activeKey(): Buffer | null {
  const raw = process.env[KEY_ENV];
  return raw ? parseKey(raw) : null;
}

/** Active key first, then retired keys that must still decrypt old rows. */
function allKeys(): Buffer[] {
  const keys: Buffer[] = [];
  const active = activeKey();
  if (active) keys.push(active);

  for (const raw of (process.env[PREVIOUS_KEYS_ENV] ?? '').split(',')) {
    if (raw.trim() === '') continue;
    const key = parseKey(raw);
    if (key) keys.push(key);
  }

  return keys;
}

/**
 * Whether secrets can be stored at all.
 *
 * Routes check this BEFORE accepting a secret. Storing a credential in
 * plaintext because a key was not configured would be worse than refusing it,
 * and refusing is something an operator can fix; a leaked token is not.
 */
export function isSecretStorageConfigured(): boolean {
  return activeKey() !== null;
}

/**
 * Encrypt a plaintext secret.
 *
 * @throws {SecretStorageError} when no valid key is configured.
 */
export function encryptSecret(plaintext: string): string {
  const key = activeKey();
  if (!key) {
    throw new SecretStorageError(
      `${KEY_ENV} is not set to a base64 32-byte key; secrets cannot be stored.`,
    );
  }

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    VERSION,
    keyId(key),
    iv.toString('base64'),
    ciphertext.toString('base64'),
    tag.toString('base64'),
  ].join(':');
}

/**
 * Decrypt a stored secret.
 *
 * @returns the plaintext, or `null` when the value is malformed, was encrypted
 * with a key this deployment no longer holds, or has been tampered with.
 */
export function decryptSecret(stored: string): string | null {
  const parts = stored.split(':');
  if (parts.length !== 5) return null;

  const [version, id, ivB64, ciphertextB64, tagB64] = parts as [
    string,
    string,
    string,
    string,
    string,
  ];
  if (version !== VERSION) return null;

  for (const key of allKeys()) {
    // Constant-time compare on the key id: it is not a secret, but comparing it
    // this way costs nothing and keeps the habit.
    const candidate = Buffer.from(keyId(key));
    const target = Buffer.from(id);
    if (candidate.length !== target.length || !timingSafeEqual(candidate, target)) continue;

    try {
      const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, 'base64'));
      decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
      return Buffer.concat([
        decipher.update(Buffer.from(ciphertextB64, 'base64')),
        decipher.final(),
      ]).toString('utf8');
    } catch {
      // Authentication failed: tampered, or the key id collided. Either way
      // this key cannot read it, so try the next one and report nothing.
      continue;
    }
  }

  return null;
}

/** Whether a stored value was encrypted by a key this deployment still holds. */
export function isReadable(stored: string): boolean {
  return decryptSecret(stored) !== null;
}

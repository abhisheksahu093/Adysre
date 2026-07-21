/**
 * Access-token secret, read once per call and never optional.
 *
 * `process.env.X` is `string | undefined`, so both the guard and the token
 * service previously handed `secret: undefined` to `@nestjs/jwt`. That is not a
 * type inconvenience - it is an auth service running without a configured
 * secret, which must fail loudly at the boundary rather than proceed.
 */
export function accessTokenSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not set; refusing to sign or verify access tokens.');
  }
  return secret;
}

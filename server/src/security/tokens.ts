import { createHash, randomBytes } from 'node:crypto';

/** 256 bits from the OS CSPRNG, URL-safe. This is what goes in the cookie. */
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

/** What gets stored. Tokens are high-entropy, so a fast hash is appropriate here. */
export function hashToken(token: string): Buffer {
  return createHash('sha256').update(token).digest();
}

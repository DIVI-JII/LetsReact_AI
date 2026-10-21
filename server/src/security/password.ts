import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import type { ScryptOptions } from 'node:crypto';

// scrypt ships with Node, so there is no native module to compile.
// N=2^15, r=8, p=3 is one of the OWASP-recommended scrypt configurations (~32 MiB per hash).
// The parameters are stored inside every hash, so they can be raised later without
// breaking existing passwords: users are re-hashed on their next login.
export const SCRYPT_PARAMS = { N: 2 ** 15, r: 8, p: 3, keylen: 64 } as const;

// Upper bounds on parameters read back from the database, so a tampered row
// cannot make the server allocate gigabytes.
const MAX_N = 2 ** 20;
const MAX_R = 16;
const MAX_P = 16;

function derive(password: string, salt: Buffer, keylen: number, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

function options(N: number, r: number, p: number): ScryptOptions {
  // Node refuses to run unless maxmem covers 128 * N * r bytes.
  return { N, r, p, maxmem: 128 * N * r * 2 };
}

/** NFKC makes visually identical passwords (e.g. composed vs decomposed accents) hash the same. */
function normalise(password: string): string {
  return password.normalize('NFKC');
}

export async function hashPassword(password: string): Promise<string> {
  const { N, r, p, keylen } = SCRYPT_PARAMS;
  const salt = randomBytes(16);
  const key = await derive(normalise(password), salt, keylen, options(N, r, p));
  return ['scrypt', N, r, p, salt.toString('base64'), key.toString('base64')].join('$');
}

interface Parsed {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  key: Buffer;
}

function parse(stored: string): Parsed | null {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return null;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (![N, r, p].every(Number.isInteger)) return null;
  // N must be a power of two greater than 1 for scrypt.
  if (N < 2 || N > MAX_N || (N & (N - 1)) !== 0 || r < 1 || r > MAX_R || p < 1 || p > MAX_P) return null;
  const salt = Buffer.from(parts[4], 'base64');
  const key = Buffer.from(parts[5], 'base64');
  if (salt.length < 8 || key.length < 16) return null;
  return { N, r, p, salt, key };
}

/** Constant-time comparison. Returns false (never throws) for malformed hashes. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parse(stored);
  if (!parsed) return false;
  try {
    const candidate = await derive(normalise(password), parsed.salt, parsed.key.length, options(parsed.N, parsed.r, parsed.p));
    return candidate.length === parsed.key.length && timingSafeEqual(candidate, parsed.key);
  } catch {
    return false;
  }
}

/** True when the stored hash uses weaker parameters than the current settings. */
export function needsRehash(stored: string): boolean {
  const parsed = parse(stored);
  if (!parsed) return true;
  return (
    parsed.N < SCRYPT_PARAMS.N ||
    parsed.r < SCRYPT_PARAMS.r ||
    parsed.p < SCRYPT_PARAMS.p ||
    parsed.key.length < SCRYPT_PARAMS.keylen
  );
}

let dummy: Promise<string> | undefined;

/**
 * A real hash of a random password. When someone logs in with an unknown email we
 * still verify against this, so "no such user" takes as long as "wrong password"
 * and response timing does not reveal which emails have accounts.
 */
export function dummyHash(): Promise<string> {
  dummy ??= hashPassword(randomBytes(24).toString('hex'));
  return dummy;
}

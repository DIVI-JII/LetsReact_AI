import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dummyHash, hashPassword, needsRehash, verifyPassword } from './password.js';
import { generateToken, hashToken } from './tokens.js';

test('a password verifies against its own hash', async () => {
  const hash = await hashPassword('correct horse battery staple');
  assert.ok(hash.startsWith('scrypt$'));
  assert.equal(await verifyPassword('correct horse battery staple', hash), true);
});

test('a wrong password is rejected', async () => {
  const hash = await hashPassword('correct horse battery staple');
  assert.equal(await verifyPassword('correct horse battery stapl', hash), false);
  assert.equal(await verifyPassword('', hash), false);
});

test('the same password produces different hashes (random salt)', async () => {
  const [a, b] = await Promise.all([hashPassword('same password 123'), hashPassword('same password 123')]);
  assert.notEqual(a, b);
});

test('visually identical unicode passwords match (NFKC)', async () => {
  const composed = 'café au lait 2024';
  const decomposed = 'café au lait 2024';
  assert.equal(await verifyPassword(decomposed, await hashPassword(composed)), true);
});

test('malformed or hostile stored hashes fail closed without throwing', async () => {
  assert.equal(await verifyPassword('x', ''), false);
  assert.equal(await verifyPassword('x', 'plaintext'), false);
  assert.equal(await verifyPassword('x', 'scrypt$notanumber$8$1$c2FsdHNhbHQ=$a2V5a2V5a2V5a2V5a2V5'), false);
  // N is not a power of two
  assert.equal(await verifyPassword('x', 'scrypt$1000$8$1$c2FsdHNhbHRzYWx0$a2V5a2V5a2V5a2V5a2V5a2V5'), false);
  // Absurd memory cost must be refused instead of allocated
  assert.equal(await verifyPassword('x', `scrypt$${2 ** 30}$8$1$c2FsdHNhbHRzYWx0$a2V5a2V5a2V5a2V5a2V5a2V5`), false);
});

test('needsRehash flags weaker parameters but not current ones', async () => {
  assert.equal(needsRehash(await hashPassword('another password 99')), false);
  assert.equal(needsRehash('scrypt$16384$8$1$c2FsdHNhbHRzYWx0$a2V5a2V5a2V5a2V5a2V5a2V5'), true);
  assert.equal(needsRehash('garbage'), true);
});

test('the dummy hash is a real, verifiable hash (keeps login timing uniform)', async () => {
  const hash = await dummyHash();
  assert.ok(hash.startsWith('scrypt$'));
  assert.equal(await verifyPassword('definitely not the password', hash), false);
  assert.equal(await dummyHash(), hash); // cached
});

test('session tokens are long, unique and hash to 32 bytes', () => {
  const a = generateToken();
  const b = generateToken();
  assert.notEqual(a, b);
  assert.match(a, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(hashToken(a).length, 32);
  assert.deepEqual(hashToken(a), hashToken(a));
  assert.notDeepEqual(hashToken(a), hashToken(b));
});

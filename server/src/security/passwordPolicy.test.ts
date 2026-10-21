import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPasswordPolicy } from './passwordPolicy.js';

test('accepts a long passphrase', () => {
  assert.equal(checkPasswordPolicy('purple-giraffe-eats-pancakes'), null);
});

test('rejects short passwords', () => {
  assert.match(checkPasswordPolicy('short1') ?? '', /at least 10/);
});

test('counts characters, not UTF-16 units', () => {
  // 10 emoji are 20 UTF-16 units but 10 characters
  assert.equal(checkPasswordPolicy('😀😁😂🤣😃😄😅😆😉😊'), null);
});

test('rejects very long passwords (bounds hashing cost)', () => {
  assert.match(checkPasswordPolicy('a1'.repeat(70)) ?? '', /at most 128/);
});

test('rejects common and repetitive passwords', () => {
  assert.match(checkPasswordPolicy('Password123') ?? '', /too common/);
  assert.match(checkPasswordPolicy('aaaaaaaaaaaa') ?? '', /repetitive/);
});

test('rejects passwords containing the email name or display name', () => {
  assert.match(checkPasswordPolicy('maya-patel-is-great', { email: 'maya.patel@example.com' }) ?? '', /email/);
  assert.match(checkPasswordPolicy('xx-janedoe-xx-99', { name: 'Jane Doe' }) ?? '', /name/);
  assert.match(checkPasswordPolicy('ilovesamantha99', { email: 'samantha@example.com' }) ?? '', /email/);
});

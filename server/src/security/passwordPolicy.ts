export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

// A short list of the most common passwords that still satisfy a length rule.
// For stronger protection, swap this for a larger breached-password list.
const COMMON = new Set([
  'password',
  'password1',
  'password12',
  'password123',
  'password1234',
  'passw0rd123',
  'qwertyuiop',
  'qwerty12345',
  'qwertyuiop123',
  '1234567890',
  '12345678910',
  '0123456789',
  '1q2w3e4r5t',
  'iloveyou123',
  'letmein1234',
  'welcome123',
  'welcome1234',
  'admin12345',
  'administrator',
  'changeme123',
  'abc1234567',
  'abcdefghij',
  'LetsReact_AI',
  'LetsReact_AI123',
  'learnreact',
  'react12345',
]);

/**
 * Returns a message describing the first problem, or null when the password is acceptable.
 * Follows NIST 800-63B: favour length and block obvious choices instead of demanding
 * arbitrary character mixes.
 */
export function checkPasswordPolicy(
  password: string,
  context: { email?: string; name?: string } = {},
): string | null {
  const length = [...password].length; // count characters, not UTF-16 units
  if (length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (length > PASSWORD_MAX) return `Use at most ${PASSWORD_MAX} characters.`;

  const lower = password.toLowerCase();
  if (COMMON.has(lower)) return 'That password is too common. Try a short phrase instead.';
  if (new Set(lower).size < 4) return 'That password is too repetitive.';

  // Compare letters and digits only, so "maya.patel" is caught inside "maya-patel-is-great".
  const squash = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const flat = squash(password);

  const local = context.email ? squash(context.email.split('@')[0] ?? '') : '';
  if (local.length >= 4 && flat.includes(local)) return 'Don’t include your email address in your password.';

  const name = context.name ? squash(context.name) : '';
  if (name.length >= 4 && flat.includes(name)) return 'Don’t include your name in your password.';
  return null;
}

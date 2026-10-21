import { pool, query } from '../db.js';
import { hashPassword } from '../security/password.js';
import { checkPasswordPolicy } from '../security/passwordPolicy.js';
import { emailSchema } from '../security/validate.js';
import { recordAudit } from '../services/audit.js';
import { parseArgs, promptHidden } from './prompt.js';

// Usage:  npm run reset-password -- --email someone@example.com
// For the person running the server. Signs the user out everywhere.
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const email = emailSchema.safeParse(args.email);
  if (!email.success) throw new Error('Pass a valid --email');

  const user = (
    await query<{ id: string; name: string }>(`SELECT id, name FROM users WHERE lower(email) = $1`, [email.data])
  ).rows[0];
  if (!user) throw new Error('No account with that email');

  const password = await promptHidden('New password (min 10 characters): ');
  const confirm = await promptHidden('Repeat password: ');
  if (password !== confirm) throw new Error('Passwords did not match');
  const problem = checkPasswordPolicy(password, { email: email.data, name: user.name });
  if (problem) throw new Error(problem);

  await query(`UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1`, [user.id, await hashPassword(password)]);
  await query(`DELETE FROM sessions WHERE user_id = $1`, [user.id]);
  await recordAudit({ actorEmail: 'cli', action: 'password_reset_cli', targetUserId: user.id });
  console.log(`Password updated for ${email.data}. All their sessions were signed out.`);
}

main()
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

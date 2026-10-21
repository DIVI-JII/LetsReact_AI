import { pool, query } from '../db.js';
import { hashPassword } from '../security/password.js';
import { checkPasswordPolicy } from '../security/passwordPolicy.js';
import { emailSchema, nameSchema } from '../security/validate.js';
import { recordAudit } from '../services/audit.js';
import { parseArgs, promptHidden } from './prompt.js';

// Usage:  npm run create-admin -- --email you@example.com --name "Your Name"
// Admins can only be created here, on the server, never through the public API.
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const email = emailSchema.safeParse(args.email);
  const name = nameSchema.safeParse(args.name ?? 'Administrator');
  if (!email.success) throw new Error('Pass a valid --email');
  if (!name.success) throw new Error('Pass a valid --name');

  const existing = (await query<{ id: string }>(`SELECT id FROM users WHERE lower(email) = $1`, [email.data])).rows[0];

  if (existing) {
    await query(`UPDATE users SET role = 'admin', status = 'active', updated_at = now() WHERE id = $1`, [existing.id]);
    await recordAudit({ actorEmail: 'cli', action: 'admin_promoted_cli', targetUserId: existing.id });
    console.log(`${email.data} already existed and is now an admin.`);
    return;
  }

  // Prefer the interactive prompt. ADMIN_PASSWORD exists for scripted setups but is visible in the environment.
  let password = process.env.ADMIN_PASSWORD ?? '';
  if (!password) {
    password = await promptHidden('Password (min 10 characters): ');
    const confirm = await promptHidden('Repeat password: ');
    if (password !== confirm) throw new Error('Passwords did not match');
  }
  const problem = checkPasswordPolicy(password, { email: email.data, name: name.data });
  if (problem) throw new Error(problem);

  const { rows } = await query<{ id: string }>(
    `INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, 'admin') RETURNING id`,
    [email.data, name.data, await hashPassword(password)],
  );
  await recordAudit({ actorEmail: 'cli', action: 'admin_created_cli', targetUserId: rows[0].id });
  console.log(`Created admin ${email.data}. You can sign in now.`);
}

main()
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

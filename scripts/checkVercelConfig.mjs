// Guards the Vercel deployment: refuses to build if the /api rewrite still points at the placeholder,
// so a half-configured site never goes live with a broken API.
//   node scripts/checkVercelConfig.mjs            -> enforced only on Vercel (VERCEL=1), warns elsewhere
//   node scripts/checkVercelConfig.mjs --strict   -> always enforced
import { readFileSync } from 'node:fs';

const strict = process.argv.includes('--strict') || Boolean(process.env.VERCEL);
let config;
try {
  config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
} catch (err) {
  console.error(`vercel.json is missing or not valid JSON: ${err.message}`);
  process.exit(1);
}

const api = (config.rewrites ?? []).find((r) => typeof r.source === 'string' && r.source.startsWith('/api/'));
const problems = [];
if (!api) {
  problems.push('vercel.json has no rewrite for /api/:path*.');
} else {
  let url;
  try {
    url = new URL(api.destination.replace(':path*', 'x'));
  } catch {
    problems.push(`The /api rewrite destination is not a valid URL: ${api.destination}`);
  }
  if (url) {
    if (url.protocol !== 'https:') problems.push('The /api rewrite destination must use https.');
    if (/REPLACE|YOUR-|\.invalid$|example\.(com|org)$/i.test(url.hostname)) {
      problems.push(
        `The /api rewrite still points at a placeholder (${url.hostname}). Put your Render service address in vercel.json, e.g. https://LetsReact_AI-api.onrender.com/api/:path*`,
      );
    }
  }
}

if (problems.length === 0) {
  console.log('vercel.json: /api rewrite looks configured.');
} else if (strict) {
  console.error(`\nvercel.json is not ready to deploy:\n${problems.map((p) => `  - ${p}`).join('\n')}\n`);
  process.exit(1);
} else {
  console.warn(`vercel.json note (build continues locally):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}

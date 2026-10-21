import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.DATABASE_URL ??= 'postgres://x:y@localhost/z';

const { extractJson } = await import('./tutorProviders.js');
const { buildSystemPrompt, findLesson } = await import('./tutor.js');
const { curriculum } = await import('../data/curriculum.js');

test('extractJson tolerates code fences and prose', () => {
  assert.deepEqual(extractJson('Sure!\n```json\n{"verdict":"in_scope","reply":"hi"}\n```'), { verdict: 'in_scope', reply: 'hi' });
  assert.throws(() => extractJson('no json here'));
});

test('curriculum covers every lesson with content and ids are unique', () => {
  assert.equal(curriculum.length, 25);
  assert.equal(new Set(curriculum.map((l) => l.id)).size, curriculum.length);
});

test('system prompt names the current lesson in full and lists the others', () => {
  const current = findLesson('keys')!;
  const prompt = buildSystemPrompt(current);
  assert.match(prompt, /Title: Keys and why they matter/);
  assert.match(prompt, /why-react \| Week 1/);
  assert.doesNotMatch(prompt, /Practice task: .*Which Testing Library/);
});

test('findLesson rejects unknown ids', () => {
  assert.equal(findLesson('nope'), undefined);
});

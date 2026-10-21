import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, toCsv } from './csv.js';
import { escapeLike } from './like.js';

test('csv quotes commas, quotes and newlines', () => {
  assert.equal(csvCell('a,b'), '"a,b"');
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell('line1\nline2'), '"line1\nline2"');
  assert.equal(csvCell(null), '');
  assert.equal(csvCell(42), '42');
});

test('csv neutralises spreadsheet formula injection', () => {
  assert.equal(csvCell('=HYPERLINK("http://evil","x")'), `"'=HYPERLINK(""http://evil"",""x"")"`);
  assert.equal(csvCell('+1+1'), "'+1+1");
  assert.equal(csvCell('-2+3'), "'-2+3");
  assert.equal(csvCell('@SUM(A1)'), "'@SUM(A1)");
  assert.equal(csvCell('safe = fine'), 'safe = fine');
});

test('csv serialises dates as ISO strings and ends with CRLF', () => {
  const out = toCsv(['when'], [[new Date('2026-01-02T03:04:05Z')]]);
  assert.equal(out, 'when\r\n2026-01-02T03:04:05.000Z\r\n');
});

test('escapeLike makes wildcards literal', () => {
  assert.equal(escapeLike('100%'), '100\\%');
  assert.equal(escapeLike('a_b'), 'a\\_b');
  assert.equal(escapeLike('c:\\dir'), 'c:\\\\dir');
  assert.equal(escapeLike('plain'), 'plain');
});

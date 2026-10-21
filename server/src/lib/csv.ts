/**
 * Builds a CSV safely.
 * Spreadsheet apps run cells that start with = + - @ as formulas, which lets a learner
 * who sets their name to `=HYPERLINK(...)` attack whoever opens the export.
 * Prefixing those cells with an apostrophe turns them back into plain text.
 */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

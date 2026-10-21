/** Escapes % _ and \ so user search text is matched literally inside ILIKE ... ESCAPE '\'. */
export function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (c) => `\\${c}`);
}

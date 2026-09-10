/**
 * A Part is either a word, punctuation, or whitespace.
 */
export interface Part {
  readonly text: string;
  readonly isWord: boolean;
}

/** A word per this RegExp is any contiguous letters, digits, and marks. */
const WORD = /[\p{L}\p{M}\p{N}]+(?:['’ʼ][\p{L}\p{M}\p{N}]+)*/gu;

export function tokenize(input: string): Part[] {
  const parts: Part[] = [];
  let cursor = 0;

  for (const match of input.matchAll(WORD)) {
    const start = match.index;
    if (start > cursor) parts.push({ text: input.slice(cursor, start), isWord: false });
    parts.push({ text: match[0], isWord: true });
    cursor = start + match[0].length;
  }

  if (cursor < input.length) parts.push({ text: input.slice(cursor), isWord: false });

  return parts;
}

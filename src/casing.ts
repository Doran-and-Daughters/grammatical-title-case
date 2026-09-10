import { FIXED_CASE } from './data/fixed-case.js';

const FIRST_LETTER = /\p{L}/u;
const INITIAL_LETTER = /^\p{L}/u;
const LOWERCASE_LETTER = /\p{Ll}/u;
const UPPERCASE_LETTER = /\p{Lu}/u;
const APOSTROPHE = /['’ʼ]/;
/** Certain prefixes imply a capitalized letter after their apostrophe. */
const ELIDED_PREFIX = /^([odl])(['’ʼ])(\p{L}[\p{L}'’ʼ]+)$/u;
/** A possessive or plural ending */
const SUFFIX = /(['’ʼ]?s)$/i;

/**
 * We try to detect when a word's capitalization was deliberate.
 */
export function hasIntentionalCase(word: string): boolean {
  const firstLetter = word.search(FIRST_LETTER);
  if (firstLetter === -1) return false;

  const afterFirstLetter = word.slice(firstLetter + 1);
  return UPPERCASE_LETTER.test(afterFirstLetter) && LOWERCASE_LETTER.test(word);
}

/**
 * We handle a narrow scope of matches as acronyms, initialisms, and brand capitalizations.
 */
export function fixedCase(word: string): string | undefined {
  const key = word.toLowerCase();
  const exact = FIXED_CASE.get(key);
  if (exact !== undefined) return exact;

  const suffix = SUFFIX.exec(key)?.[1];
  if (suffix === undefined) return undefined;

  const stem = FIXED_CASE.get(key.slice(0, key.length - suffix.length));
  if (stem === undefined) return undefined;
  // Only acronyms take a lowercase suffix this way; "iPads" is already correct.
  if (stem !== stem.toUpperCase()) return undefined;

  return stem + (APOSTROPHE.test(suffix) ? `${suffix[0]}s` : 's');
}

/**
 * We consult first our "dictionaries," then try to determine deliberate capitalizations, before
 * otherwise handling in the default way.
 */
export function toCapitalized(word: string): string {
  const fixed = fixedCase(word);
  if (fixed !== undefined) return fixed;

  if (hasIntentionalCase(word)) return word;

  const lowered = word.toLowerCase();

  const elided = ELIDED_PREFIX.exec(lowered);
  if (elided) {
    const [, prefix, apostrophe, rest] = elided;
    return prefix.toUpperCase() + apostrophe + capitalizeInitial(rest);
  }

  return capitalizeInitial(lowered);
}

function capitalizeInitial(word: string): string {
  const initial = INITIAL_LETTER.exec(word)?.[0];
  if (initial === undefined) return word;

  return initial.toUpperCase() + word.slice(initial.length);
}

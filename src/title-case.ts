import { fixedCase, hasIntentionalCase, toCapitalized } from './casing.js';
import { NUMBER_WORDS, PREFIXES } from './data/compounds.js';
import { LOWERCASE_WORDS } from './data/lowercase-words.js';
import { type NormalizedOptions, normalizeOptions } from './options.js';
import { type Part, tokenize } from './tokenize.js';
import type { Options } from './types.js';

/** A hyphen per this RegExp is one of minus, hyphen, or non-breaking hyphen Unicode characters. */
const HYPHEN = /^[-‐‑]$/;
/** "Segment marks" separate title from subtitle. NB the dashes are Unicode em-dash, and en-dash when surrounded by spaces. */
const SEGMENT_MARK = /[:?!—]|\s–\s/;
const LOWERCASE_LETTER = /\p{Ll}/u;
const UPPERCASE_INITIAL = /^\p{Lu}/u;

interface Placement {
  /** Is first word of title or subtitle */
  readonly isSegmentStart: boolean;
  /** Is last word of title, incl. last word before a subtitle */
  readonly isSegmentEnd: boolean;
  /** Position within a hyphenated compound (0 for standalone word) */
  readonly compoundIndex: number;
  /** Is first element of a hyphenated compound */
  readonly leadsCompound: boolean;
  /** A hyphenated compound's first element */
  readonly compoundHead: string;
}

export function titleCase(stringToTransform: string, options?: Options): string {
  if (typeof stringToTransform !== 'string') {
    throw new TypeError('titleCase: Your input to transform must be a string.');
  }

  const normalized = normalizeOptions(options);
  const parts = tokenize(stringToTransform);
  const placements = placeWords(parts);
  const trustInputCapitals = LOWERCASE_LETTER.test(stringToTransform);

  let wordIndex = 0;
  return parts
    .map((part) =>
      part.isWord
        ? resolve(part.text, placements[wordIndex++], normalized, trustInputCapitals)
        : part.text,
    )
    .join('');
}

function placeWords(parts: readonly Part[]): Placement[] {
  const words: string[] = [];
  const gaps: string[] = [];
  let gap = '';

  for (const part of parts) {
    if (part.isWord) {
      if (words.length > 0) gaps.push(gap);
      words.push(part.text);
      gap = '';
    } else if (words.length > 0) {
      gap += part.text;
    }
  }

  const placements: Placement[] = [];

  for (let index = 0; index < words.length; index += 1) {
    const joinedToPrevious = index > 0 && HYPHEN.test(gaps[index - 1]);
    const previous = placements[index - 1];
    const compoundIndex = joinedToPrevious ? previous.compoundIndex + 1 : 0;

    placements.push({
      isSegmentStart: index === 0 || SEGMENT_MARK.test(gaps[index - 1]),
      isSegmentEnd: index === words.length - 1 || SEGMENT_MARK.test(gaps[index]),
      compoundIndex,
      leadsCompound: compoundIndex === 0 && index < words.length - 1 && HYPHEN.test(gaps[index]),
      compoundHead: joinedToPrevious ? previous.compoundHead : words[index],
    });
  }

  return placements;
}

/**
 * Applies the rules in precedence order. See "Options" in the README.
 */
function resolve(
  word: string,
  placement: Placement,
  options: NormalizedOptions,
  trustInputCapitals: boolean,
): string {
  const key = word.toLowerCase();

  const special = options.special.get(key);
  if (special !== undefined) return special;

  const isCompoundElement = placement.compoundIndex > 0;
  // First element of a hyphenated compound always is capitalized,
  const positionForcesCapital =
    !isCompoundElement &&
    (placement.isSegmentStart || placement.isSegmentEnd || placement.leadsCompound);

  if (!positionForcesCapital && !options.alwaysCapitalize.has(key)) {
    if (options.neverCapitalize.has(key)) return word.toLowerCase();

    const lowercase = isCompoundElement
      ? isLowercaseCompoundElement(word, key, placement.compoundHead, trustInputCapitals)
      : LOWERCASE_WORDS.has(key);

    if (lowercase) return word.toLowerCase();
  }

  return toCapitalized(word);
}

/**
 * CMOS 8.161 defines exceptions to capitalization in a hyphenated compound.
 */
function isLowercaseCompoundElement(
  word: string,
  key: string,
  head: string,
  trustInputCapitals: boolean,
): boolean {
  if (LOWERCASE_WORDS.has(key)) return true;

  const headKey = head.toLowerCase();

  if (NUMBER_WORDS.has(headKey) && NUMBER_WORDS.has(key)) return true;

  if (PREFIXES.has(headKey)) {
    return !looksProper(word, trustInputCapitals);
  }

  return false;
}

/**
 * We try to detect proper nouns and adjectives.
 */
function looksProper(word: string, trustInputCapitals: boolean): boolean {
  if (fixedCase(word) !== undefined || hasIntentionalCase(word)) return true;

  return trustInputCapitals && UPPERCASE_INITIAL.test(word);
}

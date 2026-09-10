import type { Options } from './types.js';

/**
 * The caller's options normalized to lowercase keys for case-insensitive lookup.
 */
export interface NormalizedOptions {
  readonly neverCapitalize: ReadonlySet<string>;
  readonly alwaysCapitalize: ReadonlySet<string>;
  readonly special: ReadonlyMap<string, string>;
}

const NO_WORDS: ReadonlySet<string> = new Set();
const NO_SPECIALS: ReadonlyMap<string, string> = new Map();

const EMPTY: NormalizedOptions = {
  neverCapitalize: NO_WORDS,
  alwaysCapitalize: NO_WORDS,
  special: NO_SPECIALS,
};

const LEGAL_OPTIONS = ['never', 'always', 'special'];

export function normalizeOptions(options?: Options): NormalizedOptions {
  if (!options) return EMPTY;

  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('titleCase: Your "options" argument must be an object.');
  }

  for (const key of Object.keys(options)) {
    if (!LEGAL_OPTIONS.includes(key)) {
      throw new TypeError(
        `titleCase: Unknown option "${key}". The options are "never", "always", and "special".`,
      );
    }
  }

  return {
    neverCapitalize: toSet(options.never, 'never'),
    alwaysCapitalize: toSet(options.always, 'always'),
    special: toSpecialMap(options.special),
  };
}

function toSet(words: readonly string[] | undefined, name: string): ReadonlySet<string> {
  if (words === undefined) return NO_WORDS;

  if (!isArray(words)) {
    throw new TypeError(`titleCase: Your "options.${name}" argument must be an array.`);
  }

  const set = new Set<string>();
  for (const word of words) {
    if (typeof word !== 'string') {
      throw new TypeError(
        `titleCase: Your "options.${name}" argument array must comprise only strings.`,
      );
    }
    set.add(word.toLowerCase());
  }

  return set;
}

function toSpecialMap(entries: Options['special']): ReadonlyMap<string, string> {
  if (entries === undefined) return NO_SPECIALS;

  if (!isArray(entries)) {
    throw new TypeError('titleCase: Your "options.special" argument must be an array.');
  }

  const map = new Map<string, string>();
  for (const entry of entries as readonly unknown[]) {
    if (typeof entry !== 'object' || entry === null || isArray(entry)) {
      throw new TypeError('titleCase: Your "options.special" argument must comprise only objects.');
    }

    for (const [word, replacement] of Object.entries(entry as Record<string, unknown>)) {
      if (typeof replacement !== 'string') {
        throw new TypeError(
          `titleCase: Your "options.special" argument item with key "${word}" must have a string value.`,
        );
      }
      // Last entry wins; which means callers can e.g. override a house shared list.
      map.set(word.toLowerCase(), replacement);
    }
  }

  return map;
}

function isArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

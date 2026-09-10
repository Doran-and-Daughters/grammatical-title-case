/**
 * Articles (CMOS 8.159, rule 2)
 */
export const ARTICLES: readonly string[] = ['a', 'an', 'the'];

/**
 * Coordinating conjunctions (CMOS 8.159, rule 4)
 *
 * Note "so" and "yet" are capitalized under CMOS rules.
 */
export const COORDINATING_CONJUNCTIONS: readonly string[] = ['and', 'but', 'for', 'nor', 'or'];

/**
 * Prepositions, "regardless of length" (CMOS 8.159, rule 3), "as" (rule 5), and "v."/"vs." (rule 3)
 *
 * Words that are at least as often another part of speech ("than," "worth", "save," "following")
 * are omitted here; callers can override this with the `never` option.
 */
export const PREPOSITIONS: readonly string[] = [
  'about',
  'above',
  'across',
  'after',
  'against',
  'along',
  'alongside',
  'amid',
  'amidst',
  'among',
  'amongst',
  'around',
  'as',
  'at',
  'atop',
  'before',
  'behind',
  'below',
  'beneath',
  'beside',
  'besides',
  'between',
  'beyond',
  'by',
  'concerning',
  'considering',
  'despite',
  'down',
  'during',
  'except',
  'from',
  'in',
  'inside',
  'into',
  'like',
  'near',
  'of',
  'off',
  'on',
  'onto',
  'opposite',
  'out',
  'outside',
  'over',
  'past',
  'per',
  'regarding',
  'round',
  'since',
  'through',
  'throughout',
  'till',
  'to',
  'toward',
  'towards',
  'under',
  'underneath',
  'unlike',
  'until',
  'unto',
  'up',
  'upon',
  'v',
  'versus',
  'via',
  'vs',
  'with',
  'within',
  'without',
];

export const LOWERCASE_WORDS: ReadonlySet<string> = new Set([
  ...ARTICLES,
  ...COORDINATING_CONJUNCTIONS,
  ...PREPOSITIONS,
]);

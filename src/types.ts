/**
 * Options accepted by {@link titleCase}.
 */
export interface Options {
  /** Word(s) never to capitalize. */
  never?: readonly string[];
  /** Word(s) always to capitalize. */
  always?: readonly string[];
  /** Word(s) to render exactly as given: match as key, desired output as value. */
  special?: readonly Record<string, string>[];
}

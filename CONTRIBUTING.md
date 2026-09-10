# Contributing

Thanks for your interest in `grammatical-title-case`.

## Getting started

```bash
npm install
npm run verify
```

`npm run verify` runs: format check, lint, typecheck, tests, and build. (The individual scripts are `format`, `lint`,
`typecheck`, `test` [`test:watch`, `test:coverage`], and `build`.)

## Project structure

| Path                          | What it holds                                              |
|-------------------------------|------------------------------------------------------------|
| `src/title-case.ts`           | Rules, in precedence order                                 |
| `src/casing.ts`               | Handles an individual word                                 |
| `src/tokenize.ts`             | Atomizes the string into words and punctuation             |
| `src/options.ts`              | Validates and normalizes the options-object param          |
| `src/data/lowercase-words.ts` | Tracks articles, coordinating conjunctions, prepositions   |
| `src/data/fixed-case.ts`      | Tracks acronyms, initialisms, and brand capitalizations    |
| `src/data/compounds.ts`       | Handles prefixes and number-words for hyphenated compounds |

## Propose a word

The built-in lists are deliberately small, with a bias toward user customization. However, if you do feel your
supplement would benefit users generally, bear a few things in mind:

- An **acronym or brand** must not also be an ordinary English word. E.g., `REST`, `RAM`, and `WHO` are excluded for this
  reason, and callers reach for the `special` option instead.
- A **preposition** must be _more often_ a preposition than some other part of speech. E.g., `than`, `worth`, and `save` are
  excluded for this reason.

## Propose a rule

Behavior changes should cite the relevant section of _The Chicago Manual of Style_—8.159 for the title as a whole,
8.161 for hyphenated compounds—both in the pull request and in a code comment.

## Commit

Commit messages are free-form; but keep the subject short and in the past tense. Pray remember to update `CHANGELOG.md` in the same pull
request as your commit.

Please provide a test in the pull request with your proposed change.

**NB** No runtime dependencies, please.

# grammatical-title-case

[![npm version](https://img.shields.io/npm/v/grammatical-title-case.svg)](https://www.npmjs.com/package/grammatical-title-case)
[![CI](https://github.com/OWNER/grammatical-title-case/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/grammatical-title-case/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/grammatical-title-case.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/grammatical-title-case.svg)](https://www.npmjs.com/package/grammatical-title-case)

The `grammatical-title-case` library transforms strings to conform to _The Chicago Manual of Style_’s general principles
for capitalizing a title in English.
For example, “voyages to the moon and the sun” becomes “Voyages to the Moon and the Sun.”

#### NB

**The result is not the same as programmer’s title case, where every word is capitalized.**

### Supports Acronyms

Common acronyms and initialisms (e.g., ASCII, ORM) and brand capitalizations (e.g., iPad) are recognized and handled as
expected. In addition, this functionality is configurable.

### Configurable

With a simple options object, words can be listed as never capitalized, always capitalized, or handled specially (e.g.
“FUNCORP”) to customize results.

See [Options](#options).

## Installation

```bash
npm i grammatical-title-case
```

Requires Node 18 or later. The package ships ES modules, CommonJS, and TypeScript declarations.

```ts
import titleCase from 'grammatical-title-case'; // ESM, default
import { titleCase } from 'grammatical-title-case'; // ESM, named
const { titleCase } = require('grammatical-title-case'); // CommonJS
```

### Exports

Besides the main function, the lists that many of the rules depend on are exported should you wish to extend them
directly. They are `ACRONYMS`, `BRANDS`, `ARTICLES`, `COORDINATING_CONJUNCTIONS`, and `PREPOSITIONS`. The `Options` type
is exported for TypeScript users.

## Quick Examples

```ts
import titleCase from 'grammatical-title-case';

// Basic use
console.log(titleCase('the skylark of space')); // The Skylark of Space
console.log(titleCase('Apollo: the race to the moon')); // Apollo: The Race to the Moon
console.log(titleCase('ASSEMBLING AND SUPPLYING THE ISS')); // Assembling and Supplying the ISS
console.log(titleCase('Space (Look it up)')); // Space (Look It Up)

// Use with never and always
console.log(
  titleCase('Out of the Silent Planet', {
    never: ['silent'],
    always: ['of'],
  }),
); // Out Of the silent Planet

// Use with special handling
console.log(
  titleCase('THE ETHER OF SPACE', {
    special: [{ ether: 'EthEr' }],
  }),
); // The EthEr of Space
```

## Usage

Importing 'grammatical-title-case' returns a function that accepts two arguments, a string and an options object, and
returns a string.

### titleCase (stringToTransform, options)

#### arguments

- stringToTransform - `String` - the string to capitalize or re-capitalize as a title
- options - `Maybe Object` - instructions to customize the results

#### returns

`String` - the string as a title, optionally customized

#### type

```ts
(stringToTransform: string, options?: Options) => string;
```

#### throws

`TypeError` - if `stringToTransform` is not a string, or `options` is malformed

#### example

See [Quick Examples](#quick-examples).

## Rules Applied

The transformation follows _CMOS_ 8.159 for the title as a whole and 8.161 for hyphenated compounds.

#### capitalized

- The first and last word of the title, and of any subtitle
- Nouns, pronouns, verbs, adjectives, and adverbs
- Conjunctions other than the five in the following section, including `so`, `yet`, `if`, `because`, and `although`

#### lowercased

- The articles `a`, `an`, and `the`
- The coordinating conjunctions `and`, `but`, `for`, `or`, and `nor`
- Prepositions, _regardless of length_ — so “A Walk through the Dark” and “Everything about the Cosmos,” not “Through”
  and
  “About”
- `as`, in any grammatical function, and `to` in an infinitive

#### subtitles

A colon, a question mark, an exclamation point, an em dash, or an en dash surrounded by whitespace divides a title into
parts. The first and last word of each part is capitalized, so `'star wars: episode iv—a new hope'` becomes “Star Wars:
Episode IV—A New Hope.”

#### hyphenated compounds

- The first element is always capitalized: “An In-Depth Look,” “Up-to-Date Rules”
- Later elements are capitalized too, except articles, prepositions, and coordinating conjunctions: “A Run-of-the-Mill
  Idea”
- An element following a prefix that could not stand alone stays lowercase: “Anti-matter Two,” “E-mail for
  Beginners”
- The second element of a spelled-out number or simple fraction stays lowercase: “The Twenty-first Century,” “Two-thirds
  of a Mile”
- See the discussion of en-dash–separated compounds in [Known Limitations](#known-limitations).

#### input case

Input in any case, or in none, is accepted. Shouting is shushed (`'ASSEMBLING AND SUPPLYING THE ISS'` will succumb to
“Assembling and Supplying the ISS”), while a word with capitalization that appears deliberate—say, the interior
capital in `MacDonald`—will be respected.

Acronyms and brands are handled regardless of input case, including as possessives or plurals: `'the hitchhiker’s guide`
becomes “The Hitchhiker’s Guide.”

Roman numerals from II to XX are recognized as well, so `'rama ii'` becomes “Rama II.” Single letters, not; since I,
V, and X all have other work they do.

An elided prefix takes its capital on the letter after the apostrophe, so `'l’atmosphère: météorologie populaire'`
becomes “L’Atmosphère: Météorologie Populaire.” Note only `o’`, `d’`, and `l’` are handled this way.

## Options

Specifying an options object is optional, and allows you to customize the results, either to enforce a unique
capitalization rule, or to override the rules in some way. This can be especially helpful if you need to support
branding capitalization for your business or product, or an obscure acronym.

#### properties

- never - `Maybe String Array` - the word (s) _never_ to capitalize
- always - `Maybe String Array` - the word (s) _always_ to capitalize
- special - `Maybe Object Array` - the word (s) to handle specially: word as key, and specified result as value

#### type

```ts
type Options = {
  never?: string[];
  always?: string[];
  special?: { [word: string]: string }[];
};
```

#### behavior

- All matches are case-insensitive.
  - `never: ['spy']` is identical to `never: ['SPY']`
  - `special: [{ spy: 'sPy' }]` is identical to `special: [{ SPY: 'sPy' }]`
- Words that match a key in `special` will be transformed to exactly the string specified as their value.
- Property precedence is as follows: `always` will override `never`, and `special` will override either.
- Other precedence:
  - `never` overrides acronym: If an acronym or initialism matches a string in `never`, it will be all-lowercase in the
    result.
  - Position can override `never`: If a word in certain positions (e.g., the first word) matches a string in `never`, it
    will still be capitalized.
  - `special` overrides position as well: a word given a special form keeps that form wherever it falls.
- Where two `special` entries refer to the same word, the last is enforced (which means you can e.g. override a house
  shared list).
- A hyphenated compound is split into its elements: `'twenty-first'` is handled as `twenty` and `first`.

#### example

See [Quick Examples](#quick-examples).

## Known Limitations

- There is no way to support every acronym, initialism, and branding capitalization, especially when they are obscure. Use `special`.
- With the proliferation of acronyms, it is not impossible for a word and an acronym to share identical spelling; then a
  result may not be as expected.
- A word that can be either a preposition or another part of speech is treated as a preposition. Use `always` to override.
- A proper noun following a prefix might only be recognized as such if your input capitalizes it.
- The particles of a name (`de`, `van`, `von`), and the second part of a species name (_Homo sapiens_) are not
  lowercased for you; use `never`.
- Results for unusually-punctuated or otherwise complex titles (e.g., titles within titles) might not conform to _CMOS_.
- Non-alphabetical characters will be passed through without transformation (e.g., “7 eves” can_not_ be transformed to “Seven
  Eves”).
- En-dash–separated compound words are not definitely handled; use `special` if necessary.
- At this time, English is the only supported language.

## Reference About

_CMOS_ 14.30 (University of Chicago Press), 8.158–161

## Support

`grammatical-title-case` is free and MIT-licensed. If it has saved you an argument with a proofreader, or spiffed up your e-commerce page, please consider [sponsoring its upkeep](https://github.com/sponsors/Doran-and-Daughters). Opening an issue is also valuable aid.

## Contributing

Pull requests are welcome; see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT

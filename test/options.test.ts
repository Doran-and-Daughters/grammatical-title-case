import { describe, expect, it } from 'vitest';

import titleCase from '../src/index.js';

describe('options', () => {
  it('accepts input without options', () => {
    expect(titleCase('out of the silent planet')).toBe('Out of the Silent Planet');
    expect(titleCase('out of the silent planet', {})).toBe('Out of the Silent Planet');
    expect(titleCase('out of the silent planet', undefined)).toBe('Out of the Silent Planet');
  });

  it('never capitalizes a word in `never`', () => {
    expect(titleCase('the great escape', { never: ['great'] })).toBe('The great Escape');
  });

  it('always capitalizes a word in `always`', () => {
    expect(titleCase('the great escape of 1943', { always: ['of'] })).toBe(
      'The Great Escape Of 1943',
    );
  });

  it('renders a word exactly as in `special`', () => {
    expect(titleCase('THE ETHER OF SPACE', { special: [{ ether: 'EthEr' }] })).toBe(
      'The EthEr of Space',
    );
  });

  it('matches options case-insensitively', () => {
    expect(titleCase('the great escape', { never: ['GREAT'] })).toBe('The great Escape');
    expect(titleCase('the SPY who came in', { special: [{ spy: 'sPy' }] })).toBe(
      'The sPy Who Came In',
    );
  });

  it('collates the options', () => {
    expect(titleCase('Out of the Silent Planet', { never: ['silent'], always: ['of'] })).toBe(
      'Out Of the silent Planet',
    );
  });

  describe('precedence', () => {
    it('prefers `always` to `never`', () => {
      expect(titleCase('the silent planet', { never: ['silent'], always: ['silent'] })).toBe(
        'The Silent Planet',
      );
    });

    it('prefers `special` to either', () => {
      expect(
        titleCase('the silent planet', {
          never: ['silent'],
          always: ['silent'],
          special: [{ silent: 'SILENT' }],
        }),
      ).toBe('The SILENT Planet');
    });

    it('prefers `special` over position in string', () => {
      expect(titleCase('the end', { special: [{ the: 'the', end: 'end' }] })).toBe('the end');
    });

    it('lets position in string override `never`', () => {
      expect(titleCase('of mice and men', { never: ['of', 'men'] })).toBe('Of Mice and Men');
    });

    it('lets `never` override the acronym list', () => {
      expect(titleCase('the ISS and its crew', { never: ['iss'] })).toBe('The iss and Its Crew');
    });

    it('takes the last `special` entry if a word is repeated there', () => {
      expect(titleCase('a spy story', { special: [{ spy: 'sPy' }, { spy: 'SPY' }] })).toBe(
        'A SPY Story',
      );
    });
  });

  describe('validation', () => {
    it('rejects a non-string subject', () => {
      // @ts-expect-error deliberately wrong
      expect(() => titleCase(42)).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase(null)).toThrow(TypeError);
    });

    it('rejects an unknown option rather than ignore it', () => {
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { blacklist: ['the'] })).toThrow(/nknown option/);
    });

    it('rejects malformed options', () => {
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', 'nope')).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { never: 'nope' })).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { always: [42] })).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { special: { spy: 'sPy' } })).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { special: [{ spy: 42 }] })).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { special: [null] })).toThrow(TypeError);
      // @ts-expect-error deliberately wrong
      expect(() => titleCase('a title', { special: [['spy', 'sPy']] })).toThrow(TypeError);
    });
  });
});

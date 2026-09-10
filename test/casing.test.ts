import { describe, expect, it } from 'vitest';

import titleCase, { ACRONYMS, BRANDS, PREPOSITIONS } from '../src/index.js';

describe('normalized input', () => {
  it('handles all-uppercase input', () => {
    expect(titleCase('ASSEMBLING AND SUPPLYING THE ISS')).toBe('Assembling and Supplying the ISS');
  });

  it('handles all-lowercase input', () => {
    expect(titleCase('the skylark of space')).toBe('The Skylark of Space');
  });

  it('respects a word with capitalization that is evidently deliberate', () => {
    expect(titleCase('the McDonald’s of the north')).toBe('The McDonald’s of the North');
    expect(titleCase('learning JavaScript')).toBe('Learning JavaScript');
  });
});

describe('acronyms, initialisms, and brands', () => {
  it('identifies known acronyms amid all-upper- or all-lowercase input', () => {
    expect(titleCase('an introduction to html and css')).toBe('An Introduction to HTML and CSS');
    expect(titleCase('AN INTRODUCTION TO HTML AND CSS')).toBe('An Introduction to HTML and CSS');
  });

  it('identifies known brand capitalization', () => {
    expect(titleCase('the ipad at ten')).toBe('The iPad at Ten');
    expect(titleCase('shipping with npm and github')).toBe('Shipping with npm and GitHub');
  });

  it('handles possessive and plural acronyms', () => {
    expect(titleCase('every url’s path')).toBe('Every URL’s Path');
    expect(titleCase('the shortest urls')).toBe('The Shortest URLs');
  });

  it('handles Roman numerals', () => {
    expect(titleCase('HENRY VIII AND HIS SIX WIVES')).toBe('Henry VIII and His Six Wives');
  });

  it('capitalizes an unknown acronym as an ordinary word, or handles as acronym with caller config', () => {
    expect(titleCase('the qqq index')).toBe('The Qqq Index');
    expect(titleCase('the qqq index', { special: [{ qqq: 'QQQ' }] })).toBe('The QQQ Index');
  });

  it('exports the word lists it works from', () => {
    expect(ACRONYMS).toContain('ISS');
    expect(BRANDS).toContain('iPad');
    expect(PREPOSITIONS).toContain('of');
  });
});

describe('punctuation and other passengers', () => {
  it('preserves whitespace and punctuation exactly', () => {
    expect(titleCase('  a  tale   of two cities  ')).toBe('  A  Tale   of Two Cities  ');
    expect(titleCase('“the raven,” revisited')).toBe('“The Raven,” Revisited');
  });

  it('handles apostrophes', () => {
    expect(titleCase("don't stop believin'")).toBe("Don't Stop Believin'");
    expect(titleCase('’tis the season')).toBe('’Tis the Season');
    expect(titleCase("o'neill's law")).toBe("O'Neill's Law");
    expect(titleCase('o’neill’s law')).toBe('O’Neill’s Law');
  });

  it('handles "o’," "d’," and "l’," and them only, as elided prefixes', () => {
    expect(titleCase('d’artagnan rides again')).toBe('D’Artagnan Rides Again');
    expect(titleCase('don’t look now')).toBe('Don’t Look Now');
    expect(titleCase('i’ll be there')).toBe('I’ll Be There');
  });

  it('recognizes Roman numerals from II to XX', () => {
    expect(titleCase('chapter xx of the saga')).toBe('Chapter XX of the Saga');
  });

  it('passes Arabic numerals through untouched', () => {
    expect(titleCase('7 eves')).toBe('7 Eves');
    expect(titleCase('the 1st of may')).toBe('The 1st of May');
    expect(titleCase('3d printing for all')).toBe('3D Printing for All');
  });

  it('respects strings of no words', () => {
    expect(titleCase('')).toBe('');
    expect(titleCase('   ')).toBe('   ');
    expect(titleCase('!?')).toBe('!?');
  });

  it('respects accented and non-Latin letters', () => {
    expect(titleCase('éloge de la fuite')).toBe('Éloge De La Fuite');
    expect(titleCase('a book about 東京')).toBe('A Book about 東京');
  });
});

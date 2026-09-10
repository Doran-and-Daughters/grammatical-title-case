import { describe, expect, it } from 'vitest';

import titleCase from '../src/index.js';

describe('CMOS 8.159', () => {
  it('capitalizes major words, and first and last word', () => {
    expect(titleCase('the skylark of space')).toBe('The Skylark of Space');
    expect(titleCase('a river runs through it')).toBe('A River Runs through It');
  });

  it('lowercases articles', () => {
    expect(titleCase('the tale of a tub and an urn')).toBe('The Tale of a Tub and an Urn');
  });

  it('lowercases prepositions regardless of length', () => {
    expect(titleCase('ten thousand leagues under the sea')).toBe(
      'Ten Thousand Leagues under the Sea',
    );
    expect(titleCase('four theories concerning the gospel')).toBe(
      'Four Theories concerning the Gospel',
    );
    expect(titleCase('a walk between the raindrops')).toBe('A Walk between the Raindrops');
  });

  it('lowercases the coordinating conjunctions: "and," "but," "for," "or," "nor"', () => {
    expect(titleCase('neither fish nor fowl but something else')).toBe(
      'Neither Fish nor Fowl but Something Else',
    );
    expect(titleCase('war and peace or peace and war')).toBe('War and Peace or Peace and War');
  });

  it('capitalizes conjunctions CMOS does not list, e.g. "so," "yet," and "if"', () => {
    expect(titleCase('so much yet so little if true')).toBe('So Much Yet So Little If True');
  });

  it('always lowercases "as"', () => {
    expect(titleCase('you love it as much as we do')).toBe('You Love It as Much as We Do');
  });

  it('in infinitives, lowercases "to"', () => {
    expect(titleCase('learning to fly')).toBe('Learning to Fly');
  });

  it('capitalizes a preposition that ends the title', () => {
    expect(titleCase('something to talk about')).toBe('Something to Talk About');
  });

  it('capitalizes first word of a subtitle', () => {
    expect(titleCase('apollo: the race to the moon')).toBe('Apollo: The Race to the Moon');
  });

  it('treats a dash, or a terminal mark, as a subtitle break', () => {
    expect(titleCase('star wars: episode iv—a new hope')).toBe('Star Wars: Episode IV—A New Hope');
    expect(titleCase('who am i? a memoir')).toBe('Who Am I? A Memoir');
  });

  it('capitalizes the last words of both title and subtitle', () => {
    expect(titleCase('what are you looking for: a study of longing')).toBe(
      'What Are You Looking For: A Study of Longing',
    );
  });

  it('capitalizes pronouns', () => {
    expect(titleCase('space (look it up)')).toBe('Space (Look It Up)');
  });
});

describe('CMOS 8.161', () => {
  it('capitalizes elements of a compound', () => {
    expect(titleCase('a self-taught programmer')).toBe('A Self-Taught Programmer');
    expect(titleCase('the well-known secret')).toBe('The Well-Known Secret');
  });

  it('but lowercases articles, prepositions, and conjunctions in it', () => {
    expect(titleCase('a run-of-the-mill idea')).toBe('A Run-of-the-Mill Idea');
  });

  it('lowercases the element after certain prefixes', () => {
    expect(titleCase('anti-intellectual pursuits')).toBe('Anti-intellectual Pursuits');
    expect(titleCase('e-mail for beginners')).toBe('E-mail for Beginners');
  });

  it('yet capitalizes a recognized proper noun after such a prefix', () => {
    expect(titleCase('pre-Raphaelite painting')).toBe('Pre-Raphaelite Painting');
    expect(titleCase('co-operation between the un and nato')).toBe(
      'Co-operation between the UN and NATO',
    );
  });

  it('also takes direction from caller config', () => {
    expect(titleCase('post-soviet politics')).toBe('Post-soviet Politics');
    expect(titleCase('post-soviet politics', { always: ['soviet'] })).toBe('Post-Soviet Politics');
  });

  it('handles same in all-uppercase input', () => {
    expect(titleCase('ANTI-INTELLECTUAL PURSUITS')).toBe('Anti-intellectual Pursuits');
  });

  it('lowercases the second element of spelt-out numbers and fractions', () => {
    expect(titleCase('the twenty-first century')).toBe('The Twenty-first Century');
    expect(titleCase('two-thirds of a mile')).toBe('Two-thirds of a Mile');
  });

  it('capitalizes the first element even if it is a preposition', () => {
    expect(titleCase('an in-depth look at the up-to-date rules')).toBe(
      'An In-Depth Look at the Up-to-Date Rules',
    );
  });

  it('does not apply the rules of compound words to a recognized dash', () => {
    expect(titleCase('the moon — the sun')).toBe('The Moon — The Sun');
  });
});

import * as assert from 'assert';
import { getCoordinatesToHighlight } from '../color_line_rules';

suite('Test getCoordinatesToHighlight', () => {

  test('Basic: "Some text" with cursor inside first word', () => {
    const text = "Some text";
    const cursorNumber = 2; 
    const expected = [[5], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor at beginning: "Quick scope test"', () => {
    const text = "Quick scope test";
    const cursorNumber = 0;
    const expected = [[6, 12], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor in right-most word: "Quick scope test"', () => {
    const text = "Quick scope test";
    const cursorNumber = 13;
    const expected = [[10, 4], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor in a middle word: "first second third"', () => {
    const text = "first second third";
    const cursorNumber = 8; 
    const expected = [[4, 13], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Punctuation: "Hello, world!" with cursor in first word', () => {
    const text = "Hello, world!";
    const cursorNumber = 2;
    const expected = [[7], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Single word: "Single"', () => {
    const text = "Single";
    const cursorNumber = 3;
    const expected = [[], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Extra spaces: cursor in first word of "  spaced out   words  "', () => {
    const text = "  spaced out   words  ";
    const cursorNumber = 4;
    const expected = [[9, 15], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  // failing
  test('Cursor on whitespace: "abc 123 def"', () => {
    const text = "abc 123 def";
    const cursorNumber = 7;
    const expected = [[2, 6, 8], []];
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });
});

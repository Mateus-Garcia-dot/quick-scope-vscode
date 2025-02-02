import * as assert from 'assert';
import { getCoordinatesToHighlight } from '../color_line_rules';

interface Highlights {
  firstJumps: number[],
  secondJumps: number[],
}

suite('Test getCoordinatesToHighlight', () => {

  test('Basic: "Some text" with cursor inside first word', () => {
    const text = "Some text";
    const cursorNumber = 2; 
    const expected: Highlights = { firstJumps: [5], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor at beginning: "Quick scope test"', () => {
    const text = "Quick scope test";
    const cursorNumber = 0;
    const expected: Highlights = { firstJumps: [6, 12], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor in right-most word: "Quick scope test"', () => {
    const text = "Quick scope test";
    const cursorNumber = 13;
    const expected: Highlights = { firstJumps: [4, 10], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor in a middle word: "first second third"', () => {
    const text = "first second third";
    const cursorNumber = 8; 
    const expected: Highlights = { firstJumps: [4, 13], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Punctuation: "Hello, world!" with cursor in first word', () => {
    const text = "Hello, world!";
    const cursorNumber = 2;
    const expected: Highlights = { firstJumps: [7], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Single word: "Single"', () => {
    const text = "Single";
    const cursorNumber = 3;
    const expected: Highlights = { firstJumps: [], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Extra spaces: cursor in first word of "  spaced out   words  "', () => {
    const text = "  spaced out   words  ";
    const cursorNumber = 4;
    const expected: Highlights = { firstJumps: [9, 15], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Cursor on whitespace: "abc 123 def"', () => {
    const text = "abc 123 def";
    const cursorNumber = 7;
    const expected: Highlights = { firstJumps: [2, 6, 8], secondJumps: [] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Second jumps right: "abc 123 def abc 123 def"', () => {
    const text = "abc 123 def abc 123 def";
    const cursorNumber = 0;
    const expected: Highlights = { firstJumps: [4, 8, 12], secondJumps: [16, 20] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

  test('Second jumps left: "abc 123 def abc 123 def"', () => {
    const text = "abc 123 def abc 123 def";
    const cursorNumber = 22;
    const expected: Highlights = { firstJumps: [10, 14, 18], secondJumps: [2, 6] };
    const result = getCoordinatesToHighlight(text, cursorNumber);
    assert.deepStrictEqual(result, expected);
  });

});

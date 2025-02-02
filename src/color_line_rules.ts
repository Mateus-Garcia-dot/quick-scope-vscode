
const accepted_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

interface Highlights {
  firstJumps: number[],
  secondJumps: number[],
}

interface CharRepresentation {
  character: string,
  relativeIndex: number,
  absoluteIndex: number,
  numOfOccurences: number
}

type WordRepresentation = CharRepresentation[];

export function getCoordinatesToHighlight(line: string, cursorCol: number): Highlights {
  const [leftPart, rightPart] = splitAtIndex(line, cursorCol);

  const leftPartRepresentation = createCharRepresentation(leftPart, cursorCol, true);
  const rightPartRepresentation = createCharRepresentation(rightPart, cursorCol, false);

  const leftPartWords = createWordRepresentation(leftPartRepresentation);
  const rightPartWords = createWordRepresentation(rightPartRepresentation);

  const leftPartHighlights = reduceWordToHighlightChar(leftPartWords, cursorCol);
  const rightPartHighlights = reduceWordToHighlightChar(rightPartWords, cursorCol);

  return {
    firstJumps: mergeAndSortArrays(leftPartHighlights.firstJumps, rightPartHighlights.firstJumps),
    secondJumps: mergeAndSortArrays(leftPartHighlights.secondJumps, rightPartHighlights.secondJumps)
  };
}

function reduceWordToHighlightChar(words: WordRepresentation[], cursorCol: number): Highlights {
  const finalJumps = words.map((word)=> reduceWordToBestCharToJump(word, cursorCol));
  const clearUndefined = finalJumps.filter((word)=> word !== undefined);
  const firstJumps = clearUndefined.filter(value => value.numOfOccurences === 1);
  const secondJumps = clearUndefined.filter(value => value.numOfOccurences === 2);
  return {
    firstJumps: firstJumps.map(char => char.absoluteIndex),
    secondJumps: secondJumps.map(char => char.absoluteIndex),
  };
}

function reduceWordToBestCharToJump(word: WordRepresentation, cursorCol: number): CharRepresentation | undefined {
  const isTheCursorOnThisWord = word.some(value => value.absoluteIndex === cursorCol);
  if (isTheCursorOnThisWord) {
    return undefined;
  }

  const candidates = word.filter(value => value.numOfOccurences <= 2);
  
  return candidates.reduce<CharRepresentation | undefined>((best, candidate) => {
    if (!best) { 
      return candidate;
    };
    
    if (candidate.numOfOccurences < best.numOfOccurences) {
      return candidate;
    }  

    if (candidate.numOfOccurences === best.numOfOccurences) {
      return candidate.relativeIndex < best.relativeIndex ? candidate : best;
    }
    
    return best;
  }, undefined);
}

function createWordRepresentation(chars: CharRepresentation[]): WordRepresentation[] {
  const limitIndexes: number[] = chars.reduce<number[]>((acc, char) => {
    if (accepted_chars.includes(char.character)) {
      return acc;
    }
    acc.push(char.relativeIndex);
    return acc;
  }, []);
  return bucketCharsIntoWords(chars, limitIndexes);
}

function bucketCharsIntoWords(chars: CharRepresentation[], limits: number[]): WordRepresentation[] {
  const sortedLimits = limits.sort((a, b) => a - b);
  const sortedChars = chars.sort((a, b) => a.relativeIndex - b.relativeIndex);

  const buckets: WordRepresentation[] = [];
  let temp: WordRepresentation = [];

  const flush = () => {
    if (temp.length > 0) {
      buckets.push(temp);
      temp = [];
    }
  };

  for (const char of sortedChars) {
    if (sortedLimits.includes(char.relativeIndex)) {
      flush();
      continue;
    } 
    temp.push(char);
  }
  flush();

  return buckets;
}

function createCharRepresentation(line: string, padding: number, shouldReverse: boolean): CharRepresentation[] {
  
  const lines =  shouldReverse ? reverseString(line): line;

  const charOcurrences: Record<string, number> = {};
  return [...lines].map<CharRepresentation>((char, index) => {
    const isFirstChar = index === 0; // the first char is here for completeness but it doesnt count as a jump
    charOcurrences[char] = isFirstChar ? 0 : (charOcurrences[char] ?? 0) + 1 ;
    return {
      character: char,
      relativeIndex: index,
      absoluteIndex: shouldReverse ? padding - index : padding + index,
      numOfOccurences: isFirstChar ? Infinity : charOcurrences[char]
    };
  });
}

function splitAtIndex(input: string, index: number): [string, string] {
  const left = input.slice(0, index + 1); // includes the character at `index`
  const right = input.slice(index);       // starts with the character at `index`
  return [left, right];
}

function reverseString(str: string): string {
  return [...str].reverse().join("");
}

function mergeAndSortArrays(arr1: number[], arr2: number[]): number[] {
  const merged = [...arr1, ...arr2];
  merged.sort((a, b) => a - b);
  return merged;
}
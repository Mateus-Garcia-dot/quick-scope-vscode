
const accepted_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function getCoordinatesToHighlight(line: string, cursorCol: number): [number[], number[]] {
    const [left, right] = splitAt(cursorCol, line);
    const [first_occurences_left, second_occurences_left] = getOccurrences(reverseString(left))
        .map(nested => nested.map(coord => cursorCol - coord - 1));
    const [first_occurences_right, second_occurences_right] = getOccurrences(right)
        .map(nested => nested.map(coord => cursorCol + coord + 1));
    const fix_coords_first = [...first_occurences_left, ...first_occurences_right];
    const fix_coords_second = [...second_occurences_left, ...second_occurences_right];
    return [
        fix_coords_first,
        fix_coords_second
    ];
}


function splitArrayOnNull<T>(arr: Array<T>): Array<Array<T>> {
  const result = [];
  let temp = [];
  for (const item of arr) {
    if (item === null) {
      if (temp.length) {
        result.push(temp);
        temp = [];
      }
    } else {
      temp.push(item);
    }
  }
  if (temp.length) {
    result.push(temp);
  }
  return result;
}

function getOccurrences(line: string): [number[], number[]] {
    const hash_accepted_chars: { [key: string]: number } = accepted_chars.reduce((acc, value) => ({ ...acc, [value]: 0 }), {});
    const describe_line = [];
    for (let index = 0; index < line.length; index++) {
        const char = line[index];
        if (!accepted_chars.includes(char)) {
            describe_line.push(null);
            continue;
        }
        const describe_char = {
            index,
            frequency: hash_accepted_chars[char]++
        };
        describe_line.push(describe_char);
    }
    const filtered_describe_line = describe_line.filter((value) => value === null || value.frequency < 2);
    const splited = splitArrayOnNull(filtered_describe_line);
    splited.shift();
    const reduces = splited.map((arr) => arr.reduce((acc, value) => (acc?.frequency || 0)  < (value?.frequency || 0) ? acc : value));
    return reduces.reduce((acc: [number[], number[]], value) => {
        if (value?.frequency !== undefined) {
            acc[value.frequency].push(value.index);
        }
        return acc;
    }, [[], []]);
}


function splitAt(i: number, str: string): [string, string] {
    return [str.slice(0, i), str.slice(i + 1)];
}

function reverseString(str: string): string {
    return Array.from(str).reverse().join('');
}


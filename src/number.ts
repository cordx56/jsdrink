import { ParseInput, ParseResult } from "./jsdrink";
import { getCharCode, tf } from "./tools";
import { sequence } from "./sequence";
import { bytes, numeric1 } from "./bytes";

const bytesToNumber = (input: Uint8Array): number => {
  let res = 0;
  for (const v of input) {
    res *= 10;
    res += v - getCharCode("0");
  }
  return res;
};

// integer parses an input integer and returns it as a value of type number.
export const integer = (input: ParseInput): ParseResult<number> => {
  return tf(numeric1, (numeric: Uint8Array | null) => {
    if (numeric === null) {
      return 0;
    }
    return bytesToNumber(numeric);
  })(input);
};

// float parses a float number and returns it as a value of type number.
export const float = (input: ParseInput): ParseResult<number> => {
  return tf(
    sequence(integer, bytes("."), numeric1),
    (parsed: any[] | null): number => {
      if (parsed === null) {
        return 0;
      }
      const integer = parsed[0];
      const decimalBytes = parsed[2];
      const decimal =
        bytesToNumber(decimalBytes) / Math.pow(10, decimalBytes.length);
      return integer + decimal;
    }
  )(input);
};

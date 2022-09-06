import { ParseInput, ParseResult, ParserFunc, ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { inputToBytes, getCharCode } from "./tools";

const checkBytesEqual = (a: ParseInput, b: ParseInput): boolean => {
  const aBytes = inputToBytes(a);
  const bBytes = inputToBytes(b);
  if (aBytes.length != bBytes.length) {
    return false;
  }
  for (let i = 0; i < aBytes.length; i++) {
    if (aBytes[i] !== bBytes[i]) {
      return false;
    }
  }
  return true;
};

// bytes function tries to parse a sequence of bytes passed as an argument.
export const bytes = (test: ParseInput): ParserFunc<Uint8Array> => {
  return (input: ParseInput): ParseResult<Uint8Array> => {
    const inputBytes = inputToBytes(input);
    const testBytes = inputToBytes(test);
    if (inputBytes.length < testBytes.length) {
      return new ParseError("bytes", inputBytes.length, null);
    }
    if (
      checkBytesEqual(testBytes, inputBytes.subarray(0, testBytes.length))
    ) {
      const remainBytes = inputBytes.subarray(testBytes.length);
      return new ParseSuccess(testBytes, remainBytes);
    } else {
      return new ParseError("bytes", inputBytes.length, null);
    }
  };
};

const indexOfArray = (target: Uint8Array, search: Uint8Array): number => {
  // later implement KNP
  for (let i = 0; i <= target.length - search.length; i++) {
    if (checkBytesEqual(target.subarray(i, i + search.length), search)) {
      return i;
    }
  }
  return -1;
};

// until function returns the input until the first byte sequence
// occurrence specified in the argument.
export const until = (...bytes: ParseInput[]): ParserFunc<Uint8Array> => {
  return (input: ParseInput): ParseResult<Uint8Array> => {
    let pos = -1;
    const inputBytes = inputToBytes(input);
    for (const b of bytes) {
      const bBytes = inputToBytes(b);
      const index = indexOfArray(inputBytes, bBytes);
      if (index != -1 && (pos === -1 || index < pos)) {
        pos = index;
      }
    }
    if (-1 < pos) {
      return new ParseSuccess(
        inputBytes.subarray(0, pos),
        inputBytes.subarray(pos)
      );
    } else {
      return new ParseSuccess(inputBytes, Uint8Array.of());
    }
  };
};

const checkByteSequence = (
  input: ParseInput,
  checkFunc: (b: number) => boolean,
  minLength: number,
  errStr:
    | "space0"
    | "space1"
    | "multiSpace0"
    | "multiSpace1"
    | "alpha0"
    | "alpha1"
    | "numeric0"
    | "numeric1"
    | "alphaNumeric0"
    | "alphaNumeric1"
): ParseResult<Uint8Array> => {
  const inputBytes = inputToBytes(input);
  let ret = Uint8Array.of();
  for (let i = 0; i < inputBytes.length; i++) {
    if (checkFunc(inputBytes[i])) {
      ret = Uint8Array.of(...ret, inputBytes[i]);
    } else {
      if (i < minLength) {
        return new ParseError(errStr, inputBytes.length - ret.length, null);
      } else {
        return new ParseSuccess(ret, inputBytes.subarray(i));
      }
    }
  }
  return new ParseSuccess(ret, Uint8Array.of());
};

const isSpace = (b: number): boolean => {
  return b === getCharCode(" ") || b === getCharCode("\t");
};
const isMultiSpace = (b: number): boolean => {
  return isSpace(b) || b === getCharCode("\n") || b === getCharCode("\r");
};

// space0 matches zero or more spaces (" " or "\t").
export const space0 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isSpace, 0, "space0");
};
// space1 matches one or more spaces (" " or "\t").
export const space1 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isSpace, 1, "space1");
};
// multiSpace0 matches zero or more spaces and line breaks
// (" " or "\t" or "\n" or "\r").
export const multiSpace0 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isMultiSpace, 0, "multiSpace0");
};
// multiSpace1 matches one or more spaces and line breaks
// (" " or "\t" or "\n" or "\r").
export const multiSpace1 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isMultiSpace, 1, "multiSpace1");
};

const isAlpha = (b: number): boolean => {
  return (
    (getCharCode("A") <= b && b <= getCharCode("Z")) ||
    (getCharCode("a") <= b && b <= getCharCode("z"))
  );
};
const isNumeric = (b: number): boolean => {
  return getCharCode("0") <= b && b <= getCharCode("9");
};

// alpha0 function matches alphabets of zero or more characters.
export const alpha0 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isAlpha, 0, "alpha0");
};
// alpha1 function matches alphabets of one or more characters.
export const alpha1 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isAlpha, 1, "alpha1");
};
// numeric0 function matches numeric sequences of zero or more characters.
export const numeric0 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isNumeric, 0, "numeric0");
};
// numeric1 function matches numeric sequences of one or more characters.
export const numeric1 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isNumeric, 1, "numeric1");
};

const isAlphaNumeric = (b: number): boolean => {
  return isAlpha(b) || isNumeric(b);
};

// alphaNumeric0 function matches a sequence of zero or more
// alphabetic or numeric characters.
export const alphaNumeric0 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isAlphaNumeric, 0, "alphaNumeric0");
};
// alphaNumeric1 function matches a sequence of one or more
// alphabetic or numeric characters.
export const alphaNumeric1 = (input: ParseInput): ParseResult<Uint8Array> => {
  return checkByteSequence(input, isAlphaNumeric, 1, "alphaNumeric1");
};

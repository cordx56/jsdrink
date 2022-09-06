import { ParseInput, ParseResult, ParserFunc, ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { getCharCode, inputToString } from "./tools";

// string function tries to parse a string passed as an argument.
export const string = (test: ParseInput): ParserFunc<string> => {
  return (input: ParseInput): ParseResult<string> => {
    const inputString = inputToString(input);
    const testString = inputToString(test);
    if (inputString.length < testString.length) {
      return new ParseError("string", inputString.length, null);
    }
    if (inputString.slice(0, testString.length) === testString) {
      const remainString = inputString.slice(testString.length);
      return new ParseSuccess(testString, remainString);
    } else {
      return new ParseError("string", inputString.length, null);
    }
  };
};

// until function returns the input until the first string
// occurrence specified in the argument.
export const until = (...strs: ParseInput[]): ParserFunc<string> => {
  return (input: ParseInput): ParseResult<string> => {
    let pos = -1;
    const inputString = inputToString(input);
    for (const s of strs) {
      const testString = inputToString(s);
      const index = inputString.indexOf(testString);
      if (index != -1 && (pos === -1 || index < pos)) {
        pos = index;
      }
    }
    if (-1 < pos) {
      return new ParseSuccess(
        inputString.slice(0, pos),
        inputString.slice(pos)
      );
    } else {
      return new ParseSuccess(inputString, "");
    }
  };
};

const checkStringSequence = (
  input: ParseInput,
  checkFunc: (b: string) => boolean,
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
): ParseResult<string> => {
  const inputString = inputToString(input);
  let ret = "";
  for (let i = 0; i < inputString.length; i++) {
    if (checkFunc(inputString[i])) {
      ret += inputString[i];
    } else {
      if (i < minLength) {
        return new ParseError(errStr, inputString.length - ret.length, null);
      } else {
        return new ParseSuccess(ret, inputString.slice(i));
      }
    }
  }
  return new ParseSuccess(ret, "");
};

const isSpace = (s: string): boolean => {
  return s === " " || s === "\t";
};
const isMultiSpace = (s: string): boolean => {
  return isSpace(s) || s === "\n" || s === "\r";
};

// space0 matches zero or more spaces (" " or "\t").
export const space0 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isSpace, 0, "space0");
};
// space1 matches one or more spaces (" " or "\t").
export const space1 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isSpace, 1, "space1");
};
// multiSpace0 matches zero or more spaces and line breaks
// (" " or "\t" or "\n" or "\r").
export const multiSpace0 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isMultiSpace, 0, "multiSpace0");
};
// multiSpace1 matches one or more spaces and line breaks
// (" " or "\t" or "\n" or "\r").
export const multiSpace1 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isMultiSpace, 1, "multiSpace1");
};

const isAlpha = (s: string): boolean => {
  return (
    (getCharCode("A") <= getCharCode(s) &&
      getCharCode(s) <= getCharCode("Z")) ||
    (getCharCode("a") <= getCharCode(s) && getCharCode(s) <= getCharCode("z"))
  );
};
const isNumeric = (s: string): boolean => {
  return (
    getCharCode("0") <= getCharCode(s) && getCharCode(s) <= getCharCode("9")
  );
};

// alpha0 function matches alphabets of zero or more characters.
export const alpha0 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isAlpha, 0, "alpha0");
};
// alpha1 function matches alphabets of one or more characters.
export const alpha1 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isAlpha, 1, "alpha1");
};
// numeric0 function matches numeric sequences of zero or more characters.
export const numeric0 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isNumeric, 0, "numeric0");
};
// numeric1 function matches numeric sequences of one or more characters.
export const numeric1 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isNumeric, 1, "numeric1");
};

const isAlphaNumeric = (s: string): boolean => {
  return isAlpha(s) || isNumeric(s);
};

// alphaNumeric0 function matches a sequence of zero or more
// alphabetic or numeric characters.
export const alphaNumeric0 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isAlphaNumeric, 0, "alphaNumeric0");
};
// alphaNumeric1 function matches a sequence of one or more
// alphabetic or numeric characters.
export const alphaNumeric1 = (input: ParseInput): ParseResult<string> => {
  return checkStringSequence(input, isAlphaNumeric, 1, "alphaNumeric1");
};

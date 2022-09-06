import { ParseInput, ParseResult } from "./jsdrink";
import { inputToBytes, getCharCode } from "./tools";

export type FailureCause =
  | "any"
  | "many0"
  | "many1"
  | "noRemain"
  | "not"
  | "sequence"
  | "next"
  | "bytes"
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
  | "string";

// Location contains row number, col number and error line.
export class Location {
  constructor(
    public readonly row: number,
    public readonly col: number,
    public readonly line: ParseInput
  ) {}
}

// ParseFailure contains the name of the function that caused the parse error,
// the number of bytes remaining from the point where the error occurred,
// and the parent error, if any.
export class ParseError {
  constructor(
    public readonly cause: FailureCause,
    public readonly remainLength: number,
    public readonly parentError: ParseError | null
  ) {}
  // getErrorFunction takes an input as argument and
  // outputs the location of the error as Location.
  getErrorLocation = (input: ParseInput): Location => {
    let row = 0;
    let col = 0;
    let lineArray = Uint8Array.of();
    const lineBreakCharCode = getCharCode("\n");
    for (const v of inputToBytes(input)) {
      if (v === lineBreakCharCode) {
        row += 1;
        col = 0;
        lineArray = Uint8Array.of();
      } else {
        col += 1;
        lineArray = new Uint8Array(lineArray, ...[v]);
      }
    }
    let line: ParseInput;
    if (typeof input === "string") {
      line = new TextDecoder().decode(lineArray);
    } else {
      line = lineArray;
    }
    return new Location(row, col, line);
  };
  // formatErrorMessage method takes an input as
  // argument and returns a formatted error message.
  formatErrorMessage = (input: ParseInput): string => {
    const loc = this.getErrorLocation(input);
    let res = `Parse error at row ${loc.row + 1}, col ${
      loc.col + 1
    }, caused by ${this.cause}\n`;
    const line = `${loc.row + 1}: `;
    res += line;
    res += `${loc.line}\n`;
    for (let i = 0; i < line.length + loc.col; i++) {
      res += " ";
    }
    res += "^";
    if (this.parentError !== null) {
      res += "\nThis error caused by this parent error:\n";
      res += this.parentError.formatErrorMessage(input);
    }
    return res;
  };
}

export const isParseError = <T>(res: ParseResult<T>): boolean => {
  return res instanceof ParseError;
};

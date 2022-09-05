import { ParseInput, ParseSuccess, ParseResult, ParserFunc } from "./jsdrink";
import { ParseError } from "./error";

export const inputToBytes = (input: ParseInput): Uint8Array => {
  if (typeof input === "string") {
    return (new TextEncoder).encode(input);
  } else {
    return input;
  }
};

export const bytesToString = (bytes: Uint8Array, encoding: string = "utf-8"): string => {
  return (new TextDecoder(encoding)).decode(bytes);
};

export const getCharCode = (char: string): number => {
  return char.charCodeAt(0);
};

// optional function succeeds either the function
// given as the argument succeeds or not.
// optional takes ParserFunc<T> as an argument and
// returns a ParseSuccess<T>.
export const optional = <T>(p: ParserFunc<T>): ParserFunc<T> => {
  return (input: ParseInput): ParseResult<T> => {
    const res = p(input);
    if (res instanceof ParseError) {
      return new ParseSuccess<T>(null, input);
    } else {
      return res;
    }
  };
};

// opt function is alias of the Optional function
export const opt = <T>(p: ParserFunc<T>): ParserFunc<T> => {
  return optional(p)
}

// any function tries functions given as arguments in order.
export const any = <T>(...ps: ParserFunc<T>[]): ParserFunc<T> => {
  return (input: ParseInput): ParseResult<T> => {
    for (const p of ps) {
      const res = p(input);
      if (res instanceof ParseSuccess) {
        return res;
      }
    }
    return new ParseError("any", input.length, null);
  };
}

// transform function transforms the parsed result to another type
// using the transformer function given as an argument.
export const transform = <T, U>(p: ParserFunc<T>, transformer: (b: T | null) => U | null): ParserFunc<U> => {
  return (input: ParseInput): ParseResult<U> => {
    const res = p(input);
    if (res instanceof ParseError) {
      return res;
    }
    const transformed = transformer(res.parsed);
    return new ParseSuccess(transformed, res.remain);
  };
};

// tf function is alias of the Transform function
export const tf = <T, U>(p: ParserFunc<T>, transformer: (b: T | null) => U): ParserFunc<U> => {
  return transform(p, transformer);
};

const many = <T>(p: ParserFunc<T>, minCount: number, errStr: "many0" | "many1"): ParserFunc<(T | null)[]> => {
  return (input: ParseInput): ParseResult<(T | null)[]> => {
    let result = [];
    let remain = input;
    for (let i = 0; ; i++) {
      const remainLen = remain.length;
      const res = p(remain);
      if (res instanceof ParseError) {
        if (i < minCount) {
          return new ParseError(errStr, remain.length, res);
        } else {
          return new ParseSuccess(result, remain);
        }
      } else {
        // Infinite loop
        if (remainLen === res.remain.length) {
          return new ParseError(errStr, remainLen, null);
        }
      }
      result.push(res.parsed);
      remain = res.remain;
    }
  };
};

// many0 function repeatedly attempts to parse with
// the function passed as an argument.
export const many0 = <T>(p: ParserFunc<T>): ParserFunc<(T | null)[]> => {
  return many(p, 0, "many0");
}
// many1 function repeatedly attempts to parse with
// the function passed as an argument.
//
// many1 function require at least 1 matching.
export const many1 = <T>(p: ParserFunc<T>): ParserFunc<(T | null)[]> => {
  return many(p, 1, "many1");
}

// noRemain function forces the function passed as
// an argument to consume all input.
export const noRemain = <T>(p: ParserFunc<T>): ParserFunc<T> => {
  return (input: ParseInput): ParseResult<T> => {
    const res = p(input);
    if (res instanceof ParseError) {
      return new ParseError("noRemain", res.remainLength, res);
    } else {
      if (0 < res.remain.length) {
        return new ParseError("noRemain", res.remain.length, null);
      } else {
        return res;
      }
    }
  };
};

// not function returns an error if the parser passed as
// an argument succeeds, otherwise it returns success.
export const not = <T>(p: ParserFunc<T>): ParserFunc<ParseInput> => {
  return (input: ParseInput): ParseResult<ParseInput> => {
    const res = p(input);
    if (res instanceof ParseError) {
      return new ParseSuccess(input, Uint8Array.of());
    } else {
      return new ParseError("not", input.length, null);
    }
  };
};

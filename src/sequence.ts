import { ParseInput, ParseResult, ParserFunc, ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";

// sequence returns a function that takes input as argument and
// returns parse result.
// The function returns by sequesnce function tries to parse input
// in order of sequence function's arguments.
// If all parsers passed as arguments succeeds to parse input,
// then return ParseSuccess[T[]].
// If one of the parsers failed to parse input, then return ParseError.
export const sequence = (...ps: ParserFunc<any>[]): ParserFunc<any[]> => {
  return (input: ParseInput): ParseResult<any[]> => {
    const result = [];
    let remain = input;
    for (const p of ps) {
      const res = p(remain);
      if (res instanceof ParseError) {
        return new ParseError("sequence", remain.length, res);
      }
      result.push(res.parsed);
      remain = res.remain;
    }
    return new ParseSuccess(result, remain);
  };
};

// Pair is a struct that contains pair of datum
type Pair<T, U> = {
  prev: T | null;
  next: U | null;
};

// next function takes two parsers as arguments and parses the input in order.
export const next = <T, U>(
  p0: ParserFunc<T>,
  p1: ParserFunc<U>
): ParserFunc<Pair<T | null, U | null>> => {
  return (input: ParseInput): ParseResult<Pair<T, U>> => {
    const r0 = p0(input);
    if (r0 instanceof ParseError) {
      return new ParseError("next", input.length, r0);
    }
    const r1 = p1(r0.remain);
    if (r1 instanceof ParseError) {
      return new ParseError("next", input.length, r1);
    }

    return new ParseSuccess({ prev: r0.parsed, next: r1.parsed }, r1.remain);
  };
};

import { ParseResult } from "./jsdrink";
import { ParseError } from "./error";

export const checkError = <T>(res: ParseResult<T>, toStrictEqual: ParseError) => {
  expect(res instanceof ParseError).toBe(true);
  if (res instanceof ParseError) {
    expect(res.cause).toBe(toStrictEqual.cause);
    expect(res.remainLength).toBe(toStrictEqual.remainLength);
    if (res.parentError !== null && toStrictEqual.parentError !== null) {
      checkError(res.parentError, toStrictEqual.parentError);
    } else {
      expect(res.parentError).toBe(toStrictEqual.parentError);
    }
  }
};

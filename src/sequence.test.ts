import { ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { sequence, next } from "./sequence";
import { alpha1, bytes, numeric1 } from "./bytes";
import { inputToBytes } from "./tools";
import { checkError } from "./testhelpers";

describe("sequential parser", () => {
  test("sequential parse", () => {
    expect(sequence(alpha1, numeric1)("abc123")).toStrictEqual(
      new ParseSuccess(
        [inputToBytes("abc"), inputToBytes("123")],
        inputToBytes("")
      )
    );
  });
  test("sequential parse error", () => {
    checkError(
      sequence(bytes("abc"), bytes("def"))("abc123"),
      new ParseError("sequence", 6, new ParseError("bytes", 3, null))
    );
  });
});

describe("next parser", () => {
  test("next parse", () => {
    expect(next(alpha1, numeric1)("abc123")).toStrictEqual(
      new ParseSuccess(
        { prev: inputToBytes("abc"), next: inputToBytes("123") },
        inputToBytes("")
      )
    );
  });
  test("next parse error", () => {
    checkError(
      next(bytes("abc"), bytes("def"))("abc123"),
      new ParseError("next", 6, new ParseError("bytes", 3, null))
    );
  });
});

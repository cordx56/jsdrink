import { ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { inputToBytes } from "./tools";
import { integer, float } from "./number";
import { checkError } from "./testhelpers";

describe("integer parser", () => {
  test("consume integer", () => {
    expect(integer("123abc")).toStrictEqual(
      new ParseSuccess(123, inputToBytes("abc"))
    );
  });
  test("consume integer error", () => {
    checkError(integer("abc123"), new ParseError("numeric1", 6, null));
  });
});

describe("float parser", () => {
  test("consume float", () => {
    expect(float("123.456")).toStrictEqual(
      new ParseSuccess(123.456, inputToBytes(""))
    );
  });
  test("consume float error", () => {
    checkError(
      float("123"),
      new ParseError("sequence", 3, new ParseError("bytes", 0, null))
    );
  });
});

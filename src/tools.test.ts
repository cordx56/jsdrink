import { ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { alpha1, bytes, numeric1 } from "./bytes";
import {
  inputToBytes,
  optional,
  any,
  transform,
  many0,
  many1,
  noRemain,
  not,
} from "./tools";
import { checkError } from "./testhelpers";

describe("optional parser", () => {
  test("optional consume parse", () => {
    expect(optional(bytes("abc"))("abc123")).toStrictEqual(
      new ParseSuccess(inputToBytes("abc"), inputToBytes("123"))
    );
  });
  test("optional not consume parse", () => {
    expect(optional(bytes("abc"))("123abc")).toStrictEqual(
      new ParseSuccess(null, "123abc")
    );
  });
});

import { ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import { alpha1, bytes, numeric1 } from "./bytes";
import { integer } from "./number";
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

describe("any parser", () => {
  test("any success", () => {
    expect(any(bytes("abc"), bytes("123"))("123abc")).toStrictEqual(
      new ParseSuccess(inputToBytes("123"), inputToBytes("abc"))
    );
  });
  test("any failure", () => {
    checkError(
      any(bytes("abc"), bytes("123"))("test"),
      new ParseError("any", 4, null)
    );
  });
});

describe("transform parsed result", () => {
  test("add 1 to parsed integer", () => {
    expect(
      transform(integer, (a) => (a !== null ? a + 1 : a))("123")
    ).toStrictEqual(new ParseSuccess(124, inputToBytes("")));
  });
});

describe("many0 parser", () => {
  test("two matched bytes", () => {
    expect(many0(bytes("abc"))("abcabc")).toStrictEqual(
      new ParseSuccess(
        [inputToBytes("abc"), inputToBytes("abc")],
        inputToBytes("")
      )
    );
  });
  test("no matched bytes", () => {
    expect(many0(bytes("abc"))("defghi")).toStrictEqual(
      new ParseSuccess([], "defghi")
    );
  });
});

describe("many1 parser", () => {
  test("two matched bytes", () => {
    expect(many1(bytes("abc"))("abcabc")).toStrictEqual(
      new ParseSuccess(
        [inputToBytes("abc"), inputToBytes("abc")],
        inputToBytes("")
      )
    );
  });
  test("no matched bytes error", () => {
    checkError(
      many1(bytes("abc"))("defghi"),
      new ParseError("many1", 6, new ParseError("bytes", 6, null))
    );
  });
});

describe("noRemain parser", () => {
  test("remain error", () => {
    checkError(noRemain(alpha1)("abc123"), new ParseError("noRemain", 3, null));
  });
});

describe("not parser", () => {
  test("not parser success", () => {
    expect(not(alpha1)("123abc")).toStrictEqual(
      new ParseSuccess("123abc", inputToBytes(""))
    );
  });
  test("not parser error", () => {
    checkError(not(alpha1)("abc123"), new ParseError("not", 6, null));
  });
});

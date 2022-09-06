import { ParseSuccess } from "./jsdrink";
import { ParseError } from "./error";
import {
  string,
  until,
  space0,
  space1,
  multiSpace0,
  multiSpace1,
  numeric0,
  numeric1,
  alpha0,
  alpha1,
  alphaNumeric0,
  alphaNumeric1,
} from "./string";
import {} from "./tools";
import { checkError } from "./testhelpers";

describe("string parser", () => {
  test("consume string", () => {
    expect(string("abc")("abc123")).toStrictEqual(
      new ParseSuccess("abc", "123")
    );
  });
  test("consume string error", () => {
    checkError(string("abc")("123abc"), new ParseError("string", 6, null));
  });
});

describe("until parser", () => {
  test("consume until", () => {
    expect(until("123")("abc123")).toStrictEqual(
      new ParseSuccess("abc", "123")
    );
  });
  test("consume until remain", () => {
    expect(until("123")("abc123def")).toStrictEqual(
      new ParseSuccess("abc", "123def")
    );
  });
  test("consume all", () => {
    expect(until("456")("abc123")).toStrictEqual(
      new ParseSuccess("abc123", "")
    );
  });
});

describe("space0 parser", () => {
  test("consume spaces", () => {
    expect(space0(" \t abc")).toStrictEqual(new ParseSuccess(" \t ", "abc"));
  });
  test("no spaces", () => {
    expect(space0("\n abc")).toStrictEqual(new ParseSuccess("", "\n abc"));
  });
});
describe("space1 parser", () => {
  test("consume spaces", () => {
    expect(space1(" \t abc")).toStrictEqual(new ParseSuccess(" \t ", "abc"));
  });
  test("no spaces error", () => {
    checkError(space1("\n abc"), new ParseError("space1", 5, null));
  });
});

describe("multiSpace0 parser", () => {
  test("consume multi spaces", () => {
    expect(multiSpace0(" \n abc")).toStrictEqual(
      new ParseSuccess(" \n ", "abc")
    );
  });
  test("no multi spaces", () => {
    expect(multiSpace0("abc")).toStrictEqual(new ParseSuccess("", "abc"));
  });
});
describe("multiSpace1 parser", () => {
  test("consume multi spaces", () => {
    expect(multiSpace1(" \n abc")).toStrictEqual(
      new ParseSuccess(" \n ", "abc")
    );
  });
  test("no multi spaces error", () => {
    checkError(multiSpace1("abc"), new ParseError("multiSpace1", 3, null));
  });
});

describe("numeric0 parser", () => {
  test("consume numerics", () => {
    expect(numeric0("123abc")).toStrictEqual(new ParseSuccess("123", "abc"));
  });
  test("no numerics", () => {
    expect(numeric0("abc123")).toStrictEqual(new ParseSuccess("", "abc123"));
  });
});
describe("numeric1 parser", () => {
  test("consume numerics", () => {
    expect(numeric1("123abc")).toStrictEqual(new ParseSuccess("123", "abc"));
  });
  test("no numerics error", () => {
    checkError(numeric1("abc123"), new ParseError("numeric1", 6, null));
  });
});

describe("alpha0 parser", () => {
  test("consume alphas", () => {
    expect(alpha0("abc123")).toStrictEqual(new ParseSuccess("abc", "123"));
  });
  test("no alphas", () => {
    expect(alpha0("123abc")).toStrictEqual(new ParseSuccess("", "123abc"));
  });
});
describe("alpha1 parser", () => {
  test("consume alphas", () => {
    expect(alpha1("abc123")).toStrictEqual(new ParseSuccess("abc", "123"));
  });
  test("no alphas error", () => {
    checkError(alpha1("123abc"), new ParseError("alpha1", 6, null));
  });
});

describe("alphaNumeric0 parser", () => {
  test("consume alphas & numerics", () => {
    expect(alphaNumeric0("abc123")).toStrictEqual(
      new ParseSuccess("abc123", "")
    );
  });
  test("no alphas & numerics", () => {
    expect(alphaNumeric0("テスト")).toStrictEqual(
      new ParseSuccess("", "テスト")
    );
  });
});
describe("alphaNumeric1 parser", () => {
  test("consume alphas & numerics", () => {
    expect(alphaNumeric1("abc123")).toStrictEqual(
      new ParseSuccess("abc123", "")
    );
  });
  test("no alphas & numerics error", () => {
    checkError(
      alphaNumeric1("テスト"),
      new ParseError("alphaNumeric1", 3, null)
    );
  });
});

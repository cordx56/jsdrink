# jsdrink - simple parser combinators library

[![Package version](https://img.shields.io/github/package-json/v/cordx56/jsdrink)](https://github.com/cordx56/jsdrink/blob/main/package.json)
[![npm version](https://img.shields.io/npm/v/jsdrink)](https://www.npmjs.com/package/jsdrink)
[![CI](https://github.com/cordx56/jsdrink/actions/workflows/ci.yml/badge.svg)](https://github.com/cordx56/jsdrink/actions)
[![License](https://img.shields.io/github/license/cordx56/jsdrink)](https://github.com/cordx56/jsdrink/blob/main/LICENSE)

jsdrink is a simple parser combinators library written in TypeScript, ported from [cordx56/godrink](https://github.com/cordx56/godrink).

## Feature
jsdrink is a simple, lightweight library.
jsdrink does not depend on non-standard libraries except dev-dependencies.

jsdrink reads input bytes or string and applies parsers in sequence and parses them into the desired structures.

## Documentation
See [https://cordx.net/jsdrink/](https://cordx.net/jsdrink/).

## Example
### Example code
Here is an example of a calculator.
```typescript
import { ParseResult, tf, sequence, any, many0 } from "jsdrink";
import { string, space0 } from "jsdrink/string";
import { integer } from "jsdrink/number";

const expr = (input: string): ParseResult<number> => {
  return tf(
    sequence(
      term,
      many0(
        tf(
          sequence(space0, any(string("+"), string("-")), space0, term),
          (parsed) => {
            if (parsed[1] == "+") {
              return parsed[3];
            } else if (parsed[1] == "-") {
              return -1 * parsed[3];
            } else {
              return 0;
            }
          }
        )
      )
    ),
    (parsed) => {
      return parsed[0] + parsed[1].reduce((sum, elem) => sum + elem, 0);
    }
  )(input);
};

const term = (input: string): ParseResult<number> => {
  return tf(
    sequence(
      factor,
      many0(
        tf(
          sequence(space0, any(string("*"), string("/")), space0, factor),
          (parsed) => {
            if (parsed[1] == "*") {
              return parsed[3];
            } else if (parsed[1] == "/") {
              return 1 / parsed[3];
            } else {
              return 0;
            }
          }
        )
      )
    ),
    (parsed) => {
      return parsed[0] * parsed[1].reduce((sum, elem) => sum * elem, 1);
    }
  )(input);
};

const factor = (input: string): ParseResult<number> => {
  return any(
    integer,
    tf(sequence(string("("), space0, expr, space0, string(")")), (parsed) => {
      return parsed[2];
    })
  )(input);
};

console.log(expr("3 / (1 + 2) * 9").parsed); // 9
```

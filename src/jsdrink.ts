import { ParseError } from "./error";

export type ParseInput = Uint8Array | string;

// ParseSuccess contains the parsed object and
// the remaining data.
//
// The type parameter T appears in the parsed field.
// The type of the parsed field is T.
// The parsed field may be null (e.g. Optional function
// may return a ParseResult where the Parsed field is nil).
//
// The Remain field is the remainder of the parsed input.
export class ParseSuccess<T> {
  constructor(
    public readonly parsed: T | null,
    public readonly remain: ParseInput
  ) {}
}

// ParseResult contains a pointer to the parsed object and
// the remaining bytes.
// Parser should return ParseResult.
//
// The type parameter T appears in the Parsed field.
// The type of the Parsed field is a pointer of T.
// The Parsed field may be nil (e.g. Optional function
// may return a ParseResult where the Parsed field is nil).
//
// The Remain field is the remainder of the parsed input.
export type ParseResult<T> = ParseSuccess<T> | ParseError;

// ParserFunc is a function type definition that takes input
// as an argument and returns a ParseResult.
// The return type of a function returning a parser should be this.
export type ParserFunc<T> = (input: ParseInput) => ParseResult<T>;

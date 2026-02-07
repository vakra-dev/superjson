declare module "json-source-map" {
  interface Position {
    line: number;
    column: number;
    pos: number;
  }

  interface Pointer {
    key?: Position;
    keyEnd?: Position;
    value: Position;
    valueEnd: Position;
  }

  interface StringifyResult {
    json: string;
    pointers: Record<string, Pointer>;
  }

  interface ParseResult {
    data: unknown;
    pointers: Record<string, Pointer>;
  }

  function stringify(
    data: unknown,
    replacer?: null,
    space?: string | number
  ): StringifyResult;

  function parse(json: string): ParseResult;

  export default { stringify, parse };
  export { stringify, parse, Position, Pointer, StringifyResult, ParseResult };
}

@json
export class Position {
  public line: i32 = 0
  public column: i32 = 0

  constructor(line: i32, column: i32){
    this.line = line
    this.column = column
  }
}

@json
export class SourceLocation {
  public start: Position
  public end: Position

  constructor(start: Position, end: Position){
    this.start = start
    this.end = end
  }
}

@json
export class Tokenizer {
  public value: string
  public loc: SourceLocation

  constructor(value: string, loc: SourceLocation) {
    this.value = value
    this.loc = loc
  }    
}


import { lettersAllowed, operationsAllowed, subExpressions } from '..'
import { BaseError, UndeterminedError } from '../lib/error'
import { Position, SourceLocation, Tokenizer as TokanizerType } from '../scheme/Tokanizer'

export class Tokanizer {
  public tokens: Array<TokanizerType> = []
  public exceptions: Array<BaseError> = []

  constructor(private input: string) {
    this.tokens = this.tokanilizer(this.input)
  }

  private tokanilizer (input: string): Array<TokanizerType> {
    const lines = input.split('\n')
    const tokens: Array<TokanizerType> = []

    for (let line = 0; line < lines.length; line++) {
      const values = lines[line].split('')

      for (let column = 0; column < values.length; column++) {
        const token = values[column]
  
        if (['', ' '].includes(token)) continue

        tokens.push(new TokanizerType(
          token,
          new SourceLocation(
            new Position(line, column),
            new Position(line, column))
        ))
      }
    }

    this.validation()
    return tokens
  }

  private validation (): void {
    for (let index = 0; index < this.tokens.length; index++) {
      const token = this.tokens[index]
  
      if (![lettersAllowed, operationsAllowed, subExpressions].flat().includes(token.value)) {
        this.exceptions.push(new UndeterminedError(token.value, token.loc))
      }
    }
  }
}
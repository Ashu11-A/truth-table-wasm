import { JSON } from 'json-as'
import { SourceLocation } from '../scheme/Tokanizer'

@json
export class BaseError extends Error {
  public code: i32
  public statusCode: string
  public loc: SourceLocation

  constructor(message: string, code: i32, statusCode: string, loc: SourceLocation) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.loc = loc
  }

  toJson(): string {
    return JSON.stringify(this)
  }
}

@json
export class UndeterminedError extends BaseError {
  constructor(value: string, loc: SourceLocation) {
    super(
      `It was not possible to determine what the value would be: ${value}`,
      406,
      'Undetermined',
      loc
    )
  }
}

@json
export class UnexpectedError extends BaseError {
  constructor(origin: string, expected: Array<string>, unexpected: string, loc: SourceLocation) {
    super(
      `It was expected that, after an ${origin} element, there would be a ${expected.join(' or ')} element, but there were ${unexpected}`,
      500,
      'Unexpected',
      loc
    )
  }
}

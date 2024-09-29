import { SourceLocation } from './Tokanizer'

@json
export abstract class BaseExpression {
  public loc: SourceLocation

  constructor(loc: SourceLocation) {
    this.loc = loc
  }

  abstract getType(): Expression
}

export enum OperationKey {
  Negation,
  Conjunction,
  Disjunction,
  Conditional,
  Biconditional,
  XOR,
  None
}

export enum Expression {
  Proposition,
  Operation,
  SubExpression
}

@json
export class Proposition extends BaseExpression {
  public type: Expression = Expression.Proposition
  public value: string
  public negatived: bool

  constructor(value: string, negatived: bool, loc: SourceLocation) {
    super(loc)
    this.value = value
    this.negatived = negatived
  }

  getType(): Expression {
    return this.type
  }
}

@json
export class Operation extends BaseExpression {
  public type: Expression = Expression.Operation
  public value: string
  public key: OperationKey

  constructor(value: string, key: OperationKey, loc: SourceLocation) {
    super(loc)
    this.value = value
    this.key = key
  }

  getType(): Expression {
    return this.type
  }
}

@json
export class SubExpression extends BaseExpression {
  public type: Expression = Expression.SubExpression
  public negatived: bool = false
  public body: Array<BaseExpression> // (Proposition | Operation | SubExpression)

  constructor(body: Array<BaseExpression>, negatived: bool, loc: SourceLocation) {
    super(loc)
    this.body = body
    this.negatived = negatived
  }

  getType(): Expression {
    return this.type
  }
}

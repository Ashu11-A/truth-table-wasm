import { Analyzer } from '../class/Analyzer'
import { Tokenizer } from './Tokanizer'
import { BaseExpression, Expression } from './Analyzer'

export class MethodRunner {
  node: Analyzer
  tokens: Array<Tokenizer>
  index: i32

  constructor (index: i32, node: Analyzer, tokens: Array<Tokenizer>) {
    this.index = index
    this.node = node
    this.tokens = tokens
  }
}

export class MethodProps<Type extends Expression> {
  type: Type
  parser: (runner: MethodRunner) => BaseExpression 

  constructor(type: Type, parser: (runner: MethodRunner) => BaseExpression ) {
    this.type = type
    this.parser = parser
  }
}
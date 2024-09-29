import { BaseExpression, Expression } from '../scheme/Analyzer'
import { MethodProps, MethodRunner } from '../scheme/Methods'
import { Tokenizer } from '../scheme/Tokanizer'
import { Analyzer } from './Analyzer'

export class Method<NodeType extends Expression> {
  static all: Map<Expression, Method<Expression>> = new Map<Expression, Method<Expression>>()
  static find (name: Expression): Method<Expression> { return Method.all.get(name) }

  constructor (public interaction: MethodProps<NodeType>) {
    Method.all.set(this.interaction.type, this)
  }

  static execute (type: Expression, index: i32, node: Analyzer, tokens: Array<Tokenizer>): BaseExpression {
    return Method.find(type).interaction.parser(new MethodRunner(index, node, tokens))
  }
}
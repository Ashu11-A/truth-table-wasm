import { expressionsBiconditional, expressionsConditional, expressionsConjunction, expressionsDisjunction, expressionsNegation, expressionsXOR, lettersAllowed, operationsAllowed } from '..'
import { BaseError, UnexpectedError } from '../lib/error'
import { BaseExpression, Expression, Operation, OperationKey, Proposition, SubExpression } from '../scheme/Analyzer'
import { Tokenizer } from '../scheme/Tokanizer'
import { Method } from './Methods'

@json
export class Analyzer {
  public ast: Array<BaseExpression> = []
  public index: i32 = 0
  static exceptions: Array<BaseError> = []
  public exceptions: Array<BaseError> = []

  constructor(public tokens: Array<Tokenizer>) {
    this.ast = this.parser()
    this.validation(this.ast)
    this.exceptions = Analyzer.exceptions
  }

  add (expression: BaseExpression): void {
    this.ast.push(expression)
  }

  public parser(tokens: Array<Tokenizer> = [], index: i32 = -1): Array<BaseExpression> {
    if (tokens.length === 0) tokens = this.tokens
    if (index === -1) index = this.index
  
    const len = tokens.length
  
    while (index < len) {
      const token = tokens[index]

      switch (true) {
      case lettersAllowed.includes(token.value): {
        const result = Method.execute(Expression.Proposition, index, this, tokens)
        
        this.add(result)

        index++
        this.index++
        break
      }
      case operationsAllowed.includes(token.value): {
        if (expressionsNegation.includes(token.value)) {
          index++
          this.index++
          continue
        }

        const result = Method.execute(Expression.Operation, index, this, tokens)

        this.add(result)

        index++
        this.index++
        break
      }

      case token.value === '(': {
        const result = Method.execute(Expression.SubExpression, index, this, tokens)

        this.add(result)

        index = this.index
        break
      }
      default: {
        throw new Error(`Method not indentify ${token.value}`)
      }
      }
    }

    return this.ast
  }

  private validation (expressions: Array<BaseExpression>): void {
    let index = 0

    while (index < expressions.length) {
      let nextElement: BaseExpression | null = null
      const element = expressions[index]

      if ((index + 1) !== expressions.length) {
        nextElement = expressions[index + 1]
      }

      if (element instanceof Proposition) {
        const expression = element as Proposition
      
        if (nextElement !== null && nextElement.getType() !== Expression.Operation) {
          Analyzer.exceptions.push(new UnexpectedError(
            getExpressionString(expression.type),
            ['Operation'],
            getExpressionString(nextElement.getType()),
            nextElement.loc,
          ))
        }
      } else if (element instanceof Operation) {
        const expression = element as Operation
        /**
         * Caso após um elemento Operation não houver nenhum outro elemento
         * Error: P ^ Q ^
         * Correct: P ^ Q ^ R
         */
        if (nextElement === null) {
          Analyzer.exceptions.push(new UnexpectedError(
            getExpressionString(expression.type),
            ['Proposition', 'SubExpression'],
            'None',
            expression.loc,
          ))
        } else {
        /**
         * Só ocorre quando se é usado um elemento não permidido, tipo uma caracter especial ou letra não categorizada
         * Error: P ^ =
         * Correct: P ^ Q
         */
          if (expression.key === OperationKey.None)
            Analyzer.exceptions.push(new UnexpectedError(
              expression.key.toString(),
              ['Proposition', 'SubExpression'],
              getExpressionString(nextElement.getType()),
              nextElement.loc,
            ))

          /**
         * Se após um elemento Operation não for um dos elementos Proposition ou SubExpression
         * Error: P ^ ^
         * Correct: P ^ Q
         */
          if (nextElement.getType() === Expression.Operation) {
            Analyzer.exceptions.push(new UnexpectedError(
              getExpressionString(nextElement.getType()),
              ['Proposition', 'SubExpression'],
              getExpressionString(nextElement.getType()),
              nextElement.loc,
            ))
          }
        }
      } else if (element instanceof SubExpression) {
        const expression = element as SubExpression
        /**
           * Se após a declaração de um conjunto, houver algo, isso deve ser um operador.
           * Error: (P ^ Q) P
           * Correct: (P ^ Q) ^ P
           */
        if (
          nextElement !== null &&
            !['Operation'].includes(getExpressionString(nextElement.getType()))
        ) {
          Analyzer.exceptions.push(new UnexpectedError(
            getExpressionString(expression.getType()),
            ['Operation'],
            getExpressionString(nextElement.getType()),
            nextElement.loc,
          ))
        }

        this.validation(expression.body)
      }
      index++
    }
  }
}

export function getNegatived(tokens: Tokenizer[], index: i32): bool {
  index = index - 1
  if (index === -1 && index < tokens.length) return false // se for menor que o total de tokens, resultará em erro

  return expressionsNegation.includes(tokens[index].value)
}

export function getOperationKey(value: string): OperationKey {
  return expressionsNegation.includes(value)
    ? OperationKey.Negation
    : expressionsConjunction.includes(value)
      ? OperationKey.Conjunction
      : expressionsDisjunction.includes(value)
        ? OperationKey.Disjunction
        : expressionsConditional.includes(value)
          ? OperationKey.Conditional
          : expressionsBiconditional.includes(value)
            ? OperationKey.Biconditional
            : expressionsXOR.includes(value)
              ? OperationKey.XOR
              : OperationKey.None
}

export function getExpressionString (type: Expression): string {
  return type === Expression.Operation
    ? 'Operation'
    : type === Expression.Proposition
      ? 'Proposition'
      : type === Expression.SubExpression
        ? 'SubExpression'
        : 'Undefined'
}
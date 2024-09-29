import { getOperationKey } from '../class/Analyzer'
import { Method } from '../class/Methods'
import { Expression, Operation } from '../scheme/Analyzer'
import { MethodProps } from '../scheme/Methods'
import { Position, SourceLocation } from '../scheme/Tokanizer'

new Method<Expression>(
  new MethodProps(Expression.Operation, (interaction): Operation => {
    const token = interaction.tokens[interaction.index]

    return new Operation(
      token.value,
      getOperationKey(token.value),
      new SourceLocation(
        new Position(token.loc.start.line, token.loc.start.column),
        new Position(token.loc.end.line, token.loc.end.column)
      ))
  })
)
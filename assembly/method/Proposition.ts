import { getNegatived } from '../class/Analyzer'
import { Method } from '../class/Methods'
import { Expression, Proposition } from '../scheme/Analyzer'
import { MethodProps } from '../scheme/Methods'
import { Position, SourceLocation } from '../scheme/Tokanizer'

new Method<Expression>(
  new MethodProps(Expression.Proposition, (interaction): Proposition => {
    const token = interaction.tokens[interaction.index]

    return new Proposition(
      token.value,
      getNegatived(interaction.tokens, interaction.index),
      new SourceLocation(
        new Position(token.loc.start.line, token.loc.start.column),
        new Position(token.loc.end.line, token.loc.end.column)
      ))
  })
)
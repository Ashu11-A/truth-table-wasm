import { Analyzer, getNegatived } from '../class/Analyzer'
import { Method } from '../class/Methods'
import { BaseError } from '../lib/error'
import { Expression, SubExpression } from '../scheme/Analyzer'
import { MethodProps } from '../scheme/Methods'
import { Position, SourceLocation, Tokenizer } from '../scheme/Tokanizer'

new Method<Expression>(
  new MethodProps(Expression.SubExpression, (interaction): SubExpression => {
    const token = interaction.tokens[interaction.index]
    const subExpreTokens: Tokenizer[] = []
    let parenthesesCount = 1 // Usado para Adicionar subgrupos tipo: (p ^ q ^ (y ^ t))

    interaction.index++
    interaction.node.index++

    while (interaction.index < interaction.tokens.length && parenthesesCount > 0) {
      const token = interaction.tokens[interaction.index]
  
      if (token.value === '(') {
        parenthesesCount++
      } else if (token.value === ')') {
        parenthesesCount--
      } else if (interaction.index + 1 === interaction.tokens.length) {
        Analyzer.exceptions.push(new BaseError(
          `It was expected that there would be a “)”, in row: ${token.loc.start.line}, column: ${token.loc.start.column}.`,
          783,
          'WasExperienced',
          token.loc
        ))
      }

      if (parenthesesCount > 0) {
        subExpreTokens.push(token)
      }

      interaction.index++
    }

    const node = new Analyzer(subExpreTokens)
    interaction.node.index = interaction.index

    return new SubExpression(
      node.ast,
      getNegatived(interaction.tokens, interaction.index),
      new SourceLocation(
        new Position(token.loc.start.line, token.loc.start.column),
        new Position(token.loc.end.line, token.loc.end.column)
      ))
  })
)
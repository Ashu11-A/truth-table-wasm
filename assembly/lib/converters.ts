import { JSON } from 'json-as'
import { Analyzer, Tokanizer } from '../class'
import { Tokenizer } from '../scheme/Tokanizer'
import { BaseExpression } from '../scheme/Analyzer'

// Creators
export function createTokanizer(input: string): Tokanizer {
  return new Tokanizer(input)
}
export function createAnalyzer(tokens: Array<Tokenizer>): Analyzer {
  return new Analyzer(tokens)
}


// Data
export function getTokens(tokanizer: Tokanizer): Array<Tokenizer> {
  return tokanizer.tokens
}
export function getAST(analyzer: Analyzer): BaseExpression[] {
  return analyzer.ast
}

// Converters
export function convertTokensToJson(tokens: Tokenizer[]): string {
  return JSON.stringify(tokens)
}
export function convertAstToJson(ast: BaseExpression[]): string {
  return JSON.stringify(ast)
}


// Exceptions
export function getTokanizerExceptions (tokanizer: Tokanizer): string {
  return JSON.stringify(tokanizer.exceptions)
}

export function getAnalyzerExceptions (analyzer: Analyzer): string {
  return JSON.stringify(analyzer.exceptions)
}
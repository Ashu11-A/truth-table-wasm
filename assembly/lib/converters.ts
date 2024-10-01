import { JSON } from 'json-as'
import { Analyzer, Structure, Tokanizer } from '../class'
import { Tokenizer } from '../scheme/Tokanizer'
import { BaseExpression } from '../scheme/Analyzer'
import { StructureScheme } from '../scheme/Structure'

// Creators
export function createTokanizer(input: string): Tokanizer {
  return new Tokanizer(input)
}
export function createAnalyzer(tokens: Array<Tokenizer>): Analyzer {
  return new Analyzer(tokens)
}
export function createStructure(ast: Array<BaseExpression>): Structure {
  return new Structure(ast)
}

// Data
export function getTokens(tokanizer: Tokanizer): Array<Tokenizer> {
  return tokanizer.tokens
}
export function getAST(analyzer: Analyzer): Array<BaseExpression> {
  return analyzer.ast
}
export function getStructure (structure: Structure): Array<StructureScheme> {
  return structure.structure
}

// Converters
export function convertTokensToJson(tokens: Array<Tokenizer>): string {
  return JSON.stringify(tokens)
}
export function convertAstToJson(ast: Array<BaseExpression>): string {
  return JSON.stringify(ast)
}
export function convertStructureToJson(structure: Array<StructureScheme>): string {
  return JSON.stringify(structure)
}


// Exceptions
export function getTokanizerExceptions (tokanizer: Tokanizer): string {
  return JSON.stringify(tokanizer.exceptions)
}

export function getAnalyzerExceptions (analyzer: Analyzer): string {
  return JSON.stringify(analyzer.exceptions)
}
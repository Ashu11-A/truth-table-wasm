import './method/index'
export * from './index'
export * from './lib/converters'

import { Structure } from './class'
import { Analyzer } from './class/Analyzer'
import { Tokanizer } from './class/Tokanizer'
import { JSON } from 'json-as'
import { BaseError } from './lib/error'

export function main(input: string): string {
  const tokanizer = new Tokanizer(input)
  if (tokanizer.exceptions.length > 0) {
    throw new Error(JSON.stringify(tokanizer.exceptions.map((err: BaseError) => err.message).join('\n')))
  }

  const node = new Analyzer(tokanizer.tokens)
  if (node.exceptions.length > 0) throw new Error(node.exceptions.map((error: BaseError) => error.message).join('\n'))

  const structure = new Structure(node.ast)

  return JSON.stringify(structure.structure)
}
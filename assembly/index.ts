export const lettersAllowed = 'abcdefghijklmnopqrstuwxyz'.split('')

export const expressionsNegation = ['¬', '~']
export const expressionsConjunction = ['^', '∧']
export const expressionsDisjunction = ['∨', '˅', 'v']
export const expressionsConditional = ['→', '->']
export const expressionsBiconditional = ['↔', '<>', '<->']
export const expressionsXOR = ['⊕']
export const subExpressions = ['(', ')']

export const operationsAllowed = [expressionsNegation, expressionsConjunction, expressionsDisjunction, expressionsConditional, expressionsBiconditional, expressionsXOR].flat()

export * from './class/index'
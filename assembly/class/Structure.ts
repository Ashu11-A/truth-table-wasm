import { removeDuplicates } from '../lib/array'
import { BaseExpression, Expression, Operation, OperationKey, Proposition, SubExpression } from '../scheme/Analyzer'
import { EvaluateExpression, StructureScheme, StructureType } from '../scheme/Structure'

@json
export class Structure {
  public propositions: Array<string> = []
  public negatives: Array<Proposition> = []
  public columns: i32 = 0
  public rows: i32 = 0
  public structure: Array<StructureScheme> = []

  constructor(public ast: Array<BaseExpression>) {
    const propositions = this.getPropositions()

    for (let index = 0; index < propositions.length; index++) {
      const proposition = propositions[index]

      this.propositions.push(proposition.value)
      if (proposition.negatived === true) this.negatives.push(proposition)
    }

    this.columns = this.propositions.length
    // Faz 2 elevado ao numero de colunas
    this.rows = 2 ** this.columns

    this.parser()
  }

  /**
   * Parses the input expression to extract variables and generate the truth table values.
   */
  parser(): Structure {
    const values: Array<StructureScheme> = []
  
    for (let row = 0; row < this.rows; row++) {
      const rowValues = new Map<string, bool>()
      /**
         * Isso carrega todas as variáveis do ambiente
         * Ex:
         * {
         *   p: true,
         *   q: false,
         *   r: false
         * }
         */
      for (let column = 0; column < this.propositions.length; column++) {
        const proposition = this.propositions[column]
        rowValues.set(proposition, !this.getTruthValue(row, column, this.columns))
      }
  
      // Adiciona valores das proposições
      for (let column = 0; column < this.columns; column++) {
        const structure = new StructureScheme(
          StructureType.Variable,
          this.propositions[column],
          rowValues.get(this.propositions[column]),
          `${row}x${column}`,
          column,
          row
        )
        values.push(structure)
      }

      for (let indexNeg = 0; indexNeg < this.negatives.length; indexNeg++) {
        const element = this.negatives[indexNeg]
        const column: i32 = this.getIndexValue(values, element)

        if (column === -1 ||column > this.propositions.length) throw new Error('Column not defined')

        const value = `~${element.value}`

        this.propositions.push(value)
        values.push(new StructureScheme(
          StructureType.VariableNegative,
          value,
          !rowValues.get(this.propositions[column]),
          `${row}x${this.columns}`,
          this.columns,
          row
        ))
      }
  
      // Calcula e adiciona o resultado da expressão lógica
      const evaluate = this.evaluateExpression(this.ast, rowValues)

      for (let index = 0; index < evaluate.length; index++) {
        const expression = evaluate[index]

        this.propositions.push(expression.expression)
    
        values.push(new StructureScheme(
          StructureType.Result,
          expression.expression,
          expression.value,
          `${row}x${this.columns + this.negatives.length + index}`,
          this.columns + this.negatives.length + index,
          row
        ))
      }
    }
  
    this.structure = values
    this.propositions = removeDuplicates(this.propositions)
    this.columns = this.propositions.length
    return this
  }

  getIndexValue (values: Array<StructureScheme>, element: Proposition): i32 {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      const value = values[valueIndex]

      if (element.value === value.element) {
        return valueIndex
      }
    }

    return -1
  }

  /**
   * Avalia uma expressão lógica dada uma lista de valores boolos.
   */
  evaluateExpression(expression: Array<BaseExpression>, values: Map<string, bool>): Array<EvaluateExpression> {
    let index = 0
    const input: string[] = []
    const expressions: Array<EvaluateExpression> = []
    const results: bool[] = []
    let currentOperation: i32 = -1
      
    while (index < expression.length) {
      const node = this.getNode(index, expression)
      if (!node) break

      if (node.getType() === Expression.Proposition) {
        const expression = (node as Proposition)
        const proposition = expression.negatived ? `~${expression.value}` : expression.value
        const value = values.get(expression.value)
        const result = expression.negatived ? !value : value
  
        input.push(proposition)
        results.push(result)
      } else if (node.getType() === Expression.Operation) {
        const expression = (node as Operation)
        /**
           * Se o tipo da operação seguinte for diferente do tipo atual, interrompe o loop,
           * pois queremos processar diferentes tipos de operação separadamente.
           */
        if (currentOperation !== -1 && currentOperation !== expression.key as OperationKey) {
          const processed = this.processOperation(currentOperation, results, expressions)

          expressions.push(new EvaluateExpression(
              currentOperation as OperationKey,
              input.join(' '),
              processed,
              results
          ))
          results.length = 0
        }
        currentOperation = expression.key as OperationKey
        input.push(expression.value)
      } else if (node.getType() === Expression.SubExpression) {
        const subResult = this.evaluateExpression((node as SubExpression).body, values)
        const displayName = `(${subResult[0].expression})`

        for (let index = 0; index < subResult.length; index++) {
          const expression = subResult[index]
          expressions.push(new EvaluateExpression(expression.type, displayName, expression.value, expression.values))
          results.push(expression.value)
        }

        input.push(displayName)
      }
        
      index++
    }

    const processed = this.processOperation(currentOperation as OperationKey, results, expressions)

    expressions.push(new EvaluateExpression(
        currentOperation as OperationKey,
        input.join(' '),
        processed,
        results
    ))

    return expressions
  }

  /**
   * Obtém o próximo node na expressão com base no índice fornecido.
   */
  getNode (index: i32, expression: Array<BaseExpression>): BaseExpression {
    return expression[index]
  }

  processOperation (type: OperationKey, currentValues: bool[], expressions: Array<EvaluateExpression>): bool {
    /**
     * Obtem a expreção anterior para possibilitar a valdação com o nova operação
     */
    let before: EvaluateExpression | null = null

    if ((expressions.length - 1) !== -1) {
      before = expressions[expressions.length - 1]
    }
    
    if (before !== null) {
      const values: bool[] = []
    
      values.push(before.value)
      for (let index = 0; index < currentValues.length; index++) {
        const value = currentValues[index]
        values.push(value)
      }
      currentValues = values
    }

    // Processa a fórmula com base no tipo de operação
    const processed = this.processFormula(currentValues, type)

    return processed
  }

  /**
   * Processa uma fórmula com base em um tipo de operação específico.
   */
  processFormula(propositions: bool[], type: OperationKey): bool {

    switch (type) {
    // ~p (Negação)
    case OperationKey.Negation:
      return !propositions[0]
    // p ^ q (Conjunção)
    case OperationKey.Conjunction:
      return propositions.every((prop) => prop === true)
    // p v q (Disjunção)
    case OperationKey.Disjunction:
      return propositions.reduce((acc, current) => acc || current, propositions[0])
    // p -> q (Condicional)
    case OperationKey.Conditional:
      return propositions.reduce((acc, current) => !acc || current, propositions[0])
    // p <-> q (Bicondicional)
    case OperationKey.Biconditional:
      return propositions.reduce((acc, current) => acc === current, propositions[0])
    case OperationKey.XOR:
      return propositions.reduce((acc, current) =>  acc !== current, propositions[0])
    case OperationKey.None:
      return false
    default:
      return false
    }
  }
  /**
   * Obtém uma lista de proposições únicas a partir de uma árvore de sintaxe abstrata (AST).
   */
  getPropositions(ast: Array<BaseExpression> = []): Array<Proposition> {
    if (ast.length === 0) ast = this.ast
    let propositions = this._getPropositions(ast)
        
    // Se existir algum element, que é negativo, apenas deixe a representação negativa
    const propositionMap = new Map<string, Proposition>()

    for (let index = 0; index < propositions.length; index++) {
      const proposition = propositions[index]
      const key = proposition.value // Usar o valor da proposição como chave
        
      if (!propositionMap.has(key)) {
        // Se não existe ainda, adicionar a proposição
        propositionMap.set(key, proposition)
      } else if (proposition.negatived) {
        // Se já existe uma proposição com o mesmo valor, preferir a negativa (negatived: true)
        propositionMap.set(key, proposition)
      }
    }
    
    propositions = propositionMap.values()
    return propositions
  }

  /**
   * Processa os elementos da árvore de sintaxe abstrata para coletar as proposições.
   */
  private _getPropositions (elements: Array<BaseExpression>): Proposition[] {
    const propositions: Array<Proposition> = []

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]
      
      if (element.getType() === Expression.Proposition) propositions.push(element as Proposition)
      if (element.getType() === Expression.SubExpression) {
        const processed = this._getPropositions((element as SubExpression).body)
          
        for (let index = 0; index < processed.length; index++) {
          const proposition = processed[index]
          propositions.push(proposition)
        }
      }
    }

    return propositions
  }

  /**
   * Determines the truth value for a given row and column in the truth table.
   */
  getTruthValue(row: i32, column: i32, totalColumns: i32): bool {
    // Calcular o número total de combinações (2^column), para determinar quando alternar entre true/false
    const alternatingFactor: f64 = 2 ** (totalColumns - column - 1)
    
    // Se a linha atual estiver dentro do grupo "true" para essa variável, retorna true
    // Caso contrário, retorna false
    return Math.floor(row / alternatingFactor) % 2 === 1
  }
}
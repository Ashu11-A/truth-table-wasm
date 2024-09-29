import { OperationKey } from './Analyzer'

export enum StructureType {
    Variable,
    VariableNegative,
    Result
}

@json
export class StructureScheme {
  /**
    * The variable or element represented in the truth table (e.g., 'p', 'q').
    */
  element: string

  /**
    * The boolean value for the element at a specific position in the truth table.
    */
  value: bool

  type: StructureType

  /**
    * The position of the element in the table, represented as a string in the format 'rowxcolumn' (e.g., '0x1').
    */
  position: string

  /**
    * The column index of the element in the truth table.
    */
  column: i32

  /**
    * The row index of the element in the truth table.
    */
  row: i32

  constructor(type: StructureType, element: string, value: bool, position: string, column: i32, row: i32) { 
    this.type = type
    this.element = element
    this.value = value
    this.position = position
    this.column = column
    this.row = row 
  }
}

@json
export class EvaluateExpression {
  expression: string
  value: bool
  values: Array<bool>
  type: OperationKey

  constructor(type: OperationKey, expression: string, value: bool, values: Array<bool>) {
    this.type = type
    this.expression = expression
    this.value = value
    this.values = values
  }
}
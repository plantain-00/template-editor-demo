import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'

export function evaluate(expression: string, model: { [key: string]: unknown }) {
  try {
    return evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
  } catch (error) {
    console.info(error)
    return undefined
  }
}

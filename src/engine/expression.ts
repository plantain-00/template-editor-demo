import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'
import { Size, SizeExpression, TemplateImageContent, TemplateTextContent, Position, PositionExpression } from '../model'

export function evaluate(expression: string, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  try {
    return evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
  } catch (error) {
    if (level) {
      console[level](error)
    }
    return undefined
  }
}

export function evaluateSizeExpression(kind: 'width' | 'height', content: Size & SizeExpression, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  const expressionField = (kind + 'Expression') as 'widthExpression' | 'heightExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, level)
    if (typeof result === 'number') {
      return result
    }
  }
  return content[kind]
}

export function evaluatePositionExpression(kind: 'x' | 'y', content: Position & PositionExpression, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  const expressionField = (kind + 'Expression') as 'xExpression' | 'yExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, level)
    if (typeof result === 'number') {
      return result
    }
  }
  return content[kind]
}

export function evaluateUrlExpression(content: TemplateImageContent, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  if (content.urlExpression) {
    const result = evaluate(content.urlExpression, model, level)
    if (typeof result === 'string') {
      return result
    }
  }
  return content.url
}

export function evaluateTextExpression(content: TemplateTextContent, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  if (content.textExpression) {
    const result = evaluate(content.textExpression, model, level)
    if (typeof result === 'string') {
      return result
    }
  }
  return content.text
}

export function evaluateFontSizeExpression(content: TemplateTextContent, model: { [key: string]: unknown }, level?: 'info' | 'error') {
  if (content.fontSizeExpression) {
    const result = evaluate(content.fontSizeExpression, model, level)
    if (typeof result === 'number') {
      return result
    }
  }
  return content.fontSize
}

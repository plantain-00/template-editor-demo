import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'
import { Size, SizeExpression, TemplateImageContent, TemplateTextContent, Position, PositionExpression, TemplateColorContent } from '../model'
import { PrecompiledStyleGuide } from './template-engine'

export function evaluate(expression: string, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  try {
    if (options && options.precompiledStyleGuide) {
      const ast = options.precompiledStyleGuide.ast[expression]
      if (ast instanceof Error) {
        throw ast
      }
      return evaluateExpression(ast, model)
    }
    return evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
  } catch (error) {
    if (options && options.errorHandler) {
      options.errorHandler({ error, expression, model, stack: options.stack })
    }
    return undefined
  }
}

export interface ExpressionOptions {
  errorHandler?: (reason: ExpressionErrorReason) => void
  precompiledStyleGuide?: PrecompiledStyleGuide
  stack?: (string | number)[]
}

export interface ExpressionErrorReason {
  error: Error
  expression: string
  model: { [key: string]: unknown }
  stack?: (string | number)[]
}

export function parseExpressionToAst(expression: string) {
  try {
    return parseExpression(tokenizeExpression(expression))
  } catch (error) {
    return error as Error
  }
}

export function evaluateSizeExpression(kind: 'width' | 'height', content: Size & SizeExpression, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  const expressionField = (kind + 'Expression') as 'widthExpression' | 'heightExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, getExpressionOptions(options, expressionField))
    if (typeof result === 'number' && !isNaN(result)) {
      return result
    }
  }
  return content[kind]
}

export function evaluatePositionExpression(kind: 'x' | 'y' | 'z', content: Position & PositionExpression, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  const expressionField = (kind + 'Expression') as 'xExpression' | 'yExpression' | 'zExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, getExpressionOptions(options, expressionField))
    if (typeof result === 'number' && !isNaN(result)) {
      return kind === 'z' ? Math.round(result) : result
    }
  }
  return content[kind] || 0
}

export function evaluateUrlExpression(content: TemplateImageContent, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  if (content.urlExpression) {
    const result = evaluate(content.urlExpression, model, getExpressionOptions(options, 'urlExpression'))
    if (typeof result === 'string') {
      return result
    }
  }
  return content.url
}

export function evaluateTextExpression(content: TemplateTextContent, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  if (content.textExpression) {
    const result = evaluate(content.textExpression, model, getExpressionOptions(options, 'textExpression'))
    if (typeof result === 'string') {
      return result
    }
  }
  return content.text
}

export function evaluateFontSizeExpression(content: TemplateTextContent, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  if (content.fontSizeExpression) {
    const result = evaluate(content.fontSizeExpression, model, getExpressionOptions(options, 'fontSizeExpression'))
    if (typeof result === 'number' && !isNaN(result)) {
      return result
    }
  }
  return content.fontSize
}

export function evaluateColorExpression(content: TemplateTextContent | TemplateColorContent, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  if (content.colorExpression) {
    const result = evaluate(content.colorExpression, model, getExpressionOptions(options, 'colorExpression'))
    if (typeof result === 'string') {
      return result
    }
  }
  return content.color
}

export function getExpressionOptions(options: ExpressionOptions | undefined, item: string | number) {
  if (options && options.stack) {
    return { ...options, stack: [...options.stack, item] }
  }
  return options
}

import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'
import { Size, SizeExpression, TemplateImageContent, TemplateTextContent, Position, PositionExpression, TemplateColorContent, Rotate, RotateExpression } from '../model'
import { PrecompiledStyleGuide } from './template-engine'
import { formatPixel } from '../utils'

export function evaluate(expression: string | undefined, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  if (!expression) {
    return undefined
  }
  try {
    if (options && options.precompiledStyleGuide) {
      const ast = options.precompiledStyleGuide.ast[expression]
      if (ast instanceof Error) {
        throw ast
      }
      return evaluateExpression(ast, model)
    }
    return evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
  } catch (error: unknown) {
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
  error: unknown
  expression: string
  model: { [key: string]: unknown }
  stack?: (string | number)[]
}

export function parseExpressionToAst(expression: string) {
  try {
    return parseExpression(tokenizeExpression(expression))
  } catch (error: unknown) {
    return error instanceof Error ? error : new Error(String(error))
  }
}

export function evaluateSizeExpression(kind: 'width' | 'height', content: Size & SizeExpression, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  const expressionField = (kind + 'Expression') as `${typeof kind}Expression`
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, getExpressionOptions(options, expressionField))
    if (typeof result === 'number' && !isNaN(result)) {
      return formatPixel(result)
    }
  }
  return content[kind]
}

export function evaluatePositionExpression(kind: 'x' | 'y' | 'z', content: Position & PositionExpression, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  const expressionField = (kind + 'Expression') as `${typeof kind}Expression`
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, getExpressionOptions(options, expressionField))
    if (typeof result === 'number' && !isNaN(result)) {
      return kind === 'z' ? Math.round(result) : formatPixel(result)
    }
  }
  return content[kind] || 0
}

export function evaluateRotateExpression(content: Rotate & RotateExpression, model: { [key: string]: unknown }, options?: ExpressionOptions) {
  const expression = content.rotateExpression
  if (expression) {
    const result = evaluate(expression, model, getExpressionOptions(options, 'rotateExpression'))
    if (typeof result === 'number' && !isNaN(result)) {
      return formatPixel(result)
    }
  }
  return content.rotate || 0
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
      return formatPixel(result)
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

import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'
import { Size, SizeExpression, TemplateImageContent, TemplateTextContent, Position, PositionExpression } from '../model'
import { PrecompiledStyleGuide } from './template-engine'

export function evaluate(expression: string, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  try {
    if (precompiledStyleGuide) {
      const ast = precompiledStyleGuide.ast[expression]
      if (ast instanceof Error) {
        throw ast
      }
      return evaluateExpression(ast, model)
    }
    return evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
  } catch (error) {
    if (level) {
      console[level](error)
    }
    return undefined
  }
}

export function parseExpressionToAst(expression: string) {
  try {
    return parseExpression(tokenizeExpression(expression))
  } catch (error) {
    return error as Error
  }
}

export function evaluateSizeExpression(kind: 'width' | 'height', content: Size & SizeExpression, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  const expressionField = (kind + 'Expression') as 'widthExpression' | 'heightExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, level, precompiledStyleGuide)
    if (typeof result === 'number' && !isNaN(result)) {
      return result
    }
  }
  return content[kind]
}

export function evaluatePositionExpression(kind: 'x' | 'y' | 'z', content: Position & PositionExpression, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  const expressionField = (kind + 'Expression') as 'xExpression' | 'yExpression' | 'zExpression'
  const expression = content[expressionField]
  if (expression) {
    const result = evaluate(expression, model, level, precompiledStyleGuide)
    if (typeof result === 'number' && !isNaN(result)) {
      return kind === 'z' ? Math.round(result) : result
    }
  }
  return content[kind] || 0
}

export function evaluateUrlExpression(content: TemplateImageContent, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  if (content.urlExpression) {
    const result = evaluate(content.urlExpression, model, level, precompiledStyleGuide)
    if (typeof result === 'string') {
      return result
    }
  }
  return content.url
}

export function evaluateTextExpression(content: TemplateTextContent, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  if (content.textExpression) {
    const result = evaluate(content.textExpression, model, level, precompiledStyleGuide)
    if (typeof result === 'string') {
      return result
    }
  }
  return content.text
}

export function evaluateFontSizeExpression(content: TemplateTextContent, model: { [key: string]: unknown }, level?: 'info' | 'error', precompiledStyleGuide?: PrecompiledStyleGuide) {
  if (content.fontSizeExpression) {
    const result = evaluate(content.fontSizeExpression, model, level, precompiledStyleGuide)
    if (typeof result === 'number' && !isNaN(result)) {
      return result
    }
  }
  return content.fontSize
}

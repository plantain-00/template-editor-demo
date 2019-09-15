import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'

import { Template, TemplateContent, StyleGuide } from './model'

export function generate(template: Template, styleGuide: StyleGuide, viewModel: { [key: string]: unknown }): Template {
  return {
    ...template,
    contents: template.contents.map((c) => generateContent(c, styleGuide, viewModel)).flat()
  }
}

function generateContent(content: TemplateContent, styleGuide: StyleGuide, viewModel: { [key: string]: unknown }): TemplateContent[] {
  if (content.kind === 'snapshot') {
    return [content]
  }
  if (content.repeat) {
    const { expression, itemName, indexName } = analyseRepeat(content.repeat)
    const result = evaluateExpression(parseExpression(tokenizeExpression(expression)), viewModel)
    if (Array.isArray(result)) {
      const contents: TemplateContent[] = []
      for (let i = 0; i < result.length; i++) {
        const newViewModel: { [key: string]: unknown } = { ...viewModel }
        if (itemName) {
          newViewModel[itemName] = result[i]
          if (indexName) {
            newViewModel[indexName] = i
          }
        }
        contents.push(...generateContent({ ...content, repeat: undefined }, styleGuide, newViewModel))
      }
      return contents
    }
  }
  if (content.if) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.if)), viewModel)
    if (!result) {
      return []
    }
  }
  if (content.xExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.xExpression)), viewModel)
    if (typeof result === 'number') {
      content = { ...content, x: result }
    }
  }
  if (content.yExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.yExpression)), viewModel)
    if (typeof result === 'number') {
      content = { ...content, y: result }
    }
  }
  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      return [
        {
          kind: 'snapshot',
          x: content.x,
          y: content.y,
          snapshot: generate(reference, styleGuide, viewModel)
        },
      ]
    }
    return []
  }
  return [
    {
      ...content
    }
  ]
}

function analyseRepeat(repeat: string): { expression: string, itemName?: string, indexName?: string } {
  const index = repeat.indexOf(' in ')
  if (index === -1) {
    return { expression: repeat }
  }
  const declaration = repeat.substring(0, index).trim()
  const expression = repeat.substring(index + 4).trim()
  if (declaration.startsWith('(') && declaration.endsWith(')')) {
    const declarations = declaration.substring(1, declaration.length - 1).split(',')
    if (declarations.length === 0) {
      return { expression }
    }
    if (declarations.length === 1) {
      return { expression, itemName: declarations[0].trim() }
    }
    return { expression, itemName: declarations[0].trim(), indexName: declarations[1].trim() }
  }
  return { expression, itemName: expression }
}

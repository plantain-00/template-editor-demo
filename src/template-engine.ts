import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'

import { Template, TemplateContent, StyleGuide } from './model'
import { layoutText } from './mock'
import { layoutFlex } from './layout-engine'

export function generate(template: Template, styleGuide: StyleGuide, model: { [key: string]: unknown }): Template {
  const result: Template = {
    ...template,
    contents: template.contents.map((c) => generateContent(c, styleGuide, model)).flat()
  }
  if (result.widthExpression) {
    const width = evaluateExpression(parseExpression(tokenizeExpression(result.widthExpression)), model)
    if (typeof width === 'number') {
      result.width = width
    }
  }
  if (result.heightExpression) {
    const height = evaluateExpression(parseExpression(tokenizeExpression(result.heightExpression)), model)
    if (typeof height === 'number') {
      result.height = height
    }
  }
  layoutFlex(result, styleGuide.templates)
  return result
}

function generateContent(content: TemplateContent, styleGuide: StyleGuide, model: { [key: string]: unknown }): TemplateContent[] {
  if (content.kind === 'snapshot') {
    return [content]
  }
  if (content.repeat) {
    const { expression, itemName, indexName } = analyseRepeat(content.repeat)
    const result = evaluateExpression(parseExpression(tokenizeExpression(expression)), model)
    if (Array.isArray(result)) {
      const contents: TemplateContent[] = []
      for (let i = 0; i < result.length; i++) {
        const newModel: { [key: string]: unknown } = { ...model }
        if (itemName) {
          newModel[itemName] = result[i]
          if (indexName) {
            newModel[indexName] = i
          }
        }
        contents.push(...generateContent({ ...content, repeat: undefined }, styleGuide, newModel))
      }
      return contents
    }
  }
  if (content.if) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.if)), model)
    if (!result) {
      return []
    }
  }

  if (content.xExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.xExpression)), model)
    if (typeof result === 'number') {
      content = { ...content, x: result }
    }
  }
  if (content.yExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.yExpression)), model)
    if (typeof result === 'number') {
      content = { ...content, y: result }
    }
  }

  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      if (content.props) {
        const result = evaluateExpression(parseExpression(tokenizeExpression(content.props)), model)
        model = { ...model, props: result }
      }
      return [
        {
          kind: 'snapshot',
          x: content.x,
          y: content.y,
          snapshot: generate(reference, styleGuide, model)
        },
      ]
    }
    return []
  }

  if (content.widthExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.widthExpression)), model)
    if (typeof result === 'number') {
      content = { ...content, width: result }
    }
  }
  if (content.heightExpression) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.heightExpression)), model)
    if (typeof result === 'number') {
      content = { ...content, height: result }
    }
  }

  if (content.kind === 'text') {
    if (content.textExpression) {
      const result = evaluateExpression(parseExpression(tokenizeExpression(content.textExpression)), model)
      if (typeof result === 'string') {
        content = { ...content, text: result }
        layoutText(content)
      }
    }
    if (content.fontSizeExpression) {
      const result = evaluateExpression(parseExpression(tokenizeExpression(content.fontSizeExpression)), model)
      if (typeof result === 'number') {
        content = { ...content, fontSize: result }
      }
    }
  }
  if (content.kind === 'image') {
    if (content.urlExpression) {
      const result = evaluateExpression(parseExpression(tokenizeExpression(content.urlExpression)), model)
      if (typeof result === 'string') {
        content = { ...content, url: result }
      }
    }
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
  return { expression, itemName: declaration }
}

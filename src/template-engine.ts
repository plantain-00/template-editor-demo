import { Template, TemplateContent, StyleGuide } from './model'
import { layoutText } from './mock'
import { layoutFlex } from './layout-engine'
import { evaluate } from './expression'

export function generate(template: Template, styleGuide: StyleGuide, model: { [key: string]: unknown }): Template {
  const result: Template = {
    ...template,
    contents: template.contents.map((c) => generateContent(c, styleGuide, model)).flat()
  }
  if (result.widthExpression) {
    const width = evaluate(result.widthExpression, model)
    if (typeof width === 'number') {
      result.width = width
    }
  }
  if (result.heightExpression) {
    const height = evaluate(result.heightExpression, model)
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
    const result = evaluate(expression, model)
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
    const result = evaluate(content.if, model)
    if (result === false) {
      return []
    }
  }

  if (content.xExpression) {
    const result = evaluate(content.xExpression, model)
    if (typeof result === 'number') {
      content = { ...content, x: result }
    }
  }
  if (content.yExpression) {
    const result = evaluate(content.yExpression, model)
    if (typeof result === 'number') {
      content = { ...content, y: result }
    }
  }

  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      if (content.props) {
        const result = evaluate(content.props, model)
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
    const result = evaluate(content.widthExpression, model)
    if (typeof result === 'number') {
      content = { ...content, width: result }
    }
  }
  if (content.heightExpression) {
    const result = evaluate(content.heightExpression, model)
    if (typeof result === 'number') {
      content = { ...content, height: result }
    }
  }

  if (content.kind === 'text') {
    if (content.textExpression) {
      const result = evaluate(content.textExpression, model)
      if (typeof result === 'string') {
        content = { ...content, text: result }
        layoutText(content)
      }
    }
    if (content.fontSizeExpression) {
      const result = evaluate(content.fontSizeExpression, model)
      if (typeof result === 'number') {
        content = { ...content, fontSize: result }
      }
    }
  }
  if (content.kind === 'image') {
    if (content.urlExpression) {
      const result = evaluate(content.urlExpression, model)
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

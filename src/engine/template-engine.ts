import { Template, TemplateContent, StyleGuide } from '../model'
import { layoutFlex } from './layout-engine'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression } from './expression'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'

export async function generate(template: Template, styleGuide: StyleGuide, model: { [key: string]: unknown }): Promise<Template> {
  const result: Template = {
    ...template,
    x: 0,
    y: 0,
    contents: (await Promise.all(template.contents.map((c) => generateContent(c, styleGuide, model)))).flat()
  }
  result.width = evaluateSizeExpression('width', result, model, 'error')
  result.height = evaluateSizeExpression('height', result, model, 'error')
  layoutFlex(result, styleGuide.templates)
  return result
}

async function generateContent(content: TemplateContent, styleGuide: StyleGuide, model: { [key: string]: unknown }): Promise<TemplateContent[]> {
  if (content.kind === 'snapshot') {
    return [content]
  }
  if (content.repeat) {
    const { expression, itemName, indexName } = analyseRepeat(content.repeat)
    const result = evaluate(expression, model, 'error')
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
        contents.push(...(await generateContent({ ...content, repeat: undefined }, styleGuide, newModel)))
      }
      return contents
    }
  }
  if (content.if) {
    const result = evaluate(content.if, model, 'error')
    if (result === false) {
      return []
    }
  }
  content = { ...content }
  content.x = evaluatePositionExpression('x', content, model, 'error')
  content.y = evaluatePositionExpression('y', content, model, 'error')

  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      if (content.props) {
        const result = evaluate(content.props, model, 'error')
        model = { ...model, props: result }
      }
      return [
        {
          kind: 'snapshot',
          x: content.x,
          y: content.y,
          snapshot: await generate(reference, styleGuide, model)
        },
      ]
    }
    return []
  }

  content.width = evaluateSizeExpression('width', content, model, 'error')
  content.height = evaluateSizeExpression('height', content, model, 'error')

  if (content.kind === 'text') {
    content.text = evaluateTextExpression(content, model, 'error')
    content.characters = getCharacters(content.text)

    content.fontSize = evaluateFontSizeExpression(content, model, 'error')
  }
  if (content.kind === 'image') {
    content.url = evaluateUrlExpression(content, model, 'error')
    if (content.opacity !== undefined) {
      const image = await loadImage(content.url)
      const canvas = applyImageOpacity(image, content.opacity)
      if (canvas) {
        content.base64 = canvas.toDataURL()
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

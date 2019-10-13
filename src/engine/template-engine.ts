import { Template, TemplateContent, StyleGuide } from '../model'
import { layoutFlex } from './layout-engine'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression, parseExpressionToAst } from './expression'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'
import { Expression } from 'expression-engine'

export async function generate(template: Template, styleGuide: StyleGuide, model: { [key: string]: unknown }, precompiledStyleGuide?: PrecompiledStyleGuide): Promise<Template> {
  const result: Template = {
    ...template,
    x: 0,
    y: 0,
    contents: (await Promise.all(template.contents.map((c) => generateContent(c, styleGuide, model, precompiledStyleGuide)))).flat()
  }
  result.width = evaluateSizeExpression('width', result, model, 'error', precompiledStyleGuide)
  result.height = evaluateSizeExpression('height', result, model, 'error', precompiledStyleGuide)
  layoutFlex(result, styleGuide.templates)
  return result
}

export class PrecompiledStyleGuide {
  ast: { [expression: string]: Expression | Error } = {}
  repeat: { [repeat: string]: Repeat } = {}
  constructor(styleGuide: StyleGuide) {
    for (const template of styleGuide.templates) {
      this.collectExpression(template.widthExpression)
      this.collectExpression(template.heightExpression)

      for (const content of template.contents) {
        if (content.kind === 'snapshot') {
          continue
        }
        if (content.repeat) {
          const repeat = this.collectRepeat(content.repeat)
          this.collectExpression(repeat.expression)
        }
        this.collectExpression(content.if)
        this.collectExpression(content.xExpression)
        this.collectExpression(content.yExpression)
        if (content.kind === 'reference') {
          this.collectExpression(content.props)
          continue
        }
        this.collectExpression(content.widthExpression)
        this.collectExpression(content.heightExpression)
        if (content.kind === 'text') {
          this.collectExpression(content.textExpression)
          this.collectExpression(content.fontSizeExpression)
          continue
        }
        if (content.kind === 'image') {
          this.collectExpression(content.urlExpression)
        }
      }
    }
  }
  private collectExpression(expression: string | undefined) {
    if (expression && !this.ast[expression]) {
      this.ast[expression] = parseExpressionToAst(expression)
    }
  }
  private collectRepeat(repeat: string) {
    if (!this.repeat[repeat]) {
      this.repeat[repeat] = analyseRepeat(repeat)
    }
    return this.repeat[repeat]
  }
}

async function generateContent(content: TemplateContent, styleGuide: StyleGuide, model: { [key: string]: unknown }, precompiledStyleGuide?: PrecompiledStyleGuide): Promise<TemplateContent[]> {
  if (content.kind === 'snapshot') {
    return [content]
  }
  if (content.repeat) {
    const { expression, itemName, indexName } = analyseRepeat(content.repeat, precompiledStyleGuide)
    const result = evaluate(expression, model, 'error', precompiledStyleGuide)
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
        contents.push(...(await generateContent({ ...content, repeat: undefined }, styleGuide, newModel, precompiledStyleGuide)))
      }
      return contents
    }
  }
  if (content.if) {
    const result = evaluate(content.if, model, 'error', precompiledStyleGuide)
    if (result === false) {
      return []
    }
  }
  content = { ...content }
  content.x = evaluatePositionExpression('x', content, model, 'error', precompiledStyleGuide)
  content.y = evaluatePositionExpression('y', content, model, 'error', precompiledStyleGuide)

  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      if (content.props) {
        const result = evaluate(content.props, model, 'error', precompiledStyleGuide)
        model = { ...model, props: result }
      }
      return [
        {
          kind: 'snapshot',
          x: content.x,
          y: content.y,
          snapshot: await generate(reference, styleGuide, model, precompiledStyleGuide)
        },
      ]
    }
    return []
  }

  content.width = evaluateSizeExpression('width', content, model, 'error', precompiledStyleGuide)
  content.height = evaluateSizeExpression('height', content, model, 'error', precompiledStyleGuide)

  if (content.kind === 'text') {
    content.text = evaluateTextExpression(content, model, 'error', precompiledStyleGuide)
    content.characters = getCharacters(content.text)

    content.fontSize = evaluateFontSizeExpression(content, model, 'error', precompiledStyleGuide)
  }
  if (content.kind === 'image') {
    content.url = evaluateUrlExpression(content, model, 'error', precompiledStyleGuide)
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

interface Repeat {
  expression: string
  itemName?: string
  indexName?: string
}

function analyseRepeat(repeat: string, precompiledStyleGuide?: PrecompiledStyleGuide): Repeat {
  if (precompiledStyleGuide) {
    return precompiledStyleGuide.repeat[repeat]
  }
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

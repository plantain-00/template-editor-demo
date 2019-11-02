import { Expression } from 'expression-engine'

import { Template, TemplateContent, StyleGuide } from '../model'
import { layoutFlex } from './layout-engine'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression, parseExpressionToAst, ExpressionOptions, getExpressionOptions, evaluateColorExpression } from './expression'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'

export async function generate(template: Template, styleGuide: StyleGuide, model: { [key: string]: unknown }, options?: ExpressionOptions): Promise<Template> {
  const contents: TemplateContent[] = []
  let ifValues: Array<boolean | undefined> = []
  for (let i = 0; i < template.contents.length; i++) {
    const content = await generateContent(template.contents[i], styleGuide, model, ifValues, getExpressionOptions(options, i))
    if (content.ifValue === undefined) {
      ifValues = []
    } else {
      ifValues.push(content.ifValue)
    }
    contents.push(...content.contents)
  }
  const result: Template = {
    ...template,
    x: 0,
    y: 0,
    contents
  }
  result.width = evaluateSizeExpression('width', result, model, options)
  delete result.widthExpression
  delete result.widthExpressionId
  result.height = evaluateSizeExpression('height', result, model, options)
  delete result.heightExpression
  delete result.heightExpressionId
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
        this.collectExpression(content.zExpression)
        if (content.kind === 'reference') {
          this.collectExpression(content.props)
          continue
        }
        this.collectExpression(content.widthExpression)
        this.collectExpression(content.heightExpression)
        this.collectExpression(content.rotateExpression)
        if (content.kind === 'text') {
          this.collectExpression(content.textExpression)
          this.collectExpression(content.fontSizeExpression)
          this.collectExpression(content.colorExpression)
        } else if (content.kind === 'image') {
          this.collectExpression(content.urlExpression)
        } else if (content.kind === 'color') {
          this.collectExpression(content.colorExpression)
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

async function generateContent(
  content: TemplateContent,
  styleGuide: StyleGuide,
  model: { [key: string]: unknown },
  ifValues: Array<boolean | undefined>,
  options?: ExpressionOptions
): Promise<{ contents: TemplateContent[], ifValue?: boolean }> {
  if (content.kind === 'snapshot') {
    return { contents: [content] }
  }
  if (content.repeat) {
    const { expression, itemName, indexName } = analyseRepeat(content.repeat, options)
    const result = evaluate(expression, model, getExpressionOptions(options, 'repeat'))
    if (Array.isArray(result)) {
      const contents: TemplateContent[] = []
      let currentIfValues: Array<boolean | undefined> = []
      for (let i = 0; i < result.length; i++) {
        const newModel: { [key: string]: unknown } = { ...model }
        if (itemName) {
          newModel[itemName] = result[i]
          if (indexName) {
            newModel[indexName] = i
          }
        }
        const contentResult = await generateContent({ ...content, repeat: undefined }, styleGuide, newModel, currentIfValues, options)
        if (contentResult.ifValue === undefined) {
          currentIfValues = []
        } else {
          currentIfValues.push(contentResult.ifValue)
        }
        contents.push(...contentResult.contents)
      }
      return { contents }
    }
  }
  if (content.else && ifValues.some((v) => v === true)) {
    return { contents: [], ifValue: false }
  }
  let ifValue: boolean | undefined
  if (content.if) {
    const result = evaluate(content.if, model, getExpressionOptions(options, 'if'))
    if (typeof result === 'boolean') {
      ifValue = result
      if (result === false) {
        return { contents: [], ifValue }
      }
    }
  }
  content = { ...content }
  content.x = evaluatePositionExpression('x', content, model, options)
  delete content.xExpression
  delete content.xExpressionId
  content.y = evaluatePositionExpression('y', content, model, options)
  delete content.yExpression
  delete content.yExpressionId

  if (content.kind === 'reference') {
    const id = content.id
    const reference = styleGuide.templates.find((t) => t.id === id)
    if (reference) {
      if (content.props) {
        const result = evaluate(content.props, model, getExpressionOptions(options, 'props'))
        delete content.props
        delete content.propsIds
        model = { ...model, props: result }
      }
      return {
        contents: [
          {
            kind: 'snapshot',
            x: content.x,
            y: content.y,
            snapshot: await generate(reference, styleGuide, model, getExpressionOptions(options, reference.name || reference.id))
          },
        ],
        ifValue
      }
    }
    return {
      contents: [],
      ifValue
    }
  }

  content.width = evaluateSizeExpression('width', content, model, options)
  delete content.widthExpression
  delete content.widthExpressionId
  content.height = evaluateSizeExpression('height', content, model, options)
  delete content.heightExpression
  delete content.heightExpressionId

  if (content.kind === 'text') {
    content.text = evaluateTextExpression(content, model, options)
    delete content.textExpression
    delete content.textExpressionId
    content.characters = getCharacters(content.text)

    content.fontSize = evaluateFontSizeExpression(content, model, options)
    delete content.fontSizeExpression
    delete content.fontSizeExpressionId

    content.color = evaluateColorExpression(content, model, options)
    delete content.colorExpression
    delete content.colorExpressionId
  }
  if (content.kind === 'image') {
    content.url = evaluateUrlExpression(content, model, options)
    delete content.urlExpression
    delete content.urlExpressionId
    if (content.opacity !== undefined) {
      const image = await loadImage(content.url)
      const canvas = applyImageOpacity(image, content.opacity)
      if (canvas) {
        content.base64 = canvas.toDataURL()
      }
    }
  }
  if (content.kind === 'color') {
    content.color = evaluateColorExpression(content, model, options)
    delete content.colorExpression
    delete content.colorExpressionId
  }
  return { contents: [content], ifValue }
}

export interface Repeat {
  expression: string
  itemName?: string
  indexName?: string
}

export function analyseRepeat(repeat: string, options?: ExpressionOptions): Repeat {
  if (options && options.precompiledStyleGuide) {
    return options.precompiledStyleGuide.repeat[repeat]
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

export function composeRepeat(repeat: Repeat) {
  if (repeat.expression) {
    if (repeat.itemName) {
      if (repeat.indexName) {
        return `(${repeat.itemName}, ${repeat.indexName}) in ${repeat.expression}`
      }
      return `${repeat.itemName} in ${repeat.expression}`
    }
    return repeat.expression
  }
  return undefined
}

import Vue from 'vue'
import Component from 'vue-class-component'

import { Template, TemplateTextContent, TemplateImageContent, TemplateReferenceContent, TemplateSnapshotContent, Position, TemplateColorContent } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression, evaluateColorExpression } from './expression'
import { layoutFlex } from './layout-engine'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'
import { getPosition, formatPixel } from '../utils'

export function renderTemplate(template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    layoutFlex(template, templates)
    renderTemplateOnCanvas(ctx, template, templates, images)
  }
  return canvas.toDataURL('image/jpeg')
}

/**
 * @internal
 */
export function renderTemplateOnCanvas(ctx: CanvasRenderingContext2D | undefined, template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const infos: string[] = []
  if (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, template.width, template.height)
  } else {
    infos.push(
      `ctx.fillStyle = 'white'`,
      `ctx.fillRect(0, 0, ${template.width}, ${template.height})`,
    )
  }
  const actions: Array<{ z: number, index: number, action: (ctx: CanvasRenderingContext2D | undefined) => string[] }> = []
  renderSymbol(template, templates, images, actions, { x: 0, y: 0, z: 0 })
  actions.sort((a, b) => {
    if (a.z !== b.z) {
      return a.z - b.z
    }
    return a.index - b.index
  })
  for (const { action } of actions) {
    infos.push(...action(ctx))
  }
  return infos
}

export async function loadTemplateImages(
  template: Template,
  templates: Template[],
) {
  const images: { [url: string]: Promise<HTMLImageElement> } = {}
  collectTemplateImages(template, templates, images)
  const array = Object.keys(images).map((url) => ({ url, resource: images[url] }))
  const values = await Promise.all(array.map((a) => a.resource))

  const result: { [url: string]: HTMLImageElement } = {}
  for (let i = 0; i < array.length; i++) {
    result[array[i].url] = values[i]
  }
  return result
}

function collectTemplateImages(
  template: Template,
  templates: Template[],
  images: { [url: string]: Promise<HTMLImageElement> },
) {
  for (const content of template.contents) {
    if (content.hidden) {
      continue
    }
    if (content.kind === 'image') {
      if (content.base64 && images[content.base64]) {
        continue
      }
      if (images[content.url]) {
        continue
      }
      if (content.base64) {
        images[content.url] = loadImage(content.base64)
      } else {
        images[content.url] = loadImage(content.url)
      }
    } else if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        collectTemplateImages(reference, templates, images)
      }
    } else if (content.kind === 'snapshot') {
      collectTemplateImages(content.snapshot, templates, images)
    }
  }
}

function renderSymbol(
  template: Template,
  templates: Template[],
  images: { [url: string]: HTMLImageElement },
  actions: Array<{ z: number, index: number, action: (ctx: CanvasRenderingContext2D | undefined) => string[] }>,
  position: Required<Position>,
  props?: unknown,
) {
  for (const renderItem of iterateSymbolRenderItem(template, templates)) {
    const x = formatPixel(position.x + evaluatePositionExpression('x', renderItem.content, { props }))
    const y = formatPixel(position.y + evaluatePositionExpression('y', renderItem.content, { props }))
    const z = Math.round(position.z + evaluatePositionExpression('z', renderItem.content, { props }))
    if (renderItem.kind === 'text') {
      const content = renderItem.content
      actions.push({
        z,
        index: actions.length,
        action: (ctx) => {
          const fontSize = props ? evaluateFontSizeExpression(content, { props }) : content.fontSize
          const color = props ? evaluateColorExpression(content, { props }) : content.color
          const characters = content.characters || getCharacters(props ? evaluateTextExpression(content, { props }) : content.text)
          if (ctx) {
            ctx.fillStyle = color
            ctx.textBaseline = 'top'
            ctx.font = `${fontSize}px ${content.fontFamily}`
            ctx.fillText(characters.map((c) => c.text).join(''), x, y)
            return []
          }
          return [
            `ctx.fillStyle = ${color}`,
            `ctx.textBaseline = 'top'`,
            `ctx.font = ${fontSize}px ${content.fontFamily}`,
            `ctx.fillText(${characters.map((c) => c.text).join('')}, ${x}, ${y})`,
          ]
        },
      })
    } else if (renderItem.kind === 'image') {
      const content = renderItem.content

      const url = props ? evaluateUrlExpression(content, { props }) : content.url

      const width = props ? evaluateSizeExpression('width', content, { props }) : content.width
      const height = props ? evaluateSizeExpression('height', content, { props }) : content.height

      let image: HTMLImageElement | HTMLCanvasElement = images[url]
      if (content.opacity !== undefined) {
        const imageCanvas = applyImageOpacity(image, content.opacity)
        if (imageCanvas) {
          image = imageCanvas
        }
      }
      actions.push({
        z,
        index: actions.length,
        action: (ctx) => {
          if (ctx) {
            ctx.drawImage(image, x, y, width, height)
            return []
          }
          return [`ctx.drawImage(${url}, ${x}, ${y}, ${width}, ${height})`]
        },
      })
    } else if (renderItem.kind === 'color') {
      const content = renderItem.content

      const width = props ? evaluateSizeExpression('width', content, { props }) : content.width
      const height = props ? evaluateSizeExpression('height', content, { props }) : content.height
      const color = props ? evaluateColorExpression(content, { props }) : content.color

      actions.push({
        z,
        index: actions.length,
        action: (ctx) => {
          if (ctx) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, width, height)
            return []
          }
          return [
            `ctx.fillStyle = ${content.color}`,
            `ctx.fillRect(${x}, ${y}, ${width}, ${height})`,
          ]
        },
      })
    } else if (renderItem.kind === 'symbol') {
      const newProps = renderItem.props ? evaluate(renderItem.props, { props }) : undefined
      renderSymbol(renderItem.symbol, templates, images, actions, { x, y, z }, newProps)
    }
  }
}

@Component({
  props: ['template', 'templates']
})
export class TemplateRenderer extends Vue {
  template!: Template
  templates!: Template[]

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'div',
      {
        style: {
          width: `${this.template.width}px`,
          height: `${this.template.height}px`,
          position: 'absolute',
          userSelect: 'none',
          backgroundColor: 'white',
          zIndex: -2147483584,
        },
      },
      [
        createElement(
          'symbol-renderer',
          {
            props: {
              reference: this.template,
              templates: this.templates,
              content: {
                x: 0,
                y: 0,
              },
              z: 0,
            }
          }
        )
      ]
    )
  }
}

@Component({
  props: ['reference', 'templates', 'referenceProps', 'content', 'template', 'props', 'z']
})
class SymbolRenderer extends Vue {
  reference!: Template
  templates!: Template[]
  referenceProps!: unknown
  content!: TemplateReferenceContent | TemplateSnapshotContent
  template?: Template
  props!: unknown
  z!: number

  private get width() {
    return this.referenceProps ? evaluateSizeExpression('width', this.reference, { props: this.referenceProps }) : this.reference.width
  }

  private get height() {
    return this.referenceProps ? evaluateSizeExpression('height', this.reference, { props: this.referenceProps }) : this.reference.height
  }

  private get x() {
    return getPosition(this.props, 'x', this.content, this.template, this.templates)
  }

  private get y() {
    return getPosition(this.props, 'y', this.content, this.template, this.templates)
  }

  private get zValue() {
    return this.z + getPosition(this.props, 'z', this.content, this.template, this.templates)
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    const children: Vue.VNode[] = []
    for (const renderItem of iterateSymbolRenderItem(this.reference, this.templates)) {
      if (renderItem.kind === 'text') {
        children.push(createElement(
          'text-renderer',
          {
            props: {
              content: renderItem.content,
              props: this.referenceProps,
              template: this.reference,
              templates: this.templates,
              z: this.zValue,
            }
          },
        ))
      } else if (renderItem.kind === 'image') {
        children.push(createElement(
          'image-renderer',
          {
            props: {
              content: renderItem.content,
              props: this.referenceProps,
              template: this.reference,
              templates: this.templates,
              z: this.zValue,
            }
          },
        ))
      } else if (renderItem.kind === 'color') {
        children.push(createElement(
          'color-renderer',
          {
            props: {
              content: renderItem.content,
              props: this.referenceProps,
              template: this.reference,
              templates: this.templates,
              z: this.zValue,
            }
          },
        ))
      } else if (renderItem.kind === 'symbol') {
        const content = renderItem.content
        const props = renderItem.props ? evaluate(renderItem.props, { props: this.referenceProps }) : undefined
        children.push(createElement(
          'symbol-renderer',
          {
            props: {
              reference: renderItem.symbol,
              templates: this.templates,
              referenceProps: props,
              content,
              template: this.reference,
              props: this.referenceProps,
              z: this.zValue,
            }
          }
        ))
      }
    }
    return createElement(
      'div',
      {
        style: {
          width: `${this.width}px`,
          height: `${this.height}px`,
          left: `${this.x}px`,
          top: `${this.y}px`,
          position: 'absolute',
          userSelect: 'none',
        },
      },
      children
    )
  }
}

Vue.component('symbol-renderer', SymbolRenderer)

@Component({
  props: ['content', 'props', 'template', 'templates', 'z']
})
class TextRenderer extends Vue {
  content!: TemplateTextContent
  props!: unknown
  template!: Template
  templates!: Template[]
  z!: number

  private get text() {
    return this.props ? evaluateTextExpression(this.content, { props: this.props }) : this.content.text
  }

  private get characters() {
    return getCharacters(this.text)
  }

  private get fontSize() {
    return this.props ? evaluateFontSizeExpression(this.content, { props: this.props }) : this.content.fontSize
  }

  private get color() {
    return this.props ? evaluateColorExpression(this.content, { props: this.props }) : this.content.color
  }

  private get x() {
    return getPosition(this.props, 'x', this.content, this.template, this.templates)
  }

  private get y() {
    return getPosition(this.props, 'y', this.content, this.template, this.templates)
  }

  private get zValue() {
    return this.z + getPosition(this.props, 'z', this.content, this.template, this.templates)
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'div',
      {
        style: {
          color: this.color,
          fontSize: `${this.fontSize}px`,
          fontFamily: this.content.fontFamily,
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
          zIndex: this.zValue,
        }
      },
      this.characters.map((c) => c.text).join('')
    )
  }
}

Vue.component('text-renderer', TextRenderer)

@Component({
  props: ['content', 'props', 'template', 'templates', 'z']
})
class ImageRenderer extends Vue {
  content!: TemplateImageContent
  props!: unknown
  template!: Template
  templates!: Template[]
  z!: number

  private get url() {
    return this.props ? evaluateUrlExpression(this.content, { props: this.props }) : this.content.url
  }

  private get width() {
    return this.props ? evaluateSizeExpression('width', this.content, { props: this.props }) : this.content.width
  }

  private get height() {
    return this.props ? evaluateSizeExpression('height', this.content, { props: this.props }) : this.content.height
  }

  private get x() {
    return getPosition(this.props, 'x', this.content, this.template, this.templates)
  }

  private get y() {
    return getPosition(this.props, 'y', this.content, this.template, this.templates)
  }

  private get zValue() {
    return this.z + getPosition(this.props, 'z', this.content, this.template, this.templates)
  }

  private get imageLoader() {
    const loader = new Loader<HTMLImageElement>()
    loadImage(this.url).then((image) => {
      loader.result = image
    })
    return loader
  }

  private get base64() {
    if (this.content.base64) {
      return this.content.base64
    }
    if (this.content.opacity !== undefined && this.imageLoader.result) {
      const canvas = applyImageOpacity(this.imageLoader.result, this.content.opacity)
      if (canvas) {
        return canvas.toDataURL()
      }
    }
    return this.url
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'img',
      {
        style: {
          width: `${this.width}px`,
          height: `${this.height}px`,
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
          zIndex: this.zValue,
        },
        attrs: {
          src: this.base64,
        },
      },
    )
  }
}

Vue.component('image-renderer', ImageRenderer)

@Component({
  props: ['content', 'props', 'template', 'templates', 'z']
})
class ColorRenderer extends Vue {
  content!: TemplateColorContent
  props!: unknown
  template!: Template
  templates!: Template[]
  z!: number

  private get width() {
    return this.props ? evaluateSizeExpression('width', this.content, { props: this.props }) : this.content.width
  }

  private get height() {
    return this.props ? evaluateSizeExpression('height', this.content, { props: this.props }) : this.content.height
  }

  private get x() {
    return getPosition(this.props, 'x', this.content, this.template, this.templates)
  }

  private get y() {
    return getPosition(this.props, 'y', this.content, this.template, this.templates)
  }

  private get zValue() {
    return this.z + getPosition(this.props, 'z', this.content, this.template, this.templates)
  }

  private get color() {
    return this.props ? evaluateColorExpression(this.content, { props: this.props }) : this.content.color
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'div',
      {
        style: {
          width: `${this.width}px`,
          height: `${this.height}px`,
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
          backgroundColor: this.color,
          zIndex: this.zValue,
        },
      },
    )
  }
}

Vue.component('color-renderer', ColorRenderer)

function* iterateSymbolRenderItem(template: Template, templates: Template[]) {
  for (const content of template.contents) {
    if (content.hidden) {
      continue
    }
    if (content.kind === 'text') {
      yield {
        kind: 'text' as const,
        content,
      }
    } else if (content.kind === 'image') {
      yield {
        kind: 'image' as const,
        content,
      }
    } else if (content.kind === 'color') {
      yield {
        kind: 'color' as const,
        content,
      }
    } else if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        yield {
          kind: 'symbol' as const,
          content,
          symbol: reference,
          props: content.props,
        }
      }
    } else if (content.kind === 'snapshot') {
      yield {
        kind: 'symbol' as const,
        content,
        symbol: content.snapshot,
      }
    }
  }
}

@Component
class Loader<T> extends Vue {
  result: T | null = null
}

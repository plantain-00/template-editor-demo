import Vue from 'vue'
import Component from 'vue-class-component'

import { Template, TemplateTextContent, TemplateImageContent, TemplateReferenceContent, TemplateSnapshotContent } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression } from './expression'
import { layoutFlex, getFlexPosition } from './layout-engine'

export function renderTemplate(template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, template.width, template.height)
  layoutFlex(template, templates)
  renderSymbol(ctx, template, templates, images)
  return canvas.toDataURL()
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
      if (images[content.url]) {
        continue
      }
      images[content.url] = new Promise<HTMLImageElement>((resolve) => {
        const image = document.createElement('img')
        image.crossOrigin = 'anonymous'
        image.onload = () => {
          resolve(image)
        }
        image.src = content.url + '?random=' + Math.random()
      })
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
  ctx: CanvasRenderingContext2D,
  template: Template,
  templates: Template[],
  images: { [url: string]: HTMLImageElement },
  props?: unknown,
) {
  for (const renderItem of iterateSymbolRenderItem(template, templates)) {
    const x = evaluatePositionExpression('x', renderItem.content, { props })
    const y = evaluatePositionExpression('y', renderItem.content, { props })
    if (renderItem.kind === 'text') {
      const content = renderItem.content
      ctx.fillStyle = content.color
      ctx.textBaseline = 'top'

      const fontSize = props ? evaluateFontSizeExpression(content, { props }) : content.fontSize
      ctx.font = `${fontSize}px ${content.fontFamily}`

      const characters = props ? evaluateTextExpression(content, { props }).characters : content.characters
      ctx.fillText(characters.map((c) => c.text).join(''), x, y)
    } else if (renderItem.kind === 'image') {
      const content = renderItem.content

      const url = props ? evaluateUrlExpression(content, { props }) : content.url

      const width = props ? evaluateSizeExpression('width', content, { props }) : content.width
      const height = props ? evaluateSizeExpression('height', content, { props }) : content.height

      ctx.drawImage(images[url], x, y, width, height)
    } else if (renderItem.kind === 'symbol') {
      ctx.save()
      ctx.translate(x, y)
      const newProps = renderItem.props ? evaluate(renderItem.props, { props }) : undefined
      renderSymbol(ctx, renderItem.symbol, templates, images, newProps)
      ctx.restore()
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
        },
      },
      [
        createElement(
          'symbol-renderer',
          {
            props: {
              template: this.template,
              templates: this.templates,
              content: {
                x: 0,
                y: 0,
              },
            }
          }
        )
      ]
    )
  }
}

@Component({
  props: ['template', 'templates', 'props', 'content', 'container', 'containerProps']
})
class SymbolRenderer extends Vue {
  template!: Template
  templates!: Template[]
  props!: unknown
  content!: TemplateReferenceContent | TemplateSnapshotContent
  container?: Template
  containerProps!: unknown

  private get width() {
    return this.props ? evaluateSizeExpression('width', this.template, { props: this.props }) : this.template.width
  }

  private get height() {
    return this.props ? evaluateSizeExpression('height', this.template, { props: this.props }) : this.template.height
  }

  private get x() {
    if (this.container && this.container.display === 'flex') {
      return getFlexPosition(this.content, 'x', this.container, this.templates)
    }
    return this.containerProps ? evaluatePositionExpression('x', this.content, { props: this.containerProps }) : this.content.x
  }

  private get y() {
    if (this.container && this.container.display === 'flex') {
      return getFlexPosition(this.content, 'y', this.container, this.templates)
    }
    return this.containerProps ? evaluatePositionExpression('y', this.content, { props: this.containerProps }) : this.content.y
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    const children: Vue.VNode[] = []
    for (const renderItem of iterateSymbolRenderItem(this.template, this.templates)) {
      if (renderItem.kind === 'text') {
        children.push(createElement(
          'text-renderer',
          {
            props: {
              content: renderItem.content,
              props: this.props,
              container: this.template,
              templates: this.templates,
            }
          },
        ))
      } else if (renderItem.kind === 'image') {
        children.push(createElement(
          'image-renderer',
          {
            props: {
              content: renderItem.content,
              props: this.props,
              container: this.template,
              templates: this.templates,
            }
          },
        ))
      } else if (renderItem.kind === 'symbol') {
        const content = renderItem.content
        const props = renderItem.props ? evaluate(renderItem.props, { props: this.props }) : undefined
        children.push(createElement(
          'symbol-renderer',
          {
            props: {
              template: renderItem.symbol,
              templates: this.templates,
              props,
              content,
              container: this.template,
              containerProps: this.props,
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
  props: ['content', 'props', 'container', 'templates']
})
class TextRenderer extends Vue {
  content!: TemplateTextContent
  props!: unknown
  container!: Template
  templates!: Template[]

  private get characters() {
    return this.props ? evaluateTextExpression(this.content, { props: this.props }).characters : this.content.characters
  }

  private get fontSize() {
    return this.props ? evaluateFontSizeExpression(this.content, { props: this.props }) : this.content.fontSize
  }

  private get x() {
    if (this.container.display === 'flex') {
      return getFlexPosition(this.content, 'x', this.container, this.templates)
    }
    return this.props ? evaluatePositionExpression('x', this.content, { props: this.props }) : this.content.x
  }

  private get y() {
    if (this.container.display === 'flex') {
      return getFlexPosition(this.content, 'y', this.container, this.templates)
    }
    return this.props ? evaluatePositionExpression('y', this.content, { props: this.props }) : this.content.y
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'div',
      {
        style: {
          color: this.content.color,
          fontSize: `${this.fontSize}px`,
          fontFamily: this.content.fontFamily,
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
        }
      },
      this.characters.map((c) => c.text).join('')
    )
  }
}

Vue.component('text-renderer', TextRenderer)

@Component({
  props: ['content', 'props', 'container', 'templates']
})
class ImageRenderer extends Vue {
  content!: TemplateImageContent
  props!: unknown
  container!: Template
  templates!: Template[]

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
    if (this.container.display === 'flex') {
      return getFlexPosition(this.content, 'x', this.container, this.templates)
    }
    return this.props ? evaluatePositionExpression('x', this.content, { props: this.props }) : this.content.x
  }

  private get y() {
    if (this.container.display === 'flex') {
      return getFlexPosition(this.content, 'y', this.container, this.templates)
    }
    return this.props ? evaluatePositionExpression('y', this.content, { props: this.props }) : this.content.y
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
        },
        attrs: {
          src: this.url,
        },
      },
    )
  }
}

Vue.component('image-renderer', ImageRenderer)

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

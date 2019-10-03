import Vue from 'vue'
import Component from 'vue-class-component'

import { Template } from './model'

export function renderTemplate(template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, template.width, template.height)
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
  images: { [url: string]: HTMLImageElement }
) {
  for (const renderItem of iterateSymbolRenderItem(template, templates)) {
    if (renderItem.kind === 'text') {
      const content = renderItem.content
      ctx.fillStyle = content.color
      ctx.font = `${content.fontSize}px ${content.fontFamily}`
      ctx.textBaseline = 'top'
      ctx.fillText(content.characters.map((c) => c.text).join(''), content.x, content.y)
    } else if (renderItem.kind === 'image') {
      const content = renderItem.content
      ctx.drawImage(images[content.url], content.x, content.y, content.width, content.height)
    } else if (renderItem.kind === 'symbol') {
      const content = renderItem.content
      ctx.save()
      ctx.translate(content.x, content.y)
      renderSymbol(ctx, renderItem.symbol, templates, images)
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
            }
          }
        )
      ]
    )
  }
}

@Component({
  props: ['template', 'templates']
})
export class SymbolRenderer extends Vue {
  template!: Template
  templates!: Template[]

  render(createElement: Vue.CreateElement): Vue.VNode {
    const children: Vue.VNode[] = []
    for (const renderItem of iterateSymbolRenderItem(this.template, this.templates)) {
      if (renderItem.kind === 'text') {
        const content = renderItem.content
        children.push(createElement(
          'div',
          {
            style: {
              color: content.color,
              fontSize: `${content.fontSize}px`,
              fontFamily: content.fontFamily,
              position: 'absolute',
              left: `${content.x}px`,
              top: `${content.y}px`,
            }
          },
          content.characters.map((c) => c.text).join('')
        ))
      } else if (renderItem.kind === 'image') {
        const content = renderItem.content
        children.push(createElement(
          'img',
          {
            style: {
              width: `${content.width}px`,
              height: `${content.height}px`,
              position: 'absolute',
              left: `${content.x}px`,
              top: `${content.y}px`,
            },
            attrs: {
              src: content.url,
            },
          },
        ))
      } else if (renderItem.kind === 'symbol') {
        const content = renderItem.content
        const referenceResult = createElement(
          'symbol-renderer',
          {
            props: {
              template: renderItem.symbol,
              templates: this.templates,
            }
          }
        )
        children.push(createElement(
          'div',
          {
            style: {
              left: `${content.x}px`,
              top: `${content.y}px`,
              position: 'absolute',
            }
          },
          [referenceResult]
        ))
      }
    }
    return createElement(
      'div',
      {
        style: {
          width: `${this.template.width}px`,
          height: `${this.template.height}px`,
          position: 'absolute',
          userSelect: 'none',
        },
      },
      children
    )
  }
}

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

import Vue from 'vue'
import Component from 'vue-class-component'

import { Template, TemplateTextContent, TemplateImageContent, TemplateReferenceContent, TemplateSnapshotContent, TemplateColorContent } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluateColorExpression, evaluateRotateExpression } from './expression'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'
import { getPosition } from '../utils'
import { iterateSymbolRenderItem } from './renderer'

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
        const props = evaluate(renderItem.props, { props: this.referenceProps })
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
    return evaluateTextExpression(this.content, { props: this.props })
  }

  private get characters() {
    return getCharacters(this.text)
  }

  private get fontSize() {
    return evaluateFontSizeExpression(this.content, { props: this.props })
  }

  private get color() {
    return evaluateColorExpression(this.content, { props: this.props })
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

  private get rotate() {
    return evaluateRotateExpression(this.content, { props: this.props })
  }

  private get width() {
    return evaluateSizeExpression('width', this.content, { props: this.props })
  }

  private get height() {
    return evaluateSizeExpression('height', this.content, { props: this.props })
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
          width: `${this.width}px`,
          height: `${this.height}px`,
          zIndex: this.zValue,
          transform: this.rotate ? `rotate(${this.rotate}deg)` : undefined,
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
    return evaluateUrlExpression(this.content, { props: this.props })
  }

  private get width() {
    return evaluateSizeExpression('width', this.content, { props: this.props })
  }

  private get height() {
    return evaluateSizeExpression('height', this.content, { props: this.props })
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

  private get rotate() {
    return evaluateRotateExpression(this.content, { props: this.props })
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
          transform: this.rotate ? `rotate(${this.rotate}deg)` : undefined,
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
    return evaluateSizeExpression('width', this.content, { props: this.props })
  }

  private get height() {
    return evaluateSizeExpression('height', this.content, { props: this.props })
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

  private get rotate() {
    return evaluateRotateExpression(this.content, { props: this.props })
  }

  private get color() {
    return evaluateColorExpression(this.content, { props: this.props })
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
          transform: this.rotate ? `rotate(${this.rotate}deg)` : undefined,
        },
      },
    )
  }
}

Vue.component('color-renderer', ColorRenderer)

@Component
class Loader<T> extends Vue {
  result: T | null = null
}
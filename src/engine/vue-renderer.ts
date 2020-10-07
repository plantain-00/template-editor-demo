import { defineComponent, h, PropType, reactive, VNode } from 'vue'

import { Template, TemplateTextContent, TemplateImageContent, TemplateReferenceContent, TemplateSnapshotContent, TemplateColorContent, StyleGuide } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluateColorExpression, evaluateRotateExpression } from './expression'
import { applyImageOpacity, loadImage, imageToCtx } from './image'
import { getCharacters } from './mock'
import { getPosition, getVariableObject } from '../utils'
import { iterateSymbolRenderItem } from './renderer'

export const TemplateRenderer = defineComponent({
  props: {
    template: {
      type: Object as PropType<Template>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuide>,
      required: true,
    },
  },
  computed: {
    variable(): { [name: string]: unknown } {
      return getVariableObject(this.styleGuide.variables?.[0])
    }
  },
  render(): VNode {
    return h(
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
        h(
          SymbolRenderer,
          {
            reference: this.template,
            styleGuide: this.styleGuide,
            content: {
              x: 0,
              y: 0,
              kind: 'reference',
              id: '',
            },
            z: 0,
            variable: this.variable,
          }
        )
      ]
    )
  }
})

const SymbolRenderer = defineComponent({
  props: {
    reference: {
      type: Object as PropType<Template>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuide>,
      required: true,
    },
    referenceProps: [Object, Number, String] as PropType<unknown>,
    content: {
      type: Object as PropType<TemplateReferenceContent | TemplateSnapshotContent>,
      required: true,
    },
    template: Object as PropType<Template>,
    props: [Object, Number, String] as PropType<unknown>,
    z: {
      type: Number,
      required: true,
    },
    variable: {
      type: Object as PropType<{ [name: string]: unknown }>,
      required: true,
    },
  },
  computed: {
    width(): number {
      return this.referenceProps ? evaluateSizeExpression('width', this.reference, { variable: this.variable, props: this.referenceProps }) : this.reference.width
    },
    height(): number {
      return this.referenceProps ? evaluateSizeExpression('height', this.reference, { variable: this.variable, props: this.referenceProps }) : this.reference.height
    },
    x(): number {
      return getPosition(this.props, 'x', this.content, this.template, this.styleGuide)
    },
    y(): number {
      return getPosition(this.props, 'y', this.content, this.template, this.styleGuide)
    },
    zValue(): number {
      return this.z + getPosition(this.props, 'z', this.content, this.template, this.styleGuide)
    },
    rotate(): number {
      return evaluateRotateExpression(this.content, { variable: this.variable, props: this.props })
    },
  },
  render(): VNode {
    const children: VNode[] = []
    for (const renderItem of iterateSymbolRenderItem(this.reference, this.styleGuide)) {
      if (renderItem.kind === 'text') {
        children.push(h(
          TextRenderer,
          {
            content: renderItem.content,
            props: this.referenceProps,
            template: this.reference,
            styleGuide: this.styleGuide,
            z: this.zValue,
            variable: this.variable,
          },
        ))
      } else if (renderItem.kind === 'image') {
        children.push(h(
          ImageRenderer,
          {
            content: renderItem.content,
            props: this.referenceProps,
            template: this.reference,
            styleGuide: this.styleGuide,
            z: this.zValue,
            variable: this.variable,
          },
        ))
      } else if (renderItem.kind === 'color') {
        children.push(h(
          ColorRenderer,
          {
            content: renderItem.content,
            props: this.referenceProps,
            template: this.reference,
            styleGuide: this.styleGuide,
            z: this.zValue,
            variable: this.variable,
          },
        ))
      } else if (renderItem.kind === 'symbol') {
        const content = renderItem.content
        const props = evaluate(renderItem.props, { variable: this.variable, props: this.referenceProps })
        children.push(h(
          SymbolRenderer,
          {
            reference: renderItem.symbol,
            styleGuide: this.styleGuide,
            referenceProps: props,
            content,
            template: this.reference,
            props: this.referenceProps,
            z: this.zValue,
            variable: this.variable,
          }
        ))
      }
    }
    return h(
      'div',
      {
        style: {
          width: `${this.width}px`,
          height: `${this.height}px`,
          left: `${this.x}px`,
          top: `${this.y}px`,
          position: 'absolute',
          userSelect: 'none',
          transform: this.rotate ? `rotate(${this.rotate}deg)` : undefined,
        },
      },
      children
    )
  }
})

const TextRenderer = defineComponent({
  props: {
    content: {
      type: Object as PropType<TemplateTextContent>,
      required: true,
    },
    props: [Object, Number, String] as PropType<unknown>,
    template: {
      type: Object as PropType<Template>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuide>,
      required: true,
    },
    z: {
      type: Number,
      required: true,
    },
    variable: {
      type: Object as PropType<{ [name: string]: unknown }>,
      required: true,
    },
  },
  computed: {
    text(): string {
      return evaluateTextExpression(this.content, { variable: this.variable, props: this.props })
    },
    characters(): { text: string }[] {
      return getCharacters(this.text)
    },
    fontSize(): number {
      return evaluateFontSizeExpression(this.content, { variable: this.variable, props: this.props })
    },
    color(): string {
      return evaluateColorExpression(this.content, { variable: this.variable, props: this.props })
    },
    x(): number {
      return getPosition(this.props, 'x', this.content, this.template, this.styleGuide)
    },
    y(): number {
      return getPosition(this.props, 'y', this.content, this.template, this.styleGuide)
    },
    zValue(): number {
      return this.z + getPosition(this.props, 'z', this.content, this.template, this.styleGuide)
    },
    rotate(): number {
      return evaluateRotateExpression(this.content, { variable: this.variable, props: this.props })
    },
    width(): number {
      return evaluateSizeExpression('width', this.content, { variable: this.variable, props: this.props })
    },
    height(): number {
      return evaluateSizeExpression('height', this.content, { variable: this.variable, props: this.props })
    },
  },
  render(): VNode {
    return h(
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
})

const ImageRenderer = defineComponent({
  props: {
    content: {
      type: Object as PropType<TemplateImageContent>,
      required: true,
    },
    props: [Object, Number, String] as PropType<unknown>,
    template: {
      type: Object as PropType<Template>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuide>,
      required: true,
    },
    z: {
      type: Number,
      required: true,
    },
    variable: {
      type: Object as PropType<{ [name: string]: unknown }>,
      required: true,
    },
  },
  computed: {
    url(): string {
      return evaluateUrlExpression(this.content, { variable: this.variable, props: this.props })
    },
    width(): number {
      return evaluateSizeExpression('width', this.content, { variable: this.variable, props: this.props })
    },
    height(): number {
      return evaluateSizeExpression('height', this.content, { variable: this.variable, props: this.props })
    },
    x(): number {
      return getPosition(this.props, 'x', this.content, this.template, this.styleGuide)
    },
    y(): number {
      return getPosition(this.props, 'y', this.content, this.template, this.styleGuide)
    },
    zValue(): number {
      return this.z + getPosition(this.props, 'z', this.content, this.template, this.styleGuide)
    },
    rotate(): number {
      return evaluateRotateExpression(this.content, { variable: this.variable, props: this.props })
    },
    imageLoader(): Loader<HTMLImageElement> {
      const loader = createLoader<HTMLImageElement>()
      // eslint-disable-next-line plantain/promise-not-await
      loadImage(this.url).then((image) => {
        loader.result = image
      })
      return loader
    },
    base64(): string {
      if (this.content.base64) {
        return this.content.base64
      }
      if (this.content.opacity !== undefined && this.imageLoader.result) {
        const imageCtx = imageToCtx(this.imageLoader.result)
        applyImageOpacity(imageCtx, this.content.opacity)
        return imageCtx.canvas.toDataURL()
      }
      return this.url
    },
  },
  render(): VNode {
    return h(
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
          mixBlendMode: this.content.blendMode,
        },
        src: this.base64,
      },
    )
  }
})

const ColorRenderer = defineComponent({
  props: {
    content: {
      type: Object as PropType<TemplateColorContent>,
      required: true,
    },
    props: [Object, Number, String] as PropType<unknown>,
    template: {
      type: Object as PropType<Template>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuide>,
      required: true,
    },
    z: {
      type: Number,
      required: true,
    },
    variable: {
      type: Object as PropType<{ [name: string]: unknown }>,
      required: true,
    },
  },
  computed: {
    width(): number {
      return evaluateSizeExpression('width', this.content, { variable: this.variable, props: this.props })
    },
    height(): number {
      return evaluateSizeExpression('height', this.content, { variable: this.variable, props: this.props })
    },
    x(): number {
      return getPosition(this.props, 'x', this.content, this.template, this.styleGuide)
    },
    y(): number {
      return getPosition(this.props, 'y', this.content, this.template, this.styleGuide)
    },
    zValue(): number {
      return this.z + getPosition(this.props, 'z', this.content, this.template, this.styleGuide)
    },
    rotate(): number {
      return evaluateRotateExpression(this.content, { variable: this.variable, props: this.props })
    },
    color(): string {
      return evaluateColorExpression(this.content, { variable: this.variable, props: this.props })
    },
  },
  render(): VNode {
    return h(
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
})

function createLoader<T>() {
  return reactive({
    result: null as T | null
  })
}

type Loader<T> = {
  result: T | null
}

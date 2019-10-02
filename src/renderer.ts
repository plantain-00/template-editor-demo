import Vue from 'vue'
import Component from 'vue-class-component'

import { Template } from "./model"

@Component({
  props: ['template', 'templates', 'isRoot']
})
export class TemplateRenderer extends Vue {
  template!: Template
  templates!: Template[]
  isRoot!: boolean

  render(createElement: Vue.CreateElement): Vue.VNode {
    const children: Vue.VNode[] = []
    for (let i = 0; i < this.template.contents.length; i++) {
      const content = this.template.contents[i]
      if (content.hidden) {
        continue
      }
      if (content.kind === 'text') {
        children.push(createElement(
          'div',
          {
            style: {
              color: `${content.color}`,
              fontSize: `${content.fontSize}px`,
              fontFamily: `${content.fontFamily}`,
              position: 'absolute',
              left: `${content.x}px`,
              top: `${content.y}px`,
            }
          },
          content.characters.map((c) => c.text).join('')
        ))
      } else if (content.kind === 'image') {
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
      } else if (content.kind === 'reference') {
        const reference = this.templates.find((t) => t.id === content.id)
        if (reference) {
          const referenceResult = createElement(
            'template-renderer',
            {
              props: {
                template: reference,
                templates: this.templates,
                isRoot: false,
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
      } else if (content.kind === 'snapshot') {
        const referenceResult = createElement(
          'template-renderer',
          {
            props: {
              template: content.snapshot,
              templates: this.templates,
              isRoot: false,
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
          backgroundColor: this.isRoot ? 'white' : undefined,
        },
      },
      children
    )
  }
}

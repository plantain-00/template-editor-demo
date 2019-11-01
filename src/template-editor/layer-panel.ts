import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'

@Component({
  props: ['canvasState']
})
export class LayerPanel extends Vue {
  private canvasState!: CanvasState

  private get panelStyle() {
    return {
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'auto',
    }
  }

  private getContentName(content: TemplateContent) {
    if (content.kind === 'text' && content.text) {
      return content.text
    }
    if (content.kind === 'color' && content.color) {
      return content.color
    }
    if (content.kind === 'reference') {
      const template = this.canvasState.styleGuide.templates.find((t) => t.id === content.id)
      if (template && template.name) {
        return template.name
      }
    }
    if (content.kind === 'snapshot' && content.snapshot.name) {
      return content.snapshot.name
    }
    return content.kind
  }

  private getContentStyle(content: TemplateContent) {
    return {
      cursor: 'pointer',
      marginLeft: '20px',
      color: this.canvasState.selection.kind === 'content' && this.canvasState.selection.content === content ? 'green' : 'black'
    }
  }

  private getTemplateStyle(template: Template) {
    return {
      cursor: 'pointer',
      marginLeft: '10px',
      color: this.canvasState.selection.kind === 'template' && this.canvasState.selection.template === template ? 'green' : 'black'
    }
  }

  private selectContent(content: TemplateContent, template: Template) {
    this.canvasState.selection = {
      kind: 'content',
      content,
      template
    }
  }

  private selectTemplate(template: Template) {
    this.canvasState.selection = {
      kind: 'template',
      template
    }
  }

  private renderContent(createElement: Vue.CreateElement, content: TemplateContent, template: Template): Vue.VNode {
    const contents: Vue.VNodeChildren = [
      createElement(
        'div',
        {
          on: {
            click: () => this.selectContent(content, template)
          }
        },
        this.getContentName(content)
      )
    ]
    if (content.kind === 'snapshot') {
      contents.push(...content.snapshot.contents.map((c) => this.renderContent(createElement, c, template)))
    }
    return createElement(
      'div',
      {
        style: this.getContentStyle(content)
      },
      contents
    )
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'div',
      {
        style: this.panelStyle
      },
      this.canvasState.styleGuide.templates.map((template) => createElement(
        'div',
        [
          createElement(
            'div',
            {
              style: this.getTemplateStyle(template),
              on: {
                click: () => this.selectTemplate(template)
              }
            },
            template.name || 'template'
          ),
          ...template.contents.map((content) => this.renderContent(createElement, content, template))
        ]
      ))
    )
  }
}

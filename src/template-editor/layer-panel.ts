import Vue from 'vue'
import Component from 'vue-class-component'
import 'tree-vue-component'
import { DropPosition } from 'tree-vue-component'

import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'

@Component({
  props: ['canvasState']
})
export class LayerPanel extends Vue {
  private canvasState!: CanvasState

  private dragIndex: number | undefined

  private get panelStyle() {
    return {
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'auto',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    }
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    return createElement(
      'tree',
      {
        style: this.panelStyle,
        props: {
          data: [],
          draggable: true,
        },
      },
      this.canvasState.styleGuide.templates.map((template, i) => createElement(
        'layer-node',
        {
          key: template.id,
          props: {
            canvasState: this.canvasState,
            template,
            last: i === this.canvasState.styleGuide.templates.length - 1,
            path: [i],
          },
          on: {
            drag: (index: number) => {
              this.dragIndex = index
            },
            drop: (index: number) => {
              if (this.dragIndex !== undefined && this.dragIndex !== index) {
                const template = this.canvasState.styleGuide.templates.splice(this.dragIndex, 1)[0]
                this.canvasState.styleGuide.templates.splice(index, 0, template)
              }
            },
          }
        },
      ))
    )
  }
}

@Component({
  props: ['canvasState', 'content', 'template', 'last', 'path']
})
class LayerNode extends Vue {
  private canvasState!: CanvasState
  private content?: TemplateContent
  private template!: Template
  private last!: boolean
  private path!: number[]

  private opened = true
  private dragIndex: number | undefined

  private get selected() {
    return this.canvasState.selection.kind === 'content' && this.canvasState.selection.content === this.content
  }

  private get contentName() {
    const content = this.content
    if (!content) {
      return this.template.name || 'template'
    }
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

  private get contents() {
    if (this.content) {
      if (this.content.kind === 'snapshot') {
        return this.content.snapshot.contents
      }
      return []
    }
    return this.template.contents
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    const children = this.contents.map((c, i) => createElement(
      'layer-node',
      {
        props: {
          canvasState: this.canvasState,
          content: c,
          template: this.template,
          last: i === this.contents.length - 1,
          path: [...this.path, i],
        },
        on: {
          drag: (index: number) => {
            this.dragIndex = index
          },
          drop: (index: number) => {
            if (this.dragIndex !== undefined && this.dragIndex !== index) {
              const content = this.contents.splice(this.dragIndex, 1)[0]
              this.contents.splice(index, 0, content)
            }
          },
        }
      },
    ))
    return createElement(
      'node',
      {
        props: {
          data: {
            text: this.contentName,
            children: [],
            icon: false,
            state: {
              opened: this.opened,
              selected: this.selected,
              disabled: false,
              loading: false,
              highlighted: false,
              openable: false,
              dropPosition: DropPosition.empty,
              dropAllowed: false,
            }
          },
          last: this.last,
          path: this.path,
          draggable: true,
        },
        on: {
          toggle: () => {
            this.opened = !this.opened
          },
          change: () => {
            if (this.content) {
              this.canvasState.selection = {
                kind: 'content',
                content: this.content,
                template: this.template,
              }
            } else {
              this.canvasState.selection = {
                kind: 'template',
                template: this.template,
              }
            }
          },
          dragstart: (e: DragEvent) => {
            this.$emit('drag', this.path[this.path.length - 1])
            e.stopPropagation()
          },
          dragend: (e: DragEvent) => {
            this.$emit('drag', undefined)
            e.stopPropagation()
          },
          drop: (e: DragEvent) => {
            this.$emit('drop', this.path[this.path.length - 1])
            e.stopPropagation()
          },
        }
      },
      children
    )
  }
}

Vue.component('layer-node', LayerNode)

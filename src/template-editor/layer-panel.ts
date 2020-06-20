import Vue from 'vue'
import Component from 'vue-class-component'
import 'tree-vue-component'
import { DropPosition } from 'tree-vue-component'

import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'
import { getTemplateDisplayName, getContentDisplayName } from './utils'

@Component({
  props: ['canvasState']
})
export class LayerPanel extends Vue {
  private canvasState!: CanvasState

  private childrenDragIndex: number | null = null

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
          key: template.id + '_' + i,
          props: {
            canvasState: this.canvasState,
            template,
            last: i === this.canvasState.styleGuide.templates.length - 1,
            path: [i],
            dragIndex: this.childrenDragIndex,
          },
          on: {
            drag: (index: number) => {
              this.childrenDragIndex = index
            },
            drop: (e: { index: number, dropPosition: DropPosition }) => {
              if (this.childrenDragIndex !== null
                && this.childrenDragIndex !== e.index
                && (this.childrenDragIndex !== e.index + 1 || e.dropPosition !== DropPosition.down)
                && (this.childrenDragIndex !== e.index - 1 || e.dropPosition !== DropPosition.up)) {
                const template = this.canvasState.styleGuide.templates.splice(this.childrenDragIndex, 1)[0]
                let index = e.index
                if (e.dropPosition === DropPosition.down) {
                  index++
                }
                if (this.childrenDragIndex < e.index) {
                  index--
                }
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
  props: ['canvasState', 'content', 'template', 'last', 'path', 'dragIndex']
})
class LayerNode extends Vue {
  private canvasState!: CanvasState
  private content?: TemplateContent
  private template!: Template
  private last!: boolean
  private path!: number[]
  private dragIndex!: number | null

  private opened = true
  private dropPosition = DropPosition.empty
  private childrenDragIndex: number | null = null

  private get selected() {
    return (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content === this.content)
      || (this.canvasState.selection.kind === 'template' && this.canvasState.selection.template === this.template && !this.content)
  }
  private get dropAllowed() {
    return this.dragIndex !== null
      && this.dragIndex !== this.index
      && (this.dragIndex !== this.index + 1 || this.dropPosition !== DropPosition.down)
      && (this.dragIndex !== this.index - 1 || this.dropPosition !== DropPosition.up)
  }

  private get index() {
    return this.path[this.path.length - 1]
  }

  private get contentName() {
    if (!this.content) {
      return getTemplateDisplayName(this.template)
    }
    return getContentDisplayName(this.content, this.canvasState.styleGuide)
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
          dragIndex: this.childrenDragIndex,
        },
        on: {
          drag: (index: number) => {
            this.childrenDragIndex = index
          },
          drop: (e: { index: number, dropPosition: DropPosition }) => {
            if (this.childrenDragIndex !== null
              && this.childrenDragIndex !== e.index
              && (this.childrenDragIndex !== e.index + 1 || e.dropPosition !== DropPosition.down)
              && (this.childrenDragIndex !== e.index - 1 || e.dropPosition !== DropPosition.up)) {
              const content = this.contents.splice(this.childrenDragIndex, 1)[0]
              let index = e.index
              if (e.dropPosition === DropPosition.down) {
                index++
              }
              if (this.childrenDragIndex < e.index) {
                index--
              }
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
              dropPosition: this.dropPosition,
              dropAllowed: this.dropAllowed,
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
            this.$emit('drag', this.index)
            e.stopPropagation()
          },
          dragend: (e: DragEvent) => {
            this.$emit('drag', undefined)
            e.stopPropagation()
          },
          dragover: (e: DragEvent) => {
            const target = e.target as HTMLElement
            const offsetTop = getGlobalOffset(target)
            this.dropPosition = getDropPosition(e.pageY, offsetTop, target.offsetHeight)
            e.stopPropagation()
            e.preventDefault()
          },
          dragenter: (e: DragEvent) => {
            const target = e.target as HTMLElement
            const offsetTop = getGlobalOffset(target)
            this.dropPosition = getDropPosition(e.pageY, offsetTop, target.offsetHeight)
            e.stopPropagation()
          },
          dragleave: (e: DragEvent) => {
            this.dropPosition = DropPosition.empty
            e.stopPropagation()
          },
          drop: (e: DragEvent) => {
            this.$emit('drop', { index: this.index, dropPosition: this.dropPosition })
            this.dropPosition = DropPosition.empty
            e.stopPropagation()
          },
        }
      },
      children
    )
  }
}

Vue.component('layer-node', LayerNode)

function getGlobalOffset(dropTarget: HTMLElement) {
  let offset = 0
  let currentElem = dropTarget
  while (currentElem) {
    offset += currentElem.offsetTop
    currentElem = currentElem.offsetParent as HTMLElement
  }
  return offset
}

function getDropPosition(pageY: number, offsetTop: number, offsetHeight: number) {
  const top = pageY - offsetTop
  if (top < offsetHeight / 2) {
    return DropPosition.up
  }
  return DropPosition.down
}

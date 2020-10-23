import { defineComponent, h, PropType, VNode } from 'vue'
import { DropPosition, Node, Tree } from 'tree-vue-component'

import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'
import { getTemplateDisplayName, getContentDisplayName } from './utils'

export const LayerPanel = defineComponent({
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  data: () => {
    return {
      childrenDragIndex: undefined as number | undefined,
    }
  },
  computed: {
    panelStyle(): { [name: string]: unknown } {
      return {
        height: this.canvasState.viewport.height + 'px',
        overflow: 'auto',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }
    }
  },
  render(): VNode {
    return h(
      Tree,
      {
        style: this.panelStyle,
        data: [],
        draggable: true,
      },
      () => this.canvasState.styleGuide.templates.map((template, i) => h(
        LayerNode,
        {
          key: template.id + '_' + i,
          canvasState: this.canvasState,
          template,
          last: i === this.canvasState.styleGuide.templates.length - 1,
          path: [i],
          dragIndex: this.childrenDragIndex,
          onDrag: (index: number) => {
            this.childrenDragIndex = index
          },
          onDrop: (e: { index: number, dropPosition: DropPosition }) => {
            if (this.childrenDragIndex !== undefined
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
        },
      ))
    )
  }
})

const LayerNode = defineComponent({
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    },
    content: Object as PropType<TemplateContent>,
    template: {
      type: Object as PropType<Template>,
      required: true,
    },
    last: {
      type: Boolean,
      required: true,
    },
    path: {
      type: Array as PropType<number[]>,
      required: true,
    },
    dragIndex: Number,
  },
  data: () => {
    return {
      opened: true,
      dropPosition: DropPosition.empty,
      childrenDragIndex: undefined as number | undefined,
    }
  },
  computed: {
    selected(): boolean {
      return (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content === this.content)
        || (this.canvasState.selection.kind === 'template' && this.canvasState.selection.template === this.template && !this.content)
    },
    dropAllowed(): boolean {
      return this.dragIndex !== null
        && this.dragIndex !== this.index
        && (this.dragIndex !== this.index + 1 || this.dropPosition !== DropPosition.down)
        && (this.dragIndex !== this.index - 1 || this.dropPosition !== DropPosition.up)
    },
    index(): number {
      return this.path[this.path.length - 1]
    },
    contentName(): string {
      if (!this.content) {
        return getTemplateDisplayName(this.template)
      }
      return getContentDisplayName(this.content, this.canvasState.styleGuide)
    },
    contents(): TemplateContent[] {
      if (this.content) {
        if (this.content.kind === 'snapshot') {
          return this.content.snapshot.contents
        }
        return []
      }
      return this.template.contents
    },
  },
  render(): VNode {
    const children = this.contents.map((c, i) => h(
      LayerNode,
      {
        canvasState: this.canvasState,
        content: c,
        template: this.template,
        last: i === this.contents.length - 1,
        path: [...this.path, i],
        dragIndex: this.childrenDragIndex,
        onDrag: (index: number) => {
          this.childrenDragIndex = index
        },
        onDrop: (e: { index: number, dropPosition: DropPosition }) => {
          if (this.childrenDragIndex !== undefined
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
      },
    ))
    return h(
      Node,
      {
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
        preid: '',
        onToggle: () => {
          this.opened = !this.opened
        },
        onChange: () => {
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
        onDragstart: (e: DragEvent) => {
          this.$emit('drag', this.index)
          e.stopPropagation()
        },
        onDragend: (e: DragEvent) => {
          this.$emit('drag', undefined)
          e.stopPropagation()
        },
        onDragover: (e: DragEvent) => {
          const target = e.target as HTMLElement
          const offsetTop = getGlobalOffset(target)
          this.dropPosition = getDropPosition(e.pageY, offsetTop, target.offsetHeight)
          e.stopPropagation()
          e.preventDefault()
        },
        onDragenter: (e: DragEvent) => {
          const target = e.target as HTMLElement
          const offsetTop = getGlobalOffset(target)
          this.dropPosition = getDropPosition(e.pageY, offsetTop, target.offsetHeight)
          e.stopPropagation()
        },
        onDragleave: (e: DragEvent) => {
          this.dropPosition = DropPosition.empty
          e.stopPropagation()
        },
        onDrop: (e: DragEvent) => {
          this.$emit('drop', { index: this.index, dropPosition: this.dropPosition })
          this.dropPosition = DropPosition.empty
          e.stopPropagation()
        },
      },
      () => children
    )
  }
})

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

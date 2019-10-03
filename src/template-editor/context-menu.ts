import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { templateEditorContextMenuTemplateHtml, templateEditorContextMenuTemplateHtmlStatic } from '../variables'
import { isInRegion, iterateAllContentPositions } from '../utils'

@Component({
  render: templateEditorContextMenuTemplateHtml,
  staticRenderFns: templateEditorContextMenuTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class ContextMenu extends Vue {
  canvasState!: CanvasState

  get contextMenuStyle() {
    return {
      position: 'absolute',
      left: this.canvasState.contextMenuX + 'px',
      top: this.canvasState.contextMenuY + 'px',
      width: '100px',
      height: '200px',
      backgroundColor: '#eee',
    }
  }

  get maskStyle() {
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      opacity: 0,
    }
  }

  close(e: MouseEvent) {
    this.canvasState.contextMenuEnabled = false
    e.stopPropagation()
  }

  remove() {
    const x = this.canvasState.mapX(this.canvasState.contextMenuX)
    const y = this.canvasState.mapY(this.canvasState.contextMenuY)
    this.canvasState.action()
    if (this.canvasState.selection.kind === 'template') {
      for (let i = 0; i < this.canvasState.styleGuide.templates.length; i++) {
        const template = this.canvasState.styleGuide.templates[i]
        if (isInRegion({ x, y }, template)) {
          if (template === this.canvasState.selection.template) {
            this.canvasState.styleGuide.templates.splice(i, 1)
            return
          }

          for (let j = 0; j < template.contents.length; j++) {
            const content = template.contents[j]
            if (content.kind === 'reference'
              && content.id === this.canvasState.selection.template.id
              && isInRegion(
                { x, y },
                {
                  x: template.x + content.x,
                  y: template.y + content.y,
                  width: template.width,
                  height: template.height,
                })) {
              template.contents.splice(j, 1)
              return
            }
          }
        }
      }
    } else if (this.canvasState.selection.kind === 'content') {
      for (const contentPosition of iterateAllContentPositions(
        this.canvasState.selection.content,
        this.canvasState.styleGuide,
        this.canvasState.selection.template
      )) {
        contentPosition.contents.splice(contentPosition.index, 1)
        return
      }
    }
  }
}

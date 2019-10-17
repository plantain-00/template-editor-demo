import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { templateEditorContextMenuTemplateHtml, templateEditorContextMenuTemplateHtmlStatic } from '../variables'
import { isInRegion } from '../utils'

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
      for (const templateRegion of this.canvasState.allTemplateRegions) {
        if (isInRegion({ x, y }, templateRegion)) {
          if (templateRegion.parent) {
            // delete content
            templateRegion.parent.template.contents.splice(templateRegion.parent.index, 1)
          } else {
            // delete template and all referenced contents
            for (let i = this.canvasState.styleGuide.templates.length - 1; i >= 0; i--) {
              const template = this.canvasState.styleGuide.templates[i]
              if (template === templateRegion.template) {
                this.canvasState.styleGuide.templates.splice(i, 1)
                continue
              }
              for (let j = template.contents.length - 1; j >= 0; j--) {
                const content = template.contents[j]
                if (content.kind === 'reference' && content.id === templateRegion.template.id) {
                  template.contents.splice(j, 1)
                }
              }
            }
            return
          }
        }
      }
    } else if (this.canvasState.selection.kind === 'content') {
      for (const contentRegion of this.canvasState.allContentRegions) {
        contentRegion.contents.splice(contentRegion.index, 1)
        return
      }
    }
  }
}

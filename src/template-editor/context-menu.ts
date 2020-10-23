import { defineComponent, PropType } from 'vue'

import { CanvasState } from './canvas-state'
import { templateEditorContextMenuTemplateHtml } from '../variables'
import { isInRegion } from '../utils'
import { iterateContentOrTemplateByPosition, ContentOrTemplateRegion, getTemplateDisplayName, getContentDisplayName } from './utils'

export const ContextMenu = defineComponent({
  render: templateEditorContextMenuTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  computed: {
    contextMenuStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        left: this.canvasState.contextMenuX + 'px',
        top: this.canvasState.contextMenuY + 'px',
        width: '100px',
        height: '200px',
        backgroundColor: '#eee',
      }
    },
    maskStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        opacity: 0,
      }
    },
    targets(): ContentOrTemplateRegion[] {
      const x = this.canvasState.mapX(this.canvasState.contextMenuX)
      const y = this.canvasState.mapY(this.canvasState.contextMenuY)
      return Array.from(iterateContentOrTemplateByPosition(this.canvasState, {
        x,
        y,
      }))
    }
  },
  methods: {
    getTargetDisplayName(target: ContentOrTemplateRegion) {
      if (target.kind === 'template') {
        return getTemplateDisplayName(target.region.template)
      }
      return getContentDisplayName(target.region.content, this.canvasState.styleGuide)
    },
    close(e: MouseEvent) {
      this.canvasState.contextMenuEnabled = false
      e.stopPropagation()
    },
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
    },
    select(target: ContentOrTemplateRegion) {
      if (target.kind === 'content') {
        this.canvasState.selection = {
          kind: 'content',
          content: target.region.content,
          template: target.region.template
        }
      } else if (target.kind === 'template') {
        this.canvasState.selection = {
          kind: 'template',
          template: target.region.template
        }
      }
      this.canvasState.hasRelationWithSelection = false
    }
  }
})

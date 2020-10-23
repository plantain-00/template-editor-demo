import { defineComponent, PropType } from 'vue'
import { templateEditorHoverLayerTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { selectContentOrTemplateByPosition } from './utils'
import { Template, Rotate } from '../model'

export const HoverLayer = defineComponent({
  render: templateEditorHoverLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  computed: {
    canvasStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        overflow: 'hidden',
      }
    },
    styleGuideStyle(): { [name: string]: unknown } {
      return {
        transform: `scale(${this.canvasState.viewport.scale}) translate(${this.canvasState.viewport.translateX}px, ${this.canvasState.viewport.translateY}px)`,
        width: this.canvasState.styleGuideWidth + 'px',
        height: this.canvasState.styleGuideHeight + 'px',
      }
    },
    hoverStyle(): { [name: string]: unknown } | undefined {
      if (this.canvasState.mousePressing) {
        return undefined
      }
      const content = selectContentOrTemplateByPosition(this.canvasState, { x: this.canvasState.mappedX, y: this.canvasState.mappedY })
      if (content) {
        const region = content.kind === 'content' ? content.region : content.region.template as Template & Rotate
        return {
          left: region.x + 'px',
          top: region.y + 'px',
          width: region.width + 'px',
          height: region.height + 'px',
          transform: region.rotate ? `rotate(${region.rotate}deg)` : undefined,
          position: 'absolute',
          backgroundColor: 'green',
          opacity: 0.1,
        }
      }
      return undefined
    }
  }
})

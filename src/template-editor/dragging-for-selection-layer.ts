import { defineComponent, PropType } from 'vue'

import { CanvasState } from './canvas-state'
import { templateEditorDraggingForSelectionLayerTemplateHtml } from '../variables'

export const DraggingForSelectionLayer = defineComponent({
  render: templateEditorDraggingForSelectionLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  computed: {
    draggingAreaStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        border: '1px dashed black',
        left: Math.min(this.canvasState.mousedownX, this.canvasState.mouseupX) + 'px',
        top: Math.min(this.canvasState.mousedownY, this.canvasState.mouseupY) + 'px',
        width: Math.abs(this.canvasState.mousedownX - this.canvasState.mouseupX) + 'px',
        height: Math.abs(this.canvasState.mousedownY - this.canvasState.mouseupY) + 'px',
      }
    }
  }
})

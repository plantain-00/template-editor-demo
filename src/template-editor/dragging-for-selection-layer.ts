import { defineComponent, PropType } from 'vue'

import { templateEditorDraggingForSelectionLayerTemplateHtml } from '../variables'
import { Mask } from './mask-layer'

export const DraggingForSelectionLayer = defineComponent({
  render: templateEditorDraggingForSelectionLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    },
    mask: {
      type: Object as PropType<Mask>,
      required: true,
    }
  },
  computed: {
    draggingAreaStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        border: '1px dashed black',
        left: Math.min(this.mask.mousedownX, this.mask.mouseupX) + 'px',
        top: Math.min(this.mask.mousedownY, this.mask.mouseupY) + 'px',
        width: Math.abs(this.mask.mousedownX - this.mask.mouseupX) + 'px',
        height: Math.abs(this.mask.mousedownY - this.mask.mouseupY) + 'px',
      }
    }
  }
})

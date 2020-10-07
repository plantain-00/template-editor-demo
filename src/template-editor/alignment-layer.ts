import { defineComponent, PropType } from 'vue'

import { CanvasState } from './canvas-state'
import { templateEditorAlignmentLayerTemplateHtml } from '../variables'

export const AlignmentLayer = defineComponent({
  render: templateEditorAlignmentLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  computed: {
    xStyle(): { [name: string]: unknown } {
      if (this.canvasState.xAlignment === null) {
        return {}
      }
      return {
        position: 'absolute',
        borderLeft: '1px dashed black',
        left: this.canvasState.mapBackX(this.canvasState.xAlignment) + 'px',
        top: '0px',
        width: '1px',
        height: '100%',
      }
    },
    yStyle(): { [name: string]: unknown } {
      if (this.canvasState.yAlignment === null) {
        return {}
      }
      return {
        position: 'absolute',
        borderTop: '1px dashed black',
        top: this.canvasState.mapBackY(this.canvasState.yAlignment) + 'px',
        left: '0px',
        width: '100%',
        height: '1px%',
      }
    }
  }
})

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
      if (this.canvasState.alignment.x === undefined) {
        return {}
      }
      return {
        position: 'absolute',
        borderLeft: '1px dashed black',
        left: this.canvasState.mapBackX(this.canvasState.alignment.x) + 'px',
        top: '0px',
        width: '1px',
        height: '100%',
      }
    },
    yStyle(): { [name: string]: unknown } {
      if (this.canvasState.alignment.y === undefined) {
        return {}
      }
      return {
        position: 'absolute',
        borderTop: '1px dashed black',
        top: this.canvasState.mapBackY(this.canvasState.alignment.y) + 'px',
        left: '0px',
        width: '100%',
        height: '1px%',
      }
    }
  }
})

export function createAlignment() {
  return {
    x: undefined as number | undefined,
    y: undefined as number | undefined,
  }
}

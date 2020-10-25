import { defineComponent, PropType } from 'vue'

import { templateEditorAlignmentLayerTemplateHtml } from '../variables'
import { Viewport } from '../engine/viewport'
import { StyleGuideModel } from './style-guide'

export const AlignmentLayer = defineComponent({
  render: templateEditorAlignmentLayerTemplateHtml,
  props: {
    viewport: {
      type: Object as PropType<Viewport>,
      required: true,
    },
    styleGuide: {
      type: Object as PropType<StyleGuideModel>,
      required: true,
    },
    alignment: {
      type: Object as PropType<Alignment>,
      required: true,
    }
  },
  computed: {
    xStyle(): { [name: string]: unknown } {
      if (this.alignment.x === undefined) {
        return {}
      }
      return {
        position: 'absolute',
        borderLeft: '1px dashed black',
        left: this.viewport.mapBackX(this.alignment.x, this.styleGuide.width) + 'px',
        top: '0px',
        width: '1px',
        height: '100%',
      }
    },
    yStyle(): { [name: string]: unknown } {
      if (this.alignment.y === undefined) {
        return {}
      }
      return {
        position: 'absolute',
        borderTop: '1px dashed black',
        top: this.viewport.mapBackY(this.alignment.y, this.styleGuide.height) + 'px',
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

type Alignment = ReturnType<typeof createAlignment>

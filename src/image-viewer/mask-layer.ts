import { defineComponent, PropType } from 'vue'

import { Viewport } from '../engine/viewport'
import { imageViewerMaskLayerTemplateHtml } from '../variables'

export const MaskLayer = defineComponent({
  render: imageViewerMaskLayerTemplateHtml,
  props: {
    viewport: {
      type: Object as PropType<Viewport>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    maskStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.viewport.width + 'px',
        height: this.viewport.height + 'px',
        opacity: 0,
      }
    },
  },
  methods: {
    wheel(e: WheelEvent) {
      this.viewport.zoom(e, this.width, this.height)
      this.viewport.move(e)
    },
  }
})

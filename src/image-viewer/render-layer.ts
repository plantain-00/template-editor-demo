import { defineComponent, PropType } from 'vue'
import { imageViewerRenderLayerTemplateHtml } from '../variables'
import { Viewport } from '../engine/viewport'

export const RenderLayer = defineComponent({
  render: imageViewerRenderLayerTemplateHtml,
  props: {
    viewport: {
      type: Object as PropType<Viewport>,
      required: true,
    },
    url: {
      type: String,
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
    canvasStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.viewport.width + 'px',
        height: this.viewport.height + 'px',
        overflow: 'hidden',
        backgroundColor: '#ddd',
      }
    },
    imageStyle(): { [name: string]: unknown } {
      return {
        transform: this.viewport.transform,
        width: this.width + 'px',
        height: this.height + 'px',
      }
    },
  },
})

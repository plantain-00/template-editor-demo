import { defineComponent } from 'vue'

import { createViewport } from '../engine/viewport'
import { imageViewerImageViewerTemplateHtml } from '../variables'
import { RenderLayer } from './render-layer'
import { MaskLayer } from './mask-layer'
import { loadImage } from '../engine/image'

export const ImageViewer = defineComponent({
  render: imageViewerImageViewerTemplateHtml,
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    const image = await loadImage(this.url)
    this.imageWidth = image.width
    this.imageHeight = image.height
    this.viewport.applyRegionChange({
      x: 0,
      y: 0,
      width: this.imageWidth,
      height: this.imageHeight,
    })
  },
  data: (props) => {
    return {
      viewport: createViewport(props.width, props.height),
      imageWidth: 0,
      imageHeight: 0,
    }
  },
  components: {
    'render-layer': RenderLayer,
    'mask-layer': MaskLayer,
  },
  computed: {
    canvasStyle(): { [name: string]: unknown } {
      return {
        width: this.viewport.width + 'px',
        height: this.viewport.height + 'px',
        position: 'absolute',
      }
    },
  },
})

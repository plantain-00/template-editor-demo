import { defineComponent, PropType } from 'vue'
import { templateEditorRenderLayerTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { TemplateRenderer } from '../engine/vue-renderer'
import { Template } from '../model'
import { nameSize } from '../utils'

export const RenderLayer = defineComponent({
  render: templateEditorRenderLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  components: {
    'template-renderer': TemplateRenderer,
  },
  computed: {
    canvasStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        overflow: 'hidden',
        backgroundColor: '#ddd',
      }
    },
    styleGuideStyle(): { [name: string]: unknown } {
      return {
        transform: `scale(${this.canvasState.viewport.scale}) translate(${this.canvasState.viewport.translateX}px, ${this.canvasState.viewport.translateY}px)`,
        width: this.canvasState.styleGuide.width + 'px',
        height: this.canvasState.styleGuide.height + 'px',
      }
    },
  },
  methods: {
    getTemplateStyle(template: Template) {
      return {
        left: template.x + 'px',
        top: template.y + 'px',
        position: 'absolute',
        zIndex: Math.round(template.z || 0),
      }
    },
    getNameStyle(template: Template) {
      return {
        position: 'absolute',
        top: `-${nameSize}px`,
        lineHeight: `${nameSize}px`,
        fontSize: '12px',
        width: `${template.name ? template.name.length * nameSize : 0}px`,
        zIndex: Math.round(template.z || 0),
        transform: `scale(${1 / this.canvasState.viewport.scale})`,
        transformOrigin: 'left bottom',
      }
    }
  }
})

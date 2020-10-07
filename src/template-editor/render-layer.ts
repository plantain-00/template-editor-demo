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
        width: this.canvasState.canvasWidth + 'px',
        height: this.canvasState.canvasHeight + 'px',
        overflow: 'hidden',
        backgroundColor: '#ddd',
      }
    },
    styleGuideStyle(): { [name: string]: unknown } {
      return {
        transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
        width: this.canvasState.styleGuideWidth + 'px',
        height: this.canvasState.styleGuideHeight + 'px',
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
        transform: `scale(${1 / this.canvasState.styleGuideScale})`,
        transformOrigin: 'left bottom',
      }
    }
  }
})

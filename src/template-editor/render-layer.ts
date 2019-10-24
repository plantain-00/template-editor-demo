import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorRenderLayerTemplateHtml, templateEditorRenderLayerTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { TemplateRenderer } from '../engine/renderer'
import { Template } from '../model'
import { nameSize } from '../utils'

@Component({
  render: templateEditorRenderLayerTemplateHtml,
  staticRenderFns: templateEditorRenderLayerTemplateHtmlStatic,
  props: ['canvasState']
})
export class RenderLayer extends Vue {
  canvasState!: CanvasState

  get canvasStyle() {
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'hidden',
      backgroundColor: '#ddd',
    }
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
      width: this.canvasState.styleGuideWidth + 'px',
      height: this.canvasState.styleGuideHeight + 'px',
    }
  }

  getTemplateStyle(template: Template) {
    return {
      left: template.x + 'px',
      top: template.y + 'px',
      position: 'absolute',
      zIndex: Math.round(template.z || 0),
    }
  }

  getNameStyle(template: Template) {
    return {
      position: 'absolute',
      top: `-${nameSize}px`,
      fontSize: '20px',
      width: `${template.name ? template.name.length * nameSize : 0}px`,
      zIndex: Math.round(template.z || 0),
    }
  }
}

Vue.component('template-renderer', TemplateRenderer)

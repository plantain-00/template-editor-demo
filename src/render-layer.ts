import Vue from 'vue'
import Component from 'vue-class-component'
import { renderLayerTemplateHtml, renderLayerTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'

@Component({
  render: renderLayerTemplateHtml,
  staticRenderFns: renderLayerTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
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
}

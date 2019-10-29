import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorHoverLayerTemplateHtml, templateEditorHoverLayerTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { selectContentOrTemplateByPosition } from './utils'

@Component({
  render: templateEditorHoverLayerTemplateHtml,
  staticRenderFns: templateEditorHoverLayerTemplateHtmlStatic,
  props: ['canvasState']
})
export class HoverLayer extends Vue {
  private canvasState!: CanvasState

  get canvasStyle() {
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'hidden',
    }
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
      width: this.canvasState.styleGuideWidth + 'px',
      height: this.canvasState.styleGuideHeight + 'px',
    }
  }

  get hoverStyle() {
    const content = selectContentOrTemplateByPosition(this.canvasState, { x: this.canvasState.mappedX, y: this.canvasState.mappedY })
    if (content) {
      const region = content.kind === 'content' ? content.region : content.region.template
      return {
        left: region.x + 'px',
        top: region.y + 'px',
        width: region.width + 'px',
        height: region.height + 'px',
        position: 'absolute',
        backgroundColor: 'green',
        opacity: 0.1,
      }
    }
    return undefined
  }
}

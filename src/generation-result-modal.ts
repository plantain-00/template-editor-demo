import Vue from 'vue'
import Component from 'vue-class-component'
import { generationResultModalTemplateHtml, generationResultModalTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { renderTemplate } from './renderer'

@Component({
  render: generationResultModalTemplateHtml,
  staticRenderFns: generationResultModalTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class GenerationResultModal extends Vue {
  private canvasState!: CanvasState

  modalStyle = {
    position: 'absolute',
    width: this.canvasState.canvasWidth + 'px',
    left: '0px',
    top: '0px',
    backgroundColor: 'white',
  }

  get result() {
    if (!this.canvasState.generationResult) {
      return ''
    }
    return renderTemplate(this.canvasState.generationResult, [])
  }

  clear() {
    this.canvasState.generationResult = null
  }
}

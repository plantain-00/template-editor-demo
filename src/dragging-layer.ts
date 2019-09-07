import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { draggingLayerTemplateHtml, draggingLayerTemplateHtmlStatic } from './variables'

@Component({
  render: draggingLayerTemplateHtml,
  staticRenderFns: draggingLayerTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class DraggingLayer extends Vue {
  canvasState!: CanvasState

  get draggingAreaStyle() {
    return {
      position: 'absolute',
      border: '1px dashed black',
      left: Math.min(this.canvasState.mousedownX, this.canvasState.mouseupX) + 'px',
      top: Math.min(this.canvasState.mousedownY, this.canvasState.mouseupY) + 'px',
      width: Math.abs(this.canvasState.mousedownX - this.canvasState.mouseupX) + 'px',
      height: Math.abs(this.canvasState.mousedownY - this.canvasState.mouseupY) + 'px',
    }
  }
}

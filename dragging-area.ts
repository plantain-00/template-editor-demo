import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { draggingAreaTemplateHtml, draggingAreaTemplateHtmlStatic } from './variables'

@Component({
  render: draggingAreaTemplateHtml,
  staticRenderFns: draggingAreaTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class DraggingArea extends Vue {
  private canvasState!: CanvasState

  public get draggingAreaStyle() {
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

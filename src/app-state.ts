import Vue from 'vue'
import Component from 'vue-class-component'

import { Template } from './model'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'

const offsetWidth = 300
const offsetHeight = 50

@Component
export class AppState extends Vue {
  templateModel: { [key: string]: unknown } = {
    categories: []
  }
  templateModelEditorVisible = false

  canvasState = CanvasState.create(styleGuide, window.innerWidth - offsetWidth, window.innerHeight - offsetHeight)
  graphicCanvasState: CanvasState | null = null

  resize() {
    this.canvasState.canvasWidth = window.innerWidth - offsetWidth
    this.canvasState.canvasHeight = window.innerHeight - offsetHeight
    this.canvasState.applyCanvasSizeChange()

    if (this.graphicCanvasState) {
      this.graphicCanvasState.canvasWidth = window.innerWidth - offsetWidth
      this.graphicCanvasState.canvasHeight = window.innerHeight - offsetHeight
      this.graphicCanvasState.applyCanvasSizeChange()
    }
  }

  loadGraphicCanvas(template: Template) {
    this.graphicCanvasState = CanvasState.create({
      name: '',
      templates: [template],
    }, window.innerWidth - offsetWidth, window.innerHeight - offsetHeight)
  }
}

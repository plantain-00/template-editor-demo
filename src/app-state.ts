import { reactive } from 'vue'

import { Template } from './model'
import { styleGuide } from './data'
import { CanvasState, createCanvasState } from './template-editor/canvas-state'
import { layerPanelWidth, operationPanelWidth } from './template-editor/template-editor'

const offsetWidth = layerPanelWidth + operationPanelWidth
const offsetHeight = 50

export function createAppState() {
  return reactive({
    templateModel: {
      categories: []
    } as { [key: string]: unknown },
    templateModelEditorVisible: false,

    canvasState: createCanvasState(styleGuide, window.innerWidth - offsetWidth, window.innerHeight - offsetHeight),
    graphicCanvasState: null as CanvasState | null,

    resize() {
      this.canvasState.canvasWidth = window.innerWidth - offsetWidth
      this.canvasState.canvasHeight = window.innerHeight - offsetHeight
      this.canvasState.applyCanvasSizeChange()

      if (this.graphicCanvasState) {
        this.graphicCanvasState.canvasWidth = window.innerWidth - offsetWidth
        this.graphicCanvasState.canvasHeight = window.innerHeight - offsetHeight
        this.graphicCanvasState.applyCanvasSizeChange()
      }
    },

    loadGraphicCanvas(templates: Template[]) {
      this.graphicCanvasState = createCanvasState({
        name: '',
        templates,
      }, window.innerWidth - offsetWidth, window.innerHeight - offsetHeight)
      this.graphicCanvasState.selection = {
        kind: 'template',
        template: templates[0]
      }
    }
  })
}

export type AppState = ReturnType<typeof createAppState>

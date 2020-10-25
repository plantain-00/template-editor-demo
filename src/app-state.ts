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

    debug: !!localStorage.getItem('debug'),

    resize() {
      this.canvasState.viewport.width = window.innerWidth - offsetWidth
      this.canvasState.viewport.height = window.innerHeight - offsetHeight
      this.canvasState.applyCanvasSizeChange()

      if (this.graphicCanvasState) {
        this.graphicCanvasState.viewport.width = window.innerWidth - offsetWidth
        this.graphicCanvasState.viewport.height = window.innerHeight - offsetHeight
        this.graphicCanvasState.applyCanvasSizeChange()
      }
    },

    loadGraphicCanvas(templates: Template[]) {
      this.graphicCanvasState = createCanvasState({
        name: '',
        templates,
      }, window.innerWidth - offsetWidth, window.innerHeight - offsetHeight)
      this.graphicCanvasState.styleGuide.selection = {
        kind: 'template',
        template: templates[0]
      }
    }
  })
}

export type AppState = ReturnType<typeof createAppState>

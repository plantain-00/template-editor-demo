import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'
import { MaskLayer } from './mask-layer'
import { OperationPanel } from './operation-panel'
import { DraggingForSelectionLayer } from './dragging-for-selection-layer'
import { RenderLayer } from './render-layer'
import { SelectionLayer } from './selection-layer'
import { ContextMenu } from './context-menu'
import { GenerationResultModal } from './generation-result-modal'
import { TemplateModelEditor } from './template-model-editor'

Vue.component('mask-layer', MaskLayer)
Vue.component('dragging-for-selection-layer', DraggingForSelectionLayer)
Vue.component('render-layer', RenderLayer)
Vue.component('selection-layer', SelectionLayer)

Vue.component('operation-panel', OperationPanel)

Vue.component('context-menu', ContextMenu)
Vue.component('generation-result-modal', GenerationResultModal)
Vue.component('template-model-editor', TemplateModelEditor)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  canvasState = CanvasState.create(styleGuide, window.innerWidth - 300, window.innerHeight)

  mounted() {
    window.addEventListener('resize', () => {
      this.canvasState.canvasWidth = window.innerWidth - 300
      this.canvasState.canvasHeight = window.innerHeight
      this.canvasState.applyCanvasSizeChange()
    })
  }

  get canvasStyle() {
    return {
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px'
    }
  }

  resize(e: unknown) {
    console.info(e)
  }
}

new App({ el: '#container' })

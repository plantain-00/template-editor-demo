import Vue from 'vue'
import Component from 'vue-class-component'
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

Vue.component('mask-layer', MaskLayer)
Vue.component('dragging-for-selection-layer', DraggingForSelectionLayer)
Vue.component('render-layer', RenderLayer)
Vue.component('selection-layer', SelectionLayer)

Vue.component('operation-panel', OperationPanel)

Vue.component('context-menu', ContextMenu)
Vue.component('generation-result-modal', GenerationResultModal)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  canvasState = CanvasState.create(styleGuide)
}

new App({ el: '#container' })

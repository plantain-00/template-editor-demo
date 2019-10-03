import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { MaskLayer } from './mask-layer'
import { OperationPanel } from './operation-panel'
import { AppPanel } from './app-panel'
import { DraggingForSelectionLayer } from './dragging-for-selection-layer'
import { RenderLayer } from './render-layer'
import { SelectionLayer } from './selection-layer'
import { ContextMenu } from './context-menu'
import { TemplateModelEditor } from './template-model-editor'
import { AppState } from './app-state'
import { TemplateEditor } from './template-editor'
import { TemplateRenderer, SymbolRenderer } from './renderer'

Vue.component('mask-layer', MaskLayer)
Vue.component('dragging-for-selection-layer', DraggingForSelectionLayer)
Vue.component('render-layer', RenderLayer)
Vue.component('selection-layer', SelectionLayer)
Vue.component('operation-panel', OperationPanel)
Vue.component('context-menu', ContextMenu)
Vue.component('symbol-renderer', SymbolRenderer)
Vue.component('template-renderer', TemplateRenderer)

Vue.component('app-panel', AppPanel)
Vue.component('template-model-editor', TemplateModelEditor)
Vue.component('template-editor', TemplateEditor)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  appState = new AppState()

  mounted() {
    window.addEventListener('resize', () => {
      this.appState.resize()
    })
  }
}

new App({ el: '#container' })

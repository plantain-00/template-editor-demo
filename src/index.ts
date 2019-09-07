import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'
import { MaskLayer } from './mask-layer'
import { OperationPanel } from './operation-panel'
import { DraggingLayer } from './dragging-layer'
import { RenderLayer } from './render-layer'

Vue.component('mask-layer', MaskLayer)
Vue.component('dragging-layer', DraggingLayer)
Vue.component('render-layer', RenderLayer)

Vue.component('operation-panel', OperationPanel)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  canvasState = CanvasState.create(styleGuide)
}

new App({ el: '#container' })

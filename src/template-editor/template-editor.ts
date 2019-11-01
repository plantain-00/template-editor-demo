import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { templateEditorTemplateEditorTemplateHtml, templateEditorTemplateEditorTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { RenderLayer } from './render-layer'
import { DraggingForSelectionLayer } from './dragging-for-selection-layer'
import { SelectionLayer } from './selection-layer'
import { HoverLayer } from './hover-layer'
import { MaskLayer } from './mask-layer'
import { ContextMenu } from './context-menu'
import { OperationPanel } from './operation-panel'
import { ExpressionInput } from './expression-input'
import { LayerPanel } from './layer-panel'

@Component({
  render: templateEditorTemplateEditorTemplateHtml,
  staticRenderFns: templateEditorTemplateEditorTemplateHtmlStatic,
  props: ['canvasState']
})
export class TemplateEditor extends Vue {
  private canvasState!: CanvasState

  get canvasStyle() {
    return {
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      left: layerPanelWidth + 'px',
      position: 'absolute',
    }
  }

  get layerPanelStyle() {
    return {
      width: layerPanelWidth + 'px',
      left: 0,
      position: 'absolute'
    }
  }

  get operationPanelStyle() {
    return {
      width: operationPanelWidth + 'px',
      right: 0,
      position: 'absolute'
    }
  }
}

export const layerPanelWidth = 200
export const operationPanelWidth = 300

Vue.component('render-layer', RenderLayer)
Vue.component('dragging-for-selection-layer', DraggingForSelectionLayer)
Vue.component('selection-layer', SelectionLayer)
Vue.component('hover-layer', HoverLayer)
Vue.component('mask-layer', MaskLayer)
Vue.component('context-menu', ContextMenu)
Vue.component('operation-panel', OperationPanel)
Vue.component('expression-input', ExpressionInput)
Vue.component('layer-panel', LayerPanel)

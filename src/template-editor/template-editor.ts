import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { templateEditorTemplateEditorTemplateHtml, templateEditorTemplateEditorTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { RenderLayer } from './render-layer'
import { DraggingForSelectionLayer } from './dragging-for-selection-layer'
import { SelectionLayer } from './selection-layer'
import { MaskLayer } from './mask-layer'
import { ContextMenu } from './context-menu'
import { OperationPanel } from './operation-panel'

@Component({
  render: templateEditorTemplateEditorTemplateHtml,
  staticRenderFns: templateEditorTemplateEditorTemplateHtmlStatic,
  props: {
    canvasState: CanvasState,
  }
})
export class TemplateEditor extends Vue {
  private canvasState!: CanvasState

  get canvasStyle() {
    return {
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      position: 'absolute',
    }
  }
}

Vue.component('render-layer', RenderLayer)
Vue.component('dragging-for-selection-layer', DraggingForSelectionLayer)
Vue.component('selection-layer', SelectionLayer)
Vue.component('mask-layer', MaskLayer)
Vue.component('context-menu', ContextMenu)
Vue.component('operation-panel', OperationPanel)

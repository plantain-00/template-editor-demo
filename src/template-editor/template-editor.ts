import { defineComponent, PropType } from 'vue'

import { templateEditorTemplateEditorTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { RenderLayer } from './render-layer'
import { DraggingForSelectionLayer } from './dragging-for-selection-layer'
import { AlignmentLayer } from './alignment-layer'
import { SelectionLayer } from './selection-layer'
import { HoverLayer } from './hover-layer'
import { MaskLayer } from './mask-layer'
import { ContextMenu } from './context-menu'
import { OperationPanel } from './operation-panel'
import { LayerPanel } from './layer-panel'
import { CommonEditor } from './common-editor'

export const TemplateEditor = defineComponent({
  render: templateEditorTemplateEditorTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  components: {
    'render-layer': RenderLayer,
    'dragging-for-selection-layer': DraggingForSelectionLayer,
    'alignment-layer': AlignmentLayer,
    'selection-layer': SelectionLayer,
    'hover-layer': HoverLayer,
    'mask-layer': MaskLayer,
    'context-menu': ContextMenu,
    'operation-panel': OperationPanel,
    'layer-panel': LayerPanel,
    'common-editor': CommonEditor,
  },
  computed: {
    canvasStyle(): { [name: string]: unknown } {
      return {
        width: this.canvasState.canvasWidth + 'px',
        height: this.canvasState.canvasHeight + 'px',
        left: layerPanelWidth + 'px',
        position: 'absolute',
      }
    },
    layerPanelStyle() {
      return {
        width: layerPanelWidth + 'px',
        left: 0,
        position: 'absolute'
      }
    },
    operationPanelStyle() {
      return {
        width: operationPanelWidth + 'px',
        right: 0,
        position: 'absolute'
      }
    }
  }
})

export const layerPanelWidth = 200
export const operationPanelWidth = 300

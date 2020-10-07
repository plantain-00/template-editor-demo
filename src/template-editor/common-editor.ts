import { defineComponent, PropType } from 'vue'
import { templateEditorCommonEditorTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { operationPanelWidth } from './template-editor'

export const CommonEditor = defineComponent({
  render: templateEditorCommonEditorTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  data: (props) => {
    return {
      editorStyle: {
        position: 'absolute',
        right: operationPanelWidth + 'px',
        left: '0px',
        top: '50px',
        backgroundColor: 'white',
        zIndex: 1,
        height: props.canvasState.canvasHeight + 'px',
        overflow: 'auto',
      }
    }
  },
  computed: {
    value(): string {
      return JSON.stringify(this.canvasState.styleGuide[this.canvasState.commonEditorEditingFieldName] || [], null, 2)
    }
  },
  methods: {
    changeValue(e: { target: { value: string } }) {
      try {
        this.canvasState.styleGuide[this.canvasState.commonEditorEditingFieldName] = JSON.parse(e.target.value)
      } catch {
        // do nothing
      }
    }
  }
})

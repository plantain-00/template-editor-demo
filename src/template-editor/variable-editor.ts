import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorVariableEditorTemplateHtml, templateEditorVariableEditorTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { operationPanelWidth } from './template-editor'

@Component({
  render: templateEditorVariableEditorTemplateHtml,
  staticRenderFns: templateEditorVariableEditorTemplateHtmlStatic,
  props: ['canvasState'],
})
export class VariableEditor extends Vue {
  private canvasState!: CanvasState
  
  editorStyle = {
    position: 'absolute',
    right: operationPanelWidth + 'px',
    left: '0px',
    top: '50px',
    backgroundColor: 'white',
    zIndex: 1,
    height: this.canvasState.canvasHeight + 'px',
    overflow: 'auto',
  }

  get variable() {
    return JSON.stringify(this.canvasState.styleGuide.variables || {}, null, 2)
  }

  changeVariable(e: { target: { value: string } }) {
    try {
      this.canvasState.styleGuide.variables = JSON.parse(e.target.value)
    } catch (error) {
      // do nothing
    }
  }
}

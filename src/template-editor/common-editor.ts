import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorCommonEditorTemplateHtml, templateEditorCommonEditorTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { operationPanelWidth } from './template-editor'

@Component({
  render: templateEditorCommonEditorTemplateHtml,
  staticRenderFns: templateEditorCommonEditorTemplateHtmlStatic,
  props: ['canvasState'],
})
export class CommonEditor extends Vue {
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

  get value() {
    return JSON.stringify(this.canvasState.styleGuide[this.canvasState.commonEditorEditingFieldName] || [], null, 2)
  }

  changeValue(e: { target: { value: string } }) {
    try {
      this.canvasState.styleGuide[this.canvasState.commonEditorEditingFieldName] = JSON.parse(e.target.value)
    } catch (error) {
      // do nothing
    }
  }
}

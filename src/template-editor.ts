import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { templateEditorTemplateHtml, templateEditorTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'

@Component({
  render: templateEditorTemplateHtml,
  staticRenderFns: templateEditorTemplateHtmlStatic,
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

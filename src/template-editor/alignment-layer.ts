import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { templateEditorAlignmentLayerTemplateHtml, templateEditorAlignmentLayerTemplateHtmlStatic } from '../variables'

@Component({
  render: templateEditorAlignmentLayerTemplateHtml,
  staticRenderFns: templateEditorAlignmentLayerTemplateHtmlStatic,
  props: ['canvasState']
})
export class AlignmentLayer extends Vue {
  canvasState!: CanvasState

  get xStyle() {
    if (this.canvasState.xAlignment === null) {
      return {}
    }
    return {
      position: 'absolute',
      borderLeft: '1px dashed black',
      left: this.canvasState.mapBackX(this.canvasState.xAlignment) + 'px',
      top: '0px',
      width: '1px',
      height: '100%',
    }
  }

  get yStyle() {
    if (this.canvasState.yAlignment === null) {
      return {}
    }
    return {
      position: 'absolute',
      borderTop: '1px dashed black',
      top: this.canvasState.mapBackY(this.canvasState.yAlignment) + 'px',
      left: '0px',
      width: '100%',
      height: '1px%',
    }
  }
}

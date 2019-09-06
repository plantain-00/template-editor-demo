import Vue from 'vue'
import Component from 'vue-class-component'
import { editorPanelTemplateHtml, editorPanelTemplateHtmlStatic } from './variables'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'

@Component({
  render: editorPanelTemplateHtml,
  staticRenderFns: editorPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class EditorPanel extends Vue {
  canvasState = CanvasState.create(styleGuide)

  changeText(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.text = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }

  changeImageUrl(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      this.canvasState.selection.content.url = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }
}

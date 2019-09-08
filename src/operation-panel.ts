import Vue from 'vue'
import Component from 'vue-class-component'
import { operationPanelTemplateHtml, operationPanelTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'

@Component({
  render: operationPanelTemplateHtml,
  staticRenderFns: operationPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class OperationPanel extends Vue {
  canvasState!: CanvasState

  changeX(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content.x = +e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.x = +e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeY(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content.y = +e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.y = +e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeWidth(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      this.canvasState.selection.content.width = +e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.width = +e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeHeight(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      this.canvasState.selection.content.height = +e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.height = +e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeText(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.text = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }

  changeFontFamily(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontFamily = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }

  changeFontSize(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontSize = +e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }

  changeColor(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.color = e.target.value
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

  debug() {
    console.info(this.canvasState)
  }

  addTemplate() {
    this.canvasState.addKind = 'template'
  }
}

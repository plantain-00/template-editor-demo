import Vue from 'vue'
import Component from 'vue-class-component'

import { operationPanelTemplateHtml, operationPanelTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { generate } from './template-engine'
import { StyleGuide } from './model'

@Component({
  render: operationPanelTemplateHtml,
  staticRenderFns: operationPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class OperationPanel extends Vue {
  canvasState!: CanvasState
  styleGuideKey = 'kfc.json'
  templateModelKey = 'kfc-model.json'

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

  changeXExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content.xExpression = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeYExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content.yExpression = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeWidthExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      this.canvasState.selection.content.widthExpression = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.widthExpression = e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeHeightExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      this.canvasState.selection.content.heightExpression = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template.heightExpression = e.target.value
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeIf(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      this.canvasState.selection.content.if = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeRepeat(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      this.canvasState.selection.content.repeat = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
    }
    this.canvasState.applyChangesIfAuto()
  }

  changeProps(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      this.canvasState.selection.content.props = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
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

  changeTextExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.textExpression = e.target.value
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
    if (this.canvasState.selection.kind === 'none') {
      console.info(this.canvasState)
    } else {
      console.info(this.canvasState.selection)
    }
  }

  addTemplate() {
    this.canvasState.addKind = 'template'
  }

  addImage() {
    this.canvasState.addKind = 'image'
  }

  addText() {
    this.canvasState.addKind = 'text'
  }

  async loadStyleGuide() {
    if (this.styleGuideKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`)
      const json: StyleGuide = await res.json()
      this.canvasState.styleGuide = json
      this.canvasState.applyChangesIfAuto()
    }
  }

  async saveStyleGuide() {
    if (this.styleGuideKey) {
      await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.canvasState.styleGuide)
      })
    }
  }

  async loadTemplateModel() {
    if (this.templateModelKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.templateModelKey}`)
      const json: { [key: string]: unknown } = await res.json()
      this.canvasState.templateModel = json
      this.canvasState.applyChangesIfAuto()
    }
  }

  async saveTemplateModel() {
    if (this.templateModelKey) {
      await fetch(`https://storage.yorkyao.xyz/${this.templateModelKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.canvasState.templateModel)
      })
    }
  }

  editTemplateModel() {
    this.canvasState.templateModelEditorVisible = !this.canvasState.templateModelEditorVisible
  }

  generate() {
    if (this.canvasState.selection.kind === 'template') {
      this.canvasState.generationResult = generate(this.canvasState.selection.template, this.canvasState.styleGuide, this.canvasState.templateModel)
    }
  }
}

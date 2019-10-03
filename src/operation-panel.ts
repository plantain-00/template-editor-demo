import Vue from 'vue'
import Component from 'vue-class-component'

import { operationPanelTemplateHtml, operationPanelTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from './model'
import { renderTemplate, loadTemplateImages } from './renderer'

@Component({
  render: operationPanelTemplateHtml,
  staticRenderFns: operationPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class OperationPanel extends Vue {
  canvasState!: CanvasState

  get panelStyle() {
    return {
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'auto',
    }
  }

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

  changeHidden(e: { target: { checked: boolean } }) {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content.hidden = e.target.checked
      this.canvasState.changedContents.add(this.canvasState.selection.content)
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
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
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

  changeFontSizeExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontSizeExpression = e.target.value
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

  changeImageUrlExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      this.canvasState.selection.content.urlExpression = e.target.value
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

  selectContent(content: TemplateContent) {
    if (this.canvasState.selection.kind !== 'none') {
      this.canvasState.selection = {
        kind: 'content',
        content,
        template: this.canvasState.selection.template
      }
    }
  }

  extractAsSymbol() {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'text'
        || this.canvasState.selection.content.kind === 'image')) {
      const id = Math.random().toString()
      const content = this.canvasState.selection.content
      const newTemplate: Template = {
        id,
        contents: [
          {
            ...content,
            x: 0,
            y: 0,
          }
        ],
        x: 0,
        y: 0,
        width: content.width,
        height: content.height,
      }
      this.canvasState.styleGuide.templates.push(newTemplate)

      const index = this.canvasState.selection.template.contents.findIndex((c) => c === content)
      if (index >= 0) {
        this.canvasState.selection.template.contents[index] = {
          kind: 'reference',
          id,
          x: content.x,
          y: content.y,
        }
      }

      this.canvasState.selection = {
        kind: 'template',
        template: newTemplate,
      }
      this.canvasState.applyChangesIfAuto()
    }
  }

  private imageUrl = ''

  async renderToImage() {
    if (this.canvasState.selection.kind === 'template') {
      const images = await loadTemplateImages(this.canvasState.selection.template, this.canvasState.styleGuide.templates)
      const url = renderTemplate(this.canvasState.selection.template, this.canvasState.styleGuide.templates, images)
      this.imageUrl = url
    }
  }
}

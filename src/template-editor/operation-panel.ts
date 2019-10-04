import Vue from 'vue'
import Component from 'vue-class-component'

import { templateEditorOperationPanelTemplateHtml, templateEditorOperationPanelTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'
import { renderTemplate, loadTemplateImages } from '../engine/renderer'
import { getCharacters } from '../engine/mock'

@Component({
  render: templateEditorOperationPanelTemplateHtml,
  staticRenderFns: templateEditorOperationPanelTemplateHtmlStatic,
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

  changePosition(e: { target: { value: string } }, kind: 'x' | 'y') {
    if (this.canvasState.selection.kind === 'content') {
      this.canvasState.selection.content[kind] = +e.target.value
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template[kind] = +e.target.value
    }
  }

  changeSize(e: { target: { value: string } }, kind: 'width' | 'height') {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      this.canvasState.selection.content[kind] = +e.target.value
    } else if (this.canvasState.selection.kind === 'template') {
      this.canvasState.selection.template[kind] = +e.target.value
    }
  }

  changePositionExpression(e: { target: { value: string } }, kind: 'x' | 'y') {
    if (this.canvasState.selection.kind === 'content') {
      Vue.set(this.canvasState.selection.content, kind + 'Expression', e.target.value)
    }
  }

  changeSizeExpression(e: { target: { value: string } }, kind: 'width' | 'height') {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text')) {
      Vue.set(this.canvasState.selection.content, kind + 'Expression', e.target.value)
    } else if (this.canvasState.selection.kind === 'template') {
      Vue.set(this.canvasState.selection.template, kind + 'Expression', e.target.value)
    }
  }

  changeHidden(e: { target: { checked: boolean } }) {
    if (this.canvasState.selection.kind === 'content') {
      Vue.set(this.canvasState.selection.content, 'hidden', e.target.checked)
    }
  }

  changeIf(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      Vue.set(this.canvasState.selection.content, 'if', e.target.value)
    }
  }

  changeRepeat(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      Vue.set(this.canvasState.selection.content, 'repeat', e.target.value)
    }
  }

  changeProps(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
      Vue.set(this.canvasState.selection.content, 'props', e.target.value)
    }
  }

  changeText(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.text = e.target.value
      this.canvasState.selection.content.characters = getCharacters(e.target.value)
    }
  }

  changeTextExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      Vue.set(this.canvasState.selection.content, 'textExpression', e.target.value)
    }
  }

  changeFontFamily(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontFamily = e.target.value
    }
  }

  changeFontSize(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontSize = +e.target.value
    }
  }

  changeFontSizeExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      Vue.set(this.canvasState.selection.content, 'fontSizeExpression', e.target.value)
    }
  }

  changeColor(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.color = e.target.value
    }
  }

  changeImageUrl(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      this.canvasState.selection.content.url = e.target.value
    }
  }

  changeImageUrlExpression(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      Vue.set(this.canvasState.selection.content, 'urlExpression', e.target.value)
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
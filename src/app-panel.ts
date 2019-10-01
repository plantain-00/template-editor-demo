import Vue from 'vue'
import Component from 'vue-class-component'

import { appPanelTemplateHtml, appPanelTemplateHtmlStatic } from './variables'
import { generate } from './template-engine'
import { StyleGuide } from './model'
import { AppState } from './app-state'

@Component({
  render: appPanelTemplateHtml,
  staticRenderFns: appPanelTemplateHtmlStatic,
  props: {
    appState: AppState,
  }
})
export class AppPanel extends Vue {
  private appState!: AppState
  styleGuideKey = 'kfc.json'
  templateModelKey = 'kfc-model.json'

  async loadStyleGuide() {
    if (this.styleGuideKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`)
      const json: StyleGuide = await res.json()
      this.appState.canvasState.styleGuide = json
      this.appState.canvasState.applyCanvasSizeChange()
    }
  }

  async saveStyleGuide() {
    if (this.styleGuideKey) {
      await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.appState.canvasState.styleGuide)
      })
    }
  }

  async loadTemplateModel() {
    if (this.templateModelKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.templateModelKey}`)
      const json: { [key: string]: unknown } = await res.json()
      this.appState.templateModel = json
      this.appState.canvasState.applyChangesIfAuto()
    }
  }

  async saveTemplateModel() {
    if (this.templateModelKey) {
      await fetch(`https://storage.yorkyao.xyz/${this.templateModelKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.appState.templateModel)
      })
    }
  }

  editTemplateModel() {
    this.appState.templateModelEditorVisible = !this.appState.templateModelEditorVisible
  }

  generate() {
    if (this.appState.graphicCanvasState) {
      this.appState.graphicCanvasState = null
      return
    }
    if (this.appState.canvasState.selection.kind === 'template') {
      this.appState.loadGraphicCanvas(generate(this.appState.canvasState.selection.template, this.appState.canvasState.styleGuide, this.appState.templateModel))
    }
  }
}

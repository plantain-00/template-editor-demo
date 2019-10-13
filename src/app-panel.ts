import Vue from 'vue'
import Component from 'vue-class-component'
import Ajv from 'ajv'

import { appPanelTemplateHtml, appPanelTemplateHtmlStatic, distStyleguideSchemaJson } from './variables'
import { generate, PrecompiledStyleGuide } from './engine/template-engine'
import { StyleGuide } from './model'
import { AppState } from './app-state'

const ajv = new Ajv()
const validateStyleGuide = ajv.compile(distStyleguideSchemaJson)

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
  private precompiledStyleGuide?: PrecompiledStyleGuide

  async loadStyleGuide() {
    if (this.styleGuideKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`)
      const json: StyleGuide = await res.json()
      const valid = validateStyleGuide(json)
      if (valid) {
        this.appState.canvasState.styleGuide = json
        this.appState.canvasState.applyCanvasSizeChange()
      } else {
        console.error(validateStyleGuide.errors)
      }
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

  async generate() {
    if (this.appState.graphicCanvasState) {
      this.appState.graphicCanvasState = null
      return
    }
    if (this.appState.canvasState.selection.kind === 'template') {
      const now = Date.now()
      const result = await generate(this.appState.canvasState.selection.template, this.appState.canvasState.styleGuide, this.appState.templateModel, this.precompiledStyleGuide)
      console.info(Date.now() - now)
      this.appState.loadGraphicCanvas(result)
    }
  }

  precompile() {
    this.precompiledStyleGuide = new PrecompiledStyleGuide(this.appState.canvasState.styleGuide)
  }
}

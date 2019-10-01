import Vue from 'vue'
import Component from 'vue-class-component'

import { appPanelTemplateHtml, appPanelTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { generate } from './template-engine'
import { StyleGuide } from './model'

@Component({
  render: appPanelTemplateHtml,
  staticRenderFns: appPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class AppPanel extends Vue {
  private canvasState!: CanvasState
  styleGuideKey = 'kfc.json'
  templateModelKey = 'kfc-model.json'

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

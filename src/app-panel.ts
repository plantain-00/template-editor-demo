import Vue from 'vue'
import Component from 'vue-class-component'
import Ajv from 'ajv'
import * as jsonpatch from 'fast-json-patch'
import { setWsHeartbeat } from 'ws-heartbeat/client'

import { appPanelTemplateHtml, appPanelTemplateHtmlStatic, distStyleguideSchemaJson } from './variables'
import { generate, PrecompiledStyleGuide } from './engine/template-engine'
import { StyleGuide, Template } from './model'
import { AppState } from './app-state'
import { ExpressionErrorReason } from './engine/expression'
import { getVariableObject } from './utils'

const ajv = new Ajv()
const validateStyleGuide = ajv.compile(distStyleguideSchemaJson)

@Component({
  render: appPanelTemplateHtml,
  staticRenderFns: appPanelTemplateHtmlStatic,
  props: ['appState'],
})
export class AppPanel extends Vue {
  private appState!: AppState
  styleGuideKey = 'kfc.json'
  templateModelKey = 'kfc-model.json'
  private precompiledStyleGuide?: PrecompiledStyleGuide

  private key = ''
  private ws: WebSocket | null = null
  private lastStyleGuide: StyleGuide | null = null

  created() {
    setInterval(() => {
      if (this.ws && this.ws.readyState === this.ws.OPEN && this.lastStyleGuide) {
        const operations = jsonpatch.compare(this.lastStyleGuide, this.appState.canvasState.styleGuide)
        if (operations.length > 0) {
          this.ws.send(JSON.stringify({ method: 'patch', operations }))
          this.lastStyleGuide = jsonpatch.deepClone(this.appState.canvasState.styleGuide)
        }
      }
    }, 3000)
  }

  async loadStyleGuide() {
    if (this.styleGuideKey) {
      const res = await fetch(`https://storage.yorkyao.xyz/${this.styleGuideKey}`)
      const json: StyleGuide = await res.json()
      const valid = validateStyleGuide(json)
      if (valid) {
        if (this.key !== this.styleGuideKey) {
          if (this.ws) {
            this.ws.onmessage = null
            this.ws.close()
          }
          this.key = this.styleGuideKey
          this.ws = new WebSocket(`wss://storage.yorkyao.xyz/ws/template-editor-demo?key=${this.key}`)
          setWsHeartbeat(this.ws, '{"method":"ping"}')
          this.ws.onmessage = (data) => {
            if (typeof data.data === 'string' && data.data) { // type-coverage:ignore-line
              const json = JSON.parse(data.data) as {
                method: 'patch'
                operations: jsonpatch.Operation[]
              }
              if (json.method == 'patch') {
                jsonpatch.applyPatch(this.appState.canvasState.styleGuide, json.operations)
                this.lastStyleGuide = jsonpatch.deepClone(this.appState.canvasState.styleGuide)
              }
            }
          }
        }
        this.lastStyleGuide = jsonpatch.deepClone(json)
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
      const result = await this.generateByTemplate(this.appState.canvasState.selection.template)
      this.appState.loadGraphicCanvas(result)
    }
  }

  private async generateByTemplate(template: Template) {
    const styleGuide = this.appState.canvasState.styleGuide
    const now = Date.now()
    const reasons: ExpressionErrorReason[] = []
    let result: Template[]
    if (styleGuide.variables && styleGuide.variables.length > 0) {
      result = await Promise.all(styleGuide.variables.map(v => generate(
        template,
        styleGuide,
        {
          ...this.appState.templateModel,
          variable: getVariableObject(v),
        },
        {
          errorHandler: (reason) => reasons.push(reason),
          precompiledStyleGuide: this.precompiledStyleGuide,
          stack: [template.name || template.id]
        }
      )))

      let x = 0
      for (let i = 0; i < result.length; i++) {
        result[i].x = x
        x += result[i].width + 10
      }
    } else {
      result = [
        await generate(
          template,
          styleGuide,
          this.appState.templateModel,
          {
            errorHandler: (reason) => reasons.push(reason),
            precompiledStyleGuide: this.precompiledStyleGuide,
            stack: [template.name || template.id]
          }
        )
      ]
    }
    console.info(Date.now() - now)
    for (const reason of reasons) {
      console.info(reason.stack ? reason.stack.join(' ') : '', reason.expression, reason.error.message, reason.model)
    }
    return result
  }

  precompile() {
    this.precompiledStyleGuide = new PrecompiledStyleGuide(this.appState.canvasState.styleGuide)
  }

  async runTests() {
    const tests = this.appState.canvasState.styleGuide.tests
    if (tests) {
      for (const test of tests) {
        const template = this.appState.canvasState.styleGuide.templates.find((t) => t.id === test.templateId)
        if (template) {
          const result = await this.generateByTemplate(template)
          if (!test.result) {
            test.result = result
          } else {
            const operations = jsonpatch.compare(test.result, result)
            if (operations.length > 0) {
              console.info(operations)
            }
          }
        }
      }
    }
  }
}

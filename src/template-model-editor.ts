import Vue from 'vue'
import Component from 'vue-class-component'
import { templateModelEditorTemplateHtml, templateModelEditorTemplateHtmlStatic } from './variables'
import { AppState } from './app-state'

@Component({
  render: templateModelEditorTemplateHtml,
  staticRenderFns: templateModelEditorTemplateHtmlStatic,
  props: ['appState'],
})
export class TemplateModelEditor extends Vue {
  private appState!: AppState
  schema = {
    type: 'object',
    properties: {
      categories: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            id: {
              type: 'string'
            },
            commodities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  id: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  image: {
                    type: 'string',
                  },
                  prices: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },
                required: ['id', 'name', 'prices', 'description', 'image'],
                collapsed: true
              }
            }
          },
          required: ['id', 'name', 'commodities'],
          collapsed: true
        }
      }
    },
    required: ['categories']
  }

  editorStyle = {
    position: 'absolute',
    right: '0px',
    left: '0px',
    top: '50px',
    backgroundColor: 'white',
    zIndex: 1,
    height: this.appState.canvasState.canvasHeight + 'px',
    overflow: 'auto',
  }

  updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
    if (value.isValid) {
      this.appState.templateModel = value.value
    }
  }

  get templateModel() {
    return JSON.stringify(this.appState.templateModel, null, 2)
  }

  changeTemplateModel(e: { target: { value: string } }) {
    try {
      this.appState.templateModel = JSON.parse(e.target.value)
    } catch {
      // do nothing
    }
  }

  addAsTestCase() {
    if (this.appState.canvasState.selection.kind === 'template') {
      if (!this.appState.canvasState.styleGuide.tests) {
        this.appState.canvasState.styleGuide.tests = []
      }
      this.appState.canvasState.styleGuide.tests.push({
        templateId: this.appState.canvasState.selection.template.id,
        case: JSON.parse(JSON.stringify(this.appState.templateModel)) as unknown
      })
    }
  }
}

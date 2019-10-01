import Vue from 'vue'
import Component from 'vue-class-component'
import { templateModelEditorTemplateHtml, templateModelEditorTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { AppState } from './app-state'

@Component({
  render: templateModelEditorTemplateHtml,
  staticRenderFns: templateModelEditorTemplateHtmlStatic,
  props: {
    canvasState: CanvasState,
    appState: AppState,
  }
})
export class TemplateModelEditor extends Vue {
  private canvasState!: CanvasState
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
                required: ['id', 'name', 'prices','description', 'image'],
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
    height: this.canvasState.canvasHeight + 'px',
    overflow: 'auto',
  }

  updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
    if (value.isValid) {
      this.appState.templateModel = value.value
    }
  }
}

import Vue from 'vue'
import Component from 'vue-class-component'
import { templateModelEditorTemplateHtml, templateModelEditorTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'

@Component({
  render: templateModelEditorTemplateHtml,
  staticRenderFns: templateModelEditorTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class TemplateModelEditor extends Vue {
  private canvasState!: CanvasState
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
    width: '1200px',
    left: '210px',
    top: '10px',
    backgroundColor: 'white',
  }

  updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
    if (value.isValid) {
      this.canvasState.templateModel = value.value
    }
  }
}

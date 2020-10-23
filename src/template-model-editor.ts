import { defineComponent, PropType } from 'vue'
import { ArrayEditor, ObjectEditor, JSONEditor } from 'vue-schema-based-json-editor'
import { templateModelEditorTemplateHtml } from './variables'
import { AppState } from './app-state'

export const TemplateModelEditor = defineComponent({
  render: templateModelEditorTemplateHtml,
  props: {
    appState: {
      type: Object as PropType<AppState>,
      required: true,
    }
  },
  components: {
    'array-editor': ArrayEditor,
    'object-editor': ObjectEditor,
    'json-editor': JSONEditor,
  },
  data: (props) => {
    return {
      schema: {
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
      },
      editorStyle: {
        position: 'absolute',
        right: '0px',
        left: '0px',
        top: '50px',
        backgroundColor: 'white',
        zIndex: 1,
        height: props.appState.canvasState.viewport.height + 'px',
        overflow: 'auto',
      }
    }
  },
  computed: {
    templateModel(): string {
      return JSON.stringify(this.appState.templateModel, null, 2)
    }
  },
  methods: {
    updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
      if (value.isValid) {
        this.appState.templateModel = value.value
      }
    },
    changeTemplateModel(e: { target: { value: string } }) {
      try {
        this.appState.templateModel = JSON.parse(e.target.value)
      } catch {
        // do nothing
      }
    },
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
})

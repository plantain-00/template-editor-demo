import { defineComponent, PropType } from 'vue'
import { Expression, printExpression, parseExpression, tokenizeExpression } from 'expression-engine'

import { templateEditorExpressionEditorTemplateHtml } from '../variables'
import { expressionEditorSchema } from './expression-editor-schema'
import { CanvasState } from './canvas-state'

export const ExpressionEditor = defineComponent({
  render: templateEditorExpressionEditorTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    },
    expression: {
      type: String,
      required: true,
    }
  },
  computed: {
    ast(): Expression | undefined {
      if (this.expression) {
        return parseExpression(tokenizeExpression(this.expression))
      }
      return undefined
    }
  },
  data: (props) => {
    return {
      schema: expressionEditorSchema,
      editorStyle: {
        position: 'fixed',
        right: '300px',
        left: '0px',
        top: '50px',
        backgroundColor: 'white',
        zIndex: 1,
        height: props.canvasState.canvasHeight + 'px',
        overflow: 'auto',
      }
    }
  },
  methods: {
    updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
      if (value.isValid) {
        const expression = printExpression(value.value as unknown as Expression)
        if (expression !== this.expression) {
          this.$emit('change', expression)
        }
      }
    }
  }
})

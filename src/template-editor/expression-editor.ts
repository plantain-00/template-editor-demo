import Vue from 'vue'
import Component from 'vue-class-component'
import { Expression, printExpression, parseExpression, tokenizeExpression } from 'expression-engine'

import { templateEditorExpressionEditorTemplateHtml, templateEditorExpressionEditorTemplateHtmlStatic } from '../variables'
import { expressionEditorSchema } from './expression-editor-schema'
import { CanvasState } from './canvas-state'

@Component({
  render: templateEditorExpressionEditorTemplateHtml,
  staticRenderFns: templateEditorExpressionEditorTemplateHtmlStatic,
  props: ['canvasState', 'expression']
})
export class ExpressionEditor extends Vue {
  private canvasState!: CanvasState
  private expression!: string
  private get ast() {
    if (this.expression) {
      return parseExpression(tokenizeExpression(this.expression))
    }
    return undefined
  }

  schema = expressionEditorSchema

  editorStyle = {
    position: 'fixed',
    right: '300px',
    left: '0px',
    top: '50px',
    backgroundColor: 'white',
    zIndex: 1,
    height: this.canvasState.canvasHeight + 'px',
    overflow: 'auto',
  }

  updateValue(value: { isValid: boolean, value: { [key: string]: unknown } }) {
    if (value.isValid) {
      const expression = printExpression(value.value as unknown as Expression)
      if (expression !== this.expression) {
        this.$emit('change', expression)
      }
    }
  }
}

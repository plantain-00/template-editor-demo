import { defineComponent, h, PropType, VNode } from 'vue'
import { tokenizeExpression, Token } from 'expression-engine'

import { CanvasState } from './canvas-state'
import { PresetExpression } from '../model'
import { ExpressionEditor } from './expression-editor'

export const ExpressionInput = defineComponent({
  props: {
    literal: [String, Number] as PropType<unknown>,
    literalType: String as PropType<'string' | 'number' | 'color'>,
    expression: String,
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    },
    expressionId: String
  },
  components: {
    'expression-editor': ExpressionEditor,
  },
  data: () => {
    return {
      editingAst: false
    }
  },
  computed: {
    id(): string {
      return this.expressionId || ''
    },
    presetExpression(): PresetExpression | undefined {
      if (this.id) {
        return this.canvasState.presetExpressions.find((p) => p.id === this.id)
      }
      return undefined
    },
    currentTokens(): Token[] {
      if (this.expression) {
        return tokenizeExpression(this.expression)
      }
      return []
    },
  },
  render(): VNode {
    const input = this.renderInput()
    let type: string
    if (this.id) {
      type = this.id
    } else if (this.expression !== undefined || !this.literalType) {
      type = 'f(x)'
    } else {
      type = 'literal'
    }
    const typeOptions = this.renderTypeOptions()
    return h(
      'span',
      [
        h(
          'select',
          {
            value: type,
            onChange: (e: { target: { value: string } }) => {
              const id = e.target.value
              if (id === 'literal') {
                this.emitChange({})
              } else if (id === 'f(x)') {
                this.emitChange({
                  expression: this.expression || '',
                })
              } else {
                const presetExpression = this.canvasState.presetExpressions.find((p) => p.id === id)
                if (presetExpression) {
                  if (this.expression && matchPattern(presetExpression, this.currentTokens)) {
                    this.emitChange({
                      expression: this.expression,
                      expressionId: id,
                    })
                  } else {
                    this.emitChange({
                      expression: presetExpression.expression,
                      expressionId: id,
                    })
                  }
                }
              }
            },
          },
          typeOptions
        ),
        h(
          'div',
          {
            style: {
              marginLeft: '20px'
            }
          },
          input
        ),
      ]
    )
  },
  methods: {
    emitChange(value: ExpressionInputChangeData) {
      this.$emit('change', value)
    },
    renderTypeOptions() {
      const options: VNode[] = []
      if (this.literalType) {
        options.push(
          h(
            'option',
            {
              key: 'literal',
              value: 'literal'
            },
            'literal'
          )
        )
      }
      options.push(
        h(
          'option',
          {
            key: 'f(x)',
            value: 'f(x)'
          },
          'f(x)'
        ),
        ...this.canvasState.presetExpressions.map((p) => h(
          'option',
          {
            key: p.id,
            value: p.id
          },
          p.name
        ))
      )
      return options
    },
    renderInput() {
      let input: (string | VNode)[]
      const presetExpression = this.presetExpression
      if (presetExpression && presetExpression.variables.every((v) => typeof v === 'string' || v.tokenIndex < this.currentTokens.length)) {
        input = presetExpression.variables.map((v) => {
          if (typeof v === 'string') {
            return h(
              'span',
              v
            )
          }
          const currentToken = this.currentTokens[v.tokenIndex]
          if (currentToken.type === 'NumericLiteral') {
            return h(
              'input',
              {
                type: 'number',
                value: currentToken.value,
                style: {
                  width: '50px',
                },
                onChange: (e: { target: { value: string } }) => {
                  const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range, '0')
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            )
          }
          if (currentToken.type === 'StringLiteral') {
            return h(
              'input',
              {
                type: 'text',
                value: currentToken.value,
                onChange: (e: { target: { value: string } }) => {
                  const newExpression = replaceStringToken(presetExpression.expression, e.target.value, currentToken.range)
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            )
          }
          if (currentToken.type === 'Identifier') {
            if (v.enum || v.internal) {
              let enums: (string | { value: string, name: string })[]
              if (v.internal === 'component parameters' && (this.canvasState.selection.kind === 'content' || this.canvasState.selection.kind === 'template')) {
                enums = this.canvasState.selection.template.parameters || []
              } else if (v.internal === 'variable') {
                const variables = this.canvasState.styleGuide.variables?.[0]
                enums = variables ? variables.map((v) => ({
                  value: v.name,
                  name: v.displayName || v.name,
                })) : []
              } else if (v.enum) {
                enums = v.enum
              } else {
                enums = []
              }
              return h(
                'select',
                {
                  value: currentToken.name,
                  onChange: (e: { target: { value: string } }) => {
                    const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range, 'a')
                    this.emitChange({
                      expression: newExpression,
                      expressionId: this.expressionId,
                    })
                  }
                },
                enums.map((p) => {
                  const name = typeof p === 'string' ? p : p.name
                  const value = typeof p === 'string' ? p : p.value
                  return h(
                    'option',
                    {
                      key: value,
                      value
                    },
                    name
                  )
                })
              )
            }
            return h(
              'input',
              {
                type: 'text',
                value: currentToken.name,
                onChange: (e: { target: { value: string } }) => {
                  const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range, 'a')
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            )
          }
          return ''
        })
      } else if (this.expression !== undefined || !this.literalType) {
        input = [
          h(
            'input',
            {
              type: 'text',
              value: this.expression,
              onChange: (e: { target: { value: string } }) => {
                this.emitChange({
                  expression: e.target.value,
                })
              }
            }
          ),
          h(
            'button',
            {
              onClick: () => {
                this.editingAst = !this.editingAst
              }
            },
            'ast'
          )
        ]
        if (this.editingAst) {
          input.push(
            h(
              'expression-editor',
              {
                props: {
                  canvasState: this.canvasState,
                  expression: this.expression
                },
                onChange: (value: string) => {
                  this.emitChange({
                    expression: value,
                  })
                }
              }
            )
          )
        }
      } else {
        input = [
          h(
            'input',
            {
              type: this.literalType,
              value: this.literal,
              onChange: (e: { target: { value: string } }) => {
                this.emitChange({
                  literal: e.target.value,
                })
              }
            }
          )
        ]
      }
      return input
    }
  }
})

function matchPattern(presetExpression: PresetExpression, currentTokens: Token[]) {
  const tokens = tokenizeExpression(presetExpression.expression)
  if (tokens.length !== currentTokens.length) {
    return false
  }
  const tokenIndexes: number[] = []
  for (const v of presetExpression.variables) {
    if (typeof v !== 'string') {
      tokenIndexes.push(v.tokenIndex)
    }
  }
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const currentToken = currentTokens[i]
    if (token.type !== currentToken.type) {
      return false
    }
    if (!tokenIndexes.includes(i)) {
      if (token.type === 'Identifier' && currentToken.type === 'Identifier' && token.name !== currentToken.name) {
        return false
      }
      if (token.type === 'BooleanLiteral' && currentToken.type === 'BooleanLiteral' && token.value !== currentToken.value) {
        return false
      }
      if (token.type === 'KeywordToken' && currentToken.type === 'KeywordToken' && token.name !== currentToken.name) {
        return false
      }
      if (token.type === 'NumericLiteral' && currentToken.type === 'NumericLiteral' && token.value !== currentToken.value) {
        return false
      }
      if (token.type === 'PunctuatorToken' && currentToken.type === 'PunctuatorToken' && token.value !== currentToken.value) {
        return false
      }
      if (token.type === 'StringLiteral' && currentToken.type === 'StringLiteral' && token.value !== currentToken.value) {
        return false
      }
    }
  }
  return true
}

function replaceNonStringToken(expression: string, value: string, range: [number, number], defaultValue: string) {
  return expression.substring(0, range[0])
    + (value || defaultValue)
    + expression.substring(range[1])
}

function replaceStringToken(expression: string, value: string, range: [number, number]) {
  return expression.substring(0, range[0] + 1)
    + value
    + expression.substring(range[1] - 1)
}

export interface ExpressionInputChangeData {
  literal?: string
  expression?: string
  expressionId?: string
}

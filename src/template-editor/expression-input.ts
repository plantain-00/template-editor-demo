import Vue from 'vue'
import Component from 'vue-class-component'
import { tokenizeExpression, Token } from 'expression-engine'

import { CanvasState } from './canvas-state'
import { PresetExpression } from '../model'

@Component({
  props: ['literal', 'literalType', 'expression', 'expressionId', 'canvasState']
})
export class ExpressionInput extends Vue {
  literal?: unknown
  literalType?: 'string' | 'number' | 'color'
  expression?: string
  canvasState!: CanvasState
  expressionId?: string

  private get id() {
    return this.expressionId || ''
  }

  private get presetExpression() {
    if (this.id) {
      return this.canvasState.presetExpressions.find((p) => p.id === this.id)
    }
    return undefined
  }

  private get currentTokens() {
    if (this.expression) {
      return tokenizeExpression(this.expression)
    }
    return []
  }

  private emitChange(value: ExpressionInputChangeData) {
    this.$emit('change', value)
  }

  render(createElement: Vue.CreateElement): Vue.VNode {
    const input = this.renderInput(createElement)
    let type: string
    if (this.id) {
      type = this.id
    } else if (this.expression !== undefined || !this.literalType) {
      type = 'f(x)'
    } else {
      type = 'literal'
    }
    const typeOptions = this.renderTypeOptions(createElement)
    return createElement(
      'span',
      [
        createElement(
          'select',
          {
            domProps: {
              value: type,
            },
            on: {
              change: (e: { target: { value: string } }) => {
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
            }
          },
          typeOptions
        ),
        createElement(
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
  }

  private renderTypeOptions(createElement: Vue.CreateElement) {
    const options: Vue.VNode[] = []
    if (this.literalType) {
      options.push(
        createElement(
          'option',
          {
            key: 'literal',
            attrs: {
              value: 'literal'
            }
          },
          'literal'
        )
      )
    }
    options.push(
      createElement(
        'option',
        {
          key: 'f(x)',
          attrs: {
            value: 'f(x)'
          }
        },
        'f(x)'
      ),
      ...this.canvasState.presetExpressions.map((p) => createElement(
        'option',
        {
          key: p.id,
          attrs: {
            value: p.id
          }
        },
        p.name
      ))
    )
    return options
  }

  private renderInput(createElement: Vue.CreateElement) {
    let input: (string | Vue.VNode)[]
    const presetExpression = this.presetExpression
    if (presetExpression) {
      input = presetExpression.variables.map((v) => {
        if (typeof v === 'string') {
          return createElement(
            'span',
            v
          )
        }
        const currentToken = this.currentTokens[v.tokenIndex]
        if (currentToken.type === 'NumericLiteral') {
          return createElement(
            'input',
            {
              attrs: {
                type: 'number'
              },
              domProps: {
                value: currentToken.value
              },
              style: {
                width: '50px',
              },
              on: {
                change: (e: { target: { value: string } }) => {
                  const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range)
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            }
          )
        }
        if (currentToken.type === 'StringLiteral') {
          return createElement(
            'input',
            {
              attrs: {
                type: 'text'
              },
              domProps: {
                value: currentToken.value
              },
              on: {
                change: (e: { target: { value: string } }) => {
                  const newExpression = replaceStringToken(presetExpression.expression, e.target.value, currentToken.range)
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            }
          )
        }
        if (currentToken.type === 'Identifier') {
          if (v.enum) {
            return createElement(
              'select',
              {
                domProps: {
                  value: currentToken.name
                },
                on: {
                  change: (e: { target: { value: string } }) => {
                    const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range)
                    this.emitChange({
                      expression: newExpression,
                      expressionId: this.expressionId,
                    })
                  }
                }
              },
              v.enum.map((p) => createElement(
                'option',
                {
                  key: p,
                  attrs: {
                    value: p
                  }
                },
                p
              ))
            )
          }
          return createElement(
            'input',
            {
              attrs: {
                type: 'text'
              },
              domProps: {
                value: currentToken.name
              },
              on: {
                change: (e: { target: { value: string } }) => {
                  const newExpression = replaceNonStringToken(presetExpression.expression, e.target.value, currentToken.range)
                  this.emitChange({
                    expression: newExpression,
                    expressionId: this.expressionId,
                  })
                }
              }
            }
          )
        }
        return ''
      })
    } else if (this.expression !== undefined || !this.literalType) {
      input = [
        createElement(
          'input',
          {
            attrs: {
              type: 'text'
            },
            domProps: {
              value: this.expression
            },
            on: {
              change: (e: { target: { value: string } }) => {
                this.emitChange({
                  expression: e.target.value,
                })
              }
            }
          }
        )
      ]
    } else {
      input = [
        createElement(
          'input',
          {
            attrs: {
              type: this.literalType
            },
            domProps: {
              value: this.literal
            },
            on: {
              change: (e: { target: { value: string } }) => {
                this.emitChange({
                  literal: e.target.value,
                })
              }
            }
          }
        )
      ]
    }
    return input
  }
}

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

function replaceNonStringToken(expression: string, value: string, range: [number, number]) {
  return expression.substring(0, range[0])
    + value
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

import Vue from 'vue'
import Component from 'vue-class-component'
import { tokenizeExpression, parseExpression, printExpression, Expression, Property, SpreadElement } from 'expression-engine'

import { templateEditorOperationPanelTemplateHtml, templateEditorOperationPanelTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { TemplateContent, Template } from '../model'
import { renderTemplate, loadTemplateImages } from '../engine/renderer'
import { ExpressionInputChangeData } from './expression-input'
import { analyseRepeat, Repeat, composeRepeat } from '../engine/template-engine'

@Component({
  render: templateEditorOperationPanelTemplateHtml,
  staticRenderFns: templateEditorOperationPanelTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class OperationPanel extends Vue {
  canvasState!: CanvasState

  get panelStyle() {
    return {
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'auto',
    }
  }

  changeName(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'template') {
      Vue.set(this.canvasState.selection.template, 'name', e.target.value || undefined)
    }
  }

  changePosition(e: { target: { value: string } }, kind: 'x' | 'y' | 'z') {
    if (this.canvasState.selection.kind === 'template') {
      let value = +e.target.value
      if (kind === 'z') {
        value = Math.round(value)
      }
      Vue.set(this.canvasState.selection.template, kind, value)
    }
  }

  changePositionExpression(e: ExpressionInputChangeData, kind: 'x' | 'y' | 'z') {
    if (this.canvasState.selection.kind === 'content') {
      if (e.literal !== undefined && (this.canvasState.selection.template.display !== 'flex' || kind === 'z')) {
        let value = +e.literal
        if (kind === 'z') {
          value = Math.round(value)
        }
        Vue.set(this.canvasState.selection.content, kind, value)
      }
      Vue.set(this.canvasState.selection.content, kind + 'Expression', e.expression)
      Vue.set(this.canvasState.selection.content, kind + 'ExpressionId', e.expressionId)
    }
  }

  changeSizeExpression(e: ExpressionInputChangeData, kind: 'width' | 'height') {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text' || this.canvasState.selection.content.kind === 'color')) {
      if (e.literal !== undefined) {
        this.canvasState.selection.content[kind] = +e.literal
      }
      Vue.set(this.canvasState.selection.content, kind + 'Expression', e.expression || undefined)
      Vue.set(this.canvasState.selection.content, kind + 'ExpressionId', e.expressionId)
    } else if (this.canvasState.selection.kind === 'template') {
      if (e.literal !== undefined) {
        this.canvasState.selection.template[kind] = +e.literal
      }
      Vue.set(this.canvasState.selection.template, kind + 'Expression', e.expression || undefined)
      Vue.set(this.canvasState.selection.template, kind + 'ExpressionId', e.expressionId)
    }
  }

  changeHidden(e: { target: { checked: boolean } }) {
    if (this.canvasState.selection.kind === 'content') {
      Vue.set(this.canvasState.selection.content, 'hidden', e.target.checked)
    }
  }

  changeOpacity(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      Vue.set(this.canvasState.selection.content, 'opacity', +e.target.value)
    }
  }

  changeIf(e: { expression: string, expressionId?: string }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      Vue.set(this.canvasState.selection.content, 'if', e.expression)
      Vue.set(this.canvasState.selection.content, 'ifId', e.expressionId)
    }
  }

  changeRepeatExpression(e: { expression: string, expressionId?: string }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      const repeat = composeRepeat({ ...this.repeat, expression: e.expression })
      Vue.set(this.canvasState.selection.content, 'repeat', repeat)
      Vue.set(this.canvasState.selection.content, 'repeatId', e.expressionId)
    }
  }

  changeRepeatItemName(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      const repeat = composeRepeat({ ...this.repeat, itemName: e.target.value })
      Vue.set(this.canvasState.selection.content, 'repeat', repeat)
    }
  }

  changeRepeatIndexName(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
      const repeat = composeRepeat({ ...this.repeat, indexName: e.target.value })
      Vue.set(this.canvasState.selection.content, 'repeat', repeat)
    }
  }

  get repeat(): Repeat {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot' && this.canvasState.selection.content.repeat) {
      return analyseRepeat(this.canvasState.selection.content.repeat)
    }
    return { expression: '' }
  }

  changeTextExpression(e: ExpressionInputChangeData) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      if (e.literal !== undefined) {
        this.canvasState.selection.content.text = e.literal
      }
      Vue.set(this.canvasState.selection.content, 'textExpression', e.expression)
      Vue.set(this.canvasState.selection.content, 'textExpressionId', e.expressionId)
    }
  }

  changeFontFamily(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.fontFamily = e.target.value
    }
  }

  changeFontSizeExpression(e: ExpressionInputChangeData) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      if (e.literal !== undefined) {
        this.canvasState.selection.content.fontSize = +e.literal
      }
      Vue.set(this.canvasState.selection.content, 'fontSizeExpression', e.expression)
      Vue.set(this.canvasState.selection.content, 'fontSizeExpressionId', e.expressionId)
    }
  }

  changeColor(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && (this.canvasState.selection.content.kind === 'text' || this.canvasState.selection.content.kind === 'color')) {
      this.canvasState.selection.content.color = e.target.value
    }
  }

  changeImageUrlExpression(e: ExpressionInputChangeData) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      if (e.literal !== undefined) {
        this.canvasState.selection.content.url = e.literal
      }
      Vue.set(this.canvasState.selection.content, 'urlExpression', e.expression)
      Vue.set(this.canvasState.selection.content, 'urlExpressionId', e.expressionId)
    }
  }

  debug() {
    if (this.canvasState.selection.kind === 'none') {
      console.info(this.canvasState)
    } else {
      console.info(this.canvasState.selection)
    }
  }

  addTemplate() {
    this.canvasState.addKind = 'template'
  }

  addImage() {
    this.canvasState.addKind = 'image'
  }

  addText() {
    this.canvasState.addKind = 'text'
  }

  addColor() {
    this.canvasState.addKind = 'color'
  }

  selectContent(content: TemplateContent) {
    if (this.canvasState.selection.kind !== 'none') {
      this.canvasState.selection = {
        kind: 'content',
        content,
        template: this.canvasState.selection.template
      }
    }
  }

  changeFlex(field: string, value: unknown) {
    if (this.canvasState.selection.kind === 'template') {
      if (field === 'display' && value === '') {
        value = undefined
      }
      Vue.set(this.canvasState.selection.template, field, value)
    }
  }

  extractAsComponent() {
    if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'text'
        || this.canvasState.selection.content.kind === 'image'
        || this.canvasState.selection.content.kind === 'color')) {
      const id = Math.random().toString()
      const content = this.canvasState.selection.content
      const newTemplate: Template = {
        id,
        contents: [
          {
            ...content,
            x: 0,
            y: 0,
          }
        ],
        x: 0,
        y: 0,
        width: content.width,
        height: content.height,
      }
      this.canvasState.styleGuide.templates.push(newTemplate)

      const index = this.canvasState.selection.template.contents.findIndex((c) => c === content)
      if (index >= 0) {
        Vue.set(this.canvasState.selection.template.contents, index, {
          kind: 'reference',
          id,
          x: content.x,
          y: content.y,
        })
      }

      this.canvasState.selection = {
        kind: 'template',
        template: newTemplate,
      }
    }
  }

  private imageUrl = ''

  async renderToImage() {
    if (this.canvasState.selection.kind === 'template') {
      const images = await loadTemplateImages(this.canvasState.selection.template, this.canvasState.styleGuide.templates)
      const url = renderTemplate(this.canvasState.selection.template, this.canvasState.styleGuide.templates, images)
      this.imageUrl = url
    }
  }

  changeParameter(e: { target: { value: string } }, i: number) {
    if (this.canvasState.selection.kind === 'template' && this.canvasState.selection.template.parameters) {
      this.canvasState.selection.template.parameters[i] = e.target.value
    }
  }

  addParameter() {
    if (this.canvasState.selection.kind === 'template') {
      if (this.canvasState.selection.template.parameters) {
        this.canvasState.selection.template.parameters.push('')
      } else {
        Vue.set(this.canvasState.selection.template, 'parameters', [''])
      }
    }
  }

  get parameters() {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
      const id = this.canvasState.selection.content.id
      const reference = this.canvasState.styleGuide.templates.find((t) => t.id === id)
      if (reference) {
        return reference.parameters
      }
    }
    return undefined
  }

  private get propsAst() {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
      const props = this.canvasState.selection.content.props
      if (props) {
        try {
          const ast = parseExpression(tokenizeExpression(props))
          if (ast.type === 'ObjectExpression') {
            return ast
          }
        } catch {
          // no nothing
        }
      }
    }
    return undefined
  }

  getParameterValue(parameter: string) {
    if (this.propsAst) {
      const predicate = getPropertyPredicate(parameter)
      const property = this.propsAst.properties.find(predicate)
      if (property && property.type === 'Property') {
        return printExpression(property.value)
      }
    }
    return ''
  }

  getParameterExpressionId(parameter: string) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference' && this.canvasState.selection.content.propsIds) {
      return this.canvasState.selection.content.propsIds[parameter]
    }
    return undefined
  }

  changeParameterValue(e: ExpressionInputChangeData, parameter: string) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
      const value = e.expression
      let propertyAst: Expression | undefined
      if (value) {
        try {
          propertyAst = parseExpression(tokenizeExpression(value))
        } catch {
          // do nothing
        }
      }
      if (this.propsAst) {
        const predicate = getPropertyPredicate(parameter)
        const propertyIndex = this.propsAst.properties.findIndex(predicate)
        if (propertyIndex >= 0) {
          const property = this.propsAst.properties[propertyIndex] as Property
          if (propertyAst) {
            property.value = propertyAst
          } else {
            this.propsAst.properties.splice(propertyIndex, 1)
          }
          const newExpression = printExpression(this.propsAst)
          Vue.set(this.canvasState.selection.content, 'props', newExpression === '{}' ? undefined : newExpression)
        } else if (propertyAst) {
          this.propsAst.properties.push(getNewProperty(parameter, propertyAst))
          const newExpression = printExpression(this.propsAst)
          Vue.set(this.canvasState.selection.content, 'props', newExpression === '{}' ? undefined : newExpression)
        }
      } else if (propertyAst) {
        const newExpression = printExpression({
          type: 'ObjectExpression',
          properties: [
            getNewProperty(parameter, propertyAst)
          ],
          range: [0, 0],
        })
        Vue.set(this.canvasState.selection.content, 'props', newExpression === '{}' ? undefined : newExpression)
      } else {
        Vue.set(this.canvasState.selection.content, 'props', undefined)
      }
      const newPropsIds: { [name: string]: string | undefined } = {
        ...this.canvasState.selection.content.propsIds,
        [parameter]: e.expressionId,
      }
      Vue.set(this.canvasState.selection.content, 'propsIds', Object.keys(newPropsIds).filter((p) => newPropsIds[p] !== undefined).length > 0 ? newPropsIds : undefined)
    }
  }
}

function getNewProperty(parameter: string, propertyAst: Expression): Property {
  return {
    type: 'Property',
    key: {
      type: 'Identifier',
      name: parameter,
      range: [0, 0],
    },
    value: propertyAst,
    shorthand: false,
    range: [0, 0],
  }
}

function getPropertyPredicate(parameter: string) {
  return (p: Property | SpreadElement) => p.type === 'Property'
    && ((p.key.type === 'StringLiteral' && p.key.value === parameter)
      || (p.key.type === 'Identifier' && p.key.name === parameter))
}

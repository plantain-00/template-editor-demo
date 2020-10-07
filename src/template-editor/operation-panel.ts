import { defineComponent, PropType } from 'vue'
import { tokenizeExpression, parseExpression, printExpression, Expression, Property, SpreadElement, ObjectExpression } from 'expression-engine'

import { templateEditorOperationPanelTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { Template, StyleGuideVariable, StyleGuide } from '../model'
import { renderTemplate, loadTemplateImages } from '../engine/canvas-renderer'
import { ExpressionInputChangeData, ExpressionInput } from './expression-input'
import { analyseRepeat, Repeat, composeRepeat } from '../engine/template-engine'
import { formatPixel } from '../utils'
import { recommand } from '../engine/recommand'

export const OperationPanel = defineComponent({
  render: templateEditorOperationPanelTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  data: () => {
    return {
      imageUrl: '',
      recommandResults: [] as Array<{ preview: string, variables: StyleGuideVariable[] }>,
      selectedVariables: [] as StyleGuideVariable[][],
    }
  },
  components: {
    'expression-input': ExpressionInput,
  },
  computed: {
    panelStyle(): { [name: string]: unknown } {
      return {
        height: this.canvasState.canvasHeight + 'px',
        overflow: 'auto',
      }
    },
    repeat(): Repeat {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot' && this.canvasState.selection.content.repeat) {
        return analyseRepeat(this.canvasState.selection.content.repeat)
      }
      return { expression: '' }
    },
    parameters(): string[] | undefined {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference') {
        const id = this.canvasState.selection.content.id
        const reference = this.canvasState.styleGuide.templates.find((t) => t.id === id)
        if (reference) {
          return reference.parameters
        }
      }
      return undefined
    },
    propsAst(): ObjectExpression | undefined {
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
  },
  methods: {
    changeName(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'template') {
        this.canvasState.selection.template.name = e.target.value || undefined
      }
    },
    changePosition(e: { target: { value: string } }, kind: 'x' | 'y' | 'z') {
      if (this.canvasState.selection.kind === 'template') {
        let value = +e.target.value
        if (kind === 'z') {
          value = Math.round(value)
        } else {
          value = formatPixel(value)
        }
        this.canvasState.selection.template[kind] = value
      }
    },
    changePositionExpression(e: ExpressionInputChangeData, kind: 'x' | 'y' | 'z') {
      if (this.canvasState.selection.kind === 'content') {
        if (e.literal !== undefined && (this.canvasState.selection.template.display !== 'flex' || kind === 'z')) {
          let value = +e.literal
          if (kind === 'z') {
            value = Math.round(value)
          } else {
            value = formatPixel(value)
          }
          this.canvasState.selection.content[kind] = value
        }
        this.canvasState.selection.content[kind + 'Expression' as 'xExpression'] = e.expression
        this.canvasState.selection.content[kind + 'ExpressionId' as 'xExpression'] = e.expressionId
      }
    },
    changeSizeExpression(e: ExpressionInputChangeData, kind: 'width' | 'height') {
      if (this.canvasState.selection.kind === 'content'
        && (this.canvasState.selection.content.kind === 'image' || this.canvasState.selection.content.kind === 'text' || this.canvasState.selection.content.kind === 'color')) {
        if (e.literal !== undefined) {
          this.canvasState.selection.content[kind] = formatPixel(+e.literal)
        }
        this.canvasState.selection.content[kind + 'Expression' as 'xExpression'] = e.expression
        this.canvasState.selection.content[kind + 'ExpressionId' as 'xExpression'] = e.expressionId
      } else if (this.canvasState.selection.kind === 'template') {
        if (e.literal !== undefined) {
          this.canvasState.selection.template[kind] = formatPixel(+e.literal)
        }
        this.canvasState.selection.template[kind + 'Expression' as 'widthExpression'] = e.expression
        this.canvasState.selection.template[kind + 'ExpressionId' as 'widthExpression'] = e.expressionId
      }
    },
    changeRotateExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.selection.kind === 'content'
        && this.canvasState.selection.content.kind !== 'reference'
        && this.canvasState.selection.content.kind !== 'snapshot') {
        if (e.literal !== undefined) {
          this.canvasState.selection.content.rotate = formatPixel(+e.literal)
        }
        this.canvasState.selection.content.rotateExpression = e.expression
        this.canvasState.selection.content.rotateExpressionId = e.expressionId
      }
    },
    changeHidden(e: { target: { checked: boolean } }) {
      if (this.canvasState.selection.kind === 'content') {
        this.canvasState.selection.content.hidden = e.target.checked
      }
    },
    changeOpacity(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
        this.canvasState.selection.content.opacity = +e.target.value
      }
    },
    changeBlendMode(e: { target: { value: 'multiply' } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
        this.canvasState.selection.content.blendMode = e.target.value
      }
    },
    changeIf(e: { expression: string, expressionId?: string }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
        this.canvasState.selection.content.if = e.expression
        this.canvasState.selection.content.ifId = e.expressionId
      }
    },
    changeElse(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
        this.canvasState.selection.content.else = e.target.value === 'true' ? true : undefined
      }
    },
    changeRepeatExpression(e: { expression: string, expressionId?: string }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, expression: e.expression })
        this.canvasState.selection.content.repeat = repeat
        this.canvasState.selection.content.repeatId = e.expressionId
      }
    },
    changeRepeatItemName(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, itemName: e.target.value })
        this.canvasState.selection.content.repeat = repeat
      }
    },
    changeRepeatIndexName(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, indexName: e.target.value })
        this.canvasState.selection.content.repeat = repeat
      }
    },
    changeTextExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
        if (e.literal !== undefined) {
          this.canvasState.selection.content.text = e.literal
        }
        this.canvasState.selection.content.textExpression = e.expression
        this.canvasState.selection.content.textExpressionId = e.expressionId
      }
    },
    changeFontFamily(e: { target: { value: string } }) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
        this.canvasState.selection.content.fontFamily = e.target.value
      }
    },
    changeFontSizeExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
        if (e.literal !== undefined) {
          this.canvasState.selection.content.fontSize = formatPixel(+e.literal)
        }
        this.canvasState.selection.content.fontSizeExpression = e.expression
        this.canvasState.selection.content.fontSizeExpressionId = e.expressionId
      }
    },
    changeColorExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.selection.kind === 'content' && (this.canvasState.selection.content.kind === 'text' || this.canvasState.selection.content.kind === 'color')) {
        if (e.literal !== undefined) {
          this.canvasState.selection.content.color = e.literal
        }
        this.canvasState.selection.content.colorExpression = e.expression
        this.canvasState.selection.content.colorExpressionId = e.expressionId
      }
    },
    changeImageUrlExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
        if (e.literal !== undefined) {
          this.canvasState.selection.content.url = e.literal
        }
        this.canvasState.selection.content.urlExpression = e.expression
        this.canvasState.selection.content.urlExpressionId = e.expressionId
      }
    },
    debug() {
      console.info(this.canvasState)
      if (this.canvasState.selection.kind !== 'none') {
        console.info(this.canvasState.selection)
      }
    },
    addTemplate() {
      this.canvasState.addKind = 'template'
    },
    addImage() {
      this.canvasState.addKind = 'image'
    },
    addText() {
      this.canvasState.addKind = 'text'
    },
    addColor() {
      this.canvasState.addKind = 'color'
    },
    changeFlex(field: 'display' | 'flexDirection' | 'justifyContent' | 'alignItems', value: unknown) {
      if (this.canvasState.selection.kind === 'template') {
        if (field === 'display' && value === '') {
          value = undefined
        }
        this.canvasState.selection.template[field] = value as any
      }
    },
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
          this.canvasState.selection.template.contents[index] = {
            kind: 'reference',
            id,
            x: content.x,
            y: content.y,
          }
        }

        this.canvasState.selection = {
          kind: 'template',
          template: newTemplate,
        }
      }
    },
    async renderToImage() {
      if (this.canvasState.selection.kind === 'template') {
        const images = await loadTemplateImages(this.canvasState.selection.template, this.canvasState.styleGuide)
        const url = renderTemplate(this.canvasState.selection.template, this.canvasState.styleGuide, images)
        this.imageUrl = url
      }
    },
    changeParameter(e: { target: { value: string } }, i: number) {
      if (this.canvasState.selection.kind === 'template' && this.canvasState.selection.template.parameters) {
        if (e.target.value) {
          this.canvasState.selection.template.parameters[i] = e.target.value
        } else {
          this.canvasState.selection.template.parameters.splice(i, 1)
          if (this.canvasState.selection.template.parameters.length === 0) {
            this.canvasState.selection.template.parameters = undefined
          }
        }
      }
    },
    addParameter() {
      if (this.canvasState.selection.kind === 'template') {
        if (this.canvasState.selection.template.parameters) {
          this.canvasState.selection.template.parameters.push('')
        } else {
          this.canvasState.selection.template.parameters = ['']
        }
      }
    },
    getParameterValue(parameter: string) {
      if (this.propsAst) {
        const predicate = getPropertyPredicate(parameter)
        const property = this.propsAst.properties.find(predicate)
        if (property && property.type === 'Property') {
          return printExpression(property.value)
        }
      }
      return ''
    },
    getParameterExpressionId(parameter: string) {
      if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'reference' && this.canvasState.selection.content.propsIds) {
        return this.canvasState.selection.content.propsIds[parameter]
      }
      return undefined
    },
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
            this.canvasState.selection.content.props = newExpression === '{}' ? undefined : newExpression
          } else if (propertyAst) {
            this.propsAst.properties.push(getNewProperty(parameter, propertyAst))
            const newExpression = printExpression(this.propsAst)
            this.canvasState.selection.content.props = newExpression === '{}' ? undefined : newExpression
          }
        } else if (propertyAst) {
          const newExpression = printExpression({
            type: 'ObjectExpression',
            properties: [
              getNewProperty(parameter, propertyAst)
            ],
            range: [0, 0],
          })
          this.canvasState.selection.content.props = newExpression === '{}' ? undefined : newExpression
        } else {
          this.canvasState.selection.content.props = undefined
        }
        const newPropsIds: { [name: string]: string | undefined } = {
          ...this.canvasState.selection.content.propsIds,
          [parameter]: e.expressionId,
        }
        const validPropsIds: { [name: string]: string  } = {}
        for (const p in newPropsIds) {
          const value = newPropsIds[p]
          if (value !== undefined) {
            validPropsIds[p] = value
          }
        }
        this.canvasState.selection.content.propsIds = Object.keys(validPropsIds).length > 0 ? validPropsIds : undefined
      }
    },
    toggleCommonEditor(fieldName: 'variables' | 'collections' | 'constrains') {
      this.canvasState.commonEditorEditingFieldName = fieldName
      this.canvasState.commonEditorVisible = !this.canvasState.commonEditorVisible
    },
    async recommand() {
      this.selectedVariables = []
      if (this.canvasState.styleGuide.variables && this.canvasState.styleGuide.collections && this.canvasState.selection.kind === 'template') {
        const result = recommand(this.canvasState.styleGuide.variables?.[0], this.canvasState.styleGuide.collections, this.canvasState.styleGuide.constrains)
        this.recommandResults = []
        for (const r of result) {
          const styleGuide: StyleGuide = {
            ...this.canvasState.styleGuide,
            variables: [r],
          }
          const images = await loadTemplateImages(this.canvasState.selection.template, styleGuide)
          const preview = renderTemplate(this.canvasState.selection.template, styleGuide, images)
          this.recommandResults.push({
            variables: r,
            preview,
          })
        }
      }
    },
    selectVariables(variables: StyleGuideVariable[]) {
      const index = this.selectedVariables.findIndex(v => v === variables)
      if (index >= 0) {
        this.selectedVariables.splice(index, 1)
      } else {
        this.selectedVariables.push(variables)
      }
    },
    applyRecommandResult() {
      if (this.selectedVariables.length > 0) {
        this.canvasState.styleGuide.variables = [...this.selectedVariables]
      }
    },
    getPreviewStyle(variables: StyleGuideVariable[]) {
      return {
        objectFit: 'contain',
        width: '100%',
        cursor: 'pointer',
        border: `1px solid ${this.selectedVariables.includes(variables) ? 'green' : '#cccccc'}`
      }
    },
  }
})

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

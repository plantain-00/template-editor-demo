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
        height: this.canvasState.viewport.height + 'px',
        overflow: 'auto',
      }
    },
    repeat(): Repeat {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot' && this.canvasState.styleGuide.selection.content.repeat) {
        return analyseRepeat(this.canvasState.styleGuide.selection.content.repeat)
      }
      return { expression: '' }
    },
    parameters(): string[] | undefined {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'reference') {
        const id = this.canvasState.styleGuide.selection.content.id
        const reference = this.canvasState.styleGuide.data.templates.find((t) => t.id === id)
        if (reference) {
          return reference.parameters
        }
      }
      return undefined
    },
    propsAst(): ObjectExpression | undefined {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'reference') {
        const props = this.canvasState.styleGuide.selection.content.props
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
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        this.canvasState.styleGuide.selection.template.name = e.target.value || undefined
      }
    },
    changePosition(e: { target: { value: string } }, kind: 'x' | 'y' | 'z') {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        let value = +e.target.value
        if (kind === 'z') {
          value = Math.round(value)
        } else {
          value = formatPixel(value)
        }
        this.canvasState.styleGuide.selection.template[kind] = value
      }
    },
    changePositionExpression(e: ExpressionInputChangeData, kind: 'x' | 'y' | 'z') {
      if (this.canvasState.styleGuide.selection.kind === 'content') {
        if (e.literal !== undefined && (this.canvasState.styleGuide.selection.template.display !== 'flex' || kind === 'z')) {
          let value = +e.literal
          if (kind === 'z') {
            value = Math.round(value)
          } else {
            value = formatPixel(value)
          }
          this.canvasState.styleGuide.selection.content[kind] = value
        }
        this.canvasState.styleGuide.selection.content[kind + 'Expression' as 'xExpression'] = e.expression
        this.canvasState.styleGuide.selection.content[kind + 'ExpressionId' as 'xExpression'] = e.expressionId
      }
    },
    changeSizeExpression(e: ExpressionInputChangeData, kind: 'width' | 'height') {
      if (this.canvasState.styleGuide.selection.kind === 'content'
        && (this.canvasState.styleGuide.selection.content.kind === 'image' || this.canvasState.styleGuide.selection.content.kind === 'text' || this.canvasState.styleGuide.selection.content.kind === 'color')) {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content[kind] = formatPixel(+e.literal)
        }
        this.canvasState.styleGuide.selection.content[kind + 'Expression' as 'xExpression'] = e.expression
        this.canvasState.styleGuide.selection.content[kind + 'ExpressionId' as 'xExpression'] = e.expressionId
      } else if (this.canvasState.styleGuide.selection.kind === 'template') {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.template[kind] = formatPixel(+e.literal)
        }
        this.canvasState.styleGuide.selection.template[kind + 'Expression' as 'widthExpression'] = e.expression
        this.canvasState.styleGuide.selection.template[kind + 'ExpressionId' as 'widthExpression'] = e.expressionId
      }
    },
    changeRotateExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.styleGuide.selection.kind === 'content'
        && this.canvasState.styleGuide.selection.content.kind !== 'reference'
        && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content.rotate = formatPixel(+e.literal)
        }
        this.canvasState.styleGuide.selection.content.rotateExpression = e.expression
        this.canvasState.styleGuide.selection.content.rotateExpressionId = e.expressionId
      }
    },
    changeHidden(e: { target: { checked: boolean } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content') {
        this.canvasState.styleGuide.selection.content.hidden = e.target.checked
      }
    },
    changeOpacity(e: { target: { value: string } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'image') {
        this.canvasState.styleGuide.selection.content.opacity = +e.target.value
      }
    },
    changeBlendMode(e: { target: { value: 'multiply' } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'image') {
        this.canvasState.styleGuide.selection.content.blendMode = e.target.value
      }
    },
    changeIf(e: { expression: string, expressionId?: string }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        this.canvasState.styleGuide.selection.content.if = e.expression
        this.canvasState.styleGuide.selection.content.ifId = e.expressionId
      }
    },
    changeElse(e: { target: { value: string } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        this.canvasState.styleGuide.selection.content.else = e.target.value === 'true' ? true : undefined
      }
    },
    changeRepeatExpression(e: { expression: string, expressionId?: string }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, expression: e.expression })
        this.canvasState.styleGuide.selection.content.repeat = repeat
        this.canvasState.styleGuide.selection.content.repeatId = e.expressionId
      }
    },
    changeRepeatItemName(e: { target: { value: string } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, itemName: e.target.value })
        this.canvasState.styleGuide.selection.content.repeat = repeat
      }
    },
    changeRepeatIndexName(e: { target: { value: string } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind !== 'snapshot') {
        const repeat = composeRepeat({ ...this.repeat, indexName: e.target.value })
        this.canvasState.styleGuide.selection.content.repeat = repeat
      }
    },
    changeTextExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'text') {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content.text = e.literal
        }
        this.canvasState.styleGuide.selection.content.textExpression = e.expression
        this.canvasState.styleGuide.selection.content.textExpressionId = e.expressionId
      }
    },
    changeFontFamily(e: { target: { value: string } }) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'text') {
        this.canvasState.styleGuide.selection.content.fontFamily = e.target.value
      }
    },
    changeFontSizeExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'text') {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content.fontSize = formatPixel(+e.literal)
        }
        this.canvasState.styleGuide.selection.content.fontSizeExpression = e.expression
        this.canvasState.styleGuide.selection.content.fontSizeExpressionId = e.expressionId
      }
    },
    changeColorExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && (this.canvasState.styleGuide.selection.content.kind === 'text' || this.canvasState.styleGuide.selection.content.kind === 'color')) {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content.color = e.literal
        }
        this.canvasState.styleGuide.selection.content.colorExpression = e.expression
        this.canvasState.styleGuide.selection.content.colorExpressionId = e.expressionId
      }
    },
    changeImageUrlExpression(e: ExpressionInputChangeData) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'image') {
        if (e.literal !== undefined) {
          this.canvasState.styleGuide.selection.content.url = e.literal
        }
        this.canvasState.styleGuide.selection.content.urlExpression = e.expression
        this.canvasState.styleGuide.selection.content.urlExpressionId = e.expressionId
      }
    },
    debug() {
      console.info(this.canvasState)
      if (this.canvasState.styleGuide.selection.kind !== 'none') {
        console.info(this.canvasState.styleGuide.selection)
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
    changeFlexDisplay(value: 'flex' | '' | undefined) {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        if (value === '') {
          value = undefined
        }
        this.canvasState.styleGuide.selection.template.display = value
      }
    },
    changeFlexDirection(value: "row" | "column" | undefined) {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        this.canvasState.styleGuide.selection.template.flexDirection = value
      }
    },
    changeFlexJustifyContent(value: "start" | "end" | "center" | "between" | undefined) {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        this.canvasState.styleGuide.selection.template.justifyContent = value 
      }
    },
    changeFlexAlignItems(value: "start" | "end" | "center" | undefined) {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        this.canvasState.styleGuide.selection.template.alignItems = value
      }
    },
    extractAsComponent() {
      if (this.canvasState.styleGuide.selection.kind === 'content'
        && (this.canvasState.styleGuide.selection.content.kind === 'text'
          || this.canvasState.styleGuide.selection.content.kind === 'image'
          || this.canvasState.styleGuide.selection.content.kind === 'color')) {
        const id = Math.random().toString()
        const content = this.canvasState.styleGuide.selection.content
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
        this.canvasState.styleGuide.data.templates.push(newTemplate)

        const index = this.canvasState.styleGuide.selection.template.contents.findIndex((c) => c === content)
        if (index >= 0) {
          this.canvasState.styleGuide.selection.template.contents[index] = {
            kind: 'reference',
            id,
            x: content.x,
            y: content.y,
          }
        }

        this.canvasState.styleGuide.selection = {
          kind: 'template',
          template: newTemplate,
        }
      }
    },
    async renderToImage() {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        const images = await loadTemplateImages(this.canvasState.styleGuide.selection.template, this.canvasState.styleGuide.data)
        const url = renderTemplate(this.canvasState.styleGuide.selection.template, this.canvasState.styleGuide.data, images)
        this.imageUrl = url
      }
    },
    changeParameter(e: { target: { value: string } }, i: number) {
      if (this.canvasState.styleGuide.selection.kind === 'template' && this.canvasState.styleGuide.selection.template.parameters) {
        if (e.target.value) {
          this.canvasState.styleGuide.selection.template.parameters[i] = e.target.value
        } else {
          this.canvasState.styleGuide.selection.template.parameters.splice(i, 1)
          if (this.canvasState.styleGuide.selection.template.parameters.length === 0) {
            this.canvasState.styleGuide.selection.template.parameters = undefined
          }
        }
      }
    },
    addParameter() {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        if (this.canvasState.styleGuide.selection.template.parameters) {
          this.canvasState.styleGuide.selection.template.parameters.push('')
        } else {
          this.canvasState.styleGuide.selection.template.parameters = ['']
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
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'reference' && this.canvasState.styleGuide.selection.content.propsIds) {
        return this.canvasState.styleGuide.selection.content.propsIds[parameter]
      }
      return undefined
    },
    changeParameterValue(e: ExpressionInputChangeData, parameter: string) {
      if (this.canvasState.styleGuide.selection.kind === 'content' && this.canvasState.styleGuide.selection.content.kind === 'reference') {
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
            const property = this.propsAst.properties[propertyIndex]
            if (propertyAst && property.type === 'Property') {
              property.value = propertyAst
            } else {
              this.propsAst.properties.splice(propertyIndex, 1)
            }
            const newExpression = printExpression(this.propsAst)
            this.canvasState.styleGuide.selection.content.props = newExpression === '{}' ? undefined : newExpression
          } else if (propertyAst) {
            this.propsAst.properties.push(getNewProperty(parameter, propertyAst))
            const newExpression = printExpression(this.propsAst)
            this.canvasState.styleGuide.selection.content.props = newExpression === '{}' ? undefined : newExpression
          }
        } else if (propertyAst) {
          const newExpression = printExpression({
            type: 'ObjectExpression',
            properties: [
              getNewProperty(parameter, propertyAst)
            ],
            range: [0, 0],
          })
          this.canvasState.styleGuide.selection.content.props = newExpression === '{}' ? undefined : newExpression
        } else {
          this.canvasState.styleGuide.selection.content.props = undefined
        }
        const newPropsIds: { [name: string]: string | undefined } = {
          ...this.canvasState.styleGuide.selection.content.propsIds,
          [parameter]: e.expressionId,
        }
        const validPropsIds: { [name: string]: string  } = {}
        for (const p in newPropsIds) {
          const value = newPropsIds[p]
          if (value !== undefined) {
            validPropsIds[p] = value
          }
        }
        this.canvasState.styleGuide.selection.content.propsIds = Object.keys(validPropsIds).length > 0 ? validPropsIds : undefined
      }
    },
    toggleCommonEditor(fieldName: 'variables' | 'collections' | 'constrains') {
      this.canvasState.commonEditorEditingFieldName = fieldName
      this.canvasState.commonEditorVisible = !this.canvasState.commonEditorVisible
    },
    async recommand() {
      this.selectedVariables = []
      if (this.canvasState.styleGuide.data.variables && this.canvasState.styleGuide.data.collections && this.canvasState.styleGuide.selection.kind === 'template') {
        const result = recommand(this.canvasState.styleGuide.data.variables?.[0], this.canvasState.styleGuide.data.collections, this.canvasState.styleGuide.data.constrains)
        this.recommandResults = []
        for (const r of result) {
          const styleGuide: StyleGuide = {
            ...this.canvasState.styleGuide.data,
            variables: [r],
          }
          const images = await loadTemplateImages(this.canvasState.styleGuide.selection.template, styleGuide)
          const preview = renderTemplate(this.canvasState.styleGuide.selection.template, styleGuide, images)
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
        this.canvasState.styleGuide.data.variables = [...this.selectedVariables]
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

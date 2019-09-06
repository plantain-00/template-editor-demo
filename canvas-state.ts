import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasSelection, StyleGuide, TemplateContent, CanvasSelectionData } from './model'
import { renderTemplate } from './renderer'

@Component
export class CanvasState extends Vue {
  static create(styleGuide: StyleGuide) {
    const canvasState = new CanvasState()
    canvasState.styleGuide = styleGuide

    canvasState.styleGuideScale = Math.min(canvasState.canvasWidth / canvasState.styleGuideWidth, canvasState.canvasHeight / canvasState.styleGuideHeight)
    canvasState.styleGuideTranslateX = (canvasState.canvasWidth - canvasState.styleGuideWidth) * canvasState.styleGuideScale
    canvasState.styleGuideTranslateY = (canvasState.canvasHeight - canvasState.styleGuideHeight) * canvasState.styleGuideScale

    canvasState.applyChanges()
    return canvasState
  }

  applyChanges() {
    for (const content of this.changedContents) {
      if (content.kind === 'text') {
        content.characters = Array.from(content.text).map((t) => ({ text: t }))
      }
    }
    this.renderResults = this.styleGuide.templates.map((t) => {
      let selection: CanvasSelectionData | undefined
      if (this.selection.kind === 'template') {
        selection = {
          kind: 'template',
          id: this.selection.template.id
        }
      } else if (this.selection.kind === 'content') {
        const content = this.selection.content
        selection = {
          kind: 'content',
          id: this.selection.template.id,
          index: this.selection.template.contents.findIndex((c) => c === content)
        }
      }
      return {
        html: renderTemplate(t, this.styleGuide.templates, true, selection),
        x: t.x,
        y: t.y,
      }
    })
  }

  applyChangesIfAuto() {
    if (this.auto) {
      this.applyChanges()
    }
  }

  styleGuide: StyleGuide = {
    name: '',
    templates: []
  }
  renderResults: Array<{
    html: string,
    x: number,
    y: number,
  }> = []
  auto = true

  styleGuideTranslateX = 0
  styleGuideTranslateY = 0
  styleGuideScale = 1
  canvasWidth = 1200
  canvasHeight = 400
  selection: CanvasSelection = {
    kind: 'none'
  }
  changedContents = new Set<TemplateContent>()
  mousedownX = 0
  mousedownY = 0
  mouseupX = 0
  mouseupY = 0
  mousePressing = false

  get styleGuideWidth() {
    return Math.max(...this.styleGuide.templates.map((t) => t.x + t.width))
  }

  get styleGuideHeight() {
    return Math.max(...this.styleGuide.templates.map((t) => t.y + t.height))
  }

  get isDragging() {
    return !equal(this.mouseupX, this.mousedownX) || !(this.mouseupY, this.mousedownY)
  }

  mapX(x: number) {
    return (x - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale
  }

  mapY(y: number) {
    return (y - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale
  }
}

function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

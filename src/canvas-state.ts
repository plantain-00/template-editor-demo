import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasSelection, StyleGuide, TemplateContent } from './model'
import { renderTemplate } from './renderer'
import { layoutText } from './mock'
import { layoutFlex } from './layout-engine'

@Component
export class CanvasState extends Vue {
  static create(styleGuide: StyleGuide, width: number, height: number) {
    const canvasState = new CanvasState()
    canvasState.styleGuide = styleGuide
    canvasState.canvasWidth = width
    canvasState.canvasHeight = height

    canvasState.applyCanvasSizeChange()
    
    return canvasState
  }

  applyCanvasSizeChange() {
    this.styleGuideScale = Math.min(this.canvasWidth / this.styleGuideWidth, this.canvasHeight / this.styleGuideHeight)
    this.styleGuideTranslateX = (this.canvasWidth - this.styleGuideWidth) * this.styleGuideScale
    this.styleGuideTranslateY = (this.canvasHeight - this.styleGuideHeight) * this.styleGuideScale
    this.styleGuideScale *= 0.9

    this.applyChanges()
  }

  applyChanges() {
    for (const content of this.changedContents) {
      if (content.kind === 'text') {
        layoutText(content)
      }
    }
    for (const template of this.styleGuide.templates) {
      layoutFlex(template, this.styleGuide.templates)
    }
    this.renderResults = this.styleGuide.templates.map((t) => ({
      html: renderTemplate(t, this.styleGuide.templates, true),
      x: t.x,
      y: t.y,
    }))
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
  isDraggingForMoving = false
  addKind: 'template' | 'image' | 'text' | undefined

  contextMenuEnabled = false
  contextMenuX = 0
  contextMenuY = 0

  get styleGuideWidth() {
    return Math.max(...this.styleGuide.templates.map((t) => t.x + t.width), 10)
  }

  get styleGuideHeight() {
    return Math.max(...this.styleGuide.templates.map((t) => t.y + t.height), 10)
  }

  get isDraggingForSelection() {
    return this.moved && this.mousePressing && !this.isDraggingForMoving
  }

  get moved() {
    return !equal(this.mouseupX, this.mousedownX) || !equal(this.mouseupY, this.mousedownY)
  }

  get mousedownMappedX() {
    return this.mapX(this.mousedownX)
  }
  get mousedownMappedY() {
    return this.mapY(this.mousedownY)
  }
  get mouseupMappedX() {
    return this.mapX(this.mouseupX)
  }
  get mouseupMappedY() {
    return this.mapY(this.mouseupY)
  }

  mapX(x: number) {
    return (x - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale
  }

  mapY(y: number) {
    return (y - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale
  }

  private styleGuideHistory: StyleGuide[] = []
  action() {
    this.styleGuideHistory.push(JSON.parse(JSON.stringify(this.styleGuide)))
    if (this.styleGuideHistory.length > 10) {
      this.styleGuideHistory.splice(0, this.styleGuideHistory.length - 10)
    }
  }
  undo() {
    const styleGuide = this.styleGuideHistory.pop()
    if (styleGuide) {
      this.styleGuide = styleGuide
      this.applyChangesIfAuto()
    }
  }
}

function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

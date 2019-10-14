import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasSelection, StyleGuide } from '../model'
import { iterateAllTemplateRegions, iterateAllContentRegions } from '../utils'

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
    const widthScale = this.canvasWidth / this.styleGuideWidth
    const heightScale = this.canvasHeight / this.styleGuideHeight
    this.styleGuideScale = Math.min(widthScale, heightScale) * 0.9
    const x = this.styleGuideWidth * (widthScale - this.styleGuideScale) / 2
    const y = this.styleGuideHeight * (heightScale - this.styleGuideScale) / 2
    this.styleGuideTranslateX = (x - this.styleGuideX * this.styleGuideScale - this.styleGuideWidth / 2) / this.styleGuideScale + this.styleGuideWidth / 2
    this.styleGuideTranslateY = (y - this.styleGuideY * this.styleGuideScale - this.styleGuideHeight / 2) / this.styleGuideScale + this.styleGuideHeight / 2
  }

  styleGuide: StyleGuide = {
    name: '',
    templates: []
  }

  styleGuideTranslateX = 0
  styleGuideTranslateY = 0
  styleGuideScale = 1
  canvasWidth = 1200
  canvasHeight = 400
  selection: CanvasSelection = {
    kind: 'none'
  }
  mousedownX = 0
  mousedownY = 0
  mouseupX = 0
  mouseupY = 0
  mousePressing = false
  isDraggingForMoving = false
  addKind: 'template' | 'image' | 'text' | 'color' | undefined

  contextMenuEnabled = false
  contextMenuX = 0
  contextMenuY = 0

  private get styleGuideX() {
    return Math.min(...this.styleGuide.templates.map((t) => t.x))
  }
  private _styleGuideWidth = 0
  get styleGuideWidth() {
    if (this.isDraggingForMoving) {
      return this._styleGuideWidth
    }
    const maxX = Math.max(...this.styleGuide.templates.map((t) => t.x + t.width))
    const styleGuideWidth = Math.max(maxX - this.styleGuideX, 10)
    this._styleGuideWidth = styleGuideWidth
    return styleGuideWidth
  }

  private get styleGuideY() {
    return Math.min(...this.styleGuide.templates.map((t) => t.y))
  }
  private _styleGuideHeight = 0
  get styleGuideHeight() {
    if (this.isDraggingForMoving) {
      return this._styleGuideHeight
    }
    const maxY = Math.max(...this.styleGuide.templates.map((t) => t.y + t.height))
    const styleGuideHeight = Math.max(maxY - this.styleGuideY, 10)
    this._styleGuideHeight = styleGuideHeight
    return styleGuideHeight
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
    }
  }

  get allTemplateRegions() {
    if (this.selection.kind === 'template') {
      return Array.from(iterateAllTemplateRegions(this.selection.template, this.styleGuide))
    }
    return []
  }

  get allContentRegions() {
    if (this.selection.kind === 'content') {
      return Array.from(iterateAllContentRegions(this.selection.content, this.styleGuide))
    }
    return []
  }
}

function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

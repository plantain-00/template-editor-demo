import { reactive } from 'vue'

import { CanvasSelection, StyleGuide, Template } from '../model'
import { iterateAllTemplateRegions, iterateAllContentRegions, iterateAllNameRegions } from '../utils'
import { presetExpressions } from '../preset-expressions'

export function createCanvasState(styleGuide: StyleGuide, width: number, height: number) {
  const canvasState = reactive({
    applyCanvasSizeChange() {
      const widthScale = this.canvasWidth / this.styleGuideWidth
      const heightScale = this.canvasHeight / this.styleGuideHeight
      this.styleGuideScale = Math.min(widthScale, heightScale) * 0.9
      const x = this.styleGuideWidth * (widthScale - this.styleGuideScale) / 2
      const y = this.styleGuideHeight * (heightScale - this.styleGuideScale) / 2
      this.styleGuideTranslateX = (x - this.styleGuideX * this.styleGuideScale - this.styleGuideWidth / 2) / this.styleGuideScale + this.styleGuideWidth / 2
      this.styleGuideTranslateY = (y - this.styleGuideY * this.styleGuideScale - this.styleGuideHeight / 2) / this.styleGuideScale + this.styleGuideHeight / 2
    },
    styleGuide: {
      name: '',
      templates: []
    } as StyleGuide,
    styleGuideTranslateX: 0,
    styleGuideTranslateY: 0,
    styleGuideScale: 1,
    canvasWidth: 1200,
    canvasHeight: 400,
    selection: {
      kind: 'none'
    } as CanvasSelection,
    mousedownX: 0,
    mousedownY: 0,
    mouseupX: 0,
    mouseupY: 0,
    mousePressing: false,
    hasRelationWithSelection: false,
    addKind: undefined as 'template' | 'image' | 'text' | 'color' | undefined,
    x: 0,
    y: 0,
    contextMenuEnabled: false,
    contextMenuX: 0,
    contextMenuY: 0,
    get styleGuideX() {
      return Math.min(...this.styleGuide.templates.map((t: Template) => t.x))
    },
    _styleGuideWidth: 0,
    get styleGuideWidth(): number {
      if (this.hasRelationWithSelection) {
        return this._styleGuideWidth
      }
      const maxX = Math.max(...this.styleGuide.templates.map((t) => t.x + t.width))
      const styleGuideWidth = Math.max(maxX - this.styleGuideX, 10)
      this._styleGuideWidth = styleGuideWidth
      return styleGuideWidth
    },
    get styleGuideY() {
      return Math.min(...this.styleGuide.templates.map((t: Template) => t.y))
    },
    _styleGuideHeight: 0,
    get styleGuideHeight(): number {
      if (this.hasRelationWithSelection) {
        return this._styleGuideHeight
      }
      const maxY = Math.max(...this.styleGuide.templates.map((t) => t.y + t.height))
      const styleGuideHeight = Math.max(maxY - this.styleGuideY, 10)
      this._styleGuideHeight = styleGuideHeight
      return styleGuideHeight
    },
    get isDraggingForSelection() {
      return this.moved && this.mousePressing && !this.hasRelationWithSelection
    },
    get moved() {
      return !equal(this.mouseupX, this.mousedownX) || !equal(this.mouseupY, this.mousedownY)
    },
    get mousedownMappedX(): number {
      return this.mapX(this.mousedownX)
    },
    get mousedownMappedY(): number {
      return this.mapY(this.mousedownY)
    },
    get mouseupMappedX(): number {
      return this.mapX(this.mouseupX)
    },
    get mouseupMappedY(): number {
      return this.mapY(this.mouseupY)
    },
    get mappedX(): number {
      return this.mapX(this.x)
    },
    get mappedY(): number {
      return this.mapY(this.y)
    },
    mapX(x: number) {
      return (x - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale
    },
    mapY(y: number) {
      return (y - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale
    },
    mapBackX(x: number) {
      return x * this.styleGuideScale + ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)
    },
    mapBackY(y: number) {
      return y * this.styleGuideScale + ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)
    },
    styleGuideHistory: [] as StyleGuide[],
    action() {
      this.styleGuideHistory.push(JSON.parse(JSON.stringify(this.styleGuide)))
      if (this.styleGuideHistory.length > 10) {
        this.styleGuideHistory.splice(0, this.styleGuideHistory.length - 10)
      }
    },
    undo() {
      const styleGuide = this.styleGuideHistory.pop()
      if (styleGuide) {
        this.styleGuide = styleGuide
      }
    },
    get allTemplateRegions() {
      if (this.selection.kind === 'template') {
        return Array.from(iterateAllTemplateRegions(this.selection.template, this.styleGuide))
      }
      return []
    },
    get allContentRegions() {
      if (this.selection.kind === 'content') {
        return Array.from(iterateAllContentRegions(this.selection.content, this.styleGuide, this.selection.template))
      }
      return []
    },
    get allNameRegions() {
      if (this.selection.kind === 'template') {
        return Array.from(iterateAllNameRegions(this.selection.template, this.styleGuide, this.styleGuideScale))
      }
      return []
    },
    get targetTemplateRegions() {
      return sortByZ(Array.from(iterateAllTemplateRegions(undefined, this.styleGuide)))
    },
    get targetContentRegions() {
      return sortByZ(Array.from(iterateAllContentRegions(undefined, this.styleGuide)))
    },
    get targetNameRegions() {
      return sortByZ(Array.from(iterateAllNameRegions(undefined, this.styleGuide, this.styleGuideScale)))
    },
    xAlignment: null as number | null,
    yAlignment: null as number | null,
    presetExpressions: presetExpressions,

    commonEditorVisible: false,
    commonEditorEditingFieldName: 'variables' as 'variables' | 'collections' | 'constrains',
  })
  canvasState.styleGuide = styleGuide
  canvasState.canvasWidth = width
  canvasState.canvasHeight = height

  canvasState.applyCanvasSizeChange()
  return canvasState
}

export type CanvasState = ReturnType<typeof createCanvasState>

export function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

function sortByZ<T extends { z: number }>(targets: T[]) {
  return targets.map((t, i) => ({ target: t, index: i })).sort((a, b) => {
    if (a.target.z !== b.target.z) {
      return b.target.z - a.target.z
    }
    return b.index - a.index
  }).map((t) => t.target)
}

import { reactive } from 'vue'

import { StyleGuide } from '../model'
import { iterateAllNameRegions } from '../utils'
import { presetExpressions } from '../preset-expressions'
import { createViewport } from './viewport'
import { createContextMenu } from './context-menu'
import { createAlignment } from './alignment-layer'
import { createStyleGuide, sortByZ } from './style-guide'
import { createMask } from './mask-layer'

export function createCanvasState(styleGuide: StyleGuide, width: number, height: number) {
  const canvasState = reactive({
    applyCanvasSizeChange() {
      const widthScale = this.viewport.width / this.styleGuide.width
      const heightScale = this.viewport.height / this.styleGuide.height
      this.viewport.scale = Math.min(widthScale, heightScale) * 0.9
      const x = this.styleGuide.width * (widthScale - this.viewport.scale) / 2
      const y = this.styleGuide.height * (heightScale - this.viewport.scale) / 2
      this.viewport.translateX = (x - this.styleGuide.x * this.viewport.scale - this.styleGuide.width / 2) / this.viewport.scale + this.styleGuide.width / 2
      this.viewport.translateY = (y - this.styleGuide.y * this.viewport.scale - this.styleGuide.height / 2) / this.viewport.scale + this.styleGuide.height / 2
    },
    viewport: createViewport(width, height),
    mask: createMask(),
    addKind: undefined as 'template' | 'image' | 'text' | 'color' | undefined,
    contextMenu: createContextMenu(),
    styleGuide: createStyleGuide(styleGuide),
    get isDraggingForSelection() {
      return this.mask.moved && this.mask.mousePressing && !this.styleGuide.hasRelationWithSelection
    },
    get mappedX(): number {
      return this.mapX(this.mask.x)
    },
    get mappedY(): number {
      return this.mapY(this.mask.y)
    },
    mapX(x: number) {
      return this.viewport.mapX(x, this.styleGuide.width)
    },
    mapY(y: number) {
      return this.viewport.mapY(y, this.styleGuide.height)
    },
    get allNameRegions() {
      if (this.styleGuide.selection.kind === 'template') {
        return Array.from(iterateAllNameRegions(this.styleGuide.selection.template, this.styleGuide.data, this.viewport.scale))
      }
      return []
    },
    get targetNameRegions() {
      return sortByZ(Array.from(iterateAllNameRegions(undefined, this.styleGuide.data, this.viewport.scale)))
    },
    alignment: createAlignment(),
    presetExpressions: presetExpressions,

    commonEditorVisible: false,
    commonEditorEditingFieldName: 'variables' as 'variables' | 'collections' | 'constrains',
  })
  canvasState.applyCanvasSizeChange()
  return canvasState
}

export type CanvasState = ReturnType<typeof createCanvasState>

export function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

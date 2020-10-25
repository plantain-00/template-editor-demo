import { reactive } from 'vue'

import { StyleGuide } from '../model'
import { iterateAllNameRegions } from '../utils'
import { presetExpressions } from '../preset-expressions'
import { createViewport } from '../engine/viewport'
import { createContextMenu } from './context-menu'
import { createAlignment } from './alignment-layer'
import { createStyleGuide, sortByZ } from './style-guide'
import { createMask } from './mask-layer'

export function createCanvasState(styleGuide: StyleGuide, width: number, height: number) {
  const canvasState = reactive({
    applyCanvasSizeChange() {
      this.viewport.applyRegionChange(this.styleGuide)
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

    showImageViewer: false,
  })
  canvasState.applyCanvasSizeChange()
  return canvasState
}

export type CanvasState = ReturnType<typeof createCanvasState>

export function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

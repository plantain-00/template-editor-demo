import { CanvasSelection, StyleGuide, Template } from '../model'
import { iterateAllContentRegions, iterateAllTemplateRegions } from '../utils'

export function createStyleGuide(styleGuide: StyleGuide) {
  return {
    data: styleGuide,
    get x() {
      return Math.min(...this.data.templates.map((t: Template) => t.x))
    },
    get y() {
      return Math.min(...this.data.templates.map((t: Template) => t.y))
    },
    hasRelationWithSelection: false,
    _width: 0,
    get width(): number {
      if (this.hasRelationWithSelection) {
        return this._width
      }
      const maxX = Math.max(...this.data.templates.map((t) => t.x + t.width))
      const width = Math.max(maxX - this.x, 10)
      this._width = width
      return width
    },
    _height: 0,
    get height(): number {
      if (this.hasRelationWithSelection) {
        return this._height
      }
      const maxY = Math.max(...this.data.templates.map((t) => t.y + t.height))
      const height = Math.max(maxY - this.y, 10)
      this._height = height
      return height
    },
    history: [] as StyleGuide[],
    action() {
      this.history.push(JSON.parse(JSON.stringify(this.data)))
      if (this.history.length > 10) {
        this.history.splice(0, this.history.length - 10)
      }
    },
    undo() {
      const styleGuide = this.history.pop()
      if (styleGuide) {
        this.data = styleGuide
      }
    },
    selection: {
      kind: 'none'
    } as CanvasSelection,
    get allTemplateRegions() {
      if (this.selection.kind === 'template') {
        return Array.from(iterateAllTemplateRegions(this.selection.template, this.data))
      }
      return []
    },
    get allContentRegions() {
      if (this.selection.kind === 'content') {
        return Array.from(iterateAllContentRegions(this.selection.content, this.data, this.selection.template))
      }
      return []
    },
    get targetTemplateRegions() {
      return sortByZ(Array.from(iterateAllTemplateRegions(undefined, this.data)))
    },
    get targetContentRegions() {
      return sortByZ(Array.from(iterateAllContentRegions(undefined, this.data)))
    },
  }
}

export type StyleGuideModel = ReturnType<typeof createStyleGuide>

export function sortByZ<T extends { z: number }>(targets: T[]) {
  return targets.map((t, i) => ({ target: t, index: i })).sort((a, b) => {
    if (a.target.z !== b.target.z) {
      return b.target.z - a.target.z
    }
    return b.index - a.index
  }).map((t) => t.target)
}

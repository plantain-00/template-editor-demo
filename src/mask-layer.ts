import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { StyleGuide, Region, Position, TemplateContent, Template } from './model'
import { maskLayerTemplateHtml, maskLayerTemplateHtmlStatic } from './variables'

@Component({
  render: maskLayerTemplateHtml,
  staticRenderFns: maskLayerTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class MaskLayer extends Vue {
  private canvasState!: CanvasState

  private draggingSelectionOffsetX = 0
  private draggingSelectionOffsetY = 0
  private x = 0
  private y = 0

  get maskStyle() {
    let cursor: string

    let isInSelectionRegion = false
    if (this.canvasState.selection.kind === 'template') {
      const x = this.canvasState.mapX(this.x)
      const y = this.canvasState.mapY(this.y)
      isInSelectionRegion = isInRegion({ x, y }, this.canvasState.selection.template)
    }

    if (isInSelectionRegion || this.canvasState.isDraggingForMoving) {
      cursor = 'move'
    } else if (this.canvasState.isDraggingForSelection) {
      cursor = 'crosshair'
    } else {
      cursor = 'auto'
    }
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      opacity: 0,
      cursor
    }
  }

  wheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.deltaY > 0) {
        this.canvasState.styleGuideScale *= 0.99
      } else if (e.deltaY < 0) {
        this.canvasState.styleGuideScale *= 1.01
      }
    } else {
      this.canvasState.styleGuideTranslateX -= e.deltaX
      this.canvasState.styleGuideTranslateY -= e.deltaY
    }
  }

  mousedown(e: MouseEvent) {
    this.canvasState.mousedownX = e.offsetX
    this.canvasState.mousedownY = e.offsetY
    this.canvasState.mouseupX = e.offsetX
    this.canvasState.mouseupY = e.offsetY
    this.canvasState.mousePressing = true

    if (this.canvasState.selection.kind === 'template') {
      const x = this.canvasState.mousedownMappedX
      const y = this.canvasState.mousedownMappedY
      this.canvasState.isDraggingForMoving = isInRegion({ x, y }, this.canvasState.selection.template)
      if (this.canvasState.isDraggingForMoving) {
        this.draggingSelectionOffsetX = x - this.canvasState.selection.template.x
        this.draggingSelectionOffsetY = y - this.canvasState.selection.template.y
      }
    }
  }

  mousemove(e: MouseEvent) {
    this.x = e.offsetX
    this.y = e.offsetY

    if (this.canvasState.mousePressing) {
      this.canvasState.mouseupX = e.offsetX
      this.canvasState.mouseupY = e.offsetY
    }
    if (this.canvasState.isDraggingForMoving) {
      if (this.canvasState.selection.kind === 'template') {
        this.canvasState.selection.template.x = this.canvasState.mouseupMappedX - this.draggingSelectionOffsetX
        this.canvasState.selection.template.y = this.canvasState.mouseupMappedY - this.draggingSelectionOffsetY
      }
    }
    this.canvasState.applyChangesIfAuto()
  }

  mouseup(e: MouseEvent) {
    this.canvasState.mouseupX = e.offsetX
    this.canvasState.mouseupY = e.offsetY

    if (this.canvasState.isDraggingForMoving) {
      this.canvasState.isDraggingForMoving = false
      this.canvasState.mousePressing = false
      return
    }

    const x = this.canvasState.mouseupMappedX
    const y = this.canvasState.mouseupMappedY
    if (this.canvasState.isDraggingForSelection) {
      const template = selectTemplate(this.canvasState.styleGuide, { x, y }, { x: this.canvasState.mousedownMappedX, y: this.canvasState.mousedownMappedY })
      this.canvasState.selection = template ? { kind: 'template', template } : { kind: 'none' }
    } else {
      const content = selectContent(this.canvasState.styleGuide, { x, y })
      this.canvasState.selection = content ? { kind: 'content', ...content } : { kind: 'none' }
    }
    this.canvasState.applyChangesIfAuto()

    this.canvasState.mousePressing = false
  }
}

function selectTemplate(styleGuide: StyleGuide, position1: Position, position2: Position) {
  const region: Region = {
    x: Math.min(position1.x, position2.x),
    y: Math.min(position1.y, position2.y),
    width: Math.abs(position1.x - position2.x),
    height: Math.abs(position1.y - position2.y),
  }
  for (const template of styleGuide.templates) {
    const positions: Position[] = [
      {
        x: template.x,
        y: template.y,
      },
      {
        x: template.x + template.width,
        y: template.y + template.height,
      },
    ]
    if (isInRegion(positions, region)) {
      return template
    }
  }
  return null
}

function selectContent(styleGuide: StyleGuide, position: Position): { content: TemplateContent, template: Template } | null {
  for (const template of styleGuide.templates) {
    if (isInRegion(position, template)) {
      const templateContent = selectReferenceContent(template, template, position, styleGuide)
      if (templateContent) {
        return templateContent
      }
    }
  }
  return null
}

function selectReferenceContent(template: Template, basePosition: Position, position: Position, styleGuide: StyleGuide): { content: TemplateContent, template: Template } | null {
  for (const content of template.contents) {
    const contentPosition = { x: content.x + basePosition.x, y: content.y + basePosition.y }
    if (content.kind === 'image' || content.kind === 'text') {
      if (isInRegion(position, { ...contentPosition, width: content.width, height: content.height })) {
        return { content, template }
      }
    } else if (content.kind === 'reference') {
      const reference = styleGuide.templates.find((t) => t.id === content.id)
      if (reference) {
        const referenceContent = selectReferenceContent(reference, contentPosition, position, styleGuide)
        if (referenceContent) {
          return referenceContent
        }
      }
    }
  }
  return null
}

function isInRegion(position: Position | Position[], region: Region): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

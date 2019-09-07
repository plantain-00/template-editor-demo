import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { StyleGuide, Region, Position, TemplateContent, Template, TemplateReferenceContent } from './model'
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
  private draggingSelectionContent: TemplateReferenceContent | undefined
  private x = 0
  private y = 0

  get maskStyle() {
    let cursor: string

    const relation = this.getSelectionAreaRelation({
      x: this.canvasState.mapX(this.x),
      y: this.canvasState.mapY(this.y)
    })

    if (relation || this.canvasState.isDraggingForMoving) {
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

    const relation = this.getSelectionAreaRelation({
      x: this.canvasState.mousedownMappedX,
      y: this.canvasState.mousedownMappedY
    })
    this.canvasState.isDraggingForMoving = !!relation
    if (relation) {
      this.draggingSelectionOffsetX = relation.offsetX
      this.draggingSelectionOffsetY = relation.offsetY
      this.draggingSelectionContent = relation.content
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
        if (this.draggingSelectionContent) {
          this.draggingSelectionContent.x = this.canvasState.mouseupMappedX - this.draggingSelectionOffsetX
          this.draggingSelectionContent.y = this.canvasState.mouseupMappedY - this.draggingSelectionOffsetY
        } else {
          this.canvasState.selection.template.x = this.canvasState.mouseupMappedX - this.draggingSelectionOffsetX
          this.canvasState.selection.template.y = this.canvasState.mouseupMappedY - this.draggingSelectionOffsetY
        }
      } else if (this.canvasState.selection.kind === 'content') {
        this.canvasState.selection.content.x = this.canvasState.mouseupMappedX - this.draggingSelectionOffsetX
        this.canvasState.selection.content.y = this.canvasState.mouseupMappedY - this.draggingSelectionOffsetY
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

  private getSelectionAreaRelation(position: Position) {
    if (this.canvasState.selection.kind === 'template') {
      for (const template of this.canvasState.styleGuide.templates) {
        for (const templatePosition of iterateAllTemplate(
          this.canvasState.selection.template,
          template,
          {
            x: template.x,
            y: template.y
          },
          this.canvasState.styleGuide
        )) {
          const isInSelectionRegion = isInRegion(
            position,
            {
              x: templatePosition.x,
              y: templatePosition.y,
              width: this.canvasState.selection.template.width,
              height: this.canvasState.selection.template.height,
            }
          )
          if (isInSelectionRegion) {
            if (templatePosition.content) {
              return {
                offsetX: position.x - templatePosition.content.x,
                offsetY: position.y - templatePosition.content.y,
                content: templatePosition.content
              }
            }
            return {
              offsetX: position.x - templatePosition.x,
              offsetY: position.y - templatePosition.y,
            }
          }
        }
      }
    } else if (this.canvasState.selection.kind === 'content'
      && (this.canvasState.selection.content.kind === 'image'
        || this.canvasState.selection.content.kind === 'text')) {
      const isInSelectionRegion = isInRegion(
        position,
        {
          x: this.canvasState.selection.content.x + this.canvasState.selection.template.x,
          y: this.canvasState.selection.content.y + this.canvasState.selection.template.y,
          width: this.canvasState.selection.content.width,
          height: this.canvasState.selection.content.height,
        })
      if (isInSelectionRegion) {
        return {
          offsetX: position.x - this.canvasState.selection.content.x,
          offsetY: position.y - this.canvasState.selection.content.y,
          content: undefined
        }
      }
    }
    return undefined
  }
}

function* iterateAllTemplate(
  target: Template,
  template: Template,
  position: Position & { content?: TemplateReferenceContent },
  styleGuide: StyleGuide,
): Generator<Position & { content?: TemplateReferenceContent }, void, unknown> {
  if (template === target) {
    yield position
  } else {
    for (const content of template.contents) {
      if (content.kind === 'reference') {
        const referenceTemplate = styleGuide.templates.find((t) => t.id === content.id)
        if (referenceTemplate) {
          yield* iterateAllTemplate(
            target,
            referenceTemplate,
            {
              x: content.x + position.x,
              y: content.y + position.y,
              content,
            },
            styleGuide,
          )
        }
      }
    }
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

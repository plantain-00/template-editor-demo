import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { StyleGuide, Region, Position, TemplateContent, Template, TemplateReferenceContent, CanvasSelection } from './model'
import { iterateAllContentPositions, iterateAllTemplatePositions, isInRegion } from './utils'
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
  private clipboard: CanvasSelection = {
    kind: 'none'
  }

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
      // zoom canvas
      e.preventDefault();
      e.stopImmediatePropagation();
      let newScale = 1
      if (e.deltaY > 0) {
        newScale = this.canvasState.styleGuideScale * 0.98
      } else if (e.deltaY < 0) {
        newScale = this.canvasState.styleGuideScale / 0.98
      }
      const newTranslateX = (e.offsetX - this.canvasState.mapX(e.offsetX) * newScale - this.canvasState.styleGuideWidth / 2) / newScale + this.canvasState.styleGuideWidth / 2
      const newTranslateY = (e.offsetY - this.canvasState.mapY(e.offsetY) * newScale - this.canvasState.styleGuideHeight / 2) / newScale + this.canvasState.styleGuideHeight / 2
      this.canvasState.styleGuideScale = newScale
      this.canvasState.styleGuideTranslateX = newTranslateX
      this.canvasState.styleGuideTranslateY = newTranslateY
    } else {
      // move canvas
      this.canvasState.styleGuideTranslateX -= e.deltaX / this.canvasState.styleGuideScale
      this.canvasState.styleGuideTranslateY -= e.deltaY / this.canvasState.styleGuideScale
    }
  }

  mousedown(e: MouseEvent) {
    // add content
    if (this.canvasState.addKind) {
      this.canvasState.action()
      const x = this.canvasState.mapX(e.offsetX)
      const y = this.canvasState.mapY(e.offsetY)
      if (this.canvasState.addKind === 'template') {
        const newTemplate: Template = {
          id: Math.random().toString(),
          x: x - 250,
          y: y - 150,
          width: 500,
          height: 300,
          contents: [],
        }
        this.canvasState.styleGuide.templates.push(newTemplate)
        this.canvasState.selection = {
          kind: 'template',
          template: newTemplate,
        }
      } else {
        const template = selectPositionTemplate(this.canvasState.styleGuide, { x, y })
        if (template) {
          if (this.canvasState.addKind === 'text') {
            const newContent: TemplateContent = {
              kind: 'text',
              text: '',
              color: '#000000',
              fontFamily: 'Aria',
              fontSize: 12,
              x: x - template.x - 50,
              y: y - template.y - 50,
              width: 100,
              height: 100,
              characters: [],
            }
            template.contents.push(newContent)
            this.canvasState.selection = {
              kind: 'content',
              content: newContent,
              template,
            }
          } else if (this.canvasState.addKind === 'image') {
            const newContent: TemplateContent = {
              kind: 'image',
              url: '',
              x: x - template.x - 50,
              y: y - template.y - 50,
              width: 100,
              height: 100,
            }
            template.contents.push(newContent)
            this.canvasState.selection = {
              kind: 'content',
              content: newContent,
              template,
            }
          }
        }
      }
      this.canvasState.addKind = undefined
      this.canvasState.applyChangesIfAuto()
      return
    }

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

    // move content or template
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
      this.canvasState.applyChangesIfAuto()
    }
  }

  mouseup(e: MouseEvent) {
    this.canvasState.mouseupX = e.offsetX
    this.canvasState.mouseupY = e.offsetY

    if (this.canvasState.isDraggingForMoving) {
      // contants before and after moving
      const constantsX = (this.canvasState.styleGuideTranslateX - this.canvasState.styleGuideWidth / 2) * this.canvasState.styleGuideScale + this.canvasState.styleGuideWidth / 2
      const constantsY = (this.canvasState.styleGuideTranslateY - this.canvasState.styleGuideHeight / 2) * this.canvasState.styleGuideScale + this.canvasState.styleGuideHeight / 2
      
      this.canvasState.isDraggingForMoving = false
      // keep canvas stable
      this.canvasState.styleGuideTranslateX = (constantsX - this.canvasState.styleGuideWidth / 2) / this.canvasState.styleGuideScale + this.canvasState.styleGuideWidth / 2
      this.canvasState.styleGuideTranslateY = (constantsY - this.canvasState.styleGuideHeight / 2) / this.canvasState.styleGuideScale + this.canvasState.styleGuideHeight / 2

      this.canvasState.mousePressing = false
      if (this.canvasState.moved) {
        return
      }
    }

    // set selection after dragging or click
    const x = this.canvasState.mouseupMappedX
    const y = this.canvasState.mouseupMappedY
    if (this.canvasState.isDraggingForSelection) {
      const template = selectTemplate(this.canvasState.styleGuide, { x, y }, { x: this.canvasState.mousedownMappedX, y: this.canvasState.mousedownMappedY })
      this.canvasState.selection = template ? { kind: 'template', template } : { kind: 'none' }
    } else {
      const content = selectContent(this.canvasState.styleGuide, { x, y })
      if (content) {
        if (content.kind === 'content') {
          this.canvasState.selection = {
            kind: 'content',
            content: content.content,
            template: content.template
          }
        } else if (content.kind === 'template') {
          this.canvasState.selection = {
            kind: 'template',
            template: content.template
          }
        }
      } else {
        this.canvasState.selection = { kind: 'none' }
      }
    }
    this.canvasState.applyChangesIfAuto()

    this.canvasState.mousePressing = false
  }

  contextmenu(e: MouseEvent) {
    this.canvasState.contextMenuEnabled = true
    this.canvasState.contextMenuX = e.offsetX
    this.canvasState.contextMenuY = e.offsetY
    this.canvasState.mousePressing = false
    e.preventDefault()
  }

  keydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        if (this.canvasState.selection.kind !== 'none') {
          this.clipboard = this.canvasState.selection
        }
      } else if (e.key === 'v') {
        if (this.clipboard.kind === 'template') {
          this.canvasState.action()
          if (this.canvasState.selection.kind === 'template') {
            if (this.clipboard.template !== this.canvasState.selection.template) {
              const newContent: TemplateContent = {
                kind: 'reference',
                id: this.clipboard.template.id,
                x: 0,
                y: 0,
              }
              this.canvasState.selection.template.contents.push(newContent)
              this.canvasState.selection = {
                kind: 'content',
                content: newContent,
                template: this.canvasState.selection.template,
              }
              this.canvasState.applyChangesIfAuto()
            }
          } else if (this.canvasState.selection.kind === 'none') {
            const newTemplate: Template = JSON.parse(JSON.stringify(this.clipboard.template))
            newTemplate.id = Math.random().toString()
            newTemplate.x = 0
            newTemplate.y = 0
            this.canvasState.styleGuide.templates.push(newTemplate)
            this.canvasState.selection = {
              kind: 'template',
              template: newTemplate,
            }
            this.canvasState.applyChangesIfAuto()
          }
        }
      } else if (e.key === 'z') {
        this.canvasState.undo()
      }
    }
  }

  private getSelectionAreaRelation(position: Position) {
    if (this.canvasState.selection.kind === 'template') {
      for (const templatePosition of iterateAllTemplatePositions(this.canvasState.selection.template, this.canvasState.styleGuide)) {
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
    } else if (this.canvasState.selection.kind === 'content') {
      const content = this.canvasState.selection.content
      if (content.kind === 'image' || content.kind === 'text') {
        for (const contentPosition of iterateAllContentPositions(content, this.canvasState.styleGuide)) {
          const isInSelectionRegion = isInRegion(
            position,
            {
              x: contentPosition.x,
              y: contentPosition.y,
              width: content.width,
              height: content.height,
            })
          if (isInSelectionRegion) {
            return {
              offsetX: position.x - content.x,
              offsetY: position.y - content.y,
              content: undefined
            }
          }
        }
      } else if (content.kind === 'reference') {
        const reference = this.canvasState.styleGuide.templates.find((t) => t.id === content.id)
        if (reference) {
          for (const contentPosition of iterateAllContentPositions(content, this.canvasState.styleGuide)) {
            const isInSelectionRegion = isInRegion(
              position,
              {
                x: contentPosition.x,
                y: contentPosition.y,
                width: reference.width,
                height: reference.height,
              })
            if (isInSelectionRegion) {
              return {
                offsetX: position.x - content.x,
                offsetY: position.y - content.y,
                content: undefined
              }
            }
          }
        }
      } else if (content.kind === 'snapshot') {
        for (const contentPosition of iterateAllContentPositions(content, this.canvasState.styleGuide)) {
          const isInSelectionRegion = isInRegion(
            position,
            {
              x: contentPosition.x,
              y: contentPosition.y,
              width: content.snapshot.width,
              height: content.snapshot.height,
            })
          if (isInSelectionRegion) {
            return {
              offsetX: position.x - content.x,
              offsetY: position.y - content.y,
              content: undefined
            }
          }
        }
      }
    }
    return undefined
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

function selectContent(styleGuide: StyleGuide, position: Position): { kind: 'content', content: TemplateContent, template: Template } | { kind: 'template', template: Template } | null {
  for (const template of styleGuide.templates) {
    const templateContent = selectReferenceContent(template, template, position, styleGuide)
    if (templateContent) {
      return { kind: 'content', ...templateContent }
    }
  }
  const t = selectPositionTemplate(styleGuide, position)
  if (t) {
    return { kind: 'template', template: t }
  }
  return null
}

function selectPositionTemplate(styleGuide: StyleGuide, position: Position): Template | null {
  for (const template of styleGuide.templates) {
    if (isInRegion(position, template)) {
      return template
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
        if (isInRegion(position, { ...contentPosition, width: reference.width, height: reference.height })) {
          return { content, template }
        }
        const referenceContent = selectReferenceContent(reference, contentPosition, position, styleGuide)
        if (referenceContent) {
          return referenceContent
        }
      }
    } else if (content.kind === 'snapshot') {
      const referenceContent = selectReferenceContent(content.snapshot, contentPosition, position, styleGuide)
      if (referenceContent) {
        return referenceContent
      }
      if (isInRegion(position, { ...contentPosition, width: content.snapshot.width, height: content.snapshot.height })) {
        return { content, template }
      }
    }
  }
  return null
}

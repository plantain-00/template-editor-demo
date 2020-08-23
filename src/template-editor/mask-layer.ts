import Vue from 'vue'
import Component from 'vue-class-component'

import { CanvasState } from './canvas-state'
import { TemplateContent, Template, TemplateReferenceContent, CanvasSelection } from '../model'
import { selectTemplateRegionByPosition, selectContentOrTemplateByPosition, getPositionAndSelectionAreaRelation, selectTemplateByArea, RegionSide } from './utils'
import { templateEditorMaskLayerTemplateHtml, templateEditorMaskLayerTemplateHtmlStatic } from '../variables'
import { formatPixel, rotatePositionByCenter } from '../utils'
import { resizeTemplate, resizeContent, rotateContent } from './resize'
import { getCursor } from './cursor'
import { getTemplateAlignment } from './alignment'

@Component({
  render: templateEditorMaskLayerTemplateHtml,
  staticRenderFns: templateEditorMaskLayerTemplateHtmlStatic,
  props: ['canvasState']
})
export class MaskLayer extends Vue {
  private canvasState!: CanvasState

  private draggingSelectionOffsetX = 0
  private draggingSelectionOffsetY = 0
  private draggingSelectionRotate = 0
  private draggingSelectionContent: TemplateReferenceContent | undefined
  private clipboard: CanvasSelection = {
    kind: 'none'
  }
  private mouseIsDown = false
  private draggingSelectionKind: 'move' | 'grab' | 'grabbing' | RegionSide | undefined
  private draggingSelectionWidth = 0
  private draggingSelectionHeight = 0
  private draggingSelectionX = 0
  private draggingSelectionY = 0

  get maskStyle() {
    let cursor: string
    if (this.canvasState.addKind) {
      cursor = 'grabbing'
    } else if (this.canvasState.hasRelationWithSelection) {
      if (this.draggingSelectionKind) {
        cursor = getCursor(this.draggingSelectionKind, this.canvasState)
      } else {
        cursor = 'move'
      }
    } else {
      const relation = getPositionAndSelectionAreaRelation(this.canvasState, {
        x: this.canvasState.mappedX,
        y: this.canvasState.mappedY
      })
      if (relation) {
        cursor = getCursor(relation.kind, this.canvasState)
      } else if (this.canvasState.isDraggingForSelection) {
        cursor = 'crosshair'
      } else {
        cursor = 'auto'
      }
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
    this.mouseIsDown = true
    // add content
    if (this.canvasState.addKind) {
      this.canvasState.action()
      const x = this.canvasState.mapX(e.offsetX)
      const y = this.canvasState.mapY(e.offsetY)
      if (this.canvasState.addKind === 'template') {
        const newTemplate: Template = {
          id: Math.random().toString(),
          x: formatPixel(x - 250),
          y: formatPixel(y - 150),
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
        const templateRegion = selectTemplateRegionByPosition(this.canvasState, { x, y })
        if (templateRegion) {
          const newContentX = formatPixel(x - templateRegion.template.x - 50)
          const newContentY = formatPixel(y - templateRegion.template.y - 50)
          if (this.canvasState.addKind === 'text') {
            const newContent: TemplateContent = {
              kind: 'text',
              text: '',
              color: '#000000',
              fontFamily: 'Aria',
              fontSize: 12,
              x: newContentX,
              y: newContentY,
              width: 100,
              height: 100,
            }
            templateRegion.template.contents.push(newContent)
            this.canvasState.selection = {
              kind: 'content',
              content: newContent,
              template: templateRegion.template,
            }
          } else if (this.canvasState.addKind === 'image') {
            const newContent: TemplateContent = {
              kind: 'image',
              url: '',
              x: newContentX,
              y: newContentY,
              width: 100,
              height: 100,
            }
            templateRegion.template.contents.push(newContent)
            this.canvasState.selection = {
              kind: 'content',
              content: newContent,
              template: templateRegion.template,
            }
          } else if (this.canvasState.addKind === 'color') {
            const newContent: TemplateContent = {
              kind: 'color',
              color: '#000',
              x: newContentX,
              y: newContentY,
              width: 100,
              height: 100,
            }
            templateRegion.template.contents.push(newContent)
            this.canvasState.selection = {
              kind: 'content',
              content: newContent,
              template: templateRegion.template,
            }
          }
        }
      }
      this.canvasState.addKind = undefined
      return
    }

    this.canvasState.mousedownX = e.offsetX
    this.canvasState.mousedownY = e.offsetY
    this.canvasState.mouseupX = e.offsetX
    this.canvasState.mouseupY = e.offsetY
    this.canvasState.mousePressing = true

    const relation = getPositionAndSelectionAreaRelation(this.canvasState, {
      x: this.canvasState.mousedownMappedX,
      y: this.canvasState.mousedownMappedY
    })
    this.canvasState.hasRelationWithSelection = !!relation
    if (relation) {
      this.draggingSelectionOffsetX = relation.offsetX
      this.draggingSelectionOffsetY = relation.offsetY
      this.draggingSelectionRotate = relation.rotate
      this.draggingSelectionContent = relation.content
      if (relation.kind === 'grab') {
        this.draggingSelectionKind = 'grabbing'
      } else {
        this.draggingSelectionKind = relation.kind
      }
      if (this.canvasState.selection.kind === 'template') {
        this.draggingSelectionWidth = this.canvasState.selection.template.width
        this.draggingSelectionHeight = this.canvasState.selection.template.height
      } else if (this.canvasState.selection.kind === 'content') {
        const content = this.canvasState.selection.content
        if (content.kind !== 'reference') {
          this.draggingSelectionX = content.x
          this.draggingSelectionY = content.y
          if (content.kind === 'snapshot') {
            this.draggingSelectionWidth = content.snapshot.width
            this.draggingSelectionHeight = content.snapshot.height
          } else {
            this.draggingSelectionWidth = content.width
            this.draggingSelectionHeight = content.height
          }
        }
      }
    }
  }

  mousemove(e: MouseEvent) {
    this.canvasState.x = e.offsetX
    this.canvasState.y = e.offsetY

    if (this.canvasState.mousePressing) {
      this.canvasState.mouseupX = e.offsetX
      this.canvasState.mouseupY = e.offsetY
    }

    // move, resize, rotate content or template
    if (this.canvasState.hasRelationWithSelection) {
      if (this.canvasState.selection.kind === 'template') {
        const x = this.canvasState.mouseupMappedX - this.canvasState.mousedownMappedX + this.draggingSelectionOffsetX
        const y = this.canvasState.mouseupMappedY - this.canvasState.mousedownMappedY + this.draggingSelectionOffsetY
        if (this.draggingSelectionContent) {
          this.draggingSelectionContent.x = formatPixel(x)
          this.draggingSelectionContent.y = formatPixel(y)
        } else if (this.draggingSelectionKind) {
          const template = this.canvasState.selection.template
          if (this.draggingSelectionKind === 'move') {
            if (e.shiftKey) {
              const region = getTemplateAlignment(x, y, template, this.canvasState.targetTemplateRegions)
              if (region.x !== undefined) {
                template.x = formatPixel(region.x)
                this.canvasState.xAlignment = region.x
              } else {
                template.x = formatPixel(x)
                this.canvasState.xAlignment = null
              }
              if (region.y !== undefined) {
                template.y = formatPixel(region.y)
                this.canvasState.yAlignment = region.y
              } else {
                template.y = formatPixel(y)
                this.canvasState.yAlignment = null
              }
              return
            }
            template.x = formatPixel(x)
            template.y = formatPixel(y)
            this.canvasState.xAlignment = null
            this.canvasState.yAlignment = null
            return
          }
          resizeTemplate(template, x, y, this.draggingSelectionWidth, this.draggingSelectionHeight, this.draggingSelectionKind)
        }
      } else if (this.canvasState.selection.kind === 'content') {
        if (this.canvasState.selection.template.display === 'flex' || !this.draggingSelectionKind) {
          return
        }
        const content = this.canvasState.selection.content
        const offsetX = this.canvasState.mouseupMappedX - this.canvasState.mousedownMappedX
        const offsetY = this.canvasState.mouseupMappedY - this.canvasState.mousedownMappedY
        const newPosition = rotatePositionByCenter({ x: offsetX, y: offsetY }, { x: 0, y: 0 }, this.draggingSelectionRotate)
        const x = newPosition.x + this.draggingSelectionOffsetX
        const y = newPosition.y + this.draggingSelectionOffsetY
        if (this.draggingSelectionKind === 'move') {
          content.x = formatPixel(x)
          content.y = formatPixel(y)
          return
        }
        if (this.draggingSelectionKind === 'grabbing' && content.kind !== 'reference') {
          const rotate = rotateContent(this.canvasState.mouseupMappedX - this.draggingSelectionOffsetX, this.canvasState.mouseupMappedY - this.draggingSelectionOffsetY)
          if (rotate !== undefined) {
            Vue.set(content, 'rotate', rotate - this.draggingSelectionRotate)
          }
          return
        }
        resizeContent(
          content,
          x,
          y,
          this.draggingSelectionX,
          this.draggingSelectionY,
          this.draggingSelectionWidth,
          this.draggingSelectionHeight,
          this.draggingSelectionKind,
        )
      }
    }
  }

  mouseup(e: MouseEvent) {
    this.canvasState.xAlignment = null
    this.canvasState.yAlignment = null
    
    if (!this.mouseIsDown) {
      return
    }
    this.mouseIsDown = false
    this.canvasState.mouseupX = e.offsetX
    this.canvasState.mouseupY = e.offsetY

    if (this.canvasState.hasRelationWithSelection) {
      // contants before and after moving
      const constantsX = (this.canvasState.styleGuideTranslateX - this.canvasState.styleGuideWidth / 2) * this.canvasState.styleGuideScale + this.canvasState.styleGuideWidth / 2
      const constantsY = (this.canvasState.styleGuideTranslateY - this.canvasState.styleGuideHeight / 2) * this.canvasState.styleGuideScale + this.canvasState.styleGuideHeight / 2

      this.canvasState.hasRelationWithSelection = false
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
      const template = selectTemplateByArea(this.canvasState, { x, y }, { x: this.canvasState.mousedownMappedX, y: this.canvasState.mousedownMappedY })
      this.canvasState.selection = template ? { kind: 'template', template } : { kind: 'none' }
    } else {
      const content = selectContentOrTemplateByPosition(this.canvasState, { x, y })
      if (content) {
        if (content.kind === 'content') {
          this.canvasState.selection = {
            kind: 'content',
            content: content.region.content,
            template: content.region.template
          }
        } else if (content.kind === 'template') {
          this.canvasState.selection = {
            kind: 'template',
            template: content.region.template
          }
        }
      } else {
        this.canvasState.selection = { kind: 'none' }
      }
    }

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
          }
        }
      } else if (e.key === 'z') {
        this.canvasState.undo()
      }
    }
  }
}

import { defineComponent, PropType } from 'vue'

import { CanvasState, equal } from './canvas-state'
import { TemplateContent, Template, TemplateReferenceContent, CanvasSelection } from '../model'
import { selectTemplateRegionByPosition, selectContentOrTemplateByPosition, getPositionAndSelectionAreaRelation, selectTemplateByArea, RegionSide } from './utils'
import { templateEditorMaskLayerTemplateHtml } from '../variables'
import { formatPixel, rotatePositionByCenter } from '../utils'
import { resizeTemplate, resizeContent, rotateContent } from './resize'
import { getCursor } from './cursor'
import { getTemplateAlignment } from './alignment'

export const MaskLayer = defineComponent({
  render: templateEditorMaskLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  data: () => {
    return {
      draggingSelectionOffsetX: 0,
      draggingSelectionOffsetY: 0,
      draggingSelectionRotate: 0,
      draggingSelectionContent: undefined as TemplateReferenceContent | undefined,
      clipboard: {
        kind: 'none'
      } as CanvasSelection,
      mouseIsDown: false,
      draggingSelectionKind: undefined as 'move' | 'grab' | 'grabbing' | RegionSide | undefined,
      draggingSelectionWidth: 0,
      draggingSelectionHeight: 0,
      draggingSelectionX: 0,
      draggingSelectionY: 0,
    }
  },
  computed: {
    maskStyle(): { [name: string]: unknown } {
      let cursor: string
      if (this.canvasState.addKind) {
        cursor = 'grabbing'
      } else if (this.canvasState.styleGuide.hasRelationWithSelection) {
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
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        opacity: 0,
        cursor
      }
    },
    mouseupMappedX(): number {
      return this.canvasState.mapX(this.canvasState.mask.mouseupX)
    },
    mouseupMappedY(): number {
      return this.canvasState.mapY(this.canvasState.mask.mouseupY)
    },
    mousedownMappedX(): number {
      return this.canvasState.mapX(this.canvasState.mask.mousedownX)
    },
    mousedownMappedY(): number {
      return this.canvasState.mapY(this.canvasState.mask.mousedownY)
    },
  },
  methods: {
    wheel(e: WheelEvent) {
      this.canvasState.viewport.zoom(e, this.canvasState.styleGuide.width, this.canvasState.styleGuide.height)
      this.canvasState.viewport.move(e)
    },
    mousedown(e: MouseEvent) {
      this.mouseIsDown = true
      // add content
      if (this.canvasState.addKind) {
        this.canvasState.styleGuide.action()
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
          this.canvasState.styleGuide.data.templates.push(newTemplate)
          this.canvasState.styleGuide.selection = {
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
              this.canvasState.styleGuide.selection = {
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
              this.canvasState.styleGuide.selection = {
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
              this.canvasState.styleGuide.selection = {
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

      this.canvasState.mask.mousedownX = e.offsetX
      this.canvasState.mask.mousedownY = e.offsetY
      this.canvasState.mask.mouseupX = e.offsetX
      this.canvasState.mask.mouseupY = e.offsetY
      this.canvasState.mask.mousePressing = true

      const relation = getPositionAndSelectionAreaRelation(this.canvasState, {
        x: this.mousedownMappedX,
        y: this.mousedownMappedY
      })
      this.canvasState.styleGuide.hasRelationWithSelection = !!relation
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
        if (this.canvasState.styleGuide.selection.kind === 'template') {
          this.draggingSelectionWidth = this.canvasState.styleGuide.selection.template.width
          this.draggingSelectionHeight = this.canvasState.styleGuide.selection.template.height
        } else if (this.canvasState.styleGuide.selection.kind === 'content') {
          const content = this.canvasState.styleGuide.selection.content
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
    },
    mousemove(e: MouseEvent) {
      this.canvasState.mask.x = e.offsetX
      this.canvasState.mask.y = e.offsetY

      if (this.canvasState.mask.mousePressing) {
        this.canvasState.mask.mouseupX = e.offsetX
        this.canvasState.mask.mouseupY = e.offsetY
      }

      // move, resize, rotate content or template
      if (this.canvasState.styleGuide.hasRelationWithSelection) {
        if (this.canvasState.styleGuide.selection.kind === 'template') {
          const x = this.mouseupMappedX - this.mousedownMappedX + this.draggingSelectionOffsetX
          const y = this.mouseupMappedY - this.mousedownMappedY + this.draggingSelectionOffsetY
          if (this.draggingSelectionContent) {
            this.draggingSelectionContent.x = formatPixel(x)
            this.draggingSelectionContent.y = formatPixel(y)
          } else if (this.draggingSelectionKind) {
            const template = this.canvasState.styleGuide.selection.template
            if (this.draggingSelectionKind === 'move') {
              if (e.shiftKey) {
                template.x = formatPixel(x)
                template.y = formatPixel(y)
                this.canvasState.alignment.x = undefined
                this.canvasState.alignment.y = undefined
                return
              }
              const region = getTemplateAlignment(x, y, this.canvasState.viewport.scale, template, this.canvasState.styleGuide.targetTemplateRegions)
              if (region.x !== undefined) {
                template.x = formatPixel(region.x.template)
                this.canvasState.alignment.x = region.x.alignment
              } else {
                template.x = formatPixel(x)
                this.canvasState.alignment.x = undefined
              }
              if (region.y !== undefined) {
                template.y = formatPixel(region.y.template)
                this.canvasState.alignment.y = region.y.alignment
              } else {
                template.y = formatPixel(y)
                this.canvasState.alignment.y = undefined
              }
              return
            }
            resizeTemplate(template, x, y, this.draggingSelectionWidth, this.draggingSelectionHeight, this.draggingSelectionKind)
          }
        } else if (this.canvasState.styleGuide.selection.kind === 'content') {
          if (this.canvasState.styleGuide.selection.template.display === 'flex' || !this.draggingSelectionKind) {
            return
          }
          const content = this.canvasState.styleGuide.selection.content
          const offsetX = this.mouseupMappedX - this.mousedownMappedX
          const offsetY = this.mouseupMappedY - this.mousedownMappedY
          const newPosition = rotatePositionByCenter({ x: offsetX, y: offsetY }, { x: 0, y: 0 }, this.draggingSelectionRotate)
          const x = newPosition.x + this.draggingSelectionOffsetX
          const y = newPosition.y + this.draggingSelectionOffsetY
          if (this.draggingSelectionKind === 'move') {
            content.x = formatPixel(x)
            content.y = formatPixel(y)
            return
          }
          if (this.draggingSelectionKind === 'grabbing' && content.kind !== 'reference') {
            const rotate = rotateContent(this.mouseupMappedX - this.draggingSelectionOffsetX, this.mouseupMappedY - this.draggingSelectionOffsetY)
            if (rotate !== undefined) {
              content.rotate = rotate - this.draggingSelectionRotate
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
    },
    mouseup(e: MouseEvent) {
      this.canvasState.alignment.x = undefined
      this.canvasState.alignment.y = undefined

      if (!this.mouseIsDown) {
        return
      }
      this.mouseIsDown = false
      this.canvasState.mask.mouseupX = e.offsetX
      this.canvasState.mask.mouseupY = e.offsetY

      if (this.canvasState.styleGuide.hasRelationWithSelection) {
        // contants before and after moving
        const constantsX = (this.canvasState.viewport.translateX - this.canvasState.styleGuide.width / 2) * this.canvasState.viewport.scale + this.canvasState.styleGuide.width / 2
        const constantsY = (this.canvasState.viewport.translateY - this.canvasState.styleGuide.height / 2) * this.canvasState.viewport.scale + this.canvasState.styleGuide.height / 2

        this.canvasState.styleGuide.hasRelationWithSelection = false
        // keep canvas stable
        this.canvasState.viewport.translateX = (constantsX - this.canvasState.styleGuide.width / 2) / this.canvasState.viewport.scale + this.canvasState.styleGuide.width / 2
        this.canvasState.viewport.translateY = (constantsY - this.canvasState.styleGuide.height / 2) / this.canvasState.viewport.scale + this.canvasState.styleGuide.height / 2

        this.canvasState.mask.mousePressing = false
        if (this.canvasState.mask.moved) {
          return
        }
      }

      // set selection after dragging or click
      const x = this.mouseupMappedX
      const y = this.mouseupMappedY
      if (this.canvasState.isDraggingForSelection) {
        const template = selectTemplateByArea(this.canvasState, { x, y }, { x: this.mousedownMappedX, y: this.mousedownMappedY })
        this.canvasState.styleGuide.selection = template ? { kind: 'template', template } : { kind: 'none' }
      } else {
        const content = selectContentOrTemplateByPosition(this.canvasState, { x, y })
        if (content) {
          if (content.kind === 'content') {
            this.canvasState.styleGuide.selection = {
              kind: 'content',
              content: content.region.content,
              template: content.region.template
            }
          } else if (content.kind === 'template') {
            this.canvasState.styleGuide.selection = {
              kind: 'template',
              template: content.region.template
            }
          }
        } else {
          this.canvasState.styleGuide.selection = { kind: 'none' }
        }
      }

      this.canvasState.mask.mousePressing = false
    },
    contextmenu(e: MouseEvent) {
      this.canvasState.mask.mousePressing = false
      this.canvasState.contextMenu.open(e)
    },
    keydown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          if (this.canvasState.styleGuide.selection.kind !== 'none') {
            this.clipboard = this.canvasState.styleGuide.selection
          }
        } else if (e.key === 'v') {
          if (this.clipboard.kind === 'template') {
            this.canvasState.styleGuide.action()
            if (this.canvasState.styleGuide.selection.kind === 'template') {
              if (this.clipboard.template !== this.canvasState.styleGuide.selection.template) {
                const newContent: TemplateContent = {
                  kind: 'reference',
                  id: this.clipboard.template.id,
                  x: 0,
                  y: 0,
                }
                this.canvasState.styleGuide.selection.template.contents.push(newContent)
                this.canvasState.styleGuide.selection = {
                  kind: 'content',
                  content: newContent,
                  template: this.canvasState.styleGuide.selection.template,
                }
              }
            } else if (this.canvasState.styleGuide.selection.kind === 'none') {
              const newTemplate: Template = JSON.parse(JSON.stringify(this.clipboard.template))
              newTemplate.id = Math.random().toString()
              newTemplate.x = 0
              newTemplate.y = 0
              this.canvasState.styleGuide.data.templates.push(newTemplate)
              this.canvasState.styleGuide.selection = {
                kind: 'template',
                template: newTemplate,
              }
            }
          }
        } else if (e.key === 'z') {
          this.canvasState.styleGuide.undo()
        }
      }
    }
  }
})

export function createMask() {
  return {
    mousedownX: 0,
    mousedownY: 0,
    mouseupX: 0,
    mouseupY: 0,
    mousePressing: false,
    x: 0,
    y: 0,
    get moved() {
      return !equal(this.mouseupX, this.mousedownX) || !equal(this.mouseupY, this.mousedownY)
    },
  }
}

export type Mask = ReturnType<typeof createMask>

import { defineComponent, PropType } from 'vue'

import { CanvasState } from './canvas-state'
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
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        opacity: 0,
        cursor
      }
    }
  },
  methods: {
    wheel(e: WheelEvent) {
      this.canvasState.viewport.zoom(e, this.canvasState.styleGuideWidth, this.canvasState.styleGuideHeight)
      this.canvasState.viewport.move(e)
    },
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
    },
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
                template.x = formatPixel(x)
                template.y = formatPixel(y)
                this.canvasState.alignment.x = undefined
                this.canvasState.alignment.y = undefined
                return
              }
              const region = getTemplateAlignment(x, y, this.canvasState.viewport.scale, template, this.canvasState.targetTemplateRegions)
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
      this.canvasState.mouseupX = e.offsetX
      this.canvasState.mouseupY = e.offsetY

      if (this.canvasState.hasRelationWithSelection) {
        // contants before and after moving
        const constantsX = (this.canvasState.viewport.translateX - this.canvasState.styleGuideWidth / 2) * this.canvasState.viewport.scale + this.canvasState.styleGuideWidth / 2
        const constantsY = (this.canvasState.viewport.translateY - this.canvasState.styleGuideHeight / 2) * this.canvasState.viewport.scale + this.canvasState.styleGuideHeight / 2

        this.canvasState.hasRelationWithSelection = false
        // keep canvas stable
        this.canvasState.viewport.translateX = (constantsX - this.canvasState.styleGuideWidth / 2) / this.canvasState.viewport.scale + this.canvasState.styleGuideWidth / 2
        this.canvasState.viewport.translateY = (constantsY - this.canvasState.styleGuideHeight / 2) / this.canvasState.viewport.scale + this.canvasState.styleGuideHeight / 2

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
    },
    contextmenu(e: MouseEvent) {
      this.canvasState.mousePressing = false
      this.canvasState.contextMenu.open(e)
    },
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
})

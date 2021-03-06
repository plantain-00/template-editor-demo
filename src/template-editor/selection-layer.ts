import { defineComponent, PropType } from 'vue'
import { templateEditorSelectionLayerTemplateHtml } from '../variables'
import { CanvasState } from './canvas-state'
import { Region, Rotate } from '../model'
import { rotateStickLength, rotateCircleSize, resizeSize } from './utils'

export const SelectionLayer = defineComponent({
  render: templateEditorSelectionLayerTemplateHtml,
  props: {
    canvasState: {
      type: Object as PropType<CanvasState>,
      required: true,
    }
  },
  computed: {
    selectionRegions(): Region[] {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        return this.canvasState.styleGuide.allTemplateRegions
      }
      if (this.canvasState.styleGuide.selection.kind === 'content') {
        return this.canvasState.styleGuide.allContentRegions
      }
      return []
    },
    canResizeRegions(): Region[] {
      if (this.canvasState.styleGuide.selection.kind === 'template') {
        return this.canvasState.styleGuide.allTemplateRegions.filter((t) => !t.parent)
      }
      if (this.canvasState.styleGuide.selection.kind === 'content') {
        return this.canvasState.styleGuide.allContentRegions.filter((t) => t.content.kind !== 'reference')
      }
      return []
    },
    canRotateRegion(): Region | undefined {
      if (this.canvasState.styleGuide.selection.kind === 'content') {
        return this.canvasState.styleGuide.allContentRegions.find((c) => c.content.kind !== 'reference')
      }
      return undefined
    },
    canvasStyle(): { [name: string]: unknown } {
      return {
        position: 'absolute',
        width: this.canvasState.viewport.width + 'px',
        height: this.canvasState.viewport.height + 'px',
        overflow: 'hidden',
      }
    },
    styleGuideStyle(): { [name: string]: unknown } {
      return {
        transform: this.canvasState.viewport.transform,
        width: this.canvasState.styleGuide.width + 'px',
        height: this.canvasState.styleGuide.height + 'px',
      }
    },
    rotateAreaStyle(): { [name: string]: unknown } | undefined {
      if (!this.canRotateRegion) {
        return undefined
      }
      return this.getResizeStyle(this.canRotateRegion)
    },
    rotateRegion(): { [name: string]: unknown } | undefined {
      if (!this.rotateAreaStyle) {
        return undefined
      }
      const length = rotateStickLength / this.canvasState.viewport.scale
      const border = 1 / this.canvasState.viewport.scale
      return {
        left: `calc(50% - ${border / 2}px)`,
        top: -length + `px`,
        width: Math.max(border, 1) + 'px',
        height: length + 'px',
        position: 'absolute',
        backgroundColor: 'green',
      }
    },
    rotateCircleRegion(): { [name: string]: unknown } | undefined {
      if (!this.rotateAreaStyle) {
        return undefined
      }
      const length = rotateStickLength / this.canvasState.viewport.scale
      const border = 1 / this.canvasState.viewport.scale
      const width = rotateCircleSize / this.canvasState.viewport.scale
      return {
        left: `calc(50% - ${border / 2 + width / 2}px)`,
        top: -length - width + `px`,
        width: width + 'px',
        height: width + 'px',
        position: 'absolute',
        border: `${Math.max(border, 1)}px solid green`,
        backgroundColor: 'white',
        borderRadius: width / 2 + 'px',
      }
    },
    resizeRegions(): { [name: string]: unknown }[] {
      const width = resizeSize / this.canvasState.viewport.scale
      const border = 1 / this.canvasState.viewport.scale
      const leftTop = width / 2
      const rightBottom = width / 2 - border
      const style = {
        width: width + 'px',
        height: width + 'px',
        border: `${border}px solid green`,
        position: 'absolute',
        backgroundColor: 'white',
      }
      return [
        {
          left: -leftTop + 'px',
          top: -leftTop + 'px',
          ...style,
        },
        {
          left: -leftTop + 'px',
          bottom: -rightBottom + 'px',
          ...style,
        },
        {
          right: -rightBottom + 'px',
          top: -leftTop + 'px',
          ...style,
        },
        {
          right: -rightBottom + 'px',
          bottom: -rightBottom + 'px',
          ...style,
        },
        {
          left: -leftTop + 'px',
          top: `calc(50% - ${leftTop}px)`,
          ...style,
        },
        {
          left: `calc(50% - ${leftTop}px)`,
          top: -leftTop + 'px',
          ...style,
        },
        {
          left: `calc(50% - ${leftTop}px)`,
          bottom: -rightBottom + 'px',
          ...style,
        },
        {
          top: `calc(50% - ${leftTop}px)`,
          right: -rightBottom + 'px',
          ...style,
        },
      ]
    }
  },
  methods: {
    getSelectionAreaStyle(region: Region & Rotate) {
      return {
        ...this.getResizeStyle(region),
        border: `${1 / this.canvasState.viewport.scale}px solid green`
      }
    },
    getResizeStyle(region: Region & Rotate) {
      return {
        left: region.x + 'px',
        top: region.y + 'px',
        width: region.width + 'px',
        height: region.height + 'px',
        transform: region.rotate ? `rotate(${region.rotate}deg)` : undefined,
        position: 'absolute',
      }
    }
  }
})

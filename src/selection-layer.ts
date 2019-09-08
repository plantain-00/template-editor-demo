import Vue from 'vue'
import Component from 'vue-class-component'
import { selectionLayerTemplateHtml, selectionLayerTemplateHtmlStatic } from './variables'
import { CanvasState } from './canvas-state'
import { Region, Size } from './model'
import { iterateAllTemplatePositions, iterateAllContentPositions } from './utils'

@Component({
  render: selectionLayerTemplateHtml,
  staticRenderFns: selectionLayerTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class SelectionLayer extends Vue {
  private canvasState!: CanvasState

  get selectionAreas(): Region[] {
    if (this.canvasState.selection.kind === 'template') {
      const template = this.canvasState.selection.template
      return Array.from(iterateAllTemplatePositions(template, this.canvasState.styleGuide))
        .map((p) => ({
          x: p.x,
          y: p.y,
          width: template.width,
          height: template.height,
        }))
    }
    if (this.canvasState.selection.kind === 'content') {
      const content = this.canvasState.selection.content
      let size: Size | undefined
      if (content.kind === 'reference') {
        size = this.canvasState.styleGuide.templates.find((t) => t.id === content.id)
      } else if (content.kind === 'snapshot') {
        size = content.snapshot
      } else {
        size = content
      }
      if (size) {
        const tmpSize = size
        return Array.from(iterateAllContentPositions(content, this.canvasState.styleGuide))
          .map((p) => ({
            x: p.x,
            y: p.y,
            width: tmpSize.width,
            height: tmpSize.height,
          }))
      }
    }
    return []
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
      width: this.canvasState.styleGuideWidth + 'px',
      height: this.canvasState.styleGuideHeight + 'px',
    }
  }

  getSelectionAreaStyle(region: Region) {
    return {
      left: region.x + 'px',
      top: region.y + 'px',
      width: region.width + 'px',
      height: region.height + 'px',
      position: 'absolute',
      border: '1px solid green'
    }
  }
}

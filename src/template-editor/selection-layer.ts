import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorSelectionLayerTemplateHtml, templateEditorSelectionLayerTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { Region } from '../model'
import { iterateAllTemplatePositions, iterateAllContentPositions } from '../utils'
import { getContentSize } from '../engine/layout-engine'

@Component({
  render: templateEditorSelectionLayerTemplateHtml,
  staticRenderFns: templateEditorSelectionLayerTemplateHtmlStatic,
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
      const size = getContentSize(content, this.canvasState.styleGuide.templates)
      return Array.from(iterateAllContentPositions(content, this.canvasState.styleGuide))
        .map((p) => ({
          x: p.x,
          y: p.y,
          width: size.width,
          height: size.height,
        }))
    }
    return []
  }

  get canvasStyle() {
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'hidden',
    }
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
      border: `${1 / this.canvasState.styleGuideScale}px solid green`
    }
  }
}

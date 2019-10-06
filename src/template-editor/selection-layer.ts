import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorSelectionLayerTemplateHtml, templateEditorSelectionLayerTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { Region } from '../model'

@Component({
  render: templateEditorSelectionLayerTemplateHtml,
  staticRenderFns: templateEditorSelectionLayerTemplateHtmlStatic,
  props: {
    canvasState: CanvasState
  }
})
export class SelectionLayer extends Vue {
  private canvasState!: CanvasState

  get selectionRegions(): Region[] {
    if (this.canvasState.selection.kind === 'template') {
      return this.canvasState.allTemplateRegions
    }
    if (this.canvasState.selection.kind === 'content') {
      return this.canvasState.allContentRegions
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

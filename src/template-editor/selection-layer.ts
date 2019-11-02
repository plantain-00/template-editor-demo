import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorSelectionLayerTemplateHtml, templateEditorSelectionLayerTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { Region, Rotate } from '../model'

@Component({
  render: templateEditorSelectionLayerTemplateHtml,
  staticRenderFns: templateEditorSelectionLayerTemplateHtmlStatic,
  props: ['canvasState']
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

  get canResizeRegions(): Region[] {
    if (this.canvasState.selection.kind === 'template') {
      return this.canvasState.allTemplateRegions.filter((t) => !t.parent)
    }
    if (this.canvasState.selection.kind === 'content') {
      return this.canvasState.allContentRegions.filter((c) => !c.rotate)
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

  getSelectionAreaStyle(region: Region & Rotate) {
    return {
      left: region.x + 'px',
      top: region.y + 'px',
      width: region.width + 'px',
      height: region.height + 'px',
      transform: region.rotate ? `rotate(${region.rotate}deg)` : undefined,
      position: 'absolute',
      border: `${1 / this.canvasState.styleGuideScale}px solid green`
    }
  }

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

  get resizeRegions() {
    const width = 5 / this.canvasState.styleGuideScale
    const border = 1 / this.canvasState.styleGuideScale
    const leftTop = 2.5 / this.canvasState.styleGuideScale
    const rightBottom = 1.5 / this.canvasState.styleGuideScale
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
}

import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'
import { CanvasMask } from './canvas-mask'

Vue.component('canvas-mask', CanvasMask)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  canvasState = CanvasState.create(styleGuide)

  canvasStyle = {
    position: 'absolute',
    width: this.canvasState.canvasWidth + 'px',
    height: this.canvasState.canvasHeight + 'px',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
      width: this.canvasState.styleGuideWidth + 'px',
      height: this.canvasState.styleGuideHeight + 'px',
    }
  }

  get draggingAreaStyle() {
    return {
      position: 'absolute',
      border: '1px dashed black',
      left: Math.min(this.canvasState.mousedownX, this.canvasState.mouseupX) + 'px',
      top: Math.min(this.canvasState.mousedownY, this.canvasState.mouseupY) + 'px',
      width: Math.abs(this.canvasState.mousedownX - this.canvasState.mouseupX) + 'px',
      height: Math.abs(this.canvasState.mousedownY - this.canvasState.mouseupY) + 'px',
    }
  }

  changeText(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
      this.canvasState.selection.content.text = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }

  changeImageUrl(e: { target: { value: string } }) {
    if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
      this.canvasState.selection.content.url = e.target.value
      this.canvasState.changedContents.add(this.canvasState.selection.content)
      this.canvasState.applyChangesIfAuto()
    }
  }
}

new App({ el: '#container' })

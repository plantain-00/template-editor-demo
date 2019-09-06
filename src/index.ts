import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { styleGuide } from './data'
import { CanvasState } from './canvas-state'
import { CanvasMask } from './canvas-mask'
import { EditorPanel } from './editor-panel'
import { DraggingArea } from './dragging-area'

Vue.component('canvas-mask', CanvasMask)
Vue.component('editor-panel', EditorPanel)
Vue.component('dragging-area', DraggingArea)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  canvasState = CanvasState.create(styleGuide)

  get canvasStyle() {
    return {
      position: 'absolute',
      width: this.canvasState.canvasWidth + 'px',
      height: this.canvasState.canvasHeight + 'px',
      overflow: 'hidden',
      backgroundColor: '#ddd',
    }
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.canvasState.styleGuideScale}) translate(${this.canvasState.styleGuideTranslateX}px, ${this.canvasState.styleGuideTranslateY}px)`,
      width: this.canvasState.styleGuideWidth + 'px',
      height: this.canvasState.styleGuideHeight + 'px',
    }
  }
}

new App({ el: '#container' })

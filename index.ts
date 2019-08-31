import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { renderTemplate } from './renderer'
import { styleGuide } from './data'

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  renderResults: Array<{
    html: string,
    x: number,
    y: number,
  }> = []

  private styleGuideTranslateX = 0
  private styleGuideTranslateY = 0
  private styleGuideScale = 1
  private styleGuideWidth = 300
  private styleGuideHeight = 300

  canvasStyle = {}
  get styleGuideStyle() {
    return {
      transform: `scale(${this.styleGuideScale}) translate(${this.styleGuideTranslateX}px, ${this.styleGuideTranslateY}px)`,
      width: this.styleGuideWidth + 'px',
      height: this.styleGuideHeight + 'px',
      
    }
  }

  beforeMount() {
    const canvasWidth = 1200
    const canvasHeight = 400
    this.canvasStyle = {
      position: 'absolute',
      width: canvasWidth + 'px',
      height: canvasHeight + 'px',
      overflow: 'hidden',
      backgroundColor: '#ddd',
    }
    this.styleGuideWidth = Math.max(...styleGuide.templates.map((t) => t.x + t.width)) + 50
    this.styleGuideHeight = Math.max(...styleGuide.templates.map((t) => t.y + t.height)) + 50
    this.styleGuideScale = Math.min(canvasWidth / this.styleGuideWidth, canvasHeight / this.styleGuideHeight)
    this.styleGuideTranslateX = (canvasWidth - this.styleGuideWidth) * this.styleGuideScale
    this.styleGuideTranslateY = (canvasHeight - this.styleGuideHeight) * this.styleGuideScale
    this.renderResults = styleGuide.templates.map((t) => ({
      html: renderTemplate(t, styleGuide.templates),
      x: t.x,
      y: t.y,
    }))
  }

  canvasWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.deltaY > 0) {
        this.styleGuideScale *= 0.99
      } else if (e.deltaY < 0) {
        this.styleGuideScale *= 1.01
      }
    } else {
      this.styleGuideTranslateX -= e.deltaX
      this.styleGuideTranslateY -= e.deltaY
    }
  }
}

new App({ el: '#container' })

import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { renderTemplate } from './renderer'
import { styleGuide } from './data'
import { Region, Position, TemplateContent } from './model'

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
  auto = true

  private styleGuideTranslateX = 0
  private styleGuideTranslateY = 0
  private styleGuideScale = 1
  private canvasWidth = 1200
  private canvasHeight = 400
  private styleGuide = styleGuide
  private selectedContent: TemplateContent | null = null
  private changedContents = new Set<TemplateContent>()

  canvasStyle = {
    position: 'absolute',
    width: this.canvasWidth + 'px',
    height: this.canvasHeight + 'px',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  }

  get styleGuideStyle() {
    return {
      transform: `scale(${this.styleGuideScale}) translate(${this.styleGuideTranslateX}px, ${this.styleGuideTranslateY}px)`,
      width: this.styleGuideWidth + 'px',
      height: this.styleGuideHeight + 'px',

    }
  }
  get maskStyle() {
    return {
      ...this.canvasStyle,
      opacity: 0,
    }
  }

  private get styleGuideWidth() {
    return Math.max(...this.styleGuide.templates.map((t) => t.x + t.width))
  }

  private get styleGuideHeight() {
    return Math.max(...this.styleGuide.templates.map((t) => t.y + t.height))
  }

  beforeMount() {
    this.styleGuideScale = Math.min(this.canvasWidth / this.styleGuideWidth, this.canvasHeight / this.styleGuideHeight)
    this.styleGuideTranslateX = (this.canvasWidth - this.styleGuideWidth) * this.styleGuideScale
    this.styleGuideTranslateY = (this.canvasHeight - this.styleGuideHeight) * this.styleGuideScale

    this.applyChanges()
  }

  applyChanges() {
    for (const content of this.changedContents) {
      if (content.kind === 'text') {
        content.characters = Array.from(content.text).map((t) => ({ text: t }))
      }
    }
    this.renderResults = this.styleGuide.templates.map((t) => ({
      html: renderTemplate(t, this.styleGuide.templates),
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

  canvasClick(e: MouseEvent) {
    const x = (e.offsetX - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale
    const y = (e.offsetY - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale
    const position: Position = { x, y }
    const template = this.styleGuide.templates.find((t) => isInRegion(position, t))
    if (template) {
      const content = template.contents.find((c) => {
        const contentPosition = { x: c.x + template.x, y: c.y + template.y }
        if (c.kind === 'image' || c.kind === 'text') {
          return isInRegion(position, { ...contentPosition, width: c.width, height: c.height })
        }
        return false
      })
      if (content) {
        this.selectedContent = content
      } else {
        this.selectedContent = null
      }
    } else {
      this.selectedContent = null
    }
  }

  changeText(e: { target: { value: string } }) {
    if (this.selectedContent && this.selectedContent.kind === 'text') {
      this.selectedContent.text = e.target.value
      this.changedContents.add(this.selectedContent)
      if (this.auto) {
        this.applyChanges()
      }
    }
  }
}

new App({ el: '#container' })

function isInRegion(position: Position, region: Region) {
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

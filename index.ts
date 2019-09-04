import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { renderTemplate } from './renderer'
import { styleGuide } from './data'
import { Region, Position, TemplateContent, StyleGuide, Template, CanvasSelection, CanvasSelectionData } from './model'

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
  private selection: CanvasSelection = {
    kind: 'none'
  }
  private changedContents = new Set<TemplateContent>()
  private mousedownX = 0
  private mousedownY = 0
  private mouseupX = 0
  private mouseupY = 0
  private mousePressing = false

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

  private get isDragging() {
    return !equal(this.mouseupX, this.mousedownX) || !(this.mouseupY, this.mousedownY)
  }

  get draggingAreaStyle() {
    return {
      position: 'absolute',
      border: '1px dashed black',
      left: Math.min(this.mousedownX, this.mouseupX) + 'px',
      top: Math.min(this.mousedownY, this.mouseupY) + 'px',
      width: Math.abs(this.mousedownX - this.mouseupX) + 'px',
      height: Math.abs(this.mousedownY - this.mouseupY) + 'px',
    }
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
    this.renderResults = this.styleGuide.templates.map((t) => {
      let selection: CanvasSelectionData | undefined
      if (this.selection.kind === 'template') {
        selection = {
          kind: 'template',
          id: this.selection.template.id
        }
      } else if (this.selection.kind === 'content') {
        const content = this.selection.content
        selection = {
          kind: 'content',
          id: this.selection.template.id,
          index: this.selection.template.contents.findIndex((c) => c === content)
        }
      }
      return {
        html: renderTemplate(t, this.styleGuide.templates, true, selection),
        x: t.x,
        y: t.y,
      }
    })
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

  canvasMousedown(e: MouseEvent) {
    this.mousedownX = e.offsetX
    this.mousedownY = e.offsetY
    this.mouseupX = e.offsetX
    this.mouseupY = e.offsetY
    this.mousePressing = true
  }

  canvasMousemove(e: MouseEvent) {
    if (this.mousePressing) {
      this.mouseupX = e.offsetX
      this.mouseupY = e.offsetY
    }
  }

  canvasMouseup(e: MouseEvent) {
    this.mouseupX = e.offsetX
    this.mouseupY = e.offsetY
    this.mousePressing = false

    const x = this.mapX(this.mouseupX)
    const y = this.mapY(this.mouseupY)
    if (this.isDragging) {
      const mousedownX = this.mapX(this.mousedownX)
      const mousedownY = this.mapY(this.mousedownY)
      const template = selectTemplate(this.styleGuide, { x, y }, { x: mousedownX, y: mousedownY })
      this.selection = template ? { kind: 'template', template } : { kind: 'none' }
    } else {
      const content = selectContent(this.styleGuide, { x, y })
      this.selection = content ? { kind: 'content', ...content } : { kind: 'none' }
    }
    if (this.auto) {
      this.applyChanges()
    }
  }

  changeText(e: { target: { value: string } }) {
    if (this.selection.kind === 'content' && this.selection.content.kind === 'text') {
      this.selection.content.text = e.target.value
      this.changedContents.add(this.selection.content)
      if (this.auto) {
        this.applyChanges()
      }
    }
  }

  changeImageUrl(e: { target: { value: string } }) {
    if (this.selection.kind === 'content' && this.selection.content.kind === 'image') {
      this.selection.content.url = e.target.value
      this.changedContents.add(this.selection.content)
      if (this.auto) {
        this.applyChanges()
      }
    }
  }

  private mapX(x: number) {
    return (x - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale
  }

  private mapY(y: number) {
    return (y - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale
  }
}

new App({ el: '#container' })

function equal(n1: number, n2: number) {
  const diff = n1 - n2
  return diff < Number.EPSILON && diff > -Number.EPSILON
}

function selectTemplate(styleGuide: StyleGuide, position1: Position, position2: Position) {
  const region: Region = {
    x: Math.min(position1.x, position2.x),
    y: Math.min(position1.y, position2.y),
    width: Math.abs(position1.x - position2.x),
    height: Math.abs(position1.y - position2.y),
  }
  for (const template of styleGuide.templates) {
    const positions: Position[] = [
      {
        x: template.x,
        y: template.y,
      },
      {
        x: template.x + template.width,
        y: template.y + template.height,
      },
    ]
    if (isInRegion(positions, region)) {
      return template
    }
  }
  return null
}

function selectContent(styleGuide: StyleGuide, position: Position): { content: TemplateContent, template: Template } | null {
  for (const template of styleGuide.templates) {
    if (isInRegion(position, template)) {
      const templateContent = selectReferenceContent(template, template, position, styleGuide)
      if (templateContent) {
        return templateContent
      }
    }
  }
  return null
}

function selectReferenceContent(template: Template, basePosition: Position, position: Position, styleGuide: StyleGuide): { content: TemplateContent, template: Template } | null {
  for (const content of template.contents) {
    const contentPosition = { x: content.x + basePosition.x, y: content.y + basePosition.y }
    if (content.kind === 'image' || content.kind === 'text') {
      if (isInRegion(position, { ...contentPosition, width: content.width, height: content.height })) {
        return { content, template }
      }
    } else if (content.kind === 'reference') {
      const reference = styleGuide.templates.find((t) => t.id === content.id)
      if (reference) {
        const referenceContent = selectReferenceContent(reference, contentPosition, position, styleGuide)
        if (referenceContent) {
          return referenceContent
        }
      }
    }
  }
  return null
}

function isInRegion(position: Position | Position[], region: Region): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

export interface StyleGuide {
  name: string
  templates: Template[]
}

export interface Template {
  id: string
  width: number
  height: number
  contents: TemplateContent[]
}

type TemplateContent = TemplateTextContent | TemplateImageContent | TemplateReferenceContent

interface TemplateTextContent extends TemplateBaseContent {
  kind: 'text'
  text: string
  fontFamily: string
  fontSize: number
  color: string
  width: number
  height: number
}

interface TemplateImageContent extends TemplateBaseContent {
  kind: 'image'
  url: string
  width: number
  height: number
}

interface TemplateReferenceContent extends TemplateBaseContent {
  kind: 'reference'
  id: string
}

interface TemplateBaseContent {
  x: number
  y: number
}

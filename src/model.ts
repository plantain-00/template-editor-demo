export interface StyleGuide {
  name: string
  templates: Template[]
}

export interface Template {
  id: string
  x: number
  y: number
  width: number
  height: number
  contents: TemplateContent[]
}

export type TemplateContent = TemplateTextContent | TemplateImageContent | TemplateReferenceContent | TemplateSnapshotContent

interface TemplateTextContent extends Region {
  kind: 'text'
  text: string
  fontFamily: string
  fontSize: number
  color: string
  characters: TextCharacter[]
}

interface TextCharacter {
  text: string
}

interface TemplateImageContent extends Region {
  kind: 'image'
  url: string
}

interface TemplateReferenceContent extends Position {
  kind: 'reference'
  id: string
}

interface TemplateSnapshotContent extends Position {
  kind: 'snapshot'
  snapshot: Template
}

export interface Position {
  x: number
  y: number
}

export interface Region extends Position {
  width: number
  height: number
}

export type CanvasSelection =
  | {
    kind: 'none'
  }
  | {
    kind: 'template',
    template: Template
  }
  | {
    kind: 'content',
    content: TemplateContent,
    template: Template
  }

export type CanvasSelectionData =
  | {
    kind: 'template'
    id: string
  }
  | {
    kind: 'content'
    id: string
    index: number
  }

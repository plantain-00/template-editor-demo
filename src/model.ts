export interface StyleGuide {
  name: string
  templates: Template[]
}

export interface Template extends Region, SizeExpression {
  id: string
  contents: TemplateContent[]
}

export type TemplateContent = TemplateTextContent | TemplateImageContent | TemplateReferenceContent | TemplateSnapshotContent

export interface TemplateTextContent extends Region, RegionExpression, GenerationField, Hidden {
  kind: 'text'
  text: string
  textExpression?: string
  fontFamily: string
  fontSize: number
  color: string
  characters: TextCharacter[]
}

interface TextCharacter {
  text: string
}

interface Hidden {
  hidden?: boolean
}

interface TemplateImageContent extends Region, RegionExpression, GenerationField, Hidden {
  kind: 'image'
  url: string
}

export interface TemplateReferenceContent extends Position, PositionExpression, GenerationField, Hidden {
  kind: 'reference'
  id: string
}

interface TemplateSnapshotContent extends Position, PositionExpression, Hidden {
  kind: 'snapshot'
  snapshot: Template
}

export interface Position {
  x: number
  y: number
}

interface PositionExpression {
  xExpression?: string
  yExpression?: string
}

export interface Size {
  width: number
  height: number
}

interface SizeExpression {
  widthExpression?: string
  heightExpression?: string
}

export interface Region extends Position, Size { }

interface RegionExpression extends PositionExpression, SizeExpression { }

interface GenerationField {
  if?: string
  repeat?: string
  props?: string
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

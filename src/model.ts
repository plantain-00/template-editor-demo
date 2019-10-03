export interface StyleGuide {
  name: string
  templates: Template[]
}

export interface Template extends Region, SizeExpression, FlexField {
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
  fontSizeExpression?: string
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
  urlExpression?: string
}

export interface TemplateReferenceContent extends Position, PositionExpression, GenerationField, Hidden {
  kind: 'reference'
  id: string
  props?: string
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
  
}

interface FlexField extends MarginField {
  display?: 'flex'
  flexDirection?: 'row' | 'column'
  justifyContent?: 'start' | 'end' | 'center' | 'between'
  alignItems?: 'start' | 'end' | 'center'
}

interface MarginField {
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  marginBottom?: number
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

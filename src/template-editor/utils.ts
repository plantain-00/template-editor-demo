import { CanvasState } from './canvas-state'
import { Region, Position, TemplateContent, Template, TemplateReferenceContent, Rotate } from '../model'
import { isInRegion, nameSize, formatPixel } from '../utils'

export function selectContentOrTemplateByPosition(canvasState: CanvasState, position: Position) {
  let potentialNameRegion: Required<Region> & Rotate & {
    template: Template;
  } | undefined
  for (const nameRegion of canvasState.targetNameRegions) {
    if ((!potentialNameRegion || nameRegion.z >= potentialNameRegion.z) && isInRegion(position, nameRegion)) {
      potentialNameRegion = nameRegion
    }
  }
  if (potentialNameRegion) {
    return { kind: 'template' as const, region: potentialNameRegion }
  }

  let potentialContentRegion: Required<Region> & Rotate & {
    index: number;
    contents: TemplateContent[];
    content: TemplateContent;
    template: Template;
  } | undefined
  for (const contentRegion of canvasState.targetContentRegions) {
    if ((!potentialContentRegion || contentRegion.z >= potentialContentRegion.z) && isInRegion(position, contentRegion)) {
      potentialContentRegion = contentRegion
    }
  }
  if (potentialContentRegion) {
    return { kind: 'content' as const, region: potentialContentRegion }
  }

  const potentialTemplateRegion = selectTemplateRegionByPosition(canvasState, position)
  if (potentialTemplateRegion) {
    return { kind: 'template' as const, region: potentialTemplateRegion }
  }
  return undefined
}

export function selectTemplateRegionByPosition(canvasState: CanvasState, position: Position) {
  let potentialTemplateRegion: Required<Region> & Rotate & {
    template: Template;
  } | undefined
  for (const templateRegion of canvasState.targetTemplateRegions) {
    if ((!potentialTemplateRegion || (templateRegion.z || 0) >= (potentialTemplateRegion.z || 0)) && isInRegion(position, templateRegion)) {
      potentialTemplateRegion = templateRegion
    }
  }
  return potentialTemplateRegion
}

export function getPositionAndSelectionAreaRelation(canvasState: CanvasState, position: Position): {
  kind: 'move' | RegionSide
  offsetX: number
  offsetY: number
  content?: TemplateReferenceContent
} | undefined {
  if (canvasState.selection.kind === 'template') {
    for (const nameRegion of canvasState.allNameRegions) {
      const isInSelectionRegion = isInRegion(position, nameRegion)
      if (isInSelectionRegion) {
        return {
          kind: 'move',
          offsetX: position.x - nameRegion.x,
          offsetY: position.y - nameRegion.y - nameSize / canvasState.styleGuideScale,
        }
      }
    }
    for (const templateRegion of canvasState.allTemplateRegions) {
      if (!templateRegion.parent) {
        const side = getRegionSide(position, templateRegion)
        if (side) {
          return {
            kind: side,
            offsetX: position.x - templateRegion.x,
            offsetY: position.y - templateRegion.y,
          }
        }
      }
      const isInSelectionRegion = isInRegion(position, templateRegion)
      if (isInSelectionRegion) {
        if (templateRegion.parent) {
          return {
            kind: 'move',
            offsetX: position.x - templateRegion.parent.content.x,
            offsetY: position.y - templateRegion.parent.content.y,
            content: templateRegion.parent.content
          }
        }
        return {
          kind: 'move',
          offsetX: position.x - templateRegion.x,
          offsetY: position.y - templateRegion.y,
        }
      }
    }
  } else if (canvasState.selection.kind === 'content') {
    const content = canvasState.selection.content
    for (const contentRegion of canvasState.allContentRegions) {
      if (contentRegion.content.kind !== 'reference') {
        const side = getRegionSide(position, contentRegion)
        if (side) {
          return {
            kind: side,
            offsetX: position.x - content.x,
            offsetY: position.y - content.y,
          }
        }
      }
      const isInSelectionRegion = isInRegion(position, contentRegion)
      if (isInSelectionRegion) {
        return {
          kind: 'move',
          offsetX: position.x - content.x,
          offsetY: position.y - content.y,
        }
      }
    }
  }
  return undefined
}

export type RegionSide = "left-top" | "left" | "left-bottom" | "right-top" | "right" | "right-bottom" | "top" | "bottom"

function getRegionSide(position: Position, region: Region & Rotate): RegionSide | undefined {
  if (region.rotate) {
    return undefined
  }
  const delta = 5
  if (Math.abs(position.x - region.x) <= delta) {
    if (position.y < region.y - delta) {
      return undefined
    }
    if (position.y < region.y + delta) {
      return 'left-top'
    }
    if (position.y < region.y + region.height - delta) {
      return 'left'
    }
    if (position.y < region.y + region.height + delta) {
      return 'left-bottom'
    }
    return undefined
  }
  if (Math.abs(position.x - region.x - region.width) <= delta) {
    if (position.y < region.y - delta) {
      return undefined
    }
    if (position.y < region.y + delta) {
      return 'right-top'
    }
    if (position.y < region.y + region.height - delta) {
      return 'right'
    }
    if (position.y < region.y + region.height + delta) {
      return 'right-bottom'
    }
    return undefined
  }
  if (Math.abs(position.y - region.y) <= delta) {
    if (position.x > region.x + delta && position.x < region.x + region.width - delta) {
      return 'top'
    }
    return undefined
  }
  if (Math.abs(position.y - region.y - region.height) <= delta) {
    if (position.x > region.x + delta && position.x < region.x + region.width - delta) {
      return 'bottom'
    }
    return undefined
  }
  return undefined
}

export function selectTemplateByArea(canvasState: CanvasState, position1: Position, position2: Position) {
  const region: Region = {
    x: Math.min(position1.x, position2.x),
    y: Math.min(position1.y, position2.y),
    width: Math.abs(position1.x - position2.x),
    height: Math.abs(position1.y - position2.y),
  }
  let potentialTemplateRegion: Required<Region> & { parent?: { content: TemplateReferenceContent, template: Template, index: number }, template: Template } | undefined
  for (const templateRegion of canvasState.targetTemplateRegions) {
    const positions: Position[] = [
      {
        x: templateRegion.x,
        y: templateRegion.y,
      },
      {
        x: templateRegion.x + templateRegion.width,
        y: templateRegion.y + templateRegion.height,
      },
    ]
    if ((!potentialTemplateRegion || templateRegion.z >= potentialTemplateRegion.z) && isInRegion(positions, region)) {
      potentialTemplateRegion = templateRegion
    }
  }
  if (potentialTemplateRegion) {
    return potentialTemplateRegion.template
  }
  return null
}

export function setContentSize(content: TemplateContent, kind: 'width' | 'height', value: number) {
  if (content.kind === 'snapshot') {
    content.snapshot[kind] = formatPixel(value)
  } else if (content.kind !== 'reference') {
    content[kind] = formatPixel(value)
  }
}

export function decreaseContentSize(content: TemplateContent, kind: 'width' | 'height', value: number) {
  if (content.kind === 'snapshot') {
    content.snapshot[kind] = formatPixel(content.snapshot[kind] - value)
  } else if (content.kind !== 'reference') {
    content[kind] = formatPixel(content[kind] - value)
  }
}

export function decreaseTemplateSize(template: Template, kind: 'width' | 'height', value: number) {
  template[kind] = formatPixel(template[kind] - value)
}

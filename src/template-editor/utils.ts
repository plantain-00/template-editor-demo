import { CanvasState } from './canvas-state'
import { Region, Position, TemplateContent, Template, TemplateReferenceContent, Rotate } from '../model'
import { isInRegion, nameSize, formatPixel, rotatePosition } from '../utils'

export function selectContentOrTemplateByPosition(canvasState: CanvasState, position: Position) {
  const generator = iterateContentOrTemplateByPosition(canvasState, position)
  const result = generator.next()
  return result.done ? undefined : result.value
}

function* iterateContentOrTemplateByPosition(canvasState: CanvasState, position: Position) {
  for (const nameRegion of canvasState.targetNameRegions) {
    if (isInRegion(position, nameRegion)) {
      yield { kind: 'template' as const, region: nameRegion }
    }
  }

  for (const contentRegion of canvasState.targetContentRegions) {
    if (isInRegion(position, contentRegion)) {
      yield { kind: 'content' as const, region: contentRegion }
    }
  }

  for (const contentRegion of iterateTemplateRegionByPosition(canvasState, position)) {
    yield { kind: 'template' as const, region: contentRegion }
  }
}

export function selectTemplateRegionByPosition(canvasState: CanvasState, position: Position) {
  const generator = iterateTemplateRegionByPosition(canvasState, position)
  const result = generator.next()
  return result.done ? undefined : result.value
}

function* iterateTemplateRegionByPosition(canvasState: CanvasState, position: Position) {
  for (const templateRegion of canvasState.targetTemplateRegions) {
    if (isInRegion(position, templateRegion)) {
      yield templateRegion
    }
  }
}

export function getPositionAndSelectionAreaRelation(canvasState: CanvasState, position: Position): {
  kind: 'move' | 'grab' | RegionSide
  offsetX: number
  offsetY: number
  rotate: number,
  content?: TemplateReferenceContent
} | undefined {
  if (canvasState.selection.kind === 'template') {
    for (const nameRegion of canvasState.allNameRegions) {
      const isInSelectionRegion = isInRegion(position, nameRegion)
      if (isInSelectionRegion) {
        return {
          kind: 'move',
          offsetX: nameRegion.x,
          offsetY: nameRegion.y + nameSize / canvasState.styleGuideScale,
          rotate: 0,
        }
      }
    }
    for (const templateRegion of canvasState.allTemplateRegions) {
      if (!templateRegion.parent) {
        const side = getRegionSide(position, templateRegion)
        if (side) {
          return {
            kind: side,
            offsetX: templateRegion.x,
            offsetY: templateRegion.y,
            rotate: 0,
          }
        }
      }
      const isInSelectionRegion = isInRegion(position, templateRegion)
      if (isInSelectionRegion) {
        if (templateRegion.parent) {
          return {
            kind: 'move',
            offsetX: templateRegion.parent.content.x,
            offsetY: templateRegion.parent.content.y,
            rotate: 0,
            content: templateRegion.parent.content,
          }
        }
        return {
          kind: 'move',
          offsetX: templateRegion.x,
          offsetY: templateRegion.y,
          rotate: 0,
        }
      }
    }
  } else if (canvasState.selection.kind === 'content') {
    const content = canvasState.selection.content
    for (const contentRegion of canvasState.allContentRegions) {
      const rotate = contentRegion.rotates.reduce((p, c) => p + c.rotate, 0)
      if (contentRegion.content.kind !== 'reference') {
        const canGrabToRotate = getCanGrabToRotate(position, contentRegion, canvasState.styleGuideScale)
        if (canGrabToRotate) {
          return {
            kind: 'grab',
            offsetX: contentRegion.x + contentRegion.width / 2,
            offsetY: contentRegion.y + contentRegion.height / 2,
            rotate,
          }
        }
        const side = getRegionSide(position, contentRegion)
        if (side) {
          return {
            kind: side,
            offsetX: content.x,
            offsetY: content.y,
            rotate,
          }
        }
      }
      const isInSelectionRegion = isInRegion(position, contentRegion)
      if (isInSelectionRegion) {
        return {
          kind: 'move',
          offsetX: content.x,
          offsetY: content.y,
          rotate,
        }
      }
    }
  }
  return undefined
}

export type RegionSide = "left-top" | "left" | "left-bottom" | "right-top" | "right" | "right-bottom" | "top" | "bottom"

function getCanGrabToRotate(position: Position, region: Region & Rotate, scale: number) {
  position = rotatePosition(position, region)
  const circleSize = rotateCircleSize / scale
  const stickLength = rotateStickLength / scale
  return isInRegion(position, {
    x: region.x + region.width / 2 - circleSize / 2,
    y: region.y - stickLength - circleSize,
    width: circleSize,
    height: circleSize,
  })
}

function getRegionSide(position: Position, region: Region & Rotate): RegionSide | undefined {
  if (region.rotate) {
    position = rotatePosition(position, region)
  }
  if (Math.abs(position.x - region.x) <= resizeSize) {
    if (position.y < region.y - resizeSize) {
      return undefined
    }
    if (position.y < region.y + resizeSize) {
      return 'left-top'
    }
    if (position.y < region.y + region.height - resizeSize) {
      return 'left'
    }
    if (position.y < region.y + region.height + resizeSize) {
      return 'left-bottom'
    }
    return undefined
  }
  if (Math.abs(position.x - region.x - region.width) <= resizeSize) {
    if (position.y < region.y - resizeSize) {
      return undefined
    }
    if (position.y < region.y + resizeSize) {
      return 'right-top'
    }
    if (position.y < region.y + region.height - resizeSize) {
      return 'right'
    }
    if (position.y < region.y + region.height + resizeSize) {
      return 'right-bottom'
    }
    return undefined
  }
  if (Math.abs(position.y - region.y) <= resizeSize) {
    if (position.x > region.x + resizeSize && position.x < region.x + region.width - resizeSize) {
      return 'top'
    }
    return undefined
  }
  if (Math.abs(position.y - region.y - region.height) <= resizeSize) {
    if (position.x > region.x + resizeSize && position.x < region.x + region.width - resizeSize) {
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

export function decreaseTemplateSize(template: Template, kind: 'width' | 'height', value: number) {
  template[kind] = formatPixel(template[kind] - value)
}

export const resizeSize = 5
export const rotateStickLength = 40
export const rotateCircleSize = 10

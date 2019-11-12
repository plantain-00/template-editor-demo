import { TemplateContent, Template } from '../model'
import { RegionSide, setContentSize, decreaseTemplateSize } from './utils'
import { formatPixel, rotatePositionByCenter } from '../utils'
import { equal } from './canvas-state'

export function resizeTemplate(
  template: Template,
  x: number,
  y: number,
  draggingSelectionWidth: number,
  draggingSelectionHeight: number,
  draggingSelectionKind: 'grab' | 'grabbing' | RegionSide,
) {
  const deltaX = x - template.x
  const deltaY = y - template.y
  if (draggingSelectionKind.includes('left')) {
    decreaseTemplateSize(template, 'width', deltaX)
    template.x = formatPixel(x)
  }
  if (draggingSelectionKind.includes('right')) {
    template.width = formatPixel(draggingSelectionWidth + deltaX)
  }
  if (draggingSelectionKind.includes('top')) {
    decreaseTemplateSize(template, 'height', deltaY)
    template.y = formatPixel(y)
  }
  if (draggingSelectionKind.includes('bottom')) {
    template.height = formatPixel(draggingSelectionHeight + deltaY)
  }
}

export function resizeContent(
  content: TemplateContent,
  x: number,
  y: number,
  draggingSelectionX: number,
  draggingSelectionY: number,
  draggingSelectionWidth: number,
  draggingSelectionHeight: number,
  draggingSelectionKind: 'grab' | 'grabbing' | RegionSide,
) {
  const rotatedPosition = content.kind !== 'reference' && content.rotate
    ? rotatePositionByCenter({ x, y }, { x: draggingSelectionX, y: draggingSelectionY }, content.rotate)
    : { x, y }
  const deltaX = rotatedPosition.x - draggingSelectionX
  const deltaY = rotatedPosition.y - draggingSelectionY
  let resultX = draggingSelectionX
  let resultY = draggingSelectionY
  let resultWidth = draggingSelectionWidth
  let resultHeight = draggingSelectionHeight
  if (draggingSelectionKind.includes('left')) {
    resultWidth -= deltaX
    if (content.kind !== 'reference' && content.rotate) {
      const rotate = content.rotate * Math.PI / 180
      const deltaCenterX = (resultWidth - draggingSelectionWidth) / 2
      resultX -= (Math.cos(rotate) + 1) * deltaCenterX
      resultY -= Math.sin(rotate) * deltaCenterX
    } else {
      resultX = x
    }
  }
  if (draggingSelectionKind.includes('right')) {
    resultWidth += deltaX
    if (content.kind !== 'reference' && content.rotate) {
      const rotate = content.rotate * Math.PI / 180
      const deltaCenterX = (resultWidth - draggingSelectionWidth) / 2
      resultX += (Math.cos(rotate) - 1) * deltaCenterX
      resultY += Math.sin(rotate) * deltaCenterX
    }
  }
  if (draggingSelectionKind.includes('top')) {
    resultHeight -= deltaY
    if (content.kind !== 'reference' && content.rotate) {
      const rotate = content.rotate * Math.PI / 180
      const deltaCenterY = (resultHeight - draggingSelectionHeight) / 2
      resultX += Math.sin(rotate) * deltaCenterY
      resultY -= (Math.cos(rotate) + 1) * deltaCenterY
    } else {
      resultY = y
    }
  }
  if (draggingSelectionKind.includes('bottom')) {
    resultHeight += deltaY
    if (content.kind !== 'reference' && content.rotate) {
      const rotate = content.rotate * Math.PI / 180
      const deltaCenterY = (resultHeight - draggingSelectionHeight) / 2
      resultX -= Math.sin(rotate) * deltaCenterY
      resultY += (Math.cos(rotate) - 1) * deltaCenterY
    }
  }
  content.x = formatPixel(resultX)
  content.y = formatPixel(resultY)
  setContentSize(content, 'width', resultWidth)
  setContentSize(content, 'height', resultHeight)
}

export function rotateContent(x: number, y: number) {
  if (x > 0) {
    return formatPixel(Math.atan(y / x) / Math.PI * 180 + 90)
  }
  if (equal(x, 0)) {
    if (y > 0) {
      return 180
    }
    if (y < 0) {
      return 0
    }
    return undefined
  }
  return formatPixel(Math.atan(y / x) / Math.PI * 180 - 90)
}

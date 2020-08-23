import { TemplateRegion } from '../utils'
import { Template } from '../model'

export function getTemplateAlignment(
  x: number,
  y: number,
  scale: number,
  template: Template,
  templateRegions: TemplateRegion[]
) {
  const delta = rawDelta / scale
  const result: {
    x?: {
      template: number
      alignment: number
    }
    y?: {
      template: number
      alignment: number
    }
  } = {}
  let xRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.x - x) < delta)
  if (xRegion) {
    result.x = {
      template: xRegion.x,
      alignment: xRegion.x,
    }
  } else {
    const newX = x + template.width / 2
    xRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.x + r.width / 2 - newX) < delta)
    if (xRegion) {
      result.x = {
        template: xRegion.x + (xRegion.width - template.width) / 2,
        alignment: xRegion.x + xRegion.width / 2,
      }
    } else {
      const newX = x + template.width
      xRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.x + r.width - newX) < delta)
      if (xRegion) {
        result.x = {
          template: xRegion.x + xRegion.width - template.width,
          alignment: xRegion.x + xRegion.width,
        }
      }
    }
  }
  
  let yRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.y - y) < delta)
  if (yRegion) {
    result.y = {
      template: yRegion.y,
      alignment: yRegion.y,
    }
  } else {
    const newY = y + template.height / 2
    yRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.y + r.height / 2 - newY) < delta)
    if (yRegion) {
      result.y = {
        template: yRegion.y + (yRegion.height - template.height) / 2,
        alignment: yRegion.y + yRegion.height / 2,
      }
    } else {
      const newY = y + template.height
      yRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.y + r.height - newY) < delta)
      if (yRegion) {
        result.y = {
          template: yRegion.y + yRegion.height - template.height,
          alignment: yRegion.y + yRegion.height,
        }
      }
    }
  }

  return result
}

const rawDelta = 10

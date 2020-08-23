import { TemplateRegion } from '../utils'
import { Template } from '../model'

export function getTemplateAlignment(
  x: number,
  y: number,
  template: Template,
  templateRegions: TemplateRegion[]
) {
  const xRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.x - x) < delta)
  const yRegion = templateRegions.find((r) => r.template !== template && Math.abs(r.y - y) < delta)
  return {
    x: xRegion?.x,
    y: yRegion?.y,
  }
}

const delta = 20

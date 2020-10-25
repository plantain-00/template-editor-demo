
import { CanvasState } from './canvas-state'
import { RegionSide } from './utils'

const cursors = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize']

export function getCursor(kind: 'move' | 'grab' | 'grabbing' | RegionSide, canvasState: CanvasState) {
  if (kind === 'move' || kind === 'grab' || kind === 'grabbing') {
    return kind
  }
  let offset = 0
  if (canvasState.styleGuide.selection.kind === 'content'
    && canvasState.styleGuide.selection.content.kind !== 'reference'
    && canvasState.styleGuide.selection.content.kind !== 'snapshot'
    && canvasState.styleGuide.selection.content.rotate) {
    const rotate = canvasState.styleGuide.selection.content.rotate % 180
    if (rotate > 22.5) {
      if (rotate < 67.5) {
        offset += 1
      } else if (rotate < 112.5) {
        offset += 2
      } else if (rotate < 157.5) {
        offset += 3
      }
    } else if (rotate < -22.5) {
      if (rotate > -67.5) {
        offset += 3
      } else if (rotate > -112.5) {
        offset += 2
      } else if (rotate > -157.5) {
        offset += 1
      }
    }
  }
  if (kind === 'top' || kind === 'bottom') {
    return cursors[(offset + 2) % 4]
  }
  if (kind === 'right' || kind === 'left') {
    return cursors[offset % 4]
  }
  if (kind === 'right-top' || kind === 'left-bottom') {
    return cursors[(offset + 3) % 4]
  }
  return cursors[(offset + 1) % 4]
}

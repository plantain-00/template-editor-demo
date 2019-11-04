
import { Template, Position } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression, evaluateColorExpression, evaluateRotateExpression } from './expression'
import { layoutFlex } from './layout-engine'
import { applyImageOpacity, loadImage } from './image'
import { getCharacters } from './mock'
import { formatPixel, formatRadian } from '../utils'
import { iterateSymbolRenderItem } from './renderer'

export function renderTemplate(template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    layoutFlex(template, templates)
    renderTemplateOnCanvas(ctx, template, templates, images)
  }
  return canvas.toDataURL('image/jpeg')
}

/**
 * @internal
 */
export function renderTemplateOnCanvas(ctx: CanvasRenderingContext2D | undefined, template: Template, templates: Template[], images: { [url: string]: HTMLImageElement }) {
  const infos: string[] = []
  if (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, template.width, template.height)
  } else {
    infos.push(
      `ctx.fillStyle = 'white'`,
      `ctx.fillRect(0, 0, ${template.width}, ${template.height})`,
    )
  }
  const actions: Array<{ z: number, index: number, action: (ctx: CanvasRenderingContext2D | undefined) => string[] }> = []
  renderSymbol(template, templates, images, actions, { x: 0, y: 0, z: 0 })
  actions.sort((a, b) => {
    if (a.z !== b.z) {
      return a.z - b.z
    }
    return a.index - b.index
  })
  for (const { action } of actions) {
    infos.push(...action(ctx))
  }
  return infos
}

export async function loadTemplateImages(
  template: Template,
  templates: Template[],
) {
  const images: { [url: string]: Promise<HTMLImageElement> } = {}
  collectTemplateImages(template, templates, images)
  const array = Object.keys(images).map((url) => ({ url, resource: images[url] }))
  const values = await Promise.all(array.map((a) => a.resource))

  const result: { [url: string]: HTMLImageElement } = {}
  for (let i = 0; i < array.length; i++) {
    result[array[i].url] = values[i]
  }
  return result
}

function collectTemplateImages(
  template: Template,
  templates: Template[],
  images: { [url: string]: Promise<HTMLImageElement> },
) {
  for (const content of template.contents) {
    if (content.hidden) {
      continue
    }
    if (content.kind === 'image') {
      if (content.base64 && images[content.base64]) {
        continue
      }
      if (images[content.url]) {
        continue
      }
      if (content.base64) {
        images[content.url] = loadImage(content.base64)
      } else {
        images[content.url] = loadImage(content.url)
      }
    } else if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        collectTemplateImages(reference, templates, images)
      }
    } else if (content.kind === 'snapshot') {
      collectTemplateImages(content.snapshot, templates, images)
    }
  }
}

function renderSymbol(
  template: Template,
  templates: Template[],
  images: { [url: string]: HTMLImageElement },
  actions: Array<{ z: number, index: number, action: (ctx: CanvasRenderingContext2D | undefined) => string[] }>,
  position: Required<Position>,
  props?: unknown,
) {
  for (const renderItem of iterateSymbolRenderItem(template, templates)) {
    const x = formatPixel(position.x + evaluatePositionExpression('x', renderItem.content, { props }))
    const y = formatPixel(position.y + evaluatePositionExpression('y', renderItem.content, { props }))
    const z = Math.round(position.z + evaluatePositionExpression('z', renderItem.content, { props }))
    if (renderItem.kind !== 'symbol') {
      const width = evaluateSizeExpression('width', renderItem.content, { props })
      const height = evaluateSizeExpression('height', renderItem.content, { props })
      const rotate = formatRadian(evaluateRotateExpression(renderItem.content, { props }) * Math.PI / 180)
      const centerX = formatPixel(x + width / 2)
      const centerY = formatPixel(y + height / 2)
      const rotateInCanvas = (ctx: CanvasRenderingContext2D) => {
        if (rotate) {
          ctx.translate(centerX, centerY)
          ctx.rotate(rotate)
          ctx.translate(-centerX, -centerY)
        }
      }
      const rotateActions = rotate ? [
        `ctx.translate(${centerX}, ${centerY})`,
        `ctx.rotate(${rotate})`,
        `ctx.translate(${-centerX}, ${-centerY})`,
      ] : []
      const resetTransformInCanvas = (ctx: CanvasRenderingContext2D) => {
        if (rotate) {
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
      }
      const resetTransformActions = rotate ? [
        `ctx.setTransform(1, 0, 0, 1, 0, 0)`,
      ] : []

      if (renderItem.kind === 'text') {
        const content = renderItem.content
        actions.push({
          z,
          index: actions.length,
          action: (ctx) => {
            const fontSize = evaluateFontSizeExpression(content, { props })
            const color = evaluateColorExpression(content, { props })
            const characters = content.characters || getCharacters(evaluateTextExpression(content, { props }))
            if (ctx) {
              ctx.fillStyle = color
              ctx.textBaseline = 'top'
              ctx.font = `${fontSize}px ${content.fontFamily}`
              rotateInCanvas(ctx)
              ctx.fillText(characters.map((c) => c.text).join(''), x, y)
              resetTransformInCanvas(ctx)
              return []
            }
            return [
              `ctx.fillStyle = ${color}`,
              `ctx.textBaseline = 'top'`,
              `ctx.font = ${fontSize}px ${content.fontFamily}`,
              ...rotateActions,
              `ctx.fillText(${characters.map((c) => c.text).join('')}, ${x}, ${y})`,
              ...resetTransformActions,
            ]
          },
        })
      } else if (renderItem.kind === 'image') {
        const content = renderItem.content
        const url = evaluateUrlExpression(content, { props })
        let image: HTMLImageElement | HTMLCanvasElement = images[url]
        if (content.opacity !== undefined) {
          const imageCanvas = applyImageOpacity(image, content.opacity)
          if (imageCanvas) {
            image = imageCanvas
          }
        }
        actions.push({
          z,
          index: actions.length,
          action: (ctx) => {
            if (ctx) {
              rotateInCanvas(ctx)
              ctx.drawImage(image, x, y, width, height)
              resetTransformInCanvas(ctx)
              return []
            }
            return [
              ...rotateActions,
              `ctx.drawImage(${url}, ${x}, ${y}, ${width}, ${height})`,
              ...resetTransformActions,
            ]
          },
        })
      } else if (renderItem.kind === 'color') {
        const content = renderItem.content
        const color = evaluateColorExpression(content, { props })
        actions.push({
          z,
          index: actions.length,
          action: (ctx) => {
            if (ctx) {
              ctx.fillStyle = color
              rotateInCanvas(ctx)
              ctx.fillRect(x, y, width, height)
              resetTransformInCanvas(ctx)
              return []
            }
            return [
              ...rotateActions,
              `ctx.fillStyle = ${content.color}`,
              `ctx.fillRect(${x}, ${y}, ${width}, ${height})`,
              ...resetTransformActions,
            ]
          },
        })
      }
    } else if (renderItem.kind === 'symbol') {
      const newProps = evaluate(renderItem.props, { props })
      renderSymbol(renderItem.symbol, templates, images, actions, { x, y, z }, newProps)
    }
  }
}

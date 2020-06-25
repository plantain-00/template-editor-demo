import { Template, Position, Rotate, StyleGuide } from '../model'
import { evaluate, evaluateSizeExpression, evaluateUrlExpression, evaluateTextExpression, evaluateFontSizeExpression, evaluatePositionExpression, evaluateColorExpression, evaluateRotateExpression } from './expression'
import { layoutFlex } from './layout-engine'
import { applyImageOpacity, loadImage, imageToCtx, applyImageBlendMode } from './image'
import { getCharacters } from './mock'
import { formatPixel, formatRadian, getVariableObject } from '../utils'
import { iterateSymbolRenderItem } from './renderer'

export function renderTemplate(template: Template, styleGuide: StyleGuide, images: { [url: string]: HTMLImageElement }) {
  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    layoutFlex(template, styleGuide)
    renderTemplateOnCanvas(ctx, template, styleGuide, images)
  }
  return canvas.toDataURL('image/jpeg')
}

/**
 * @internal
 */
export function renderTemplateOnCanvas(ctx: CanvasRenderingContext2D | undefined, template: Template, styleGuide: StyleGuide, images: { [url: string]: HTMLImageElement }) {
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
  const variable = getVariableObject(styleGuide.variables?.[0])
  renderSymbol(template, styleGuide, images, actions, { x: 0, y: 0, z: 0 }, [], variable)
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

export async function loadTemplateImages(template: Template, styleGuide: StyleGuide) {
  const images: { [url: string]: Promise<HTMLImageElement> } = {}
  collectTemplateImages(template, styleGuide, images)
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
  styleGuide: StyleGuide,
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
      const reference = styleGuide.templates.find((t) => t.id === content.id)
      if (reference) {
        collectTemplateImages(reference, styleGuide, images)
      }
    } else if (content.kind === 'snapshot') {
      collectTemplateImages(content.snapshot, styleGuide, images)
    }
  }
}

function renderSymbol(
  template: Template,
  styleGuide: StyleGuide,
  images: { [url: string]: HTMLImageElement },
  actions: Array<{ z: number, index: number, action: (ctx: CanvasRenderingContext2D | undefined) => string[] }>,
  position: Required<Position>,
  rotates: Array<Required<Rotate> & Position>,
  variable: { [name: string]: unknown },
  props?: unknown,
) {
  for (const renderItem of iterateSymbolRenderItem(template, styleGuide)) {
    const x = formatPixel(position.x + evaluatePositionExpression('x', renderItem.content, { variable, props }))
    const y = formatPixel(position.y + evaluatePositionExpression('y', renderItem.content, { variable, props }))
    const z = Math.round(position.z + evaluatePositionExpression('z', renderItem.content, { variable, props }))
    const rotate = formatRadian(evaluateRotateExpression(renderItem.content, { variable, props }) * Math.PI / 180)
    if (renderItem.kind !== 'symbol') {
      const width = evaluateSizeExpression('width', renderItem.content, { variable, props })
      const height = evaluateSizeExpression('height', renderItem.content, { variable, props })
      const centerX = formatPixel(x + width / 2)
      const centerY = formatPixel(y + height / 2)
      const rotateInCanvas = (ctx: CanvasRenderingContext2D) => {
        for (const r of rotates) {
          ctx.translate(r.x, r.y)
          ctx.rotate(r.rotate)
          ctx.translate(-r.x, -r.y)
        }
        if (rotate) {
          ctx.translate(centerX, centerY)
          ctx.rotate(rotate)
          ctx.translate(-centerX, -centerY)
        }
      }
      const rotateActions: string[] = []
      for (const r of rotates) {
        rotateActions.push(
          `ctx.translate(${r.x}, ${r.y})`,
          `ctx.rotate(${r.rotate})`,
          `ctx.translate(${-r.x}, ${-r.y})`,
        )
      }
      if (rotate) {
        rotateActions.push(
          `ctx.translate(${centerX}, ${centerY})`,
          `ctx.rotate(${rotate})`,
          `ctx.translate(${-centerX}, ${-centerY})`,
        )
      }
      const resetTransformInCanvas = (ctx: CanvasRenderingContext2D) => {
        if (rotate || rotates.length > 0) {
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
      }
      const resetTransformActions = rotate || rotates.length > 0 ? [
        `ctx.setTransform(1, 0, 0, 1, 0, 0)`,
      ] : []

      if (renderItem.kind === 'text') {
        const content = renderItem.content
        actions.push({
          z,
          index: actions.length,
          action: (ctx) => {
            const fontSize = evaluateFontSizeExpression(content, { variable, props })
            const color = evaluateColorExpression(content, { variable, props })
            const characters = content.characters || getCharacters(evaluateTextExpression(content, { variable, props }))
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
        const url = evaluateUrlExpression(content, { variable, props })
        const image: HTMLImageElement = images[url]
        let imageCtx: CanvasRenderingContext2D | undefined
        if (content.opacity !== undefined) {
          imageCtx = imageToCtx(image)
          applyImageOpacity(imageCtx, content.opacity)
        }
        actions.push({
          z,
          index: actions.length,
          action: (ctx) => {
            if (ctx) {
              rotateInCanvas(ctx)
              if (content.blendMode) {
                if (!imageCtx) {
                  imageCtx = imageToCtx(image)
                }
                applyImageBlendMode(imageCtx, ctx, { x, y, width, height })
              } else {
                ctx.drawImage(imageCtx ? imageCtx.canvas : image, x, y, width, height)
              }
              resetTransformInCanvas(ctx)
              return []
            }
            return [
              ...rotateActions,
              content.blendMode
                ? `ctx.drawImage(${url}, ${x}, ${y}, ${width}, ${height}, ${content.blendMode})`
                : `ctx.drawImage(${url}, ${x}, ${y}, ${width}, ${height})`,
              ...resetTransformActions,
            ]
          },
        })
      } else if (renderItem.kind === 'color') {
        const content = renderItem.content
        const color = evaluateColorExpression(content, { variable, props })
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
      const newProps = evaluate(renderItem.props, { variable, props })
      let newRotates: Array<Required<Rotate> & Position> = rotates
      if (rotate) {
        const width = evaluateSizeExpression('width', renderItem.symbol, { variable, props: newProps })
        const height = evaluateSizeExpression('height', renderItem.symbol, { variable, props: newProps })
        newRotates = [
          ...rotates,
          {
            rotate,
            x: formatPixel(x + width / 2),
            y: formatPixel(y + height / 2)
          }
        ]
      }
      renderSymbol(renderItem.symbol, styleGuide, images, actions, { x, y, z }, newRotates, variable, newProps)
    }
  }
}

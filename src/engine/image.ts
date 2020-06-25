import { Region } from '../model'

export function applyImageOpacity(ctx: CanvasRenderingContext2D, opacity: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let i = 0; i < ctx.canvas.width / 2; i++) {
    for (let j = 0; j < ctx.canvas.height; j++) {
      const index = (j * ctx.canvas.width + i) * 4 + 3
      let value = Math.round(imageData.data[index] * opacity)
      value = Math.max(value, 0)
      value = Math.min(value, 255)
      imageData.data[index] = value
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

export function imageToCtx(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas.getContext')
  }
  ctx.drawImage(image, 0, 0)
  return ctx
}

export function applyImageBlendMode(
  ctx: CanvasRenderingContext2D,
  backgroundCtx: CanvasRenderingContext2D,
  region: Region,
) {
  region.x = Math.round(region.x)
  region.y = Math.round(region.y)
  region.width = Math.round(region.width)
  region.height = Math.round(region.height)
  const sourceImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const imageData = backgroundCtx.getImageData(region.x, region.y, region.width, region.height)
  for (let i = 0; i < region.width; i++) {
    const sourceI = Math.round(i / region.width * ctx.canvas.width)
    for (let j = 0; j < region.height; j++) {
      const sourceJ = Math.round(j / region.height * ctx.canvas.height)
      const baseIndex = (j * region.width + i) * 4
      const baseSourceIndex = (sourceJ * ctx.canvas.width + sourceI) * 4
      if (sourceImageData.data[baseSourceIndex + 3] === 0) {
        continue
      }
      for (let k = 0; k < 3; k++) {
        const index = baseIndex + k
        const sourceIndex = baseSourceIndex + k
        let value = Math.round(imageData.data[index] * sourceImageData.data[sourceIndex] / 255)
        value = Math.max(value, 0)
        value = Math.min(value, 255)
        imageData.data[index] = value
      }
    }
  }
  backgroundCtx.putImageData(imageData, region.x, region.y)
}

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = document.createElement('img')
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      resolve(image)
    }
    if (url.startsWith('data:image/')) {
      image.src = url
    } else {
      image.src = url + '?random=' + Math.random()
    }
  })
}

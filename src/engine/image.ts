export function applyImageOpacity(image: HTMLImageElement, opacity: number) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, image.width, image.height)
    for (let i = 0; i < image.width / 2; i++) {
      for (let j = 0; j < image.height; j++) {
        const index = (j * image.width + i) * 4 + 3
        let value = Math.round(imageData.data[index] * opacity)
        value = Math.max(value, 0)
        value = Math.min(value, 255)
        imageData.data[index] = value
      }
    }
    ctx.putImageData(imageData, 0, 0)
    return canvas
  }
  return undefined
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

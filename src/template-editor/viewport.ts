export function createViewport(initialWidth: number, initialHeight: number) {
  return {
    translateX: 0,
    translateY: 0,
    scale: 1,
    width: initialWidth,
    height: initialHeight,
    mapX(x: number, width: number) {
      return (x - ((this.translateX - width / 2) * this.scale + width / 2)) / this.scale
    },
    mapY(y: number, height: number) {
      return (y - ((this.translateY - height / 2) * this.scale + height / 2)) / this.scale
    },
    mapBackX(x: number, width: number) {
      return x * this.scale + ((this.translateX - width / 2) * this.scale + width / 2)
    },
    mapBackY(y: number, height: number) {
      return y * this.scale + ((this.translateY - height / 2) * this.scale + height / 2)
    },
    move(e: WheelEvent) {
      if (!e.ctrlKey) {
        this.translateX -= e.deltaX / this.scale
        this.translateY -= e.deltaY / this.scale
      }
    },
    zoom(e: WheelEvent, width: number, height: number) {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let newScale = 1
        if (e.deltaY > 0) {
          newScale = this.scale * 0.98
        } else if (e.deltaY < 0) {
          newScale = this.scale / 0.98
        }
        const newTranslateX = (e.offsetX - this.mapX(e.offsetX, width) * newScale - width / 2) / newScale + width / 2
        const newTranslateY = (e.offsetY - this.mapY(e.offsetY, height) * newScale - height / 2) / newScale + height / 2
        this.scale = newScale
        this.translateX = newTranslateX
        this.translateY = newTranslateY
      }
    },
  }
}

export type Viewport = ReturnType<typeof createViewport>

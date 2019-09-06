module.exports = {
  base: 'src',
  files: [
    'src/*.template.html'
  ],
  /**
   * @argument {string} file
   */
  handler: (file) => {
    if (file.endsWith('index.template.html')) {
      return {
        type: 'vue',
        name: 'App',
        path: './index'
      }
    }
    if (file.endsWith('canvas-mask.template.html')) {
      return {
        type: 'vue',
        name: 'CanvasMask',
        path: './canvas-mask'
      }
    }
    if (file.endsWith('dragging-area.template.html')) {
      return {
        type: 'vue',
        name: 'DraggingArea',
        path: './dragging-area'
      }
    }
    if (file.endsWith('editor-panel.template.html')) {
      return {
        type: 'vue',
        name: 'EditorPanel',
        path: './editor-panel'
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

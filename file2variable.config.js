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
    if (file.endsWith('mask-layer.template.html')) {
      return {
        type: 'vue',
        name: 'MaskLayer',
        path: './mask-layer'
      }
    }
    if (file.endsWith('dragging-layer.template.html')) {
      return {
        type: 'vue',
        name: 'DraggingLayer',
        path: './dragging-layer'
      }
    }
    if (file.endsWith('operation-panel.template.html')) {
      return {
        type: 'vue',
        name: 'OperationPanel',
        path: './operation-panel'
      }
    }
    if (file.endsWith('render-layer.template.html')) {
      return {
        type: 'vue',
        name: 'RenderLayer',
        path: './render-layer'
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

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
    if (file.endsWith('dragging-for-selection-layer.template.html')) {
      return {
        type: 'vue',
        name: 'DraggingForSelectionLayer',
        path: './dragging-for-selection-layer'
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
    if (file.endsWith('selection-layer.template.html')) {
      return {
        type: 'vue',
        name: 'SelectionLayer',
        path: './selection-layer'
      }
    }
    if (file.endsWith('context-menu.template.html')) {
      return {
        type: 'vue',
        name: 'ContextMenu',
        path: './context-menu'
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

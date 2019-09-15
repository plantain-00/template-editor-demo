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
    if (file.endsWith('.template.html')) {
      file = file.substring(file.lastIndexOf('/') + 1)
      const names = file.substring(0, file.length - '.template.html'.length).split('-')
      return {
        type: 'vue',
        name: names.map((n) => n[0].toUpperCase() + n.substring(1)).join(''),
        path: './' + names.join('-')
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

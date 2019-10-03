const path = require('path')

module.exports = {
  base: 'src',
  files: [
    'src/**/*.template.html'
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
      file = path.relative('src', file)
      const dirname = path.dirname(file)
      const filename = path.basename(file)
      const names = filename.substring(0, filename.length - '.template.html'.length).split('-')
      return {
        type: 'vue',
        name: names.map((n) => n[0].toUpperCase() + n.substring(1)).join(''),
        path: (dirname === '.' ? '.' : './' + dirname) + '/' + names.join('-')
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

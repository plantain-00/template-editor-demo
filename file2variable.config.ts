import * as path from 'path'
import { Configuration } from 'file2variable-cli'

const isDev = process.env.NODE_ENV === 'development'

export default {
  base: 'src',
  files: [
    'src/**/*.template.html',
    'src/**/*.schema.json'
  ],
  handler: (file) => {
    if (file.endsWith('.schema.json')) {
      return {
        type: 'json'
      }
    }
    if (file.endsWith('index.template.html')) {
      return {
        type: 'vue',
        name: 'App',
        position: isDev,
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
        position: isDev,
        name: names.map((n) => n[0].toUpperCase() + n.substring(1)).join(''),
        path: (dirname === '.' ? '.' : './' + dirname) + '/' + names.join('-')
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
} as Configuration

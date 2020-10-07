import { Configuration } from 'file2variable-cli'

const config: Configuration = {
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
    if (file.endsWith('.template.html')) {
      return {
        type: 'vue3',
      }
    }
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}

export default config

const fs = require('fs')

module.exports = {
  inputFiles: [
    '*.bundle.js',
    '*.bundle.css',
    '*.ejs.html'
  ],
  excludeFiles: [
    'service-worker.bundle.js'
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'index.bundle.js',
    'index.bundle.css'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json',
  context: {
    prerender: fs.readFileSync('prerender/index.html')
  }
}

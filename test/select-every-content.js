const test = require('ava')

const { iterateAllContentRegions } = require('../test-dist/utils')

const title = 'select every content'

const styleGuide = require('./case')

test(title, t => {
  const allContentRegions = styleGuide.templates.map((t) => t.contents.map((c) => Array.from(iterateAllContentRegions(c, styleGuide))))
  t.snapshot({ allContentRegions }, { id: title })
})

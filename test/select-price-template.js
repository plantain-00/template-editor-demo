const test = require('ava')

const { iterateAllTemplateRegions } = require('../test-dist/utils')

const title = 'select price template'

const styleGuide = require('./case')

test(title, t => {
  const allTemplateRegions = Array.from(iterateAllTemplateRegions(styleGuide.templates[0], styleGuide))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

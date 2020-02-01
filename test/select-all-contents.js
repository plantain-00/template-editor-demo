const test = require('ava')

const { iterateAllContentRegions } = require('../test-dist/utils')

const title = 'select all contents'

const styleGuide = require('./case')

test(title, t => {
  const allContentRegions = Array.from(iterateAllContentRegions(undefined, styleGuide))
  t.snapshot({ count: allContentRegions.length, allContentRegions }, { id: title })
})

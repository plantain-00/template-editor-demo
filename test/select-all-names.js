const test = require('ava')

const { iterateAllNameRegions } = require('../test-dist/utils')

const title = 'select all names'

const styleGuide = require('./case')

test(title, t => {
  const allNameRegions = Array.from(iterateAllNameRegions(undefined, styleGuide, 1))
  t.snapshot({ count: allNameRegions.length, allNameRegions }, { id: title })
})

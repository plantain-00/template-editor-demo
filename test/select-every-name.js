import test from 'ava'

import { iterateAllNameRegions } from '../test-dist/utils'

const title = 'select every name'

const styleGuide = require('./case')

test(title, t => {
  const allNameRegions = styleGuide.templates.map((t) => Array.from(iterateAllNameRegions(t, styleGuide, 1)))
  t.snapshot({ count: allNameRegions.length, allNameRegions }, { id: title })
})

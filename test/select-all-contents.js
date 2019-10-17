import test from 'ava'

import { iterateAllContentRegions } from '../test-dist/utils'

const title = 'select all contents'

const styleGuide = require('./case')

test(title, t => {
  const allContentRegions = Array.from(iterateAllContentRegions(undefined, styleGuide))
  t.snapshot({ count: allContentRegions.length, allContentRegions }, { id: title })
})

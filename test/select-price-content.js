import test from 'ava'

import { iterateAllContentRegions } from '../test-dist/utils'

const title = 'select price content'

const styleGuide = require('./case')

test(title, t => {
  const allContentRegions = Array.from(iterateAllContentRegions(styleGuide.templates[0].contents[0], styleGuide))
  t.snapshot({ count: allContentRegions.length, allContentRegions }, { id: title })
})

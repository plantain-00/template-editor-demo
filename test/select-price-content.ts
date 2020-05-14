import test from 'ava'

import { iterateAllContentRegions } from '../src/utils'

const title = 'select price content'

import { styleGuide } from './data'

test(title, t => {
  const allContentRegions = Array.from(iterateAllContentRegions(styleGuide.templates[0].contents[0], styleGuide))
  t.snapshot({ count: allContentRegions.length, allContentRegions }, { id: title })
})

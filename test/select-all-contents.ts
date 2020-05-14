import test from 'ava'

import { iterateAllContentRegions } from '../src/utils'

const title = 'select all contents'

import { styleGuide } from './data'

test(title, t => {
  const allContentRegions = Array.from(iterateAllContentRegions(undefined, styleGuide))
  t.snapshot({ count: allContentRegions.length, allContentRegions }, { id: title })
})

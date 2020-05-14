import test from 'ava'

import { iterateAllNameRegions } from '../src/utils'

const title = 'select all names'

import { styleGuide } from './data'

test(title, t => {
  const allNameRegions = Array.from(iterateAllNameRegions(undefined, styleGuide, 1))
  t.snapshot({ count: allNameRegions.length, allNameRegions }, { id: title })
})

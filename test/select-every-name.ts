import test from 'ava'

import { iterateAllNameRegions } from '../src/utils'

const title = 'select every name'

import { styleGuide } from './data'

test(title, t => {
  const allNameRegions = styleGuide.templates.map((t) => Array.from(iterateAllNameRegions(t, styleGuide, 1)))
  t.snapshot({ count: allNameRegions.length, allNameRegions }, { id: title })
})

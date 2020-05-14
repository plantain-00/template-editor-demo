import test from 'ava'

import { iterateAllTemplateRegions } from '../src/utils'

const title = 'select price template'

import { styleGuide } from './data'

test(title, t => {
  const allTemplateRegions = Array.from(iterateAllTemplateRegions(styleGuide.templates[0], styleGuide))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

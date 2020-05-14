import test from 'ava'

import { iterateAllTemplateRegions } from '../src/utils'

const title = 'select all templates'

import { styleGuide } from './data'

test(title, t => {
  const allTemplateRegions = Array.from(iterateAllTemplateRegions(undefined, styleGuide))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

import test from 'ava'

import { iterateAllTemplateRegions } from '../src/utils'

const title = 'select every template'

import { styleGuide } from './data'

test(title, t => {
  const allTemplateRegions = styleGuide.templates.map((t) => Array.from(iterateAllTemplateRegions(t, styleGuide)))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

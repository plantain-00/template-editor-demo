import test from 'ava'

import { iterateAllTemplateRegions } from '../test-dist/utils'

const title = 'select all templates'

const styleGuide = require('./case')

test(title, t => {
  const allTemplateRegions = Array.from(iterateAllTemplateRegions(undefined, styleGuide))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

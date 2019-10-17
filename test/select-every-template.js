import test from 'ava'

import { iterateAllTemplateRegions } from '../test-dist/utils'

const title = 'select every template'

const styleGuide = require('./case')

test(title, t => {
  const allTemplateRegions = styleGuide.templates.map((t) => Array.from(iterateAllTemplateRegions(t, styleGuide)))
  t.snapshot({ count: allTemplateRegions.length, allTemplateRegions }, { id: title })
})

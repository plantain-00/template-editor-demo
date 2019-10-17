import test from 'ava'

import { iterateAllContentRegions } from '../test-dist/utils'

const title = 'select every content'

const styleGuide = require('./case')

test(title, t => {
  const allContentRegions = styleGuide.templates.map((t) => t.contents.map((c) => Array.from(iterateAllContentRegions(c, styleGuide))))
  t.snapshot({ allContentRegions }, { id: title })
})

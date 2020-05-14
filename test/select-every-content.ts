import test from 'ava'

import { iterateAllContentRegions } from '../src/utils'

const title = 'select every content'

import { styleGuide } from './data'

test(title, t => {
  const allContentRegions = styleGuide.templates.map((t) => t.contents.map((c) => Array.from(iterateAllContentRegions(c, styleGuide))))
  t.snapshot({ allContentRegions }, { id: title })
})

import test from 'ava'

import { renderTemplateOnCanvas } from '../test-dist/engine/renderer'

const title = 'render every template'

const styleGuide = require('./case')

test(title, async (t) => {
  const infos = styleGuide.templates.map((t) => renderTemplateOnCanvas(undefined, t, styleGuide.templates, {}, false))
  t.snapshot({ infos }, { id: title })
})

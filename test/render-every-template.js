import test from 'ava'

import { renderTemplateOnCanvas } from '../test-dist/engine/canvas-renderer'

const title = 'render every template'

const styleGuide = require('./case')

test(title, async (t) => {
  const infos = styleGuide.templates.map((t) => renderTemplateOnCanvas(undefined, t, styleGuide, {}))
  t.snapshot({ infos }, { id: title })
})

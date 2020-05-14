import test from 'ava'

import { renderTemplateOnCanvas } from '../src/engine/canvas-renderer'

const title = 'render every template'

import { styleGuide } from './data'

test(title, async (t) => {
  const infos = styleGuide.templates.map((a) => renderTemplateOnCanvas(undefined, a, styleGuide, {}))
  t.snapshot({ infos }, { id: title })
})

import test from 'ava'

import { generate } from '../src/engine/template-engine'
import { renderTemplateOnCanvas } from '../src/engine/canvas-renderer'

const title = 'generate and render'

import { styleGuide, model } from './data'

test(title, async (t) => {
  const template = styleGuide.templates[14]
  const result = await generate(template, styleGuide, model)
  const infos = renderTemplateOnCanvas(undefined, result, styleGuide, {})
  t.snapshot({ result, infos }, { id: title })
})

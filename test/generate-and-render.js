import test from 'ava'

import { generate } from '../test-dist/engine/template-engine'
import { renderTemplateOnCanvas } from '../test-dist/engine/renderer'

const title = 'generate and render'

const styleGuide = require('./case')
const model = require('./model')

test(title, async (t) => {
  const template = styleGuide.templates[styleGuide.templates.length - 1]
  const result = await generate(template, styleGuide, model)
  const infos = renderTemplateOnCanvas(undefined, result, [], {}, false)
  t.snapshot({ result, infos }, { id: title })
})

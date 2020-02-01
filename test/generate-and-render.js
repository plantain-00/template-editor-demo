const test = require('ava')

const { generate } = require('../test-dist/engine/template-engine')
const { renderTemplateOnCanvas } = require('../test-dist/engine/canvas-renderer')

const title = 'generate and render'

const styleGuide = require('./case')
const model = require('./model')

test(title, async (t) => {
  const template = styleGuide.templates[14]
  const result = await generate(template, styleGuide, model)
  const infos = renderTemplateOnCanvas(undefined, result, [], {})
  t.snapshot({ result, infos }, { id: title })
})

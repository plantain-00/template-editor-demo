const test = require('ava')
const Vue = require('vue')
const vueServerRenderer = require('vue-server-renderer')

const { TemplateRenderer } = require('../test-dist/engine/vue-renderer')

const title = 'render every ui component'

const styleGuide = require('./case')

test(title, async (t) => {
  const renderer = vueServerRenderer.createRenderer()
  const Constructor = Vue.extend(TemplateRenderer)
  const infos = await Promise.all(styleGuide.templates.map((t) => renderer.renderToString(new Constructor({
    propsData: {
      template: t,
      styleGuide
    },
  }))))
  t.snapshot({ infos }, { id: title })
})

import test from 'ava'
import Vue from 'vue'
import { createRenderer } from 'vue-server-renderer'

import { TemplateRenderer } from '../src/engine/vue-renderer'

const title = 'render every ui component'

import { styleGuide } from './data'

test(title, async (t) => {
  const renderer = createRenderer()
  const Constructor = Vue.extend(TemplateRenderer)
  const infos = await Promise.all(styleGuide.templates.map((a) => renderer.renderToString(new Constructor({
    propsData: {
      template: a,
      styleGuide
    },
  }))))
  t.snapshot({ infos }, { id: title })
})

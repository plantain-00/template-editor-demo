import test from 'ava'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { TemplateRenderer } from '../src/engine/vue-renderer'

const title = 'render every ui component'

import { styleGuide } from './data'

test(title, async (t) => {
  const infos = await Promise.all(styleGuide.templates.map((a) => renderToString(createSSRApp(TemplateRenderer, {
    template: a,
    styleGuide
  }))))
  t.snapshot({ infos }, { id: title })
})

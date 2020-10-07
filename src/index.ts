import { createApp, defineComponent } from 'vue'
import { ArrayEditor, ObjectEditor, JSONEditor } from 'vue-schema-based-json-editor'
import { Node } from 'tree-vue-component'

import { indexTemplateHtml } from './variables'
import { AppPanel } from './app-panel'
import { TemplateModelEditor } from './template-model-editor'
import { createAppState } from './app-state'
import { TemplateEditor } from './template-editor/template-editor'

const App = defineComponent({
  render: indexTemplateHtml,
  components: {
    'app-panel': AppPanel,
    'template-model-editor': TemplateModelEditor,
    'template-editor': TemplateEditor,
  },
  data: () => {
    return {
      appState: createAppState()
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.appState.resize()
    })
  }
})

const app = createApp(App)
app.component('array-editor', ArrayEditor)
app.component('object-editor', ObjectEditor)
app.component('json-editor', JSONEditor)
app.component('node', Node)
app.mount('#container')

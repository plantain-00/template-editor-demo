import Vue from 'vue'
import Component from 'vue-class-component'
import 'vue-schema-based-json-editor'

import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { AppPanel } from './app-panel'
import { TemplateModelEditor } from './template-model-editor'
import { AppState } from './app-state'
import { TemplateEditor } from './template-editor/template-editor'

Vue.component('app-panel', AppPanel)
Vue.component('template-model-editor', TemplateModelEditor)
Vue.component('template-editor', TemplateEditor)

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  appState = new AppState()

  mounted() {
    window.addEventListener('resize', () => {
      this.appState.resize()
    })
  }
}

new App({ el: '#container' })

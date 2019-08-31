import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'
import { renderTemplate } from './renderer'
import { styleGuide } from './data'

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic
})
export class App extends Vue {
  public renderResult = ''

  beforeMount() {
    this.renderResult = renderTemplate(styleGuide.templates[0])
  }
}

new App({ el: '#container' })

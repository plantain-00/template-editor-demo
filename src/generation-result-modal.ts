import Vue from 'vue'
import Component from 'vue-class-component'
import { generationResultModalTemplateHtml, generationResultModalTemplateHtmlStatic } from './variables'
import { renderTemplate } from './renderer'
import { AppState } from './app-state'

@Component({
  render: generationResultModalTemplateHtml,
  staticRenderFns: generationResultModalTemplateHtmlStatic,
  props: {
    appState: AppState,
  }
})
export class GenerationResultModal extends Vue {
  private appState!: AppState

  modalStyle = {
    position: 'absolute',
    right: '0px',
    left: '0px',
    top: '50px',
    backgroundColor: 'white',
  }

  get result() {
    if (!this.appState.generationResult) {
      return ''
    }
    return renderTemplate(this.appState.generationResult, [])
  }

  clear() {
    this.appState.generationResult = null
  }
}

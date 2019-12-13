import Vue from 'vue'
import Component from 'vue-class-component'
import { templateEditorCollectionEditorTemplateHtml, templateEditorCollectionEditorTemplateHtmlStatic } from '../variables'
import { CanvasState } from './canvas-state'
import { operationPanelWidth } from './template-editor'

@Component({
  render: templateEditorCollectionEditorTemplateHtml,
  staticRenderFns: templateEditorCollectionEditorTemplateHtmlStatic,
  props: ['canvasState'],
})
export class CollectionEditor extends Vue {
  private canvasState!: CanvasState
  
  editorStyle = {
    position: 'absolute',
    right: operationPanelWidth + 'px',
    left: '0px',
    top: '50px',
    backgroundColor: 'white',
    zIndex: 1,
    height: this.canvasState.canvasHeight + 'px',
    overflow: 'auto',
  }

  get collection() {
    return JSON.stringify(this.canvasState.styleGuide.collections || [], null, 2)
  }

  changeCollection(e: { target: { value: string } }) {
    try {
      this.canvasState.styleGuide.collections = JSON.parse(e.target.value)
    } catch (error) {
      // do nothing
    }
  }
}

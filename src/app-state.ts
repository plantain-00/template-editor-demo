import Vue from 'vue'
import Component from 'vue-class-component'

import { Template } from './model'

@Component
export class AppState extends Vue {
  generationResult: Template | null = null
  templateModel: { [key: string]: unknown } = {
    categories: []
  }
  templateModelEditorVisible = false
}

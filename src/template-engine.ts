import { Template, TemplateContent, StyleGuide } from './model'

export function generate(template: Template, styleGuide: StyleGuide, viewModel: unknown) {
  return {
    ...template,
    contents: [...template.contents.map((c) => generateContent(c, styleGuide, viewModel))]
  }
}

function generateContent(content: TemplateContent, styleGuide: StyleGuide, viewModel: unknown): TemplateContent {
  if (content.kind === 'reference') {
    const reference = styleGuide.templates.find((t) => t.id === content.id)
    if (reference) {
      return {
        kind: 'snapshot',
        x: content.x,
        y: content.y,
        snapshot: generate(reference, styleGuide, viewModel)
      }
    }
  }
  return {
    ...content
  }
}

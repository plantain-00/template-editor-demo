import { parseExpression, tokenizeExpression, evaluateExpression } from 'expression-engine'

import { Template, TemplateContent, StyleGuide } from './model'

export function generate(template: Template, styleGuide: StyleGuide, viewModel: unknown): Template {
  const contents: TemplateContent[] = []
  for (const content of template.contents) {
    contents.push(...generateContent(content, styleGuide, viewModel))
  }
  return {
    ...template,
    contents
  }
}

function generateContent(content: TemplateContent, styleGuide: StyleGuide, viewModel: unknown): TemplateContent[] {
  if (content.kind === 'snapshot') {
    return [content]
  }
  if (content.if) {
    const result = evaluateExpression(parseExpression(tokenizeExpression(content.if)), {})
    if (!result) {
      return []
    }
  }
  if (content.kind === 'reference') {
    const reference = styleGuide.templates.find((t) => t.id === content.id)
    if (reference) {
      return [
        {
          kind: 'snapshot',
          x: content.x,
          y: content.y,
          snapshot: generate(reference, styleGuide, viewModel)
        },
      ]
    }
    return []
  }
  return [
    {
      ...content
    }
  ]
}

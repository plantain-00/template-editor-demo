import { Template, StyleGuide } from '../model'

export function* iterateSymbolRenderItem(template: Template, styleGuide: StyleGuide) {
  for (const content of template.contents) {
    if (content.hidden) {
      continue
    }
    if (content.kind === 'text') {
      yield {
        kind: 'text' as const,
        content,
      }
    } else if (content.kind === 'image') {
      yield {
        kind: 'image' as const,
        content,
      }
    } else if (content.kind === 'color') {
      yield {
        kind: 'color' as const,
        content,
      }
    } else if (content.kind === 'reference') {
      const reference = styleGuide.templates.find((t) => t.id === content.id)
      if (reference) {
        yield {
          kind: 'symbol' as const,
          content,
          symbol: reference,
          props: content.props,
        }
      }
    } else if (content.kind === 'snapshot') {
      yield {
        kind: 'symbol' as const,
        content,
        symbol: content.snapshot,
      }
    }
  }
}

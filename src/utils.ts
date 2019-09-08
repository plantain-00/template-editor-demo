

import { StyleGuide, Position, TemplateContent, Template, TemplateReferenceContent } from './model'

export function* iterateAllTemplatePositions(
  target: Template,
  styleGuide: StyleGuide,
) {
  for (const template of styleGuide.templates) {
    yield* iterateAllTemplate(target, template, { x: template.x, y: template.y }, styleGuide)
  }
}

export function* iterateAllContentPositions(
  target: TemplateContent,
  styleGuide: StyleGuide,
) {
  for (const template of styleGuide.templates) {
    yield* iterateAllContent(target, template, { x: template.x, y: template.y }, styleGuide)
  }
}

function* iterateAllTemplate(
  target: Template,
  template: Template,
  position: Position & { content?: TemplateReferenceContent },
  styleGuide: StyleGuide,
): Generator<Position & { content?: TemplateReferenceContent }, void, unknown> {
  if (template === target) {
    yield position
  } else {
    for (const content of template.contents) {
      if (content.kind === 'reference') {
        const referenceTemplate = styleGuide.templates.find((t) => t.id === content.id)
        if (referenceTemplate) {
          yield* iterateAllTemplate(
            target,
            referenceTemplate,
            {
              x: content.x + position.x,
              y: content.y + position.y,
              content,
            },
            styleGuide,
          )
        }
      }
    }
  }
}

function* iterateAllContent(
  target: TemplateContent,
  template: Template,
  position: Position,
  styleGuide: StyleGuide,
): Generator<Position, void, unknown> {
  for (const content of template.contents) {
    if (content === target) {
      yield {
        x: position.x + content.x,
        y: position.y + content.y,
      }
    } else if (content.kind === 'reference') {
      const referenceTemplate = styleGuide.templates.find((t) => t.id === content.id)
      if (referenceTemplate) {
        yield* iterateAllContent(
          target,
          referenceTemplate,
          {
            x: content.x + position.x,
            y: content.y + position.y,
          },
          styleGuide,
        )
      }
    }
  }
}

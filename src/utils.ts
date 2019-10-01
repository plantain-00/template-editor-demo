

import { StyleGuide, Position, TemplateContent, Template, TemplateReferenceContent, Region } from './model'

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
  targetTemplate?: Template,
) {
  if (targetTemplate) {
    yield* iterateAllContent(target, targetTemplate, { x: targetTemplate.x, y: targetTemplate.y }, styleGuide)
    return
  }
  for (const template of styleGuide.templates) {
    yield* iterateAllContent(target, template, { x: template.x, y: template.y }, styleGuide)
  }
}

export function isInRegion(position: Position | Position[], region: Region): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
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
): Generator<Position & { index: number, contents: TemplateContent[] }, void, unknown> {
  for (let i = 0; i < template.contents.length; i++) {
    const content = template.contents[i]
    if (content === target) {
      yield {
        x: position.x + content.x,
        y: position.y + content.y,
        index: i,
        contents: template.contents,
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
    } else if (content.kind === 'snapshot') {
      yield* iterateAllContent(
        target,
        content.snapshot,
        {
          x: content.x + position.x,
          y: content.y + position.y,
        },
        styleGuide,
      )
    }
  }
}

import { StyleGuide, Position, TemplateContent, Template, TemplateReferenceContent, Region } from './model'
import { getContentSize, getFlexPosition } from './engine/layout-engine'
import { evaluateSizeExpression, evaluate, evaluatePositionExpression } from './engine/expression'

export function* iterateAllTemplateRegions(
  target: Template | undefined,
  styleGuide: StyleGuide,
) {
  for (const template of styleGuide.templates) {
    yield* iterateAllTemplate(target, template, { x: template.x, y: template.y }, styleGuide, undefined)
  }
}

export function* iterateAllContentRegions(
  target: TemplateContent | undefined,
  styleGuide: StyleGuide,
  targetTemplate?: Template,
) {
  if (targetTemplate) {
    yield* iterateAllContent(target, targetTemplate, { x: targetTemplate.x, y: targetTemplate.y }, styleGuide, undefined, undefined)
    return
  }
  for (const template of styleGuide.templates) {
    yield* iterateAllContent(target, template, { x: template.x, y: template.y }, styleGuide, undefined, undefined)
  }
}

export function isInRegion(position: Position | Position[], region: Region): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

function* iterateAllTemplate(
  target: Template | undefined,
  template: Template,
  position: Position,
  styleGuide: StyleGuide,
  props: unknown,
  parent?: { content: TemplateReferenceContent, template: Template, index: number },
): Generator<Region & { parent?: { content: TemplateReferenceContent, template: Template, index: number }, template: Template }, void, unknown> {
  if (template === target || target === undefined) {
    const width = props ? evaluateSizeExpression('width', template, { props }) : template.width
    const height = props ? evaluateSizeExpression('height', template, { props }) : template.height
    yield {
      x: position.x,
      y: position.y,
      width,
      height,
      parent,
      template,
    }
  }
  if (template !== target) {
    for (let i = 0; i < template.contents.length; i++) {
      const content = template.contents[i]
      if (content.kind === 'reference') {
        const reference = styleGuide.templates.find((t) => t.id === content.id)
        if (reference) {
          const targetProps = content.props ? evaluate(content.props, { props }) : undefined
          yield* iterateAllTemplate(
            target,
            reference,
            {
              x: content.x + position.x,
              y: content.y + position.y,
            },
            styleGuide,
            targetProps,
            { content, template, index: i },
          )
        }
      }
    }
  }
}

function* iterateAllContent(
  target: TemplateContent | undefined,
  template: Template,
  position: Position,
  styleGuide: StyleGuide,
  props: unknown,
  container: Template | undefined,
): Generator<Region & { index: number, contents: TemplateContent[], content: TemplateContent, template: Template }, void, unknown> {
  for (let i = 0; i < template.contents.length; i++) {
    const content = template.contents[i]
    if (content === target || target === undefined) {
      const x = container && container.display === 'flex'
        ? getFlexPosition(content, 'x', container, styleGuide.templates)
        : props ? evaluatePositionExpression('x', content, { props }) : content.x
      const y = container && container.display === 'flex'
        ? getFlexPosition(content, 'y', container, styleGuide.templates)
        : props ? evaluatePositionExpression('y', content, { props }) : content.y
      const targetProps = content.kind === 'reference' && content.props ? evaluate(content.props, { props }) : undefined
      const size = getContentSize(content, styleGuide.templates)
      const width = targetProps ? evaluateSizeExpression('width', size, { props: targetProps }) : size.width
      const height = targetProps ? evaluateSizeExpression('height', size, { props: targetProps }) : size.height
      yield {
        x: position.x + x,
        y: position.y + y,
        width,
        height,
        index: i,
        contents: template.contents,
        content,
        template,
      }
    } else if (content !== target) {
      if (content.kind === 'reference') {
        const reference = styleGuide.templates.find((t) => t.id === content.id)
        if (reference) {
          const targetProps = content.props ? evaluate(content.props, { props }) : undefined
          yield* iterateAllContent(
            target,
            reference,
            {
              x: content.x + position.x,
              y: content.y + position.y,
            },
            styleGuide,
            targetProps,
            template,
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
          undefined,
          template,
        )
      }
    }
  }
}

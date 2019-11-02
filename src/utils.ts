import { StyleGuide, Position, TemplateContent, Template, TemplateReferenceContent, Region, Rotate } from './model'
import { getContentSize, getFlexPosition } from './engine/layout-engine'
import { evaluateSizeExpression, evaluate, evaluatePositionExpression, evaluateRotateExpression } from './engine/expression'

export function* iterateAllTemplateRegions(
  target: Template | undefined,
  styleGuide: StyleGuide,
) {
  for (const template of styleGuide.templates) {
    yield* iterateAllTemplate(target, template, { x: template.x, y: template.y, z: template.z || 0 }, styleGuide, undefined)
  }
}

export function* iterateAllContentRegions(
  target: TemplateContent | undefined,
  styleGuide: StyleGuide,
  targetTemplate?: Template,
) {
  if (targetTemplate) {
    yield* iterateAllContent(target, targetTemplate, targetTemplate, { x: targetTemplate.x, y: targetTemplate.y, z: targetTemplate.z || 0 }, styleGuide, undefined)
    return
  }
  for (const template of styleGuide.templates) {
    yield* iterateAllContent(target, template, template, { x: template.x, y: template.y, z: template.z || 0 }, styleGuide, undefined)
  }
}

export function isInRegion(position: Position | Position[], region: Region & Rotate): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  position = rotatePosition(position, region)
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

function rotatePosition(position: Position, region: Region & Rotate) {
  if (!region.rotate) {
    return position
  }
  const rotate = -region.rotate * Math.PI / 180
  const centerX = region.x + region.width / 2
  const centerY = region.y + region.height / 2
  const offsetX = position.x - centerX
  const offsetY = position.y - centerY
  const sin = Math.sin(rotate)
  const cos = Math.cos(rotate)
  return {
    x: cos * offsetX - sin * offsetY + centerX,
    y: sin * offsetX + cos * offsetY + centerY,
  }
}

function* iterateAllTemplate(
  target: Template | undefined,
  template: Template,
  position: Required<Position>,
  styleGuide: StyleGuide,
  props: unknown,
  parent?: { content: TemplateReferenceContent, template: Template, index: number },
): Generator<Required<Region> & { parent?: { content: TemplateReferenceContent, template: Template, index: number }, template: Template }, void, unknown> {
  if (template === target || target === undefined) {
    const width = evaluateSizeExpression('width', template, { props })
    const height = evaluateSizeExpression('height', template, { props })
    yield {
      x: position.x,
      y: position.y,
      z: position.z,
      width,
      height,
      parent,
      template,
    }
  }
  if (target && template !== target) {
    for (let i = 0; i < template.contents.length; i++) {
      const content = template.contents[i]
      if (content.kind === 'reference') {
        const reference = styleGuide.templates.find((t) => t.id === content.id)
        if (reference) {
          const x = getPosition(props, 'x', content, template, styleGuide.templates)
          const y = getPosition(props, 'y', content, template, styleGuide.templates)
          const z = getPosition(props, 'z', content, template, styleGuide.templates)
          const targetProps = evaluate(content.props, { props })
          yield* iterateAllTemplate(
            target,
            reference,
            {
              x: x + position.x,
              y: y + position.y,
              z: z + position.z,
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
  parent: Template,
  template: Template,
  position: Required<Position>,
  styleGuide: StyleGuide,
  props: unknown,
): Generator<Required<Region> & Rotate & { index: number, contents: TemplateContent[], content: TemplateContent, parent: Template, template: Template }, void, unknown> {
  for (let i = 0; i < parent.contents.length; i++) {
    const content = parent.contents[i]
    if (content === target || target === undefined) {
      const x = getPosition(props, 'x', content, parent, styleGuide.templates)
      const y = getPosition(props, 'y', content, parent, styleGuide.templates)
      const z = getPosition(props, 'z', content, parent, styleGuide.templates)
      const targetProps = content.kind === 'reference' ? evaluate(content.props, { props }) : undefined
      const size = getContentSize(content, styleGuide.templates)
      const width = targetProps ? evaluateSizeExpression('width', size, { props: targetProps }) : size.width
      const height = targetProps ? evaluateSizeExpression('height', size, { props: targetProps }) : size.height
      const rotate = content.kind !== 'reference' && content.kind !== 'snapshot' ? evaluateRotateExpression(content, { props }) : undefined
      yield {
        x: position.x + x,
        y: position.y + y,
        z: position.z + z,
        rotate: rotate || undefined,
        width,
        height,
        index: i,
        contents: parent.contents,
        content,
        parent,
        template,
      }
    }
    if (content.kind === 'snapshot') {
      yield* iterateAllContent(
        target,
        content.snapshot,
        template,
        {
          x: position.x + content.x,
          y: position.y + content.y,
          z: position.z + (content.z || 0),
        },
        styleGuide,
        undefined
      )
    }
  }
}

export function getPosition(props: unknown, type: 'x' | 'y' | 'z', content: TemplateContent, template: Template | undefined, templates: Template[]) {
  if (type !== 'z' && template && template.display === 'flex') {
    return getFlexPosition(content, type, template, templates)
  }
  return evaluatePositionExpression(type, content, { props })
}

export function* iterateAllNameRegions(target: Template | undefined, styleGuide: StyleGuide) {
  for (const template of styleGuide.templates) {
    if ((target === undefined || target === template) && template.name) {
      yield {
        x: template.x,
        y: template.y - nameSize,
        z: template.z || 0,
        width: nameSize * template.name.length,
        height: nameSize,
        template,
        parent: undefined as {
          content: TemplateReferenceContent;
          template: Template;
          index: number;
        } | undefined,
      }
    }
  }
}

export const nameSize = 25

export function formatPixel(n: number) {
  return Math.round(n * 100) / 100
}

export function formatRadian(n: number) {
  return Math.round(n * 10000) / 10000
}

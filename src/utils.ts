import { StyleGuide, Position, TemplateContent, Template, TemplateReferenceContent, Region, Rotate, StyleGuideVariable } from './model'
import { getContentSize, getFlexPosition } from './engine/layout-engine'
import { evaluateSizeExpression, evaluate, evaluatePositionExpression, evaluateRotateExpression } from './engine/expression'

export function* iterateAllTemplateRegions(
  target: Template | undefined,
  styleGuide: StyleGuide,
) {
  for (const template of styleGuide.templates) {
    yield* iterateAllTemplate(target, template, { x: template.x, y: template.y, z: template.z || 0 }, styleGuide, 0, undefined)
  }
}

export type TemplateRegion = Required<Region> & Rotate & {
  parent?: TemplateParent
  template: Template
}
export type ContentRegion = Required<Region> & Rotate & {
  index: number
  contents: TemplateContent[]
  content: TemplateContent
  parent: Template
  template: Template
  rotates: Array<Required<Rotate> & Position>
}

interface TemplateParent {
  content: TemplateReferenceContent
  template: Template
  index: number
}

export function* iterateAllContentRegions(
  target: TemplateContent | undefined,
  styleGuide: StyleGuide,
  targetTemplate?: Template,
) {
  if (targetTemplate) {
    yield* iterateAllContent(target, targetTemplate, targetTemplate, { x: targetTemplate.x, y: targetTemplate.y, z: targetTemplate.z || 0 }, styleGuide, [], undefined)
    return
  }
  for (const template of styleGuide.templates) {
    yield* iterateAllContent(target, template, template, { x: template.x, y: template.y, z: template.z || 0 }, styleGuide, [], undefined)
  }
}

export function isInRegion(position: Position | Position[], region: Region & Rotate): boolean {
  if (Array.isArray(position)) {
    return position.every((p) => isInRegion(p, region))
  }
  position = rotatePosition(position, region)
  return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height
}

export function rotatePosition(position: Position, region: Region & Rotate) {
  if (!region.rotate) {
    return position
  }
  const centerX = region.x + region.width / 2
  const centerY = region.y + region.height / 2
  return rotatePositionByCenter(position, { x: centerX, y: centerY }, region.rotate)
}

export function rotatePositionByCenter(position: Position, center: Position, rotate: number) {
  if (!rotate) {
    return position
  }
  rotate = -rotate * Math.PI / 180
  const offsetX = position.x - center.x
  const offsetY = position.y - center.y
  const sin = Math.sin(rotate)
  const cos = Math.cos(rotate)
  return {
    x: cos * offsetX - sin * offsetY + center.x,
    y: sin * offsetX + cos * offsetY + center.y,
  }
}

function* iterateAllTemplate(
  target: Template | undefined,
  template: Template,
  position: Required<Position>,
  styleGuide: StyleGuide,
  rotate: number,
  props: unknown,
  parent?: { content: TemplateReferenceContent, template: Template, index: number },
): Generator<TemplateRegion, void, unknown> {
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
      rotate,
    }
  }
  if (target && template !== target) {
    for (let i = 0; i < template.contents.length; i++) {
      const content = template.contents[i]
      if (content.kind === 'reference') {
        const reference = styleGuide.templates.find((t) => t.id === content.id)
        if (reference) {
          const x = getPosition(props, 'x', content, template, styleGuide)
          const y = getPosition(props, 'y', content, template, styleGuide)
          const z = getPosition(props, 'z', content, template, styleGuide)
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
            content.rotate || 0,
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
  rotates: Array<Required<Rotate> & Position>,
  props: unknown,
): Generator<ContentRegion, void, unknown> {
  for (let i = 0; i < parent.contents.length; i++) {
    const content = parent.contents[i]
    if (content === target || target === undefined) {
      const x = getPosition(props, 'x', content, parent, styleGuide)
      const y = getPosition(props, 'y', content, parent, styleGuide)
      const z = getPosition(props, 'z', content, parent, styleGuide)
      const targetProps = content.kind === 'reference' ? evaluate(content.props, { props }) : undefined
      const size = getContentSize(content, styleGuide)
      const width = targetProps ? evaluateSizeExpression('width', size, { props: targetProps }) : size.width
      const height = targetProps ? evaluateSizeExpression('height', size, { props: targetProps }) : size.height
      let rotate = evaluateRotateExpression(content, { props })
      let newX = position.x + x
      let newY = position.y + y
      if (rotates.length > 0) {
        rotate += rotates.reduce((p, c) => p + c.rotate, 0)
        let center: Position = {
          x: newX + width / 2,
          y: newY + height / 2
        }
        for (let i = rotates.length - 1; i >= 0; i--) {
          const r = rotates[i]
          center = rotatePositionByCenter(center, r, -r.rotate)
        }
        newX = center.x - width / 2
        newY = center.y - height / 2
      }
      yield {
        x: formatPixel(newX),
        y: formatPixel(newY),
        z: position.z + z,
        rotate: rotate || undefined,
        width,
        height,
        index: i,
        contents: parent.contents,
        content,
        parent,
        template,
        rotates,
      }
    }
    if (content.kind === 'snapshot') {
      const newRotates: Array<Required<Rotate> & Position> = [
        ...rotates,
        {
          rotate: content.rotate || 0,
          x: position.x + content.x + content.snapshot.width / 2,
          y: position.y + content.y + content.snapshot.height / 2,
        }
      ]
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
        newRotates,
        undefined
      )
    }
  }
}

export function getPosition(props: unknown, type: 'x' | 'y' | 'z', content: TemplateContent, template: Template | undefined, styleGuide: StyleGuide) {
  if (type !== 'z' && template && template.display === 'flex') {
    return getFlexPosition(content, type, template, styleGuide)
  }
  return evaluatePositionExpression(type, content, { props })
}

export function* iterateAllNameRegions(target: Template | undefined, styleGuide: StyleGuide, scale: number): Generator<TemplateRegion, void, unknown> {
  const realNameSize = nameSize / scale
  for (const template of styleGuide.templates) {
    if ((target === undefined || target === template) && template.name) {
      yield {
        x: template.x,
        y: template.y - realNameSize,
        z: template.z || 0,
        width: realNameSize * template.name.length,
        height: realNameSize,
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

export const nameSize = 14

export function formatPixel(n: number) {
  return Math.round(n * 100) / 100
}

export function formatRadian(n: number) {
  return Math.round(n * 10000) / 10000
}

export function getVariableObject(variables: StyleGuideVariable[] | undefined) {
  const result: { [name: string]: unknown } = {}
  if (variables) {
    for (const variable of variables) {
      result[variable.name] = variable.value
    }
  }
  return result
}

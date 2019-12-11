import { Template, TemplateContent, Size, SizeExpression, StyleGuide } from '../model'

export function layoutFlex(template: Template, styleGuide: StyleGuide) {
  if (template.display === 'flex') {
    const flexDirection = template.flexDirection || 'row'
    const justifyContent = template.justifyContent || 'start'
    const alignItems = template.alignItems || 'start'
    const mainAxisPositionType = flexDirection === 'row' ? 'x' : 'y'
    const mainAxisSizeType = flexDirection === 'row' ? 'width' : 'height'
    const crossAxisPositionType = flexDirection === 'row' ? 'y' : 'x'
    const totalContentSize = template.contents.reduce((p, c) => p + getContentSize(c, styleGuide)[mainAxisSizeType], 0)

    for (let i = 0; i < template.contents.length; i++) {
      const content = template.contents[i]
      content[mainAxisPositionType] = getMainAxisValue(justifyContent, template, mainAxisSizeType, totalContentSize, i, styleGuide)
      content[crossAxisPositionType] = getCrossAxisValue(alignItems, template, flexDirection, getContentSize(content, styleGuide))
    }
  }
  for (const content of template.contents) {
    if (content.kind === 'reference') {
      const reference = styleGuide.templates.find((t) => t.id === content.id)
      if (reference) {
        layoutFlex(reference, styleGuide)
      }
    } else if (content.kind === 'snapshot') {
      layoutFlex(content.snapshot, styleGuide)
    }
  }
}

export function getFlexPosition(target: TemplateContent, kind: 'x' | 'y', template: Template, styleGuide: StyleGuide) {
  const flexDirection = template.flexDirection || 'row'
  const mainAxisPositionType = flexDirection === 'row' ? 'x' : 'y'
  if (kind === mainAxisPositionType) {
    const mainAxisSizeType = flexDirection === 'row' ? 'width' : 'height'
    return getMainAxisValue(
      template.justifyContent || 'start',
      template,
      mainAxisSizeType,
      template.contents.reduce((p, c) => p + getContentSize(c, styleGuide)[mainAxisSizeType], 0),
      template.contents.findIndex((c) => c === target),
      styleGuide
    )
  }
  return getCrossAxisValue(
    template.alignItems || 'start',
    template,
    flexDirection,
    getContentSize(target, styleGuide)
  )
}

function getMainAxisValue(
  justifyContent: 'start' | 'end' | 'center' | 'between',
  template: Template,
  mainAxisSizeType: 'width' | 'height',
  totalContentSize: number,
  i: number,
  styleGuide: StyleGuide,
) {
  let mainAxisValue: number
  if (justifyContent === 'start') {
    mainAxisValue = 0
  } else if (justifyContent === 'end') {
    mainAxisValue = template[mainAxisSizeType] - totalContentSize
  } else if (justifyContent === 'center') {
    mainAxisValue = (template[mainAxisSizeType] - totalContentSize) / 2
  } else {
    if (template.contents.length > 1) {
      mainAxisValue = i * Math.max(0, (template[mainAxisSizeType] - totalContentSize) / (template.contents.length - 1))
    } else {
      mainAxisValue = 0
    }
  }
  for (let j = 0; j < i; j++) {
    mainAxisValue += getContentSize(template.contents[j], styleGuide)[mainAxisSizeType]
  }
  return mainAxisValue
}

function getCrossAxisValue(
  alignItems: 'start' | 'end' | 'center',
  template: Template,
  flexDirection: 'row' | 'column',
  contentSize: Size,
) {
  if (alignItems === 'start') {
    return 0
  }
  const crossAxisSizeType = flexDirection === 'row' ? 'height' : 'width'
  if (alignItems === 'end') {
    return template[crossAxisSizeType] - contentSize[crossAxisSizeType]
  }
  return (template[crossAxisSizeType] - contentSize[crossAxisSizeType]) / 2
}

export function getContentSize(content: TemplateContent, styleGuide: StyleGuide): Size & SizeExpression {
  if (content.kind === 'reference') {
    const reference = styleGuide.templates.find((t) => t.id === content.id)
    if (reference) {
      return reference
    }
    return {
      width: 0,
      height: 0,
    }
  }
  if (content.kind === 'snapshot') {
    return content.snapshot
  }
  return content
}

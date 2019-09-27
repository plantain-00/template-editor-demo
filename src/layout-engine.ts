import { Template, TemplateContent, Size } from './model'

export function layoutFlex(template: Template, templates: Template[]) {
  if (template.display === 'flex') {
    const flexDirection = template.flexDirection || 'row'
    const justifyContent = template.justifyContent || 'start'
    const alignItems = template.alignItems || 'start'

    for (let i = 0; i < template.contents.length; i++) {
      const content = template.contents[i]
      const contentSize = getContentSize(content, templates)

      const mainAxisPositionType = flexDirection === 'row' ? 'x' : 'y'
      const mainAxisSizeType = flexDirection === 'row' ? 'width' : 'height'
      const crossAxisPositionType = flexDirection === 'row' ? 'y' : 'x'
      const crossAxisSizeType = flexDirection === 'row' ? 'height' : 'width'

      const totalContentSize = template.contents.reduce((p, c) => p + getContentSize(c, templates)[mainAxisSizeType], 0)

      if (justifyContent === 'start') {
        content[mainAxisPositionType] = 0
      } else if (justifyContent === 'end') {
        content[mainAxisPositionType] = template[mainAxisSizeType] - totalContentSize
      } else if (justifyContent === 'center') {
        content[mainAxisPositionType] = (template[mainAxisSizeType] - totalContentSize) / 2
      } else {
        content[mainAxisPositionType] = i * Math.max(0, (template[mainAxisSizeType] - totalContentSize) / (template.contents.length - 1))
      }
      for (let j = 0; j < i; j++) {
        content[mainAxisPositionType] += getContentSize(template.contents[j], templates)[mainAxisSizeType]
      }

      if (alignItems === 'start') {
        content[crossAxisPositionType] = 0
      } else if (alignItems === 'end') {
        content[crossAxisPositionType] = template[crossAxisSizeType] - contentSize[crossAxisSizeType]
      } else {
        content[crossAxisPositionType] = (template[crossAxisSizeType] - contentSize[crossAxisSizeType]) / 2
      }
    }
  }
  for (const content of template.contents) {
    if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        layoutFlex(reference, templates)
      }
    } else if (content.kind === 'snapshot') {
      layoutFlex(content.snapshot, templates)
    }
  }
}

function getContentSize(content: TemplateContent, templates: Template[]): Size {
  if (content.kind === 'reference') {
    const reference = templates.find((t) => t.id === content.id)
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

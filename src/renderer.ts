import { Template, CanvasSelectionData } from "./model";

export function renderTemplate(template: Template, templates: Template[], isRoot = true, selection?: CanvasSelectionData) {
  const result: string[] = []
  for (let i = 0; i < template.contents.length; i++) {
    const content = template.contents[i]
    const selected = selection && selection.id === template.id && selection.kind === 'content' && selection.index === i
    if (content.kind === 'text') {
      result.push(`<div
      style="
        color: ${content.color};
        font-size: ${content.fontSize}px;
        font-family: ${content.fontFamily};
        width: ${content.width}px;
        height: ${content.height}px;
        position: absolute;
        left: ${content.x}px;
        top: ${content.y}px;
        border: ${selected ? 1 : 0}px solid green;
      ">${content.characters.map((c) => c.text).join('')}</div>`)
    } else if (content.kind === 'image') {
      result.push(`<img
        src="${content.url}"
        style="
          width: ${content.width}px;
          height: ${content.height}px;
          position: absolute;
          left: ${content.x}px;
          top: ${content.y}px;
          border: ${selected ? 1 : 0}px solid green;
        "
      />`)
    } else if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        const referenceResult = renderTemplate(reference, templates, false, selection)
        result.push(`<div
          style="
            left: ${content.x}px;
            top: ${content.y}px;
            position: absolute;
          "
        >${referenceResult}</div>`)
      }
    }
  }
  const backgroundColor = isRoot ? `background-color: white;` : ''
  return `<div
    style="
      width: ${template.width}px;
      height: ${template.height}px;
      position: absolute;
      user-select: none;
      border: ${selection && selection.id === template.id && selection.kind === 'template' ? 1 : 0}px solid green;
      ${backgroundColor}
    "
  >${result.join('')}</div>`
}
import { Template } from "./model";

export function renderTemplate(template: Template, templates: Template[], isRoot = true) {
  const result: string[] = []
  for (const content of template.contents) {
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
      ">${content.text}</div>`)
    } else if (content.kind === 'image') {
      result.push(`<img
        src="${content.url}"
        style="
          width: ${content.width}px;
          height: ${content.height}px;
          position: absolute;
          left: ${content.x}px;
          top: ${content.y}px;
        "
      />`)
    } else if (content.kind === 'reference') {
      const reference = templates.find((t) => t.id === content.id)
      if (reference) {
        const referenceResult = renderTemplate(reference, templates, false)
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
      ${backgroundColor}
    "
  >${result.join('')}</div>`
}

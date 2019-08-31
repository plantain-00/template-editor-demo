import { Template } from "./model";

export function renderTemplate(template: Template) {
  const result: string[] = []
  for (const content of template.contents) {
    if (content.kind === 'text') {
      result.push(`<div
      style="color: ${content.color};
        font-size: ${content.fontSize}px;
        font-family: ${content.fontFamily};
        width: ${content.width}px;
        height: ${content.height}px;
        position: absolute;
        left: ${content.x}px;
        top: ${content.y}px;
      ">${content.text}</div>`)
    } else if (content.kind === 'image') {
      result.push(`<image
        src="${content.url}"
        style="width: ${content.width}px;
          height: ${content.height}px;
          position: absolute;
          left: ${content.x}px;
          top: ${content.y}px"
      />`)
    }
  }
  return `<div style="width: ${template.width}px; height: ${template.height}px; position: absolute">${result.join('')}</div>`
}

import { TemplateTextContent } from './model'

export function layoutText(content: TemplateTextContent) {
  content.characters = Array.from(content.text).map((t) => ({ text: t }))
}

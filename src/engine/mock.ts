export function getCharacters(text: string) {
  return Array.from(text).map((t) => ({ text: t }))
}

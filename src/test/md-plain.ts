/** Test helper: plain text of a source markdown page, independent of the converter. */
export function markdownPlainText(md: string): string {
  let s = md.replace(/^---\n[\s\S]*?\n---\n/, '')
  s = s.replace(/<!--[\s\S]*?-->/g, ' ')
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  s = s.replace(/^\s*\|?\s*-{3,}[\s|:-]*$/gm, ' ') // table separator rows
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  s = s.replace(/<br\s*\/?>/g, ' ')
  s = s.replace(/^\s*[-*+]\s+/gm, '')
  s = s.replace(/^\s*\d+\.\s+/gm, '') // list numbers (headings still start with '#' here)
  s = s.replace(/^#{1,6}\s+/gm, '')
  s = s.replace(/\\([.|*_#-])/g, '$1')
  s = s.replace(/\|/g, ' ')
  s = s.replace(/\*/g, '')
  return s
}

export const squash = (s: string) => s.replace(/\s+/g, '')
export const collapse = (s: string) => s.replace(/\s+/g, ' ').trim()

import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('fonts', () => {
  const main = readFileSync('src/main.tsx', 'utf8')

  it('loads Playfair Display variable font', () => {
    expect(main).toContain("@fontsource-variable/playfair-display")
  })

  it('loads Be Vietnam Pro 400 and 600 with the vietnamese subset', () => {
    expect(main).toContain("@fontsource/be-vietnam-pro/vietnamese-400.css")
    expect(main).toContain("@fontsource/be-vietnam-pro/vietnamese-600.css")
  })

  it('Playfair Display ships a vietnamese subset', () => {
    const files = readdirSync('node_modules/@fontsource-variable/playfair-display/files')
    expect(files.some((f) => f.includes('vietnamese'))).toBe(true)
  })
})

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('netlify deploy config', () => {
  it('rewrites every path to index.html so deep links survive a refresh', () => {
    const redirects = readFileSync('public/_redirects', 'utf8')
    expect(redirects).toMatch(/^\/\*\s+\/index\.html\s+200$/m)
  })

  it('builds with npm run build and publishes dist', () => {
    const toml = readFileSync('netlify.toml', 'utf8')
    expect(toml).toContain('command = "npm run build"')
    expect(toml).toContain('publish = "dist"')
  })
})

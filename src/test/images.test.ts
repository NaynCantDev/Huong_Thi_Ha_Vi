import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, parse } from 'node:path'
import { describe, expect, it } from 'vitest'
import { imageSize, imageUrl } from '../content/images'

const SKIP = new Set(['gioi-thieu/03-site-logo', 'bai-4/01-drive-thumbnail-bao-cao'])

function sourceKeys(): string[] {
  const keys: string[] = []
  for (const folder of readdirSync('content/assets')) {
    for (const file of readdirSync(join('content/assets', folder))) {
      const key = `${folder}/${parse(file).name}`
      if (!SKIP.has(key)) keys.push(key)
    }
  }
  return keys
}

describe('optimized images', () => {
  const manifest = JSON.parse(readFileSync('src/assets/img/manifest.json', 'utf8')) as Record<string, { width: number; height: number }>

  it('has a webp for every source image', () => {
    for (const key of sourceKeys()) {
      expect(existsSync(`src/assets/img/${key}.webp`), key).toBe(true)
    }
  })

  it('records width and height for every image', () => {
    for (const key of sourceKeys()) {
      expect(manifest[key]?.width, key).toBeGreaterThan(0)
      expect(manifest[key]?.height, key).toBeGreaterThan(0)
    }
  })

  it('resolves a key to a url and its size', () => {
    expect(typeof imageUrl('bai-1/01-buoc-01')).toBe('string')
    expect(imageSize('bai-1/01-buoc-01').width).toBeGreaterThan(0)
  })

  it('throws for an unknown key', () => {
    expect(() => imageUrl('nope')).toThrow('Missing image: nope')
  })
})

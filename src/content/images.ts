import manifest from '../assets/img/manifest.json'

const urls = import.meta.glob<string>('../assets/img/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byKey = new Map<string, string>()
for (const [path, url] of Object.entries(urls)) {
  const key = path.replace('../assets/img/', '').replace(/\.webp$/, '')
  byKey.set(key, url)
}

export type ImageSize = { width: number; height: number }

/** URL of an optimized image. Key = "<folder>/<basename>", e.g. "bai-1/01-buoc-01". */
export function imageUrl(key: string): string {
  const url = byKey.get(key)
  if (!url) throw new Error(`Missing image: ${key}`)
  return url
}

export function imageSize(key: string): ImageSize {
  const size = (manifest as Record<string, ImageSize>)[key]
  if (!size) throw new Error(`Missing image: ${key}`)
  return size
}

// Convert content/assets/** to WebP in src/assets/img/** and write manifest.json.
// Run: npm run images
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'content/assets'
const OUT = 'src/assets/img'
const SKIP = new Set(['gioi-thieu/03-site-logo', 'bai-4/01-drive-thumbnail-bao-cao'])
const MAX_WIDTH = { 'bai-5/02-hinh-5-2-infographic': 1600 }

const manifest = {}
for (const folder of readdirSync(SRC).sort()) {
  mkdirSync(join(OUT, folder), { recursive: true })
  for (const file of readdirSync(join(SRC, folder)).sort()) {
    const key = `${folder}/${parse(file).name}`
    if (SKIP.has(key)) continue
    const info = await sharp(join(SRC, folder, file))
      .rotate()
      .resize({ width: MAX_WIDTH[key] ?? 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, `${key}.webp`))
    manifest[key] = { width: info.width, height: info.height }
    console.log(`${key}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
  }
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

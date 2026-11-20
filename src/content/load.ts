import type { Block, Inline, PageSlug } from './types'
import gioiThieu from './generated/gioi-thieu.json'
import duAn from './generated/du-an.json'
import bai1 from './generated/bai-1.json'
import bai2 from './generated/bai-2.json'
import bai3 from './generated/bai-3.json'
import bai4 from './generated/bai-4.json'
import bai5 from './generated/bai-5.json'
import bai6 from './generated/bai-6.json'
import tongKet from './generated/tong-ket.json'

const PAGES = {
  'gioi-thieu': gioiThieu,
  'du-an': duAn,
  'bai-1': bai1,
  'bai-2': bai2,
  'bai-3': bai3,
  'bai-4': bai4,
  'bai-5': bai5,
  'bai-6': bai6,
  'tong-ket': tongKet,
} as unknown as Record<PageSlug, Block[]>

export function getBlocks(slug: PageSlug): Block[] {
  return PAGES[slug]
}

export function inlineText(list: Inline[]): string {
  return list.map((n) => (n.t === 'text' ? n.v : n.t === 'br' ? '\n' : inlineText(n.c))).join('')
}

/** Plain text of blocks, one block per line. */
export function blockText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'heading':
        case 'p':
          return inlineText(b.c)
        case 'list':
          return b.items.map((item) => blockText(item)).join('\n')
        case 'table':
          return [b.head, ...b.rows].map((row) => row.map(inlineText).join('\t')).join('\n')
        case 'image':
          return ''
      }
    })
    .join('\n')
}

export type Section = { heading: Extract<Block, { type: 'heading' }> | null; blocks: Block[] }

/** Split blocks into sections starting at each heading of exactly `level`. */
export function splitByHeading(blocks: Block[], level: number): Section[] {
  const out: Section[] = [{ heading: null, blocks: [] }]
  for (const b of blocks) {
    if (b.type === 'heading' && b.level === level) out.push({ heading: b, blocks: [] })
    else out[out.length - 1].blocks.push(b)
  }
  return out.filter((s, i) => i > 0 || s.blocks.length > 0)
}

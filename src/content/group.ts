import { inlineText } from './load'
import type { Block } from './types'

export type ImageBlock = Extract<Block, { type: 'image' }>
export type Step = { text: Block[]; images: ImageBlock[] }

/** Group blocks into steps: the text before one or more consecutive images, plus those images. */
export function groupByImages(blocks: Block[]): { steps: Step[]; tail: Block[] } {
  const steps: Step[] = []
  let text: Block[] = []
  let images: ImageBlock[] = []
  for (const b of blocks) {
    if (b.type === 'image') {
      images.push(b)
      continue
    }
    if (images.length) {
      steps.push({ text, images })
      text = []
      images = []
    }
    text.push(b)
  }
  if (images.length) {
    steps.push({ text, images })
    text = []
  }
  return { steps, tail: text }
}

export function blockPlain(b: Block): string {
  return b.type === 'p' || b.type === 'heading' ? inlineText(b.c) : ''
}

/** Index of the first block whose plain text starts with `prefix` (after trimming). */
export function findBlock(blocks: Block[], prefix: string, from = 0): number {
  for (let i = from; i < blocks.length; i++) {
    if (blockPlain(blocks[i]).trim().startsWith(prefix)) return i
  }
  throw new Error(`Block not found: ${prefix}`)
}

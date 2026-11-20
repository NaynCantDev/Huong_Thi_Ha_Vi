// Convert content/pages/*.md into verbatim JSON blocks in src/content/generated/.
// Run: npm run content
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { marked, type Token, type Tokens } from 'marked'
import type { Align, Block, Inline } from '../src/content/types.ts'

const SLUGS = ['gioi-thieu', 'du-an', 'bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'tong-ket']
const ALIGN_RE = /<!--\s*align:\s*center\s*-->/

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function imageKey(href: string): string {
  const m = href.match(/assets\/([^/]+)\/([^/]+)\.[a-z0-9]+$/i)
  if (!m) throw new Error(`Unexpected image path: ${href}`)
  return `${m[1]}/${m[2]}`
}

function inlines(tokens: Token[] | undefined): Inline[] {
  const out: Inline[] = []
  for (const tok of tokens ?? []) {
    switch (tok.type) {
      case 'text':
      case 'escape':
      case 'codespan': {
        const t = tok as Tokens.Text
        if (t.tokens && t.tokens.length) out.push(...inlines(t.tokens))
        else out.push({ t: 'text', v: t.text })
        break
      }
      case 'strong':
      case 'em':
        out.push({ t: tok.type, c: inlines((tok as Tokens.Strong).tokens) })
        break
      case 'link':
        out.push({ t: 'link', href: (tok as Tokens.Link).href, c: inlines((tok as Tokens.Link).tokens) })
        break
      case 'br':
        out.push({ t: 'br' })
        break
      case 'html': {
        const raw = (tok as Tokens.HTML).text
        if (/^<br\s*\/?>$/i.test(raw.trim())) out.push({ t: 'br' })
        // comments are dropped
        break
      }
      case 'image':
        throw new Error('Inline image inside text is not supported')
      default:
        throw new Error(`Unsupported inline token: ${tok.type}`)
    }
  }
  return mergeText(trimEdges(out))
}

function mergeText(list: Inline[]): Inline[] {
  const out: Inline[] = []
  for (const node of list) {
    const prev = out[out.length - 1]
    if (node.t === 'text' && prev?.t === 'text') prev.v += node.v
    else out.push(node)
  }
  return out.filter((n) => !(n.t === 'text' && n.v === ''))
}

/** Remove whitespace that only exists because a trailing comment was stripped. */
function trimEdges(list: Inline[]): Inline[] {
  const last = list[list.length - 1]
  if (last?.t === 'text') last.v = last.v.replace(/\s+$/, '')
  return list
}

function hasAlign(tok: Token): boolean {
  return ALIGN_RE.test(tok.raw)
}

class Converter {
  private ids = new Map<string, number>()

  uniqueId(text: string): string {
    const base = slugify(text) || 'muc'
    const n = (this.ids.get(base) ?? 0) + 1
    this.ids.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }

  blocks(tokens: Token[]): Block[] {
    const out: Block[] = []
    let pendingAlign: Align | undefined
    for (const tok of tokens) {
      if (tok.type === 'space' || tok.type === 'hr') continue
      if (tok.type === 'html') {
        if (hasAlign(tok)) pendingAlign = 'center'
        continue
      }
      const made = this.block(tok)
      const align: Align | undefined = pendingAlign ?? (hasAlign(tok) ? 'center' : undefined)
      pendingAlign = undefined
      for (const b of made) {
        if (align && (b.type === 'p' || b.type === 'heading' || b.type === 'image')) b.align = align
        out.push(b)
      }
    }
    return out
  }

  block(tok: Token): Block[] {
    switch (tok.type) {
      case 'heading': {
        const h = tok as Tokens.Heading
        const c = inlines(h.tokens)
        return [{ type: 'heading', level: Math.min(h.depth, 4) as 1 | 2 | 3 | 4, id: this.uniqueId(plain(c)), c }]
      }
      case 'paragraph':
      case 'text': {
        const p = tok as Tokens.Paragraph
        return this.paragraph(p.tokens ?? [])
      }
      case 'list': {
        const l = tok as Tokens.List
        const items = l.items.map((item) => this.blocks(item.tokens))
        const block: Block = { type: 'list', ordered: l.ordered, items }
        if (l.ordered && typeof l.start === 'number' && l.start !== 1) block.start = l.start
        return [block]
      }
      case 'table': {
        const t = tok as Tokens.Table
        return [
          {
            type: 'table',
            head: t.header.map((cell) => inlines(cell.tokens)),
            rows: t.rows.map((row) => row.map((cell) => inlines(cell.tokens))),
          },
        ]
      }
      default:
        throw new Error(`Unsupported block token: ${tok.type}`)
    }
  }

  /** A paragraph may hold images; split them out into their own blocks. */
  paragraph(tokens: Token[]): Block[] {
    const out: Block[] = []
    let run: Token[] = []
    const flush = () => {
      const c = inlines(run)
      if (c.some((n) => n.t !== 'br' && !(n.t === 'text' && n.v.trim() === ''))) out.push({ type: 'p', c })
      run = []
    }
    for (const tok of tokens) {
      if (tok.type === 'image') {
        flush()
        const img = tok as Tokens.Image
        out.push({ type: 'image', key: imageKey(img.href), alt: img.text })
      } else run.push(tok)
    }
    flush()
    return out
  }
}

function plain(list: Inline[]): string {
  return list.map((n) => (n.t === 'text' ? n.v : n.t === 'br' ? ' ' : plain(n.c))).join('')
}

export function convertMarkdown(md: string): Block[] {
  const body = md.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, '')
  return new Converter().blocks(marked.lexer(body))
}

if (import.meta.main) {
  mkdirSync('src/content/generated', { recursive: true })
  for (const slug of SLUGS) {
    const blocks = convertMarkdown(readFileSync(`content/pages/${slug}.md`, 'utf8'))
    writeFileSync(`src/content/generated/${slug}.json`, JSON.stringify(blocks, null, 1) + '\n')
    console.log(`${slug}: ${blocks.length} blocks`)
  }
}

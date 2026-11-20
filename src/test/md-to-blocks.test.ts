import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { convertMarkdown } from '../../scripts/md-to-blocks'
import { blockText } from '../content/load'
import { markdownPlainText, squash } from './md-plain'

const SLUGS = ['gioi-thieu', 'du-an', 'bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'tong-ket']

describe('convertMarkdown', () => {
  it('keeps the space before a colon inside bold text', () => {
    expect(convertMarkdown('**Mục tiêu học tập :**')).toEqual([
      { type: 'p', c: [{ t: 'strong', c: [{ t: 'text', v: 'Mục tiêu học tập :' }] }] },
    ])
  })

  it('applies a standalone align comment to the next block', () => {
    expect(convertMarkdown('<!-- align: center -->\n**BÁO CÁO**')).toEqual([
      { type: 'p', align: 'center', c: [{ t: 'strong', c: [{ t: 'text', v: 'BÁO CÁO' }] }] },
    ])
  })

  it('applies a trailing align comment to its own heading', () => {
    const [h] = convertMarkdown('## CHƯƠNG 1: MÁY TÍNH <!-- align: center -->')
    expect(h).toMatchObject({ type: 'heading', level: 2, align: 'center', id: 'chuong-1-may-tinh' })
  })

  it('turns an image into an image block keyed by folder/basename', () => {
    expect(convertMarkdown('![](../assets/bai-1/01-buoc-01.png)')).toEqual([
      { type: 'image', key: 'bai-1/01-buoc-01', alt: '' },
    ])
  })

  it('keeps an escaped number as text, not a list', () => {
    expect(convertMarkdown('1\\. Mở File Explorer')).toEqual([
      { type: 'p', c: [{ t: 'text', v: '1. Mở File Explorer' }] },
    ])
  })

  it('turns <br> in a table cell into a break', () => {
    const [table] = convertMarkdown('| a | b |\n|---|---|\n| x <br> y | z |')
    expect(table).toMatchObject({ type: 'table' })
    if (table.type !== 'table') throw new Error('not a table')
    expect(table.rows[0][0]).toContainEqual({ t: 'br' })
  })

  it('drops other comments', () => {
    expect(convertMarkdown('<!-- LAYOUT: two columns -->\n\nXin chào')).toEqual([
      { type: 'p', c: [{ t: 'text', v: 'Xin chào' }] },
    ])
  })

  it('gives repeated headings unique ids', () => {
    const blocks = convertMarkdown('### a. Prompt\n\n### a. Prompt')
    expect(blocks.map((b) => (b.type === 'heading' ? b.id : ''))).toEqual(['a-prompt', 'a-prompt-2'])
  })

  for (const slug of SLUGS) {
    it(`keeps every character of ${slug}.md`, () => {
      const md = readFileSync(`content/pages/${slug}.md`, 'utf8').replace(/\r\n/g, '\n')
      expect(squash(blockText(convertMarkdown(md)))).toBe(squash(markdownPlainText(md)))
    })
  }

  it('keeps original spacing such as "âm nhạc , Trường"', () => {
    const md = readFileSync('content/pages/gioi-thieu.md', 'utf8')
    expect(blockText(convertMarkdown(md))).toContain('âm nhạc , Trường')
  })
})

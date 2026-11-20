import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Blocks } from '../content/Blocks'
import { blockText, getBlocks } from '../content/load'
import type { PageSlug } from '../content/types'
import { squash } from './md-plain'

const SLUGS: PageSlug[] = ['gioi-thieu', 'du-an', 'bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'tong-ket']

describe('<Blocks>', () => {
  for (const slug of SLUGS) {
    it(`renders all text of ${slug}`, () => {
      const blocks = getBlocks(slug)
      const { container } = render(<Blocks blocks={blocks} />)
      expect(squash(container.textContent ?? '')).toBe(squash(blockText(blocks)))
    })
  }

  it('wraps tables in a horizontal scroll container', () => {
    const { container } = render(<Blocks blocks={getBlocks('bai-2')} />)
    const tables = container.querySelectorAll('table')
    expect(tables.length).toBe(2)
    for (const table of tables) expect(table.closest('[data-scroll-x]')).not.toBeNull()
  })

  it('renders headings one level down (page owns the h1) with their ids', () => {
    const { container } = render(<Blocks blocks={getBlocks('bai-6')} />)
    // source "## VI. KẾT LUẬN" → <h3>
    expect(container.querySelector('h3#vi-ket-luan')).not.toBeNull()
    expect(container.querySelector('h1')).toBeNull()
  })

  it('opens external links in a new tab safely', () => {
    const { container } = render(<Blocks blocks={getBlocks('bai-2')} />)
    const links = [...container.querySelectorAll('a[href^="http"]')]
    expect(links.length).toBeGreaterThanOrEqual(10)
    for (const a of links) {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })
})

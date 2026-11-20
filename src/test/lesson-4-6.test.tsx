import { render, screen, within } from '@testing-library/react'
import { existsSync } from 'node:fs'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { blockText } from '../content/load'
import { lessonBody, lessonLead } from '../data/lessons'
import { squash } from './md-plain'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

async function renderPage(name: 'Lesson4' | 'Lesson6') {
  const Page = (await import(`../pages/${name}.tsx`)).default
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
}

function expectVerbatim(container: HTMLElement, slug: 'bai-4' | 'bai-6') {
  const text = squash(container.textContent ?? '')
  for (const line of blockText([...lessonLead(slug), ...lessonBody(slug)]).split('\n').filter((l) => l.trim())) {
    expect(text).toContain(squash(line))
  }
}

describe('Bài 4', () => {
  it('keeps every line of the report', async () => {
    const { container } = await renderPage('Lesson4')
    expectVerbatim(container, 'bai-4')
  })

  it('offers the original Word file for download', async () => {
    await renderPage('Lesson4')
    const link = screen.getByRole('link', { name: /Tải báo cáo/ })
    expect(link).toHaveAttribute('href', '/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx')
    expect(link).toHaveAttribute('download')
    expect(existsSync('public/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx')).toBe(true)
  })

  it('shows the three meeting screenshots', async () => {
    await renderPage('Lesson4')
    const gallery = screen.getByRole('list', { name: 'Ảnh dẫn chứng cuộc họp' })
    expect(within(gallery).getAllByRole('button', { name: /Phóng to/ })).toHaveLength(3)
  })
})

describe('Bài 6', () => {
  it('keeps every line of the essay', async () => {
    const { container } = await renderPage('Lesson6')
    expectVerbatim(container, 'bai-6')
  })

  it('lists sections I to VI in the table of contents', async () => {
    await renderPage('Lesson6')
    const toc = screen.getByRole('navigation', { name: 'Mục lục' })
    const links = within(toc).getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links[0].getAttribute('href')).toMatch(/^#i-/)
    expect(links[5].getAttribute('href')).toBe('#vi-ket-luan')
  })
})

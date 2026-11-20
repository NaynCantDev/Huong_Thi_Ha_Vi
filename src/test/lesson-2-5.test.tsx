import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { blockText } from '../content/load'
import { lessonBody, lessonLead } from '../data/lessons'
import { squash } from './md-plain'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

async function renderPage(name: 'Lesson2' | 'Lesson5') {
  const mod = await import(`../pages/${name}.tsx`)
  const Page = mod.default
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
}

function expectVerbatim(container: HTMLElement, slug: 'bai-2' | 'bai-5') {
  const text = squash(container.textContent ?? '')
  for (const line of blockText([...lessonLead(slug), ...lessonBody(slug)]).split('\n').filter((l) => l.trim())) {
    expect(text).toContain(squash(line))
  }
}

describe('Bài 2', () => {
  it('keeps every line of the lesson', async () => {
    const { container } = await renderPage('Lesson2')
    expectVerbatim(container, 'bai-2')
  })

  it('has two tables of ten sources each', async () => {
    const { container } = await renderPage('Lesson2')
    const tables = container.querySelectorAll('table')
    expect(tables).toHaveLength(2)
    for (const t of tables) expect(t.querySelectorAll('tbody tr')).toHaveLength(10)
  })

  it('marks reliability ratings without changing their text', async () => {
    const { container } = await renderPage('Lesson2')
    const pills = [...container.querySelectorAll('[data-rating]')]
    expect(pills.length).toBe(10)
    for (const p of pills) expect(['Cao', 'Khá']).toContain(p.textContent?.replace(':', '').trim())
  })

  it('keeps wide tables inside horizontal scroll areas', async () => {
    const { container } = await renderPage('Lesson2')
    for (const t of container.querySelectorAll('table')) {
      expect(t.closest('[data-scroll-x]')).not.toBeNull()
    }
  })

  it('opens source links in a new tab', async () => {
    const { container } = await renderPage('Lesson2')
    const links = [...container.querySelectorAll('table a[href^="http"]')]
    expect(links.length).toBeGreaterThanOrEqual(10)
    for (const a of links) expect(a.getAttribute('rel')).toContain('noopener')
  })
})

describe('Bài 5', () => {
  it('keeps every line of the lesson', async () => {
    const { container } = await renderPage('Lesson5')
    expectVerbatim(container, 'bai-5')
  })

  it('shows both figures with their captions', async () => {
    const { container } = await renderPage('Lesson5')
    const captions = [...container.querySelectorAll('figcaption')].map((c) => c.textContent)
    expect(captions).toHaveLength(2)
    expect(captions[0]).toMatch(/^Hình 5\.1/)
    expect(captions[1]).toMatch(/^Hình 5\.2/)
  })

  it('lets the infographic be zoomed in the lightbox', async () => {
    const user = userEvent.setup()
    await renderPage('Lesson5')
    const triggers = screen.getAllByRole('button', { name: /Phóng to ảnh/ })
    await user.click(triggers[1])
    const dialog = await screen.findByRole('dialog')
    const zoomIn = within(dialog).getByRole('button', { name: 'Phóng to' })
    const img = within(dialog).getByRole('img')
    await user.click(zoomIn)
    expect(img.closest('[data-zoom]')?.getAttribute('data-zoom')).toBe('1.5')
    await user.click(within(dialog).getByRole('button', { name: 'Vừa màn hình' }))
    expect(img.closest('[data-zoom]')?.getAttribute('data-zoom')).toBe('1')
  })
})

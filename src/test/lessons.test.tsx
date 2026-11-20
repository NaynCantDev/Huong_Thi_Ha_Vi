import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { Figure } from '../components/Figure'
import { LESSONS, lessonBody, lessonLead } from '../data/lessons'
import { getBlocks } from '../content/load'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

describe('lesson data', () => {
  it('has six lessons numbered 1 to 6', () => {
    expect(LESSONS.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6])
    expect(LESSONS.map((l) => l.slug)).toEqual(['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6'])
  })

  it('marks the chapters of Bài 4 and Bài 6 as inferred', () => {
    expect(LESSONS.filter((l) => l.chapterInferred).map((l) => l.slug)).toEqual(['bai-4', 'bai-6'])
  })

  it('splits each lesson into lead and body without losing a block', () => {
    for (const l of LESSONS) {
      const all = getBlocks(l.slug)
      const lead = lessonLead(l.slug)
      const body = lessonBody(l.slug)
      const skipped = all.length - lead.length - body.length
      // only the scraped page-title heading "Bài n" may be dropped
      expect(skipped === 0 || skipped === 1, l.slug).toBe(true)
      if (skipped === 1) expect(all[0]).toMatchObject({ type: 'heading', level: 1 })
    }
  })
})

describe('projects page', () => {
  it('links to all six lessons', async () => {
    const { default: Projects } = await import('../pages/Projects')
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    )
    const list = screen.getByRole('list', { name: 'Sáu bài tập' })
    const hrefs = within(list)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/du-an/bai-1', '/du-an/bai-2', '/du-an/bai-3', '/du-an/bai-4', '/du-an/bai-5', '/du-an/bai-6'])
  })
})

describe('figure lightbox', () => {
  it('opens on click, closes on Escape and returns focus', async () => {
    const user = userEvent.setup()
    render(<Figure imageKey="bai-1/02-buoc-02" alt="Bước 2" caption="Truy cập ổ đĩa" />)
    const trigger = screen.getByRole('button', { name: /Phóng to/ })
    await user.click(trigger)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('img')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Đóng' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(trigger).toHaveFocus()
  })
})

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

async function renderPage(name: 'Lesson1' | 'Lesson3') {
  const mod = await import(`../pages/${name}.tsx`)
  const Page = mod.default
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
}

function expectVerbatim(container: HTMLElement, slug: 'bai-1' | 'bai-3') {
  const text = squash(container.textContent ?? '')
  for (const line of blockText([...lessonLead(slug), ...lessonBody(slug)]).split('\n').filter((l) => l.trim())) {
    expect(text).toContain(squash(line))
  }
}

describe('Bài 1', () => {
  it('keeps every line of the lesson', async () => {
    const { container } = await renderPage('Lesson1')
    expectVerbatim(container, 'bai-1')
  })

  it('shows all twelve screenshots as zoomable figures', async () => {
    await renderPage('Lesson1')
    const steps = screen.getByRole('list', { name: 'Các bước thực hành' })
    expect(within(steps).getAllByRole('button', { name: /Phóng to/ })).toHaveLength(12)
  })
})

describe('Bài 3', () => {
  it('keeps every line of the lesson', async () => {
    const { container } = await renderPage('Lesson3')
    expectVerbatim(container, 'bai-3')
  })

  it('offers a p / mf / f switch for each of the three tasks', async () => {
    await renderPage('Lesson3')
    const groups = screen.getAllByRole('radiogroup')
    expect(groups).toHaveLength(3)
    for (const g of groups) {
      const radios = within(g).getAllByRole('radio')
      expect(radios.map((r) => r.textContent)).toEqual(['pCơ bản', 'mfCải tiến', 'fNâng cao'])
      expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    }
  })

  it('moves the selection with the arrow keys', async () => {
    const user = userEvent.setup()
    await renderPage('Lesson3')
    const group = screen.getAllByRole('radiogroup')[0]
    const radios = within(group).getAllByRole('radio')
    radios[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(radios[2]).toHaveAttribute('aria-checked', 'true')
  })

  it('shows the screenshot that belongs to the chosen level', async () => {
    const user = userEvent.setup()
    await renderPage('Lesson3')
    const group = screen.getAllByRole('radiogroup')[0]
    await user.click(within(group).getByRole('radio', { name: /Nâng cao/ }))
    const panel = screen.getByRole('region', { name: /Tác vụ 1/ })
    const visible = [...panel.querySelectorAll('img')].filter((img) => !img.closest('[hidden]'))
    expect(visible).toHaveLength(1)
    expect(visible[0].getAttribute('src')).toContain('03-tac-vu-1-nang-cao')
  })
})

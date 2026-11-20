import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { blockText, getBlocks } from '../content/load'
import { squash } from './md-plain'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

describe('Tổng kết', () => {
  async function renderPage() {
    const Page = (await import('../pages/Conclusion')).default
    return render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>,
    )
  }

  it('keeps every line of the conclusion', async () => {
    const { container } = await renderPage()
    const text = squash(container.textContent ?? '')
    for (const line of blockText(getBlocks('tong-ket')).split('\n').filter((l) => l.trim())) {
      expect(text).toContain(squash(line))
    }
  })

  it('plays the closing C major chord', async () => {
    const piano = await import('../audio/piano')
    await renderPage()
    await userEvent.click(screen.getByRole('button', { name: 'Nghe hợp âm kết' }))
    expect(piano.playChord).toHaveBeenCalledWith(['C4', 'E4', 'G4', 'C5'], { arpeggio: 0.06 })
  })
})

describe('index.html', () => {
  it('declares Vietnamese and a description', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('lang="vi"')
    expect(html).toMatch(/<meta name="description"/)
    expect(html).toMatch(/og:image/)
  })
})

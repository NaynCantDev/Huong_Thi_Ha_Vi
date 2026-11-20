import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from './media'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

async function renderAt(path: string) {
  const { default: App } = await import('../App')
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('site shell', () => {
  it('shows nine scale keys with the current page marked', async () => {
    await renderAt('/du-an/bai-3')
    const nav = screen.getByRole('navigation', { name: 'Các trang' })
    const links = within(nav).getAllByRole('link')
    expect(links).toHaveLength(9)
    const current = links.filter((a) => a.getAttribute('aria-current') === 'page')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAccessibleName(/Bài 3/)
  })

  it('plays the page note when a scale key is clicked', async () => {
    const piano = await import('../audio/piano')
    await renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Các trang' })
    await userEvent.click(within(nav).getByRole('link', { name: /Tổng kết/ }))
    expect(piano.playNote).toHaveBeenCalledWith('D5', expect.anything())
  })

  it('toggles sound with a pressed-state button', async () => {
    await renderAt('/')
    const btn = screen.getByRole('button', { name: /âm thanh/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('havi-sound')).toBe('off')
  })

  it('renders content fully visible when reduced motion is on', async () => {
    mockReducedMotion(true)
    await renderAt('/du-an/bai-2')
    const h1 = await screen.findByRole('heading', { level: 1 })
    let el: HTMLElement | null = h1
    while (el) {
      expect(el.style.opacity === '' || Number(el.style.opacity) === 1).toBe(true)
      el = el.parentElement
    }
    mockReducedMotion(false)
  })

  it('has a skip link to the main content', async () => {
    await renderAt('/')
    expect(screen.getByRole('link', { name: 'Bỏ qua đến nội dung' })).toHaveAttribute('href', '#main')
  })
})

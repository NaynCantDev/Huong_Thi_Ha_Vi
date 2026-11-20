import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { PianoKeyboard } from '../components/PianoKeyboard'
import { blockText, getBlocks } from '../content/load'
import { squash } from './md-plain'

vi.mock('../audio/piano', async (orig) => {
  const real = await orig<typeof import('../audio/piano')>()
  return { ...real, playNote: vi.fn(), playChord: vi.fn() }
})

function setup() {
  const onNote = vi.fn()
  render(<PianoKeyboard from="C4" octaves={2} onNote={onNote} />)
  return onNote
}

describe('<PianoKeyboard>', () => {
  it('plays C4 when the A key is typed', async () => {
    const onNote = setup()
    await userEvent.keyboard('a')
    expect(onNote.mock.calls[0][0]).toBe('C4')
  })

  it('maps K to C5 and W to C#4', async () => {
    const onNote = setup()
    await userEvent.keyboard('k')
    await userEvent.keyboard('w')
    expect(onNote.mock.calls.map((c) => c[0])).toEqual(['C5', 'C#4'])
  })

  it('ignores shortcuts with Ctrl, Alt or Meta', () => {
    const onNote = setup()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', ctrlKey: true })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', altKey: true })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', metaKey: true })
    expect(onNote).not.toHaveBeenCalled()
  })

  it('does not retrigger while a key is held', () => {
    const onNote = setup()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', repeat: true })
    expect(onNote).toHaveBeenCalledTimes(1)
  })

  it('ignores typing inside a text field', () => {
    const onNote = vi.fn()
    render(
      <>
        <input aria-label="ô nhập" />
        <PianoKeyboard from="C4" octaves={2} onNote={onNote} />
      </>,
    )
    const input = screen.getByLabelText('ô nhập')
    fireEvent.keyDown(input, { code: 'KeyA', key: 'a' })
    expect(onNote).not.toHaveBeenCalled()
  })

  it('plays a key when clicked', async () => {
    const onNote = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Đô 4' }))
    expect(onNote.mock.calls[0][0]).toBe('C4')
  })

  it('renders two octaves plus the top C', () => {
    setup()
    expect(screen.getAllByRole('button')).toHaveLength(25)
  })
})

describe('home page', () => {
  it('shows the introduction verbatim and the course', async () => {
    const { default: Home } = await import('../pages/Home')
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const text = squash(container.textContent ?? '')
    for (const line of blockText(getBlocks('gioi-thieu')).split('\n').filter(Boolean)) {
      expect(text).toContain(squash(line))
    }
    expect(container.textContent).toContain('Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo')
    expect(container.textContent).toContain('Mục tiêu của Portfolio')
  })
})

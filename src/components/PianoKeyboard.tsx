import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { noteToMidi, playNote } from '../audio/piano'
import styles from './PianoKeyboard.module.css'

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const SOLFEGE: Record<string, string> = { C: 'Đô', D: 'Rê', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }

/** Computer keys → semitone offset from the first key (classic tracker layout). */
const KEYMAP: Record<string, number> = {
  KeyA: 0,
  KeyW: 1,
  KeyS: 2,
  KeyE: 3,
  KeyD: 4,
  KeyF: 5,
  KeyT: 6,
  KeyG: 7,
  KeyY: 8,
  KeyH: 9,
  KeyU: 10,
  KeyJ: 11,
  KeyK: 12,
  KeyO: 13,
  KeyL: 14,
  KeyP: 15,
  Semicolon: 16,
}
const HINTS: Record<number, string> = Object.fromEntries(
  Object.entries(KEYMAP).map(([code, off]) => [off, code === 'Semicolon' ? ';' : code.slice(3)]),
)

type Key = { note: string; offset: number; black: boolean; label: string; hint?: string; octave: number }

function buildKeys(from: string, octaves: number): Key[] {
  const start = noteToMidi(from)
  const keys: Key[] = []
  for (let off = 0; off <= octaves * 12; off++) {
    const midi = start + off
    const name = NAMES[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    const black = name.includes('#')
    const base = SOLFEGE[name[0]]
    keys.push({
      note: `${name}${octave}`,
      offset: off,
      black,
      label: black ? `${base} thăng ${octave}` : `${base} ${octave}`,
      hint: HINTS[off],
      octave: Math.floor(off / 12),
    })
  }
  return keys
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

type Props = {
  from?: string
  octaves?: number
  /** Called after a note sounds (for visuals). */
  onNote?: (note: string, keyRect?: DOMRect) => void
  className?: string
}

export function PianoKeyboard({ from = 'C4', octaves = 2, onNote, className }: Props) {
  const keys = useMemo(() => buildKeys(from, octaves), [from, octaves])
  const [pressed, setPressed] = useState<ReadonlySet<string>>(new Set())
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const dragging = useRef(false)

  const press = useCallback(
    (note: string) => {
      playNote(note, { velocity: 0.8 })
      setPressed((s) => new Set(s).add(note))
      onNote?.(note, refs.current.get(note)?.getBoundingClientRect())
    },
    [onNote],
  )
  const release = useCallback((note: string) => {
    setPressed((s) => {
      if (!s.has(note)) return s
      const n = new Set(s)
      n.delete(note)
      return n
    })
  }, [])

  useEffect(() => {
    const byOffset = new Map(keys.map((k) => [k.offset, k.note]))
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || isTyping(e.target)) return
      const off = KEYMAP[e.code]
      const note = off === undefined ? undefined : byOffset.get(off)
      if (!note) return
      e.preventDefault()
      press(note)
    }
    const up = (e: KeyboardEvent) => {
      const off = KEYMAP[e.code]
      const note = off === undefined ? undefined : byOffset.get(off)
      if (note) release(note)
    }
    const stop = () => {
      dragging.current = false
      setPressed((s) => (s.size ? new Set() : s))
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('pointerup', stop)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('blur', stop)
    }
  }, [keys, press, release])

  const whites = keys.filter((k) => !k.black)

  return (
    <div
      className={[styles.keyboard, className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Bàn phím piano"
      style={{ '--whites': whites.length } as CSSProperties}
    >
      {whites.map((w) => {
        const black = keys.find((k) => k.offset === w.offset + 1 && k.black)
        return (
          <div key={w.note} className={styles.slot} data-octave={w.octave}>
            <KeyButton k={w} pressed={pressed.has(w.note)} press={press} release={release} refs={refs} dragging={dragging} />
            {black && (
              <KeyButton
                k={black}
                pressed={pressed.has(black.note)}
                press={press}
                release={release}
                refs={refs}
                dragging={dragging}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

type KeyProps = {
  k: Key
  pressed: boolean
  press: (n: string) => void
  release: (n: string) => void
  refs: React.RefObject<Map<string, HTMLButtonElement>>
  dragging: React.RefObject<boolean>
}

function KeyButton({ k, pressed, press, release, refs, dragging }: KeyProps) {
  return (
    <button
      ref={(el) => {
        if (el) refs.current.set(k.note, el)
        else refs.current.delete(k.note)
      }}
      type="button"
      className={k.black ? styles.black : styles.white}
      data-pressed={pressed || undefined}
      aria-label={k.label}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        dragging.current = true
        e.currentTarget.releasePointerCapture?.(e.pointerId)
        press(k.note)
      }}
      onPointerEnter={() => {
        if (dragging.current) press(k.note)
      }}
      onPointerLeave={() => release(k.note)}
      onPointerUp={() => release(k.note)}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        if (!e.repeat) press(k.note)
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') release(k.note)
      }}
    >
      {k.hint && !k.black && (
        <span className={styles.hint} aria-hidden="true">
          {k.hint}
        </span>
      )}
    </button>
  )
}

import type { CSSProperties } from 'react'
import { noteToMidi } from '../audio/piano'
import styles from './Staff.module.css'

const LETTER_STEP: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

/** Diatonic steps above E4 (the bottom line of a treble staff). */
export function staffStep(note: string): number {
  noteToMidi(note) // validates
  const m = /^([A-G])[#b]?(-?\d)$/.exec(note)!
  return (Number(m[2]) - 4) * 7 + LETTER_STEP[m[1]] - LETTER_STEP.E
}

type Props = {
  note?: string
  className?: string
  /** Horizontal position of the note head, 0–1. */
  at?: number
}

/**
 * A five-line treble staff that stretches to its box, with one note head
 * placed by pitch. The note keeps its shape at any width.
 */
export function StaffNote({ note, className, at = 0.6 }: Props) {
  const step = note ? staffStep(note) : 0
  const ledgers: number[] = []
  for (let s = -2; s >= step; s -= 2) ledgers.push(s)
  for (let s = 10; s <= step; s += 2) ledgers.push(s)

  // The box spans steps -3 … 11 (a little room for ledger lines above and below).
  const pos = (s: number) => `${((11 - s) / 14) * 100}%`

  return (
    <span className={[styles.staff, className].filter(Boolean).join(' ')} aria-hidden="true">
      {[0, 2, 4, 6, 8].map((s) => (
        <span key={s} className={styles.line} style={{ top: pos(s) }} />
      ))}
      {note && (
        <>
          {ledgers.map((s) => (
            <span key={s} className={styles.ledger} style={{ top: pos(s), left: `${at * 100}%` }} />
          ))}
          <span className={styles.head} style={{ top: pos(step), left: `${at * 100}%` } as CSSProperties} />
        </>
      )}
    </span>
  )
}

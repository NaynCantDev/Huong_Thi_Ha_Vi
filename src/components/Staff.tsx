import type { SVGProps } from 'react'
import { noteToMidi } from '../audio/piano'

const LETTER_STEP: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

/** Diatonic steps above E4 (the bottom line of a treble staff). */
export function staffStep(note: string): number {
  noteToMidi(note) // validates
  const m = /^([A-G])[#b]?(-?\d)$/.exec(note)!
  return (Number(m[2]) - 4) * 7 + LETTER_STEP[m[1]] - LETTER_STEP.E
}

type Props = SVGProps<SVGSVGElement> & {
  note?: string
  /** Distance between staff lines in viewBox units. */
  gap?: number
  width?: number
}

/** A five-line treble staff, optionally with one whole note placed by pitch. */
export function StaffNote({ note, gap = 10, width = 120, ...rest }: Props) {
  const top = gap * 1.5
  const bottom = top + gap * 4
  const height = bottom + gap * 1.5
  const step = note ? staffStep(note) : 0
  const cy = bottom - (step * gap) / 2
  const cx = width * 0.6
  const ledgers: number[] = []
  for (let s = -2; s >= step; s -= 2) ledgers.push(bottom - (s * gap) / 2)
  for (let s = 10; s <= step; s += 2) ledgers.push(bottom - (s * gap) / 2)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" {...rest}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          x2={width}
          y1={top + i * gap}
          y2={top + i * gap}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {note && (
        <g style={{ color: 'var(--phuong)' }}>
          {ledgers.map((y) => (
            <line
              key={y}
              x1={cx - gap * 1.1}
              x2={cx + gap * 1.1}
              y1={y}
              y2={y}
              stroke="var(--ink)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <ellipse cx={cx} cy={cy} rx={gap * 0.66} ry={gap * 0.46} transform={`rotate(-20 ${cx} ${cy})`} fill="currentColor" />
        </g>
      )}
    </svg>
  )
}

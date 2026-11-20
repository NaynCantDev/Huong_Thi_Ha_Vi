import { motion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { playNote } from '../audio/piano'
import styles from './DynamicsSwitch.module.css'

export type Level = { mark: 'p' | 'mf' | 'f'; label: string }

export const PROMPT_LEVELS: Level[] = [
  { mark: 'p', label: 'Cơ bản' },
  { mark: 'mf', label: 'Cải tiến' },
  { mark: 'f', label: 'Nâng cao' },
]

/** Velocity for each dynamic marking: soft, medium, loud. */
const VELOCITY = { p: 0.3, mf: 0.6, f: 1 } as const

type Props = {
  /** Accessible name of the comparison, e.g. "Tác vụ 1". */
  name: string
  title?: ReactNode
  levels?: Level[]
  panels: ReactNode[]
  note?: string
}

/** Switch between three versions of the same thing, marked like musical dynamics. */
export function DynamicsSwitch({ name, title, levels = PROMPT_LEVELS, panels, note = 'G4' }: Props) {
  const [sel, setSel] = useState(0)
  const id = useId()
  const radios = useRef<(HTMLButtonElement | null)[]>([])

  const choose = (i: number, focus = false) => {
    setSel(i)
    playNote(note, { velocity: VELOCITY[levels[i].mark], duration: 1.2 })
    if (focus) radios.current[i]?.focus()
  }

  const onKey = (e: KeyboardEvent) => {
    const n = levels.length
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      choose((sel + 1) % n, true)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      choose((sel - 1 + n) % n, true)
    } else if (e.key === 'Home') {
      e.preventDefault()
      choose(0, true)
    } else if (e.key === 'End') {
      e.preventDefault()
      choose(n - 1, true)
    }
  }

  return (
    <section className={styles.wrap} aria-label={name}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.switch} role="radiogroup" aria-label={`Chọn phiên bản prompt cho ${name}`} onKeyDown={onKey}>
        {levels.map((l, i) => (
          <button
            key={l.mark}
            ref={(el) => {
              radios.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={i === sel}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === sel ? 0 : -1}
            className={styles.radio}
            data-mark={l.mark}
            onClick={() => choose(i)}
          >
            {i === sel && (
              <motion.span
                layoutId={`${id}-pill`}
                className={styles.pill}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className={styles.mark}>{l.mark}</span>
            <span className={styles.label}>{l.label}</span>
          </button>
        ))}
        <span className={styles.hairpin} aria-hidden="true" />
      </div>
      {panels.map((p, i) => (
        <div key={i} id={`${id}-panel-${i}`} className={styles.panel} hidden={i !== sel}>
          {p}
        </div>
      ))}
    </section>
  )
}

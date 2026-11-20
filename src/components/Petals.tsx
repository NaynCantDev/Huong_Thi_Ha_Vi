import type { CSSProperties } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Petals.module.css'

// Fixed pseudo-random layout so server and client agree and nothing jumps.
const PETALS = Array.from({ length: 14 }, (_, i) => {
  const r = (n: number) => ((Math.sin((i + 1) * n) + 1) / 2) % 1
  return {
    left: `${Math.round(r(12.9898) * 100)}%`,
    size: 10 + Math.round(r(78.233) * 12),
    delay: -Math.round(r(39.425) * 14 * 10) / 10,
    duration: 11 + Math.round(r(93.989) * 9),
    sway: 30 + Math.round(r(4.13) * 60),
    tint: i % 3,
  }
})

/** Flame-tree petals drifting down behind the hero. Hidden for reduced motion. */
export function Petals() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className={styles.layer} aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={styles.petal}
          data-tint={p.tint}
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size * 0.8,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--sway': `${p.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

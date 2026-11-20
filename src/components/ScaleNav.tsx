import { NavLink, useLocation } from 'react-router'
import { playNote } from '../audio/piano'
import { PAGES, getPageByPath } from '../data/pages'
import { useScaleFlash } from './scaleFlash'
import styles from './ScaleNav.module.css'

/** White-key indexes followed by a black key (C#, D#, F#, G#, A#, C#). */
const BLACK_AFTER = new Set([0, 1, 3, 4, 5, 7])

export function ScaleNav() {
  const { pathname } = useLocation()
  const current = getPageByPath(pathname)
  const flashing = useScaleFlash()

  return (
    <nav className={styles.nav} aria-label="Các trang">
      <ol className={styles.keys} data-flash={flashing || undefined}>
        {PAGES.map((p, i) => (
          <li key={p.slug} className={styles.slot} style={{ '--i': i } as React.CSSProperties}>
            <NavLink
              to={p.path}
              end
              className={styles.key}
              aria-label={`${p.title} (nốt ${p.solfege})`}
              onClick={() => playNote(p.note, { velocity: 0.6, duration: 1.4 })}
            >
              <span className={styles.tip} aria-hidden="true">
                {p.navLabel}
              </span>
            </NavLink>
            {BLACK_AFTER.has(i) && <span className={styles.black} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      {current && (
        <span className={styles.current} aria-hidden="true">
          {current.navLabel}
        </span>
      )}
    </nav>
  )
}

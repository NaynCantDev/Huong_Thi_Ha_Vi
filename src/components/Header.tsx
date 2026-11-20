import { Link } from 'react-router'
import { useSound } from '../audio/useSound'
import { SITE } from '../data/site'
import { ScaleNav } from './ScaleNav'
import styles from './Header.module.css'

export function Header() {
  const { on, toggle } = useSound()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          {SITE.shortName}
        </Link>
        <ScaleNav />
        <button
          type="button"
          className={styles.sound}
          aria-pressed={on}
          aria-label="Âm thanh phím đàn"
          title={on ? 'Tắt âm thanh' : 'Bật âm thanh'}
          onClick={toggle}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
            {on ? (
              <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M15.5 9a4 4 0 0 1 0 6" />
                <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
              </g>
            ) : (
              <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
    </header>
  )
}

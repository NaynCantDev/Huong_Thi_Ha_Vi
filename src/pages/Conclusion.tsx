import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { playChord } from '../audio/piano'
import { flashScale } from '../components/scaleFlash'
import { Seo } from '../components/Seo'
import { Blocks } from '../content/Blocks'
import { getBlocks } from '../content/load'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Conclusion.module.css'

const FINAL_CHORD = ['C4', 'E4', 'G4', 'C5']

export default function Conclusion() {
  const reduce = useReducedMotion()
  const [played, setPlayed] = useState(0)

  const play = () => {
    playChord(FINAL_CHORD, { arpeggio: 0.06 })
    flashScale()
    setPlayed((n) => n + 1)
  }

  return (
    <div className={styles.page}>
      <Seo slug="tong-ket" />
      <header className={styles.head}>
        <h1>Tổng kết</h1>
      </header>

      <div className={styles.body}>
        <Blocks blocks={getBlocks('tong-ket')} />
      </div>

      <section className={styles.cadence} aria-labelledby="hop-am-ket">
        <h2 id="hop-am-ket" className="visually-hidden">
          Hợp âm kết
        </h2>
        <div className={styles.chord} aria-hidden="true">
          {FINAL_CHORD.map((n, i) => (
            <motion.span
              key={`${n}-${played}`}
              className={styles.head}
              style={{ bottom: `${[0, 2, 4, 7][i] * 0.62}rem` }}
              initial={played && !reduce ? { scale: 0.4, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 500, damping: 18 }}
            />
          ))}
        </div>
        {/* VIẾT MỚI */}
        <p className={styles.thanks}>Cảm ơn bạn đã đọc hết tập nhạc của tôi.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.play} onClick={play}>
            Nghe hợp âm kết
          </button>
          <Link to="/" className={styles.again}>
            Về trang Giới thiệu
          </Link>
        </div>
      </section>
    </div>
  )
}

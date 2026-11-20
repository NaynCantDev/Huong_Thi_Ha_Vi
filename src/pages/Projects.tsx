import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { playNote } from '../audio/piano'
import { Seo } from '../components/Seo'
import { StaffNote } from '../components/Staff'
import { imageUrl } from '../content/images'
import { LESSONS } from '../data/lessons'
import { getPage } from '../data/pages'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Projects.module.css'

export default function Projects() {
  const [active, setActive] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const enter = (slug: string, note: string) => {
    if (active === slug) return
    setActive(slug)
    playNote(note, { velocity: 0.45, duration: 1.2 })
  }

  return (
    <div className={styles.page}>
      <Seo slug="du-an" />
      <header className={styles.head}>
        <h1>Dự án</h1>
        {/* VIẾT MỚI — trang Dự án trên site gốc để trống */}
        <p className={styles.intro}>
          Sáu bài tập của học phần, xếp theo thứ tự tôi đã làm. Mỗi bài là một nốt trên khuông nhạc: đi hết sáu bài là đi lên
          một quãng tám.
        </p>
      </header>

      <ol className={styles.list} aria-label="Sáu bài tập" onMouseLeave={() => setActive(null)}>
        {LESSONS.map((l) => {
          const page = getPage(l.slug)
          const isActive = active === l.slug
          return (
            <li key={l.slug} className={styles.item} data-active={isActive || undefined}>
              <Link
                to={page.path}
                className={styles.row}
                onMouseEnter={() => enter(l.slug, page.note)}
                onFocus={() => enter(l.slug, page.note)}
              >
                <StaffNote note={page.note} className={styles.staff} />
                <span className={styles.num}>Bài {l.number}</span>
                <span className={styles.text}>
                  <span className={styles.chapter}>{l.chapter}</span>
                  <span className={styles.title}>{l.title}</span>
                  <span className={styles.summary}>{l.summary}</span>
                </span>
              </Link>
              <AnimatePresence>
                {isActive && l.cover && (
                  <motion.img
                    key={l.cover}
                    className={styles.thumb}
                    src={imageUrl(l.cover)}
                    alt=""
                    aria-hidden="true"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: -1.5 }}
                    exit={{ opacity: 0, x: reduce ? 0 : 12 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

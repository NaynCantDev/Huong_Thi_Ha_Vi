import { motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { LessonLayout } from '../components/LessonLayout'
import { Blocks, Inlines } from '../content/Blocks'
import { lessonBody } from '../data/lessons'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Lesson6.module.css'

export default function Lesson6() {
  const body = useMemo(() => lessonBody('bai-6'), [])
  const sections = useMemo(() => body.flatMap((b) => (b.type === 'heading' && b.level === 2 ? [b] : [])), [body])
  const [active, setActive] = useState(sections[0]?.id)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [sections])

  return (
    <LessonLayout slug="bai-6" wide>
      <div className={styles.reading} aria-hidden="true">
        <motion.span className={styles.readingFill} style={{ scaleX: reduce ? scrollYProgress : progress }} />
      </div>
      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Mục lục">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined}>
                  <Inlines nodes={s.c} />
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.essay}>
          <Blocks blocks={body} />
        </div>
      </div>
    </LessonLayout>
  )
}

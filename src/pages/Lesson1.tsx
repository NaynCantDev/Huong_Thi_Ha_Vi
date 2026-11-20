import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Figure } from '../components/Figure'
import { LessonLayout } from '../components/LessonLayout'
import { BlockView } from '../content/Blocks'
import { groupByImages } from '../content/group'
import { lessonBody } from '../data/lessons'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Lesson1.module.css'

const noImage = () => null

export default function Lesson1() {
  const { steps, tail } = groupByImages(lessonBody('bai-1'))
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const el of refs.current) if (el) io.observe(el)
    return () => io.disconnect()
  }, [])

  const current = steps[active] ?? steps[0]

  return (
    <LessonLayout slug="bai-1" wide>
      <div className={styles.layout}>
        <ol className={styles.steps} aria-label="Các bước thực hành">
          {steps.map((s, i) => (
            <li
              key={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-step={i}
              data-active={i === active || undefined}
              className={styles.step}
            >
              <div className={styles.text}>
                {s.text.map((b, j) => (
                  <BlockView key={j} block={b} index={j} renderImage={noImage} />
                ))}
              </div>
              <div className={styles.inlineImages}>
                {s.images.map((img) => (
                  <Figure key={img.key} imageKey={img.key} alt={img.alt} />
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.stage}>
          <div className={styles.stageInner}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className={styles.stageImages}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.images.map((img, k) => (
                  <Figure
                    key={img.key}
                    imageKey={img.key}
                    alt={`Ảnh bước ${active + 1}${current.images.length > 1 ? ` (${k + 1})` : ''}`}
                    priority
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <p className={styles.counter}>
              Bước {active + 1} / {steps.length}
            </p>
          </div>
        </div>
      </div>

      {tail.length > 0 && (
        <div className={styles.tail}>
          {tail.map((b, j) => (
            <BlockView key={j} block={b} index={j} renderImage={noImage} />
          ))}
        </div>
      )}
    </LessonLayout>
  )
}

import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import { playNote } from '../audio/piano'
import { Petals } from '../components/Petals'
import { PianoKeyboard } from '../components/PianoKeyboard'
import { Seo } from '../components/Seo'
import { Inlines } from '../content/Blocks'
import { imageSize, imageUrl } from '../content/images'
import { getBlocks } from '../content/load'
import type { Block, Inline } from '../content/types'
import { LESSONS } from '../data/lessons'
import { getPage } from '../data/pages'
import { SITE } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Home.module.css'

const INTRO_KEY = 'havi-intro-played'
const EASE = [0.22, 1, 0.36, 1] as const

function introPlayed(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return true
  }
}

function inl(b: Block | undefined): Inline[] {
  return b && (b.type === 'p' || b.type === 'heading') ? b.c : []
}

type Flying = { id: number; x: number }

export default function Home() {
  const reduce = useReducedMotion()
  const [animateIntro] = useState(() => !reduce && !introPlayed())
  const blocks = getBlocks('gioi-thieu')
  const [greeting, studyLine, idLine, goalLabel, goalText, dirLabel, dirText] = blocks

  // flying notes
  const keysRef = useRef<HTMLDivElement>(null)
  const [flying, setFlying] = useState<Flying[]>([])
  const idRef = useRef(0)
  const onNote = useCallback(
    (_note: string, rect?: DOMRect) => {
      if (reduce || !rect || !keysRef.current) return
      const box = keysRef.current.getBoundingClientRect()
      const id = ++idRef.current
      setFlying((f) => [...f.slice(-10), { id, x: rect.left + rect.width / 2 - box.left }])
      window.setTimeout(() => setFlying((f) => f.filter((n) => n.id !== id)), 1100)
    },
    [reduce],
  )

  // banner parallax
  const bannerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ['start end', 'end start'] })
  const bannerY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%'])

  const intro = (delay: number, from: Record<string, number | string>) =>
    animateIntro
      ? {
          initial: from,
          animate: { opacity: 1, x: 0, y: 0, scaleX: 1, clipPath: 'inset(0% 0% 0% 0%)' },
          transition: { duration: 0.7, ease: EASE, delay },
        }
      : {}

  const markPlayed = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const portrait = 'gioi-thieu/02-portrait'
  const portraitSize = imageSize(portrait)
  const banner = 'gioi-thieu/01-banner'
  const bannerSize = imageSize(banner)
  const letters = [...SITE.shortName]

  return (
    <div className={styles.home}>
      <Seo slug="gioi-thieu" />

      <section className={styles.hero}>
        <Petals />
        <div className={styles.heroTop}>
          <div className={styles.nameCol}>
            <div className={styles.staffWrap}>
              <div className={styles.staff} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span key={i} className={styles.line} {...intro(i * 0.07, { scaleX: 0 })} />
                ))}
              </div>
              <h1 className={styles.name}>
                <span className={styles.big} aria-hidden="true">
                  {letters.map((ch, i) =>
                    ch === ' ' ? (
                      <span key={i} className={styles.space} />
                    ) : (
                      <motion.span
                        key={i}
                        className={styles.letter}
                        {...(animateIntro
                          ? {
                              initial: { opacity: 0, y: '-0.6em' },
                              animate: { opacity: 1, y: 0 },
                              transition: { type: 'spring', stiffness: 380, damping: 22, delay: 0.35 + i * 0.07 },
                            }
                          : {})}
                        onAnimationComplete={i === letters.length - 1 ? markPlayed : undefined}
                      >
                        {ch}
                      </motion.span>
                    ),
                  )}
                </span>
                <span className={styles.full}>{SITE.name}</span>
              </h1>
            </div>
            {/* VIẾT MỚI — câu giới thiệu ngắn ở đầu trang */}
            <motion.p className={styles.tagline} {...intro(0.6, { opacity: 0, y: 12 })}>
              Sinh viên {SITE.major.toLowerCase()} tại {SITE.school}. Tôi học piano, thanh nhạc và đang tập đưa công nghệ số vào
              việc dạy nhạc.
            </motion.p>
          </div>

          <motion.div className={styles.portraitCol} {...intro(0.25, { clipPath: 'inset(100% 0% 0% 0%)' })}>
            <img
              className={styles.portrait}
              src={imageUrl(portrait)}
              alt="Ảnh chân dung Vương Thị Hà Vi ở hành lang trường"
              width={portraitSize.width}
              height={portraitSize.height}
              fetchPriority="high"
            />
          </motion.div>
        </div>

        <motion.div className={styles.keysWrap} ref={keysRef} {...intro(0.75, { opacity: 0, y: 40 })}>
          <p className={styles.hint}>
            <span>Bấm phím để chơi thử</span>
            <span className={styles.hintKeys}>, hoặc gõ A, S, D, F… trên bàn phím máy tính</span>.
          </p>
          <div className={styles.flyLayer} aria-hidden="true">
            <AnimatePresence>
              {flying.map((n) => (
                <motion.span
                  key={n.id}
                  className={styles.fly}
                  style={{ left: n.x }}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0], y: -150, scale: 1, rotate: -12 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <svg viewBox="0 0 20 28" width="20" height="28">
                    <ellipse cx="7" cy="22" rx="6" ry="4.4" transform="rotate(-20 7 22)" fill="currentColor" />
                    <path d="M12.5 21V2c2 3.5 6 4.5 6 9" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <PianoKeyboard from="C4" octaves={2} onNote={onNote} />
        </motion.div>
      </section>

      <div className={styles.banner} ref={bannerRef}>
        <motion.img
          src={imageUrl(banner)}
          alt="Sân trường mùa hoa phượng đỏ"
          width={bannerSize.width}
          height={bannerSize.height}
          style={{ y: bannerY }}
          loading="lazy"
        />
      </div>

      <section className={styles.about} aria-labelledby="ve-minh">
        <h2 id="ve-minh" className={styles.sectionTitle}>
          Về mình
        </h2>
        <div className={styles.aboutGrid}>
          <div className={styles.greeting}>
            <p className={styles.hello}>
              <Inlines nodes={inl(greeting)} />
            </p>
            <p>
              <Inlines nodes={inl(studyLine)} />
            </p>
            <p>
              <Inlines nodes={inl(idLine)} />
            </p>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Học phần</dt>
              <dd>{SITE.course}</dd>
            </div>
            <div>
              <dt>Giảng viên hướng dẫn</dt>
              <dd>{SITE.lecturer}</dd>
            </div>
            {SITE.className && (
              <div>
                <dt>Lớp</dt>
                <dd>{SITE.className}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className={styles.goals}>
          <div className={styles.goal}>
            <h3>
              <Inlines nodes={inl(goalLabel)} />
            </h3>
            <p>
              <Inlines nodes={inl(goalText)} />
            </p>
          </div>
          <div className={styles.goal}>
            <h3>
              <Inlines nodes={inl(dirLabel)} />
            </h3>
            <p>
              <Inlines nodes={inl(dirText)} />
            </p>
          </div>
        </div>
      </section>

      <section className={styles.purpose} aria-labelledby="muc-tieu-portfolio">
        <h2 id="muc-tieu-portfolio" className={styles.sectionTitle}>
          Mục tiêu của Portfolio
        </h2>
        <ul className={styles.purposeList}>
          {SITE.portfolioGoals.map((g) => (
            <li key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.lessons} aria-labelledby="sau-bai-tap">
        <div className={styles.lessonsHead}>
          <h2 id="sau-bai-tap" className={styles.sectionTitle}>
            Sáu bài tập
          </h2>
          <Link to="/du-an" className={styles.allLink}>
            Xem trang Dự án
          </Link>
        </div>
        <ol className={styles.lessonKeys}>
          {LESSONS.map((l) => {
            const page = getPage(l.slug)
            return (
              <li key={l.slug}>
                <Link
                  to={page.path}
                  className={styles.lessonKey}
                  onPointerEnter={() => playNote(page.note, { velocity: 0.4, duration: 1 })}
                >
                  <span className={styles.lessonNum}>Bài {l.number}</span>
                  <span className={styles.lessonTitle}>{l.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

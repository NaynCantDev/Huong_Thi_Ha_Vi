import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { playNote } from '../audio/piano'
import { BlockView } from '../content/Blocks'
import { getNeighbors, getPage } from '../data/pages'
import { getLesson, lessonLead, type LessonSlug } from '../data/lessons'
import { Seo } from './Seo'
import { StaffNote } from './Staff'
import styles from './LessonLayout.module.css'

type Props = { slug: LessonSlug; children: ReactNode; wide?: boolean }

export function LessonLayout({ slug, children, wide }: Props) {
  const lesson = getLesson(slug)
  const page = getPage(slug)
  const lead = lessonLead(slug)
  const { prev, next } = getNeighbors(slug)
  const facts = [
    ['Mục tiêu', lesson.goal],
    ['Công cụ', lesson.tools],
    ['Kết quả', lesson.result],
  ].filter((f): f is [string, string] => Boolean(f[1]))

  return (
    <article className={styles.lesson}>
      <Seo slug={slug} />
      <header className={styles.head}>
        <div className={styles.titleRow}>
          <div className={styles.number}>
            <button
              type="button"
              className={styles.noteButton}
              onClick={() => playNote(page.note)}
              aria-label={`Nghe nốt ${page.solfege} của ${page.title}`}
            >
              <StaffNote note={page.note} className={styles.staff} />
            </button>
            <h1>{page.title}</h1>
          </div>
          <div className={styles.lead}>
            {lesson.chapterInferred && <p className={styles.chapter}>{lesson.chapter}</p>}
            {lead.map((b, i) => (
              <div key={i} className={i === 0 && !lesson.chapterInferred && lead.length > 1 ? styles.chapter : styles.leadTitle}>
                <BlockView block={b} index={i} renderImage={() => null} />
              </div>
            ))}
          </div>
        </div>
        {facts.length > 0 && (
          <dl className={styles.facts}>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className={wide ? styles.bodyWide : styles.body}>{children}</div>

      <nav className={styles.pager} aria-label="Bài trước và bài sau">
        {prev && (
          <Link to={prev.path} className={styles.prev} onClick={() => playNote(prev.note, { velocity: 0.5 })}>
            <span className={styles.pagerHint}>Trang trước</span>
            <span className={styles.pagerTitle}>{pagerLabel(prev.slug)}</span>
          </Link>
        )}
        {next && (
          <Link to={next.path} className={styles.next} onClick={() => playNote(next.note, { velocity: 0.5 })}>
            <span className={styles.pagerHint}>Trang tiếp theo</span>
            <span className={styles.pagerTitle}>{pagerLabel(next.slug)}</span>
          </Link>
        )}
      </nav>
    </article>
  )
}

function pagerLabel(slug: string): string {
  if (slug.startsWith('bai-')) {
    const l = getLesson(slug as LessonSlug)
    return `Bài ${l.number}: ${l.title}`
  }
  return getPage(slug as Parameters<typeof getPage>[0]).title
}

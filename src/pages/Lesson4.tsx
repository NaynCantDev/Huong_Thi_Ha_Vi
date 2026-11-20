import { Figure } from '../components/Figure'
import { LessonLayout } from '../components/LessonLayout'
import { Blocks } from '../content/Blocks'
import { lessonBody } from '../data/lessons'
import styles from './Lesson4.module.css'

export default function Lesson4() {
  const body = lessonBody('bai-4')
  const first = body.findIndex((b) => b.type === 'image')
  let last = first
  while (body[last + 1]?.type === 'image') last++
  const images = body.slice(first, last + 1).flatMap((b) => (b.type === 'image' ? [b] : []))

  return (
    <LessonLayout slug="bai-4" wide>
      <a className={styles.download} href="/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx" download>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>
          Tải báo cáo gốc
          <small>Bao_cao_Bai_tap_4_Hoan_chinh.docx, Word, 1,2 MB</small>
        </span>
      </a>

      <div className={styles.report}>
        <Blocks blocks={body.slice(0, first)} />
      </div>

      <ul className={styles.gallery} aria-label="Ảnh dẫn chứng cuộc họp">
        {images.map((img, i) => (
          <li key={img.key}>
            <Figure imageKey={img.key} alt={`Ảnh dẫn chứng cuộc họp ${i + 1}`} />
          </li>
        ))}
      </ul>

      <div className={styles.report}>
        <Blocks blocks={body.slice(last + 1)} />
      </div>
    </LessonLayout>
  )
}

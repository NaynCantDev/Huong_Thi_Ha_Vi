import { Figure } from '../components/Figure'
import { LessonLayout } from '../components/LessonLayout'
import { ZoomViewer } from '../components/ZoomViewer'
import { BlockView, Inlines } from '../content/Blocks'
import type { Block } from '../content/types'
import { lessonBody } from '../data/lessons'
import styles from './Lesson5.module.css'

const noImage = () => null

export default function Lesson5() {
  const body = lessonBody('bai-5')
  const firstImage = body.findIndex((b) => b.type === 'image')
  const text = body.slice(0, firstImage)

  // image followed by its caption paragraph
  const figures: { img: Extract<Block, { type: 'image' }>; caption?: Block }[] = []
  for (let i = firstImage; i < body.length; i++) {
    const b = body[i]
    if (b.type === 'image') {
      const next = body[i + 1]
      figures.push({ img: b, caption: next?.type === 'p' ? next : undefined })
      if (next?.type === 'p') i++
    }
  }

  return (
    <LessonLayout slug="bai-5" wide>
      <div className={styles.layout}>
        <div className={styles.text}>
          {text.map((b, i) => (
            <BlockView key={i} block={b} index={i} renderImage={noImage} />
          ))}
        </div>
        <div className={styles.figures}>
          {figures.map(({ img, caption }, i) => {
            const cap = caption?.type === 'p' ? <Inlines nodes={caption.c} /> : undefined
            const isInfographic = img.key.includes('infographic')
            return (
              <Figure
                key={img.key}
                imageKey={img.key}
                alt={i === 0 ? 'Ảnh chụp prompt gửi ChatGPT' : 'Infographic bí quyết học piano'}
                caption={cap}
                className={isInfographic ? styles.infographic : undefined}
                renderLightbox={isInfographic ? () => <ZoomViewer imageKey={img.key} alt="Infographic bí quyết học piano" /> : undefined}
              />
            )
          })}
        </div>
      </div>
    </LessonLayout>
  )
}

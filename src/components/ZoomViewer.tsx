import { motion } from 'motion/react'
import { useRef, useState, type WheelEvent } from 'react'
import { imageSize, imageUrl } from '../content/images'
import styles from './ZoomViewer.module.css'

const STEPS = [1, 1.5, 2, 3]

/** Pan & zoom viewer for tall images (used inside the lightbox). */
export function ZoomViewer({ imageKey, alt }: { imageKey: string; alt: string }) {
  const [i, setI] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const zoom = STEPS[i]
  const size = imageSize(imageKey)

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) setI((v) => Math.min(STEPS.length - 1, v + 1))
    else setI((v) => Math.max(0, v - 1))
  }

  return (
    <div className={styles.viewer}>
      <div ref={box} className={styles.box} data-zoom={zoom} onWheel={onWheel}>
        <motion.img
          className={styles.image}
          src={imageUrl(imageKey)}
          alt={alt}
          width={size.width}
          height={size.height}
          drag={zoom > 1}
          dragConstraints={box}
          dragElastic={0.08}
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          style={{ cursor: zoom > 1 ? 'grab' : 'zoom-in' }}
          onDoubleClick={() => setI((v) => (v === 0 ? 2 : 0))}
        />
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
          Thu nhỏ
        </button>
        <button type="button" onClick={() => setI(0)} disabled={i === 0}>
          Vừa màn hình
        </button>
        <button type="button" onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))} disabled={i === STEPS.length - 1}>
          Phóng to
        </button>
      </div>
    </div>
  )
}

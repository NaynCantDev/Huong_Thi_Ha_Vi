import { useCallback, useRef, useState, type ReactNode } from 'react'
import { imageSize, imageUrl } from '../content/images'
import { Lightbox } from './Lightbox'
import styles from './Figure.module.css'

type Props = {
  imageKey: string
  alt: string
  caption?: ReactNode
  className?: string
  /** Lightbox content override (e.g. a pan/zoom viewer). */
  renderLightbox?: () => ReactNode
  priority?: boolean
}

/** An image that opens in a lightbox. */
export function Figure({ imageKey, alt, caption, className, renderLightbox, priority }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const size = imageSize(imageKey)
  const close = useCallback(() => setOpen(false), [])

  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={`Phóng to ảnh${alt ? `: ${alt}` : ''}`}
      >
        <img
          src={imageUrl(imageKey)}
          alt={alt}
          width={size.width}
          height={size.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={styles.image}
          style={{ visibility: open ? 'hidden' : undefined }}
        />
        <span className={styles.zoom} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      <Lightbox
        open={open}
        onClose={close}
        imageKey={imageKey}
        alt={alt}
        caption={caption}
        returnFocusTo={triggerRef}
      >
        {renderLightbox?.()}
      </Lightbox>
    </figure>
  )
}

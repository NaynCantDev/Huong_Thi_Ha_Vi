import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { imageSize, imageUrl } from '../content/images'
import { getLenis } from '../hooks/useLenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Lightbox.module.css'

type Props = {
  open: boolean
  onClose: () => void
  imageKey: string
  alt: string
  caption?: ReactNode
  /** Element the image grows out of (FLIP from its on-page position). */
  returnFocusTo?: RefObject<HTMLElement | null>
  /** Extra content (e.g. zoom controls) rendered inside the stage instead of the plain image. */
  children?: ReactNode
}

export function Lightbox({ open, onClose, imageKey, alt, caption, returnFocusTo, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const trigger = returnFocusTo?.current

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prevOverflow
      lenis?.start()
      trigger?.focus()
    }
  }, [open, onClose, returnFocusTo])

  const size = imageSize(imageKey)
  const from = open && !reduce ? flipFrom(returnFocusTo?.current ?? null, size) : null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Ảnh phóng to'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Đóng">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className={styles.stage} onClick={(e) => e.target === e.currentTarget && onClose()}>
            {children ?? (
              <motion.img
                className={styles.image}
                src={imageUrl(imageKey)}
                alt={alt}
                width={size.width}
                height={size.height}
                initial={from ?? { opacity: 0, scale: reduce ? 1 : 0.94 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
            )}
          </div>
          {caption && <p className={styles.caption}>{caption}</p>}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Initial transform so the full-size image starts where its thumbnail is. */
function flipFrom(el: HTMLElement | null, size: { width: number; height: number }) {
  if (!el || typeof window === 'undefined') return null
  const r = el.getBoundingClientRect()
  if (!r.width) return null
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxW = vw * 0.92
  const maxH = vh * 0.8
  const scale = Math.min(maxW / size.width, maxH / size.height, 1)
  const finalW = size.width * scale
  return {
    x: r.left + r.width / 2 - vw / 2,
    y: r.top + r.height / 2 - vh / 2,
    scale: r.width / finalW,
    opacity: 1,
  }
}

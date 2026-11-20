import Lenis from 'lenis'
import { useEffect } from 'react'

let instance: Lenis | null = null

export function getLenis(): Lenis | null {
  return instance
}

/** Smooth scrolling, off when the visitor prefers reduced motion. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 0.9 })
    instance = lenis
    return () => {
      lenis.destroy()
      if (instance === lenis) instance = null
    }
  }, [enabled])
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

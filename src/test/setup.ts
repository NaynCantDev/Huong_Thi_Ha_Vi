import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'
import { installMatchMedia } from './media'

installMatchMedia()
// jsdom never paints, so finish every Motion animation instantly.
MotionGlobalConfig.skipAnimations = true

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
vi.stubGlobal('IntersectionObserver', NoopObserver)
vi.stubGlobal('ResizeObserver', NoopObserver)
window.scrollTo = (() => {}) as typeof window.scrollTo
Element.prototype.scrollIntoView = function () {}

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})

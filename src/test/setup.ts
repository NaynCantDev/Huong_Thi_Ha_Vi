import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { installMatchMedia } from './media'

installMatchMedia()

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

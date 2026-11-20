import { useSyncExternalStore } from 'react'

let flashing = false
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | undefined

function set(v: boolean) {
  flashing = v
  for (const l of listeners) l()
}

/** Light every key of the scale navigation for a moment (closing chord). */
export function flashScale(ms = 1400) {
  clearTimeout(timer)
  set(true)
  timer = setTimeout(() => set(false), ms)
}

export function useScaleFlash(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => flashing,
    () => false,
  )
}

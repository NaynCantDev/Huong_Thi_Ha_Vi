import { useCallback, useSyncExternalStore } from 'react'
import { isSoundOn, playChord, playNote, setSoundOn, subscribeSound } from './piano'

export function useSound() {
  const on = useSyncExternalStore(
    (cb) => subscribeSound(cb),
    isSoundOn,
    () => true,
  )
  const toggle = useCallback(() => setSoundOn(!isSoundOn()), [])
  return { on, toggle, play: playNote, chord: playChord }
}

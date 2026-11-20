/**
 * Small Web Audio piano. No samples: each note is a few harmonics with a
 * fast attack and an exponential decay, through a soft lowpass.
 * The AudioContext is created lazily on the first note (after a user gesture).
 */

const STORAGE_KEY = 'havi-sound'
const NOTE_INDEX: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** Harmonic partials: [frequency multiple, relative gain, oscillator type]. */
const PARTIALS: Array<[number, number, OscillatorType]> = [
  [1, 1, 'triangle'],
  [2, 0.32, 'sine'],
  [3, 0.12, 'sine'],
  [4.01, 0.05, 'sine'],
]

export function noteToMidi(note: string): number {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(note)
  if (!m) throw new Error(`Invalid note: ${note}`)
  const accidental = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0
  return (Number(m[3]) + 1) * 12 + NOTE_INDEX[m[1]] + accidental
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

// ---- mute state -----------------------------------------------------------

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

let soundOn = readStored()
const listeners = new Set<(on: boolean) => void>()

export function isSoundOn(): boolean {
  return soundOn
}

export function setSoundOn(on: boolean): void {
  soundOn = on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    /* storage unavailable: keep in memory */
  }
  for (const fn of listeners) fn(on)
}

export function subscribeSound(fn: (on: boolean) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// ---- engine ---------------------------------------------------------------

type Engine = { ctx: AudioContext; out: GainNode }
let engine: Engine | null = null

function getEngine(): Engine | null {
  if (engine) return engine
  const Ctor: typeof AudioContext | undefined =
    typeof window !== 'undefined'
      ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined
  if (!Ctor) return null
  const ctx = new Ctor()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.ratio.value = 4
  const out = ctx.createGain()
  out.gain.value = 0.32
  out.connect(comp)
  comp.connect(ctx.destination)
  engine = { ctx, out }
  return engine
}

export type NoteOptions = { velocity?: number; duration?: number; delay?: number }

export function playNote(note: string, opts: NoteOptions = {}): void {
  if (!soundOn) return
  const e = getEngine()
  if (!e) return
  const { ctx, out } = e
  if (ctx.state === 'suspended') void ctx.resume()

  const velocity = Math.min(1, Math.max(0.05, opts.velocity ?? 0.8))
  const duration = opts.duration ?? 1.8
  const t0 = ctx.currentTime + (opts.delay ?? 0)
  const freq = midiToFrequency(noteToMidi(note))

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  // brighter when struck harder, darker as it decays
  filter.frequency.setValueAtTime(1800 + 2200 * velocity, t0)
  filter.frequency.exponentialRampToValueAtTime(900, t0 + duration)
  filter.Q.value = 0.4

  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0.0001, t0)
  amp.gain.linearRampToValueAtTime(0.5 * velocity, t0 + 0.006)
  amp.gain.exponentialRampToValueAtTime(0.18 * velocity, t0 + 0.25)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  filter.connect(amp)
  amp.connect(out)

  for (const [mult, gain, type] of PARTIALS) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq * mult, t0)
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g)
    g.connect(filter)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
    osc.onended = () => {
      osc.disconnect()
      g.disconnect()
    }
  }
}

export function playChord(notes: string[], opts: { arpeggio?: number; velocity?: number; duration?: number } = {}): void {
  notes.forEach((n, i) =>
    playNote(n, { velocity: opts.velocity ?? 0.65, duration: opts.duration ?? 2.6, delay: (opts.arpeggio ?? 0) * i }),
  )
}

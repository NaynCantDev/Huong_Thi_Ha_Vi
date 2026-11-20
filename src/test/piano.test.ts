import { beforeEach, describe, expect, it, vi } from 'vitest'

class FakeParam {
  value = 0
  setValueAtTime = vi.fn()
  linearRampToValueAtTime = vi.fn()
  exponentialRampToValueAtTime = vi.fn()
  setTargetAtTime = vi.fn()
  cancelScheduledValues = vi.fn()
}
class FakeNode {
  connect = vi.fn(() => this)
  disconnect = vi.fn()
}
class FakeOsc extends FakeNode {
  type = 'sine'
  frequency = new FakeParam()
  detune = new FakeParam()
  start = vi.fn()
  stop = vi.fn()
  onended: (() => void) | null = null
}
const started: FakeOsc[] = []
const AudioCtor = vi.fn()
class FakeContext {
  currentTime = 0
  state = 'running'
  destination = new FakeNode()
  constructor() {
    AudioCtor()
  }
  resume = vi.fn(async () => {})
  createOscillator() {
    const o = new FakeOsc()
    o.start = vi.fn(() => {
      started.push(o)
    })
    return o
  }
  createGain() {
    return Object.assign(new FakeNode(), { gain: new FakeParam() })
  }
  createBiquadFilter() {
    return Object.assign(new FakeNode(), { type: 'lowpass', frequency: new FakeParam(), Q: new FakeParam() })
  }
  createDynamicsCompressor() {
    return Object.assign(new FakeNode(), {
      threshold: new FakeParam(),
      ratio: new FakeParam(),
      knee: new FakeParam(),
      attack: new FakeParam(),
      release: new FakeParam(),
    })
  }
}

async function freshPiano() {
  vi.resetModules()
  return import('../audio/piano')
}

beforeEach(() => {
  started.length = 0
  AudioCtor.mockClear()
  vi.stubGlobal('AudioContext', FakeContext)
})

describe('note math', () => {
  it('maps note names to midi numbers', async () => {
    const { noteToMidi } = await freshPiano()
    expect(noteToMidi('C4')).toBe(60)
    expect(noteToMidi('A4')).toBe(69)
    expect(noteToMidi('F#4')).toBe(66)
    expect(noteToMidi('D5')).toBe(74)
  })

  it('maps midi numbers to frequency', async () => {
    const { midiToFrequency } = await freshPiano()
    expect(midiToFrequency(69)).toBe(440)
    expect(midiToFrequency(60)).toBeCloseTo(261.63, 2)
  })

  it('rejects a malformed note', async () => {
    const { noteToMidi } = await freshPiano()
    expect(() => noteToMidi('H9')).toThrow()
  })
})

describe('audio context lifecycle', () => {
  it('creates no AudioContext before the first note', async () => {
    await freshPiano()
    expect(AudioCtor).not.toHaveBeenCalled()
  })

  it('creates exactly one AudioContext across several notes', async () => {
    const { playNote } = await freshPiano()
    playNote('C4')
    playNote('E4')
    expect(AudioCtor).toHaveBeenCalledTimes(1)
    expect(started.length).toBeGreaterThan(0)
  })

  it('plays every note of a chord', async () => {
    const { playChord, playNote } = await freshPiano()
    playNote('C4')
    const perNote = started.length
    started.length = 0
    playChord(['C4', 'E4', 'G4', 'C5'])
    expect(started.length).toBe(perNote * 4)
  })
})

describe('mute', () => {
  it('defaults to on when nothing is stored', async () => {
    const { isSoundOn } = await freshPiano()
    expect(isSoundOn()).toBe(true)
  })

  it('persists off and stays silent', async () => {
    const { setSoundOn, playNote, isSoundOn } = await freshPiano()
    setSoundOn(false)
    expect(localStorage.getItem('havi-sound')).toBe('off')
    playNote('C4')
    expect(started.length).toBe(0)
    expect(AudioCtor).not.toHaveBeenCalled()
    const again = await freshPiano()
    expect(again.isSoundOn()).toBe(false)
    expect(isSoundOn()).toBe(false)
  })

  it('notifies subscribers when toggled', async () => {
    const { setSoundOn, subscribeSound } = await freshPiano()
    const seen: boolean[] = []
    const off = subscribeSound((on) => seen.push(on))
    setSoundOn(false)
    setSoundOn(true)
    off()
    setSoundOn(false)
    expect(seen).toEqual([false, true])
  })
})

describe('user gesture gate', () => {
  it('stays silent and creates no context before any user activation', async () => {
    vi.stubGlobal('navigator', { ...navigator, userActivation: { hasBeenActive: false } })
    const { playNote } = await freshPiano()
    playNote('C4')
    expect(AudioCtor).not.toHaveBeenCalled()
    vi.stubGlobal('navigator', { ...navigator, userActivation: { hasBeenActive: true } })
    playNote('C4')
    expect(AudioCtor).toHaveBeenCalledTimes(1)
  })
})

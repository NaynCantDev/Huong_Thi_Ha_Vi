import { describe, expect, it } from 'vitest'
import { PAGES, getNeighbors, getPageByPath } from '../data/pages'

describe('page registry', () => {
  it('has the nine required pages in order', () => {
    expect(PAGES.map((p) => p.slug)).toEqual([
      'gioi-thieu',
      'du-an',
      'bai-1',
      'bai-2',
      'bai-3',
      'bai-4',
      'bai-5',
      'bai-6',
      'tong-ket',
    ])
  })

  it('assigns a rising scale, one note per page', () => {
    expect(PAGES.map((p) => p.note)).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'])
  })

  it('uses the agreed routes', () => {
    expect(PAGES.map((p) => p.path)).toEqual([
      '/',
      '/du-an',
      '/du-an/bai-1',
      '/du-an/bai-2',
      '/du-an/bai-3',
      '/du-an/bai-4',
      '/du-an/bai-5',
      '/du-an/bai-6',
      '/tong-ket',
    ])
  })

  it('finds a page by path, tolerating a trailing slash', () => {
    expect(getPageByPath('/du-an/bai-3')?.slug).toBe('bai-3')
    expect(getPageByPath('/du-an/bai-3/')?.slug).toBe('bai-3')
    expect(getPageByPath('/khong-co')).toBeUndefined()
  })

  it('links neighbours in reading order', () => {
    expect(getNeighbors('bai-1').prev?.slug).toBe('du-an')
    expect(getNeighbors('bai-1').next?.slug).toBe('bai-2')
    expect(getNeighbors('gioi-thieu').prev).toBeUndefined()
    expect(getNeighbors('tong-ket').next).toBeUndefined()
  })

  it('gives every page a description', () => {
    for (const p of PAGES) expect(p.description.length).toBeGreaterThan(20)
  })
})

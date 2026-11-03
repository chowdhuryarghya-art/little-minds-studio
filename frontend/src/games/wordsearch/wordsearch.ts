import type { AgeGroupId } from '../../data/ageGroups.ts'
import { createRandom, pick, randInt, shuffled } from '../../lib/random.ts'
import type { Random } from '../../lib/random.ts'
import { getTheme, WORD_POOLS } from './words.ts'
import type { ThemeId, WordEntry } from './words.ts'

export interface PlacedWord extends WordEntry {
  /** Cell numbers (row * size + column) of the first and last letter. */
  start: number
  end: number
}

export interface WordSearch {
  size: number
  /** size * size capital letters, row by row. */
  letters: string[]
  words: PlacedWord[]
}

/** [row step, column step] */
type Dir = readonly [number, number]
const RIGHT: Dir = [0, 1]
const DOWN: Dir = [1, 0]
const DOWN_RIGHT: Dir = [1, 1]
const UP_RIGHT: Dir = [-1, 1]
const ALL_DIRS: Dir[] = [RIGHT, DOWN, DOWN_RIGHT, UP_RIGHT, [0, -1], [-1, 0], [1, -1], [-1, -1]]

interface Spec {
  size: number
  count: number
  dirs: Dir[]
}

/** Older levels get bigger grids, more words, and words that run in more directions. */
const SPECS: Record<AgeGroupId, Spec> = {
  explorers: { size: 6, count: 4, dirs: [RIGHT, DOWN] },
  curious: { size: 8, count: 6, dirs: [RIGHT, DOWN, DOWN_RIGHT] },
  creative: { size: 10, count: 8, dirs: ALL_DIRS },
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const reversed = (s: string): string => [...s].reverse().join('')

/** Words that sit inside each other would be found twice, so never use both. */
function overlaps(a: string, b: string): boolean {
  return a.includes(b) || b.includes(a) || a.includes(reversed(b)) || reversed(b).includes(a)
}

function chooseWords(random: Random, pool: WordEntry[], spec: Spec): WordEntry[] {
  const chosen: WordEntry[] = []
  for (const entry of shuffled(random, pool)) {
    if (entry.word.length > spec.size) continue
    if (chosen.some((c) => overlaps(c.word, entry.word))) continue
    chosen.push(entry)
    if (chosen.length === spec.count) break
  }
  return chosen
}

/** Puts every word in the grid (letters may cross); null if one will not fit. */
function placeWords(random: Random, entries: WordEntry[], spec: Spec): { cells: string[]; words: PlacedWord[] } | null {
  const { size } = spec
  const cells: string[] = new Array<string>(size * size).fill('')
  const words: PlacedWord[] = []
  for (const entry of [...entries].sort((a, b) => b.word.length - a.word.length)) {
    const len = entry.word.length
    let done = false
    for (let attempt = 0; attempt < 300 && !done; attempt++) {
      const [dr, dc] = pick(random, spec.dirs)
      const r0 = randInt(random, 0, size - 1)
      const c0 = randInt(random, 0, size - 1)
      const r1 = r0 + dr * (len - 1)
      const c1 = c0 + dc * (len - 1)
      if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue
      let fits = true
      for (let k = 0; k < len && fits; k++) {
        const existing = cells[(r0 + dr * k) * size + c0 + dc * k]
        fits = existing === '' || existing === entry.word[k]
      }
      if (!fits) continue
      for (let k = 0; k < len; k++) cells[(r0 + dr * k) * size + c0 + dc * k] = entry.word[k]
      words.push({ ...entry, start: r0 * size + c0, end: r1 * size + c1 })
      done = true
    }
    if (!done) return null
  }
  return { cells, words }
}

/** How many times a word can be read in the grid, in any of the 8 directions. */
export function countOccurrences(letters: string[], size: number, word: string): number {
  let found = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const [dr, dc] of ALL_DIRS) {
        let k = 0
        while (k < word.length) {
          const rr = r + dr * k
          const cc = c + dc * k
          if (rr < 0 || rr >= size || cc < 0 || cc >= size || letters[rr * size + cc] !== word[k]) break
          k++
        }
        if (k === word.length) found++
      }
    }
  }
  return found
}

/**
 * Builds a word search from a puzzle number: the same number and age group
 * always give the same puzzle. Filler letters are re-drawn until every word
 * appears exactly once, so each word has a single right answer.
 */
export function generateWordSearch(seed: number, age: AgeGroupId, theme?: ThemeId): WordSearch {
  const random = createRandom(seed)
  const spec = SPECS[age]
  let last: WordSearch | null = null

  for (let attempt = 0; attempt < 30; attempt++) {
    const pool = theme ? getTheme(theme).words[age] : WORD_POOLS[age]
    const placed = placeWords(random, chooseWords(random, pool, spec), spec)
    if (!placed) continue
    for (let fill = 0; fill < 20; fill++) {
      const letters = placed.cells.map((cell) => cell || LETTERS[randInt(random, 0, 25)])
      last = { size: spec.size, letters, words: placed.words }
      if (placed.words.every((w) => countOccurrences(letters, spec.size, w.word) === 1)) return last
    }
  }
  // Practically unreachable; a playable (if slightly ambiguous) puzzle beats a crash.
  if (last) return last
  const letters = new Array<string>(spec.size * spec.size).fill('A')
  return { size: spec.size, letters, words: [] }
}

/** Cells on the straight line from a to b (inclusive), or null if it is not a straight line. */
export function lineBetween(size: number, a: number, b: number): number[] | null {
  if (a === b) return null
  const dr = Math.floor(b / size) - Math.floor(a / size)
  const dc = (b % size) - (a % size)
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null
  const steps = Math.max(Math.abs(dr), Math.abs(dc))
  const cells: number[] = []
  for (let k = 0; k <= steps; k++) cells.push(a + (Math.sign(dr) * size + Math.sign(dc)) * k)
  return cells
}

/** Which word starts at one tapped cell and ends at the other (either order); -1 if none. */
export function findWord(puzzle: WordSearch, a: number, b: number): number {
  return puzzle.words.findIndex((w) => (w.start === a && w.end === b) || (w.start === b && w.end === a))
}

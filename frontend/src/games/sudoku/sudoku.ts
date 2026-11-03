import { shuffled } from '../../lib/random.ts'
import type { Random } from '../../lib/random.ts'

export type SudokuDifficulty = 'easy' | 'medium' | 'hard'

export interface SudokuPuzzle {
  puzzle: number[]
  solution: number[]
}

const HOLES: Record<SudokuDifficulty, number> = {
  easy: 34,
  medium: 43,
  hard: 49,
}

const FULL_MASK = (1 << 9) - 1

function boxIndex(row: number, column: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3)
}

function countSolutions(source: number[], limit: number): number {
  const grid = [...source]
  const rows = Array<number>(9).fill(0)
  const columns = Array<number>(9).fill(0)
  const boxes = Array<number>(9).fill(0)

  for (let index = 0; index < 81; index++) {
    const digit = grid[index]
    if (digit === 0) continue
    const row = Math.floor(index / 9)
    const column = index % 9
    const box = boxIndex(row, column)
    const mask = 1 << (digit - 1)
    if ((rows[row] & mask) || (columns[column] & mask) || (boxes[box] & mask)) return 0
    rows[row] |= mask
    columns[column] |= mask
    boxes[box] |= mask
  }

  const search = (): number => {
    let bestIndex = -1
    let bestCandidates = 0
    let bestCount = 10

    for (let index = 0; index < 81; index++) {
      if (grid[index] !== 0) continue
      const row = Math.floor(index / 9)
      const column = index % 9
      const candidates = FULL_MASK & ~(rows[row] | columns[column] | boxes[boxIndex(row, column)])
      const candidateCount = bitCount(candidates)
      if (candidateCount === 0) return 0
      if (candidateCount < bestCount) {
        bestIndex = index
        bestCandidates = candidates
        bestCount = candidateCount
        if (candidateCount === 1) break
      }
    }

    if (bestIndex === -1) return 1
    const row = Math.floor(bestIndex / 9)
    const column = bestIndex % 9
    const box = boxIndex(row, column)
    let solutions = 0
    for (let bit = 1; bit <= FULL_MASK; bit <<= 1) {
      if (!(bestCandidates & bit)) continue
      grid[bestIndex] = Math.log2(bit) + 1
      rows[row] |= bit
      columns[column] |= bit
      boxes[box] |= bit
      solutions += search()
      grid[bestIndex] = 0
      rows[row] &= ~bit
      columns[column] &= ~bit
      boxes[box] &= ~bit
      if (solutions >= limit) return solutions
    }
    return solutions
  }

  return search()
}

function bitCount(value: number): number {
  let count = 0
  while (value) {
    value &= value - 1
    count++
  }
  return count
}

function makeSolution(random: Random): number[] {
  const bands = shuffled(random, [0, 1, 2])
  const rows = bands.flatMap((band) =>
    shuffled(random, [0, 1, 2]).map((offset) => band * 3 + offset),
  )
  const stacks = shuffled(random, [0, 1, 2])
  const columns = stacks.flatMap((stack) =>
    shuffled(random, [0, 1, 2]).map((offset) => stack * 3 + offset),
  )
  const digits = shuffled(random, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  return rows.flatMap((row) =>
    columns.map((column) => digits[(row * 3 + Math.floor(row / 3) + column) % 9]),
  )
}

export function generateSudoku(
  difficulty: SudokuDifficulty,
  random: Random = Math.random,
): SudokuPuzzle {
  const solution = makeSolution(random)
  const puzzle = [...solution]
  let removed = 0

  for (const index of shuffled(random, Array.from({ length: 81 }, (_, i) => i))) {
    if (removed >= HOLES[difficulty]) break
    const value = puzzle[index]
    puzzle[index] = 0
    if (countSolutions(puzzle, 2) === 1) {
      removed++
    } else {
      puzzle[index] = value
    }
  }

  return { puzzle, solution }
}

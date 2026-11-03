import type { AgeGroupId } from '../../data/ageGroups.ts'

export type Dir = 'N' | 'E' | 'S' | 'W'

export interface Cell {
  /** Open passages from this cell. */
  open: Record<Dir, boolean>
}

export interface Maze {
  size: number
  cells: Cell[] // row-major, size * size
}

export const MAZE_SIZE: Record<AgeGroupId, number> = { explorers: 5, curious: 8, creative: 12 }

const DELTA: Record<Dir, [number, number]> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }
export const OPPOSITE: Record<Dir, Dir> = { N: 'S', E: 'W', S: 'N', W: 'E' }
const DIRS: Dir[] = ['N', 'E', 'S', 'W']

type Random = () => number

export function generateMaze(size: number, random: Random = Math.random): Maze {
  const cells: Cell[] = Array.from({ length: size * size }, () => ({
    open: { N: false, E: false, S: false, W: false },
  }))
  const visited = new Array<boolean>(size * size).fill(false)
  const stack: number[] = [0]
  visited[0] = true

  while (stack.length > 0) {
    const index = stack[stack.length - 1]
    const x = index % size
    const y = Math.floor(index / size)
    const options = DIRS.filter((d) => {
      const nx = x + DELTA[d][0]
      const ny = y + DELTA[d][1]
      return nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[ny * size + nx]
    })
    if (options.length === 0) {
      stack.pop()
      continue
    }
    const dir = options[Math.floor(random() * options.length)]
    const next = (y + DELTA[dir][1]) * size + (x + DELTA[dir][0])
    cells[index].open[dir] = true
    cells[next].open[OPPOSITE[dir]] = true
    visited[next] = true
    stack.push(next)
  }
  return { size, cells }
}

/** Index after trying to move; unchanged if a wall blocks the way. */
export function move(maze: Maze, index: number, dir: Dir): number {
  if (!maze.cells[index].open[dir]) return index
  const x = index % maze.size
  const y = Math.floor(index / maze.size)
  return (y + DELTA[dir][1]) * maze.size + (x + DELTA[dir][0])
}

export function goalIndex(maze: Maze): number {
  return maze.size * maze.size - 1
}

/** Breadth-first search: can the goal be reached from the start? */
export function isSolvable(maze: Maze): boolean {
  const seen = new Set<number>([0])
  const queue = [0]
  while (queue.length > 0) {
    const i = queue.shift()!
    if (i === goalIndex(maze)) return true
    for (const d of DIRS) {
      const n = move(maze, i, d)
      if (!seen.has(n)) {
        seen.add(n)
        queue.push(n)
      }
    }
  }
  return false
}

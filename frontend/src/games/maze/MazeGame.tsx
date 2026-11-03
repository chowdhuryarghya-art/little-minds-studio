import { useCallback, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import { createRandom } from '../../lib/random.ts'
import { generateMaze, goalIndex, MAZE_SIZE, move } from './maze.ts'
import type { Dir } from './maze.ts'

const CELL = 40
const KEY_TO_DIR: Record<string, Dir> = {
  ArrowUp: 'N',
  ArrowRight: 'E',
  ArrowDown: 'S',
  ArrowLeft: 'W',
}

/** The same seed and age group always give the same maze. */
export default function MazeGame({ age, seed }: { age: AgeGroupId; seed: number }) {
  const [maze] = useState(() => generateMaze(MAZE_SIZE[age], createRandom(seed)))
  const [position, setPosition] = useState(0)
  const [steps, setSteps] = useState(0)

  const goal = goalIndex(maze)
  const won = position === goal
  const px = maze.size * CELL

  const go = useCallback(
    (dir: Dir) => {
      if (won) return
      const next = move(maze, position, dir)
      if (next !== position) {
        setPosition(next)
        setSteps((s) => s + 1)
      }
    },
    [maze, position, won],
  )

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const dir = KEY_TO_DIR[e.key]
      if (!dir) return
      e.preventDefault()
      go(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const walls: ReactElement[] = []
  maze.cells.forEach((cell, i) => {
    const x = (i % maze.size) * CELL
    const y = Math.floor(i / maze.size) * CELL
    if (!cell.open.N) walls.push(<line key={`${i}n`} x1={x} y1={y} x2={x + CELL} y2={y} />)
    if (!cell.open.W) walls.push(<line key={`${i}w`} x1={x} y1={y} x2={x} y2={y + CELL} />)
    if (i % maze.size === maze.size - 1 && !cell.open.E)
      walls.push(<line key={`${i}e`} x1={x + CELL} y1={y} x2={x + CELL} y2={y + CELL} />)
    if (Math.floor(i / maze.size) === maze.size - 1 && !cell.open.S)
      walls.push(<line key={`${i}s`} x1={x} y1={y + CELL} x2={x + CELL} y2={y + CELL} />)
  })

  const center = (i: number): [number, number] => [
    (i % maze.size) * CELL + CELL / 2,
    Math.floor(i / maze.size) * CELL + CELL / 2,
  ]
  const [cx, cy] = center(position)
  const [gx, gy] = center(goal)

  return (
    <div className="maze-game">
      <p className="center muted">Steps: {steps}</p>
      <svg
        className="maze-svg"
        viewBox={`-4 -4 ${px + 8} ${px + 8}`}
        role="img"
        aria-label={`Maze. Find your way from the top left to the star at the bottom right. You are at row ${Math.floor(position / maze.size) + 1}, column ${(position % maze.size) + 1}.`}
      >
        <rect x={0} y={0} width={px} height={px} fill="#fff" />
        <text x={gx} y={gy} className="maze-emoji">
          ⭐
        </text>
        <text x={cx} y={cy} className="maze-emoji">
          🐭
        </text>
        <g className="maze-walls">{walls}</g>
      </svg>

      {won ? (
        <p className="celebrate" role="status">
          🎉 You made it in {steps} steps!
        </p>
      ) : (
        <div className="dpad" role="group" aria-label="Move">
          <button type="button" className="tool dpad-n" aria-label="Up" onClick={() => go('N')}>
            ▲
          </button>
          <button type="button" className="tool dpad-w" aria-label="Left" onClick={() => go('W')}>
            ◀
          </button>
          <button type="button" className="tool dpad-e" aria-label="Right" onClick={() => go('E')}>
            ▶
          </button>
          <button type="button" className="tool dpad-s" aria-label="Down" onClick={() => go('S')}>
            ▼
          </button>
        </div>
      )}
    </div>
  )
}

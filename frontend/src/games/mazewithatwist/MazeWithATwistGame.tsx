import { useCallback, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { generateMaze, move, OPPOSITE } from '../maze/maze.ts'
import type { Dir, Maze } from '../maze/maze.ts'

const SIZE = 7
const CELL = 40
const DIRECTIONS: Dir[] = ['N', 'E', 'S', 'W']
const DELTAS: Record<Dir, [number, number]> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
}
const KEY_TO_DIR: Record<string, Dir> = {
  ArrowUp: 'N',
  ArrowRight: 'E',
  ArrowDown: 'S',
  ArrowLeft: 'W',
}

type TwistMaze = {
  maze: Maze
  keyAt: number
  gateFrom: number
  gateTo: number
}

function createTwistMaze(): TwistMaze {
  const maze = generateMaze(SIZE)
  const goal = maze.cells.length - 1
  const previous = new Array<number>(maze.cells.length).fill(-1)
  const queue = [0]
  previous[0] = 0

  for (let cursor = 0; cursor < queue.length && previous[goal] === -1; cursor += 1) {
    const current = queue[cursor]
    for (const direction of DIRECTIONS) {
      const next = move(maze, current, direction)
      if (next !== current && previous[next] === -1) {
        previous[next] = current
        queue.push(next)
      }
    }
  }

  const path = [goal]
  while (path[0] !== 0) path.unshift(previous[path[0]])

  const gateIndex = Math.max(2, Math.min(path.length - 2, Math.floor(path.length * 0.65)))
  const gateFrom = path[gateIndex]
  const gateTo = path[gateIndex + 1]
  const gateDirection = DIRECTIONS.find((direction) => move(maze, gateFrom, direction) === gateTo)
  if (!gateDirection) throw new Error('Could not place the maze gate on the solution path.')

  maze.cells[gateFrom].open[gateDirection] = false
  maze.cells[gateTo].open[OPPOSITE[gateDirection]] = false

  return {
    maze,
    gateFrom,
    gateTo,
    keyAt: path[Math.max(1, Math.floor(gateIndex / 2))],
  }
}

function directionBetween(from: number, to: number): Dir | undefined {
  return DIRECTIONS.find((direction) => {
    const [dx, dy] = DELTAS[direction]
    const x = from % SIZE
    const y = Math.floor(from / SIZE)
    return (y + dy) * SIZE + (x + dx) === to
  })
}

export default function MazeWithATwistGame() {
  const [map, setMap] = useState(createTwistMaze)
  const [position, setPosition] = useState(0)
  const [hasKey, setHasKey] = useState(false)
  const [steps, setSteps] = useState(0)
  const goal = SIZE * SIZE - 1
  const won = position === goal
  const pixelSize = SIZE * CELL

  const go = useCallback((direction: Dir) => {
    if (won) return
    const [dx, dy] = DELTAS[direction]
    const x = position % SIZE
    const y = Math.floor(position / SIZE)
    const intendedNext = (y + dy) * SIZE + x + dx
    const crossingGate = (position === map.gateFrom && intendedNext === map.gateTo)
      || (position === map.gateTo && intendedNext === map.gateFrom)
    if (crossingGate && !hasKey) return

    const next = crossingGate ? intendedNext : move(map.maze, position, direction)
    if (next === position) return
    setPosition(next)
    setSteps((current) => current + 1)
    if (next === map.keyAt) setHasKey(true)
  }, [hasKey, map, position, won])

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const direction = KEY_TO_DIR[event.key]
      if (!direction) return
      event.preventDefault()
      go(direction)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const walls: ReactElement[] = []
  map.maze.cells.forEach((cell, index) => {
    const x = (index % SIZE) * CELL
    const y = Math.floor(index / SIZE) * CELL
    const addWall = (direction: Dir, x1: number, y1: number, x2: number, y2: number) => {
      if (!cell.open[direction]) {
        const isGate = (index === map.gateFrom && directionBetween(index, map.gateTo) === direction)
          || (index === map.gateTo && directionBetween(index, map.gateFrom) === direction)
        if (isGate && hasKey) return
        walls.push(
          <line
            key={`${index}-${direction}`}
            className={isGate ? 'maze-gate' : undefined}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />,
        )
      }
    }
    addWall('N', x, y, x + CELL, y)
    addWall('W', x, y, x, y + CELL)
    if (index % SIZE === SIZE - 1) addWall('E', x + CELL, y, x + CELL, y + CELL)
    if (Math.floor(index / SIZE) === SIZE - 1) addWall('S', x, y + CELL, x + CELL, y + CELL)
  })

  const center = (index: number): [number, number] => [
    (index % SIZE) * CELL + CELL / 2,
    Math.floor(index / SIZE) * CELL + CELL / 2,
  ]
  const [playerX, playerY] = center(position)
  const [goalX, goalY] = center(goal)
  const [keyX, keyY] = center(map.keyAt)

  const startNewMaze = () => {
    setMap(createTwistMaze())
    setPosition(0)
    setHasKey(false)
    setSteps(0)
  }

  return (
    <div className="maze-game">
      <p className="center muted">{hasKey ? '🔑 Key found! Head for the gate and star.' : 'Find the key to unlock the gate.'} · Steps: {steps}</p>
      <svg
        className="maze-svg"
        viewBox={`-4 -4 ${pixelSize + 8} ${pixelSize + 8}`}
        role="img"
        aria-label={`Seven by seven maze. Find the key, then reach the star. You are at row ${Math.floor(position / SIZE) + 1}, column ${(position % SIZE) + 1}. ${hasKey ? 'You have the key.' : 'You do not have the key yet.'}`}
      >
        <rect x={0} y={0} width={pixelSize} height={pixelSize} fill="#fff" />
        {!hasKey && position !== map.keyAt && <text x={keyX} y={keyY} className="maze-emoji">🔑</text>}
        <text x={goalX} y={goalY} className="maze-emoji">⭐</text>
        <text x={playerX} y={playerY} className="maze-emoji">🐭</text>
        <g className="maze-walls">{walls}</g>
      </svg>
      {won ? (
        <p className="celebrate center" role="status">🎉 You found the key and made it to the star in {steps} steps!</p>
      ) : (
        <div className="dpad" role="group" aria-label="Move through the maze">
          <button type="button" className="tool dpad-n" aria-label="Up" onClick={() => go('N')}>▲</button>
          <button type="button" className="tool dpad-w" aria-label="Left" onClick={() => go('W')}>◀</button>
          <button type="button" className="tool dpad-e" aria-label="Right" onClick={() => go('E')}>▶</button>
          <button type="button" className="tool dpad-s" aria-label="Down" onClick={() => go('S')}>▼</button>
        </div>
      )}
      <p className="center">
        <button type="button" className="tool" onClick={startNewMaze}>New maze</button>
      </p>
    </div>
  )
}

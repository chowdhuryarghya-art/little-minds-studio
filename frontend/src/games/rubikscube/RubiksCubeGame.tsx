import { useState } from 'react'

type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B'
type Vector = [number, number, number]
type Stickers = Partial<Record<Face, string>>
type Cubie = { id: string; position: Vector; stickers: Stickers }
type Turn = { face: Face; clockwise: boolean }

const CUBELET_SIZE = 52
const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']
const NORMALS: Record<Face, Vector> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  L: [-1, 0, 0],
  R: [1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
}
const COLORS: Record<Face, string> = {
  U: '#f7f7f2',
  D: '#ffd43b',
  L: '#ef5350',
  R: '#ff8b38',
  F: '#35b86b',
  B: '#4387ec',
}
const ROTATION: Record<Face, { axis: 0 | 1 | 2; side: number }> = {
  R: { axis: 0, side: 1 },
  L: { axis: 0, side: -1 },
  U: { axis: 1, side: 1 },
  D: { axis: 1, side: -1 },
  F: { axis: 2, side: 1 },
  B: { axis: 2, side: -1 },
}

function createSolvedCube(): Cubie[] {
  const cubies: Cubie[] = []
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const stickers: Stickers = {}
        if (y === 1) stickers.U = COLORS.U
        if (y === -1) stickers.D = COLORS.D
        if (x === -1) stickers.L = COLORS.L
        if (x === 1) stickers.R = COLORS.R
        if (z === 1) stickers.F = COLORS.F
        if (z === -1) stickers.B = COLORS.B
        cubies.push({ id: `${x},${y},${z}`, position: [x, y, z], stickers })
      }
    }
  }
  return cubies
}

function rotateVector(vector: Vector, axis: number, direction: number): Vector {
  const [x, y, z] = vector
  if (axis === 0) return direction > 0 ? [x, -z, y] : [x, z, -y]
  if (axis === 1) return direction > 0 ? [z, y, -x] : [-z, y, x]
  return direction > 0 ? [-y, x, z] : [y, -x, z]
}

function faceFromNormal(normal: Vector): Face {
  const entry = Object.entries(NORMALS).find(([, candidate]) =>
    candidate.every((value, index) => value === normal[index]),
  )
  if (!entry) throw new Error('A cube face rotated to an invalid orientation.')
  return entry[0] as Face
}

function rotateCube(cubies: Cubie[], turn: Turn): Cubie[] {
  const { axis, side } = ROTATION[turn.face]
  const direction = turn.clockwise ? -side : side
  return cubies.map((cubie) => {
    if (cubie.position[axis] !== side) return cubie
    const position = rotateVector(cubie.position, axis, direction)
    const stickers: Stickers = {}
    FACES.forEach((face) => {
      const color = cubie.stickers[face]
      if (!color) return
      const nextNormal = rotateVector(NORMALS[face], axis, direction)
      stickers[faceFromNormal(nextNormal)] = color
    })
    return { ...cubie, position, stickers }
  })
}

function isSolved(cubies: Cubie[]): boolean {
  return cubies.every((cubie) => FACES.every((face) => {
    const normal = NORMALS[face]
    const isOutside = normal.some((component, axis) => component !== 0 && cubie.position[axis] === component)
    return !isOutside || cubie.stickers[face] === COLORS[face]
  }))
}

function scrambleCube(): { cubies: Cubie[]; moves: Turn[] } {
  let cubies = createSolvedCube()
  const moves: Turn[] = []
  for (let index = 0; index < 22; index += 1) {
    const face = FACES[Math.floor(Math.random() * FACES.length)]
    const clockwise = Math.random() < 0.5
    const previous = moves[moves.length - 1]
    if (previous?.face === face && previous.clockwise !== clockwise) {
      index -= 1
      continue
    }
    const turn = { face, clockwise }
    cubies = rotateCube(cubies, turn)
    moves.push(turn)
  }
  return { cubies, moves }
}

function cubieTransform(cubie: Cubie): string {
  const [x, y, z] = cubie.position
  return `translate3d(${(x + 1) * CUBELET_SIZE}px, ${(1 - y) * CUBELET_SIZE}px, ${z * CUBELET_SIZE}px)`
}

export default function RubiksCubeGame() {
  const [cube, setCube] = useState(createSolvedCube)
  const [history, setHistory] = useState<Cubie[][]>([])
  const [scramble, setScramble] = useState<Turn[]>([])
  const solved = isSolved(cube)

  const turn = (face: Face, clockwise: boolean) => {
    const next = rotateCube(cube, { face, clockwise })
    setHistory((current) => [...current, cube])
    setCube(next)
  }

  const scrambleGame = () => {
    const next = scrambleCube()
    setCube(next.cubies)
    setHistory([])
    setScramble(next.moves)
  }

  const reset = () => {
    setCube(createSolvedCube())
    setHistory([])
    setScramble([])
  }

  const undo = () => {
    const previous = history[history.length - 1]
    if (!previous) return
    setCube(previous)
    setHistory((current) => current.slice(0, -1))
  }

  return (
    <div className="rubiks-game">
      <p className="center muted">Turn a face clockwise or counterclockwise. Line up every color to solve the cube!</p>
      <div className="rubik-stage" role="img" aria-label={solved ? 'Solved 3D Rubik’s Cube' : '3D Rubik’s Cube'}>
        <div className="rubik-cube">
          {cube.map((cubie) => (
            <div key={cubie.id} className="rubik-cubie" style={{ transform: cubieTransform(cubie) }}>
              {FACES.map((face) => cubie.stickers[face] && (
                <span
                  key={face}
                  className={`rubik-sticker face-${face.toLowerCase()}`}
                  style={{ backgroundColor: cubie.stickers[face] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="center rubik-scramble-note" role="status" aria-live="polite">
        {solved ? 'Cube solved! Nice work!' : scramble.length ? `Scramble: ${scramble.length} face turns. Can you solve it?` : 'Start with a solved cube, or scramble it for a challenge.'}
      </p>
      <div className="rubik-controls" role="group" aria-label="Turn a cube face">
        {FACES.map((face) => (
          <div className="rubik-face-controls" key={face} aria-label={`${face} face`}>
            <button type="button" className="tool" aria-label={`Turn ${face} clockwise`} onClick={() => turn(face, true)}>{face}</button>
            <button type="button" className="tool rubik-inverse" aria-label={`Turn ${face} counterclockwise`} onClick={() => turn(face, false)}>{face}&apos;</button>
          </div>
        ))}
      </div>
      <div className="brain-game-actions">
        <button type="button" className="tool" onClick={scrambleGame}>Scramble</button>
        <button type="button" className="tool" onClick={undo} disabled={!history.length}>Undo move</button>
        <button type="button" className="tool" onClick={reset}>Reset cube</button>
      </div>
      <p className="center muted rubik-key">Each face control turns one layer by a quarter turn. The apostrophe (&apos;) means counterclockwise.</p>
    </div>
  )
}

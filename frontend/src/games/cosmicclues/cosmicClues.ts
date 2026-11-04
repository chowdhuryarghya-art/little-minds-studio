export type CosmicClue = {
  text: string
  possibleSectors: number[]
  kind: string
}

export type CosmicDifficulty = 'easy' | 'medium' | 'hard'

export type CosmicPuzzle = {
  targetSector: number
  gridSize: number
  clues: CosmicClue[]
}

export const COSMIC_DIFFICULTIES: {
  id: CosmicDifficulty
  label: string
  gridSize: number
}[] = [
  { id: 'easy', label: 'Easy · 4×4', gridSize: 4 },
  { id: 'medium', label: 'Medium · 5×5', gridSize: 5 },
  { id: 'hard', label: 'Hard · 6×6', gridSize: 6 },
]

const MINIMUM_CLUES: Record<CosmicDifficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
}

function getRow(sector: number, gridSize: number): number {
  return Math.floor((sector - 1) / gridSize)
}

function getColumn(sector: number, gridSize: number): number {
  return (sector - 1) % gridSize
}

function sectorsInMap(gridSize: number): number[] {
  return Array.from({ length: gridSize * gridSize }, (_, index) => index + 1)
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function makeClue(
  gridSize: number,
  kind: string,
  text: string,
  matches: (sector: number) => boolean,
): CosmicClue {
  return {
    kind,
    text,
    possibleSectors: sectorsInMap(gridSize).filter(matches),
  }
}

function createClueOptions(targetSector: number, gridSize: number): CosmicClue[] {
  const targetRow = getRow(targetSector, gridSize)
  const targetColumn = getColumn(targetSector, gridSize)
  const isEven = targetSector % 2 === 0
  const halfBoundary = Math.floor(gridSize / 2)
  const isTopHalf = targetRow < halfBoundary
  const isLeftHalf = targetColumn < halfBoundary
  const quadrant = `${isTopHalf ? 'top' : 'bottom'}-${isLeftHalf ? 'left' : 'right'}`
  const isOnEdge = targetRow === 0 || targetRow === gridSize - 1 || targetColumn === 0 || targetColumn === gridSize - 1
  const sectors = sectorsInMap(gridSize)
  const clues = [
    makeClue(
      gridSize,
      'row',
      `Planet X is in row ${targetRow + 1} from the top.`,
      (sector) => getRow(sector, gridSize) === targetRow,
    ),
    makeClue(
      gridSize,
      'column',
      `Planet X is in column ${targetColumn + 1} from the left.`,
      (sector) => getColumn(sector, gridSize) === targetColumn,
    ),
    makeClue(
      gridSize,
      'parity',
      `Planet X is in an ${isEven ? 'even' : 'odd'}-numbered sector.`,
      (sector) => sector % 2 === (isEven ? 0 : 1),
    ),
    makeClue(
      gridSize,
      'quadrant',
      `Planet X is in the ${quadrant} part of the map.`,
      (sector) => (getRow(sector, gridSize) < halfBoundary) === isTopHalf
        && (getColumn(sector, gridSize) < halfBoundary) === isLeftHalf,
    ),
    makeClue(
      gridSize,
      'horizontal-half',
      `Planet X is in the ${isTopHalf ? 'top' : 'bottom'} half of the map.`,
      (sector) => (getRow(sector, gridSize) < halfBoundary) === isTopHalf,
    ),
    makeClue(
      gridSize,
      'vertical-half',
      `Planet X is in the ${isLeftHalf ? 'left' : 'right'} half of the map.`,
      (sector) => (getColumn(sector, gridSize) < halfBoundary) === isLeftHalf,
    ),
    makeClue(
      gridSize,
      'edge',
      `Planet X is ${isOnEdge ? 'on the outer edge' : 'inside the outer edge'} of the map.`,
      (sector) => {
        const row = getRow(sector, gridSize)
        const column = getColumn(sector, gridSize)
        const isEdge = row === 0 || row === gridSize - 1 || column === 0 || column === gridSize - 1
        return isEdge === isOnEdge
      },
    ),
    makeClue(
      gridSize,
      'main-diagonal',
      `Planet X is ${targetRow === targetColumn ? 'on' : 'not on'} the diagonal from top-left to bottom-right.`,
      (sector) => (getRow(sector, gridSize) === getColumn(sector, gridSize)) === (targetRow === targetColumn),
    ),
    makeClue(
      gridSize,
      'other-diagonal',
      `Planet X is ${targetRow + targetColumn === gridSize - 1 ? 'on' : 'not on'} the diagonal from top-right to bottom-left.`,
      (sector) => (getRow(sector, gridSize) + getColumn(sector, gridSize) === gridSize - 1)
        === (targetRow + targetColumn === gridSize - 1),
    ),
  ]

  for (const beaconSector of sectors) {
    const beaconRow = getRow(beaconSector, gridSize)
    const beaconColumn = getColumn(beaconSector, gridSize)
    const rowDistance = Math.abs(targetRow - beaconRow)
    const columnDistance = Math.abs(targetColumn - beaconColumn)
    if (beaconSector === targetSector || rowDistance > 1 || columnDistance > 1) continue

    clues.push(
      makeClue(
        gridSize,
        'beacon',
        `Planet X is beside radio beacon ${beaconSector}. Diagonal sectors count as beside.`,
        (sector) => {
          const rowDistanceFromBeacon = Math.abs(getRow(sector, gridSize) - beaconRow)
          const columnDistanceFromBeacon = Math.abs(getColumn(sector, gridSize) - beaconColumn)
          return sector !== beaconSector && rowDistanceFromBeacon <= 1 && columnDistanceFromBeacon <= 1
        },
      ),
    )
  }

  return clues
}

function findClueSequence(
  options: CosmicClue[],
  remaining: number[],
  minimumClues: number,
  maximumClues: number,
  chosen: CosmicClue[] = [],
  usedKinds: Set<string> = new Set(),
): CosmicClue[] | null {
  if (remaining.length === 1 && chosen.length >= minimumClues) return chosen
  if (chosen.length >= maximumClues || remaining.length === 1) return null

  const usefulClues = shuffle(options).filter((clue) => {
    if (usedKinds.has(clue.kind)) return false
    const narrowed = remaining.filter((sector) => clue.possibleSectors.includes(sector))
    return narrowed.length > 0 && narrowed.length < remaining.length
  })

  for (const clue of usefulClues) {
    const narrowed = remaining.filter((sector) => clue.possibleSectors.includes(sector))
    const nextKinds = new Set(usedKinds)
    nextKinds.add(clue.kind)
    const sequence = findClueSequence(
      options,
      narrowed,
      minimumClues,
      maximumClues,
      [...chosen, clue],
      nextKinds,
    )
    if (sequence) return sequence
  }

  return null
}

export function createCosmicPuzzle(difficulty: CosmicDifficulty = 'easy'): CosmicPuzzle {
  const level = COSMIC_DIFFICULTIES.find((option) => option.id === difficulty)
  if (!level) throw new Error(`Unknown Cosmic Clue Hunt difficulty: ${difficulty}.`)
  const { gridSize } = level
  const targetSector = Math.floor(Math.random() * gridSize * gridSize) + 1
  const options = createClueOptions(targetSector, gridSize)
  const minimumClues = MINIMUM_CLUES[difficulty]
  const clues = findClueSequence(
    options,
    sectorsInMap(gridSize),
    minimumClues,
    minimumClues + 1,
  )

  if (!clues) throw new Error(`Could not generate a unique ${difficulty} space puzzle.`)

  return { targetSector, gridSize, clues }
}

export function findPossibleSectors(clues: CosmicClue[], gridSize: number): number[] {
  return sectorsInMap(gridSize).filter((sector) =>
    clues.every((clue) => clue.possibleSectors.includes(sector)),
  )
}

export type CosmicClue = {
  text: string
  possibleSectors: number[]
}

export type CosmicPuzzle = {
  targetSector: number
  clues: CosmicClue[]
}

function circularDistance(first: number, second: number): number {
  const distance = Math.abs(first - second)
  return Math.min(distance, 8 - distance)
}

export function createCosmicPuzzle(): CosmicPuzzle {
  const targetSector = Math.floor(Math.random() * 8) + 1
  const isEven = targetSector % 2 === 0
  const isInnerHalf = targetSector <= 4
  const sectors = Array.from({ length: 8 }, (_, index) => index + 1)
  const firstCluesPossible = sectors.filter(
    (sector) => sector % 2 === (isEven ? 0 : 1) && (isInnerHalf ? sector <= 4 : sector >= 5),
  )
  const decoySector = firstCluesPossible.find((sector) => sector !== targetSector)
  if (decoySector === undefined) throw new Error('Could not generate a second candidate for the space puzzle.')
  const beaconSector = sectors.find(
    (sector) => circularDistance(sector, decoySector) === 1 && circularDistance(sector, targetSector) > 1,
  )
  if (beaconSector === undefined) throw new Error('Could not generate a distinguishing beacon clue for the space puzzle.')

  return {
    targetSector,
    clues: [
      {
        text: `Planet X is in an ${isEven ? 'even' : 'odd'}-numbered sector.`,
        possibleSectors: sectors.filter((sector) => sector % 2 === (isEven ? 0 : 1)),
      },
      {
        text: `Planet X is in the ${isInnerHalf ? 'inner' : 'outer'} half of the orbit (sectors ${isInnerHalf ? '1–4' : '5–8'}).`,
        possibleSectors: sectors.filter((sector) => isInnerHalf ? sector <= 4 : sector >= 5),
      },
      {
        text: `A radio beacon is in sector ${beaconSector}. Planet X is not in either neighboring sector.`,
        possibleSectors: sectors.filter((sector) => circularDistance(sector, beaconSector) > 1),
      },
    ],
  }
}

export function findPossibleSectors(clues: CosmicClue[]): number[] {
  return Array.from({ length: 8 }, (_, index) => index + 1).filter((sector) =>
    clues.every((clue) => clue.possibleSectors.includes(sector)),
  )
}

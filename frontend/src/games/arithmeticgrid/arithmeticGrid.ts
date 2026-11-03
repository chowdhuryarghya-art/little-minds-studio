export type CageOperation = '+' | '×' | '-' | '÷' | '='

export type ArithmeticCage = {
  cells: number[]
  target: number
  operation: CageOperation
}

export type ArithmeticPuzzle = {
  solution: number[]
  cages: ArithmeticCage[]
}

function shuffle<T>(values: T[]): T[] {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function neighbors(index: number): number[] {
  const row = Math.floor(index / 4)
  const column = index % 4
  return [
    ...(row > 0 ? [index - 4] : []),
    ...(row < 3 ? [index + 4] : []),
    ...(column > 0 ? [index - 1] : []),
    ...(column < 3 ? [index + 1] : []),
  ]
}

function createCage(cells: number[], solution: number[]): ArithmeticCage {
  const values = cells.map((cell) => solution[cell])
  if (values.length === 1) return { cells, target: values[0], operation: '=' }

  if (values.length >= 3) {
    const operation: CageOperation = Math.random() < 0.6 ? '+' : '×'
    const target = operation === '+'
      ? values.reduce((sum, value) => sum + value, 0)
      : values.reduce((product, value) => product * value, 1)
    return { cells, target, operation }
  }

  const [first, second] = values
  const options: ArithmeticCage[] = [
    { cells, target: first + second, operation: '+' },
    { cells, target: first * second, operation: '×' },
    { cells, target: Math.abs(first - second), operation: '-' },
  ]
  if (first % second === 0 || second % first === 0) {
    options.push({ cells, target: Math.max(first, second) / Math.min(first, second), operation: '÷' })
  }
  return options[Math.floor(Math.random() * options.length)]
}

export function createArithmeticPuzzle(): ArithmeticPuzzle {
  const rows = shuffle([0, 1, 2, 3])
  const columns = shuffle([0, 1, 2, 3])
  const digits = shuffle([1, 2, 3, 4])
  const solution = rows.flatMap((row) =>
    columns.map((column) => digits[(row + column) % 4]),
  )

  const unassigned = new Set(Array.from({ length: 16 }, (_, index) => index))
  const cages: ArithmeticCage[] = []
  while (unassigned.size > 0) {
    const start = Math.min(...unassigned)
    const cells = [start]
    unassigned.delete(start)
    const desiredSize = Math.random() < 0.7 ? 2 : 3

    while (cells.length < desiredSize) {
      const available = cells.flatMap(neighbors).filter((cell) => unassigned.has(cell))
      if (available.length === 0) break
      const next = available[Math.floor(Math.random() * available.length)]
      cells.push(next)
      unassigned.delete(next)
    }

    cages.push(createCage(cells, solution))
  }

  return { solution, cages }
}

export function checkArithmeticCage(cage: ArithmeticCage, values: number[]): boolean {
  const numbers = cage.cells.map((cell) => values[cell])
  if (numbers.some((value) => value === 0)) return false

  switch (cage.operation) {
    case '=':
      return numbers[0] === cage.target
    case '+':
      return numbers.reduce((sum, value) => sum + value, 0) === cage.target
    case '×':
      return numbers.reduce((product, value) => product * value, 1) === cage.target
    case '-':
      return numbers.length === 2 && Math.abs(numbers[0] - numbers[1]) === cage.target
    case '÷':
      return numbers.length === 2
        && Math.max(numbers[0], numbers[1]) / Math.min(numbers[0], numbers[1]) === cage.target
  }
}

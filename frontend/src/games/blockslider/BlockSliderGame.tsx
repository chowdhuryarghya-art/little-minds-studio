import { useState } from 'react'

type Vehicle = {
  id: string
  row: number
  column: number
  length: number
  direction: 'horizontal' | 'vertical'
  color: string
  emoji: string
  target?: boolean
}

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'you', row: 2, column: 4, length: 2, direction: 'horizontal', color: '#ef5350', emoji: '🚗', target: true },
  { id: 'a', row: 0, column: 2, length: 2, direction: 'vertical', color: '#6ec6a8', emoji: '🚙' },
  { id: 'b', row: 0, column: 4, length: 2, direction: 'vertical', color: '#9b83d5', emoji: '🚕' },
  { id: 'c', row: 0, column: 5, length: 2, direction: 'vertical', color: '#f08c83', emoji: '🚐' },
  { id: 'd', row: 0, column: 0, length: 2, direction: 'horizontal', color: '#66c4de', emoji: '🚓' },
  { id: 'e', row: 3, column: 0, length: 2, direction: 'horizontal', color: '#ee9ca7', emoji: '🚎' },
  { id: 'f', row: 4, column: 0, length: 2, direction: 'horizontal', color: '#a5b86b', emoji: '🚚' },
  { id: 'g', row: 5, column: 2, length: 2, direction: 'horizontal', color: '#f2a65a', emoji: '🚌' },
]

function getVehicleCells(vehicle: Vehicle): number[] {
  return Array.from({ length: vehicle.length }, (_, offset) =>
    vehicle.direction === 'horizontal'
      ? vehicle.row * 6 + vehicle.column + offset
      : (vehicle.row + offset) * 6 + vehicle.column,
  )
}

function canMove(vehicles: Vehicle[], vehicle: Vehicle, delta: number): boolean {
  const row = vehicle.row + (vehicle.direction === 'vertical' ? delta : 0)
  const column = vehicle.column + (vehicle.direction === 'horizontal' ? delta : 0)
  if (row < 0 || column < 0) return false
  if (row + (vehicle.direction === 'vertical' ? vehicle.length : 1) > 6) return false
  if (column + (vehicle.direction === 'horizontal' ? vehicle.length : 1) > 6) return false

  const next = { ...vehicle, row, column }
  const occupied = new Set(vehicles.filter((item) => item.id !== vehicle.id).flatMap(getVehicleCells))
  return getVehicleCells(next).every((cell) => !occupied.has(cell))
}

function moveVehicle(vehicles: Vehicle[], id: string, delta: number): Vehicle[] {
  const vehicle = vehicles.find((item) => item.id === id)
  if (!vehicle || !canMove(vehicles, vehicle, delta)) return vehicles
  return vehicles.map((item) => item.id === id
    ? {
        ...item,
        row: item.row + (item.direction === 'vertical' ? delta : 0),
        column: item.column + (item.direction === 'horizontal' ? delta : 0),
      }
    : item,
  )
}

function createScramble(): Vehicle[] {
  let vehicles = INITIAL_VEHICLES.map((vehicle) => ({ ...vehicle }))
  const target = vehicles.find((vehicle) => vehicle.target)
  if (!target) throw new Error('The slider puzzle needs a target vehicle.')
  vehicles = moveVehicle(vehicles, target.id, -1)

  let previous: { id: string; delta: number } | null = null
  for (let turn = 0; turn < 24; turn += 1) {
    const candidates = vehicles.flatMap((vehicle) => [-1, 1]
      .filter((delta) => !(vehicle.target && delta > 0))
      .filter((delta) => !(previous?.id === vehicle.id && previous.delta === -delta))
      .filter((delta) => canMove(vehicles, vehicle, delta))
      .map((delta) => ({ id: vehicle.id, delta })))
    if (candidates.length === 0) break
    const move = candidates[Math.floor(Math.random() * candidates.length)]
    vehicles = moveVehicle(vehicles, move.id, move.delta)
    previous = move
  }
  return vehicles
}

export default function BlockSliderGame() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(createScramble)
  const [selected, setSelected] = useState<string>('you')
  const [moves, setMoves] = useState(0)
  const target = vehicles.find((vehicle) => vehicle.target)
  if (!target) throw new Error('The slider puzzle lost its target vehicle.')
  const solved = target.column + target.length === 6
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selected)

  const moveSelected = (delta: number) => {
    if (!selectedVehicle || solved || !canMove(vehicles, selectedVehicle, delta)) return
    setVehicles((current) => moveVehicle(current, selectedVehicle.id, delta))
    setMoves((current) => current + 1)
  }

  const newPuzzle = () => {
    setVehicles(createScramble())
    setSelected('you')
    setMoves(0)
  }

  return (
    <div className="block-slider">
      <p className="center muted">Slide each vehicle along its lane. Clear a path so your red car can reach the exit!</p>
      <p className="center block-slider-count">Moves: {moves}</p>
      <div className="slider-board-wrap">
        <div className="slider-exit" aria-hidden="true">EXIT →</div>
        <div className="slider-board" role="group" aria-label="Vehicle sliding puzzle, six by six grid">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              className={`slider-vehicle ${vehicle.target ? 'slider-target' : ''}${selected === vehicle.id ? ' selected' : ''}`}
              style={{
                left: `${vehicle.column * 100 / 6}%`,
                top: `${vehicle.row * 100 / 6}%`,
                width: `${(vehicle.direction === 'horizontal' ? vehicle.length : 1) * 100 / 6}%`,
                height: `${(vehicle.direction === 'vertical' ? vehicle.length : 1) * 100 / 6}%`,
                background: vehicle.color,
              }}
              aria-label={`${vehicle.target ? 'Your car' : `Vehicle ${vehicle.id}`}, ${vehicle.direction}, row ${vehicle.row + 1}, column ${vehicle.column + 1}`}
              aria-pressed={selected === vehicle.id}
              disabled={solved}
              onClick={() => setSelected(vehicle.id)}
            >
              <span aria-hidden="true">{vehicle.emoji}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedVehicle && !solved && (
        <div className="slider-controls" role="group" aria-label={`Move selected ${selectedVehicle.direction} vehicle`}>
          {selectedVehicle.direction === 'horizontal' ? (
            <>
              <button type="button" className="tool" aria-label="Slide left" disabled={!canMove(vehicles, selectedVehicle, -1)} onClick={() => moveSelected(-1)}>← Slide left</button>
              <button type="button" className="tool" aria-label="Slide right" disabled={!canMove(vehicles, selectedVehicle, 1)} onClick={() => moveSelected(1)}>Slide right →</button>
            </>
          ) : (
            <>
              <button type="button" className="tool" aria-label="Slide up" disabled={!canMove(vehicles, selectedVehicle, -1)} onClick={() => moveSelected(-1)}>↑ Slide up</button>
              <button type="button" className="tool" aria-label="Slide down" disabled={!canMove(vehicles, selectedVehicle, 1)} onClick={() => moveSelected(1)}>Slide down ↓</button>
            </>
          )}
        </div>
      )}
      {solved && <p className="celebrate center" role="status">🚗 You cleared the path in {moves} moves!</p>}
      <div className="brain-game-actions">
        <button type="button" className="tool" onClick={newPuzzle}>New traffic jam</button>
      </div>
    </div>
  )
}

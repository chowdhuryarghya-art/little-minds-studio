import { useState } from 'react'
import ArithmeticGridGame from '../arithmeticgrid/ArithmeticGridGame.tsx'
import BlockSliderGame from '../blockslider/BlockSliderGame.tsx'
import RubiksCubeGame from '../rubikscube/RubiksCubeGame.tsx'

const GAMES = [
  { id: 'arithmetic', label: 'Arithmetic Grid' },
  { id: 'slider', label: 'Block Slider' },
  { id: 'cube', label: 'Rubik’s Cube' },
] as const

export default function AdvancedBrainGames() {
  const [active, setActive] = useState<(typeof GAMES)[number]['id']>('arithmetic')
  return (
    <div className="age-brain-games">
      <div className="chips advanced-game-tabs" role="group" aria-label="Choose a Logic Lab game">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`chip${active === game.id ? ' selected' : ''}`}
            aria-pressed={active === game.id}
            onClick={() => setActive(game.id)}
          >
            {game.label}
          </button>
        ))}
      </div>
      {active === 'arithmetic' && <ArithmeticGridGame key="arithmetic" />}
      {active === 'slider' && <BlockSliderGame key="slider" />}
      {active === 'cube' && <RubiksCubeGame key="cube" />}
    </div>
  )
}

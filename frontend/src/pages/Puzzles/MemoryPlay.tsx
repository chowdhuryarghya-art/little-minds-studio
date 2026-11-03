import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import MemoryGame from '../../games/memory/MemoryGame.tsx'

const PAIRS: Record<AgeGroupId, number> = { explorers: 3, curious: 6, creative: 8 }

export default function MemoryPlay() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : 'explorers'

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/puzzles">
          ← Puzzle Games
        </Link>
      </p>
      <h1>Memory Match</h1>
      <div className="chips" role="group" aria-label="Choose difficulty">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`chip${age === g.id ? ' selected' : ''}`}
            onClick={() => setParams({ age: g.id })}
          >
            {g.name} ({g.ages})
          </button>
        ))}
      </div>
      {/* key resets the deck when difficulty changes */}
      <MemoryGame key={age} pairs={PAIRS[age]} />
    </section>
  )
}

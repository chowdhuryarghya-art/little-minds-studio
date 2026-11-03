import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import SeedPicker from '../../components/SeedPicker.tsx'
import ConnectDotsGame from '../../games/connectdots/ConnectDotsGame.tsx'
import { parseSeed, randomSeed } from '../../lib/random.ts'

export default function ConnectDotsPlay() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : 'explorers'
  // A fresh random picture when the link has no (valid) picture number.
  const [fallbackSeed] = useState(randomSeed)
  const seed = parseSeed(params.get('seed')) ?? fallbackSeed

  const update = (next: { age?: AgeGroupId; seed?: number }) =>
    setParams({ age: next.age ?? age, seed: String(next.seed ?? seed) })

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/puzzles">
          ← Puzzle Games
        </Link>
      </p>
      <h1>Connect the Dots</h1>
      <div className="chips" role="group" aria-label="Choose difficulty">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`chip${age === g.id ? ' selected' : ''}`}
            onClick={() => update({ age: g.id })}
          >
            {g.name} ({g.ages})
          </button>
        ))}
      </div>
      <SeedPicker label="Picture" seed={seed} onSelect={(s) => update({ seed: s })} />
      {/* key makes a new picture (and resets progress) when difficulty or number changes */}
      <ConnectDotsGame key={`${age}-${seed}`} age={age} seed={seed} />
    </section>
  )
}

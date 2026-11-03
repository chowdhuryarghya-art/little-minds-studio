import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import HindiGame from '../../games/hindi/HindiGame.tsx'

export default function HindiPlay() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const wordParam = params.get('word') || undefined
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : 'curious'

  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/learning">
          ← Learning Zone
        </Link>
      </p>

      <div className="english-hero-header">
        <h1 className="hero-title">हिन्दी सीखें · Hindi Fun</h1>
        <p className="center muted">
          Explore Hindi vocabulary, pronunciation, meanings, synonyms, antonyms, and sentence building!
        </p>
      </div>

      <div className="chips" role="group" aria-label="Choose age group difficulty">
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

      <HindiGame key={`${age}:${wordParam || ''}`} initialAge={age} initialWord={wordParam} />
    </section>
  )
}

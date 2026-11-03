import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import EnglishGame from '../../games/english/EnglishGame.tsx'

export default function EnglishPlay() {
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
        <h1 className="hero-title">English Fun &amp; Word Explorer</h1>
        <p className="center muted">
          Discover words, meanings, phonetics, pronunciations, origins, and fun sentences!
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

      <EnglishGame key={`${age}:${wordParam || ''}`} initialAge={age} initialWord={wordParam} />
    </section>
  )
}

import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import BengaliGame from '../../games/bengali/BengaliGame.tsx'

export default function BengaliPlay() {
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
        <h1 className="hero-title">বাংলা শিখুন · Bengali Fun</h1>
        <p className="center muted">
          Explore Bengali vocabulary, pronunciation, meanings, synonyms, antonyms, and sentence building!
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

      <BengaliGame key={`${age}:${wordParam || ''}`} initialAge={age} initialWord={wordParam} />
    </section>
  )
}

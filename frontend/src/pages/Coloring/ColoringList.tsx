import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import { COLORING_PAGES } from '../../data/coloringPages.ts'
import ColoringCanvas from '../../games/coloring/ColoringCanvas.tsx'
import { loadFills } from '../../games/coloring/storage.ts'
import type { ColoringKind } from '../../games/coloring/types.ts'

const KIND_LABEL: Partial<Record<ColoringKind, string>> = {
  animal: 'Animal coloring',
  shape: 'Shape coloring',
  nature: 'Nature coloring',
  festival: 'Festival coloring',
}

export default function ColoringList() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age = isAgeGroupId(ageParam) ? ageParam : null
  const pages = age ? COLORING_PAGES.filter((p) => p.ages.includes(age)) : COLORING_PAGES

  return (
    <section className="page">
      <h1 className="hero-title">Coloring Games</h1>
      <div className="chips" role="group" aria-label="Filter by age">
        <button
          type="button"
          className={`chip${age === null ? ' selected' : ''}`}
          onClick={() => setParams({})}
        >
          All ages
        </button>
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
      <p className="center">
        <Link className="btn" to="/coloring/mandala">
          Mandala Maker (endless pictures)
        </Link>{' '}
        <Link className="btn" to="/coloring/creature">
          Creature Maker
        </Link>{' '}
        <Link className="btn" to="/coloring/by-number">
          Try Color by Number
        </Link>
      </p>
      <div className="tile-grid three">
        {pages.map((p) => (
          <Link key={p.id} to={`/coloring/${p.id}`} className="card">
            <ColoringCanvas page={p} fills={loadFills(p)} />
            <strong>{p.title}</strong>
            <span className="muted">{KIND_LABEL[p.kind]}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

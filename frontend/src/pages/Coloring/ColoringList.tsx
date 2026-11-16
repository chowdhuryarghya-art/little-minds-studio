import { useState } from 'react'
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
const KIND_OPTIONS: { id: ColoringKind; label: string }[] = [
  { id: 'animal', label: 'Animal coloring' },
  { id: 'shape', label: 'Shape coloring' },
  { id: 'nature', label: 'Nature coloring' },
  { id: 'festival', label: 'Festival coloring' },
]

export default function ColoringList() {
  const [params, setParams] = useSearchParams()
  const [selectedKind, setSelectedKind] = useState<ColoringKind | null>(null)
  const ageParam = params.get('age')
  const age = isAgeGroupId(ageParam) ? ageParam : null
  const ageFilteredPages = age ? COLORING_PAGES.filter((p) => p.ages.includes(age)) : COLORING_PAGES
  const pages = selectedKind
    ? ageFilteredPages.filter((page) => page.kind === selectedKind)
    : ageFilteredPages

  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/">
          ← Home
        </Link>
      </p>
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
      <div className="chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`chip${selectedKind === null ? ' selected' : ''}`}
          aria-pressed={selectedKind === null}
          onClick={() => setSelectedKind(null)}
        >
          All categories
        </button>
        {KIND_OPTIONS.map((kind) => (
          <button
            key={kind.id}
            type="button"
            className={`chip${selectedKind === kind.id ? ' selected' : ''}`}
            aria-pressed={selectedKind === kind.id}
            onClick={() => setSelectedKind(kind.id)}
          >
            {kind.label}
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
        {pages.length > 0 ? pages.map((p) => (
            <Link key={p.id} to={`/coloring/${p.id}`} className="card">
              <ColoringCanvas page={p} fills={loadFills(p)} />
              <strong>{p.title}</strong>
              <span className="muted">{KIND_LABEL[p.kind]}</span>
            </Link>
          )) : (
            <p className="muted">No coloring pages match both filters. Try another category or age group.</p>
          )}
      </div>
    </section>
  )
}

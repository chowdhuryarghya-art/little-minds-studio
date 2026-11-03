import { Link } from 'react-router-dom'
import { AGE_GROUPS } from '../../data/ageGroups.ts'

export default function KidsZone() {
  return (
    <section className="page">
      <h1 className="hero-title">Kids Zone</h1>
      <p className="center muted">No login · No payment · Play immediately. How old are you?</p>
      <div className="tile-grid three">
        {AGE_GROUPS.map((g) => (
          <Link
            key={g.id}
            to={`/coloring?age=${g.id}`}
            className="tile"
            style={{ background: g.accent }}
          >
            <strong>{g.name}</strong>
            <span className="ages">Ages {g.ages}</span>
            <span>{g.blurb}</span>
            <em>{g.level}</em>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { AGE_GROUPS } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'

const AGE_ACTIVITY: Record<AgeGroupId, { to: string; label: string; description: string }> = {
  explorers: {
    to: '/learning/early-years',
    label: 'Start Early Learning',
    description: 'Letters, picture words, stories, and counting for young learners.',
  },
  curious: {
    to: '/learning/math',
    label: 'Try Math Fun',
    description: 'Math puzzles and quizzes for growing problem-solvers.',
  },
  creative: {
    to: '/brain-games',
    label: 'Explore Brain Games',
    description: 'Logic, patterns, and creative challenges.',
  },
}

export default function KidsZone() {
  return (
    <section className="page">
      <h1 className="hero-title">Kids Zone</h1>
      <p className="center muted">No login · No payment · Play immediately. How old are you?</p>
      <div className="tile-grid three">
        {AGE_GROUPS.map((g) => (
          <Link
            key={g.id}
            to={AGE_ACTIVITY[g.id].to}
            className="tile"
            style={{ background: g.accent }}
          >
            <strong>{g.name}</strong>
            <span className="ages">Ages {g.ages}</span>
            <span>{AGE_ACTIVITY[g.id].description}</span>
            <em>{g.level}</em>
            <strong>{AGE_ACTIVITY[g.id].label} →</strong>
          </Link>
        ))}
      </div>
    </section>
  )
}

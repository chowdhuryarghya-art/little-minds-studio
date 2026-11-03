import { Link } from 'react-router-dom'

const TILES = [
  { to: '/coloring', title: 'Coloring Games', sub: 'Explore and create', color: '#ffb703' },
  { to: '/puzzles', title: 'Puzzle Games', sub: 'Think and solve', color: '#4cc9f0' },
  { to: '/learning', title: 'Learning Zone', sub: 'Learn something new', color: '#52b788' },
  { to: '/brain-games', title: 'Brain Games', sub: 'Think, plan and solve', color: '#cdeccf' },
  { to: '/drawing', title: 'Drawing Studio', sub: 'Create your artwork', color: '#b388eb' },
]

export default function Home() {
  return (
    <section className="page">
      <h1 className="hero-title">What would you like to explore?</h1>
      <p className="center">
        <Link className="btn big" to="/kids">
          Start playing – pick your age
        </Link>
      </p>
      <div className="tile-grid">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="tile" style={{ background: t.color }}>
            <strong>{t.title}</strong>
            <span>{t.sub}</span>
          </Link>
        ))}
      </div>
      <p className="center muted">
        <Link to="/parents">For Parents &amp; Teachers</Link>
      </p>
    </section>
  )
}

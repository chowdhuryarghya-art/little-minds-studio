import { Link } from 'react-router-dom'
import { COLORING_PAGES } from '../../data/coloringPages.ts'
import ColoringCanvas from '../../games/coloring/ColoringCanvas.tsx'

export default function ColorByNumberList() {
  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/coloring">
          ← Coloring Games
        </Link>
      </p>
      <h1 className="hero-title">Color by Number</h1>
      <div className="tile-grid three">
        {COLORING_PAGES.map((p) => (
          <Link key={p.id} to={`/coloring/by-number/${p.id}`} className="card">
            <ColoringCanvas page={p} fills={{}} />
            <strong>{p.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  )
}

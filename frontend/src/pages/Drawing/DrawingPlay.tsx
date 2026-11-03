import { Link } from 'react-router-dom'
import DrawingStudio from '../../games/drawing/DrawingStudio.tsx'

export default function DrawingPlay() {
  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/">
          ← Home
        </Link>
      </p>
      <h1>Drawing Studio</h1>
      <DrawingStudio />
    </section>
  )
}

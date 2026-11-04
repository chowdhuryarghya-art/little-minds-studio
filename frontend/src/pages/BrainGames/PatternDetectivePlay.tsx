import { Link } from 'react-router-dom'
import PatternDetectiveGame from '../../games/patterndetective/PatternDetectiveGame.tsx'

export default function PatternDetectivePlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Pattern Detective</h1>
      <p className="center muted">Look closely at the sequence and spot what comes next.</p>
      <PatternDetectiveGame />
    </section>
  )
}

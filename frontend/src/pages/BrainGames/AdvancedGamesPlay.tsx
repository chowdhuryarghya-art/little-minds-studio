import { Link } from 'react-router-dom'
import AdvancedBrainGames from '../../games/advancedbrain/AdvancedBrainGames.tsx'

export default function AdvancedGamesPlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Logic Lab</h1>
      <p className="center muted">Ages 9–12 · Think ahead, spot patterns, and solve the puzzle.</p>
      <AdvancedBrainGames />
    </section>
  )
}

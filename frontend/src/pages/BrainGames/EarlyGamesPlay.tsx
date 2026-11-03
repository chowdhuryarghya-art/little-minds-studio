import { Link } from 'react-router-dom'
import EarlyBrainGames from '../../games/earlybrain/EarlyBrainGames.tsx'

export default function EarlyGamesPlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Little Thinkers</h1>
      <p className="center muted">Ages 2–4 · Look, sort, and match!</p>
      <EarlyBrainGames />
    </section>
  )
}

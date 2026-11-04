import { Link } from 'react-router-dom'
import CosmicCluesGame from '../../games/cosmicclues/CosmicCluesGame.tsx'

export default function CosmicCluesPlay() {
  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/brain-games">← Brain Games</Link>
      </p>
      <h1 className="center">Cosmic Clue Hunt</h1>
      <p className="center muted">Use logic and astronomy clues to find a hidden planet on the star map.</p>
      <CosmicCluesGame />
    </section>
  )
}

import { Link } from 'react-router-dom'
import CodebreakerGame from '../../games/codebreaker/CodebreakerGame.tsx'

export default function CodebreakerPlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Codebreaker</h1>
      <p className="center muted">Use the clues from each guess to crack the secret color code.</p>
      <CodebreakerGame />
    </section>
  )
}

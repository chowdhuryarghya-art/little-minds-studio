import { Link } from 'react-router-dom'
import WordBuilderGame from '../../games/wordbuilder/WordBuilderGame.tsx'

export default function WordBuilderPlay() {
  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/brain-games">← Brain Games</Link>
      </p>
      <h1 className="center">Word Builder</h1>
      <p className="center muted">Mix and match letter tiles to make words and score points!</p>
      <WordBuilderGame />
    </section>
  )
}

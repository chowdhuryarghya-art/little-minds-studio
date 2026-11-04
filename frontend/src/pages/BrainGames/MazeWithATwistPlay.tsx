import { Link } from 'react-router-dom'
import MazeWithATwistGame from '../../games/mazewithatwist/MazeWithATwistGame.tsx'

export default function MazeWithATwistPlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Maze With a Twist</h1>
      <p className="center muted">Find the key before you can pass the locked gate and reach the star.</p>
      <MazeWithATwistGame />
    </section>
  )
}

import { Link } from 'react-router-dom'

export default function PuzzleList() {
  return (
    <section className="page">
      <h1 className="hero-title">Puzzle Games</h1>
      <div className="tile-grid three">
        <Link to="/puzzles/memory" className="tile" style={{ background: '#4cc9f0' }}>
          <strong>Memory Match</strong>
          <span>Find the matching pairs</span>
        </Link>
        <Link to="/puzzles/maze" className="tile" style={{ background: '#ffb703' }}>
          <strong>Mouse Maze</strong>
          <span>Help the mouse find the star</span>
        </Link>
        <Link to="/puzzles/connect-dots" className="tile" style={{ background: '#b8f2c9' }}>
          <strong>Connect the Dots</strong>
          <span>Join the numbers to reveal a picture</span>
        </Link>
        <Link to="/puzzles/word-search" className="tile" style={{ background: '#ffd6a5' }}>
          <strong>Word Search</strong>
          <span>Find the hidden words</span>
        </Link>
      </div>
      <p className="center muted">More puzzles coming soon.</p>
    </section>
  )
}

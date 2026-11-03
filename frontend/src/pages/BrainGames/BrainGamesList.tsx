import { Link } from 'react-router-dom'

export default function BrainGamesList() {
  return (
    <section className="page">
      <h1 className="hero-title">Brain Games</h1>
      <p className="center muted">Think ahead, spot patterns and give your brain a workout!</p>
      <div className="tile-grid">
        <Link to="/brain-games/little-thinkers" className="tile brain-tile" style={{ background: '#ffe6ad' }}>
          <strong>🐣 Little Thinkers · Ages 2–4</strong>
          <span>Odd One Out, Size Sorting, and Shadow Matching</span>
        </Link>
        <Link to="/brain-games/chess" className="tile brain-tile" style={{ background: '#cdeccf' }}>
          <strong>♟ Chess Practice</strong>
          <span>Learn the moves and play against the computer</span>
        </Link>
        <Link to="/brain-games/sudoku" className="tile brain-tile" style={{ background: '#d9e7ff' }}>
          <strong>🔢 Sudoku</strong>
          <span>Use logic to fill the number grid</span>
        </Link>
        <Link to="/brain-games/word-builder" className="tile brain-tile" style={{ background: '#ffe4ad' }}>
          <strong>🔤 Word Builder</strong>
          <span>Make words with letter tiles and collect points</span>
        </Link>
        <Link to="/brain-games/cosmic-clues" className="tile brain-tile" style={{ background: '#e8dcff' }}>
          <strong>🪐 Cosmic Clue Hunt</strong>
          <span>Use space clues to find the hidden planet</span>
        </Link>
        <Link to="/brain-games/logic-lab" className="tile brain-tile" style={{ background: '#c9e7f2' }}>
          <strong>🧩 Logic Lab · Ages 9–12</strong>
          <span>Arithmetic Grid, Block Slider, and a 3D Rubik’s Cube</span>
        </Link>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'

export default function BrainGamesList() {
  return (
    <section className="page">
      <p>
        <Link className="back-link" to="/">
          ← Home
        </Link>
      </p>
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
        <Link to="/brain-games/codebreaker" className="tile brain-tile" style={{ background: '#ffd8d8' }}>
          <strong>🔐 Codebreaker</strong>
          <span>Crack a secret color code using logic and clues</span>
        </Link>
        <Link to="/brain-games/pattern-detective" className="tile brain-tile" style={{ background: '#d8f0e2' }}>
          <strong>🔎 Pattern Detective</strong>
          <span>Spot what comes next in color, shape, and number patterns</span>
        </Link>
        <Link to="/brain-games/maze-with-a-twist" className="tile brain-tile" style={{ background: '#ffe6ad' }}>
          <strong>🗝️ Maze With a Twist</strong>
          <span>Find a key to unlock the gate on your way to the star</span>
        </Link>
        <Link to="/brain-games/riddle-logic" className="tile brain-tile" style={{ background: '#d9e7ff' }}>
          <strong>🧠 Riddle &amp; Logic Challenge</strong>
          <span>Solve fun riddles, brain teasers, and logic questions</span>
        </Link>
        <Link to="/brain-games/logic-lab" className="tile brain-tile" style={{ background: '#c9e7f2' }}>
          <strong>🧩 Logic Lab · Ages 9–12</strong>
          <span>Arithmetic Grid, Block Slider, and a 3D Rubik’s Cube</span>
        </Link>
      </div>
    </section>
  )
}

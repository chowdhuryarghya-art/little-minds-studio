import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import KidsZone from './pages/KidsZone/KidsZone.tsx'
import ColoringList from './pages/Coloring/ColoringList.tsx'
import ColoringPlay from './pages/Coloring/ColoringPlay.tsx'
import PuzzleList from './pages/Puzzles/PuzzleList.tsx'
import MemoryPlay from './pages/Puzzles/MemoryPlay.tsx'
import MazePlay from './pages/Puzzles/MazePlay.tsx'
import ConnectDotsPlay from './pages/Puzzles/ConnectDotsPlay.tsx'
import WordSearchPlay from './pages/Puzzles/WordSearchPlay.tsx'
import MandalaPlay from './pages/Coloring/MandalaPlay.tsx'
import CreaturePlay from './pages/Coloring/CreaturePlay.tsx'
import ColorByNumberList from './pages/Coloring/ColorByNumberList.tsx'
import ColorByNumberPlay from './pages/Coloring/ColorByNumberPlay.tsx'
import LearningList from './pages/Learning/LearningList.tsx'
import MathPlay from './pages/Learning/MathPlay.tsx'
import EnglishPlay from './pages/Learning/EnglishPlay.tsx'
import HindiPlay from './pages/Learning/HindiPlay.tsx'
import BengaliPlay from './pages/Learning/BengaliPlay.tsx'
import DrawingPlay from './pages/Drawing/DrawingPlay.tsx'
import Parents from './pages/Parents/Parents.tsx'
import Privacy from './pages/Parents/Privacy.tsx'
import About from './pages/Parents/About.tsx'
import ComingSoon from './pages/ComingSoon.tsx'
import BrainGamesList from './pages/BrainGames/BrainGamesList.tsx'
import ChessPractice from './pages/BrainGames/ChessPractice.tsx'
import SudokuPlay from './pages/BrainGames/SudokuPlay.tsx'
import WordBuilderPlay from './pages/BrainGames/WordBuilderPlay.tsx'
import CosmicCluesPlay from './pages/BrainGames/CosmicCluesPlay.tsx'
import EarlyGamesPlay from './pages/BrainGames/EarlyGamesPlay.tsx'
import AdvancedGamesPlay from './pages/BrainGames/AdvancedGamesPlay.tsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          Little Minds Studio
          <span className="tagline">Play · Learn · Create</span>
        </Link>
        <nav aria-label="Main">
          <Link to="/kids">Kids Zone</Link>
          <Link to="/coloring">Coloring</Link>
          <Link to="/brain-games">Brain Games</Link>
          <Link to="/parents">For Parents &amp; Teachers</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kids" element={<KidsZone />} />
          <Route path="/coloring" element={<ColoringList />} />
          <Route path="/coloring/mandala" element={<MandalaPlay />} />
          <Route path="/coloring/creature" element={<CreaturePlay />} />
          <Route path="/coloring/by-number" element={<ColorByNumberList />} />
          <Route path="/coloring/by-number/:pageId" element={<ColorByNumberPlay />} />
          <Route path="/coloring/:pageId" element={<ColoringPlay />} />
          <Route path="/puzzles" element={<PuzzleList />} />
          <Route path="/puzzles/memory" element={<MemoryPlay />} />
          <Route path="/puzzles/maze" element={<MazePlay />} />
          <Route path="/puzzles/connect-dots" element={<ConnectDotsPlay />} />
          <Route path="/puzzles/word-search" element={<WordSearchPlay />} />
          <Route path="/learning" element={<LearningList />} />
          <Route path="/learning/math" element={<MathPlay />} />
          <Route path="/learning/english" element={<EnglishPlay />} />
          <Route path="/learning/hindi" element={<HindiPlay />} />
          <Route path="/learning/bengali" element={<BengaliPlay />} />
          <Route path="/drawing" element={<DrawingPlay />} />
          <Route path="/brain-games" element={<BrainGamesList />} />
          <Route path="/brain-games/chess" element={<ChessPractice />} />
          <Route path="/brain-games/sudoku" element={<SudokuPlay />} />
          <Route path="/brain-games/word-builder" element={<WordBuilderPlay />} />
          <Route path="/brain-games/cosmic-clues" element={<CosmicCluesPlay />} />
          <Route path="/brain-games/little-thinkers" element={<EarlyGamesPlay />} />
          <Route path="/brain-games/logic-lab" element={<AdvancedGamesPlay />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <footer className="site-footer">
        Free for children · No sign-up · No purchases in games ·{' '}
        <Link to="/privacy">Privacy</Link> · <Link to="/about">About and contact</Link>
      </footer>
    </>
  )
}

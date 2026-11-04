import { Link } from 'react-router-dom'
import WhatComesNextGame from '../../games/whatcomesnext/WhatComesNextGame.tsx'

export default function WhatComesNextPlay() {
  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/brain-games">← Brain Games</Link></p>
      <h1 className="center">Riddle &amp; Logic Challenge</h1>
      <p className="center muted">Solve fun riddles, brain teasers, and logic questions.</p>
      <WhatComesNextGame />
    </section>
  )
}

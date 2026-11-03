import { Link, useParams } from 'react-router-dom'
import { COLOR_BY_NUMBER } from '../../data/colorByNumber.ts'
import { getColoringPage } from '../../data/coloringPages.ts'
import ColorByNumberGame from '../../games/colorbynumber/ColorByNumberGame.tsx'
import ComingSoon from '../ComingSoon.tsx'

export default function ColorByNumberPlay() {
  const { pageId } = useParams()
  const page = getColoringPage(pageId)
  const targets = page ? COLOR_BY_NUMBER[page.id] : undefined
  if (!page || !targets) return <ComingSoon title="Page not found" />

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/coloring/by-number">
          ← All color-by-number pages
        </Link>
      </p>
      <h1>{page.title}</h1>
      {/* key resets game state when switching pages */}
      <ColorByNumberGame key={page.id} page={page} targets={targets} />
    </section>
  )
}

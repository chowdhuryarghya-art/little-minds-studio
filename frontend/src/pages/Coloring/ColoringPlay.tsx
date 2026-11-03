import { Link, useParams } from 'react-router-dom'
import { getColoringPage } from '../../data/coloringPages.ts'
import ColoringGame from '../../games/coloring/ColoringGame.tsx'
import ComingSoon from '../ComingSoon.tsx'

export default function ColoringPlay() {
  const { pageId } = useParams()
  const page = getColoringPage(pageId)
  if (!page) return <ComingSoon title="Page not found" />

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/coloring">
          ← All coloring pages
        </Link>
      </p>
      <h1>{page.title}</h1>
      {/* key resets game state when switching pages */}
      <ColoringGame key={page.id} page={page} />
    </section>
  )
}

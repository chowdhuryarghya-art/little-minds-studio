import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Free Games for Kids Ages 2–12',
    description: 'Free, no-sign-up games for children ages 2–12. Play, learn, color, solve puzzles, and create.',
  },
  '/kids': {
    title: 'Kids Zone',
    description: 'Choose an age group and explore free activities at Little Minds Studio.',
  },
  '/coloring': {
    title: 'Coloring Games',
    description: 'Explore free coloring pages and creative activities for children.',
  },
  '/puzzles': {
    title: 'Puzzle Games',
    description: 'Play free memory, maze, connect-the-dots, and word-search games.',
  },
  '/learning': {
    title: 'Learning Zone',
    description: 'Explore free early learning, math, science, and language activities.',
  },
  '/learning/early-years': {
    title: 'Early Learning for Ages 2–5',
    description: 'Practice letters, counting, stories, tracing, and feelings with early learning activities.',
  },
  '/learning/math': {
    title: 'Math Fun',
    description: 'Practice math with age-appropriate questions and topics.',
  },
  '/learning/science': {
    title: 'Science Explorer',
    description: 'Explore animals, plants, space, the human body, and Earth.',
  },
  '/learning/english': {
    title: 'English Fun',
    description: 'Explore reviewed English vocabulary, pronunciation, and sentence practice.',
  },
  '/learning/hindi': {
    title: 'Hindi Fun',
    description: 'Explore curated Hindi words, meanings, and pronunciation.',
  },
  '/learning/bengali': {
    title: 'Bengali Fun',
    description: 'Explore curated Bengali words, meanings, and pronunciation.',
  },
  '/brain-games': {
    title: 'Brain Games',
    description: 'Play free logic, chess, Sudoku, pattern, and word games.',
  },
  '/brain-games/chess': {
    title: 'Chess Practice',
    description: 'Learn chess moves and play a practice game.',
  },
  '/brain-games/sudoku': {
    title: 'Sudoku',
    description: 'Play a logic puzzle with multiple difficulty levels.',
  },
  '/brain-games/word-builder': {
    title: 'Word Builder',
    description: 'Make words with letter tiles in a free word game.',
  },
  '/brain-games/cosmic-clues': {
    title: 'Cosmic Clue Hunt',
    description: 'Use clues to solve a space-themed logic puzzle.',
  },
  '/brain-games/codebreaker': {
    title: 'Codebreaker',
    description: 'Crack a color code with logic and clues.',
  },
  '/brain-games/pattern-detective': {
    title: 'Pattern Detective',
    description: 'Find the next shape, color, or number in a pattern.',
  },
  '/brain-games/maze-with-a-twist': {
    title: 'Maze With a Twist',
    description: 'Find the key and solve a maze challenge.',
  },
  '/brain-games/what-comes-next': {
    title: 'Riddle & Logic Challenge',
    description: 'Solve child-friendly riddles, brain teasers, and logic questions.',
  },
  '/brain-games/little-thinkers': {
    title: 'Little Thinkers',
    description: 'Play simple matching, sorting, and observation games.',
  },
  '/brain-games/logic-lab': {
    title: 'Logic Lab',
    description: 'Explore logic and problem-solving challenges.',
  },
  '/brain-games/riddle-logic': {
    title: 'Riddle & Logic Challenge',
    description: 'Solve child-friendly riddles, brain teasers, and logic questions.',
  },
  '/drawing': {
    title: 'Drawing Studio',
    description: 'Create and save drawings in the free Drawing Studio.',
  },
  '/coloring/mandala': {
    title: 'Mandala Maker',
    description: 'Create colorful mandala patterns.',
  },
  '/coloring/creature': {
    title: 'Creature Maker',
    description: 'Design a colorful creature.',
  },
  '/coloring/by-number': {
    title: 'Color by Number',
    description: 'Color pictures by following their number key.',
  },
  '/puzzles/memory': {
    title: 'Memory Match',
    description: 'Practice memory by matching picture pairs.',
  },
  '/puzzles/maze': {
    title: 'Mouse Maze',
    description: 'Find a path through a maze.',
  },
  '/puzzles/connect-dots': {
    title: 'Connect the Dots',
    description: 'Connect numbered dots to reveal a picture.',
  },
  '/puzzles/word-search': {
    title: 'Word Search',
    description: 'Find words in a letter grid.',
  },
  '/parents': {
    title: 'For Parents & Teachers',
    description: 'Information about Little Minds Studio for parents and teachers.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Learn how Little Minds Studio handles information and third-party services.',
  },
  '/about': {
    title: 'About and Contact',
    description: 'Learn about Little Minds Studio and contact the site creator.',
  },
}

function metadataForPath(pathname: string) {
  const exact = PAGE_METADATA[pathname]
  if (exact) return exact
  if (pathname.startsWith('/coloring/')) {
    return { title: 'Coloring Page', description: 'Open a free coloring activity at Little Minds Studio.' }
  }
  if (pathname.startsWith('/brain-games/')) {
    return { title: 'Brain Game', description: 'Play a free brain game at Little Minds Studio.' }
  }
  if (pathname.startsWith('/puzzles/')) {
    return { title: 'Puzzle Game', description: 'Play a free puzzle game at Little Minds Studio.' }
  }
  return { title: 'Page Not Found', description: 'This page could not be found at Little Minds Studio.' }
}

export default function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const metadata = metadataForPath(pathname)
    document.title = `${metadata.title} | Little Minds Studio`
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', metadata.description)
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', metadata.description)
  }, [pathname])

  return null
}

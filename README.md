# Little Minds Studio

Free kids learning platform (ages 2â€“12): **Play Â· Learn Â· Create**.
See `little_minds_studio_exact_chat_roadmap.pdf` for the full business and development roadmap.

## Principles (from the roadmap)
- Free to play, no child accounts, no purchases or ads in games.
- Artwork and progress stay local; no personal data collected from children.
- Game engine is client-side; static JSON/TS content first, no database needed for games.

## Status â€“ Month 1 (Foundation)
- [x] React + TypeScript + Vite app in `frontend/`
- [x] Homepage, Kids Zone age selection, coloring list with age filter
- [x] SVG coloring engine: palette, eraser, undo, start over, completion message
- [x] Animal coloring (fish, cat, butterfly, turtle) and shape coloring (house, robot)
- [x] Memory Match (3 / 6 / 8 pairs by age group) under Puzzle Games
- [x] Math Fun under Learning Zone: 10-question rounds with age-adjusted difficulty; topic filters for addition, subtraction, multiplication, division, factors, money, fractions, time, geometry and decimals for ages 5–12, plus age-appropriate number sense and patterns for ages 2–5
- [x] Brain Games: Chess Practice (legal moves, lightweight computer opponent, practice disclaimer); Sudoku (easy, medium and hard puzzles with unique solutions); Word Builder; Cosmic Clue Hunt; Little Thinkers for ages 2–4 (24 Odd One Out rounds, 20 size-sorting challenges, and 40 shadow pictures rotated in no-repeat batches); and Logic Lab for ages 9–12 (KenKen-style Arithmetic Grid, Block Slider, and a 3D interactive Rubik's Cube)
- [x] Parents & Teachers page, draft privacy policy (needs legal review), About/contact page with adult feedback form (opens an email draft to the current project inbox)
- [x] Tested on a real mobile phone
- [x] Tested on a real tablet
- [ ] Test in desktop browsers
- [ ] Brand and domain
- [x] Local artwork saving for coloring (autosaved in browser localStorage, never sent anywhere)
- [x] Drawing Studio (free draw, 12 colors, 3 brush sizes, eraser, undo, clear; autosaved locally)
- [x] Drawing Studio Fill by Color tool for enclosed areas, with undo and local autosave
- [x] Math Fun expanded with age-adjusted addition, subtraction, multiplication, division, factors, money, fractions, time, geometry and decimals; topic filters mix selected topics into rounds
- [x] Color by Number (all 6 coloring pages, numbered legend, wrong-number hints) under Coloring
- [x] Mouse Maze (5x5 / 8x8 / 12x12 by age group, arrow keys or on-screen pad, shareable "Maze #") under Puzzle Games
- [x] Mandala Maker: procedurally generated coloring / color-by-number pictures from a shareable "Picture #" (seeded random, no AI; see `frontend/src/lib/random.ts`, `frontend/src/games/mandala/`)
- [x] Creature Maker: seeded creatures built from interchangeable parts (ears, tails, legs, spots, wings, antenna), coloring or color-by-number, shareable "Creature #" (`frontend/src/games/creature/`)
- [x] Connect the Dots: seeded star / flower / heart / blob pictures with 8-12, 12-18 or 18-26 dots by age group, shareable "Picture #" (`frontend/src/games/connectdots/`)
- [x] Word Search: seeded 6x6 / 8x8 / 10x10 grids with 4 / 6 / 8 words (emoji hints for the youngest, words in more directions for older kids; every word appears exactly once; 5 optional topics: Animals, Food, Space, Ocean, Weather & Nature), shareable "Puzzle #" (`frontend/src/games/wordsearch/`)
- [x] Hand-drawn coloring and color-by-number pages expanded from 25 to 55, including 30 additional original templates across animals, fruit, nature and shapes
- [ ] Remaining for Version 1.0: brand/domain, desktop-browser testing, and legal review of the draft privacy policy. The contact page currently publishes the owner's personal email and uses a mailto feedback form; consider replacing it with a dedicated project address before public launch. Real mobile phone and tablet testing are complete. The initial 50-template milestone is met; the roadmap's 100-activity target and ongoing monthly additions remain future content work.

## Run
Requires Node.js 20.19+ or 22.12+.

```
cd frontend
npm install
npm run dev     # http://127.0.0.1:5173
npm run build
```

## Layout
```
frontend/src/
  data/       age groups + coloring page definitions
  games/      game engines (coloring, puzzles, learning, drawing and brain games)
  pages/      route components
```
`backend/`, `android/` (Capacitor) and `database/` are deferred until the web experience is validated.

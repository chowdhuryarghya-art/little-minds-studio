# Little Minds Studio — Comprehensive Architecture & Design Document

> **Platform Overview:** Little Minds Studio is an ad-free web application that does not require accounts, designed for children aged 2–12. It provides Coloring, Puzzles, Brain Games, Drawing, Math, Science Explorer, and English, Hindi, and Bengali word exploration. Its privacy policy is a draft and requires legal review before public launch.

---

## 1. High-Level Architectural Principles

1. **Client-Side First & Zero-Auth Friction:** Children and educators can access all features immediately without logging in, entering personal details, or paying.
2. **Kid-Friendly Accessibility:** Touch-friendly controls, high-contrast outlines, distinct color badges, phonetic transcriptions, audio options, and responsive layouts.
3. **Resilience & Offline Fallbacks:** Coloring and curated learning content can be used without dictionary lookups; live dictionary, translation, and some speech features require network access.
4. **Deterministic Procedural Generation:** Puzzles (Sudoku, Mazes, Arithmetic Grids, Mandalas, Creature generators) utilize deterministic pseudo-random seeds (PRNG) allowing any puzzle to be reproduced, shared, or printed.

---

## 2. Directory Layout & Module Structure

```text
little-minds-studio/
├── frontend/
│   ├── index.html                      # Entry HTML document with responsive viewport
│   ├── package.json                    # Project scripts & dependencies (React 19, react-router-dom, chess.js)
│   ├── tsconfig.json                   # Strict TypeScript compiler configuration
│   ├── vite.config.ts                  # Vite bundler configuration with React plugin
│   ├── public/
│   │   └── favicon.svg                 # Little Minds Studio brand icon
│   └── src/
│       ├── main.tsx                    # Application bootstrapper with BrowserRouter
│       ├── App.tsx                     # Top-level shell with global header, footer, & route definitions
│       ├── styles.css                  # Global design system, theme tokens, typography, and game styles
│       ├── components/                 # Shared generic UI components
│       ├── data/                       # Static datasets, age groups, and coloring pages
│       ├── lib/                        # Common math and PRNG utilities
│       ├── pages/                      # Page-level route views
│       └── games/                      # Domain logic, state machines, and interactive game canvases
└── DESIGN_DOCUMENT.md                  # This master architecture document
```

---

## 3. Detailed File-by-File Breakdown

### A. Root & Build Configuration

#### 1. [`frontend/package.json`](frontend/package.json:1)
- **What is done:** Defines project metadata, scripts (`dev`, `build`, `preview`), dev dependencies (`vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`), and core runtime dependencies (`react`, `react-dom`, `react-router-dom`, `chess.js`).
- **How:** Configured as an ES Module (`"type": "module"`), using Vite for fast HMR and Rollup production builds.
- **Why:** Keeps bundle sizes minimal and eliminates unnecessary third-party overhead.

#### 2. [`frontend/tsconfig.json`](frontend/tsconfig.json:1)
- **What is done:** Configures strict TypeScript settings including target `ES2022`, module `ESNext`, `jsx: "react-jsx"`, `strict: true`, and unused variable checks.
- **How:** Enforces type safety, null-checks, and clean code across all game modules.
- **Why:** Prevents runtime regressions and ensures reliable refactoring.

#### 3. [`frontend/vite.config.ts`](frontend/vite.config.ts:1)
- **What is done:** Sets up Vite with `@vitejs/plugin-react`.
- **How:** Exports standard Vite configuration.
- **Why:** Delivers fast sub-second hot module replacement during development and optimized tree-shaken static assets for production.

#### 4. [`frontend/index.html`](frontend/index.html:1)
- **What is done:** Main single-page application host HTML with viewport meta tags, favicon reference, and `#root` container.
- **How:** Loads `/src/main.tsx` as an ES module.
- **Why:** Standards-compliant entry point for browser rendering.

---

### B. Core Application Shell & Styling

#### 5. [`frontend/src/main.tsx`](frontend/src/main.tsx:1)
- **What is done:** Initializes the React 19 root using `createRoot` and wraps the top-level `<App />` inside `<BrowserRouter>`.
- **How:** Mounts to `#root` DOM element with React Strict Mode.
- **Why:** Serves as the central bootstrapping routine for client-side routing.

#### 6. [`frontend/src/App.tsx`](frontend/src/App.tsx:1)
- **What is done:** Hosts the global responsive site header (`brand`, navigation links), main `<Routes>` routing switchboard, and privacy-respecting site footer.
- **How:** Declares routes for Home, Kids Zone, Coloring (standard, Mandala, Creature Maker, Color by Number), Puzzles (Memory Match, Maze, Connect the Dots, Word Search), Learning (Math Fun, Science Explorer, English, Hindi, Bengali), Brain Games (Chess Practice, Sudoku, Word Builder, Cosmic Clue Hunt, Codebreaker, Pattern Detective, Maze With a Twist, Riddle & Logic Challenge, Little Thinkers, Logic Lab), Drawing Studio, and Parents/About/Privacy pages.
- **Why:** Provides a single, clean navigation hierarchy across all ages and game categories.

#### 7. [`frontend/src/styles.css`](frontend/src/styles.css:1)
- **What is done:** Global CSS stylesheet defining the warm, accessible theme palette (`--ink: #2b2d42`, `--bg: #fff9ec`, `--brand: #7b2ff7`), responsive grid layouts, button/chip interactions, SVG game boards, chess styles, sudoku grids, and the custom English Fun dictionary presentation.
- **How:** Custom CSS variables, media queries, accessibility focus rings (`:focus-visible`), touch targets, and subtle animations (pulse audio, bounce effects).
- **Why:** Eliminates heavyweight UI library dependencies while ensuring fast load times and consistent child-friendly aesthetics.

---

### C. Common Data & Utility Libraries

#### 8. [`frontend/src/data/ageGroups.ts`](frontend/src/data/ageGroups.ts:1)
- **What is done:** Defines the 3 foundational age tiers:
  - `explorers`: Little Explorers (Ages 2–5)
  - `curious`: Curious Minds (Ages 5–9)
  - `creative`: Creative Minds (Ages 10–12)
- **How:** Exports `AGE_GROUPS` array, `AgeGroupId` type, and `isAgeGroupId()` type guard.
- **Why:** Provides a centralized, uniform age classification used across all game pickers, difficulty filters, and routing search params.

#### 9. [`frontend/src/lib/random.ts`](frontend/src/lib/random.ts:1)
- **What is done:** Implements seedable pseudo-random number generator (PRNG) using Linear Congruential Generator / Mulberry algorithms (`createPrng(seed)`).
- **How:** Exposes methods `nextFloat()`, `nextInt(min, max)`, `pick(array)`, and `shuffle(array)`.
- **Why:** Enables repeatable puzzles and generative artwork where any child can replay the exact same seed or share a specific puzzle code with a classmate.

#### 10. [`frontend/src/data/coloringPages.ts`](frontend/src/data/coloringPages.ts:1), [`frontend/src/data/additionalPages.ts`](frontend/src/data/additionalPages.ts:1), [`frontend/src/data/morePages.ts`](frontend/src/data/morePages.ts:1)
- **What is done:** Curated SVG path geometry definitions for coloring sheets (animals, nature, vehicles, outer space, fantasy, architecture).
- **How:** Exports structured SVG region paths with default fill colors and clickable boundaries.
- **Why:** Separates vector art content from rendering logic, making it easy to add new coloring pages.

#### 11. [`frontend/src/data/colorByNumber.ts`](frontend/src/data/colorByNumber.ts:1)
- **What is done:** Provides color-by-number page layouts mapping region numeric identifiers (1–8) to color swatch palettes.
- **How:** Defines regions with numbered centers and target color indices.
- **Why:** Allows younger children to practice number recognition and color coordination.

---

### D. Shared UI Components

#### 12. [`frontend/src/components/SeedPicker.tsx`](frontend/src/components/SeedPicker.tsx:1)
- **What is done:** UI widget allowing kids or teachers to type a custom numeric seed or tap "Randomize" to generate fresh puzzle boards.
- **How:** Manages input validation and triggers callback with new seed number.
- **Why:** Encourages repeatability and classroom challenge sharing.

#### 13. [`frontend/src/components/GeneratedColoringPage.tsx`](frontend/src/components/GeneratedColoringPage.tsx:1)
- **What is done:** Dynamically renders procedural SVG patterns (like Mandalas or Creatures) into colorable vector paths.
- **How:** Intersects geometric polygons and outlines into interactive `<path>` nodes.
- **Why:** Bridges procedural math generators with the interactive coloring canvas.

---

### E. Learning Zone (Math, Science & Language)

#### 14. [`frontend/src/pages/Learning/LearningList.tsx`](frontend/src/pages/Learning/LearningList.tsx:1)
- **What is done:** Landing hub for Math Fun, Science Explorer, English Fun, Hindi Fun, and Bengali Fun.
- **How:** Grid of accessible cards with vivid category gradients and descriptive blurbs.
- **Why:** Easy entry point for curriculum-aligned foundational skill building.

#### 15. [`frontend/src/pages/Learning/MathPlay.tsx`](frontend/src/pages/Learning/MathPlay.tsx:1)
- **What is done:** Page wrapper for Math Fun with age group chips (2–5, 5–9, 10–12) and dynamic topic filter chips (Addition, Subtraction, Multiplication, Division, Geometry, Counting).
- **How:** Syncs selection with URL parameters and renders `<MathGame />`.
- **Why:** Allows customized practice sessions tailored to a child's current school level.

#### 16. [`frontend/src/games/math/mathState.ts`](frontend/src/games/math/mathState.ts:1) & [`frontend/src/games/math/MathGame.tsx`](frontend/src/games/math/MathGame.tsx:1)
- **What is done:** Generates randomized, age-appropriate arithmetic questions with multiple-choice visual options and immediate encouraging feedback.
- **How:** Pure state machine calculating correct answers, generating realistic distractor options, and tracking progress stars.
- **Why:** Reinforces mental math in a gamified, low-stress environment.

#### Science Explorer — [`frontend/src/games/science/ScienceExplorerGame.tsx`](frontend/src/games/science/ScienceExplorerGame.tsx:1)
- **What is done:** Topic-based science learning and quiz activity covering animals, plants, space, the human body, and Earth.
- **How:** Each topic has 15 authored questions, three difficulty levels, and three short learning cards. Quiz rounds contain five questions and explain the answer with a related fact.
- **Why:** Combines short readings with age-adjustable knowledge checks.

#### 17. [`frontend/src/games/english/englishTypes.ts`](frontend/src/games/english/englishTypes.ts:1)
- **What is done:** TypeScript interface definitions for English vocabulary entries:
  - `WordEntry`, `DictionaryMeaning`, `DictionaryDefinition`, `DictionaryPhonetic`, and `CuratedWord`.
- **How:** Strongly models parts of speech, phonetic spellings, audio URLs, definitions, examples, synonyms, antonyms, etymologies, and fun kid facts.
- **Why:** Ensures strict type safety across dictionary lookups and fallback models.

#### 18. [`frontend/src/games/english/wordBank.ts`](frontend/src/games/english/wordBank.ts:1)
- **What is done:** Rich, curated starter word repository organized across age groups (`explorers`, `curious`, `creative`) with offline fallback definitions, phonetic data, example sentences, synonyms, and kid-safe fun facts.
- **How:** Exports `CURATED_WORDS`, `getCuratedWordsByAge()`, and `getRandomCuratedWord()`.
- **Why:** Provides age-grouped word suggestions and locally authored starter data when a curated word is selected.

#### 19. [`frontend/src/games/english/dictionaryApi.ts`](frontend/src/games/english/dictionaryApi.ts:1)
- **What is done:** Dual-engine dictionary client integrating the open **Free Dictionary API** (`api.dictionaryapi.dev`) and the **Datamuse Lexical API** (`api.datamuse.com`), plus audio speech synthesis.
- **How:**
  - Primary lookup queries Free Dictionary API for full phonetic breakdowns, audio MP3 recordings, and etymology.
  - Secondary fallback automatically queries Datamuse if the primary endpoint times out, 404s, or encounters network hiccups, parsing parts of speech, definitions, synonyms, and antonyms.
  - Curated words with fallback data are served locally; other lookups depend on the external services being available.
  - Implements in-memory session caching (`Map<string, WordEntry>`) and safe timeout handling.
  - Provides dual audio playback: native dictionary recorded MP3 or browser `window.speechSynthesis` (Web Speech API) calibrated at a gentle rate (0.85x) for kids.
- **Why:** Provides dictionary lookup without requiring app-managed API keys; network availability and third-party service behavior can affect results.

#### 20. [`frontend/src/games/english/sentenceValidator.ts`](frontend/src/games/english/sentenceValidator.ts:1)
- **Status:** Legacy validator module; it is not used by the current English game interface.

#### 20a. [`frontend/src/games/english/languageToolApi.ts`](frontend/src/games/english/languageToolApi.ts:1)
- **What is done:** Requests English (US) writing suggestions from LanguageTool's public check API when the user explicitly asks to check a sentence. Suggested replacements can be applied individually; no score or grade is assigned.
- **Privacy:** The sentence is sent to LanguageTool only after the user activates the check button, and the interface discloses this before checking.
- **How:** Sends a form-encoded request, validates response fields and suggestion offsets, and surfaces service errors to the user.

#### 21. [`frontend/src/games/english/EnglishGame.tsx`](frontend/src/games/english/EnglishGame.tsx:1)
- **What is done:** Interactive English Fun game component featuring:
  - Live search input + 🎲 Surprise Word button
  - Quick-pick suggested word chips
  - Word card with IPA phonetics and animated 🔊 Listen button
  - Color-coded Parts of Speech tabs (Noun, Verb, Adjective, etc.) with definition counts
  - Example sentences in highlighted quotes
  - Clickable Synonyms and Antonyms tags (clicking any word immediately explores it)
  - Word Origin / Etymology card & Fun Kid Fact box
  - **Word Builder Challenge** with child sentence input, sample-sentence inspiration, optional speech playback, and on-demand LanguageTool suggestions.
- **How:** React state hooks, transition hooks for smooth re-rendering, error handling, and accessible ARIA attributes.
- **Why:** Transforms abstract dictionary lookups into an engaging, multi-sensory word exploration adventure.

#### 22. [`frontend/src/pages/Learning/EnglishPlay.tsx`](frontend/src/pages/Learning/EnglishPlay.tsx:1)
- **What is done:** Route view for `/learning/english` with age group selectors and URL search param persistence (`?age=...&word=...`).
- **How:** Renders breadcrumb back links, age chips, and `<EnglishGame />`.
- **Why:** Fits seamlessly into the Little Minds Studio navigation framework.

#### 23. [`frontend/src/games/hindi/hindiTypes.ts`](frontend/src/games/hindi/hindiTypes.ts:1), [`hindiData.ts`](frontend/src/games/hindi/hindiData.ts:1), [`hindiApi.ts`](frontend/src/games/hindi/hindiApi.ts:1), [`hindiSpeech.ts`](frontend/src/games/hindi/hindiSpeech.ts:1), and [`HindiKeyboard.tsx`](frontend/src/games/hindi/HindiKeyboard.tsx:1)
- **What is done:** Hindi learning with curated vocabulary, optional Wiktionary and MyMemory lookups for other words, Devanagari script, Romanized transliteration, Hindi and English meanings, sample sentences, speech playback, and an on-screen Devanagari keyboard. A legacy sentence-validator module remains in the source but is not used by the game interface.
- **How:** Queries curated datasets and live open dictionary APIs with automatic transliteration, caching, and fallback.
- **Why:** Allows children to search ANY Hindi word (e.g. *कागज़*, *किताब*, *सूरज*) directly with on-screen keyboard support.

#### 24. [`frontend/src/games/hindi/HindiGame.tsx`](frontend/src/games/hindi/HindiGame.tsx:1) & [`frontend/src/pages/Learning/HindiPlay.tsx`](frontend/src/pages/Learning/HindiPlay.tsx:1)
- **What is done:** Interactive Hindi Fun view (`/learning/hindi`) featuring curated and searched words, an on-screen Devanagari keyboard, Surprise Word picker, voice pronunciation, sentence composition, and sample-sentence inspiration. It does not provide automatic sentence checking.
- **How:** React state management and responsive Indic typography layout.
- **Why:** Accessible, welcoming multilingual learning experience.

#### 25. [`frontend/src/games/bengali/bengaliTypes.ts`](frontend/src/games/bengali/bengaliTypes.ts:1), [`bengaliData.ts`](frontend/src/games/bengali/bengaliData.ts:1), [`bengaliApi.ts`](frontend/src/games/bengali/bengaliApi.ts:1), [`bengaliSpeech.ts`](frontend/src/games/bengali/bengaliSpeech.ts:1), and [`BengaliKeyboard.tsx`](frontend/src/games/bengali/BengaliKeyboard.tsx:1)
- **What is done:** Bengali learning with curated vocabulary, optional Wiktionary and MyMemory lookups for other words, Bengali script, Romanized transliteration, Bengali and English meanings, sample sentences, and an on-screen Bengali keyboard. Listening tries online Bengali audio, then an installed Bengali system voice; if neither is available it can use an approximate romanized fallback spoken with a Hindi voice. A legacy sentence-validator module remains in the source but is not used by the game interface.
- **How:** Queries curated datasets and live open dictionary APIs with automatic transliteration, caching, and fallback.
- **Why:** Allows children to search ANY Bengali word (e.g. *কাগজ*, *গাছ*, *বই*, *সূর্য*) directly with on-screen keyboard support.

#### 26. [`frontend/src/games/bengali/BengaliGame.tsx`](frontend/src/games/bengali/BengaliGame.tsx:1) & [`frontend/src/pages/Learning/BengaliPlay.tsx`](frontend/src/pages/Learning/BengaliPlay.tsx:1)
- **What is done:** Interactive Bengali Fun view (`/learning/bengali`) with curated and searched words, an on-screen Bengali keyboard, Surprise Word picker, voice playback, sentence composition, and sample-sentence inspiration. It does not provide automatic sentence checking.
- **How:** React state management with Indic typography.
- **Why:** Encourages joyful, interactive Bengali language exploration.

---

### F. Coloring Games & Studios

#### 27. [`frontend/src/pages/Coloring/ColoringList.tsx`](frontend/src/pages/Coloring/ColoringList.tsx:1) & [`frontend/src/pages/Coloring/ColoringPlay.tsx`](frontend/src/pages/Coloring/ColoringPlay.tsx:1)
- **What is done:** Catalog and play views for standard coloring pages.
- **How:** Lists pages filtered by category/age, loading vector art into the interactive coloring engine.
- **Why:** Classic creative digital coloring experience with undo/redo and save features.

#### 23. [`frontend/src/games/coloring/ColoringCanvas.tsx`](frontend/src/games/coloring/ColoringCanvas.tsx:1) & [`frontend/src/games/coloring/ColoringGame.tsx`](frontend/src/games/coloring/ColoringGame.tsx:1)
- **What is done:** Interactive SVG canvas handling click/tap region fills, brush selection, palette swapping, and completion celebration.
- **How:** Manages fill state per SVG region ID, with local storage persistence and print export.
- **Why:** Touch-accurate coloring without messy flood-fill canvas bleeding.

#### 24. [`frontend/src/pages/Coloring/MandalaPlay.tsx`](frontend/src/pages/Coloring/MandalaPlay.tsx:1) & [`frontend/src/games/mandala/mandala.ts`](frontend/src/games/mandala/mandala.ts:1)
- **What is done:** Procedural mandala generator producing symmetrical geometric coloring designs based on symmetry counts and seed values.
- **How:** Uses polar coordinate trigonometry to generate radial ring paths.
- **Why:** Encourages relaxation, focus, and geometric pattern appreciation for older kids (Ages 10–12).

#### 25. [`frontend/src/pages/Coloring/CreaturePlay.tsx`](frontend/src/pages/Coloring/CreaturePlay.tsx:1) & [`frontend/src/games/creature/creature.ts`](frontend/src/games/creature/creature.ts:1)
- **What is done:** Procedural creature generator synthesizing funny monsters, aliens, and robotic pets with customizable eyes, horns, bodies, and accessories.
- **How:** Algorithmic assembly of randomized vector components.
- **Why:** Sparks imaginative storytelling and endless coloring variety.

#### 26. [`frontend/src/pages/Coloring/ColorByNumberList.tsx`](frontend/src/pages/Coloring/ColorByNumberList.tsx:1), [`frontend/src/pages/Coloring/ColorByNumberPlay.tsx`](frontend/src/pages/Coloring/ColorByNumberPlay.tsx:1), & [`frontend/src/games/colorbynumber/ColorByNumberGame.tsx`](frontend/src/games/colorbynumber/ColorByNumberGame.tsx:1)
- **What is done:** Color-by-number game with numbered color swatches and matching canvas regions.
- **How:** Visual number hints and validation ensuring kids apply the matching palette index.
- **Why:** Fosters early number-to-symbol recognition and fine motor skills.

---

### G. Puzzle Games

#### 27. [`frontend/src/pages/Puzzles/PuzzleList.tsx`](frontend/src/pages/Puzzles/PuzzleList.tsx:1)
- **What is done:** Hub page listing all classic puzzles (Memory Match, Mazes, Connect the Dots, Word Search).
- **How:** Responsive tile grid with colorful category cards.
- **Why:** Central navigation for logical thinking and pattern games.

#### 28. [`frontend/src/games/memory/MemoryGame.tsx`](frontend/src/games/memory/MemoryGame.tsx:1) & [`frontend/src/games/memory/memoryState.ts`](frontend/src/games/memory/memoryState.ts:1)
- **What is done:** Card flip memory matching game with emojis and animal themes.
- **How:** Grid state machine tracking flipped cards, matches, move counters, and win conditions.
- **Why:** Builds short-term visual memory and focus.

#### 29. [`frontend/src/games/maze/MazeGame.tsx`](frontend/src/games/maze/MazeGame.tsx:1) & [`frontend/src/games/maze/maze.ts`](frontend/src/games/maze/maze.ts:1)
- **What is done:** Procedural maze generation using depth-first search (DFS) with randomized backtracking.
- **How:** On-screen directional D-pad or keyboard arrow controls guiding an emoji avatar to the exit.
- **Why:** Spatial reasoning and problem solving.

#### 30. [`frontend/src/games/connectdots/ConnectDotsGame.tsx`](frontend/src/games/connectdots/ConnectDotsGame.tsx:1) & [`frontend/src/games/connectdots/connectdots.ts`](frontend/src/games/connectdots/connectdots.ts:1)
- **What is done:** Sequential dot-to-dot line drawing game revealing animal silhouettes upon completion.
- **How:** Tracks current target dot index and draws dynamic SVG lines between connected coordinates.
- **Why:** Reinforces sequential number counting and motor control.

#### 31. [`frontend/src/games/wordsearch/WordSearchGame.tsx`](frontend/src/games/wordsearch/WordSearchGame.tsx:1), [`frontend/src/games/wordsearch/wordsearch.ts`](frontend/src/games/wordsearch/wordsearch.ts:1), & [`frontend/src/games/wordsearch/words.ts`](frontend/src/games/wordsearch/words.ts:1)
- **What is done:** Dynamic grid word search generator placing words horizontally, vertically, and diagonally with letter selection.
- **How:** Collision-free matrix word placement algorithm with drag/tap word validation.
- **Why:** Enhances word recognition, spelling, and visual scanning.

---

### H. Brain Games & Advanced Logic

#### 32. [`frontend/src/pages/BrainGames/BrainGamesList.tsx`](frontend/src/pages/BrainGames/BrainGamesList.tsx:1)
- **What is done:** Category portal for high-level logic, deduction, and tactical strategy games.
- **How:** Routes to Little Thinkers, Chess Practice, Sudoku, Word Builder, Cosmic Clue Hunt, Codebreaker, Pattern Detective, Maze With a Twist, Riddle & Logic Challenge, and Logic Lab.
- **Why:** Dedicated hub for deeper cognitive challenges.

#### 33. [`frontend/src/games/chess/ChessGame.tsx`](frontend/src/games/chess/ChessGame.tsx:1) & [`frontend/src/pages/BrainGames/ChessPractice.tsx`](frontend/src/pages/BrainGames/ChessPractice.tsx:1)
- **What is done:** Kid-friendly chess trainer powered by `chess.js` with legal move highlights, capture indicators, and beginner-friendly AI responses.
- **How:** Renders interactive 8x8 chessboard with unicode chess symbols and move validation rules.
- **Why:** Teaches tactical foresight, spatial strategy, and patience.

#### 34. [`frontend/src/games/sudoku/SudokuGame.tsx`](frontend/src/games/sudoku/SudokuGame.tsx:1) & [`frontend/src/games/sudoku/sudoku.ts`](frontend/src/games/sudoku/sudoku.ts:1)
- **What is done:** 4x4 (for beginners) and 9x9 Sudoku puzzles generated with unique solutions.
- **How:** Backtracking solver and puzzle digger with conflict checking and on-screen number pad.
- **Why:** Develops deductive reasoning and numerical logic without arithmetic.

#### 35. [`frontend/src/games/wordbuilder/WordBuilderGame.tsx`](frontend/src/games/wordbuilder/WordBuilderGame.tsx:1) & [`frontend/src/pages/BrainGames/WordBuilderPlay.tsx`](frontend/src/pages/BrainGames/WordBuilderPlay.tsx:1)
- **What is done:** Scrabble-style anagram puzzle where kids rearrange letter tiles on a wooden rack to form target words.
- **How:** Interactive tile rack state management with point scoring.
- **Why:** Expands vocabulary and phonemic awareness.

#### 36. [`frontend/src/games/cosmicclues/CosmicCluesGame.tsx`](frontend/src/games/cosmicclues/CosmicCluesGame.tsx:1) & [`frontend/src/games/cosmicclues/cosmicClues.ts`](frontend/src/games/cosmicclues/cosmicClues.ts:1)
- **What is done:** Space-themed deduction puzzle where children use clues to locate a hidden planet in a grid.
- **How:** Offers Easy (4×4), Medium (5×5), and Hard (6×6) boards with generated clues and interactive investigation.
- **Why:** Fosters logical deduction and hypothesis testing.

#### Additional Brain Games
- **Codebreaker:** Deduce a hidden color sequence from feedback on guesses.
- **Pattern Detective:** Find the missing or next item in shape, color, and number patterns.
- **Maze With a Twist:** Navigate a maze, collect a key, and unlock the gate to reach the goal.
- **Riddle & Logic Challenge:** Solve riddles, brain teasers, and logic questions. The route remains `/brain-games/what-comes-next`.

#### 37. [`frontend/src/games/earlybrain/EarlyBrainGames.tsx`](frontend/src/games/earlybrain/EarlyBrainGames.tsx:1) & [`frontend/src/games/earlybrain/earlyBrainData.ts`](frontend/src/games/earlybrain/earlyBrainData.ts:1)
- **What is done:** Cognitive games for toddlers and preschoolers (Odd One Out, Shadow Matching, Size Ordering).
- **How:** High-contrast emoji cards with audio feedback and celebratory stars.
- **Why:** Builds early perceptual discrimination and categorization skills.

#### 38. [`frontend/src/games/blockslider/BlockSliderGame.tsx`](frontend/src/games/blockslider/BlockSliderGame.tsx:1)
- **What is done:** Rush Hour-style vehicle unblock puzzle where kids slide obstacles horizontally or vertically to clear an exit path for the yellow car.
- **How:** 2D grid collision physics with move counters and minimum-move ratings.
- **Why:** Enhances multi-step spatial planning and algorithmic thinking.

#### 39. [`frontend/src/games/arithmeticgrid/ArithmeticGridGame.tsx`](frontend/src/games/arithmeticgrid/ArithmeticGridGame.tsx:1) & [`frontend/src/games/arithmeticgrid/arithmeticGrid.ts`](frontend/src/games/arithmeticgrid/arithmeticGrid.ts:1)
- **What is done:** KenKen / Calcudoku style cage puzzle combining Sudoku non-repeating digits with target math operations (e.g., "7+", "12x").
- **How:** Procedural cage partitioning with arithmetic constraint verification.
- **Why:** Integrates logic deduction directly with mental math fluency.

#### 40. [`frontend/src/games/rubikscube/RubiksCubeGame.tsx`](frontend/src/games/rubikscube/RubiksCubeGame.tsx:1)
- **What is done:** Interactive 2x2 / 3x3 3D Rubik's Cube simulation rendered with pure CSS 3D transforms.
- **How:** Simulates 3D cube rotations (U, D, L, R, F, B) and scramble algorithms with keyboard and touch buttons.
- **Why:** High-level 3D spatial rotation and sequential memory training.

---

### I. Drawing Studio

#### 41. [`frontend/src/pages/Drawing/DrawingPlay.tsx`](frontend/src/pages/Drawing/DrawingPlay.tsx:1), [`frontend/src/games/drawing/DrawingStudio.tsx`](frontend/src/games/drawing/DrawingStudio.tsx:1), & [`frontend/src/games/drawing/drawing.ts`](frontend/src/games/drawing/drawing.ts:1)
- **What is done:** Freeform digital art studio with brush sizing, rainbow colors, eraser, bucket flood-fill, stickers/stamps, undo/redo history, and PNG download.
- **How:** HTML5 `<canvas>` 2D rendering context with smooth Bézier stroke interpolation and touch prevention (`touch-action: none`).
- **Why:** Unconstrained creative expression and fine motor coordination.

---

### J. General, Informational & Policy Pages

#### 42. [`frontend/src/pages/Home/Home.tsx`](frontend/src/pages/Home/Home.tsx:1)
- **What is done:** Hero landing page directing children to Kids Zone or specific category hubs (Coloring, Puzzles, Learning, Brain Games, Drawing).
- **How:** High-contrast friendly card grid with clear typography and age entry button.
- **Why:** Welcoming, intuitive starting point for children.

#### 43. [`frontend/src/pages/KidsZone/KidsZone.tsx`](frontend/src/pages/KidsZone/KidsZone.tsx:1)
- **What is done:** Age-first entry portal allowing kids to select "Little Explorers (2–5)", "Curious Minds (5–9)", or "Creative Minds (10–12)".
- **How:** Maps directly into age-filtered game views.
- **Why:** Direct, age-appropriate content curation.

#### 44. [`frontend/src/pages/Parents/Parents.tsx`](frontend/src/pages/Parents/Parents.tsx:1), [`frontend/src/pages/Parents/Privacy.tsx`](frontend/src/pages/Parents/Privacy.tsx:1), & [`frontend/src/pages/Parents/About.tsx`](frontend/src/pages/Parents/About.tsx:1)
- **What is done:** Parent and teacher information describing the current activity areas, broad age guidance, and privacy details. The privacy policy is marked as a draft for legal review and makes no compliance claim.
- **How:** The Parents page links to Coloring and Drawing, Puzzles, Learning Zone, and Brain Games. The About page provides a direct email link; there is no feedback form.
- **Why:** Builds trust with schools, teachers, and guardians.

#### 45. [`frontend/src/pages/ComingSoon.tsx`](frontend/src/pages/ComingSoon.tsx:1)
- **What is done:** Graceful 404 and placeholder page with a quick link back to the homepage.
- **How:** Displays friendly illustrations and back navigation.
- **Why:** Prevents dead ends in user exploration.

---

## 4. Verification and Quality Assurance

- **Build Validation:** `npm run build` runs the TypeScript compiler and Vite production build. Run it before release.
- **Cross-Platform Compatibility:** The application is responsive, but verify layouts, touch controls, keyboard navigation, and device-specific behavior on supported browsers and real devices before release.
- **Speech Playback:** Availability and pronunciation depend on network access, browser capabilities, and installed system voices. Bengali may fall back to approximate romanized speech; audio playback is not guaranteed in every environment.

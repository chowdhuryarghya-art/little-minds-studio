# Little Minds Studio

Little Minds Studio is a free learning and creativity website for children ages 2–12. Children can play without creating an account; games do not contain purchases or ads.

## What is included

- **Coloring and Drawing:** SVG coloring pages, Color by Number, Mandala Maker, Creature Maker, and a free-draw studio.
- **Puzzles:** Memory Match, Mouse Maze, Connect the Dots, and Word Search.
- **Learning Zone:** Math Fun, Science Explorer, English Fun, Hindi Fun, and Bengali Fun.
- **Early Learning (ages 2–5):** shuffled first-letter word matching, number names and recognition from 1–100, read-along stories with sentence-matched illustrated scenes, object-counting and feelings rounds that shuffle without repeating until their set is used, and pre-writing tracing.
- **Science Explorer:** Five topics (animals, plants, space, the human body, and Earth), with 15 questions per topic, Easy/Medium/Hard levels, short learning cards, and explanations.
- **Brain Games:** Chess Practice, Sudoku, Word Builder, Cosmic Clue Hunt (4×4, 5×5, and 6×6 levels), Codebreaker, Pattern Detective, Maze With a Twist, Riddle & Logic Challenge, Little Thinkers, and Logic Lab.
- **Language practice:** Word searches, sample sentences, and speech playback. Word Explorer checks English, Hindi, and Bengali search terms against the local starter blocklists in `frontend/src/games/safety/profanity/` before querying DictionaryAPI.dev (English) or Wiktionary (Hindi/Bengali). These lists are not exhaustive, and external dictionary entries are not reviewed for age suitability.

Word Explorer search terms are sent to the corresponding dictionary provider after the local blocklist check. Bengali speech playback and English sentence suggestions also use third-party online services; sentence text is sent to LanguageTool only when the user requests suggestions. Coloring progress and drawings are stored in the browser on the device. The Privacy Policy is a draft and needs legal review before public launch.

## Development

Requires Node.js 20.19+ or 22.12+.

```powershell
cd frontend
npm install
npm run dev
npm run build
```

Vite serves the development site at `http://127.0.0.1:5173`.

## Website deployment

The website can be deployed independently of the native app projects. For Vercel, use `frontend` as the project root, `npm run build` as the build command, and `dist` as the output directory. Capacitor Android and iOS folders are not needed to build or deploy the website.

## Native app projects

Android and iOS Capacitor shells are included for possible future app releases; their presence does not mean the apps have been launched. After changing the frontend, build and sync the native projects:

```powershell
cd frontend
npm run build
npm run cap:sync
```

Open the native projects with `npm run cap:android` or `npm run cap:ios`. Android development requires Android Studio and its SDK. iOS development and builds require macOS with Xcode. Test touch interactions, small-screen layouts, and device-specific features on real devices before release.

## Project layout

```text
frontend/
  src/
    data/       Age groups and activity data
    games/      Game and learning activity implementations
    pages/      Route components
```

Capacitor projects are in `frontend/android/` and `frontend/ios/`. The backend and database directories are deferred; the current website is a client-side application.

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import SeedPicker from '../../components/SeedPicker.tsx'
import WordSearchGame from '../../games/wordsearch/WordSearchGame.tsx'
import { getTheme, isThemeId, THEMES } from '../../games/wordsearch/words.ts'
import type { ThemeId } from '../../games/wordsearch/words.ts'
import { parseSeed, randomSeed } from '../../lib/random.ts'

export default function WordSearchPlay() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : 'explorers'
  const themeParam = params.get('theme')
  // No theme (or an unknown one in the link) means a mix of words from everything.
  const theme: ThemeId | undefined = isThemeId(themeParam) ? themeParam : undefined
  // A fresh random puzzle when the link has no (valid) puzzle number.
  const [fallbackSeed] = useState(randomSeed)
  const seed = parseSeed(params.get('seed')) ?? fallbackSeed

  const update = (next: { age?: AgeGroupId; seed?: number; theme?: ThemeId | null }) => {
    const nextTheme = next.theme === undefined ? theme : (next.theme ?? undefined)
    const query: Record<string, string> = { age: next.age ?? age, seed: String(next.seed ?? seed) }
    if (nextTheme) query.theme = nextTheme
    setParams(query)
  }

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/puzzles">
          ← Puzzle Games
        </Link>
      </p>
      <h1>Word Search{theme ? `: ${getTheme(theme).name}` : ''}</h1>
      <div className="chips" role="group" aria-label="Choose difficulty">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`chip${age === g.id ? ' selected' : ''}`}
            onClick={() => update({ age: g.id })}
          >
            {g.name} ({g.ages})
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label="Choose a topic">
        <button
          type="button"
          className={`chip${theme === undefined ? ' selected' : ''}`}
          onClick={() => update({ theme: null })}
        >
          Any topic
        </button>
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`chip${theme === t.id ? ' selected' : ''}`}
            onClick={() => update({ theme: t.id })}
          >
            {t.name}
          </button>
        ))}
      </div>
      <SeedPicker label="Puzzle" seed={seed} onSelect={(s) => update({ seed: s })} />
      {/* key makes a new puzzle (and resets progress) when difficulty, topic or number changes */}
      <WordSearchGame key={`${age}-${theme ?? 'any'}-${seed}`} age={age} seed={seed} theme={theme} />
    </section>
  )
}

import { useState } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard'
type Challenge = {
  id: string
  pattern: string
  choices: string[]
  answer: string
  explanation: string
}

const CHALLENGES: Record<Difficulty, Challenge[]> = {
  easy: [
    { id: 'easy-1', pattern: '🔴 🔵 🔴 🔵 🔴 ?', choices: ['🔴', '🔵', '🟢'], answer: '🔵', explanation: 'The colors take turns: red, blue, red, blue.' },
    { id: 'easy-2', pattern: '⭐ 🌙 ⭐ 🌙 ⭐ ?', choices: ['⭐', '🌙', '☀️'], answer: '🌙', explanation: 'A star and a moon alternate.' },
    { id: 'easy-3', pattern: '🐱 🐱 🐶 🐱 🐱 ?', choices: ['🐱', '🐶', '🐰'], answer: '🐶', explanation: 'Two cats are followed by one dog.' },
    { id: 'easy-4', pattern: '🍎 🍌 🍎 🍌 🍎 ?', choices: ['🍎', '🍌', '🍇'], answer: '🍌', explanation: 'The apple and banana repeat in order.' },
  ],
  medium: [
    { id: 'medium-1', pattern: '🔺 🔺 🔵 🔺 🔺 🔵 ?', choices: ['🔺', '🔵', '🟩'], answer: '🔺', explanation: 'Two triangles, then one circle; the pattern starts again.' },
    { id: 'medium-2', pattern: '1, 3, 5, 7, ?', choices: ['8', '9', '10'], answer: '9', explanation: 'Add 2 each time to get the next odd number.' },
    { id: 'medium-3', pattern: '🟡 🟢 🟢 🟡 🟢 🟢 ?', choices: ['🟡', '🟢', '🔵'], answer: '🟡', explanation: 'One yellow is followed by two green circles.' },
    { id: 'medium-4', pattern: '2, 4, 8, 16, ?', choices: ['18', '24', '32'], answer: '32', explanation: 'Each number doubles: 2, 4, 8, 16, 32.' },
  ],
  hard: [
    { id: 'hard-1', pattern: '1, 1, 2, 3, 5, 8, ?', choices: ['11', '13', '15'], answer: '13', explanation: 'Add the previous two numbers: 5 + 8 = 13.' },
    { id: 'hard-2', pattern: '2, 5, 10, 17, 26, ?', choices: ['35', '36', '37'], answer: '37', explanation: 'The steps grow by 2: add 3, 5, 7, 9, then 11.' },
    { id: 'hard-3', pattern: '🔺 🔵 🟩 🔺 🔵 🟩 🔺 ?', choices: ['🔺', '🔵', '🟩'], answer: '🔵', explanation: 'The triangle, circle, square sequence repeats.' },
    { id: 'hard-4', pattern: '3, 6, 12, 24, ?', choices: ['36', '42', '48'], answer: '48', explanation: 'Each number is twice the one before it.' },
  ],
}

const LEVELS: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

function chooseChallenge(difficulty: Difficulty, previousId?: string): Challenge {
  const options = CHALLENGES[difficulty].filter((challenge) => challenge.id !== previousId)
  return options[Math.floor(Math.random() * options.length)]
}

export default function PatternDetectiveGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [challenge, setChallenge] = useState(() => chooseChallenge('easy'))
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const nextChallenge = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setChallenge(chooseChallenge(nextDifficulty, nextDifficulty === difficulty ? challenge.id : undefined))
    setAnswer(null)
    if (nextDifficulty !== difficulty) setScore(0)
  }

  const isCorrect = answer === challenge.answer

  return (
    <div className="pattern-game">
      <div className="chips" role="group" aria-label="Pattern difficulty">
        {LEVELS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`chip${difficulty === id ? ' selected' : ''}`}
            aria-pressed={difficulty === id}
            onClick={() => nextChallenge(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="center muted">Score: {score}</p>
      <section className="pattern-card" aria-labelledby="pattern-question">
        <h2 id="pattern-question">What comes next?</h2>
        <p className="pattern-sequence" aria-label={`Pattern: ${challenge.pattern}`}>{challenge.pattern}</p>
        <div className="pattern-choices" role="group" aria-label="Choose what comes next">
          {challenge.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className={`tool pattern-choice${answer === choice ? (isCorrect ? ' correct' : ' incorrect') : ''}`}
              onClick={() => {
                if (answer !== null) return
                setAnswer(choice)
                if (choice === challenge.answer) setScore((current) => current + 1)
              }}
              disabled={answer !== null}
            >
              {choice}
            </button>
          ))}
        </div>
        {answer !== null && (
          <p className="center pattern-feedback" role="status">
            {isCorrect ? 'Great spotting!' : `Not quite — the answer is ${challenge.answer}.`} {challenge.explanation}
          </p>
        )}
      </section>
      <p className="center">
        <button type="button" className="tool" onClick={() => nextChallenge()}>Next pattern</button>
      </p>
    </div>
  )
}

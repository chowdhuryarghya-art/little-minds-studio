import { useReducer, useState } from 'react'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import {
  createMathState,
  createQuestions,
  isFinished,
  MATH_TOPIC_LABELS,
  mathReducer,
  QUESTIONS_PER_ROUND,
  TOPICS_BY_AGE,
} from './mathState.ts'
import type { MathTopic } from './mathState.ts'

function Round({
  age,
  topics,
  onRestart,
}: {
  age: AgeGroupId
  topics: MathTopic[]
  onRestart: () => void
}) {
  const [state, dispatch] = useReducer(mathReducer, age, (a) =>
    createMathState(createQuestions(a, QUESTIONS_PER_ROUND, Math.random, topics)),
  )

  if (isFinished(state)) {
    const total = state.questions.length
    return (
      <div className="math-result center">
        <p className="celebrate" role="status">
          🎉 You got {state.score} out of {total}!
        </p>
        <button type="button" className="btn" onClick={onRestart}>
          Play again
        </button>
      </div>
    )
  }

  const question = state.questions[state.index]
  const answered = state.picked !== null

  return (
    <div className="math-game">
      <p className="center muted">
        Question {state.index + 1} of {state.questions.length} · Score {state.score}
      </p>
      <p className="center muted math-topic">{MATH_TOPIC_LABELS[question.topic]}</p>
      <p className="math-prompt" aria-live="polite">
        {question.prompt}
      </p>
      <div className="math-options">
        {question.options.map((option) => {
          let cls = 'math-option'
          if (answered && option === question.answer) cls += ' correct'
          else if (answered && option === state.picked) cls += ' wrong'
          return (
            <button
              key={option}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => dispatch({ type: 'answer', value: option })}
            >
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <p className="center" role="status">
          {state.picked === question.answer
            ? 'Correct! Well done!'
            : `Nice try! The answer is ${question.answer}.`}
        </p>
      )}
      {!answered && (
        <p className="center muted" role="status">Choose an answer to continue.</p>
      )}
      <p className="center">
        <button
          type="button"
          className="btn"
          disabled={!answered}
          onClick={() => dispatch({ type: 'next' })}
        >
          {state.index + 1 === state.questions.length ? 'See score' : 'Next'}
        </button>
      </p>
    </div>
  )
}

export default function MathGame({
  age,
  topics = TOPICS_BY_AGE[age],
}: {
  age: AgeGroupId
  topics?: MathTopic[]
}) {
  const [round, setRound] = useState(0)
  // key remounts Round, generating fresh questions
  return (
    <Round
      key={round}
      age={age}
      topics={topics}
      onRestart={() => setRound((r) => r + 1)}
    />
  )
}

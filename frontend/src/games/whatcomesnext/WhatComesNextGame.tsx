import { useState } from 'react'

type Question = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  explanation: string
}

const QUESTIONS: Question[] = [
  { id: 'count-1', prompt: 'A farmer has 3 apples and gives you 2 more. How many apples do you have?', choices: ['2', '3', '5'], answer: '5', explanation: 'Three apples plus two more makes five.' },
  { id: 'logic-1', prompt: 'Which one does not belong?', choices: ['🐟 Fish', '🐬 Dolphin', '🦈 Shark'], answer: '🐬 Dolphin', explanation: 'A dolphin is a mammal that breathes air; a fish and shark use gills.' },
  { id: 'logic-2', prompt: 'Mia is taller than Ben. Ben is taller than Lee. Who is the shortest?', choices: ['Mia', 'Ben', 'Lee'], answer: 'Lee', explanation: 'Lee is shorter than Ben, and Ben is shorter than Mia.' },
  { id: 'riddle-1', prompt: 'I have hands but cannot clap. What am I?', choices: ['A clock', 'A tree', 'A book'], answer: 'A clock', explanation: 'A clock has hands that point to the time.' },
  { id: 'riddle-2', prompt: 'The more you take away from me, the bigger I get. What am I?', choices: ['A hole', 'A balloon', 'A sandwich'], answer: 'A hole', explanation: 'Taking more dirt away makes a hole bigger.' },
  { id: 'logic-3', prompt: 'A red house is made of red bricks. A blue house is made of blue bricks. What is a greenhouse made of?', choices: ['Green bricks', 'Glass', 'Wood'], answer: 'Glass', explanation: 'A greenhouse is usually made of glass so sunlight can get in.' },
  { id: 'count-2', prompt: 'There are 4 birds on a branch. 1 flies away. How many are left?', choices: ['3', '4', '5'], answer: '3', explanation: 'Four birds minus one bird leaves three.' },
  { id: 'logic-4', prompt: 'Which comes first in alphabetical order?', choices: ['🐻 Bear', '🐜 Ant', '🐱 Cat'], answer: '🐜 Ant', explanation: 'Ant starts with A, before Bear (B) and Cat (C).' },
  { id: 'riddle-3', prompt: 'What has a face and two hands but no arms or legs?', choices: ['A clock', 'A robot', 'A doll'], answer: 'A clock', explanation: 'A clock face has two hands to show the time.' },
  { id: 'logic-5', prompt: 'Sam has 2 sisters. Each sister has 1 brother. How many brothers are there?', choices: ['1', '2', '3'], answer: '1', explanation: 'Both sisters share the same brother: Sam.' },
]

function chooseQuestion(previousId?: string): Question {
  const options = QUESTIONS.filter((question) => question.id !== previousId)
  return options[Math.floor(Math.random() * options.length)]
}

export default function WhatComesNextGame() {
  const [question, setQuestion] = useState(() => chooseQuestion())
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const isCorrect = answer === question.answer
  const nextQuestion = () => {
    setQuestion(chooseQuestion(question.id))
    setAnswer(null)
  }

  return (
    <div className="comes-next-game">
      <p className="center muted">Correct answers: {score} of {answered}</p>
      <section className="pattern-card" aria-labelledby="comes-next-question">
        <h2 id="comes-next-question">{question.prompt}</h2>
        <div className="pattern-choices" role="group" aria-label="Choose your answer">
          {question.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className={`tool comes-next-choice${answer === choice ? (isCorrect ? ' correct' : ' incorrect') : ''}`}
              onClick={() => {
                if (answer !== null) return
                setAnswer(choice)
                setAnswered((current) => current + 1)
                if (choice === question.answer) setScore((current) => current + 1)
              }}
              disabled={answer !== null}
            >
              {choice}
            </button>
          ))}
        </div>
        {answer !== null && (
          <p className="center pattern-feedback" role="status">
            {isCorrect ? 'That’s right!' : `Good try! The answer is ${question.answer}.`} {question.explanation}
          </p>
        )}
      </section>
      <p className="center">
        <button type="button" className="tool" onClick={nextQuestion}>Next question</button>
      </p>
    </div>
  )
}

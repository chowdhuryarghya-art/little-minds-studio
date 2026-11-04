import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScienceExplorerGame, {
  SCIENCE_DIFFICULTIES,
  SCIENCE_LESSONS,
  SCIENCE_TOPIC_LABELS,
  SCIENCE_TOPICS,
} from '../../games/science/ScienceExplorerGame.tsx'
import type {
  ScienceDifficulty,
  ScienceTopicFilter,
} from '../../games/science/ScienceExplorerGame.tsx'

export default function ScienceExplorerPlay() {
  const [topic, setTopic] = useState<ScienceTopicFilter>('all')
  const [difficulty, setDifficulty] = useState<ScienceDifficulty>('easy')
  const lessons = topic === 'all'
    ? SCIENCE_TOPICS.map((item) => SCIENCE_LESSONS[item][0])
    : SCIENCE_LESSONS[topic]

  return (
    <section className="page narrow">
      <p><Link className="back-link" to="/learning">← Learning Zone</Link></p>
      <h1 className="center">Science Explorer</h1>
      <p className="center muted">Explore animals, plants, space, the human body, and our planet.</p>
      <h2 className="center">Choose a topic</h2>
      <div className="chips science-topics" role="group" aria-label="Filter science topics">
        <button
          type="button"
          className={`chip${topic === 'all' ? ' selected' : ''}`}
          aria-pressed={topic === 'all'}
          onClick={() => setTopic('all')}
        >
          All topics
        </button>
        {SCIENCE_TOPICS.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip${topic === item ? ' selected' : ''}`}
            aria-pressed={topic === item}
            onClick={() => setTopic(item)}
          >
            {SCIENCE_TOPIC_LABELS[item]}
          </button>
        ))}
      </div>
      <section className="science-lessons" aria-labelledby="science-lessons-title">
        <h2 id="science-lessons-title" className="center">Learn something new</h2>
        <p className="center muted">
          {topic === 'all' ? 'Choose a topic to see more learning cards.' : `A few things to know about ${SCIENCE_TOPIC_LABELS[topic].toLowerCase()}.`}
        </p>
        <div className="science-lesson-grid">
          {lessons.map((lesson) => (
            <article key={lesson.title} className="science-lesson-card">
              <h3>{lesson.title}</h3>
              <p>{lesson.text}</p>
            </article>
          ))}
        </div>
      </section>
      <h2 className="center">Choose your quiz level</h2>
      <div className="chips science-difficulties" role="group" aria-label="Science quiz difficulty">
        {SCIENCE_DIFFICULTIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`chip${difficulty === id ? ' selected' : ''}`}
            aria-pressed={difficulty === id}
            onClick={() => setDifficulty(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <ScienceExplorerGame key={`${topic}:${difficulty}`} topic={topic} difficulty={difficulty} />
    </section>
  )
}

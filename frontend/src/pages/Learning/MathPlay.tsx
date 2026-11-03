import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AGE_GROUPS, isAgeGroupId } from '../../data/ageGroups.ts'
import type { AgeGroupId } from '../../data/ageGroups.ts'
import MathGame from '../../games/math/MathGame.tsx'
import { MATH_TOPIC_LABELS, TOPICS_BY_AGE } from '../../games/math/mathState.ts'
import type { MathTopic } from '../../games/math/mathState.ts'

export default function MathPlay() {
  const [params, setParams] = useSearchParams()
  const ageParam = params.get('age')
  const age: AgeGroupId = isAgeGroupId(ageParam) ? ageParam : 'explorers'
  const topics = TOPICS_BY_AGE[age]
  const [selectedTopics, setSelectedTopics] = useState<MathTopic[]>([])

  useEffect(() => {
    setSelectedTopics([])
  }, [age])

  const allTopicsSelected =
    selectedTopics.length === 0 || selectedTopics.length === topics.length
  const activeTopics = allTopicsSelected ? topics : selectedTopics

  const toggleTopic = (topic: MathTopic) => {
    if (allTopicsSelected) {
      setSelectedTopics(topics.filter((item) => item !== topic))
      return
    }
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((item) => item !== topic))
      }
      return
    }
    const next = [...selectedTopics, topic]
    setSelectedTopics(next.length === topics.length ? [] : next)
  }

  return (
    <section className="page narrow">
      <p>
        <Link className="back-link" to="/learning">
          ← Learning Zone
        </Link>
      </p>
      <h1>Math Fun</h1>
      <div className="chips" role="group" aria-label="Choose difficulty">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`chip${age === g.id ? ' selected' : ''}`}
            onClick={() => setParams({ age: g.id })}
          >
            {g.name} ({g.ages})
          </button>
        ))}
      </div>
      <h2 className="center">Choose topics</h2>
      <p className="center muted">Questions from your selected topics are mixed into each round.</p>
      <div className="chips math-topics" role="group" aria-label="Filter math topics">
        <button
          type="button"
          className={`chip${allTopicsSelected ? ' selected' : ''}`}
          aria-pressed={allTopicsSelected}
          onClick={() => setSelectedTopics([])}
        >
          All topics
        </button>
        {topics.map((topic) => {
          const selected = activeTopics.includes(topic)
          return (
            <button
              key={topic}
              type="button"
              className={`chip${selected ? ' selected' : ''}`}
              aria-pressed={selected}
              onClick={() => toggleTopic(topic)}
            >
              {MATH_TOPIC_LABELS[topic]}
            </button>
          )
        })}
      </div>
      <MathGame key={`${age}:${activeTopics.join(',')}`} age={age} topics={activeTopics} />
    </section>
  )
}

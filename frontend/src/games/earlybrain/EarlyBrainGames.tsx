import { useState } from 'react'
import { ODD_ROUNDS, SHADOW_PICTURES, SIZE_ROUNDS } from './earlyBrainData.ts'
import type { SizeObject } from './earlyBrainData.ts'

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function OddOneOut() {
  const [roundOrder, setRoundOrder] = useState(() => shuffled(ODD_ROUNDS.map((_, index) => index)))
  const [roundIndex, setRoundIndex] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const round = ODD_ROUNDS[roundOrder[roundIndex]]
  const complete = roundIndex === ODD_ROUNDS.length - 1 && answer === round.oddOne

  const choose = (name: string) => {
    if (answer !== null) return
    setAnswer(name)
  }

  const next = () => {
    if (roundIndex === ODD_ROUNDS.length - 1) {
      setRoundOrder(shuffled(ODD_ROUNDS.map((_, index) => index)))
      setRoundIndex(0)
    } else {
      setRoundIndex((current) => current + 1)
    }
    setAnswer(null)
  }

  return (
    <div className="early-game">
      <p className="center muted">Picture {roundIndex + 1} of {ODD_ROUNDS.length} · mixed up each time</p>
      <h2 className="center early-question">{round.question}</h2>
      <div className="early-picture-grid">
        {round.options.map(({ name, emoji }) => (
          <button
            key={name}
            type="button"
            className={`early-picture${answer === name ? (name === round.oddOne ? ' correct' : ' incorrect') : ''}`}
            aria-label={name}
            aria-pressed={answer === name}
            disabled={answer !== null}
            onClick={() => choose(name)}
          >
            <span className="early-emoji" aria-hidden="true">{emoji}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
      <p className="center early-status" role="status" aria-live="polite">
        {answer === null
          ? 'Look carefully. Which picture is different?'
          : answer === round.oddOne
            ? 'That is the one! Great looking!'
            : 'Good try! Look for the picture that does not belong.'}
      </p>
      {answer !== null && (
        <p className="center">
          <button type="button" className="tool" onClick={next}>
            {complete ? 'Play again' : 'Next picture'}
          </button>
        </p>
      )}
    </div>
  )
}

function SizeSorting() {
  const [roundOrder, setRoundOrder] = useState(() => shuffled(SIZE_ROUNDS.map((_, index) => index)))
  const [roundIndex, setRoundIndex] = useState(0)
  const round = SIZE_ROUNDS[roundOrder[roundIndex]]
  const [objects, setObjects] = useState(() => shuffled(round))
  const [chosen, setChosen] = useState<SizeObject[]>([])
  const [message, setMessage] = useState('Tap the smallest thing first, then work up to the biggest.')
  const complete = chosen.length === round.length

  const choose = (item: SizeObject) => {
    if (complete || chosen.some((selected) => selected.name === item.name)) return
    const expected = round[chosen.length]
    if (item.size !== expected.size) {
      setMessage('Not quite. Try another one for this spot!')
      return
    }
    const next = [...chosen, item]
    setChosen(next)
    setMessage(next.length === round.length ? 'Amazing sorting! Smallest to biggest!' : 'That is right! Pick the next size.')
  }

  const restart = () => {
    if (roundIndex === SIZE_ROUNDS.length - 1) {
      const nextOrder = shuffled(SIZE_ROUNDS.map((_, index) => index))
      setRoundOrder(nextOrder)
      setObjects(shuffled(SIZE_ROUNDS[nextOrder[0]]))
      setRoundIndex(0)
    } else {
      const nextIndex = roundIndex + 1
      setObjects(shuffled(SIZE_ROUNDS[roundOrder[nextIndex]]))
      setRoundIndex(nextIndex)
    }
    setChosen([])
    setMessage('Tap the smallest thing first, then work up to the biggest.')
  }

  return (
    <div className="early-game">
      <p className="center muted">Size puzzle {roundIndex + 1} of {SIZE_ROUNDS.length}</p>
      <h2 className="center early-question">Put these in size order</h2>
      <p className="center muted">Tap the smallest one first, then work up to the biggest.</p>
      <div className="size-order" aria-label="Things sorted so far">
        {round.map((_, index) => {
          const item = chosen[index]
          return (
            <div className={`size-order-slot${item ? ' filled' : ''}`} key={index}>
              {item ? <><span aria-hidden="true">{item.emoji}</span><small>{index + 1}</small></> : <span aria-hidden="true">?</span>}
            </div>
          )
        })}
      </div>
      <div className="early-picture-grid size-choice-grid">
        {objects.map((item) => {
          const used = chosen.some((selected) => selected.name === item.name)
          return (
            <button
              key={item.name}
              type="button"
              className={`early-picture${used ? ' correct' : ''}`}
              aria-label={`${item.name}, ${['', 'small', 'medium-small', 'medium-large', 'large'][item.size]}`}
              aria-pressed={used}
              disabled={used || complete}
              onClick={() => choose(item)}
            >
              <span className="early-emoji" aria-hidden="true">{item.emoji}</span>
              <span>{item.name}</span>
            </button>
          )
        })}
      </div>
      <p className="center early-status" role="status" aria-live="polite">{message}</p>
      {complete && <p className="center"><button type="button" className="tool" onClick={restart}>{roundIndex === SIZE_ROUNDS.length - 1 ? 'Start a fresh set' : 'Next size puzzle'}</button></p>}
    </div>
  )
}

function ShadowMatching() {
  const [deal, setDeal] = useState(() => {
    const bag = shuffled(SHADOW_PICTURES)
    return { pictures: bag.slice(0, 4), remaining: bag.slice(4) }
  })
  const { pictures } = deal
  const [shadows, setShadows] = useState(() => shuffled(deal.pictures))
  const [roundNumber, setRoundNumber] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [message, setMessage] = useState('Choose a picture, then find its matching shadow.')
  const complete = matched.length === pictures.length

  const restart = () => {
    const bag = deal.remaining.length >= 4 ? deal.remaining : shuffled(SHADOW_PICTURES)
    const nextPictures = bag.slice(0, 4)
    setDeal({ pictures: nextPictures, remaining: bag.slice(4) })
    setShadows(shuffled(nextPictures))
    setSelected(null)
    setMatched([])
    setRoundNumber((current) => current + 1)
    setMessage('Choose a picture, then find its matching shadow.')
  }

  const choosePicture = (name: string) => {
    if (matched.includes(name)) return
    setSelected(name)
    setMessage(`Now find the shadow of the ${name.toLowerCase()}.`)
  }

  const chooseShadow = (name: string) => {
    if (selected === null || matched.includes(name)) return
    if (name === selected) {
      const next = [...matched, name]
      setMatched(next)
      setSelected(null)
      setMessage(next.length === pictures.length ? 'All the pictures and shadows match!' : 'A perfect match! Find another.')
    } else {
      setMessage('Not that shadow. Look at the shape again!')
      setSelected(null)
    }
  }

  return (
    <div className="early-game">
      <p className="center muted">Round {roundNumber} · 4 picture pairs · 40 pictures in the mix</p>
      <h2 className="center early-question">Find each matching shadow</h2>
      <p className="center muted">Tap a colorful picture, then tap its dark shadow. Pictures repeat only after you have seen them all.</p>
      <div className="shadow-match-board">
        <div className="shadow-column" role="group" aria-label="Color pictures">
          {pictures.map((picture) => (
            <button
              key={picture.name}
              type="button"
              className={`shadow-card${selected === picture.name ? ' selected' : ''}${matched.includes(picture.name) ? ' matched' : ''}`}
              aria-label={`${picture.name} picture`}
              aria-pressed={selected === picture.name}
              disabled={matched.includes(picture.name)}
              onClick={() => choosePicture(picture.name)}
            >
              <span aria-hidden="true">{picture.emoji}</span>
              <small>{picture.name}</small>
            </button>
          ))}
        </div>
        <div className="shadow-column" role="group" aria-label="Shadows">
          {shadows.map((picture) => (
            <button
              key={picture.name}
              type="button"
              className={`shadow-card shadow-silhouette${matched.includes(picture.name) ? ' matched' : ''}`}
              aria-label={`${picture.name} shadow`}
              disabled={selected === null || matched.includes(picture.name)}
              onClick={() => chooseShadow(picture.name)}
            >
              <span aria-hidden="true">{picture.emoji}</span>
              <small>Shadow</small>
            </button>
          ))}
        </div>
      </div>
      <p className="center early-status" role="status" aria-live="polite">{message}</p>
      {complete && <p className="center"><button type="button" className="tool" onClick={restart}>Play again</button></p>}
    </div>
  )
}

const GAMES = [
  { id: 'odd', label: 'Odd One Out' },
  { id: 'size', label: 'Size Sorting' },
  { id: 'shadow', label: 'Shadow Matching' },
] as const

export default function EarlyBrainGames() {
  const [active, setActive] = useState<(typeof GAMES)[number]['id']>('odd')
  return (
    <div className="age-brain-games">
      <div className="chips early-game-tabs" role="group" aria-label="Choose a Little Thinkers game">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`chip${active === game.id ? ' selected' : ''}`}
            aria-pressed={active === game.id}
            onClick={() => setActive(game.id)}
          >
            {game.label}
          </button>
        ))}
      </div>
      {active === 'odd' && <OddOneOut key="odd" />}
      {active === 'size' && <SizeSorting key="size" />}
      {active === 'shadow' && <ShadowMatching key="shadow" />}
    </div>
  )
}

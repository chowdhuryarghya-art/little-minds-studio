import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { LETTER_WORD_BANKS } from '../../games/earlylearning/letterWordBanks.ts'
import { StorybookIllustration } from '../../games/earlylearning/storyIllustrations.tsx'

const LETTERS = [
  { letter: 'A', example: 'Apple', image: '🍎' },
  { letter: 'B', example: 'Ball', image: '⚽' },
  { letter: 'C', example: 'Cat', image: '🐱' },
  { letter: 'D', example: 'Dog', image: '🐶' },
  { letter: 'E', example: 'Elephant', image: '🐘' },
  { letter: 'F', example: 'Fish', image: '🐟' },
  { letter: 'G', example: 'Grapes', image: '🍇' },
  { letter: 'H', example: 'House', image: '🏠' },
  { letter: 'I', example: 'Ice cream', image: '🍦' },
  { letter: 'J', example: 'Juice', image: '🧃' },
  { letter: 'K', example: 'Kite', image: '🪁' },
  { letter: 'L', example: 'Lion', image: '🦁' },
  { letter: 'M', example: 'Moon', image: '🌙' },
  { letter: 'N', example: 'Nest', image: '🪺' },
  { letter: 'O', example: 'Orange', image: '🍊' },
  { letter: 'P', example: 'Pineapple', image: '🍍' },
  { letter: 'Q', example: 'Queen', image: '👸' },
  { letter: 'R', example: 'Rabbit', image: '🐰' },
  { letter: 'S', example: 'Sun', image: '☀️' },
  { letter: 'T', example: 'Tiger', image: '🐯' },
  { letter: 'U', example: 'Umbrella', image: '☂️' },
  { letter: 'V', example: 'Van', image: '🚐' },
  { letter: 'W', example: 'Whale', image: '🐳' },
  { letter: 'X', example: 'X-ray', image: '🩻' },
  { letter: 'Y', example: 'Yo-yo', image: '🪀' },
  { letter: 'Z', example: 'Zebra', image: '🦓' },
]
const ALL_LETTER_WORDS = Object.entries(LETTER_WORD_BANKS).flatMap(([letter, words]) =>
  words.map((word) => ({ letter, word })),
)

const STORIES = [
  {
    title: 'The Little Seed',
    lines: [
      'A little seed slept in the soil.',
      'Warm rain gave it a drink.',
      'The sun came out, and a green sprout popped up.',
      'Soon, a tiny flower waved hello.',
    ],
  },
  {
    title: 'Milo Shares',
    lines: [
      'Milo had a big box of crayons.',
      'His friend wanted to draw, too.',
      'Milo shared the blue crayon.',
      'Together, they made a picture of the sea.',
    ],
  },
  {
    title: 'The Rainy Walk',
    lines: [
      'Rain tapped softly on the window.',
      'Nia put on her boots and held an umbrella.',
      'She spotted a shiny puddle beside a little snail.',
      'After the rain, a rainbow stretched across the sky.',
    ],
  },
  { title: 'A Helpful Helper', lines: ['Ravi saw books on the floor.', 'He picked them up one by one.', 'He put them back on the shelf.', 'His classroom looked neat again.'] },
  { title: 'The Lost Mitten', lines: ['Mina found a mitten by the gate.', 'She asked her teacher whose it was.', 'A little boy smiled and waved.', 'Mina helped him find its pair.'] },
  { title: 'A Picnic for Pip', lines: ['Pip packed an apple and a little snack.', 'The family walked to a shady tree.', 'They watched ants march by.', 'Pip carried the wrapper home.'] },
  { title: 'The Wobbly Tower', lines: ['Sam stacked blocks very high.', 'The tower wobbled and fell.', 'Sam took a breath and tried again.', 'This time, the tower stood strong.'] },
  { title: 'Where Is the Moon?', lines: ['The sky grew dark and quiet.', 'Lea looked up from her window.', 'A bright moon peeked through the clouds.', 'Lea waved goodnight to the moon.'] },
  { title: 'The Garden Surprise', lines: ['A tiny green leaf poked through the soil.', 'Nico gave the plant a little water.', 'Days passed, and a bud appeared.', 'A yellow flower opened in the sun.'] },
  { title: 'The Squeaky Wheel', lines: ['A toy truck stopped rolling.', 'A wheel had come loose.', 'Tara asked for help to fix it.', 'Soon the truck rolled across the room.'] },
  { title: 'A Home for the Bird', lines: ['A small bird looked for a safe branch.', 'It carried soft grass in its beak.', 'It made a cozy nest in the tree.', 'The bird chirped a happy song.'] },
  { title: 'The Blue Umbrella', lines: ['Clouds covered the sunny sky.', 'Arun opened his blue umbrella.', 'He and his sister walked through the rain.', 'At home, they left the umbrella to dry.'] },
  { title: 'A Very Sleepy Bear', lines: ['Bear played outside all morning.', 'He ate lunch and drank some water.', 'His eyes began to close.', 'Bear snuggled up for a quiet rest.'] },
  { title: 'The Sharing Box', lines: ['There were many crayons in a box.', 'Asha chose red and gave Ben the blue.', 'They drew a big rainbow together.', 'Both friends added a yellow sun.'] },
  { title: 'The Puddle Boat', lines: ['Rain made a puddle by the path.', 'Jo folded a paper boat with a grown-up.', 'The boat floated gently on the water.', 'They watched it sail, then picked it up.'] },
  { title: 'The Busy Bees', lines: ['A bee buzzed around the garden.', 'It visited a bright flower.', 'Yellow pollen dusted its tiny legs.', 'The bee flew home to its hive.'] },
  { title: 'The Quiet Library', lines: ['Nora chose a book about the sea.', 'She turned each page carefully.', 'A picture showed a tiny seahorse.', 'Nora told her friend what she saw.'] },
  { title: 'The Missing Sock', lines: ['One sock was on the bed.', 'The other sock was under a chair.', 'Omar looked carefully around the room.', 'He found the pair and got dressed.'] },
  { title: 'A Kite in the Breeze', lines: ['The wind puffed softly through the park.', 'Maya held her kite string tightly.', 'The kite rose up into the blue sky.', 'Maya ran and laughed with her family.'] },
]

function SleepyBearIllustration({ sceneIndex, thumbnail = false }: { sceneIndex: number; thumbnail?: boolean }) {
  const descriptions = [
    'A happy bear plays with a ball outside on a sunny morning.',
    'A bear eats a sandwich and drinks a glass of water at lunch.',
    'A bear feels sleepy, yawns, and begins to close its eyes.',
    'A sleepy bear snuggles under a blanket on a pillow for a quiet rest.',
  ]

  return (
    <svg
      className={`early-story-illustration${thumbnail ? ' early-story-thumbnail' : ''}`}
      viewBox="0 0 360 220"
      role="img"
      aria-label={descriptions[sceneIndex]}
    >
      {sceneIndex === 0 && (
        <>
          <rect width="360" height="220" rx="18" fill="#c9efff" />
          <circle cx="305" cy="42" r="25" fill="#ffd45c" />
          <path d="M0 151 Q76 119 146 151 T290 145 T360 151 V220 H0Z" fill="#83d47b" />
          <path d="M0 181 Q87 151 177 184 T360 176 V220 H0Z" fill="#56b968" />
          <path d="M40 43h65m-48-13v27m-8-18h38m165-6h36" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
          <path d="M145 145q-18 25-2 38m61-38q20 23 5 38" fill="none" stroke="#79502f" strokeWidth="13" strokeLinecap="round" />
          <ellipse cx="176" cy="134" rx="42" ry="48" fill="#b8793e" />
          <path d="M146 129q-27-13-31 6m88-5q25-20 33-1" fill="none" stroke="#b8793e" strokeWidth="13" strokeLinecap="round" />
          <circle cx="176" cy="86" r="42" fill="#c98a4a" />
          <circle cx="145" cy="57" r="15" fill="#a96837" />
          <circle cx="207" cy="57" r="15" fill="#a96837" />
          <circle cx="145" cy="57" r="7" fill="#e9a978" />
          <circle cx="207" cy="57" r="7" fill="#e9a978" />
          <ellipse cx="176" cy="101" rx="22" ry="16" fill="#f3c28b" />
          <circle cx="163" cy="82" r="4" fill="#34251d" />
          <circle cx="189" cy="82" r="4" fill="#34251d" />
          <ellipse cx="176" cy="96" rx="5" ry="4" fill="#34251d" />
          <path d="M168 105q8 11 17 0" fill="none" stroke="#713b31" strokeWidth="3" strokeLinecap="round" />
          <circle cx="74" cy="155" r="19" fill="#ff6b72" />
          <path d="M55 155h38M74 136v38" stroke="#fff" strokeWidth="3" opacity=".8" />
          <path d="M37 147l-13-7m16 0-12-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M279 171v21m-9-11h18" stroke="#fff4a8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="324" cy="186" r="5" fill="#ff91b5" />
        </>
      )}
      {sceneIndex === 1 && (
        <>
          <rect width="360" height="220" rx="18" fill="#fff0cf" />
          <rect x="28" y="23" width="72" height="68" rx="8" fill="#bdeaff" stroke="#fff" strokeWidth="7" />
          <path d="M64 24v66M30 57h67" stroke="#fff" strokeWidth="5" />
          <circle cx="292" cy="46" r="17" fill="#ffd45c" />
          <path d="M0 170h360v50H0z" fill="#d99b66" />
          <path d="M107 151h150l22 18H86z" fill="#b8794a" />
          <path d="M140 107q-11 21-4 42m85-42q12 19 4 42" fill="none" stroke="#79502f" strokeWidth="12" strokeLinecap="round" />
          <ellipse cx="180" cy="105" rx="44" ry="50" fill="#b8793e" />
          <circle cx="180" cy="61" r="39" fill="#c98a4a" />
          <circle cx="151" cy="35" r="14" fill="#a96837" />
          <circle cx="209" cy="35" r="14" fill="#a96837" />
          <circle cx="151" cy="35" r="6" fill="#e9a978" />
          <circle cx="209" cy="35" r="6" fill="#e9a978" />
          <ellipse cx="180" cy="77" rx="21" ry="15" fill="#f3c28b" />
          <circle cx="167" cy="57" r="4" fill="#34251d" />
          <circle cx="193" cy="57" r="4" fill="#34251d" />
          <ellipse cx="180" cy="73" rx="5" ry="4" fill="#34251d" />
          <path d="M174 81q6 10 13 0" fill="none" stroke="#713b31" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="178" cy="159" rx="45" ry="11" fill="#fff" />
          <path d="M146 157l15-14 15 14 15-14 16 14" fill="#f6bd59" stroke="#df8e3f" strokeWidth="3" strokeLinejoin="round" />
          <path d="M259 126h22l5 39h-32z" fill="#9fe7f3" stroke="#62bfd4" strokeWidth="3" />
          <path d="M255 137h29" stroke="#62bfd4" strokeWidth="3" />
          <path d="M220 108q19 1 32 18" fill="none" stroke="#b8793e" strokeWidth="9" strokeLinecap="round" />
          <path d="M242 122l9 5-7 8" fill="none" stroke="#79502f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {sceneIndex === 2 && (
        <>
          <rect width="360" height="220" rx="18" fill="#e6e9ff" />
          <rect y="170" width="360" height="50" fill="#c3a9e8" />
          <circle cx="304" cy="47" r="28" fill="#fff4b8" />
          <path d="M42 169v-59q0-12 12-12h43q12 0 12 12v59" fill="#9ab8e8" />
          <path d="M48 124h55" stroke="#d7e8ff" strokeWidth="5" />
          <ellipse cx="184" cy="150" rx="51" ry="47" fill="#b8793e" />
          <circle cx="184" cy="95" r="46" fill="#c98a4a" />
          <circle cx="149" cy="63" r="15" fill="#a96837" />
          <circle cx="219" cy="63" r="15" fill="#a96837" />
          <circle cx="149" cy="63" r="7" fill="#e9a978" />
          <circle cx="219" cy="63" r="7" fill="#e9a978" />
          <ellipse cx="184" cy="111" rx="23" ry="17" fill="#f3c28b" />
          <path d="M164 91q8 7 16 0m8 0q8 7 16 0" fill="none" stroke="#34251d" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="184" cy="106" rx="5" ry="4" fill="#34251d" />
          <ellipse cx="184" cy="119" rx="7" ry="10" fill="#713b31" />
          <path d="M245 66q10-14 20 0t20 0" fill="none" stroke="#8c75c7" strokeWidth="4" strokeLinecap="round" />
          <path d="M270 92q8-11 16 0t16 0" fill="none" stroke="#8c75c7" strokeWidth="4" strokeLinecap="round" />
          <path d="M115 73l5-11m-13 22-12-2m24 7-9 8" stroke="#8c75c7" strokeWidth="3" strokeLinecap="round" />
          <path d="M152 178q31 18 62 0" fill="none" stroke="#8b5a36" strokeWidth="7" strokeLinecap="round" />
        </>
      )}
      {sceneIndex === 3 && (
        <>
          <rect width="360" height="220" rx="18" fill="#e9eaff" />
          <rect x="33" y="24" width="76" height="62" rx="8" fill="#bdeaff" stroke="#fff" strokeWidth="7" />
          <path d="M71 25v60M35 55h74" stroke="#fff" strokeWidth="5" />
          <path d="M61 176h240q16 0 16 16v14H45v-14q0-16 16-16" fill="#9875ca" />
          <rect x="60" y="135" width="240" height="48" rx="18" fill="#f6b6cf" />
          <rect x="75" y="125" width="95" height="44" rx="18" fill="#fff" />
          <ellipse cx="177" cy="165" rx="66" ry="37" fill="#c98a4a" />
          <circle cx="151" cy="111" r="14" fill="#a96837" />
          <circle cx="205" cy="111" r="14" fill="#a96837" />
          <circle cx="151" cy="111" r="6" fill="#e9a978" />
          <circle cx="205" cy="111" r="6" fill="#e9a978" />
          <ellipse cx="178" cy="141" rx="39" ry="34" fill="#c98a4a" />
          <ellipse cx="178" cy="151" rx="19" ry="13" fill="#f3c28b" />
          <path d="M161 137q7 6 14 0m7 0q7 6 14 0" fill="none" stroke="#34251d" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="178" cy="148" rx="4" ry="3" fill="#34251d" />
          <path d="M119 179q60-33 119 0v30H119z" fill="#78b8e8" />
          <path d="M270 45l7 14 15 2-11 10 3 15-14-7-13 7 3-15-11-10 15-2z" fill="#ffd45c" />
          <path d="M235 71l5 9 10 1-7 7 2 10-10-5-9 5 2-10-7-7 10-1z" fill="#fff4b8" />
        </>
      )}
    </svg>
  )
}

const COUNTING_OBJECTS = [
  { picture: '🍓', name: 'strawberries' },
  { picture: '🐥', name: 'chicks' },
  { picture: '⭐', name: 'stars' },
  { picture: '🐠', name: 'fish' },
  { picture: '🍎', name: 'apples' },
  { picture: '🦋', name: 'butterflies' },
  { picture: '🌼', name: 'flowers' },
  { picture: '🚗', name: 'cars' },
  { picture: '🐢', name: 'turtles' },
  { picture: '🍌', name: 'bananas' },
  { picture: '🎈', name: 'balloons' },
  { picture: '🐸', name: 'frogs' },
  { picture: '🌙', name: 'moons' },
  { picture: '🧸', name: 'teddy bears' },
  { picture: '🍪', name: 'cookies' },
  { picture: '🐞', name: 'ladybugs' },
  { picture: '🚌', name: 'buses' },
  { picture: '🌈', name: 'rainbows' },
  { picture: '🐰', name: 'rabbits' },
  { picture: '🍐', name: 'pears' },
  { picture: '🐝', name: 'bees' },
  { picture: '🪁', name: 'kites' },
  { picture: '🥕', name: 'carrots' },
  { picture: '🐌', name: 'snails' },
]

const COUNTING_ROUNDS = COUNTING_OBJECTS.flatMap((object) =>
  Array.from({ length: 10 }, (_, index) => ({ ...object, count: index + 1 })),
)

const TRACING_PATHS = [
  { name: 'Straight line', path: 'M 35 90 L 265 90' },
  { name: 'Wavy line', path: 'M 30 95 C 70 25, 110 25, 150 95 S 230 165, 270 95' },
  { name: 'Zigzag', path: 'M 35 135 L 100 45 L 165 135 L 230 45 L 265 90' },
  { name: 'Circle', path: 'M 205 90 A 55 55 0 1 1 95 90 A 55 55 0 1 1 205 90' },
]

const FEELINGS = [
  {
    situation: 'A friend asks to play with your toy.',
    question: 'How might your friend feel?',
    choices: ['😊 Happy', '😟 Worried', '😢 Sad', '😠 Frustrated'],
  },
  {
    situation: 'Your tall block tower falls down.',
    question: 'How might you feel?',
    choices: ['😢 Sad', '😠 Frustrated', '😊 Happy', '😮 Surprised'],
  },
  {
    situation: 'You are trying a new game with your class.',
    question: 'How might you feel?',
    choices: ['😃 Excited', '😟 Nervous', '😐 Unsure', '😊 Calm'],
  },
  { situation: 'A friend invites you to join a game.', question: 'How might you feel?', choices: ['😊 Happy', '😃 Excited', '😐 Unsure', '😟 Nervous'] },
  { situation: 'You cannot find your favorite toy.', question: 'How might you feel?', choices: ['😢 Sad', '😟 Worried', '😠 Frustrated', '😐 Unsure'] },
  { situation: 'You finish a puzzle you worked hard on.', question: 'How might you feel?', choices: ['😊 Proud', '😃 Excited', '😌 Calm', '😮 Surprised'] },
  { situation: 'It is time to say goodbye after a fun day.', question: 'How might you feel?', choices: ['😢 Sad', '😊 Happy', '😐 Unsure', '😌 Calm'] },
  { situation: 'A loud clap of thunder rumbles outside.', question: 'How might you feel?', choices: ['😟 Worried', '😮 Surprised', '😐 Unsure', '😌 Calm'] },
  { situation: 'Someone helps you when you are stuck.', question: 'How might you feel?', choices: ['😊 Thankful', '😌 Calm', '😃 Happy', '😮 Surprised'] },
  { situation: 'You are waiting for your turn on the slide.', question: 'How might you feel?', choices: ['😃 Excited', '😐 Impatient', '😌 Calm', '😟 Nervous'] },
  { situation: 'Your drawing tears by accident.', question: 'How might you feel?', choices: ['😢 Sad', '😠 Frustrated', '😮 Surprised', '😐 Unsure'] },
  { situation: 'You hear a new song you really like.', question: 'How might you feel?', choices: ['😊 Happy', '😃 Excited', '😌 Calm', '😮 Surprised'] },
  { situation: 'You are meeting a new friend for the first time.', question: 'How might you feel?', choices: ['😃 Excited', '😟 Nervous', '😐 Unsure', '😊 Happy'] },
  { situation: 'You drop some blocks and a friend helps pick them up.', question: 'How might you feel?', choices: ['😊 Thankful', '😮 Surprised', '😌 Calm', '😊 Happy'] },
  { situation: 'You are learning to tie your shoes and it takes time.', question: 'How might you feel?', choices: ['😠 Frustrated', '😐 Patient', '😊 Proud', '😟 Worried'] },
  { situation: 'Your family claps for your song.', question: 'How might you feel?', choices: ['😊 Proud', '😃 Excited', '😮 Surprised', '😊 Happy'] },
  { situation: 'You see a tiny caterpillar on a leaf.', question: 'How might you feel?', choices: ['😮 Curious', '😊 Happy', '😟 Worried', '😌 Calm'] },
  { situation: 'You have to put away toys before moving to the next game.', question: 'How might you feel?', choices: ['😐 Disappointed', '😌 Calm', '😠 Frustrated', '😊 Ready'] },
  { situation: 'A friend says they do not want to share a toy yet.', question: 'How might you feel?', choices: ['😢 Sad', '😐 Disappointed', '😠 Frustrated', '😌 Calm'] },
  { situation: 'You hear a funny joke at story time.', question: 'How might you feel?', choices: ['😄 Amused', '😊 Happy', '😮 Surprised', '😌 Calm'] },
  { situation: 'You are about to try a new food.', question: 'How might you feel?', choices: ['😮 Curious', '😟 Unsure', '😃 Excited', '😌 Calm'] },
  { situation: 'You help a younger child reach a book.', question: 'How might you feel?', choices: ['😊 Helpful', '😊 Proud', '😌 Calm', '😃 Happy'] },
]

function shuffled<T>(items: readonly T[], avoidFirst?: T): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  if (result.length > 1 && result[0] === avoidFirst) {
    const swap = 1 + Math.floor(Math.random() * (result.length - 1))
    ;[result[0], result[swap]] = [result[swap], result[0]]
  }
  return result
}

function useShuffleDeck<T>(items: readonly T[]) {
  const [deck, setDeck] = useState(() => shuffled(items))
  const [index, setIndex] = useState(0)
  const next = () => {
    if (index + 1 < deck.length) {
      setIndex((current) => current + 1)
      return
    }
    setDeck(shuffled(items, deck[index]))
    setIndex(0)
  }
  const select = (item: T) => {
    setDeck([item, ...shuffled(items.filter((entry) => entry !== item))])
    setIndex(0)
  }
  return [deck[index], next, select] as const
}

type Activity = 'letters' | 'numbers' | 'stories' | 'counting' | 'tracing' | 'feelings'

const ACTIVITY_TABS: { id: Activity; label: string }[] = [
  { id: 'letters', label: 'Letters & sounds' },
  { id: 'numbers', label: 'Numbers 1–100' },
  { id: 'stories', label: 'Little stories' },
  { id: 'counting', label: 'Count objects' },
  { id: 'tracing', label: 'Pre-writing' },
  { id: 'feelings', label: 'Feelings' },
]

function LettersActivity() {
  const [index, setIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordDeck, setWordDeck] = useState(() => shuffled(LETTER_WORD_BANKS.A))
  const [picked, setPicked] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [exampleRevealed, setExampleRevealed] = useState(false)
  const item = LETTERS[index]
  const targetWord = wordDeck[wordIndex]

  const resetQuestion = () => {
    setPicked(null)
    setMessage('')
    setExampleRevealed(false)
  }

  const nextLetter = () => {
    const nextIndex = (index + 1) % LETTERS.length
    const nextItem = LETTERS[nextIndex]
    setIndex(nextIndex)
    setWordDeck(shuffled(LETTER_WORD_BANKS[nextItem.letter]))
    setWordIndex(0)
    resetQuestion()
  }

  const nextWord = () => {
    if (wordIndex + 1 < wordDeck.length) {
      setWordIndex((current) => current + 1)
    } else {
      setWordDeck(shuffled(LETTER_WORD_BANKS[item.letter], targetWord))
      setWordIndex(0)
    }
    resetQuestion()
  }

  const speakLetter = () => {
    if (!('speechSynthesis' in window)) {
      setMessage(`Say the letter ${item.letter}.`)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(item.letter)
    utterance.lang = 'en'
    window.speechSynthesis.speak(utterance)
    setMessage(`Listen to the letter ${item.letter}.`)
  }

  const choices = useMemo(() => {
    const distractors = shuffled(
      ALL_LETTER_WORDS.filter((entry) => entry.letter !== item.letter),
    ).slice(0, 2)
    return shuffled([targetWord, ...distractors.map((entry) => entry.word)])
  }, [item.letter, targetWord])

  return (
    <div className={`early-letters-layout${exampleRevealed ? ' has-revealed-example' : ''}`}>
      <div className="early-learning-card">
        <p className="center muted">
          Letter {item.letter} · Word {wordIndex + 1} of {wordDeck.length}
        </p>
        <div className="early-learning-letter-row">
          <p className="early-learning-letter" aria-label={`Letter ${item.letter}`}>
            {item.letter} <span>{item.letter.toLowerCase()}</span>
          </p>
          <button
            type="button"
            className="early-learning-reveal-trigger"
            aria-expanded={exampleRevealed}
            aria-label={exampleRevealed ? `Hide ${item.example} picture` : `Reveal ${item.example} picture`}
            aria-controls={exampleRevealed ? 'early-learning-example-panel' : undefined}
            onClick={() => setExampleRevealed((revealed) => !revealed)}
          >
            {exampleRevealed ? 'Hide picture' : 'Tap to reveal picture'}
          </button>
        </div>
        <p className="center">
          <button type="button" className="tool" onClick={speakLetter}>🔊 Hear letter</button>
        </p>
        <h2 className="center">Which word starts with the letter {item.letter}?</h2>
        <div className="early-learning-choices">
          {choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className={`early-word-choice${picked === choice ? ' selected' : ''}`}
              aria-pressed={picked === choice}
              onClick={() => setPicked(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {picked && (
          <p className="center early-learning-feedback" role="status" aria-live="polite">
            {picked === targetWord
              ? `Yes! “${targetWord}” starts with ${item.letter}.`
              : `Good try! “${targetWord}” starts with ${item.letter}.`}
          </p>
        )}
        {message && <p className="center muted" role="status">{message}</p>}
        <p className="center">
          <button type="button" className="btn" onClick={nextWord}>Next word</button>{' '}
          <button type="button" className="tool" onClick={nextLetter}>Next letter</button>
        </p>
      </div>
      {exampleRevealed && (
        <aside
          id="early-learning-example-panel"
          className="early-learning-example-panel"
          aria-label={`${item.letter} for ${item.example}`}
        >
          <div className="early-learning-example-picture">
            <span role="img" aria-label={item.example}>{item.image}</span>
          </div>
          <div className="early-learning-example-info">
            {item.letter} for {item.example}
          </div>
        </aside>
      )}
    </div>
  )
}

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
]
const TEENS = [
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function numberName(number: number): string {
  if (number === 100) return 'one hundred'
  if (number < 10) return ONES[number]
  if (number < 20) return TEENS[number - 10]
  const tens = Math.floor(number / 10)
  const ones = number % 10
  return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`
}

const NUMBER_RANGES = [
  { start: 1, end: 20 },
  { start: 21, end: 40 },
  { start: 41, end: 60 },
  { start: 61, end: 80 },
  { start: 81, end: 100 },
]

function NumbersActivity() {
  const [rangeIndex, setRangeIndex] = useState(0)
  const [selected, setSelected] = useState(1)
  const range = NUMBER_RANGES[rangeIndex]
  const numbers = Array.from(
    { length: range.end - range.start + 1 },
    (_, index) => range.start + index,
  )

  const chooseRange = (index: number) => {
    setRangeIndex(index)
    setSelected(NUMBER_RANGES[index].start)
  }

  const speakNumber = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(numberName(selected))
    utterance.lang = 'en'
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="early-learning-card">
      <p className="center muted">Choose a group, then tap a number to learn its name.</p>
      <div className="chips early-number-ranges" role="group" aria-label="Choose a number range">
        {NUMBER_RANGES.map((item, index) => (
          <button
            key={item.start}
            type="button"
            className={`chip${rangeIndex === index ? ' selected' : ''}`}
            aria-pressed={rangeIndex === index}
            onClick={() => chooseRange(index)}
          >
            {item.start}–{item.end}
          </button>
        ))}
      </div>
      <div className="early-number-grid" role="group" aria-label={`Numbers ${range.start} to ${range.end}`}>
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            className={`early-number-tile${selected === number ? ' selected' : ''}`}
            aria-label={`${number}, ${numberName(number)}`}
            aria-pressed={selected === number}
            onClick={() => setSelected(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="early-number-name" aria-live="polite" aria-atomic="true">
        <span>{selected}</span>
        <strong>{numberName(selected)}</strong>
        <button type="button" className="tool" onClick={speakNumber}>
          🔊 Hear it
        </button>
      </div>
    </div>
  )
}

function StoriesActivity() {
  const [story, nextStory, selectStory] = useShuffleDeck(STORIES)
  const [message, setMessage] = useState('')
  const [activeLineIndex, setActiveLineIndex] = useState(0)
  const selectedStoryIndex = STORIES.findIndex((entry) => entry.title === story.title)

  const stopReading = () => {
    window.speechSynthesis?.cancel()
    setMessage('')
  }

  const openStory = (selectedStory: (typeof STORIES)[number]) => {
    stopReading()
    selectStory(selectedStory)
    setActiveLineIndex(0)
  }

  const readStory = () => {
    if (!('speechSynthesis' in window)) {
      setMessage('Read the story together out loud!')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.lines.join(' ')}`)
    utterance.lang = 'en'
    window.speechSynthesis.speak(utterance)
    setMessage('Listening to the story together?')
  }

  const showScene = (index: number) => {
    setActiveLineIndex(index)
    window.speechSynthesis?.cancel()
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(story.lines[index])
      utterance.lang = 'en'
      window.speechSynthesis.speak(utterance)
    }
    setMessage('Listen and look at the story scene.')
  }

  const currentLine = story.lines[activeLineIndex]
  const isSleepyBearStory = story.title === 'A Very Sleepy Bear'

  return (
    <div className="early-learning-card">
      <h2 className="center">{story.title}</h2>
      <details className="early-story-index">
        <summary>Browse all {STORIES.length} stories</summary>
        <ol className="early-story-index-list">
          {STORIES.map((entry, index) => (
            <li key={entry.title}>
              <button
                type="button"
                className={`early-story-index-item${selectedStoryIndex === index ? ' selected' : ''}`}
                aria-pressed={selectedStoryIndex === index}
                onClick={() => openStory(entry)}
              >
                <span>{index + 1}.</span>
                <span>{entry.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </details>
      <div className="early-story-visual" aria-live="polite">
        {isSleepyBearStory ? (
          <SleepyBearIllustration sceneIndex={activeLineIndex} />
        ) : (
          <StorybookIllustration title={story.title} sceneIndex={activeLineIndex} />
        )}
        <p>{currentLine}</p>
      </div>
      <div className="early-story-scenes" role="group" aria-label="Tap a story scene to hear it">
        {story.lines.map((line, index) => (
          <button
            key={line}
            type="button"
            className={`early-story-scene${activeLineIndex === index ? ' selected' : ''}`}
            aria-pressed={activeLineIndex === index}
            onClick={() => showScene(index)}
          >
            <span aria-hidden="true">
              {isSleepyBearStory
                ? <SleepyBearIllustration sceneIndex={index} thumbnail />
                : <StorybookIllustration title={story.title} sceneIndex={index} thumbnail />}
            </span>
            <span>{index + 1}. {line}</span>
          </button>
        ))}
      </div>
      <p className="center">
        <button type="button" className="btn" onClick={readStory}>🔊 Read story</button>{' '}
        <button
          type="button"
          className="tool"
          onClick={stopReading}
        >
          Stop
        </button>
      </p>
      {message && <p className="center muted" role="status">{message}</p>}
      <p className="center">
        <button
          type="button"
          className="btn"
          onClick={() => {
            nextStory()
            setActiveLineIndex(0)
            stopReading()
          }}
        >
          Next story
        </button>
      </p>
      <p className="center muted">Ask: What happened first? What do you think happens next?</p>
    </div>
  )
}

function CountingActivity() {
  const [round, nextRound] = useShuffleDeck(COUNTING_ROUNDS)
  const [picked, setPicked] = useState<number | null>(null)
  const options = useMemo(() => {
    const choices = new Set([round.count])
    while (choices.size < 5) choices.add(1 + Math.floor(Math.random() * 10))
    return shuffled([...choices])
  }, [round])

  return (
    <div className="early-learning-card">
      <p className="center muted">Count together, then choose a number.</p>
      <p className="early-counting-pictures" aria-label={`${round.count} ${round.name}`}>
        {Array.from({ length: round.count }, (_, item) => <span key={item}>{round.picture}</span>)}
      </p>
      <h2 className="center">How many {round.name}?</h2>
      <div className="early-learning-choices early-number-choices">
        {options.map((number) => (
          <button
            key={number}
            type="button"
            className={`early-learning-choice${picked === number ? ' selected' : ''}`}
            aria-pressed={picked === number}
            onClick={() => setPicked(number)}
          >
            {number}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className="center early-learning-feedback" role="status" aria-live="polite">
          {picked === round.count
            ? `That's right! You counted ${round.count}.`
            : `Let's count again: there are ${round.count}.`}
        </p>
      )}
      <p className="center">
        <button
          type="button"
          className="btn"
          onClick={() => {
            nextRound()
            setPicked(null)
          }}
        >
          Next counting game
        </button>
      </p>
    </div>
  )
}

function TracingActivity() {
  const [index, setIndex] = useState(0)
  const [drawing, setDrawing] = useState('')
  const isDrawing = useRef(false)
  const drawingPath = useRef('')
  const guide = TRACING_PATHS[index]

  const pointFor = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 300
    const y = ((event.clientY - bounds.top) / bounds.height) * 180
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  }

  const clearDrawing = () => {
    drawingPath.current = ''
    setDrawing('')
  }

  return (
    <div className="early-learning-card">
      <p className="center muted">Move your finger or mouse along the dotted path.</p>
      <h2 className="center">{guide.name}</h2>
      <svg
        className="early-tracing-board"
        viewBox="0 0 300 180"
        role="img"
        aria-label={`Tracing practice: ${guide.name}`}
        onPointerDown={(event) => {
          event.preventDefault()
          isDrawing.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          drawingPath.current = `M ${pointFor(event)}`
          setDrawing(drawingPath.current)
        }}
        onPointerMove={(event) => {
          if (isDrawing.current) {
            drawingPath.current += ` L ${pointFor(event)}`
            setDrawing(drawingPath.current)
          }
        }}
        onPointerUp={() => { isDrawing.current = false }}
        onPointerCancel={() => { isDrawing.current = false }}
        onLostPointerCapture={() => { isDrawing.current = false }}
      >
        <path className="early-tracing-guide" d={guide.path} />
        <path className="early-tracing-ink" d={drawing} />
      </svg>
      <p className="center">
        <button type="button" className="tool" onClick={clearDrawing}>Clear</button>{' '}
        <button
          type="button"
          className="btn"
          onClick={() => {
            setIndex((current) => (current + 1) % TRACING_PATHS.length)
            clearDrawing()
          }}
        >
          Next path
        </button>
      </p>
    </div>
  )
}

function FeelingsActivity() {
  const [activity, nextActivity] = useShuffleDeck(FEELINGS)
  const [picked, setPicked] = useState<string | null>(null)
  const choices = useMemo(() => shuffled(activity.choices), [activity])

  return (
    <div className="early-learning-card">
      <p className="center early-feeling-situation">{activity.situation}</p>
      <h2 className="center">{activity.question}</h2>
      <div className="early-feeling-choices">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={`early-feeling-choice${picked === choice ? ' selected' : ''}`}
            aria-pressed={picked === choice}
            onClick={() => setPicked(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {picked && (
        <div className="early-feeling-prompt" role="status" aria-live="polite">
          <strong>That could be how someone feels.</strong>
          <p>People can feel differently. We can ask, listen, and offer help.</p>
          <p>What kind thing could you say or do?</p>
        </div>
      )}
      <p className="center">
        <button
          type="button"
          className="btn"
          onClick={() => {
            nextActivity()
            setPicked(null)
          }}
        >
          Next situation
        </button>
      </p>
    </div>
  )
}

export default function EarlyLearningPlay() {
  const [activity, setActivity] = useState<Activity>('letters')

  return (
    <section className={`page narrow${activity === 'letters' ? ' early-learning-letters-page' : ''}`}>
      <p><Link className="back-link" to="/learning">← Learning Zone</Link></p>
      <h1 className="center">Early Learning</h1>
      <p className="center muted">Ages 2–5 · Explore together with a grown-up.</p>
      <div className="chips early-learning-tabs" role="group" aria-label="Choose an early learning activity">
        {ACTIVITY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`chip${activity === tab.id ? ' selected' : ''}`}
            aria-pressed={activity === tab.id}
            onClick={() => setActivity(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activity === 'letters' && <LettersActivity />}
      {activity === 'numbers' && <NumbersActivity />}
      {activity === 'stories' && <StoriesActivity />}
      {activity === 'counting' && <CountingActivity />}
      {activity === 'tracing' && <TracingActivity />}
      {activity === 'feelings' && <FeelingsActivity />}
      <p className="center muted early-learning-note">
        Short activities for practice and conversation—not a replacement for play, stories, or time with a teacher.
      </p>
    </section>
  )
}

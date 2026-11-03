import { useState } from 'react'

export const WORD_BANK = [
  'ACE', 'ACT', 'AGE', 'AIR', 'ANT', 'APE', 'ART', 'ASH', 'ASK', 'ATE',
  'BAD', 'BAG', 'BAM', 'BAT', 'BED', 'BEE', 'BEG', 'BIG', 'BIT', 'BOX',
  'BUG', 'BUS', 'BUY', 'CAB', 'CAN', 'CAP', 'CAR', 'CAT', 'COD', 'COW',
  'CUP', 'CUT', 'DAY', 'DEN', 'DIG', 'DOG', 'DOT', 'DRY', 'EAR', 'EAT',
  'EGG', 'ELF', 'END', 'ERA', 'EYE', 'FAN', 'FAR', 'FAT', 'FEW', 'FIG',
  'FIN', 'FIT', 'FIX', 'FLY', 'FUN', 'GAP', 'GAS', 'GEM', 'GET', 'GIG',
  'GUM', 'GUN', 'GUY', 'HAD', 'HAM', 'HAT', 'HEN', 'HER', 'HID', 'HIM',
  'HIP', 'HIT', 'HOP', 'HOT', 'HUG', 'ICE', 'INK', 'JAM', 'JAR', 'JET',
  'JOB', 'JOY', 'KEY', 'KID', 'KIT', 'LAP', 'LEG', 'LET', 'LID', 'LIE',
  'LIP', 'LOG', 'LOT', 'LOW', 'MAD', 'MAP', 'MAT', 'MEN', 'MIX', 'MOM',
  'MUD', 'MUG', 'NAP', 'NET', 'NEW', 'NOD', 'NOT', 'NUT', 'OAK', 'OAR',
  'OAT', 'ODD', 'OFF', 'OIL', 'OLD', 'ONE', 'OUR', 'OUT', 'OWL', 'OWN',
  'PAD', 'PAN', 'PAY', 'PEN', 'PET', 'PIE', 'PIG', 'PIN', 'PIT', 'POT',
  'PUB', 'PUP', 'PUT', 'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RED', 'RIB',
  'RIG', 'RIM', 'RIP', 'ROB', 'ROD', 'ROT', 'ROW', 'RUB', 'RUG', 'RUN',
  'SAD', 'SAP', 'SAT', 'SAW', 'SAY', 'SEA', 'SET', 'SHE', 'SIP', 'SIT',
  'SIX', 'SKI', 'SKY', 'SON', 'SPA', 'SPY', 'SUB', 'SUE', 'SUM', 'SUN',
  'TAG', 'TAN', 'TAP', 'TAR', 'TEA', 'TEN', 'THE', 'TIE', 'TIN', 'TIP',
  'TOE', 'TON', 'TOO', 'TOP', 'TOW', 'TRY', 'TUB', 'TWO', 'USE', 'VAN',
  'VET', 'VIA', 'VOW', 'WAR', 'WAS', 'WEB', 'WET', 'WHO', 'WHY', 'WIN',
  'WOK', 'YES', 'YET', 'ZIP', 'ZOO', 'ABLE', 'ACORN', 'AFTER', 'APPLE',
  'BEACH', 'BERRY', 'BIRD', 'BLAZE', 'BLUE', 'BRAIN', 'BRAVE', 'BREAD',
  'BRICK', 'BROWN', 'CANDY', 'CARRY', 'CHASE', 'CHEER', 'CHESS', 'CHIME',
  'CLOUD', 'COAST', 'CRANE', 'DANCE', 'DREAM', 'EAGER', 'EARTH', 'FAIRY',
  'FLAME', 'FLOUR', 'FLUTE', 'FRUIT', 'GIANT', 'GLOBE', 'GRAPE', 'GREEN',
  'HAPPY', 'HEART', 'HONEY', 'HORSE', 'HOUSE', 'JUICE', 'LEMON', 'LIGHT',
  'MAGIC', 'MANGO', 'MARCH', 'MUSIC', 'NIGHT', 'OCEAN', 'ORBIT', 'PAINT',
  'PEACH', 'PEARL', 'PIANO', 'PLANT', 'PLANE', 'PLUTO', 'QUEEN', 'QUICK',
  'QUIET', 'RABBIT', 'RIVER', 'ROBOT', 'ROUND', 'SCALE', 'SHARE', 'SHEEP',
  'SHINE', 'SHORE', 'SMILE', 'SPACE', 'SPOON', 'STAR', 'STONE', 'STORM',
  'SUGAR', 'TABLE', 'TIGER', 'TRAIL', 'TRAIN', 'TREAT', 'TULIP', 'VOICE',
  'WATER', 'WHALE', 'WHEAT', 'WORLD', 'WRITE', 'YOUNG', 'ZEBRA',
]

const LETTER_POINTS: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
}

type Tile = { id: number; letter: string }

function makeRack(usedWords: Set<string>, firstId: number): Tile[] {
  const choices = WORD_BANK.filter((word) => word.length <= 7 && !usedWords.has(word))
  const word = choices[Math.floor(Math.random() * choices.length)] ?? WORD_BANK[0]
  const letters = [...word]
  const alphabet = 'AAAABCDEEEEEFGHIIIIJKLMNNOOOOPRRRRSSSSTTTTTUUUVWY'
  while (letters.length < 7) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)])
  }
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  return letters.map((letter, index) => ({ id: firstId + index, letter }))
}

export default function WordBuilderGame() {
  const [rack, setRack] = useState<Tile[]>(() => makeRack(new Set(), 0))
  const [wordTiles, setWordTiles] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [status, setStatus] = useState('Tap your letter tiles to build a word.')
  const [usedWords, setUsedWords] = useState<string[]>([])

  const addTile = (tile: Tile) => {
    if (wordTiles.length >= 7) return
    setRack((current) => current.filter((item) => item.id !== tile.id))
    setWordTiles((current) => [...current, tile])
  }

  const removeTile = (tile: Tile) => {
    setWordTiles((current) => current.filter((item) => item.id !== tile.id))
    setRack((current) => [...current, tile].sort((a, b) => a.id - b.id))
  }

  const submitWord = () => {
    const word = wordTiles.map((tile) => tile.letter).join('')
    if (word.length < 3) {
      setStatus('Use at least 3 letters to make a word.')
      return
    }
    if (!WORD_BANK.includes(word)) {
      setStatus('We do not have that word in this kid-friendly word list. Try another!')
      return
    }
    if (usedWords.includes(word)) {
      setStatus('You already played that word. Build a different one!')
      return
    }

    const points = wordTiles.reduce((total, tile) => total + LETTER_POINTS[tile.letter], 0)
    const bonus = word.length >= 6 ? 5 : 0
    const earned = points + bonus
    const nextUsedWords = [...usedWords, word]
    setUsedWords(nextUsedWords)
    setScore((current) => current + earned)
    setRound((current) => current + 1)
    setWordTiles([])
    setRack(makeRack(new Set(nextUsedWords), round * 7))
    setStatus(`Great word! ${word} earned ${earned} points${bonus ? ' including a long-word bonus' : ''}.`)
  }

  const clearWord = () => {
    setRack((current) => [...current, ...wordTiles].sort((a, b) => a.id - b.id))
    setWordTiles([])
    setStatus('Tiles returned. Try a new word!')
  }

  return (
    <div className="word-builder">
      <div className="word-scoreboard" aria-label={`Score ${score}, round ${round}`}>
        <span><strong>Score</strong> {score}</span>
        <span><strong>Round</strong> {round}</span>
      </div>
      <p className="center muted">Make a word from 3 to 7 tiles. Longer words get a 5-point bonus!</p>
      <h2 className="center word-builder-heading">Your word</h2>
      <div className="word-build-row" role="group" aria-label="Your word. Tap a tile to return it.">
        {wordTiles.length ? wordTiles.map((tile) => (
          <button key={tile.id} type="button" className="letter-tile placed" onClick={() => removeTile(tile)}>
            <span>{tile.letter}</span><small>{LETTER_POINTS[tile.letter]}</small>
          </button>
        )) : <span className="word-placeholder">Tap tiles below to start</span>}
      </div>
      <h2 className="center word-builder-heading">Your letter tiles</h2>
      <div className="word-rack" role="group" aria-label="Available letter tiles">
        {rack.map((tile) => (
          <button key={tile.id} type="button" className="letter-tile" onClick={() => addTile(tile)}>
            <span>{tile.letter}</span><small>{LETTER_POINTS[tile.letter]}</small>
          </button>
        ))}
      </div>
      <div className="word-builder-actions">
        <button type="button" className="tool" onClick={submitWord}>Play word</button>
        <button type="button" className="tool" onClick={clearWord} disabled={!wordTiles.length}>Clear word</button>
      </div>
      <p className="center word-builder-status" role="status" aria-live="polite">{status}</p>
      {score >= 50 && <p className="celebrate center">🌟 Word star! You have scored 50 points!</p>}
      <p className="center muted word-builder-note">This game uses its own small word list, so some real words may not be included.</p>
    </div>
  )
}

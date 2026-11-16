import type { AgeGroupId } from '../../data/ageGroups.ts'
import { pick, randInt, shuffled } from '../../lib/random.ts'
import type { Random } from '../../lib/random.ts'

export const QUESTIONS_PER_ROUND = 10

export const MATH_TOPICS = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'factors',
  'money',
  'fractions',
  'time',
  'geometry',
  'decimals',
  'patterns',
  'number-sense',
] as const

export type MathTopic = (typeof MATH_TOPICS)[number]

export const MATH_TOPIC_LABELS: Record<MathTopic, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  factors: 'Factors',
  money: 'Money',
  fractions: 'Fractions',
  time: 'Time',
  geometry: 'Geometry',
  decimals: 'Decimals',
  patterns: 'Patterns',
  'number-sense': 'Number sense',
}

export const TOPICS_BY_AGE: Record<AgeGroupId, MathTopic[]> = {
  explorers: ['addition', 'subtraction', 'patterns', 'number-sense'],
  curious: [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'factors',
    'money',
    'fractions',
    'time',
    'geometry',
    'decimals',
  ],
  creative: [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'factors',
    'money',
    'fractions',
    'time',
    'geometry',
    'decimals',
  ],
}

export interface MathQuestion {
  prompt: string
  answer: string
  options: string[]
  topic: MathTopic
}

interface Draft {
  prompt: string
  answer: string
  choices?: string[]
}

type Generator = (random: Random, age: AgeGroupId) => Draft

function numberChoices(answer: number, random: Random, include: number[] = []): string[] {
  const options = new Set<number>([answer, ...include])
  let spread = 3
  while (options.size < 4) {
    const candidate = answer + randInt(random, -spread, spread)
    if (candidate >= 0) options.add(candidate)
    spread++
  }
  return shuffled(random, [...options]).map(String)
}

function numericQuestion(
  prompt: string,
  answer: number,
  random: Random,
  include: number[] = [],
): Draft {
  return { prompt, answer: String(answer), choices: numberChoices(answer, random, include) }
}

function unitQuestion(prompt: string, answer: number, unit: string, random: Random): Draft {
  const choices = numberChoices(answer, random).map((choice) => `${choice} ${unit}`)
  return { prompt, answer: `${answer} ${unit}`, choices }
}

function fractionChoices(answer: string, random: Random): string[] {
  const [answerNumerator, answerDenominator] = answer.split('/').map(Number)
  const alternatives = new Set<string>()
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  for (let denominator = 2; denominator <= 12; denominator++) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      const common = gcd(numerator, denominator)
      const reducedNumerator = numerator / common
      const reducedDenominator = denominator / common
      if (numerator * answerDenominator !== answerNumerator * denominator) {
        alternatives.add(`${reducedNumerator}/${reducedDenominator}`)
      }
    }
  }
  return shuffled(random, [answer, ...shuffled(random, [...alternatives]).slice(0, 3)])
}

function decimalChoices(answer: number, random: Random): string[] {
  const options = new Set([answer])
  for (const offset of [1, -1, 2, -2, 10, -10]) {
    if (answer + offset >= 0) options.add(answer + offset)
    if (options.size === 4) break
  }
  return shuffled(random, [...options]).map((value) => (value / 10).toFixed(1))
}

function sequence(start: number, step: number, random: Random): Draft {
  return numericQuestion(
    `${start}, ${start + step}, ${start + 2 * step}, ?`,
    start + 3 * step,
    random,
  )
}

const EXPLORER_GENERATORS: Partial<Record<MathTopic, Generator>> = {
  addition: (r) => {
    const a = randInt(r, 1, 5)
    const b = randInt(r, 1, 5)
    return numericQuestion(`${a} + ${b} = ?`, a + b, r)
  },
  subtraction: (r) => {
    const a = randInt(r, 2, 10)
    const b = randInt(r, 1, a - 1)
    return numericQuestion(`${a} − ${b} = ?`, a - b, r)
  },
  patterns: (r) => sequence(randInt(r, 1, 10), pick(r, [1, 2, 3]), r),
  'number-sense': (r) => {
    const a = randInt(r, 1, 10)
    let b = randInt(r, 1, 10)
    if (b === a) b = a === 10 ? 9 : a + 1
    const greater = r() < 0.5
    const answer = greater ? Math.max(a, b) : Math.min(a, b)
    return numericQuestion(`Which is ${greater ? 'bigger' : 'smaller'}: ${a} or ${b}?`, answer, r, [
      a,
      b,
    ])
  },
}

function level(age: AgeGroupId): 0 | 1 {
  return age === 'creative' ? 1 : 0
}

const GENERATORS: Record<Exclude<MathTopic, 'patterns' | 'number-sense'>, Generator> = {
  addition: (r, age) => {
    const max = level(age) ? 9999 : 999
    const minAddend = level(age) ? 100 : 10
    const a = randInt(r, minAddend, max - minAddend)
    const b = randInt(r, minAddend, max - a)
    return numericQuestion(`${a} + ${b} = ?`, a + b, r)
  },
  subtraction: (r, age) => {
    const min = level(age) ? 1000 : 20
    const a = randInt(r, min, level(age) ? 9999 : 999)
    const b = randInt(r, level(age) ? 100 : 10, a - 1)
    return numericQuestion(`${a} − ${b} = ?`, a - b, r)
  },
  multiplication: (r, age) => {
    const a = level(age) ? randInt(r, 12, 99) : randInt(r, 2, 20)
    const b = level(age) ? randInt(r, 12, 99) : randInt(r, 2, 12)
    return numericQuestion(`${a} × ${b} = ?`, a * b, r)
  },
  division: (r, age) => {
    const divisor = level(age) ? randInt(r, 2, 25) : randInt(r, 2, 12)
    const quotient = level(age) ? randInt(r, 12, 99) : randInt(r, 2, 12)
    return numericQuestion(`${divisor * quotient} ÷ ${divisor} = ?`, quotient, r)
  },
  factors: (r, age) => {
    if (!level(age)) {
      const factor = randInt(r, 2, 9)
      const product = factor * randInt(r, 2, 9)
      const alternatives = Array.from({ length: 10 }, (_, i) => i + 2).filter(
        (candidate) => product % candidate !== 0,
      )
      const answer = String(factor)
      return {
        prompt: `Which number is a factor of ${product}?`,
        answer,
        choices: shuffled(r, [answer, ...shuffled(r, alternatives).slice(0, 3).map(String)]),
      }
    }

    const a = randInt(r, 18, 60)
    const b = randInt(r, 18, 60)
    const divisors = (x: number) =>
      Array.from({ length: x }, (_, i) => i + 1).filter((n) => x % n === 0)
    const common = divisors(a).filter((n) => b % n === 0)
    const answer = Math.max(...common)
    const distractors = Array.from({ length: 60 }, (_, i) => i + 1).filter(
      (n) => n !== answer && (a % n !== 0 || b % n !== 0),
    )
    const answerText = String(answer)
    return {
      prompt: `What is the greatest common factor of ${a} and ${b}?`,
      answer: answerText,
      choices: shuffled(r, [answerText, ...shuffled(r, distractors).slice(0, 3).map(String)]),
    }
  },
  money: (r, age) => {
    const limit = level(age) ? 900 : 100
    const first = randInt(r, 5, Math.floor(limit / 2))
    const second = randInt(r, 1, Math.floor(limit / 2))
    const add = r() < 0.5
    const answer = add ? first + second : Math.abs(first - second)
    const prompt = add
      ? `A toy costs ₹${first} and a book costs ₹${second}. What is the total?`
      : `You have ₹${Math.max(first, second)} and spend ₹${Math.min(first, second)}. How much is left?`
    const options = new Set([answer, answer + 1, Math.max(0, answer - 1), answer + 5])
    let next = answer + 2
    while (options.size < 4) options.add(next++)
    return {
      prompt,
      answer: `₹${answer}`,
      choices: shuffled(r, [...options]).map((n) => `₹${n}`),
    }
  },
  fractions: (r, age) => {
    if (!level(age)) {
      const denominator = pick(r, [2, 3, 4, 5, 6, 8, 10])
      const numerator = randInt(r, 1, denominator - 1)
      const whole = denominator * randInt(r, 2, 12)
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
      const common = gcd(numerator, denominator)
      const answer = `${numerator / common}/${denominator / common}`
      return {
        prompt: `What fraction of ${whole} is ${numerator * (whole / denominator)}?`,
        answer,
        choices: fractionChoices(answer, r),
      }
    }
    const denominator = pick(r, [3, 4, 5, 6, 8, 10, 12])
    const first = randInt(r, 1, denominator - 1)
    const second = randInt(r, 1, denominator - first)
    const raw = first + second
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const common = gcd(raw, denominator)
    const answer = `${raw / common}/${denominator / common}`
    return {
      prompt: `Simplify ${first}/${denominator} + ${second}/${denominator}.`,
      answer,
      choices: fractionChoices(answer, r),
    }
  },
  time: (r, age) => {
    const hour = randInt(r, 1, 11)
    const minute = pick(r, [0, 15, 30, 45])
    const offset = pick(r, level(age) ? [20, 35, 45, 70, 90, 120] : [15, 30, 45, 60])
    const total = ((hour * 60 + minute + offset) % (12 * 60)) || 12 * 60
    const answerHour = Math.floor(total / 60)
    const answerMinute = total % 60
    const format = (h: number, m: number) => `${h === 0 ? 12 : h}:${String(m).padStart(2, '0')}`
    const answer = format(answerHour, answerMinute)
    const wrongMinutes = [15, 30, 45].map((delta) => {
      const wrong = (hour * 60 + minute + offset + delta) % (12 * 60)
      return format(Math.floor(wrong / 60), wrong % 60)
    })
    return {
      prompt: `What time is ${offset} minutes after ${format(hour, minute)}?`,
      answer,
      choices: shuffled(r, [answer, ...wrongMinutes]).slice(0, 4),
    }
  },
  geometry: (r, age) => {
    if (age === 'curious') {
      if (r() < 0.5) {
        const shapes = [
          { name: 'triangle', sides: 3 },
          { name: 'square', sides: 4 },
          { name: 'pentagon', sides: 5 },
          { name: 'hexagon', sides: 6 },
        ]
        const shape = pick(r, shapes)
        const askCorners = r() < 0.5
        return numericQuestion(
          `How many ${askCorners ? 'corners' : 'sides'} does a ${shape.name} have?`,
          shape.sides,
          r,
        )
      }
      const length = randInt(r, 3, 18)
      const width = r() < 0.5 ? length : randInt(r, 2, 12)
      const isSquare = length === width
      return unitQuestion(
        isSquare
          ? `What is the perimeter of a square with ${length} cm sides?`
          : `What is the perimeter of a ${length} cm by ${width} cm rectangle?`,
        2 * (length + width),
        'cm',
        r,
      )
    }
    if (age === 'explorers') {
      const shapes = [
        { name: 'triangle', answer: 3 },
        { name: 'square', answer: 4 },
        { name: 'pentagon', answer: 5 },
        { name: 'hexagon', answer: 6 },
      ]
      const shape = pick(r, shapes)
      return numericQuestion(`How many sides does a ${shape.name} have?`, shape.answer, r)
    }
    const length = randInt(r, 4, 20)
    const width = randInt(r, 3, 18)
    const area = r() < 0.5
    return unitQuestion(
      `A rectangle is ${length} cm long and ${width} cm wide. What is its ${area ? 'area' : 'perimeter'}?`,
      area ? length * width : 2 * (length + width),
      area ? 'cm²' : 'cm',
      r,
    )
  },
  decimals: (r, age) => {
    const a = randInt(r, 11, level(age) ? 999 : 99)
    const b = randInt(r, 11, level(age) ? 999 : 99)
    const add = r() < 0.5
    const first = add || a >= b ? a : b
    const second = add || a >= b ? b : a
    const answer = add ? first + second : first - second
    const format = (n: number) => (n / 10).toFixed(1)
    return {
      prompt: `${format(first)} ${add ? '+' : '−'} ${format(second)} = ?`,
      answer: format(answer),
      choices: decimalChoices(answer, r),
    }
  },
}

function getGenerator(age: AgeGroupId, topic: MathTopic): Generator | undefined {
  if (age === 'explorers') return EXPLORER_GENERATORS[topic]
  return GENERATORS[topic as Exclude<MathTopic, 'patterns' | 'number-sense'>]
}

export function createQuestions(
  age: AgeGroupId,
  count: number = QUESTIONS_PER_ROUND,
  random: Random = Math.random,
  selectedTopics: MathTopic[] = TOPICS_BY_AGE[age],
): MathQuestion[] {
  const generators = selectedTopics.flatMap((topic) => {
    const generate = getGenerator(age, topic)
    return generate ? [{ topic, generate }] : []
  })
  if (generators.length === 0) return []

  const seen = new Set<string>()
  const questions: MathQuestion[] = []
  let attempts = 0
  while (questions.length < count) {
    const entry = pick(random, generators)
    const draft = entry.generate(random, age)
    attempts++
    if (seen.has(`${entry.topic}:${draft.prompt}`) && attempts < count * 100) continue
    seen.add(`${entry.topic}:${draft.prompt}`)
    questions.push({
      prompt: draft.prompt,
      answer: draft.answer,
      options: draft.choices ?? numberChoices(Number(draft.answer), random),
      topic: entry.topic,
    })
  }
  return questions
}

export interface MathState {
  questions: MathQuestion[]
  index: number
  score: number
  picked: string | null
}

export type MathAction = { type: 'answer'; value: string } | { type: 'next' }

export function createMathState(questions: MathQuestion[]): MathState {
  return { questions, index: 0, score: 0, picked: null }
}

export function isFinished(state: MathState): boolean {
  return state.index >= state.questions.length
}

export function mathReducer(state: MathState, action: MathAction): MathState {
  switch (action.type) {
    case 'answer': {
      if (isFinished(state) || state.picked !== null) return state
      const correct = action.value === state.questions[state.index].answer
      return { ...state, picked: action.value, score: state.score + (correct ? 1 : 0) }
    }
    case 'next':
      if (isFinished(state) || state.picked === null) return state
      return { ...state, index: state.index + 1, picked: null }
  }
}

export type AgeGroupId = 'explorers' | 'curious' | 'creative'

export interface AgeGroup {
  id: AgeGroupId
  name: string
  ages: string
  level: string
  blurb: string
  accent: string
}

export const AGE_GROUPS: AgeGroup[] = [
  {
    id: 'explorers',
    name: 'Little Explorers',
    ages: '2–5',
    level: 'Beginner',
    blurb: 'Coloring, colors, shapes, animals and sounds.',
    accent: '#ffb703',
  },
  {
    id: 'curious',
    name: 'Curious Minds',
    ages: '5–9',
    level: 'Intermediate',
    blurb: 'Color-by-number, math puzzles, connect-the-dots and quizzes.',
    accent: '#4cc9f0',
  },
  {
    id: 'creative',
    name: 'Creative Minds',
    ages: '10–12',
    level: 'Advanced',
    blurb: 'Mandala, pixel art, character design, geography and logic games.',
    accent: '#b388eb',
  },
]

export function isAgeGroupId(value: string | null): value is AgeGroupId {
  return AGE_GROUPS.some((g) => g.id === value)
}

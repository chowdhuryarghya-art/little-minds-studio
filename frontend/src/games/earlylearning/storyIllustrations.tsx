import type { ReactNode } from 'react'

type StorySetting = 'garden' | 'classroom' | 'park' | 'home' | 'rainy' | 'night' | 'library' | 'water'
type StoryAction = 'look' | 'hold' | 'walk' | 'draw' | 'share' | 'pour' | 'search' | 'stack' | 'fall' | 'wave' | 'read' | 'carry' | 'build' | 'play' | 'rest'

type StoryArt = {
  description: string
  setting: StorySetting
  action: StoryAction
  props: string[]
  people?: number
  animal?: 'bird' | 'bee' | 'snail'
}

const storyArt: Record<string, StoryArt[]> = {
  'The Little Seed': [
    { description: 'A tiny seed rests underground in a patch of dark soil.', setting: 'garden', action: 'rest', props: ['soil', 'seed'] },
    { description: 'Warm rain falls onto the soil and waters the sleeping seed.', setting: 'rainy', action: 'pour', props: ['soil', 'seed', 'rain'] },
    { description: 'The sunshine warms the soil as a small green sprout grows up.', setting: 'garden', action: 'look', props: ['sun', 'sprout', 'soil'] },
    { description: 'A little flower blooms and waves in the garden.', setting: 'garden', action: 'wave', props: ['flower', 'soil'] },
  ],
  'Milo Shares': [
    { description: 'Milo sits beside a big open box full of colorful crayons.', setting: 'classroom', action: 'look', props: ['crayons', 'box'], people: 1 },
    { description: 'Milo’s friend sits beside him, ready to draw on a sheet of paper.', setting: 'classroom', action: 'draw', props: ['paper', 'crayons'], people: 2 },
    { description: 'Milo reaches out and gives his friend a blue crayon.', setting: 'classroom', action: 'share', props: ['crayon'], people: 2 },
    { description: 'Milo and his friend hold up their drawing of the sea.', setting: 'classroom', action: 'hold', props: ['sea-picture'], people: 2 },
  ],
  'The Rainy Walk': [
    { description: 'Soft rain taps on a window while clouds gather outside.', setting: 'rainy', action: 'look', props: ['window', 'rain'] },
    { description: 'Nia puts on her boots and opens an umbrella in the rain.', setting: 'rainy', action: 'hold', props: ['boots', 'umbrella'], people: 1 },
    { description: 'Nia bends down to look at a snail beside a shiny puddle.', setting: 'rainy', action: 'look', props: ['puddle'], people: 1, animal: 'snail' },
    { description: 'A bright rainbow stretches across the sky after the rain.', setting: 'park', action: 'look', props: ['rainbow'] },
  ],
  'A Helpful Helper': [
    { description: 'Ravi notices several books scattered across the classroom floor.', setting: 'classroom', action: 'look', props: ['scattered-books'], people: 1 },
    { description: 'Ravi bends down and picks the books up from the floor.', setting: 'classroom', action: 'carry', props: ['books'], people: 1 },
    { description: 'Ravi puts the books neatly back on the classroom shelf.', setting: 'classroom', action: 'build', props: ['book-stack', 'shelf'], people: 1 },
    { description: 'The books are tidy on the shelf in a neat classroom.', setting: 'classroom', action: 'look', props: ['book-stack', 'shelf'] },
  ],
  'The Lost Mitten': [
    { description: 'Mina finds a little mitten lying beside the school gate.', setting: 'park', action: 'look', props: ['gate', 'mitten'], people: 1 },
    { description: 'Mina asks her teacher about the mitten at school.', setting: 'classroom', action: 'share', props: ['mitten'], people: 2 },
    { description: 'A little boy smiles and waves when he sees his mitten.', setting: 'park', action: 'wave', props: ['mitten'], people: 1 },
    { description: 'Mina helps the boy match his lost mitten with its other mitten.', setting: 'park', action: 'share', props: ['mitten-pair'], people: 2 },
  ],
  'A Picnic for Pip': [
    { description: 'Pip packs an apple and a snack into a picnic basket.', setting: 'home', action: 'build', props: ['apple', 'basket'], people: 1 },
    { description: 'Pip walks with family to a shady tree for a picnic.', setting: 'park', action: 'walk', props: ['tree'], people: 2 },
    { description: 'Pip and family watch a line of ants marching by.', setting: 'park', action: 'look', props: ['ants'], people: 2 },
    { description: 'Pip carries the picnic wrapper home to throw it away.', setting: 'park', action: 'carry', props: ['wrapper', 'home'], people: 1 },
  ],
  'The Wobbly Tower': [
    { description: 'Sam carefully stacks colorful blocks into a tall tower.', setting: 'home', action: 'stack', props: ['blocks'], people: 1 },
    { description: 'The tall block tower wobbles and tumbles down.', setting: 'home', action: 'fall', props: ['fallen-blocks'] },
    { description: 'Sam takes a calm breath and starts building again.', setting: 'home', action: 'build', props: ['blocks'], people: 1 },
    { description: 'Sam smiles beside a tall, strong tower of blocks.', setting: 'home', action: 'wave', props: ['tower'], people: 1 },
  ],
  'Where Is the Moon?': [
    { description: 'The sky turns dark and quiet as evening arrives.', setting: 'night', action: 'look', props: ['moon', 'stars'] },
    { description: 'Lea looks up through her window into the evening sky.', setting: 'night', action: 'look', props: ['window'], people: 1 },
    { description: 'A bright moon peeks out from behind soft clouds.', setting: 'night', action: 'look', props: ['moon', 'cloud'] },
    { description: 'Lea waves goodnight to the bright moon outside her window.', setting: 'night', action: 'wave', props: ['moon', 'window'], people: 1 },
  ],
  'The Garden Surprise': [
    { description: 'A tiny green leaf pokes up through the garden soil.', setting: 'garden', action: 'look', props: ['sprout', 'soil'] },
    { description: 'Nico pours water from a watering can onto the plant.', setting: 'garden', action: 'pour', props: ['watering-can', 'sprout'], people: 1 },
    { description: 'A small bud appears on the growing garden plant.', setting: 'garden', action: 'look', props: ['bud', 'plant'] },
    { description: 'A yellow flower opens in the warm sunshine.', setting: 'garden', action: 'look', props: ['flower', 'sun'] },
  ],
  'The Squeaky Wheel': [
    { description: 'A toy truck has stopped in the middle of the playroom.', setting: 'home', action: 'look', props: ['truck'] },
    { description: 'One loose wheel has rolled away from the toy truck.', setting: 'home', action: 'look', props: ['truck', 'wheel'] },
    { description: 'Tara and a grown-up work together to fix the toy truck.', setting: 'home', action: 'build', props: ['truck', 'wheel', 'wrench'], people: 2 },
    { description: 'The repaired toy truck rolls happily across the room.', setting: 'home', action: 'play', props: ['truck', 'motion'] },
  ],
  'A Home for the Bird': [
    { description: 'A little bird searches the tree for a safe branch.', setting: 'garden', action: 'search', props: ['tree'], animal: 'bird' },
    { description: 'The bird carries soft grass in its beak to build a nest.', setting: 'garden', action: 'carry', props: ['grass'], animal: 'bird' },
    { description: 'The bird settles into a cozy nest built in the tree.', setting: 'garden', action: 'build', props: ['nest', 'tree'], animal: 'bird' },
    { description: 'The happy bird chirps from its safe home in the tree.', setting: 'garden', action: 'wave', props: ['tree'], animal: 'bird' },
  ],
  'The Blue Umbrella': [
    { description: 'Gray clouds cover the sunny sky before the rain.', setting: 'rainy', action: 'look', props: ['cloud', 'sun'] },
    { description: 'Arun opens his blue umbrella as raindrops begin to fall.', setting: 'rainy', action: 'hold', props: ['umbrella'], people: 1 },
    { description: 'Arun and his sister walk together under the umbrella in the rain.', setting: 'rainy', action: 'walk', props: ['umbrella', 'rain'], people: 2 },
    { description: 'At home, Arun leaves the open umbrella to dry by the door.', setting: 'home', action: 'look', props: ['umbrella', 'door'], people: 1 },
  ],
  'The Sharing Box': [
    { description: 'A box is filled with many colorful crayons.', setting: 'classroom', action: 'look', props: ['crayons', 'box'] },
    { description: 'Asha gives Ben the blue crayon while keeping the red one.', setting: 'classroom', action: 'share', props: ['red-blue-crayons'], people: 2 },
    { description: 'Asha and Ben draw a big rainbow together.', setting: 'classroom', action: 'draw', props: ['rainbow-picture'], people: 2 },
    { description: 'Both friends add a bright yellow sun to their rainbow picture.', setting: 'classroom', action: 'draw', props: ['sun-picture'], people: 2 },
  ],
  'The Puddle Boat': [
    { description: 'Rain leaves a puddle beside the walking path.', setting: 'rainy', action: 'look', props: ['puddle', 'rain'] },
    { description: 'Jo folds a paper boat with help from a grown-up.', setting: 'home', action: 'build', props: ['paper-boat'], people: 2 },
    { description: 'The little paper boat floats gently on the puddle water.', setting: 'water', action: 'look', props: ['boat', 'puddle'] },
    { description: 'Jo and the grown-up pick up the boat after watching it sail.', setting: 'park', action: 'carry', props: ['boat'], people: 2 },
  ],
  'The Busy Bees': [
    { description: 'A bee buzzes over the flowers in a sunny garden.', setting: 'garden', action: 'play', props: ['flowers'], animal: 'bee' },
    { description: 'The bee lands on a bright flower to find nectar.', setting: 'garden', action: 'look', props: ['flower'], animal: 'bee' },
    { description: 'Yellow pollen dusts the tiny bee’s legs as it visits a flower.', setting: 'garden', action: 'carry', props: ['pollen', 'flower'], animal: 'bee' },
    { description: 'The bee flies back home to its busy hive.', setting: 'garden', action: 'walk', props: ['hive'], animal: 'bee' },
  ],
  'The Quiet Library': [
    { description: 'Nora chooses a book about the sea in the library.', setting: 'library', action: 'read', props: ['books'], people: 1 },
    { description: 'Nora carefully turns a page in her sea book.', setting: 'library', action: 'read', props: ['open-book'], people: 1 },
    { description: 'The open book shows a tiny seahorse under the sea.', setting: 'water', action: 'look', props: ['seahorse', 'sea-picture'] },
    { description: 'Nora tells her friend about the seahorse picture she saw.', setting: 'library', action: 'share', props: ['open-book'], people: 2 },
  ],
  'The Missing Sock': [
    { description: 'One colorful sock lies by itself on the bed.', setting: 'home', action: 'look', props: ['sock', 'bed'] },
    { description: 'The matching sock is hiding underneath a chair.', setting: 'home', action: 'search', props: ['sock', 'chair'] },
    { description: 'Omar looks carefully around the room for the missing sock.', setting: 'home', action: 'search', props: ['bed', 'chair'], people: 1 },
    { description: 'Omar finds both socks and gets dressed for the day.', setting: 'home', action: 'hold', props: ['sock-pair'], people: 1 },
  ],
  'A Kite in the Breeze': [
    { description: 'A gentle breeze blows through the park beneath a blue sky.', setting: 'park', action: 'look', props: ['wind', 'tree'] },
    { description: 'Maya holds the kite string tightly in both hands.', setting: 'park', action: 'hold', props: ['kite'], people: 1 },
    { description: 'The colorful kite rises high into the blue sky.', setting: 'park', action: 'look', props: ['kite', 'wind'] },
    { description: 'Maya runs and laughs with her family as the kite flies.', setting: 'park', action: 'play', props: ['kite'], people: 2 },
  ],
}

function Person({ x, action, child = false }: { x: number; action: StoryAction; child?: boolean }) {
  const armPaths: Record<StoryAction, string> = {
    look: 'M-17 72 l-8 30 M17 72 l8 30',
    hold: 'M-17 70 Q-36 45 -20 36 M17 70 Q36 45 20 36',
    walk: 'M-16 73 l-23 23 M16 73 l23 23',
    draw: 'M-17 69 l-8 24 M17 68 L40 54',
    share: 'M-17 70 l-8 24 M17 68 Q35 57 44 59',
    pour: 'M-17 70 l-8 24 M17 68 Q34 55 42 46',
    search: 'M-17 70 l-8 24 M17 68 Q30 46 37 40',
    stack: 'M-17 68 Q-26 48 -16 42 M17 68 Q27 48 17 42',
    fall: 'M-17 70 l-8 24 M17 70 l8 24',
    wave: 'M-17 70 l-8 24 M17 68 Q29 43 23 31',
    read: 'M-17 70 l-8 24 M17 70 Q24 55 20 48',
    carry: 'M-17 70 Q-31 50 -25 44 M17 70 Q31 50 25 44',
    build: 'M-17 70 Q-25 50 -15 43 M17 70 Q27 50 17 43',
    play: 'M-17 70 l-23 20 M17 70 l23 -20',
    rest: 'M-17 70 l-8 20 M17 70 l8 20',
  }
  const shirt = child ? '#7a58d1' : '#42a9be'

  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-13 111 L-18 151 M13 111 L18 151" stroke="#52526d" strokeWidth="9" strokeLinecap="round" />
      <path d={`M-17 69 Q-32 78 -34 101 M17 69 Q32 78 34 101`} fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
      <path d={armPaths[action]} fill="none" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
      <path d="M-18 61 Q0 51 18 61 L15 116 Q0 124 -15 116Z" fill={shirt} />
      <circle cy="43" r="23" fill="#f3bd91" />
      <path d="M-23 41 Q-25 17 0 17 Q23 19 23 39 Q11 29 0 31 Q-14 28 -23 41Z" fill={child ? '#543b32' : '#392f3f'} />
      <circle cx="-8" cy="44" r="2.5" fill="#302b35" />
      <circle cx="8" cy="44" r="2.5" fill="#302b35" />
      <path d="M-5 53 Q0 58 5 53" fill="none" stroke="#914f4c" strokeWidth="2" strokeLinecap="round" />
      {action === 'walk' || action === 'play' ? (
        <path d="M-25 158h13m30 0h13" stroke="#ffb951" strokeWidth="4" strokeLinecap="round" />
      ) : null}
    </g>
  )
}

function StoryProp({ name, x, y, scale = 1 }: { name: string; x: number; y: number; scale?: number }) {
  const art: Record<string, ReactNode> = {
    seed: <><ellipse cx="0" cy="12" rx="14" ry="7" fill="#9a623b" /><ellipse cx="0" cy="7" rx="7" ry="11" fill="#e1ae55" transform="rotate(35)" /></>,
    soil: <><path d="M-35 0 Q-20-10 -5 0 T25 0 L32 26 H-32Z" fill="#8a5a3b" /><path d="M-26 8h7m12 4h8m10-7h9" stroke="#d5aa62" strokeWidth="3" strokeLinecap="round" /></>,
    sprout: <><path d="M0 25V-9" stroke="#398b52" strokeWidth="5" /><path d="M0 3Q-24-1-20-18Q-2-18 0 3M0-5Q3-25 22-24Q24-6 0-5" fill="#62be63" stroke="#398b52" strokeWidth="2" /></>,
    flower: <><path d="M0 31V0" stroke="#398b52" strokeWidth="5" /><path d="M0 20q-15-13-20-4 9 10 20 7m0-7q13-14 20-5-7 11-20 8" fill="#62be63" /><circle cy="-9" r="8" fill="#ffcc47" /><circle cy="-22" r="8" fill="#ffdf72" /><circle cx="13" cy="-9" r="8" fill="#ffdf72" /><circle cy="4" r="8" fill="#ffdf72" /><circle cx="-13" cy="-9" r="8" fill="#ffdf72" /></>,
    sun: <><circle r="17" fill="#ffd45c" /><path d="M0-28v-8m0 72v-8m28-20h8m-72 0h8m48-20 6-6m-52 52 6-6m40 0 6 6M-26-26l6 6" stroke="#ffbd45" strokeWidth="4" strokeLinecap="round" /></>,
    cloud: <><path d="M-29 12h58a14 14 0 0 0 0-28q-6-21-26-11Q-14-39-20-17a15 15 0 0 0-9 29Z" fill="#fff" stroke="#c4d7ed" strokeWidth="2" /></>,
    rain: <><path d="M-27 4h54a13 13 0 0 0 0-26q-5-17-23-9-15-13-21 7a14 14 0 0 0-10 28Z" fill="#b9c9e6" /><path d="m-17 14-4 11m20-11-4 11m20-11-4 11" stroke="#60b9e8" strokeWidth="4" strokeLinecap="round" /></>,
    rainbow: <><path d="M-34 25a34 34 0 0 1 68 0" fill="none" stroke="#ef6c80" strokeWidth="8" /><path d="M-25 25a25 25 0 0 1 50 0" fill="none" stroke="#ffbe56" strokeWidth="7" /><path d="M-17 25a17 17 0 0 1 34 0" fill="none" stroke="#70c77a" strokeWidth="7" /><path d="M-8 25a8 8 0 0 1 16 0" fill="none" stroke="#6b9fe8" strokeWidth="6" /></>,
    crayons: <>{['#ef626c', '#ffc64a', '#5bc785', '#638ee8', '#b875d1'].map((color, i) => <g key={color} transform={`translate(${-24 + i * 12} 0) rotate(${i * 5 - 10})`}><rect x="-4" y="-25" width="9" height="48" rx="3" fill={color} /><path d="M-4-25 0-34 5-25" fill={color} /></g>)}</>,
    crayon: <><rect x="-6" y="-25" width="12" height="50" rx="4" fill="#4d8be8" /><path d="M-6-25 0-37 6-25" fill="#4d8be8" /><path d="M-5 16h10" stroke="#fff" strokeWidth="2" /></>,
    box: <><path d="M-30-8-20-21H22L31-8v35h-61Z" fill="#e69c52" stroke="#b76e3a" strokeWidth="3" /><path d="M-30-8h61" stroke="#ffd277" strokeWidth="4" /><path d="M-20 0h40" stroke="#c77c46" strokeWidth="2" /></>,
    paper: <><path d="M-24-30h38l12 12v48h-50Z" fill="#fff" stroke="#b6c8df" strokeWidth="3" /><path d="M14-30v14h14M-15 0h28m-28 9h28m-28 9h18" stroke="#83a6d9" strokeWidth="3" /></>,
    'sea-picture': <><rect x="-34" y="-26" width="68" height="52" rx="4" fill="#fff" stroke="#b77c52" strokeWidth="5" /><path d="M-27 3q10-11 20 0t20 0 14 0v17h-54Z" fill="#55b5e7" /><circle cx="17" cy="-11" r="7" fill="#ffd45c" /><path d="M-20-2q8-10 16 0m7 0q8-10 16 0" fill="none" stroke="#438dca" strokeWidth="3" /></>,
    books: <><path d="M-30-24h25v48h-25q-7-4 0-8v-32q-7-4 0-8Zm35 0h25q7 4 0 8v32q7 4 0 8H5Z" fill="#6d9de2" stroke="#476eb3" strokeWidth="2" /><path d="M-20-13h8m-8 8h8m25-8h8m-8 8h8" stroke="#fff" strokeWidth="2" /></>,
    'scattered-books': <><g transform="rotate(-18 -15 5)"><path d="M-34-4h30v25h-30z" fill="#e66f79" stroke="#a94e5b" strokeWidth="2" /><path d="M-28 1h18m-18 5h18" stroke="#fff" strokeWidth="2" /></g><g transform="rotate(13 17 1)"><path d="M4-22h28v26H4z" fill="#6598df" stroke="#466ca8" strokeWidth="2" /><path d="M10-16h16m-16 5h16" stroke="#fff" strokeWidth="2" /></g><path d="M-8 15h24v13H-8z" fill="#f3bd51" stroke="#bd8837" strokeWidth="2" /></>,
    'book-stack': <><rect x="-28" y="12" width="56" height="13" rx="3" fill="#e66f79" stroke="#a94e5b" strokeWidth="2" /><rect x="-24" y="-2" width="50" height="13" rx="3" fill="#6598df" stroke="#466ca8" strokeWidth="2" /><rect x="-20" y="-16" width="43" height="13" rx="3" fill="#f3bd51" stroke="#bd8837" strokeWidth="2" /><path d="M-16-12h5m-8 18h6m-9 18h5" stroke="#fff" strokeWidth="2" /></>,
    shelf: <><path d="M-34-27h68v7h-68Zm0 23h68v7h-68Zm0 23h68v7h-68Z" fill="#a96c45" /><path d="M-28-21h13v17h-13Zm18-2h15v19h-15Zm20 2h13v17H10Z" fill="#e56f78" /><path d="M-28 2h14v19h-14Zm19 2h12v17H-9Zm17-3h15v20H8Z" fill="#6fa4df" /></>,
    window: <><rect x="-27" y="-28" width="54" height="56" rx="4" fill="#aee1f5" stroke="#fff" strokeWidth="7" /><path d="M0-25v50m-24-1h48" stroke="#fff" strokeWidth="4" /></>,
    umbrella: <><path d="M-34 0Q-28-32 0-34T34 0q-10-10-17 0Q8-10 0 0-8-10-17 0-25-10-34 0Z" fill="#4886df" stroke="#3569b7" strokeWidth="2" /><path d="M0-31v46q0 10 9 10" fill="none" stroke="#79502f" strokeWidth="4" strokeLinecap="round" /></>,
    boots: <><path d="M-24-27h17v27q0 8 10 10v14h-31q-9-4-5-13l9-10Z" fill="#efb74f" stroke="#ca8840" strokeWidth="3" /><path d="M8-27h17v27q0 8 10 10v14H4q-9-4-5-13l9-10Z" fill="#72b9d1" stroke="#448eae" strokeWidth="3" /></>,
    puddle: <><path d="M-35 6q12-14 25-4 12-15 23-3Q29-12 37 5q-5 18-22 14-12 10-24 0Q-29 25-35 6Z" fill="#74c9ec" stroke="#4aa5d2" strokeWidth="3" /><path d="M-19 7h8m11 5h7m9-10h8" stroke="#d9f6ff" strokeWidth="3" strokeLinecap="round" /></>,
    gate: <><path d="M-34-27h9v58h-9Zm59 0h9v58h-9Z" fill="#9b653f" /><path d="M-25-20h50v9h-50Zm0 17h50v9h-50Zm0 17h50v9h-50Z" fill="#c58b56" stroke="#9b653f" strokeWidth="2" /><path d="M-2-2v7" stroke="#f8dfa1" strokeWidth="3" strokeLinecap="round" /></>,
    mitten: <><path d="M-17 25q-13-4-12-20l4-21q2-9 9-7 7 1 5 10l-1 5 5-23q2-9 9-6 7 2 4 11l-2 12 7-20q3-8 10-5 7 3 3 12l-7 22q17 0 13 15l-5 16q-3 10-14 10h-20Z" fill="#e66f8d" stroke="#b94e71" strokeWidth="3" /><path d="M-20 18h38v10h-38Z" fill="#ffd15c" /></>,
    'mitten-pair': <><g transform="translate(-16 0) scale(.8)"><path d="M-17 25q-13-4-12-20l4-21q2-9 9-7 7 1 5 10l-1 5 5-23q2-9 9-6 7 2 4 11l-2 12 7-20q3-8 10-5 7 3 3 12l-7 22q17 0 13 15l-5 16q-3 10-14 10h-20Z" fill="#e66f8d" stroke="#b94e71" strokeWidth="3" /><path d="M-20 18h38v10h-38Z" fill="#ffd15c" /></g><g transform="translate(22 2) scale(-.75 .75)"><path d="M-17 25q-13-4-12-20l4-21q2-9 9-7 7 1 5 10l-1 5 5-23q2-9 9-6 7 2 4 11l-2 12 7-20q3-8 10-5 7 3 3 12l-7 22q17 0 13 15l-5 16q-3 10-14 10h-20Z" fill="#e66f8d" stroke="#b94e71" strokeWidth="3" /><path d="M-20 18h38v10h-38Z" fill="#ffd15c" /></g></>,
    tree: <><path d="M-5 30V-8h10v38" fill="#95623f" /><circle cx="-12" cy="-10" r="20" fill="#69b96c" /><circle cx="10" cy="-19" r="22" fill="#79c879" /><circle cx="18" cy="0" r="16" fill="#58aa61" /></>,
    apple: <><path d="M0-20q-18-17-29 2-11 24 6 42 9 8 22 1 13 7 22-1 18-18 6-42Q16-37 0-20Z" fill="#ed5361" /><path d="M0-22q1-12 9-17" stroke="#79502f" strokeWidth="4" /><path d="M3-34q16-10 22 2-13 8-22-2Z" fill="#67b65e" /></>,
    basket: <><path d="M-30-2h60l-6 29h-48Z" fill="#d7974d" stroke="#a9693b" strokeWidth="3" /><path d="M-20-3q3-25 20-25T20-3" fill="none" stroke="#b87943" strokeWidth="5" /><path d="M-19 4v17m13-17v17M0 4v17M13 4v17" stroke="#f1c276" strokeWidth="3" /></>,
    ants: <>{[-22, 0, 22].map((cx) => <g key={cx} transform={`translate(${cx} ${cx % 2 ? 3 : -2})`}><circle cx="-8" r="4" fill="#49352d" /><circle r="5" fill="#49352d" /><circle cx="9" r="6" fill="#49352d" /><path d="M-3-4l-6-8m10 8 4-9M-2 4l-7 8m12-8 8 9" stroke="#49352d" strokeWidth="2" /></g>)}</>,
    blocks: <><rect x="-29" y="0" width="27" height="25" rx="3" fill="#ef6978" /><rect x="2" y="0" width="27" height="25" rx="3" fill="#66a5e6" /><rect x="-14" y="-28" width="28" height="25" rx="3" fill="#ffd15c" /></>,
    tower: <><rect x="-24" y="10" width="48" height="18" rx="3" fill="#ef6978" /><rect x="-21" y="-9" width="42" height="18" rx="3" fill="#66a5e6" /><rect x="-17" y="-28" width="34" height="18" rx="3" fill="#ffd15c" /><path d="M-29 30h58" stroke="#855d46" strokeWidth="4" /></>,
    'fallen-blocks': <><rect x="-30" y="10" width="30" height="16" rx="3" fill="#ef6978" transform="rotate(-12)" /><rect x="3" y="6" width="29" height="16" rx="3" fill="#66a5e6" transform="rotate(12 3 6)" /><rect x="-15" y="-15" width="28" height="16" rx="3" fill="#ffd15c" transform="rotate(24 -15 -15)" /><path d="m0-34 5 9 10-4-3 11 9 5-11 3 1 11-8-8-9 7 3-11-10-4 11-3Z" fill="#ffc94e" /></>,
    moon: <><path d="M15-28Q-12-20-10 3 0 31 26 18 15 41-8 32-35 21-29-4-24-28 0-34Z" fill="#ffe17b" /><circle cx="10" cy="-6" r="2" fill="#e9b64f" /><circle cx="7" cy="9" r="2" fill="#e9b64f" /></>,
    stars: <><path d="m-19-24 6 13 14 2-10 9 3 14-13-7-12 7 2-14-10-9 14-2Z" fill="#ffe17b" /><circle cx="20" cy="12" r="5" fill="#ffe17b" /></>,
    leaf: <><path d="M-27 18Q-21-28 28-24 25 16-27 18Z" fill="#69bd68" stroke="#398b52" strokeWidth="3" /><path d="M-23 14 18-16" stroke="#398b52" strokeWidth="3" /></>,
    'watering-can': <><path d="M-20-9h32q7 0 7 7v28h-42V-2q0-7 3-7Z" fill="#68b8d5" stroke="#438ca9" strokeWidth="3" /><path d="M-10-9q0-16 12-16t12 16m15 6 22 11-4 6-21-7" fill="none" stroke="#438ca9" strokeWidth="5" strokeLinejoin="round" /><path d="m28 19-3 6m14-5-3 7" stroke="#54bfe9" strokeWidth="3" strokeLinecap="round" /></>,
    bud: <><path d="M0 27V0" stroke="#398b52" strokeWidth="5" /><path d="M0 3Q-20-2-15-21 1-24 0 3Zm1-3Q3-23 19-20 22-3 1 0Z" fill="#78c76d" /><ellipse cy="-11" rx="9" ry="14" fill="#f2bc70" /></>,
    plant: <><path d="M0 30V-10" stroke="#398b52" strokeWidth="5" /><path d="M0 11q-21-18-26-4 10 13 26 9m0-12Q20-17 27-4 16 7 0 4" fill="#6abd69" /><path d="M-8-10q-6-17 8-24 15 8 0 24" fill="#8bcf70" /><path d="M-32 31h64" stroke="#8a5a3b" strokeWidth="8" /></>,
    truck: <><path d="M-31-12h43v30h-43z" rx="4" fill="#e96b63" stroke="#b54f49" strokeWidth="3" /><path d="M12-3h15l14 14v7H12Z" fill="#f6b84a" stroke="#c58a38" strokeWidth="3" /><path d="M19 0v10h14L24 0Z" fill="#bdeaff" /><circle cx="-19" cy="20" r="8" fill="#4c5363" /><circle cx="26" cy="20" r="8" fill="#4c5363" /><circle cx="-19" cy="20" r="3" fill="#d9e2ef" /><circle cx="26" cy="20" r="3" fill="#d9e2ef" /></>,
    wheel: <><circle r="24" fill="#4d5364" /><circle r="14" fill="#dce8f2" /><circle r="5" fill="#8b9bb1" /><path d="M0-22v14m0 16v14m-22-22h14m16 0h14m-38-16 10 10m12 12 10 10m0-32L6-8M-6 8l-10 10" stroke="#abb8c9" strokeWidth="3" /></>,
    wrench: <><path d="M17-26a17 17 0 0 0-19 21l-25 25 10 10L8 5a17 17 0 0 0 21-19l-11 11-10-10Z" fill="#9aabc0" stroke="#65758d" strokeWidth="3" /></>,
    grass: <><path d="M-29 22q-5-29 4-37 10 16 8 37 0-35 12-44 8 18 2 44Q0-8 14-19q5 18-5 41 11-25 23-25-1 20-14 29" fill="#6cbd67" stroke="#438f52" strokeWidth="3" /></>,
    nest: <><path d="M-31-3q8 35 31 35T31-3q-14 9-31 0-16 9-31 0Z" fill="#a96f43" stroke="#855132" strokeWidth="3" /><path d="M-25 4q23 10 50 0M-20 13q20 10 40 0" fill="none" stroke="#d59b5d" strokeWidth="4" /><ellipse cy="-5" rx="15" ry="8" fill="#f0d7a1" /></>,
    bird: <><ellipse rx="23" ry="17" fill="#68a9df" /><circle cx="15" cy="-13" r="13" fill="#78b8e8" /><path d="m27-13 15 5-14 4Z" fill="#f1ac4f" /><circle cx="18" cy="-16" r="2.5" fill="#303744" /><path d="M-5-2q8-14 20 0-8 12-20 0Z" fill="#f3d16b" /><path d="M-4 15v9m12-9v9" stroke="#a8754b" strokeWidth="3" /></>,
    'paper-boat': <><path d="M-32 4 0 22 32 4 22 25h-44Z" fill="#f6f7fb" stroke="#8495ae" strokeWidth="3" /><path d="M-29 3 0-22 29 3Z" fill="#fff" stroke="#8495ae" strokeWidth="3" /><path d="M0-19V19" stroke="#c1ccdc" strokeWidth="2" /></>,
    boat: <><path d="M-32 0h64L18 23h-36Z" fill="#e8a052" stroke="#b9783f" strokeWidth="3" /><path d="M0-29V0m1-27 21 22H1Z" fill="#fff" stroke="#92afd0" strokeWidth="2" /><path d="M-35 29q12-8 24 0t24 0 24 0" fill="none" stroke="#61bde6" strokeWidth="4" /></>,
    bee: <><ellipse rx="24" ry="16" fill="#ffd14e" stroke="#c99630" strokeWidth="2" /><path d="M-9-14v28m17-28v28" stroke="#463a30" strokeWidth="6" /><circle cx="29" cy="-5" r="10" fill="#ffd14e" /><circle cx="32" cy="-8" r="2" fill="#322a28" /><ellipse cx="-5" cy="-22" rx="9" ry="13" fill="#dff4ff" opacity=".85" /><ellipse cx="12" cy="-22" rx="9" ry="13" fill="#dff4ff" opacity=".85" /></>,
    snail: <><path d="M-27 17h54q6 0 6 6h-65q0-6 5-6Z" fill="#e9a46d" /><path d="M-17 15q0-26 19-26 16 0 16 14v12" fill="#d9955d" stroke="#a96847" strokeWidth="3" /><circle cx="1" cy="-2" r="12" fill="#f0c37f" stroke="#a96847" strokeWidth="3" /><path d="M-4-8q11-2 9 8-1 6-7 5" fill="none" stroke="#a96847" strokeWidth="2" /><path d="M15 5v-8m8 8v-8m-11 0-2-8m14 8 3-8" stroke="#a96847" strokeWidth="2" strokeLinecap="round" /><circle cx="14" cy="-5" r="2" fill="#342b35" /><circle cx="23" cy="-5" r="2" fill="#342b35" /></>,
    pollen: <><circle cx="-13" cy="-6" r="8" fill="#ffd34e" /><circle cx="8" cy="-17" r="7" fill="#ffd34e" /><circle cx="20" cy="7" r="9" fill="#ffd34e" /><circle cx="-8" cy="17" r="6" fill="#ffd34e" /></>,
    hive: <><path d="M-24 25v-35q0-21 24-21t24 21v35Z" fill="#efb94d" stroke="#c58d39" strokeWidth="3" /><path d="M-18-5h36m-36 12h36m-30-21h24" stroke="#d3973c" strokeWidth="3" /><path d="M-8 25v-9q0-9 8-9t8 9v9" fill="#503e31" /></>,
    'open-book': <><path d="M-2-24q-25-9-33 0v48q17-7 33 0 17-7 35 0v-48Q14-32-2-24Z" fill="#fff" stroke="#7998c6" strokeWidth="3" /><path d="M-2-23v46m-25-35 17 4m-17 5 17 4m17-13 17-4m-17 13 17-4" stroke="#a8bfdf" strokeWidth="2" /></>,
    seahorse: <><path d="M4-29q22-4 22 16 0 13-14 17l-2 11q-1 14 11 11-2 18-20 10-12-6-5-26l4-15Q-20 3-23-12q-2-15 14-18l-4 12 13-4Z" fill="#f4ad52" stroke="#d78347" strokeWidth="3" /><circle cx="16" cy="-16" r="2.5" fill="#342b35" /><path d="M-5-27l-5-9m14 7 2-11" stroke="#f4ad52" strokeWidth="4" strokeLinecap="round" /></>,
    sock: <><path d="M-12-27h23v26q0 8 17 14 10 5 5 16-5 9-18 6L-8 27q-12-6-5-18l9-11Z" fill="#79a9e8" stroke="#547eb8" strokeWidth="3" /><path d="M-11-19h22M-10 12l20 7" stroke="#fff" strokeWidth="5" /></>,
    'sock-pair': <><g transform="translate(-15 0) scale(.72)"><path d="M-12-27h23v26q0 8 17 14 10 5 5 16-5 9-18 6L-8 27q-12-6-5-18l9-11Z" fill="#79a9e8" stroke="#547eb8" strokeWidth="3" /><path d="M-11-19h22M-10 12l20 7" stroke="#fff" strokeWidth="5" /></g><g transform="translate(18 -1) scale(-.72 .72)"><path d="M-12-27h23v26q0 8 17 14 10 5 5 16-5 9-18 6L-8 27q-12-6-5-18l9-11Z" fill="#79a9e8" stroke="#547eb8" strokeWidth="3" /><path d="M-11-19h22M-10 12l20 7" stroke="#fff" strokeWidth="5" /></g></>,
    bed: <><path d="M-35 3h70v25h-70Zm-5-14h14V3h-14Zm14 0h61V3h-61Z" fill="#8e72c8" stroke="#7157a8" strokeWidth="3" /><path d="M-26-8h17v9h-17Z" fill="#fff" /><path d="M-30 28v8m60-8v8" stroke="#79502f" strokeWidth="4" /></>,
    chair: <><path d="M-17-23h34v37h-34zM-22 10h44v8h-44Zm-14 0h9v17h-9Zm43 0h9v17H7Zm-26 8v17m38-17v17" fill="#c8874f" stroke="#96603b" strokeWidth="3" /></>,
    home: <><path d="M-31-1 0-28 31-1v29h-62Z" fill="#f3c477" stroke="#b77c52" strokeWidth="3" /><path d="M-38 0 0-34 38 0" fill="none" stroke="#b65d62" strokeWidth="7" strokeLinejoin="round" /><rect x="-8" y="6" width="17" height="22" fill="#fff1d2" /><rect x="-24" y="3" width="11" height="11" fill="#aee1f5" /></>,
    flowers: <><g transform="translate(-18 4)"><path d="M0 26V0" stroke="#398b52" strokeWidth="4" /><circle cy="-9" r="7" fill="#ffcf55" /><circle cy="-20" r="7" fill="#f28ba3" /><circle cx="11" cy="-9" r="7" fill="#f28ba3" /><circle cy="2" r="7" fill="#f28ba3" /><circle cx="-11" cy="-9" r="7" fill="#f28ba3" /></g><g transform="translate(20 9) scale(.8)"><path d="M0 26V0" stroke="#398b52" strokeWidth="4" /><circle cy="-9" r="7" fill="#ffcf55" /><circle cy="-20" r="7" fill="#d9a1e8" /><circle cx="11" cy="-9" r="7" fill="#d9a1e8" /><circle cy="2" r="7" fill="#d9a1e8" /><circle cx="-11" cy="-9" r="7" fill="#d9a1e8" /></g></>,
    wind: <><path d="M-33-12h43q15 0 15-10a9 9 0 0 0-17-4m-41 27h60q14 0 14 11a9 9 0 0 1-17 4m-57 8h29" fill="none" stroke="#75b9df" strokeWidth="5" strokeLinecap="round" /></>,
    kite: <><path d="M0-34 27 0 0 31-27 0Z" fill="#ef6677" stroke="#bb4f66" strokeWidth="3" /><path d="M0-34v65M-27 0h54" stroke="#ffe8aa" strokeWidth="3" /><path d="M0 31q-22 14-4 22t-4 20" fill="none" stroke="#5879c8" strokeWidth="3" /><path d="m-6 43 7 4m-13 7 7 4" stroke="#ffd15c" strokeWidth="4" /></>,
    motion: <><path d="M-34-14h18m-23 11h13m48-15h14m-7 12h12" stroke="#f0a94a" strokeWidth="4" strokeLinecap="round" /></>,
    wrapper: <><path d="m-22-12 41-10 10 34-41 10Z" fill="#f4e3ba" stroke="#beaa7f" strokeWidth="3" /><path d="m-12-4 24-6m-21 16 24-6" stroke="#fff" strokeWidth="3" /></>,
    'sun-picture': <><rect x="-34" y="-25" width="68" height="50" rx="4" fill="#fff" stroke="#b77c52" strokeWidth="5" /><circle cy="-1" r="14" fill="#ffd45c" /><path d="M0-22v8m0 26v8m-21-20h8m26 0h8m-36-15 6 6m24 24 6 6m0-36-6 6m-24 24-6 6" stroke="#ffbd45" strokeWidth="3" /></>,
    'rainbow-picture': <><rect x="-36" y="-27" width="72" height="54" rx="4" fill="#fff" stroke="#b77c52" strokeWidth="5" /><path d="M-25 16a25 25 0 0 1 50 0" fill="none" stroke="#ef6c80" strokeWidth="7" /><path d="M-17 16a17 17 0 0 1 34 0" fill="none" stroke="#ffbe56" strokeWidth="6" /><path d="M-8 16a8 8 0 0 1 16 0" fill="none" stroke="#70c77a" strokeWidth="5" /></>,
    'red-blue-crayons': <><rect x="-22" y="-25" width="15" height="50" rx="4" fill="#ed5361" /><path d="m-22-25 7-12 8 12" fill="#ed5361" /><rect x="8" y="-25" width="15" height="50" rx="4" fill="#4d8be8" /><path d="m8-25 8-12 7 12" fill="#4d8be8" /><path d="M-3 0h7m-6-7 6 7-6 7" fill="none" stroke="#7157a8" strokeWidth="3" /></>,
    door: <><path d="M-23 30v-58h46v58Z" fill="#b77c52" stroke="#875939" strokeWidth="4" /><circle cx="12" cy="2" r="3" fill="#ffe08a" /></>,
    sea: <><path d="M-34-3q12-14 24 0t24 0 24 0v29h-72Z" fill="#59b9e7" /><path d="M-34 8q12-14 24 0t24 0 24 0" fill="none" stroke="#c5f3ff" strokeWidth="4" /><path d="M-34 20q12-14 24 0t24 0 24 0" fill="none" stroke="#3698cd" strokeWidth="4" /></>,
  }

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {art[name] ?? <circle r="20" fill="#ffd15c" />}
    </g>
  )
}

function StorySettingArt({ setting }: { setting: StorySetting }) {
  return (
    <>
      <rect width="360" height="220" rx="18" fill={setting === 'night' ? '#555b8f' : setting === 'rainy' ? '#dce8f3' : setting === 'water' ? '#d7f3ff' : setting === 'home' ? '#fff0d6' : '#c9efff'} />
      {setting === 'night' ? (
        <>
          <circle cx="300" cy="45" r="4" fill="#fff2b0" />
          <circle cx="260" cy="78" r="3" fill="#fff" />
          <circle cx="72" cy="48" r="3" fill="#fff" />
        </>
      ) : setting === 'rainy' ? (
        <>
          <path d="M0 165h360v55H0Z" fill="#9bc5a2" />
          <StoryProp name="rain" x={70} y={65} scale={1.2} />
          <path d="m150 50-5 13m35-17-5 13m35-5-5 13m37-15-5 13" stroke="#65b7e0" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : setting === 'classroom' || setting === 'library' ? (
        <>
          <rect y="170" width="360" height="50" fill="#d9a577" />
          <rect x="26" y="25" width="67" height="67" rx="5" fill="#aee1f5" stroke="#fff" strokeWidth="6" />
          <path d="M59 27v63M28 58h63" stroke="#fff" strokeWidth="4" />
          {setting === 'library' && <StoryProp name="shelf" x={300} y={112} scale={1.1} />}
        </>
      ) : setting === 'garden' || setting === 'park' ? (
        <>
          <circle cx="310" cy="40" r="23" fill="#ffd45c" />
          <path d="M0 158q85-34 165 0t195-4v66H0Z" fill="#82cd76" />
          <path d="M0 188q84-25 172 0t188-2v34H0Z" fill="#59b869" />
        </>
      ) : setting === 'water' ? (
        <>
          <circle cx="300" cy="43" r="21" fill="#ffd45c" />
          <path d="M0 140q18-20 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0 36 0 36 0v80H0Z" fill="#59b9e7" />
          <path d="M0 156q18-14 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0 36 0 36 0" fill="none" stroke="#c5f3ff" strokeWidth="4" />
        </>
      ) : (
        <>
          <rect y="172" width="360" height="48" fill="#d99b66" />
          <rect x="26" y="25" width="67" height="67" rx="5" fill="#aee1f5" stroke="#fff" strokeWidth="6" />
          <path d="M59 27v63M28 58h63" stroke="#fff" strokeWidth="4" />
        </>
      )}
      {setting === 'garden' && <StoryProp name="tree" x={315} y={132} scale={1.2} />}
      {setting === 'park' && <StoryProp name="tree" x={315} y={130} scale={1.1} />}
    </>
  )
}

export function StorybookIllustration({
  title,
  sceneIndex,
  thumbnail = false,
}: {
  title: string
  sceneIndex: number
  thumbnail?: boolean
}) {
  const scene = storyArt[title]?.[sceneIndex]
  if (!scene) return null

  const people = scene.people ?? 0
  const peoplePositions = people > 1 ? [112, 224] : people === 1 ? [156] : []
  const props = scene.props.filter((prop) => prop !== 'rain' && prop !== 'sun')
  const propScale = thumbnail ? 0.55 : 1
  const propPositions = props.length > 1
    ? props.map((_, index) => 262 - index * 64)
    : [265]
  const placeProp = (prop: string, index: number) => {
    let x = propPositions[index] ?? 265
    let y = scene.setting === 'water' ? 164 : 145

    if (prop === 'soil') {
      x = 225
      y = 172
    } else if (prop === 'seed') {
      x = 225
      y = 150
    } else if (prop === 'sprout' || prop === 'plant' || prop === 'bud' || prop === 'flower') {
      x = 225
      y = 142
    }

    if (scene.action === 'share' || scene.action === 'hold' || scene.action === 'carry') {
      x = people > 1 ? 180 : 205
      y = 105
    } else if (scene.action === 'draw') {
      x = prop.includes('paper') || prop.includes('picture') ? 180 : 235
      y = prop.includes('paper') || prop.includes('picture') ? 148 : 115
    } else if (scene.action === 'pour' && prop === 'watering-can') {
      x = 205
      y = 102
    } else if (scene.action === 'read') {
      x = 205
      y = 132
    } else if (scene.action === 'search' && prop === 'sock') {
      x = 250
      y = 177
    } else if (scene.action === 'search' && prop === 'chair') {
      x = 250
      y = 147
    } else if (prop === 'scattered-books') {
      x = 254
      y = 171
    } else if (prop === 'book-stack') {
      x = 280
      y = 113
    } else if (prop === 'shelf') {
      x = 280
      y = 153
    }

    return { x, y }
  }

  return (
    <svg
      className={`early-story-illustration${thumbnail ? ' early-story-thumbnail' : ''}`}
      viewBox="0 0 360 220"
      role="img"
      aria-label={scene.description}
    >
      <StorySettingArt setting={scene.setting} />
      {scene.props.includes('sun') && <StoryProp name="sun" x={scene.setting === 'night' ? 43 : 311} y={43} scale={propScale} />}
      {scene.props.includes('rain') && scene.setting !== 'rainy' && <StoryProp name="rain" x={310} y={54} scale={propScale} />}
      {scene.animal && (
        <g transform={`translate(${peoplePositions.length ? 287 : 172} ${scene.setting === 'water' ? 110 : 130}) scale(${propScale})`}>
          <StoryProp name={scene.animal === 'bird' ? 'bird' : scene.animal} x={0} y={0} />
        </g>
      )}
      {peoplePositions.map((x, index) => (
        <Person key={x} x={x} action={scene.action} child={index === 0} />
      ))}
      {props.map((prop, index) => (
        (() => {
          const { x, y } = placeProp(prop, index)
          return <StoryProp key={`${prop}-${index}`} name={prop} x={x} y={y} scale={propScale} />
        })()
      ))}
    </svg>
  )
}

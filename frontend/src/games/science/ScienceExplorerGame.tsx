import { useState } from 'react'

export const SCIENCE_TOPICS = [
  'animals',
  'plants',
  'space',
  'human-body',
  'earth',
] as const

export type ScienceTopic = (typeof SCIENCE_TOPICS)[number]
export type ScienceTopicFilter = ScienceTopic | 'all'
export type ScienceDifficulty = 'easy' | 'medium' | 'hard'

export const SCIENCE_DIFFICULTIES: { id: ScienceDifficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export const SCIENCE_TOPIC_LABELS: Record<ScienceTopic, string> = {
  animals: 'Animals',
  plants: 'Plants',
  space: 'Space',
  'human-body': 'Human body',
  earth: 'Earth',
}

export const SCIENCE_LESSONS: Record<ScienceTopic, { title: string; text: string }[]> = {
  animals: [
    { title: 'Animal homes', text: 'A habitat is the place where an animal finds food, water, shelter, and space to live.' },
    { title: 'Growing and changing', text: 'Some animals change as they grow. A caterpillar, for example, can become a butterfly or moth.' },
    { title: 'Animal groups', text: 'Animals can be grouped in different ways. Mammals breathe air and feed milk to their young; birds have feathers.' },
  ],
  plants: [
    { title: 'Parts of a plant', text: 'Roots take in water, stems support the plant, and leaves help it make food.' },
    { title: 'Making plant food', text: 'Plants use light, water, and carbon dioxide to make food. Chlorophyll helps leaves capture light.' },
    { title: 'Flowers and seeds', text: 'Pollen can move between flowers. After pollination, many plants grow seeds that can make new plants.' },
  ],
  space: [
    { title: 'Our solar system', text: 'The Sun is a star. Planets, including Earth, travel around it.' },
    { title: 'Earth and the Moon', text: 'The Moon travels around Earth and reflects sunlight. Earth spins, giving us day and night.' },
    { title: 'A very big universe', text: 'Stars are huge balls of hot gas. They look tiny because they are very far away.' },
  ],
  'human-body': [
    { title: 'Your skeleton', text: 'Bones support your body. Your skull helps protect your brain, and your ribs help protect your heart and lungs.' },
    { title: 'Breathing and blood', text: 'Your lungs take oxygen from the air. Your heart pumps blood, which carries oxygen around your body.' },
    { title: 'Brain and senses', text: 'Your brain helps you think and remember. Your eyes, ears, nose, tongue, and skin help you learn about the world.' },
  ],
  earth: [
    { title: 'The water cycle', text: 'The Sun warms water, which can evaporate into the air. Water vapor cools into clouds and can fall as rain.' },
    { title: 'Earth’s surface', text: 'Earth has land and water. Wind, water, and ice slowly shape the land through erosion.' },
    { title: 'Caring for our planet', text: 'Reusing and recycling materials can reduce waste. Sunlight and wind are renewable energy sources.' },
  ],
}

type ScienceQuestion = {
  topic: ScienceTopic
  difficulty: ScienceDifficulty
  prompt: string
  options: string[]
  answer: string
  fact: string
}

type ScienceQuestionDraft = Omit<ScienceQuestion, 'difficulty'>

const QUESTIONS: ScienceQuestionDraft[] = [
  { topic: 'animals', prompt: 'Which animal is the largest on Earth?', options: ['Blue whale', 'Elephant', 'Giraffe'], answer: 'Blue whale', fact: 'A blue whale can grow longer than a basketball court!' },
  { topic: 'animals', prompt: 'What do caterpillars turn into?', options: ['Butterflies or moths', 'Frogs', 'Beetles'], answer: 'Butterflies or moths', fact: 'A caterpillar changes inside a chrysalis or cocoon.' },
  { topic: 'animals', prompt: 'Which animal carries its baby in a pouch?', options: ['Kangaroo', 'Tiger', 'Penguin'], answer: 'Kangaroo', fact: 'Kangaroos are marsupials, and their babies grow in a pouch.' },
  { topic: 'animals', prompt: 'What do bees collect from flowers to make honey?', options: ['Nectar', 'Dew', 'Tree bark'], answer: 'Nectar', fact: 'Bees turn flower nectar into honey and store it in their hive.' },
  { topic: 'animals', prompt: 'How many legs does a spider have?', options: ['Eight', 'Six', 'Ten'], answer: 'Eight', fact: 'Spiders are arachnids. Insects have six legs, but spiders have eight.' },
  { topic: 'animals', prompt: 'Which animal is a mammal that lives in the sea?', options: ['Dolphin', 'Tuna', 'Octopus'], answer: 'Dolphin', fact: 'Dolphins breathe air with lungs and feed milk to their young, so they are mammals.' },
  { topic: 'animals', prompt: 'What is the name for an animal that is active at night?', options: ['Nocturnal', 'Aquatic', 'Domestic'], answer: 'Nocturnal', fact: 'Owls and many bats are nocturnal, which means they are active at night.' },
  { topic: 'animals', prompt: 'What helps a chameleon blend in with its surroundings?', options: ['Changing its skin color', 'Growing feathers', 'Hiding in water'], answer: 'Changing its skin color', fact: 'Some chameleons change color to communicate and help them blend into their surroundings.' },
  { topic: 'animals', prompt: 'Which animal uses echolocation to find its way?', options: ['Bat', 'Tortoise', 'Squirrel'], answer: 'Bat', fact: 'Bats make high-pitched sounds and listen for echoes to find objects in the dark.' },
  { topic: 'animals', prompt: 'What do we call animals that eat only plants?', options: ['Herbivores', 'Carnivores', 'Omnivores'], answer: 'Herbivores', fact: 'Cows and rabbits are herbivores because plants are what they eat.' },
  { topic: 'animals', prompt: 'Which group does a frog belong to?', options: ['Amphibians', 'Reptiles', 'Mammals'], answer: 'Amphibians', fact: 'Frogs are amphibians. Many begin life in water as tadpoles.' },
  { topic: 'animals', prompt: 'What is a place where an animal lives called?', options: ['Habitat', 'Weather', 'Shadow'], answer: 'Habitat', fact: 'A habitat provides animals with things they need, such as food, water, and shelter.' },
  { topic: 'animals', prompt: 'Which one is a bird that cannot fly?', options: ['Penguin', 'Eagle', 'Swallow'], answer: 'Penguin', fact: 'Penguins are birds with flippers that help them swim.' },
  { topic: 'animals', prompt: 'What do many birds do when seasons change and they travel far away?', options: ['Migrate', 'Hibernate', 'Melt'], answer: 'Migrate', fact: 'Birds may migrate to find warmer weather or more food.' },
  { topic: 'animals', prompt: 'Which animal is known for its black-and-white stripes?', options: ['Zebra', 'Panda', 'Polar bear'], answer: 'Zebra', fact: 'A zebra’s stripes are unique, a little like a person’s fingerprints.' },
  { topic: 'plants', prompt: 'Which part of a plant takes in water from the soil?', options: ['Roots', 'Flowers', 'Leaves'], answer: 'Roots', fact: 'Roots hold a plant in place and take in water and nutrients.' },
  { topic: 'plants', prompt: 'What do plants take in from the air to help make food?', options: ['Carbon dioxide', 'Helium', 'Smoke'], answer: 'Carbon dioxide', fact: 'With sunlight and water, plants use carbon dioxide to make their food.' },
  { topic: 'plants', prompt: 'Which part of a plant usually makes seeds?', options: ['Flower', 'Root', 'Stem'], answer: 'Flower', fact: 'Many flowers grow into fruits that hold seeds.' },
  { topic: 'plants', prompt: 'What do we call a young plant just starting to grow?', options: ['Seedling', 'Pebble', 'Pollen'], answer: 'Seedling', fact: 'A seedling grows from a seed when it has what it needs to sprout.' },
  { topic: 'plants', prompt: 'Which part carries water from the roots to the leaves?', options: ['Stem', 'Petal', 'Seed'], answer: 'Stem', fact: 'A plant’s stem supports it and moves water to its other parts.' },
  { topic: 'plants', prompt: 'What gives most leaves their green color?', options: ['Chlorophyll', 'Sugar', 'Sand'], answer: 'Chlorophyll', fact: 'Chlorophyll helps plants capture sunlight to make food.' },
  { topic: 'plants', prompt: 'What is the movement of pollen from one flower to another called?', options: ['Pollination', 'Digestion', 'Germination'], answer: 'Pollination', fact: 'Bees and other animals can carry pollen between flowers.' },
  { topic: 'plants', prompt: 'Which plant is well suited to living in a dry desert?', options: ['Cactus', 'Water lily', 'Fern'], answer: 'Cactus', fact: 'Many cacti store water in their thick stems and can live in dry places.' },
  { topic: 'plants', prompt: 'What can a seed grow into?', options: ['A new plant', 'A rock', 'A cloud'], answer: 'A new plant', fact: 'A seed contains a tiny young plant that can grow when conditions are right.' },
  { topic: 'plants', prompt: 'What do we call plants that lose their leaves in a season?', options: ['Deciduous', 'Evergreen', 'Floating'], answer: 'Deciduous', fact: 'Many deciduous trees lose their leaves in autumn and grow new ones later.' },
  { topic: 'plants', prompt: 'What is the job of fruit on many plants?', options: ['Protect the seeds', 'Make the roots', 'Catch sunlight'], answer: 'Protect the seeds', fact: 'Fruit surrounds seeds and can help them spread to new places.' },
  { topic: 'plants', prompt: 'Which part of a flower often attracts bees with bright colors?', options: ['Petals', 'Roots', 'Bark'], answer: 'Petals', fact: 'Bright petals can help attract pollinators such as bees and butterflies.' },
  { topic: 'plants', prompt: 'What is the first tiny shoot growing from a seed called?', options: ['Sprout', 'Thorn', 'Pinecone'], answer: 'Sprout', fact: 'A sprout is a young shoot that appears as a seed begins to grow.' },
  { topic: 'plants', prompt: 'Which of these is a plant that can stay green all year?', options: ['Pine tree', 'Maple tree', 'Sunflower'], answer: 'Pine tree', fact: 'Many pine trees are evergreen and keep their needles through the year.' },
  { topic: 'plants', prompt: 'What do plants need from the Sun to make their own food?', options: ['Light', 'Noise', 'Wind'], answer: 'Light', fact: 'Plants use light energy, water, and carbon dioxide to make food.' },
  { topic: 'space', prompt: 'Which star is closest to Earth?', options: ['The Sun', 'Polaris', 'Sirius'], answer: 'The Sun', fact: 'The Sun is a star at the center of our solar system.' },
  { topic: 'space', prompt: 'Which planet is famous for its bright rings?', options: ['Saturn', 'Mercury', 'Mars'], answer: 'Saturn', fact: 'Saturn’s rings are made mostly of pieces of ice and rock.' },
  { topic: 'space', prompt: 'What does Earth travel around?', options: ['The Sun', 'The Moon', 'Mars'], answer: 'The Sun', fact: 'Earth takes about one year to travel once around the Sun.' },
  { topic: 'space', prompt: 'What is Earth’s natural space companion called?', options: ['The Moon', 'A comet', 'Venus'], answer: 'The Moon', fact: 'The Moon travels around Earth and reflects light from the Sun.' },
  { topic: 'space', prompt: 'Which planet is often called the Red Planet?', options: ['Mars', 'Neptune', 'Venus'], answer: 'Mars', fact: 'Rusty iron in the dust gives Mars much of its reddish color.' },
  { topic: 'space', prompt: 'Which planet is the largest in our solar system?', options: ['Jupiter', 'Earth', 'Mercury'], answer: 'Jupiter', fact: 'Jupiter is the largest planet in our solar system.' },
  { topic: 'space', prompt: 'Which planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Earth'], answer: 'Mercury', fact: 'Mercury is the smallest planet and the closest one to the Sun.' },
  { topic: 'space', prompt: 'What does a planet travel around in space?', options: ['A star', 'A cloud', 'A mountain'], answer: 'A star', fact: 'Earth and the other planets in our solar system orbit the Sun.' },
  { topic: 'space', prompt: 'What force keeps us and our things on the ground?', options: ['Gravity', 'Moonlight', 'Magnetism'], answer: 'Gravity', fact: 'Gravity pulls objects toward one another and keeps us on Earth.' },
  { topic: 'space', prompt: 'What do we call a person trained to travel in space?', options: ['Astronaut', 'Diver', 'Pilot fish'], answer: 'Astronaut', fact: 'Astronauts train carefully for work and travel in space.' },
  { topic: 'space', prompt: 'Where do many asteroids travel around the Sun?', options: ['In a belt between Mars and Jupiter', 'Inside Earth', 'Around the Moon'], answer: 'In a belt between Mars and Jupiter', fact: 'The main asteroid belt is between the orbits of Mars and Jupiter.' },
  { topic: 'space', prompt: 'Why can we see the Moon shine at night?', options: ['It reflects sunlight', 'It is a star', 'It makes fire'], answer: 'It reflects sunlight', fact: 'The Moon does not make its own light; it reflects light from the Sun.' },
  { topic: 'space', prompt: 'What is a group of stars that makes a pattern called?', options: ['Constellation', 'Continent', 'Volcano'], answer: 'Constellation', fact: 'People have given names to patterns of stars, such as the Big Dipper.' },
  { topic: 'space', prompt: 'Which planet is known for its giant red storm?', options: ['Jupiter', 'Mercury', 'Earth'], answer: 'Jupiter', fact: 'Jupiter’s Great Red Spot is a huge storm that has lasted for a very long time.' },
  { topic: 'space', prompt: 'What do we call a rocky object from space that reaches the ground?', options: ['Meteorite', 'Cloud', 'Satellite dish'], answer: 'Meteorite', fact: 'A space rock that survives its trip through the atmosphere and lands is called a meteorite.' },
  { topic: 'human-body', prompt: 'Which organ pumps blood around your body?', options: ['Heart', 'Lungs', 'Stomach'], answer: 'Heart', fact: 'Your heart beats all day to move blood through your body.' },
  { topic: 'human-body', prompt: 'Which body parts help you breathe?', options: ['Lungs', 'Kidneys', 'Ears'], answer: 'Lungs', fact: 'Your lungs take oxygen from the air when you breathe in.' },
  { topic: 'human-body', prompt: 'What protects your brain?', options: ['Skull', 'Ribs', 'Knee'], answer: 'Skull', fact: 'The bones of your skull surround and help protect your brain.' },
  { topic: 'human-body', prompt: 'Which sense do you use with your ears?', options: ['Hearing', 'Taste', 'Smell'], answer: 'Hearing', fact: 'Your ears help you hear sounds and keep your balance.' },
  { topic: 'human-body', prompt: 'What do your teeth help you do?', options: ['Chew food', 'Breathe underwater', 'Hear music'], answer: 'Chew food', fact: 'Different teeth help bite and grind food before you swallow.' },
  { topic: 'human-body', prompt: 'What gives your body support and protects some organs?', options: ['Skeleton', 'Hair', 'Nails'], answer: 'Skeleton', fact: 'Your skeleton is made of bones that support your body and protect organs.' },
  { topic: 'human-body', prompt: 'What do muscles help your body do?', options: ['Move', 'See colors', 'Make sounds in space'], answer: 'Move', fact: 'Muscles pull on bones to help your body move.' },
  { topic: 'human-body', prompt: 'Which organ helps break down food after you swallow it?', options: ['Stomach', 'Lungs', 'Brain'], answer: 'Stomach', fact: 'Your stomach mixes food and helps break it into smaller parts.' },
  { topic: 'human-body', prompt: 'Which organ helps you think and remember?', options: ['Brain', 'Heart', 'Liver'], answer: 'Brain', fact: 'Your brain helps you think, learn, remember, and control many body actions.' },
  { topic: 'human-body', prompt: 'What is the body’s outer covering?', options: ['Skin', 'Bone', 'Muscle'], answer: 'Skin', fact: 'Skin covers and helps protect your body.' },
  { topic: 'human-body', prompt: 'What do red blood cells carry around the body?', options: ['Oxygen', 'Pebbles', 'Sunlight'], answer: 'Oxygen', fact: 'Red blood cells carry oxygen from your lungs to the rest of your body.' },
  { topic: 'human-body', prompt: 'Which organs filter waste from your blood to make urine?', options: ['Kidneys', 'Ears', 'Elbows'], answer: 'Kidneys', fact: 'Your kidneys clean waste and extra water from your blood.' },
  { topic: 'human-body', prompt: 'What should you do before eating to help remove germs from your hands?', options: ['Wash them with soap', 'Wipe them on your shirt', 'Clap'], answer: 'Wash them with soap', fact: 'Washing with soap and clean water helps remove germs from your hands.' },
  { topic: 'human-body', prompt: 'Which body part helps you smell a flower?', options: ['Nose', 'Knee', 'Thumb'], answer: 'Nose', fact: 'Your nose detects smells and also helps air move in and out as you breathe.' },
  { topic: 'human-body', prompt: 'What do your ribs help protect?', options: ['Heart and lungs', 'Fingers and toes', 'Hair and skin'], answer: 'Heart and lungs', fact: 'Your rib cage surrounds and helps protect your heart and lungs.' },
  { topic: 'earth', prompt: 'What is water called when it freezes?', options: ['Ice', 'Steam', 'Rain'], answer: 'Ice', fact: 'Water freezes into solid ice when it gets cold enough.' },
  { topic: 'earth', prompt: 'What causes day and night on Earth?', options: ['Earth spinning', 'The Moon changing shape', 'Clouds moving'], answer: 'Earth spinning', fact: 'As Earth spins, places turn toward the Sun for day and away for night.' },
  { topic: 'earth', prompt: 'What do we call water falling from clouds?', options: ['Rain', 'Fog', 'Wind'], answer: 'Rain', fact: 'Rain is one kind of precipitation. Snow and hail can fall from clouds too.' },
  { topic: 'earth', prompt: 'Which material can be recycled into new paper?', options: ['Old newspapers', 'Banana peels', 'Glass marbles'], answer: 'Old newspapers', fact: 'Recycling paper helps save materials used to make new paper.' },
  { topic: 'earth', prompt: 'What is the layer of air around Earth called?', options: ['Atmosphere', 'Ocean', 'Crust'], answer: 'Atmosphere', fact: 'Earth’s atmosphere is the air surrounding our planet.' },
  { topic: 'earth', prompt: 'What is the process called when the Sun warms water and it rises as vapor?', options: ['Evaporation', 'Freezing', 'Melting'], answer: 'Evaporation', fact: 'Evaporation moves water from the surface into the air as water vapor.' },
  { topic: 'earth', prompt: 'What do we call water vapor cooling into tiny drops in clouds?', options: ['Condensation', 'Erosion', 'Combustion'], answer: 'Condensation', fact: 'Condensation forms tiny water drops that make clouds.' },
  { topic: 'earth', prompt: 'What is a mountain that can release hot lava called?', options: ['Volcano', 'Glacier', 'Valley'], answer: 'Volcano', fact: 'Volcanoes can release melted rock, ash, and gases from inside Earth.' },
  { topic: 'earth', prompt: 'What can the remains or traces of ancient living things preserved in rock be called?', options: ['Fossils', 'Clouds', 'Crystals'], answer: 'Fossils', fact: 'Fossils give scientists clues about plants and animals from long ago.' },
  { topic: 'earth', prompt: 'What is Earth’s hard outer layer called?', options: ['Crust', 'Core', 'Sky'], answer: 'Crust', fact: 'The crust is the thin, rocky outer layer where we live.' },
  { topic: 'earth', prompt: 'What pulls most ocean tides up and down?', options: ['The Moon’s gravity', 'Cloud shadows', 'Mountains'], answer: 'The Moon’s gravity', fact: 'The Moon’s gravity is the main cause of the repeating rise and fall of ocean tides.' },
  { topic: 'earth', prompt: 'What imaginary line circles Earth halfway between the poles?', options: ['Equator', 'Horizon', 'Orbit'], answer: 'Equator', fact: 'The equator divides Earth into the Northern and Southern Hemispheres.' },
  { topic: 'earth', prompt: 'What is energy from sunlight called?', options: ['Solar energy', 'Sound energy', 'Tidal rock'], answer: 'Solar energy', fact: 'Solar panels can change sunlight into electricity.' },
  { topic: 'earth', prompt: 'Which of these is a renewable energy source?', options: ['Wind', 'Coal', 'Oil'], answer: 'Wind', fact: 'Wind is naturally replaced, so it is a renewable energy source.' },
  { topic: 'earth', prompt: 'What do we call the breaking down and movement of rocks by wind or water?', options: ['Erosion', 'Pollination', 'Orbiting'], answer: 'Erosion', fact: 'Wind, water, and ice can slowly wear away and move pieces of rock and soil.' },
]

const QUESTIONS_PER_ROUND = 10

const QUESTIONS_WITH_DIFFICULTY: ScienceQuestion[] = (() => {
  const topicCounts: Record<ScienceTopic, number> = {
    animals: 0,
    plants: 0,
    space: 0,
    'human-body': 0,
    earth: 0,
  }
  const levels: ScienceDifficulty[] = ['easy', 'medium', 'hard']

  return QUESTIONS.map((question) => {
    const topicIndex = topicCounts[question.topic]
    topicCounts[question.topic] += 1
    return { ...question, difficulty: levels[Math.floor(topicIndex / 5)] }
  })
})()

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function createRound(topic: ScienceTopicFilter, difficulty: ScienceDifficulty): ScienceQuestion[] {
  const available = QUESTIONS_WITH_DIFFICULTY.filter((question) =>
    (topic === 'all' || question.topic === topic) && question.difficulty === difficulty,
  )
  return shuffled(available)
    .slice(0, QUESTIONS_PER_ROUND)
    .map((question) => ({ ...question, options: shuffled(question.options) }))
}

function Round({
  topic,
  difficulty,
  onRestart,
}: {
  topic: ScienceTopicFilter
  difficulty: ScienceDifficulty
  onRestart: () => void
}) {
  const [questions] = useState(() => createRound(topic, difficulty))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  if (index >= questions.length) {
    return (
      <div className="science-result center">
        <p className="celebrate" role="status">🌟 You got {score} out of {questions.length}!</p>
        <button type="button" className="btn" onClick={onRestart}>Play again</button>
      </div>
    )
  }

  const question = questions[index]
  const answered = picked !== null

  const nextQuestion = () => {
    setPicked(null)
    setIndex((current) => current + 1)
  }

  return (
    <div className="science-game">
      <p className="center muted">
        Question {index + 1} of {questions.length} · Score {score}
      </p>
      <p className="center math-topic">{SCIENCE_TOPIC_LABELS[question.topic]}</p>
      <p className="math-prompt" aria-live="polite">{question.prompt}</p>
      <div className="math-options">
        {question.options.map((option) => {
          let className = 'math-option'
          if (answered && option === question.answer) className += ' correct'
          else if (answered && option === picked) className += ' wrong'
          return (
            <button
              key={option}
              type="button"
              className={className}
              disabled={answered}
              onClick={() => {
                setPicked(option)
                if (option === question.answer) setScore((current) => current + 1)
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="science-fact" role="status">
          <strong>{picked === question.answer ? 'Correct! Well done!' : `Nice try! The answer is ${question.answer}.`}</strong>
          <p>{question.fact}</p>
        </div>
      )}
      <p className="center">
        <button type="button" className="btn" disabled={!answered} onClick={nextQuestion}>
          {index + 1 === questions.length ? 'See score' : 'Next question'}
        </button>
      </p>
    </div>
  )
}

export default function ScienceExplorerGame({
  topic,
  difficulty,
}: {
  topic: ScienceTopicFilter
  difficulty: ScienceDifficulty
}) {
  const [round, setRound] = useState(0)
  return (
    <Round
      key={`${topic}:${difficulty}:${round}`}
      topic={topic}
      difficulty={difficulty}
      onRestart={() => setRound((current) => current + 1)}
    />
  )
}

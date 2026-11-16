import type { AgeGroupId } from '../../data/ageGroups.ts'
import type { CuratedWord } from './englishTypes.ts'

export const CURATED_WORDS: CuratedWord[] = [
  // Little Explorers (Ages 2-5)
  {
    word: 'rainbow',
    ageGroup: 'explorers',
    category: 'Nature & Colors',
    hint: 'A colorful arc in the sky after the rain',
    fallbackData: {
      word: 'rainbow',
      phonetic: '/ˈreɪn.boʊ/',
      phonetics: [{ text: '/ˈreɪn.boʊ/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'An arc of colored light in the sky caused by sunlight shining through raindrops.',
              example: 'Look up in the sky, there is a bright rainbow after the rain!',
              synonyms: ['arc of colors', 'prism', 'spectrum'],
              antonyms: ['darkness', 'gloom'],
            },
          ],
          synonyms: ['spectrum', 'prism'],
          antonyms: [],
        },
      ],
      origin: 'Old English "regnboga", from "regn" (rain) + "boga" (bow, arch).',
      funFact: 'A rainbow is actually a full circle of light, but from the ground we usually see only an arc!',
    },
  },
  {
    word: 'puppy',
    ageGroup: 'explorers',
    category: 'Animals',
    hint: 'A young and playful dog',
    fallbackData: {
      word: 'puppy',
      phonetic: '/ˈpʌp.i/',
      phonetics: [{ text: '/ˈpʌp.i/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A young dog, especially one less than a year old.',
              example: 'The fluffy puppy wagged its tail and ran around the yard.',
              synonyms: ['pup', 'doggy', 'canine'],
              antonyms: ['adult dog'],
            },
          ],
          synonyms: ['pup', 'pooch'],
          antonyms: [],
        },
      ],
      origin: 'From Middle English "popet" (doll or small baby), related to French "poupée".',
      funFact: 'Puppies are born without teeth and open their eyes after about two weeks!',
    },
  },
  {
    word: 'sparkle',
    ageGroup: 'explorers',
    category: 'Wonder & Actions',
    hint: 'To shine brightly with little flashes of light',
    fallbackData: {
      word: 'sparkle',
      phonetic: '/ˈspɑːr.kəl/',
      phonetics: [{ text: '/ˈspɑːr.kəl/' }],
      meanings: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To shine with little flashes of light.',
              example: 'The stars sparkle like diamonds in the night sky.',
              synonyms: ['glitter', 'twinkle', 'shimmer', 'shine'],
              antonyms: ['fade', 'dull', 'dim'],
            },
          ],
          synonyms: ['glitter', 'twinkle'],
          antonyms: ['fade'],
        },
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A little flash or gleam of light.',
              example: 'There was a playful sparkle in her eyes.',
              synonyms: ['glint', 'glimmer'],
              antonyms: ['dullness'],
            },
          ],
          synonyms: ['glint', 'gleam'],
          antonyms: [],
        },
      ],
      origin: 'Middle English "sparklen", frequentative of "spark".',
      funFact: 'Snowflakes sparkle because their ice crystals act like tiny mirrors reflecting sunlight!',
    },
  },
  {
    word: 'happy',
    ageGroup: 'explorers',
    category: 'Feelings',
    hint: 'Feeling full of joy, smiles, and good cheer',
    fallbackData: {
      word: 'happy',
      phonetic: '/ˈhæp.i/',
      phonetics: [{ text: '/ˈhæp.i/' }],
      meanings: [
        {
          partOfSpeech: 'adjective',
          definitions: [
            {
              definition: 'Feeling or showing pleasure, contentment, or joy.',
              example: 'The children were very happy when they went to the park.',
              synonyms: ['cheerful', 'joyful', 'glad', 'delighted'],
              antonyms: ['sad', 'unhappy', 'gloomy', 'upset'],
            },
          ],
          synonyms: ['joyful', 'glad', 'cheerful'],
          antonyms: ['sad', 'gloomy'],
        },
      ],
      origin: 'From Middle English "hap" (good fortune, luck).',
      funFact: 'Smiling actually sends signals to your brain that help you feel happier!',
    },
  },
  {
    word: 'garden',
    ageGroup: 'explorers',
    category: 'Nature',
    hint: 'A place where flowers, fruits, and vegetables grow',
    fallbackData: {
      word: 'garden',
      phonetic: '/ˈɡɑːr.dən/',
      phonetics: [{ text: '/ˈɡɑːr.dən/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A piece of ground used for growing flowers, fruit, or vegetables.',
              example: 'We planted bright sunflowers and sweet strawberries in our garden.',
              synonyms: ['yard', 'plot', 'patch', 'orchard'],
              antonyms: ['wasteland'],
            },
          ],
          synonyms: ['yard', 'orchard'],
          antonyms: [],
        },
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To cultivate or work in a garden.',
              example: 'Grandma loves to garden every Saturday morning.',
              synonyms: ['plant', 'cultivate'],
              antonyms: ['neglect'],
            },
          ],
          synonyms: ['plant', 'tend'],
          antonyms: [],
        },
      ],
      origin: 'From Old Northern French "jardin", of Germanic origin related to "yard" and "enclosure".',
      funFact: 'Earthworms in gardens make the soil rich and healthy for plants to grow!',
    },
  },
  {
    word: 'bounce',
    ageGroup: 'explorers',
    category: 'Actions',
    hint: 'To spring back up after hitting a surface',
    fallbackData: {
      word: 'bounce',
      phonetic: '/baʊns/',
      phonetics: [{ text: '/baʊns/' }],
      meanings: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To spring back after hitting a surface.',
              example: 'The rubber ball bounces very high on the playground.',
              synonyms: ['rebound', 'spring', 'hop', 'bound'],
              antonyms: ['stick', 'drop', 'sink'],
            },
          ],
          synonyms: ['rebound', 'spring'],
          antonyms: ['sink'],
        },
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A bound or rebound.',
              example: 'The ball took a high bounce over the fence.',
              synonyms: ['rebound', 'hop'],
              antonyms: [],
            },
          ],
          synonyms: ['rebound'],
          antonyms: [],
        },
      ],
      origin: 'Middle English "bounsen" (to thump or hit).',
      funFact: 'Rubber balls bounce because the trapped elastic energy pushes them right back up!',
    },
  },
  {
    word: 'cookie',
    ageGroup: 'explorers',
    category: 'Food & Fun',
    hint: 'A sweet baked snack that is delicious to eat',
  },
  {
    word: 'kitten',
    ageGroup: 'explorers',
    category: 'Animals',
    hint: 'A baby cat with soft fur and tiny paws',
  },
  {
    word: 'butterfly',
    ageGroup: 'explorers',
    category: 'Animals & Nature',
    hint: 'An insect with large, beautiful, colorful wings',
  },
  {
    word: 'sunshine',
    ageGroup: 'explorers',
    category: 'Nature',
    hint: 'Direct light and warmth coming from the sun',
  },

  // Curious Minds (Ages 5-9)
  {
    word: 'adventure',
    ageGroup: 'curious',
    category: 'Exploration',
    hint: 'An exciting and unusual experience or journey',
    fallbackData: {
      word: 'adventure',
      phonetic: '/ədˈven.tʃər/',
      phonetics: [{ text: '/ədˈven.tʃər/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'An unusual, exciting, and sometimes risky experience or journey.',
              example: 'The brave explorers went on a thrilling jungle adventure.',
              synonyms: ['journey', 'quest', 'expedition', 'escapade'],
              antonyms: ['routine', 'boredom', 'inaction'],
            },
          ],
          synonyms: ['quest', 'expedition', 'venture'],
          antonyms: ['routine'],
        },
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To engage in an exciting and risky trip or journey.',
              example: 'They adventured deep into the mysterious enchanted forest.',
              synonyms: ['venture', 'explore'],
              antonyms: ['stay put'],
            },
          ],
          synonyms: ['venture'],
          antonyms: [],
        },
      ],
      origin: 'From Old French "aventure", from Latin "adventura" (about to happen / fortune).',
      funFact: 'The word adventure originally meant "what happens by chance or destiny"!',
    },
  },
  {
    word: 'curious',
    ageGroup: 'curious',
    category: 'Minds & Thinking',
    hint: 'Eager to learn or know about something',
    fallbackData: {
      word: 'curious',
      phonetic: '/ˈkjʊr.i.əs/',
      phonetics: [{ text: '/ˈkjʊr.i.əs/' }],
      meanings: [
        {
          partOfSpeech: 'adjective',
          definitions: [
            {
              definition: 'Eager to learn, know, or investigate new things.',
              example: 'Curious kids ask wonderful questions about how the world works.',
              synonyms: ['inquisitive', 'interested', 'eager', 'inquiring'],
              antonyms: ['indifferent', 'uninterested', 'bored'],
            },
            {
              definition: 'Strange or unusual in an interesting way.',
              example: 'We found a curious round stone on the beach.',
              synonyms: ['unusual', 'strange', 'peculiar', 'fascinating'],
              antonyms: ['ordinary', 'typical', 'common'],
            },
          ],
          synonyms: ['inquisitive', 'interested', 'puzzling'],
          antonyms: ['uninterested', 'ordinary'],
        },
      ],
      origin: 'From Latin "curiosus" (careful, inquisitive), from "cura" (care).',
      funFact: 'NASA named its Mars rover "Curiosity" in honor of humanity\'s quest to explore!',
    },
  },
  {
    word: 'treasure',
    ageGroup: 'curious',
    category: 'Stories & Discovery',
    hint: 'Valuable things like gold, jewels, or precious memories',
    fallbackData: {
      word: 'treasure',
      phonetic: '/ˈtreʒ.ər/',
      phonetics: [{ text: '/ˈtreʒ.ər/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A quantity of precious metals, gems, or other valuable objects.',
              example: 'The pirates hid a chest of shining treasure on the secret island.',
              synonyms: ['wealth', 'riches', 'gems', 'jewels', 'prize'],
              antonyms: ['trash', 'junk', 'rubbish'],
            },
            {
              definition: 'Something or someone greatly valued and cherished.',
              example: 'Grandma says our handmade drawings are her greatest treasure.',
              synonyms: ['gem', 'darling', 'darling', 'prize'],
              antonyms: [],
            },
          ],
          synonyms: ['riches', 'prize'],
          antonyms: ['junk'],
        },
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To value, cherish, and protect greatly.',
              example: 'I will treasure this friendship bracelet forever.',
              synonyms: ['cherish', 'prize', 'value', 'appreciate'],
              antonyms: ['neglect', 'disregard', 'scorn'],
            },
          ],
          synonyms: ['cherish', 'value'],
          antonyms: ['neglect'],
        },
      ],
      origin: 'From Old French "tresor", from Latin "thesaurus" (storehouse, treasure).',
      funFact: 'A "thesaurus" (book of synonyms) literally means a "treasury of words" in Greek!',
    },
  },
  {
    word: 'gravity',
    ageGroup: 'curious',
    category: 'Science & Space',
    hint: 'The invisible force that pulls objects toward Earth',
    fallbackData: {
      word: 'gravity',
      phonetic: '/ˈɡræv.ə.ti/',
      phonetics: [{ text: '/ˈɡræv.ə.ti/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'The natural physical force that attracts objects toward the center of the earth or another celestial body.',
              example: 'Gravity keeps our feet planted on the ground and pulls apples down from trees.',
              synonyms: ['gravitation', 'pull', 'attraction'],
              antonyms: ['weightlessness', 'levitation'],
            },
            {
              definition: 'Extreme importance or seriousness.',
              example: 'We understood the gravity of protecting our oceans.',
              synonyms: ['seriousness', 'importance', 'severity'],
              antonyms: ['levity', 'frivolity', 'playfulness'],
            },
          ],
          synonyms: ['gravitation', 'pull'],
          antonyms: ['weightlessness'],
        },
      ],
      origin: 'From Latin "gravitas" (weight, heaviness), from "gravis" (heavy).',
      funFact: 'On the Moon, gravity is only one-sixth as strong as on Earth, which lets astronauts leap high into the air!',
    },
  },
  {
    word: 'courage',
    ageGroup: 'curious',
    category: 'Character',
    hint: 'Bravery when facing something scary or difficult',
    fallbackData: {
      word: 'courage',
      phonetic: '/ˈkɜːr.ɪdʒ/',
      phonetics: [{ text: '/ˈkɜːr.ɪdʒ/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'The ability to do something that frightens you; bravery in difficult situations.',
              example: 'It took courage to speak in front of the whole school, but Maya did it with a big smile.',
              synonyms: ['bravery', 'valour', 'fearlessness', 'boldness', 'grit'],
              antonyms: ['cowardice', 'fear', 'timidity'],
            },
          ],
          synonyms: ['bravery', 'boldness', 'grit'],
          antonyms: ['cowardice', 'fear'],
        },
      ],
      origin: 'From Old French "corage", from Latin "cor" (heart).',
      funFact: 'Because courage comes from the Latin word for "heart", having courage literally means "acting from the heart"!',
    },
  },
  {
    word: 'dinosaur',
    ageGroup: 'curious',
    category: 'History & Animals',
    hint: 'A prehistoric reptile that lived millions of years ago',
  },
  {
    word: 'whisper',
    ageGroup: 'curious',
    category: 'Communication',
    hint: 'To speak very softly using only one\'s breath',
  },
  {
    word: 'volcano',
    ageGroup: 'curious',
    category: 'Earth & Nature',
    hint: 'A mountain with an opening where lava and steam erupt',
  },
  {
    word: 'magnificent',
    ageGroup: 'curious',
    category: 'Wonder',
    hint: 'Extremely beautiful, grand, and impressive',
  },
  {
    word: 'ecosystem',
    ageGroup: 'curious',
    category: 'Nature & Science',
    hint: 'A community of living organisms interacting with their environment',
  },

  // Creative Minds (Ages 10-12)
  {
    word: 'resilience',
    ageGroup: 'creative',
    category: 'Mindset & Growth',
    hint: 'The capacity to recover quickly from difficulties and bounce back',
    fallbackData: {
      word: 'resilience',
      phonetic: '/rɪˈzɪl.jəns/',
      phonetics: [{ text: '/rɪˈzɪl.jəns/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'The capacity to recover quickly from difficulties; toughness and elasticity.',
              example: 'Showing great resilience, the team practiced harder after losing their first game and won the trophy.',
              synonyms: ['grit', 'perseverance', 'toughness', 'elasticity', 'fortitude'],
              antonyms: ['fragility', 'weakness', 'vulnerability'],
            },
          ],
          synonyms: ['grit', 'perseverance', 'fortitude'],
          antonyms: ['fragility', 'defeatism'],
        },
      ],
      origin: 'From Latin "resiliens", present participle of "resilire" (to leap back, rebound).',
      funFact: 'Rubber trees produce latex sap which gives materials natural physical resilience to stretch and bounce back!',
    },
  },
  {
    word: 'telescope',
    ageGroup: 'creative',
    category: 'Science & Astronomy',
    hint: 'An optical instrument used to view distant objects like stars and planets',
    fallbackData: {
      word: 'telescope',
      phonetic: '/ˈtel.ə.skoʊp/',
      phonetics: [{ text: '/ˈtel.ə.skoʊp/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'An optical instrument designed to make distant objects appear nearer, containing an arrangement of lenses and mirrors.',
              example: 'Through the telescope, we could see the rings of Saturn and four moons of Jupiter.',
              synonyms: ['spyglass', 'scope', 'refractor', 'reflector'],
              antonyms: ['microscope'],
            },
          ],
          synonyms: ['spyglass', 'scope'],
          antonyms: [],
        },
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To slide or force together one inside another like sections of a collapsible tube.',
              example: 'The folding camping chair telescopes neatly into a compact carry bag.',
              synonyms: ['collapse', 'compress', 'condense'],
              antonyms: ['expand', 'extend'],
            },
          ],
          synonyms: ['collapse', 'condense'],
          antonyms: ['expand'],
        },
      ],
      origin: 'From Greek "tele" (far) + "skopein" (to look or see).',
      funFact: 'The James Webb Space Telescope uses gold-coated mirrors to capture infrared light from galaxies formed over 13 billion years ago!',
    },
  },
  {
    word: 'constellation',
    ageGroup: 'creative',
    category: 'Astronomy & Mythology',
    hint: 'A recognizable pattern of stars in the night sky',
    fallbackData: {
      word: 'constellation',
      phonetic: '/ˌkɑːn.stəˈleɪ.ʃən/',
      phonetics: [{ text: '/ˌkɑːn.stəˈleɪ.ʃən/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A group of stars forming a recognizable pattern that is traditionally named after its apparent form or a mythological figure.',
              example: 'We easily identified Orion the Hunter and the Big Dipper in the night sky.',
              synonyms: ['star pattern', 'asterism', 'galaxy', 'cluster'],
              antonyms: ['isolated star'],
            },
            {
              definition: 'A gathering or group of related things or people.',
              example: 'A constellation of young scientists presented their inventions at the fair.',
              synonyms: ['array', 'collection', 'assemblage'],
              antonyms: [],
            },
          ],
          synonyms: ['star pattern', 'cluster', 'array'],
          antonyms: [],
        },
      ],
      origin: 'From Latin "constellatio", from "con-" (together) + "stella" (star).',
      funFact: 'Astronomers officially recognize 88 constellations covering the entire celestial sphere of Earth!',
    },
  },
  {
    word: 'brilliant',
    ageGroup: 'creative',
    category: 'Qualities & Mind',
    hint: 'Exceptionally clever, radiant, or luminous',
    fallbackData: {
      word: 'brilliant',
      phonetic: '/ˈbrɪl.jənt/',
      phonetics: [{ text: '/ˈbrɪl.jənt/' }],
      meanings: [
        {
          partOfSpeech: 'adjective',
          definitions: [
            {
              definition: 'Exceptionally clever, talented, or impressive.',
              example: 'Ada Lovelace wrote a brilliant algorithm that made her the world’s first computer programmer.',
              synonyms: ['ingenious', 'gifted', 'masterly', 'smart', 'exceptional'],
              antonyms: ['foolish', 'dull', 'clueless'],
            },
            {
              definition: 'Shining very brightly; radiant with light or vivid color.',
              example: 'The sun produced a brilliant sunset over the calm ocean.',
              synonyms: ['dazzling', 'luminous', 'radiant', 'gleaming'],
              antonyms: ['dim', 'dark', 'drab'],
            },
          ],
          synonyms: ['ingenious', 'radiant', 'dazzling'],
          antonyms: ['dull', 'dim'],
        },
      ],
      origin: 'From French "brillant" (shining), from Italian "brillare" (to sparkle).',
      funFact: 'In diamond cutting, a "brilliant cut" has 57 or 58 facets precisely angled to maximize sparkle and rainbow reflections!',
    },
  },
  {
    word: 'harmony',
    ageGroup: 'creative',
    category: 'Music & Life',
    hint: 'A pleasing arrangement of sounds, parts, or peaceful relationships',
  },
  {
    word: 'labyrinth',
    ageGroup: 'creative',
    category: 'Puzzles & Mythology',
    hint: 'A complicated network of winding passages; a maze',
  },
  {
    word: 'serendipity',
    ageGroup: 'creative',
    category: 'Wonder & Discovery',
    hint: 'Finding valuable or agreeable things not sought for; happy coincidence',
  },
  {
    word: 'eloquent',
    ageGroup: 'creative',
    category: 'Language & Speech',
    hint: 'Fluent or persuasive in speaking or writing',
  },
  {
    word: 'astronaut',
    ageGroup: 'creative',
    category: 'Space Exploration',
    hint: 'A person trained to travel in a spacecraft',
  },
  {
    word: 'kaleidoscope',
    ageGroup: 'creative',
    category: 'Art & Geometry',
    hint: 'A tube with mirrors and colored glass that shows changing symmetrical patterns',
  },
]

export function getCuratedWordsByAge(age?: AgeGroupId): CuratedWord[] {
  const safeWords = CURATED_WORDS.filter((word) => word.fallbackData)
  if (!age) return safeWords
  return safeWords.filter((word) => word.ageGroup === age)
}

export function findChildSafeEnglishWord(query: string): CuratedWord | undefined {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return undefined
  return CURATED_WORDS.find(
    (word) => word.fallbackData && word.word.toLowerCase() === normalized,
  )
}

export function getRandomCuratedWord(age?: AgeGroupId, excludeWord?: string): CuratedWord {
  const pool = getCuratedWordsByAge(age).filter(
    (w) => !excludeWord || w.word.toLowerCase() !== excludeWord.toLowerCase()
  )
  const list = pool.length > 0 ? pool : getCuratedWordsByAge()
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}

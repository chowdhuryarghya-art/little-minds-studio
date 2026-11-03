import type { AgeGroupId } from '../../data/ageGroups.ts'

export interface WordEntry {
  word: string
  /** A picture hint for children who are still learning to read. */
  emoji?: string
}

const plain = (words: string): WordEntry[] => words.split(' ').map((word) => ({ word }))

/** Capital letters A to Z only; no palindromes (they would read the same both ways). */
export const WORD_POOLS = {
  explorers: [
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'BEE', emoji: '🐝' },
    { word: 'PIG', emoji: '🐷' },
    { word: 'COW', emoji: '🐮' },
    { word: 'HEN', emoji: '🐔' },
    { word: 'FOX', emoji: '🦊' },
    { word: 'BUS', emoji: '🚌' },
    { word: 'CAR', emoji: '🚗' },
    { word: 'HAT', emoji: '🎩' },
    { word: 'EGG', emoji: '🥚' },
    { word: 'MOON', emoji: '🌙' },
    { word: 'STAR', emoji: '⭐' },
    { word: 'FISH', emoji: '🐟' },
    { word: 'BIRD', emoji: '🐦' },
    { word: 'FROG', emoji: '🐸' },
    { word: 'DUCK', emoji: '🦆' },
    { word: 'TREE', emoji: '🌳' },
    { word: 'CAKE', emoji: '🍰' },
    { word: 'BALL', emoji: '⚽' },
    { word: 'BOOK', emoji: '📖' },
    { word: 'RAIN', emoji: '🌧️' },
    { word: 'LION', emoji: '🦁' },
    { word: 'BEAR', emoji: '🐻' },
    { word: 'CRAB', emoji: '🦀' },
    { word: 'MILK', emoji: '🥛' },
    { word: 'SNOW', emoji: '❄️' },
    { word: 'BOAT', emoji: '⛵' },
    { word: 'DRUM', emoji: '🥁' },
    { word: 'CORN', emoji: '🌽' },
    { word: 'OWL', emoji: '🦉' },
    { word: 'ANT', emoji: '🐜' },
    { word: 'BAT', emoji: '🦇' },
    { word: 'KEY', emoji: '🔑' },
    { word: 'BED', emoji: '🛏️' },
    { word: 'GOAT', emoji: '🐐' },
    { word: 'SEAL', emoji: '🦭' },
    { word: 'SWAN', emoji: '🦢' },
    { word: 'WOLF', emoji: '🐺' },
    { word: 'DEER', emoji: '🦌' },
    { word: 'PEAR', emoji: '🍐' },
    { word: 'KITE', emoji: '🪁' },
    { word: 'SHIP', emoji: '🚢' },
    { word: 'BELL', emoji: '🔔' },
    { word: 'RING', emoji: '💍' },
    { word: 'SOCK', emoji: '🧦' },
    { word: 'SHOE', emoji: '👟' },
    { word: 'LEAF', emoji: '🍃' },
    { word: 'ROSE', emoji: '🌹' },
    { word: 'FIRE', emoji: '🔥' },
    { word: 'HEART', emoji: '❤️' },
    { word: 'CLOCK', emoji: '⏰' },
    { word: 'TRUCK', emoji: '🚚' },
  ],
  curious: plain(
    'APPLE BANANA ORANGE GRAPES LEMON PEACH TIGER ZEBRA HORSE SHEEP MOUSE SNAKE WHALE SHARK EAGLE PANDA KOALA MONKEY RABBIT TURTLE GARDEN SCHOOL PLANET ROCKET CLOUD RIVER OCEAN BEACH MUSIC PAINT PIZZA CANDY BREAD SPOON TRAIN ROBOT CASTLE DRAGON PIRATE FOREST WINTER SUMMER SPRING BRIDGE FLOWER ANIMAL BUTTER CARROT COOKIE DOCTOR DONKEY FAMILY FINGER HAMMER INSECT JACKET KITTEN LADDER MARKET NATURE PARROT PENCIL PUPPY SPIDER TICKET TUNNEL UMBRELLA VIOLET WINDOW YELLOW ZIPPER BASKET CAMERA DINNER ENGINE FARMER GUITAR HELMET JELLY KNIGHT LIZARD NEEDLE OTTER SUNSET TOMATO VALLEY',
  ),
  creative: plain(
    'ADVENTURE ASTRONAUT BUTTERFLY CHOCOLATE DINOSAUR ELEPHANT FIREWORKS GALAXY HURRICANE ISLAND JUNGLE KANGAROO MOUNTAIN NOTEBOOK OCTOPUS PENGUIN QUESTION RAINBOW SANDWICH TELESCOPE UNIVERSE VOLCANO WATERFALL TREASURE MYSTERY PUZZLE DOLPHIN GIRAFFE PYRAMID COMPASS HARVEST LANTERN MAGNET SUBMARINE THUNDER EXPLORER JOURNEY KEYBOARD LIBRARY MUSEUM ORCHESTRA PAINTER VIOLIN WIZARD ALPHABET BLIZZARD CALENDAR CAVERN CHAMPION DETECTIVE ENGINEER FESTIVAL GLACIER HORIZON INVENTOR JIGSAW LIGHTHOUSE MARATHON NAVIGATOR PLATFORM QUARTZ RAINFOREST SCULPTURE TORNADO UNICORN VOYAGE WILDLIFE XYLOPHONE ZEPPELIN ASTEROID BOOMERANG CARNIVAL DIAMOND EMERALD FOSSIL GRAVITY HEMISPHERE IGLOO JAVELIN LABYRINTH METEOR NEBULA OXYGEN',
  ),
} satisfies Record<'explorers' | 'curious' | 'creative', WordEntry[]>

/** "CAT🐱 DOG🐶" -> words with picture hints (the hint is everything after the capital letters). */
const hinted = (entries: string): WordEntry[] =>
  entries.split(' ').map((entry) => {
    const match = /^([A-Z]+)(.+)$/u.exec(entry)
    if (!match) throw new Error(`Bad word entry: ${entry}`)
    return { word: match[1], emoji: match[2] }
  })

export type ThemeId = 'animals' | 'food' | 'space' | 'ocean' | 'nature'

export interface Theme {
  id: ThemeId
  name: string
  /** Every list needs at least 2 x the number of words in a puzzle, so puzzles stay varied. */
  words: Record<AgeGroupId, WordEntry[]>
}

export const THEMES: Theme[] = [
  {
    id: 'animals',
    name: 'Animals',
    words: {
      explorers: hinted(
        'CAT🐱 DOG🐶 PIG🐷 COW🐮 HEN🐔 FOX🦊 OWL🦉 BEE🐝 ANT🐜 BAT🦇 GOAT🐐 DUCK🦆 FROG🐸 LION🦁 BEAR🐻 WOLF🐺 DEER🦌 SWAN🦢 BIRD🐦 HORSE🐴 SHEEP🐑 MOUSE🐭 ZEBRA🦓 PANDA🐼 TIGER🐯',
      ),
      curious: plain(
        'TIGER ZEBRA HORSE SHEEP MOUSE SNAKE WHALE SHARK EAGLE PANDA KOALA MONKEY RABBIT TURTLE PARROT DONKEY KITTEN PUPPY SPIDER LIZARD OTTER CAMEL BEAVER DOLPHIN PENGUIN GIRAFFE',
      ),
      creative: plain(
        'ELEPHANT KANGAROO BUTTERFLY DOLPHIN GIRAFFE PENGUIN OCTOPUS CHEETAH GORILLA CROCODILE HEDGEHOG FLAMINGO PORCUPINE CHAMELEON ALLIGATOR SQUIRREL BUFFALO LEOPARD ORANGUTAN JELLYFISH SCORPION',
      ),
    },
  },
  {
    id: 'food',
    name: 'Food',
    words: {
      explorers: hinted(
        'CAKE🍰 MILK🥛 EGG🥚 PEAR🍐 CORN🌽 RICE🍚 PIE🥧 BREAD🍞 APPLE🍎 LEMON🍋 PIZZA🍕 GRAPE🍇 PEACH🍑 MANGO🥭 HONEY🍯 PASTA🍝 SOUP🍲 CHEESE🧀 BANANA🍌 COOKIE🍪',
      ),
      curious: plain(
        'APPLE BANANA ORANGE GRAPES LEMON PEACH CARROT COOKIE BUTTER TOMATO POTATO CHEESE NOODLES PANCAKE SANDWICH BISCUIT CEREAL YOGURT PEPPER ONION BREAD PIZZA CANDY MELON CHERRY WAFFLE MUFFIN PRETZEL POPCORN',
      ),
      creative: plain(
        'CHOCOLATE SANDWICH PINEAPPLE STRAWBERRY BLUEBERRY WATERMELON SPAGHETTI LASAGNA BROCCOLI CUCUMBER PANCAKES CINNAMON MUSHROOM AVOCADO RASPBERRY COCONUT PUMPKIN CROISSANT OMELETTE VEGETABLE DUMPLING',
      ),
    },
  },
  {
    id: 'space',
    name: 'Space',
    words: {
      explorers: hinted(
        'SUN☀️ MOON🌙 STAR⭐ EARTH🌍 MARS🔴 COMET☄️ ROCKET🚀 ALIEN👽 UFO🛸 SKY🌌 SATURN🪐 NIGHT🌃',
      ),
      curious: plain(
        'PLANET ROCKET GALAXY COMET ORBIT METEOR SATURN JUPITER URANUS MERCURY NEPTUNE VENUS PLUTO ECLIPSE LAUNCH GRAVITY CRATER ALIEN',
      ),
      creative: plain(
        'ASTRONAUT TELESCOPE UNIVERSE GALAXY METEORITE SATELLITE SUPERNOVA ASTEROID NEBULA GRAVITY ECLIPSE ORBIT COSMOS MILKYWAY LAUNCHPAD SPACESHIP SPACESUIT STARDUST',
      ),
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    words: {
      explorers: hinted(
        'FISH🐟 CRAB🦀 WHALE🐋 SHARK🦈 SEAL🦭 SHELL🐚 BOAT⛵ SHIP🚢 WAVE🌊 SAND🏖️ SWIM🏊 TURTLE🐢 SQUID🦑',
      ),
      curious: plain(
        'DOLPHIN OCTOPUS SEAHORSE STARFISH LOBSTER TURTLE WHALE SHARK CORAL ANCHOR HARBOR BEACH ISLAND TREASURE PIRATE SAILOR PEARL SQUID',
      ),
      creative: plain(
        'JELLYFISH SUBMARINE LIGHTHOUSE SEAHORSE STARFISH OCTOPUS DOLPHIN LOBSTER TREASURE PLANKTON WHIRLPOOL SEAWEED SHIPWRECK PORPOISE BARNACLE CORALREEF HURRICANE SWORDFISH STINGRAY MANATEE NARWHAL',
      ),
    },
  },
  {
    id: 'nature',
    name: 'Weather & Nature',
    words: {
      explorers: hinted(
        'SUN☀️ RAIN🌧️ SNOW❄️ WIND💨 CLOUD☁️ STORM⛈️ TREE🌳 LEAF🍃 ROSE🌹 GRASS🌱 RIVER🏞️ HILL⛰️ ICE🧊 FLOWER🌸',
      ),
      curious: plain(
        'THUNDER RAINBOW FOREST RIVER OCEAN DESERT VALLEY MEADOW BREEZE SUNSET SUNRISE WINTER SUMMER SPRING AUTUMN FLOWER GARDEN MOUNTAIN ISLAND PUDDLE',
      ),
      creative: plain(
        'HURRICANE THUNDER LIGHTNING RAINFOREST WATERFALL MOUNTAIN VOLCANO TORNADO BLIZZARD GLACIER SUNSHINE DROUGHT EARTHQUAKE AVALANCHE CLIMATE HORIZON CANYON LANDSLIDE',
      ),
    },
  },
]

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value)
}

export function getTheme(id: ThemeId): Theme {
  const theme = THEMES.find((t) => t.id === id)
  if (!theme) throw new Error(`Unknown theme: ${id}`)
  return theme
}

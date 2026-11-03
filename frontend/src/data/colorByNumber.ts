import { PALETTE } from '../games/coloring/palette.ts'
import { ADDITIONAL_TARGETS } from './additionalPages.ts'
import { MORE_TARGETS } from './morePages.ts'

const c = (name: string): string => {
  const found = PALETTE.find((p) => p.name === name)
  if (!found) throw new Error(`Unknown palette color: ${name}`)
  return found.value
}

/** Target color for every region, per coloring page id. */
export const COLOR_BY_NUMBER: Record<string, Record<string, string>> = {
  fish: {
    tail: c('Orange'),
    'top-fin': c('Orange'),
    'bottom-fin': c('Orange'),
    body: c('Sky blue'),
    'side-fin': c('Yellow'),
  },
  cat: {
    'left-ear': c('Pink'),
    'right-ear': c('Pink'),
    head: c('Orange'),
    muzzle: c('Yellow'),
  },
  butterfly: {
    'wing-ul': c('Purple'),
    'wing-ur': c('Purple'),
    'wing-ll': c('Pink'),
    'wing-lr': c('Pink'),
    'spot-l': c('Yellow'),
    'spot-r': c('Yellow'),
    body: c('Brown'),
    head: c('Brown'),
  },
  turtle: {
    tail: c('Green'),
    'leg-bl': c('Green'),
    'leg-br': c('Green'),
    head: c('Green'),
    shell: c('Dark green'),
    'shell-top': c('Yellow'),
    'shell-left': c('Orange'),
    'shell-right': c('Orange'),
  },
  house: {
    sun: c('Yellow'),
    chimney: c('Brown'),
    walls: c('Sky blue'),
    roof: c('Red'),
    door: c('Brown'),
    window: c('Yellow'),
    'window-2': c('Yellow'),
  },
  robot: {
    'antenna-ball': c('Red'),
    head: c('Grey'),
    'eye-l': c('Sky blue'),
    'eye-r': c('Sky blue'),
    body: c('Blue'),
    badge: c('Yellow'),
    'arm-l': c('Grey'),
    'arm-r': c('Grey'),
    'leg-l': c('Grey'),
    'leg-r': c('Grey'),
  },
  ...MORE_TARGETS,
  ...ADDITIONAL_TARGETS,
}

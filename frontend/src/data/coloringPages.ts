import type { ColoringPage } from '../games/coloring/types.ts'
import { ADDITIONAL_PAGES } from './additionalPages.ts'
import { MORE_PAGES } from './morePages.ts'

/**
 * Original, hand-authored SVG coloring pages. Each region is one tappable area.
 * All pages use a 400x400 viewBox.
 */
export const COLORING_PAGES: ColoringPage[] = [
  {
    id: 'fish',
    title: 'Friendly Fish',
    kind: 'animal',
    ages: ['explorers', 'curious'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'tail', label: 'Tail', tag: 'polygon', attrs: { points: '290,200 380,130 380,270' } },
      { id: 'top-fin', label: 'Top fin', tag: 'polygon', attrs: { points: '150,145 205,85 255,140' }, labelAt: [205, 110] },
      { id: 'bottom-fin', label: 'Bottom fin', tag: 'polygon', attrs: { points: '170,255 215,320 250,260' }, labelAt: [214, 294] },
      { id: 'body', label: 'Body', tag: 'ellipse', attrs: { cx: 190, cy: 200, rx: 120, ry: 78 }, labelAt: [235, 185] },
      { id: 'side-fin', label: 'Side fin', tag: 'ellipse', attrs: { cx: 180, cy: 215, rx: 32, ry: 20 } },
    ],
    details: [
      { id: 'eye', label: 'Eye', tag: 'circle', attrs: { cx: 120, cy: 180, r: 10, class: 'detail-dark' } },
      { id: 'mouth', label: 'Mouth', tag: 'path', attrs: { d: 'M 80 215 Q 95 225 108 215', class: 'detail-line' } },
    ],
  },
  {
    id: 'cat',
    title: 'Curious Cat',
    kind: 'animal',
    ages: ['explorers', 'curious'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'left-ear', label: 'Left ear', tag: 'polygon', attrs: { points: '110,190 120,75 200,140' }, labelAt: [136, 115] },
      { id: 'right-ear', label: 'Right ear', tag: 'polygon', attrs: { points: '290,190 280,75 200,140' }, labelAt: [264, 115] },
      { id: 'head', label: 'Head', tag: 'circle', attrs: { cx: 200, cy: 240, r: 110 }, labelAt: [200, 205] },
      { id: 'muzzle', label: 'Muzzle', tag: 'ellipse', attrs: { cx: 200, cy: 285, rx: 52, ry: 36 }, labelAt: [200, 310] },
    ],
    details: [
      { id: 'eye-l', label: 'Left eye', tag: 'circle', attrs: { cx: 158, cy: 225, r: 11, class: 'detail-dark' } },
      { id: 'eye-r', label: 'Right eye', tag: 'circle', attrs: { cx: 242, cy: 225, r: 11, class: 'detail-dark' } },
      { id: 'nose', label: 'Nose', tag: 'polygon', attrs: { points: '188,268 212,268 200,282', class: 'detail-dark' } },
      { id: 'mouth', label: 'Mouth', tag: 'path', attrs: { d: 'M 200 282 Q 188 300 172 292 M 200 282 Q 212 300 228 292', class: 'detail-line' } },
      { id: 'whiskers', label: 'Whiskers', tag: 'path', attrs: { d: 'M 150 280 L 85 268 M 150 292 L 85 300 M 250 280 L 315 268 M 250 292 L 315 300', class: 'detail-line' } },
    ],
  },
  {
    id: 'butterfly',
    title: 'Beautiful Butterfly',
    kind: 'animal',
    ages: ['explorers', 'curious', 'creative'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'wing-ul', label: 'Upper left wing', tag: 'ellipse', attrs: { cx: 125, cy: 155, rx: 85, ry: 65, transform: 'rotate(-20 125 155)' }, labelAt: [80, 160] },
      { id: 'wing-ur', label: 'Upper right wing', tag: 'ellipse', attrs: { cx: 275, cy: 155, rx: 85, ry: 65, transform: 'rotate(20 275 155)' }, labelAt: [320, 160] },
      { id: 'wing-ll', label: 'Lower left wing', tag: 'ellipse', attrs: { cx: 145, cy: 265, rx: 60, ry: 48, transform: 'rotate(20 145 265)' } },
      { id: 'wing-lr', label: 'Lower right wing', tag: 'ellipse', attrs: { cx: 255, cy: 265, rx: 60, ry: 48, transform: 'rotate(-20 255 265)' } },
      { id: 'spot-l', label: 'Left wing spot', tag: 'circle', attrs: { cx: 115, cy: 150, r: 22 } },
      { id: 'spot-r', label: 'Right wing spot', tag: 'circle', attrs: { cx: 285, cy: 150, r: 22 } },
      { id: 'body', label: 'Body', tag: 'ellipse', attrs: { cx: 200, cy: 215, rx: 15, ry: 85 } },
      { id: 'head', label: 'Head', tag: 'circle', attrs: { cx: 200, cy: 118, r: 20 } },
    ],
    details: [
      { id: 'antennae', label: 'Antennae', tag: 'path', attrs: { d: 'M 192 102 Q 175 65 150 58 M 208 102 Q 225 65 250 58', class: 'detail-line' } },
    ],
  },
  {
    id: 'turtle',
    title: 'Tiny Turtle',
    kind: 'animal',
    ages: ['curious', 'creative'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'tail', label: 'Tail', tag: 'polygon', attrs: { points: '78,222 8,252 82,276' }, labelAt: [46, 251] },
      { id: 'leg-bl', label: 'Back left leg', tag: 'ellipse', attrs: { cx: 120, cy: 300, rx: 26, ry: 40 }, labelAt: [120, 324] },
      { id: 'leg-br', label: 'Back right leg', tag: 'ellipse', attrs: { cx: 255, cy: 300, rx: 26, ry: 40 }, labelAt: [255, 324] },
      { id: 'head', label: 'Head', tag: 'circle', attrs: { cx: 335, cy: 205, r: 42 } },
      { id: 'shell', label: 'Shell', tag: 'ellipse', attrs: { cx: 195, cy: 235, rx: 135, ry: 85 }, labelAt: [195, 290] },
      { id: 'shell-top', label: 'Shell middle', tag: 'ellipse', attrs: { cx: 195, cy: 225, rx: 55, ry: 38 } },
      { id: 'shell-left', label: 'Shell left', tag: 'circle', attrs: { cx: 115, cy: 245, r: 24 } },
      { id: 'shell-right', label: 'Shell right', tag: 'circle', attrs: { cx: 275, cy: 245, r: 24 } },
    ],
    details: [
      { id: 'eye', label: 'Eye', tag: 'circle', attrs: { cx: 355, cy: 195, r: 7, class: 'detail-dark' } },
      { id: 'smile', label: 'Smile', tag: 'path', attrs: { d: 'M 347 220 Q 358 228 369 218', class: 'detail-line' } },
    ],
  },
  {
    id: 'house',
    title: 'Shape House',
    kind: 'shape',
    ages: ['explorers', 'curious'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'sun', label: 'Sun', tag: 'circle', attrs: { cx: 330, cy: 70, r: 38 } },
      { id: 'chimney', label: 'Chimney', tag: 'rect', attrs: { x: 270, y: 80, width: 30, height: 70 } },
      { id: 'walls', label: 'Walls', tag: 'rect', attrs: { x: 90, y: 180, width: 220, height: 170 }, labelAt: [130, 300] },
      { id: 'roof', label: 'Roof', tag: 'polygon', attrs: { points: '70,185 200,80 330,185' } },
      { id: 'door', label: 'Door', tag: 'rect', attrs: { x: 175, y: 255, width: 55, height: 95 } },
      { id: 'window', label: 'Window', tag: 'rect', attrs: { x: 112, y: 215, width: 46, height: 46 } },
      { id: 'window-2', label: 'Second window', tag: 'rect', attrs: { x: 242, y: 215, width: 46, height: 46 } },
    ],
  },
  {
    id: 'robot',
    title: 'Shape Robot',
    kind: 'shape',
    ages: ['curious', 'creative'],
    viewBox: '0 0 400 400',
    regions: [
      { id: 'antenna-ball', label: 'Antenna ball', tag: 'circle', attrs: { cx: 200, cy: 40, r: 16 } },
      { id: 'head', label: 'Head', tag: 'rect', attrs: { x: 130, y: 75, width: 140, height: 100, rx: 14 } },
      { id: 'eye-l', label: 'Left eye', tag: 'circle', attrs: { cx: 170, cy: 120, r: 18 } },
      { id: 'eye-r', label: 'Right eye', tag: 'circle', attrs: { cx: 230, cy: 120, r: 18 } },
      { id: 'body', label: 'Body', tag: 'rect', attrs: { x: 110, y: 190, width: 180, height: 120, rx: 10 }, labelAt: [155, 285] },
      { id: 'badge', label: 'Badge', tag: 'polygon', attrs: { points: '200,205 226,262 174,262' }, labelAt: [200, 246] },
      { id: 'arm-l', label: 'Left arm', tag: 'rect', attrs: { x: 55, y: 195, width: 40, height: 100, rx: 12 } },
      { id: 'arm-r', label: 'Right arm', tag: 'rect', attrs: { x: 305, y: 195, width: 40, height: 100, rx: 12 } },
      { id: 'leg-l', label: 'Left leg', tag: 'rect', attrs: { x: 135, y: 322, width: 45, height: 62, rx: 8 } },
      { id: 'leg-r', label: 'Right leg', tag: 'rect', attrs: { x: 220, y: 322, width: 45, height: 62, rx: 8 } },
    ],
    details: [
      { id: 'antenna', label: 'Antenna', tag: 'path', attrs: { d: 'M 200 56 L 200 75', class: 'detail-line' } },
      { id: 'mouth', label: 'Mouth', tag: 'path', attrs: { d: 'M 170 152 L 230 152', class: 'detail-line' } },
    ],
  },
  ...MORE_PAGES,
  ...ADDITIONAL_PAGES,
]

export function getColoringPage(id: string | undefined): ColoringPage | undefined {
  return COLORING_PAGES.find((p) => p.id === id)
}

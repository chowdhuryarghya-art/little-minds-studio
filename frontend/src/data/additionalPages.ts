import { PALETTE } from '../games/coloring/palette.ts'
import type { AgeGroupId } from './ageGroups.ts'
import type { ColoringPage, Region, RegionTag } from '../games/coloring/types.ts'

const region = (
  id: string,
  label: string,
  tag: RegionTag,
  attrs: Record<string, string | number>,
  labelAt?: [number, number],
): Region => ({ id, label, tag, attrs, ...(labelAt ? { labelAt } : {}) })

const color = (name: string): string => {
  const found = PALETTE.find((entry) => entry.name === name)
  if (!found) throw new Error(`Unknown palette color: ${name}`)
  return found.value
}

interface Template {
  page: ColoringPage
  targets: Record<string, string>
}

function template(
  id: string,
  title: string,
  kind: ColoringPage['kind'],
  ages: AgeGroupId[],
  regions: Region[],
  colors: string[],
  details: Region[] = [],
): Template {
  if (regions.length !== colors.length) {
    throw new Error(`${id} needs one color for each of its ${regions.length} regions`)
  }

  return {
    page: {
      id,
      title,
      kind,
      ages,
      viewBox: '0 0 400 400',
      regions,
      ...(details.length > 0 ? { details } : {}),
    },
    targets: Object.fromEntries(regions.map((part, index) => [part.id, color(colors[index])])),
  }
}

const templates = [
  template('bear', 'Cuddly Bear', 'animal', ['explorers', 'curious'], [
    region('head', 'Head', 'ellipse', { cx: 200, cy: 190, rx: 120, ry: 105 }),
    region('ear-l', 'Left ear', 'circle', { cx: 112, cy: 115, r: 42 }),
    region('ear-r', 'Right ear', 'circle', { cx: 288, cy: 115, r: 42 }),
    region('muzzle', 'Muzzle', 'ellipse', { cx: 200, cy: 235, rx: 58, ry: 42 }),
    region('body', 'Body', 'ellipse', { cx: 200, cy: 335, rx: 82, ry: 54 }),
  ], ['Brown', 'Brown', 'Brown', 'Yellow', 'Brown'], [
    region('eye-l', 'Left eye', 'circle', { cx: 158, cy: 183, r: 8, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 242, cy: 183, r: 8, class: 'detail-dark' }),
    region('nose', 'Nose', 'ellipse', { cx: 200, cy: 222, rx: 13, ry: 9, class: 'detail-dark' }),
    region('mouth', 'Smile', 'path', { d: 'M 200 231 L 200 246 M 200 246 Q 185 260 173 248 M 200 246 Q 215 260 227 248', class: 'detail-line' }),
  ]),
  template('panda', 'Playful Panda', 'animal', ['explorers', 'curious'], [
    region('head', 'Head', 'circle', { cx: 200, cy: 190, r: 120 }),
    region('ear-l', 'Left ear', 'circle', { cx: 118, cy: 112, r: 40 }),
    region('ear-r', 'Right ear', 'circle', { cx: 282, cy: 112, r: 40 }),
    region('eye-patch-l', 'Left eye patch', 'ellipse', { cx: 155, cy: 190, rx: 28, ry: 40 }),
    region('eye-patch-r', 'Right eye patch', 'ellipse', { cx: 245, cy: 190, rx: 28, ry: 40 }),
    region('body', 'Body', 'ellipse', { cx: 200, cy: 332, rx: 78, ry: 56 }),
  ], ['Grey', 'Black', 'Black', 'Black', 'Black', 'Black'], [
    region('eye-l', 'Left eye', 'circle', { cx: 155, cy: 190, r: 8, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 245, cy: 190, r: 8, class: 'detail-dark' }),
    region('nose', 'Nose', 'ellipse', { cx: 200, cy: 238, rx: 13, ry: 9, class: 'detail-dark' }),
  ]),
  template('lion', 'Little Lion', 'animal', ['explorers', 'curious', 'creative'], [
    region('mane', 'Mane', 'circle', { cx: 200, cy: 200, r: 150 }),
    region('face', 'Face', 'circle', { cx: 200, cy: 190, r: 103 }),
    region('muzzle', 'Muzzle', 'ellipse', { cx: 200, cy: 235, rx: 52, ry: 35 }),
    region('ear-l', 'Left ear', 'circle', { cx: 120, cy: 119, r: 25 }),
    region('ear-r', 'Right ear', 'circle', { cx: 280, cy: 119, r: 25 }),
  ], ['Orange', 'Yellow', 'Grey', 'Orange', 'Orange'], [
    region('eye-l', 'Left eye', 'circle', { cx: 162, cy: 185, r: 7, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 238, cy: 185, r: 7, class: 'detail-dark' }),
    region('nose', 'Nose', 'polygon', { points: '188,223 212,223 200,237', class: 'detail-dark' }),
    region('whiskers', 'Whiskers', 'path', { d: 'M 155 235 L 95 222 M 155 246 L 95 255 M 245 235 L 305 222 M 245 246 L 305 255', class: 'detail-line' }),
  ]),
  template('elephant', 'Gentle Elephant', 'animal', ['explorers', 'curious'], [
    region('ear-l', 'Left ear', 'ellipse', { cx: 112, cy: 198, rx: 62, ry: 82 }),
    region('ear-r', 'Right ear', 'ellipse', { cx: 288, cy: 198, rx: 62, ry: 82 }),
    region('head', 'Head', 'circle', { cx: 200, cy: 178, r: 91 }),
    region('trunk', 'Trunk', 'path', { d: 'M 175 220 Q 175 300 210 300 Q 238 300 225 270', fill: 'white' }, [200, 264]),
    region('body', 'Body', 'ellipse', { cx: 200, cy: 333, rx: 90, ry: 45 }),
  ], ['Pink', 'Pink', 'Grey', 'Grey', 'Grey'], [
    region('eye-l', 'Left eye', 'circle', { cx: 170, cy: 176, r: 7, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 230, cy: 176, r: 7, class: 'detail-dark' }),
    region('trunk-lines', 'Trunk lines', 'path', { d: 'M 190 265 Q 200 272 210 265 M 193 278 Q 201 284 209 278', class: 'detail-line' }),
  ]),
  template('giraffe', 'Tall Giraffe', 'animal', ['curious', 'creative'], [
    region('body', 'Body', 'ellipse', { cx: 200, cy: 290, rx: 95, ry: 75 }),
    region('neck', 'Neck', 'rect', { x: 162, y: 112, width: 76, height: 160, rx: 28 }),
    region('head', 'Head', 'ellipse', { cx: 200, cy: 100, rx: 68, ry: 58 }),
    region('horn-l', 'Left horn', 'rect', { x: 156, y: 28, width: 20, height: 45, rx: 8 }),
    region('horn-r', 'Right horn', 'rect', { x: 224, y: 28, width: 20, height: 45, rx: 8 }),
    region('leg-l', 'Left leg', 'rect', { x: 135, y: 340, width: 35, height: 55, rx: 10 }),
    region('leg-r', 'Right leg', 'rect', { x: 230, y: 340, width: 35, height: 55, rx: 10 }),
  ], ['Yellow', 'Yellow', 'Yellow', 'Brown', 'Brown', 'Yellow', 'Yellow'], [
    region('spot-1', 'Spot', 'circle', { cx: 155, cy: 270, r: 15, fill: 'white' }),
    region('spot-2', 'Spot', 'circle', { cx: 218, cy: 285, r: 18, fill: 'white' }),
    region('spot-3', 'Spot', 'circle', { cx: 178, cy: 325, r: 13, fill: 'white' }),
    region('eye-l', 'Left eye', 'circle', { cx: 178, cy: 98, r: 6, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 222, cy: 98, r: 6, class: 'detail-dark' }),
  ]),
  template('duck', 'Happy Duck', 'animal', ['explorers', 'curious'], [
    region('body', 'Body', 'ellipse', { cx: 198, cy: 250, rx: 125, ry: 93 }),
    region('wing', 'Wing', 'ellipse', { cx: 210, cy: 250, rx: 62, ry: 43 }),
    region('head', 'Head', 'circle', { cx: 230, cy: 112, r: 64 }),
    region('beak', 'Beak', 'polygon', { points: '286,108 370,128 286,148' }, [318, 126]),
    region('foot-l', 'Left foot', 'polygon', { points: '135,325 175,325 200,370 110,370' }, [154, 350]),
    region('foot-r', 'Right foot', 'polygon', { points: '220,325 260,325 285,370 195,370' }, [239, 350]),
  ], ['Yellow', 'Orange', 'Yellow', 'Orange', 'Orange', 'Orange'], [
    region('eye', 'Eye', 'circle', { cx: 250, cy: 105, r: 8, class: 'detail-dark' }),
  ]),
  template('songbird', 'Singing Bird', 'animal', ['explorers', 'curious'], [
    region('body', 'Body', 'ellipse', { cx: 195, cy: 220, rx: 105, ry: 78 }),
    region('wing', 'Wing', 'ellipse', { cx: 170, cy: 220, rx: 53, ry: 44 }),
    region('head', 'Head', 'circle', { cx: 250, cy: 128, r: 58 }),
    region('beak', 'Beak', 'polygon', { points: '299,122 360,140 299,155' }, [322, 138]),
    region('tail', 'Tail', 'polygon', { points: '95,222 35,190 45,245 32,280 103,258' }, [66, 236]),
    region('branch', 'Branch', 'rect', { x: 80, y: 306, width: 245, height: 22, rx: 10 }),
  ], ['Sky blue', 'Blue', 'Yellow', 'Orange', 'Blue', 'Brown'], [
    region('eye', 'Eye', 'circle', { cx: 264, cy: 120, r: 7, class: 'detail-dark' }),
    region('feet', 'Feet', 'path', { d: 'M 170 286 L 170 306 M 170 297 L 155 303 M 170 297 L 185 303 M 235 286 L 235 306 M 235 297 L 220 303 M 235 297 L 250 303', class: 'detail-line' }),
  ]),
  template('bee', 'Busy Bee', 'animal', ['explorers', 'curious'], [
    region('wing-l', 'Left wing', 'ellipse', { cx: 145, cy: 120, rx: 47, ry: 62 }),
    region('wing-r', 'Right wing', 'ellipse', { cx: 255, cy: 120, rx: 47, ry: 62 }),
    region('body', 'Body', 'ellipse', { cx: 200, cy: 224, rx: 75, ry: 104 }),
    region('stripe-1', 'Stripe', 'rect', { x: 130, y: 187, width: 140, height: 35 }),
    region('stripe-2', 'Stripe', 'rect', { x: 130, y: 251, width: 140, height: 35 }),
  ], ['Sky blue', 'Sky blue', 'Yellow', 'Black', 'Black'], [
    region('eye-l', 'Left eye', 'circle', { cx: 178, cy: 125, r: 6, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 222, cy: 125, r: 6, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 185 148 Q 200 160 215 148', class: 'detail-line' }),
    region('feelers', 'Feelers', 'path', { d: 'M 180 130 Q 150 70 125 82 M 220 130 Q 250 70 275 82', class: 'detail-line' }),
  ]),
  template('crab', 'Cheery Crab', 'animal', ['explorers', 'curious'], [
    region('body', 'Shell', 'ellipse', { cx: 200, cy: 245, rx: 105, ry: 75 }),
    region('claw-l', 'Left claw', 'circle', { cx: 72, cy: 174, r: 42 }),
    region('claw-r', 'Right claw', 'circle', { cx: 328, cy: 174, r: 42 }),
    region('arm-l', 'Left arm', 'path', { d: 'M 115 205 Q 70 188 85 165', fill: 'white' }, [98, 190]),
    region('arm-r', 'Right arm', 'path', { d: 'M 285 205 Q 330 188 315 165', fill: 'white' }, [302, 190]),
    region('leg-l', 'Left leg', 'polygon', { points: '125,292 160,292 145,350 100,355' }, [133, 320]),
    region('leg-r', 'Right leg', 'polygon', { points: '240,292 275,292 300,355 255,350' }, [267, 320]),
  ], ['Red', 'Red', 'Red', 'Red', 'Red', 'Red', 'Red'], [
    region('eye-l', 'Left eye', 'circle', { cx: 170, cy: 215, r: 8, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 230, cy: 215, r: 8, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 178 252 Q 200 270 222 252', class: 'detail-line' }),
  ]),
  template('whale', 'Friendly Whale', 'animal', ['explorers', 'curious', 'creative'], [
    region('body', 'Body', 'ellipse', { cx: 198, cy: 235, rx: 142, ry: 92 }),
    region('tail', 'Tail', 'polygon', { points: '310,226 375,180 365,240 378,288 310,252' }, [345, 234]),
    region('fin', 'Fin', 'ellipse', { cx: 210, cy: 300, rx: 36, ry: 20, transform: 'rotate(20 210 300)' }),
    region('belly', 'Belly', 'ellipse', { cx: 186, cy: 286, rx: 88, ry: 34 }),
    region('water-1', 'Water drop', 'ellipse', { cx: 183, cy: 70, rx: 12, ry: 28 }),
    region('water-2', 'Water drop', 'ellipse', { cx: 215, cy: 76, rx: 12, ry: 28 }),
  ], ['Sky blue', 'Blue', 'Blue', 'Grey', 'Sky blue', 'Sky blue'], [
    region('eye', 'Eye', 'circle', { cx: 94, cy: 215, r: 8, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 70 252 Q 95 268 118 250', class: 'detail-line' }),
  ]),
  template('dolphin', 'Dancing Dolphin', 'animal', ['curious', 'creative'], [
    region('body', 'Body', 'path', { d: 'M 42 220 Q 110 112 248 145 Q 300 155 338 112 Q 326 172 273 204 Q 320 230 366 211 Q 333 284 257 271 Q 165 316 73 270 Q 44 257 42 220 Z', fill: 'white' }, [185, 210]),
    region('fin', 'Fin', 'polygon', { points: '180,255 238,270 192,322 154,294' }, [192, 286]),
    region('tail-l', 'Left tail fin', 'polygon', { points: '47,218 18,168 83,199' }, [48, 194]),
    region('tail-r', 'Right tail fin', 'polygon', { points: '54,237 15,286 93,266' }, [55, 264]),
    region('water', 'Water splash', 'path', { d: 'M 186 112 Q 200 80 214 112 Q 225 77 236 112', fill: 'white' }, [211, 96]),
  ], ['Sky blue', 'Blue', 'Blue', 'Blue', 'Sky blue'], [
    region('eye', 'Eye', 'circle', { cx: 290, cy: 171, r: 7, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 315 194 Q 331 204 345 198', class: 'detail-line' }),
  ]),
  template('penguin', 'Waddling Penguin', 'animal', ['explorers', 'curious'], [
    region('body', 'Body', 'ellipse', { cx: 200, cy: 220, rx: 104, ry: 145 }),
    region('belly', 'Belly', 'ellipse', { cx: 200, cy: 250, rx: 64, ry: 94 }),
    region('wing-l', 'Left wing', 'ellipse', { cx: 104, cy: 236, rx: 26, ry: 78, transform: 'rotate(15 104 236)' }),
    region('wing-r', 'Right wing', 'ellipse', { cx: 296, cy: 236, rx: 26, ry: 78, transform: 'rotate(-15 296 236)' }),
    region('beak', 'Beak', 'polygon', { points: '180,145 220,145 200,174' }, [200, 154]),
    region('foot-l', 'Left foot', 'ellipse', { cx: 153, cy: 365, rx: 40, ry: 18 }),
    region('foot-r', 'Right foot', 'ellipse', { cx: 247, cy: 365, rx: 40, ry: 18 }),
  ], ['Black', 'Grey', 'Black', 'Black', 'Orange', 'Orange', 'Orange'], [
    region('eye-l', 'Left eye', 'circle', { cx: 178, cy: 125, r: 7, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 222, cy: 125, r: 7, class: 'detail-dark' }),
  ]),
  template('fox', 'Clever Fox', 'animal', ['curious', 'creative'], [
    region('body', 'Body', 'ellipse', { cx: 190, cy: 275, rx: 96, ry: 76 }),
    region('tail', 'Tail', 'ellipse', { cx: 290, cy: 292, rx: 74, ry: 38, transform: 'rotate(-25 290 292)' }),
    region('tail-tip', 'Tail tip', 'ellipse', { cx: 343, cy: 266, rx: 28, ry: 20, transform: 'rotate(-25 343 266)' }),
    region('head', 'Head', 'circle', { cx: 177, cy: 148, r: 78 }),
    region('ear-l', 'Left ear', 'polygon', { points: '111,112 102,30 157,83' }, [125, 76]),
    region('ear-r', 'Right ear', 'polygon', { points: '197,83 252,30 243,112' }, [229, 76]),
    region('muzzle', 'Muzzle', 'ellipse', { cx: 177, cy: 179, rx: 40, ry: 25 }),
  ], ['Orange', 'Orange', 'Grey', 'Orange', 'Orange', 'Orange', 'Grey'], [
    region('eye-l', 'Left eye', 'circle', { cx: 150, cy: 144, r: 6, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 204, cy: 144, r: 6, class: 'detail-dark' }),
    region('nose', 'Nose', 'circle', { cx: 177, cy: 174, r: 7, class: 'detail-dark' }),
  ]),
  template('rabbit', 'Bouncy Bunny', 'animal', ['explorers', 'curious'], [
    region('head', 'Head', 'circle', { cx: 200, cy: 195, r: 93 }),
    region('ear-l', 'Left ear', 'ellipse', { cx: 156, cy: 84, rx: 30, ry: 75, transform: 'rotate(-12 156 84)' }),
    region('ear-r', 'Right ear', 'ellipse', { cx: 244, cy: 84, rx: 30, ry: 75, transform: 'rotate(12 244 84)' }),
    region('body', 'Body', 'ellipse', { cx: 200, cy: 322, rx: 69, ry: 67 }),
    region('foot-l', 'Left foot', 'ellipse', { cx: 143, cy: 371, rx: 44, ry: 20 }),
    region('foot-r', 'Right foot', 'ellipse', { cx: 257, cy: 371, rx: 44, ry: 20 }),
    region('tail', 'Tail', 'circle', { cx: 277, cy: 315, r: 25 }),
  ], ['Grey', 'Pink', 'Pink', 'Grey', 'Grey', 'Grey', 'Grey'], [
    region('eye-l', 'Left eye', 'circle', { cx: 168, cy: 185, r: 7, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 232, cy: 185, r: 7, class: 'detail-dark' }),
    region('nose', 'Nose', 'circle', { cx: 200, cy: 218, r: 7, class: 'detail-dark' }),
    region('whiskers', 'Whiskers', 'path', { d: 'M 174 222 L 118 210 M 174 232 L 118 238 M 226 222 L 282 210 M 226 232 L 282 238', class: 'detail-line' }),
  ]),
  template('dinosaur', 'Dino Friend', 'animal', ['curious', 'creative'], [
    region('body', 'Body', 'ellipse', { cx: 190, cy: 260, rx: 112, ry: 80 }),
    region('neck', 'Neck', 'rect', { x: 206, y: 118, width: 72, height: 112, rx: 30 }),
    region('head', 'Head', 'ellipse', { cx: 252, cy: 111, rx: 73, ry: 52 }),
    region('tail', 'Tail', 'polygon', { points: '92,250 25,210 47,277 93,291' }, [60, 252]),
    region('leg-l', 'Left leg', 'rect', { x: 113, y: 302, width: 42, height: 75, rx: 14 }),
    region('leg-r', 'Right leg', 'rect', { x: 215, y: 302, width: 42, height: 75, rx: 14 }),
    region('plate-1', 'Back plate', 'polygon', { points: '102,205 127,161 150,205' }, [127, 192]),
    region('plate-2', 'Back plate', 'polygon', { points: '150,184 175,135 200,184' }, [175, 169]),
    region('plate-3', 'Back plate', 'polygon', { points: '198,182 223,137 246,183' }, [222, 169]),
  ], ['Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Orange', 'Orange', 'Orange'], [
    region('eye', 'Eye', 'circle', { cx: 272, cy: 96, r: 7, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 285 131 Q 307 140 326 128', class: 'detail-line' }),
  ]),
  template('pear', 'Juicy Pear', 'nature', ['explorers', 'curious'], [
    region('leaf', 'Leaf', 'ellipse', { cx: 251, cy: 84, rx: 48, ry: 20, transform: 'rotate(-25 251 84)' }),
    region('stem', 'Stem', 'rect', { x: 188, y: 52, width: 24, height: 60, rx: 8 }),
    region('fruit', 'Pear', 'path', { d: 'M 176 115 Q 180 159 137 209 Q 94 269 145 327 Q 200 383 255 327 Q 306 269 263 209 Q 220 159 224 115 Z', fill: 'white' }, [198, 257]),
  ], ['Green', 'Brown', 'Green']),
  template('banana', 'Smiling Banana', 'nature', ['explorers', 'curious'], [
    region('banana', 'Banana', 'path', { d: 'M 63 89 Q 112 259 310 294 Q 335 297 354 277 Q 313 350 232 340 Q 84 318 39 131 Q 35 108 63 89 Z', fill: 'white' }, [184, 284]),
    region('stem', 'Stem', 'path', { d: 'M 52 79 L 83 66 L 97 91 L 63 104 Z', fill: 'white' }, [72, 84]),
    region('tip', 'Tip', 'path', { d: 'M 310 294 Q 342 296 354 277 L 369 289 Q 357 317 332 323 Z', fill: 'white' }, [341, 299]),
  ], ['Yellow', 'Green', 'Brown'], [
    region('shine', 'Shine', 'path', { d: 'M 88 126 Q 139 262 261 291', class: 'detail-line' }),
  ]),
  template('grapes', 'Purple Grapes', 'nature', ['explorers', 'curious'], [
    region('grape-1', 'Grape', 'circle', { cx: 145, cy: 175, r: 43 }),
    region('grape-2', 'Grape', 'circle', { cx: 235, cy: 175, r: 43 }),
    region('grape-3', 'Grape', 'circle', { cx: 105, cy: 245, r: 43 }),
    region('grape-4', 'Grape', 'circle', { cx: 195, cy: 245, r: 43 }),
    region('grape-5', 'Grape', 'circle', { cx: 285, cy: 245, r: 43 }),
    region('grape-6', 'Grape', 'circle', { cx: 150, cy: 315, r: 43 }),
    region('grape-7', 'Grape', 'circle', { cx: 240, cy: 315, r: 43 }),
    region('stem', 'Stem', 'rect', { x: 184, y: 48, width: 32, height: 70, rx: 10 }),
    region('leaf', 'Leaf', 'ellipse', { cx: 260, cy: 88, rx: 56, ry: 24, transform: 'rotate(-20 260 88)' }),
  ], ['Purple', 'Purple', 'Purple', 'Purple', 'Purple', 'Purple', 'Purple', 'Brown', 'Green']),
  template('orange', 'Sunny Orange', 'nature', ['explorers', 'curious'], [
    region('fruit', 'Orange', 'circle', { cx: 200, cy: 225, r: 132 }),
    region('leaf', 'Leaf', 'ellipse', { cx: 254, cy: 79, rx: 48, ry: 20, transform: 'rotate(-20 254 79)' }),
    region('stem', 'Stem', 'rect', { x: 186, y: 72, width: 27, height: 51, rx: 8 }),
  ], ['Orange', 'Green', 'Brown'], [
    region('segment-1', 'Orange segment', 'path', { d: 'M 200 108 L 200 342 M 83 225 L 317 225 M 117 142 L 283 308 M 283 142 L 117 308', class: 'detail-line' }),
  ]),
  template('lemon', 'Lemon', 'nature', ['explorers', 'curious'], [
    region('fruit', 'Lemon', 'path', { d: 'M 48 200 Q 83 145 122 171 Q 201 105 278 171 Q 317 145 352 200 Q 317 255 278 229 Q 201 295 122 229 Q 83 255 48 200 Z', fill: 'white' }, [200, 200]),
    region('leaf', 'Leaf', 'ellipse', { cx: 212, cy: 116, rx: 48, ry: 18, transform: 'rotate(-18 212 116)' }),
  ], ['Yellow', 'Green'], [
    region('shine', 'Shine', 'path', { d: 'M 96 198 Q 146 159 204 160', class: 'detail-line' }),
  ]),
  template('mushroom', 'Toadstool Mushroom', 'nature', ['explorers', 'curious'], [
    region('stem', 'Stem', 'path', { d: 'M 150 195 L 250 195 L 268 348 Q 200 376 132 348 Z', fill: 'white' }, [200, 278]),
    region('cap', 'Mushroom cap', 'path', { d: 'M 48 205 Q 55 74 200 62 Q 345 74 352 205 Z', fill: 'white' }, [200, 139]),
    region('spot-l', 'Spot', 'circle', { cx: 125, cy: 145, r: 22 }),
    region('spot-m', 'Spot', 'circle', { cx: 200, cy: 112, r: 25 }),
    region('spot-r', 'Spot', 'circle', { cx: 276, cy: 145, r: 22 }),
  ], ['Grey', 'Red', 'Grey', 'Grey', 'Grey']),
  template('cactus', 'Desert Cactus', 'nature', ['curious', 'creative'], [
    region('trunk', 'Cactus trunk', 'rect', { x: 157, y: 110, width: 86, height: 230, rx: 38 }),
    region('arm-l', 'Left arm', 'path', { d: 'M 157 230 L 112 230 L 112 175 L 80 175 L 80 260 Q 80 289 112 289 L 157 289 Z', fill: 'white' }, [112, 253]),
    region('arm-r', 'Right arm', 'path', { d: 'M 243 194 L 286 194 L 286 147 L 320 147 L 320 225 Q 320 253 286 253 L 243 253 Z', fill: 'white' }, [286, 220]),
    region('pot', 'Flower pot', 'polygon', { points: '120,330 280,330 260,390 140,390' }, [200, 359]),
    region('flower', 'Flower', 'circle', { cx: 200, cy: 82, r: 28 }),
  ], ['Green', 'Green', 'Green', 'Red', 'Pink'], [
    region('spines', 'Cactus spines', 'path', { d: 'M 180 150 L 169 140 M 220 180 L 231 170 M 180 220 L 169 210 M 220 260 L 231 250 M 180 300 L 169 290', class: 'detail-line' }),
  ]),
  template('cloud', 'Rainy Day Cloud', 'nature', ['explorers', 'curious'], [
    region('cloud', 'Cloud', 'path', { d: 'M 74 244 Q 54 199 92 174 Q 107 164 126 170 Q 144 98 220 106 Q 278 108 291 165 Q 351 164 356 214 Q 360 253 318 260 L 100 260 Q 76 257 74 244 Z', fill: 'white' }, [208, 211]),
    region('drop-1', 'Raindrop', 'path', { d: 'M 122 286 Q 122 270 140 253 Q 158 270 158 286 A 18 18 0 0 1 122 286 Z', fill: 'white' }, [140, 280]),
    region('drop-2', 'Raindrop', 'path', { d: 'M 191 310 Q 191 294 209 277 Q 227 294 227 310 A 18 18 0 0 1 191 310 Z', fill: 'white' }, [209, 304]),
    region('drop-3', 'Raindrop', 'path', { d: 'M 260 286 Q 260 270 278 253 Q 296 270 296 286 A 18 18 0 0 1 260 286 Z', fill: 'white' }, [278, 280]),
  ], ['Grey', 'Sky blue', 'Sky blue', 'Sky blue']),
  template('sun', 'Smiling Sunshine', 'nature', ['explorers', 'curious'], [
    region('ray-n', 'Top ray', 'polygon', { points: '180,38 220,38 200,105' }, [200, 61]),
    region('ray-ne', 'Top right ray', 'polygon', { points: '295,74 326,102 265,132' }, [297, 101]),
    region('ray-e', 'Right ray', 'polygon', { points: '362,180 362,220 295,200' }, [339, 200]),
    region('ray-se', 'Bottom right ray', 'polygon', { points: '326,298 295,326 265,265' }, [297, 299]),
    region('ray-s', 'Bottom ray', 'polygon', { points: '220,362 180,362 200,295' }, [200, 339]),
    region('ray-sw', 'Bottom left ray', 'polygon', { points: '74,298 105,265 135,326' }, [103, 299]),
    region('ray-w', 'Left ray', 'polygon', { points: '38,220 38,180 105,200' }, [61, 200]),
    region('ray-nw', 'Top left ray', 'polygon', { points: '74,102 105,74 135,135' }, [103, 101]),
    region('sun', 'Sun', 'circle', { cx: 200, cy: 200, r: 102 }),
  ], ['Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Orange'], [
    region('eye-l', 'Left eye', 'circle', { cx: 168, cy: 190, r: 7, class: 'detail-dark' }),
    region('eye-r', 'Right eye', 'circle', { cx: 232, cy: 190, r: 7, class: 'detail-dark' }),
    region('smile', 'Smile', 'path', { d: 'M 165 225 Q 200 258 235 225', class: 'detail-line' }),
  ]),
  template('mountains', 'Mountain Morning', 'nature', ['curious', 'creative'], [
    region('sun', 'Sun', 'circle', { cx: 304, cy: 86, r: 48 }),
    region('mountain-l', 'Left mountain', 'polygon', { points: '20,330 158,105 295,330' }, [157, 265]),
    region('snow-l', 'Left snowcap', 'polygon', { points: '116,174 158,105 200,174 170,162 150,181 137,161' }, [158, 153]),
    region('mountain-r', 'Right mountain', 'polygon', { points: '144,330 280,133 390,330' }, [280, 268]),
    region('snow-r', 'Right snowcap', 'polygon', { points: '243,187 280,133 320,187 295,176 280,193 265,176' }, [280, 162]),
    region('ground', 'Ground', 'rect', { x: 0, y: 330, width: 400, height: 70 }),
  ], ['Yellow', 'Blue', 'Grey', 'Sky blue', 'Grey', 'Green']),
  template('rain-boot', 'Garden Rain Boot', 'shape', ['explorers', 'curious'], [
    region('boot', 'Boot', 'path', { d: 'M 112 65 L 272 65 L 272 225 Q 278 271 333 300 Q 357 313 351 348 Q 347 370 320 370 L 90 370 Q 55 370 55 340 Q 55 315 78 300 Q 100 285 103 250 Z', fill: 'white' }, [200, 268]),
    region('cuff', 'Boot cuff', 'rect', { x: 102, y: 65, width: 181, height: 48, rx: 10 }),
    region('sole', 'Sole', 'rect', { x: 74, y: 336, width: 274, height: 33, rx: 14 }),
    region('flower', 'Flower', 'circle', { cx: 188, cy: 205, r: 28 }),
  ], ['Yellow', 'Red', 'Black', 'Pink'], [
    region('flower-lines', 'Flower petals', 'path', { d: 'M 188 164 L 188 246 M 147 205 L 229 205 M 159 176 L 217 234 M 217 176 L 159 234', class: 'detail-line' }),
  ]),
  template('sailboat', 'Little Sailboat', 'shape', ['explorers', 'curious'], [
    region('sail-l', 'Left sail', 'polygon', { points: '188,70 188,238 80,238' }, [154, 182]),
    region('sail-r', 'Right sail', 'polygon', { points: '207,89 207,238 308,238' }, [241, 186]),
    region('mast', 'Mast', 'rect', { x: 190, y: 56, width: 14, height: 212 }),
    region('boat', 'Boat', 'polygon', { points: '55,270 345,270 290,340 110,340' }, [200, 299]),
    region('water', 'Water', 'path', { d: 'M 34 355 Q 80 335 126 355 Q 172 375 218 355 Q 264 335 310 355 Q 345 370 370 355 L 370 390 L 34 390 Z', fill: 'white' }, [200, 370]),
  ], ['Red', 'Sky blue', 'Brown', 'Brown', 'Sky blue']),
  template('diamond-kite', 'Diamond Kite', 'shape', ['explorers', 'curious'], [
    region('kite-top', 'Top kite panel', 'polygon', { points: '200,44 288,150 200,196' }, [231, 125]),
    region('kite-right', 'Right kite panel', 'polygon', { points: '288,150 200,256 200,196' }, [229, 200]),
    region('kite-bottom', 'Bottom kite panel', 'polygon', { points: '200,256 112,150 200,196' }, [169, 200]),
    region('kite-left', 'Left kite panel', 'polygon', { points: '112,150 200,44 200,196' }, [171, 125]),
    region('tail', 'Kite tail', 'path', { d: 'M 200 256 Q 174 297 224 324 Q 269 348 220 380', fill: 'none' }, [220, 324]),
    region('bow', 'Tail bow', 'polygon', { points: '198,295 220,281 216,310 241,323 216,336 220,365 198,349' }, [218, 325]),
  ], ['Red', 'Yellow', 'Sky blue', 'Green', 'Purple', 'Orange']),
  template('flowerpot', 'Potted Flower', 'nature', ['explorers', 'curious'], [
    region('petal-top', 'Top petal', 'ellipse', { cx: 200, cy: 86, rx: 26, ry: 42 }),
    region('petal-right', 'Right petal', 'ellipse', { cx: 249, cy: 135, rx: 42, ry: 26 }),
    region('petal-bottom', 'Bottom petal', 'ellipse', { cx: 200, cy: 184, rx: 26, ry: 42 }),
    region('petal-left', 'Left petal', 'ellipse', { cx: 151, cy: 135, rx: 42, ry: 26 }),
    region('center', 'Flower center', 'circle', { cx: 200, cy: 135, r: 30 }),
    region('stem', 'Stem', 'rect', { x: 190, y: 178, width: 20, height: 112 }),
    region('leaf-l', 'Left leaf', 'ellipse', { cx: 160, cy: 245, rx: 43, ry: 18, transform: 'rotate(25 160 245)' }),
    region('leaf-r', 'Right leaf', 'ellipse', { cx: 240, cy: 270, rx: 43, ry: 18, transform: 'rotate(-25 240 270)' }),
    region('pot', 'Flower pot', 'polygon', { points: '112,290 288,290 265,380 135,380' }, [200, 332]),
  ], ['Pink', 'Pink', 'Pink', 'Pink', 'Yellow', 'Green', 'Green', 'Green', 'Red']),
  template('tulip', 'Spring Tulip', 'nature', ['explorers', 'curious'], [
    region('petal-l', 'Left petal', 'path', { d: 'M 200 186 Q 118 157 128 65 Q 172 74 200 123 Z', fill: 'white' }, [160, 126]),
    region('petal-m', 'Middle petal', 'path', { d: 'M 200 130 Q 187 49 200 35 Q 216 55 200 130 Z', fill: 'white' }, [200, 77]),
    region('petal-r', 'Right petal', 'path', { d: 'M 200 186 Q 282 157 272 65 Q 228 74 200 123 Z', fill: 'white' }, [240, 126]),
    region('stem', 'Stem', 'rect', { x: 188, y: 180, width: 24, height: 175 }),
    region('leaf-l', 'Left leaf', 'ellipse', { cx: 149, cy: 285, rx: 55, ry: 22, transform: 'rotate(-27 149 285)' }),
    region('leaf-r', 'Right leaf', 'ellipse', { cx: 250, cy: 315, rx: 55, ry: 22, transform: 'rotate(24 250 315)' }),
    region('ground', 'Ground', 'rect', { x: 40, y: 355, width: 320, height: 26, rx: 10 }),
  ], ['Red', 'Yellow', 'Red', 'Green', 'Green', 'Green', 'Green']),
] satisfies Template[]

export const ADDITIONAL_PAGES = templates.map((entry) => entry.page)
export const ADDITIONAL_TARGETS = Object.fromEntries(
  templates.map(({ page, targets }) => [page.id, targets]),
)

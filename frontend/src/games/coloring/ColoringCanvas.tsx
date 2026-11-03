import { createElement } from 'react'
import type { KeyboardEvent } from 'react'
import { labelPosition } from './geometry.ts'
import type { ColoringPage, Fills, Region } from './types.ts'

interface Props {
  page: ColoringPage
  fills: Fills
  /** Omit for a non-interactive preview. */
  onPaint?: (regionId: string) => void
  /** Region id → number to show on it while it is still unpainted. */
  labels?: Record<string, string>
}

function Shape({ region, ...extra }: { region: Region } & Record<string, unknown>) {
  const { class: className, ...attrs } = region.attrs
  return createElement(region.tag, {
    ...attrs,
    ...(className !== undefined ? { className: `${className}` } : {}),
    ...extra,
  })
}

export default function ColoringCanvas({ page, fills, onPaint, labels }: Props) {
  const handleKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPaint?.(id)
    }
  }

  return (
    <svg
      className="coloring-canvas"
      viewBox={page.viewBox}
      role={onPaint ? 'group' : 'img'}
      aria-label={`${page.title} coloring page`}
    >
      <rect x="0" y="0" width="400" height="400" fill="#ffffff" rx="16" />
      {page.regions.map((region) =>
        onPaint ? (
          <Shape
            key={region.id}
            region={region}
            className="region"
            fill={fills[region.id] ?? '#ffffff'}
            role="button"
            tabIndex={0}
            aria-label={region.label}
            onClick={() => onPaint(region.id)}
            onKeyDown={(e: KeyboardEvent) => handleKey(e, region.id)}
          />
        ) : (
          <Shape
            key={region.id}
            region={region}
            className="region-static"
            fill={fills[region.id] ?? '#ffffff'}
          />
        ),
      )}
      {labels &&
        page.regions.map((region) => {
          if (fills[region.id] !== undefined || labels[region.id] === undefined) return null
          const [x, y] = labelPosition(region)
          return (
            <text key={region.id} x={x} y={y} className="region-number" pointerEvents="none">
              {labels[region.id]}
            </text>
          )
        })}
      {page.details?.map((d) => (
        <Shape key={d.id} region={d} pointerEvents="none" />
      ))}
    </svg>
  )
}

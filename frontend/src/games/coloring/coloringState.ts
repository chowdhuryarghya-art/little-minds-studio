import type { Fills } from './types.ts'

export const ERASER = 'eraser' as const

export interface ColoringState {
  fills: Fills
  /** Previous `fills` snapshots, most recent last. */
  history: Fills[]
}

export type ColoringAction =
  | { type: 'paint'; regionId: string; color: string }
  | { type: 'undo' }
  | { type: 'reset' }

export const initialColoringState: ColoringState = { fills: {}, history: [] }

export function coloringReducer(
  state: ColoringState,
  action: ColoringAction,
): ColoringState {
  switch (action.type) {
    case 'paint': {
      const current = state.fills[action.regionId]
      if (action.color === ERASER) {
        if (current === undefined) return state
        const next = { ...state.fills }
        delete next[action.regionId]
        return { fills: next, history: [...state.history, state.fills] }
      }
      if (current === action.color) return state
      return {
        fills: { ...state.fills, [action.regionId]: action.color },
        history: [...state.history, state.fills],
      }
    }
    case 'undo': {
      if (state.history.length === 0) return state
      return {
        fills: state.history[state.history.length - 1],
        history: state.history.slice(0, -1),
      }
    }
    case 'reset':
      return Object.keys(state.fills).length === 0
        ? state
        : { fills: {}, history: [...state.history, state.fills] }
  }
}

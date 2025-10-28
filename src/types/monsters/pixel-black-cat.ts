export type PixelBlackCatState = 'idle' | 'happy' | 'sleep'

export type PixelInstruction = readonly [number, number, string]
export type PixelSequence = readonly PixelInstruction[]

export interface PixelBlackCatProps {
  state?: PixelBlackCatState
  showControls?: boolean
  layout?: 'standalone' | 'compact'
}

import React, { useEffect, useState } from 'react'
import type {
  PixelBlackCatProps,
  PixelBlackCatState,
  PixelInstruction,
  PixelSequence
} from '@/types/monsters/pixel-black-cat'

const black = '#1a1a1a'
const darkGray = '#2d2d2d'
const gray = '#404040'
const violet = '#a855f7'
const darkViolet = '#7c3aed'
const white = '#ffffff'
const pink = '#ec4899'

const canvasWidth = 400
const canvasHeight = 450
const pixelSize = 8

const frameCount = 16
const tailRadius = 8
const tailCenterX = 20
const tailCenterY = 18

const catPattern: PixelSequence = [
  [16, 6, black],
  [15, 7, black], [16, 7, darkGray],
  [15, 8, black], [16, 8, darkGray], [17, 8, black],
  [15, 9, black], [16, 9, pink],

  [24, 6, black],
  [23, 7, darkGray], [24, 7, black],
  [23, 8, black], [24, 8, darkGray], [25, 8, black],
  [23, 9, pink], [24, 9, black], [25, 9, black],

  [17, 9, black], [18, 9, black], [19, 9, black], [20, 9, black], [21, 9, black], [22, 9, black],
  [16, 10, black], [17, 10, black], [18, 10, darkGray], [19, 10, black], [20, 10, black], [21, 10, darkGray], [22, 10, black], [23, 10, black],
  [16, 11, black], [17, 11, black], [18, 11, black], [19, 11, black], [20, 11, black], [21, 11, black], [22, 11, black], [23, 11, black],
  [16, 12, black], [17, 12, violet], [18, 12, violet], [19, 12, black], [20, 12, black], [21, 12, violet], [22, 12, violet], [23, 12, black],
  [16, 13, black], [17, 13, violet], [18, 13, darkViolet], [19, 13, black], [20, 13, black], [21, 13, violet], [22, 13, darkViolet], [23, 13, black],
  [16, 14, black], [17, 14, darkGray], [18, 14, black], [19, 14, black], [20, 14, black], [21, 14, black], [22, 14, darkGray], [23, 14, black],
  [17, 15, black], [18, 15, gray], [19, 15, gray], [20, 15, gray], [21, 15, gray], [22, 15, black],
  [18, 16, black], [19, 16, pink], [20, 16, pink], [21, 16, black],
  [19, 17, black], [20, 17, black],
  [18, 18, black], [19, 18, gray], [20, 18, gray], [21, 18, black],
  [17, 19, black], [18, 19, black], [19, 19, darkGray], [20, 19, darkGray], [21, 19, black], [22, 19, black],
  [16, 20, black], [17, 20, black], [18, 20, darkGray], [19, 20, black], [20, 20, black], [21, 20, darkGray], [22, 20, black], [23, 20, black],
  [15, 21, black], [16, 21, black], [17, 21, darkGray], [18, 21, black], [19, 21, black], [20, 21, black], [21, 21, black], [22, 21, darkGray], [23, 21, black], [24, 21, black],
  [14, 22, black], [15, 22, black], [16, 22, darkGray], [17, 22, black], [18, 22, black], [19, 22, black], [20, 22, black], [21, 22, black], [22, 22, black], [23, 22, darkGray], [24, 22, black], [25, 22, black],
  [13, 23, black], [14, 23, black], [15, 23, darkGray], [16, 23, black], [17, 23, black], [18, 23, black], [19, 23, black], [20, 23, black], [21, 23, black], [22, 23, black], [23, 23, black], [24, 23, darkGray], [25, 23, black], [26, 23, black],
  [13, 24, black], [14, 24, darkGray], [15, 24, black], [16, 24, black], [17, 24, black], [18, 24, black], [19, 24, black], [20, 24, black], [21, 24, black], [22, 24, black], [23, 24, black], [24, 24, black], [25, 24, darkGray], [26, 24, black],
  [12, 25, black], [13, 25, black], [14, 25, black], [15, 25, black], [16, 25, black], [17, 25, black], [18, 25, black], [19, 25, black], [20, 25, black], [21, 25, black], [22, 25, black], [23, 25, black], [24, 25, black], [25, 25, black], [26, 25, black], [27, 25, black],
  [12, 26, black], [13, 26, black], [14, 26, black], [15, 26, black], [16, 26, black], [17, 26, black], [18, 26, black], [19, 26, black], [20, 26, black], [21, 26, black], [22, 26, black], [23, 26, black], [24, 26, black], [25, 26, black], [26, 26, black], [27, 26, black],
  [14, 27, black], [15, 27, black], [16, 27, darkGray], [17, 27, black],
  [14, 28, black], [15, 28, darkGray], [16, 28, black], [17, 28, black],
  [14, 29, black], [15, 29, black], [16, 29, black], [17, 29, black],
  [14, 30, black], [15, 30, darkGray], [16, 30, darkGray], [17, 30, black],
  [14, 31, black], [15, 31, black], [16, 31, black], [17, 31, black],
  [14, 32, black], [15, 32, gray], [16, 32, gray], [17, 32, black],
  [22, 27, black], [23, 27, darkGray], [24, 27, black], [25, 27, black],
  [22, 28, black], [23, 28, black], [24, 28, darkGray], [25, 28, black],
  [22, 29, black], [23, 29, black], [24, 29, black], [25, 29, black],
  [22, 30, black], [23, 30, darkGray], [24, 30, darkGray], [25, 30, black],
  [22, 31, black], [23, 31, black], [24, 31, black], [25, 31, black],
  [22, 32, black], [23, 32, gray],
  [13, 27, black], [18, 27, black], [19, 27, black], [20, 27, black], [21, 27, black], [26, 27, black],
  [12, 28, black], [13, 28, black], [18, 28, black], [19, 28, darkGray], [20, 28, darkGray], [21, 28, black], [26, 28, black], [27, 28, black],
  [12, 29, black], [13, 29, darkGray], [18, 29, black], [19, 29, black], [20, 29, black], [21, 29, black], [26, 29, darkGray], [27, 29, black],
  [12, 30, black], [13, 30, black], [18, 30, black], [19, 30, black], [20, 30, black], [21, 30, black], [26, 30, black], [27, 30, black],
  [11, 31, black], [12, 31, black], [13, 31, darkGray], [14, 31, black], [15, 31, black],
  [11, 32, black], [12, 32, darkGray], [13, 32, black], [14, 32, black], [15, 32, black],
  [11, 33, black], [12, 33, black], [13, 33, darkGray], [14, 33, darkGray], [15, 33, black],
  [11, 34, black], [12, 34, gray], [13, 34, gray], [14, 34, gray], [15, 34, black],
  [16, 31, black], [17, 31, black], [18, 31, black], [19, 31, black], [20, 31, black], [21, 31, black], [22, 31, black], [23, 31, black],
  [16, 32, black], [17, 32, darkGray], [18, 32, black], [19, 32, black], [20, 32, black], [21, 32, black], [22, 32, darkGray], [23, 32, black],
  [16, 33, black], [17, 33, black], [18, 33, black], [19, 33, darkGray], [20, 33, darkGray], [21, 33, black], [22, 33, black], [23, 33, black],
  [24, 31, black], [25, 31, black], [26, 31, darkGray], [27, 31, black], [28, 31, black],
  [24, 32, black], [25, 32, black], [26, 32, black], [27, 32, darkGray], [28, 32, black],
  [24, 33, black], [25, 33, darkGray], [26, 33, darkGray], [27, 33, black], [28, 33, black],
  [24, 34, black], [25, 34, gray], [26, 34, gray], [27, 34, gray], [28, 34, black]
] as const

const whiskersPixels: PixelSequence = [
  [12, 14, gray], [13, 14, gray], [14, 14, gray], [15, 14, gray],
  [12, 15, gray], [13, 15, gray], [14, 15, gray],
  [24, 14, gray], [25, 14, gray], [26, 14, gray], [27, 14, gray],
  [25, 15, gray], [26, 15, gray], [27, 15, gray]
] as const

const magicPixels: PixelSequence = [
  [8, 12, violet], [9, 12, violet], [31, 12, violet], [32, 12, violet],
  [7, 16, violet], [33, 16, violet],
  [9, 20, darkViolet], [30, 20, darkViolet],
  [10, 25, violet], [29, 25, violet]
] as const

const zzzPixels: PixelSequence = [
  [6, 8, violet], [7, 8, violet], [8, 8, violet],
  [8, 9, violet], [7, 10, violet], [6, 11, violet], [7, 11, violet], [8, 11, violet],
  [4, 13, darkViolet], [5, 13, darkViolet],
  [5, 14, darkViolet], [4, 15, darkViolet], [5, 15, darkViolet]
] as const

const shadowPixels: PixelSequence = [
  [11, 35, black], [12, 35, black], [13, 35, black], [14, 35, black], [15, 35, black],
  [24, 35, black], [25, 35, black], [26, 35, black], [27, 35, black], [28, 35, black]
] as const

const eyeShinePixels: PixelSequence = [
  [17, 12, white], [21, 12, white]
] as const

const closedEyePixels: PixelSequence = [
  [17, 12, black], [18, 12, black], [21, 12, black], [22, 12, black],
  [17, 13, black], [18, 13, black], [21, 13, black], [22, 13, black]
] as const

interface PixelProps {
  x: number
  y: number
  color: string
}

function Pixel ({ x, y, color }: PixelProps): React.ReactNode {
  return (
    <rect x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill={color} />
  )
}

function buildTail (angle: number): PixelInstruction[] {
  const segments: PixelInstruction[] = []
  for (let i = 0; i < 8; i++) {
    const segmentAngle = angle + (i * Math.PI / 16)
    const x = Math.round(tailCenterX + Math.cos(segmentAngle) * (tailRadius + i))
    const y = Math.round(tailCenterY + Math.sin(segmentAngle) * (tailRadius + i))

    if (i === 0) {
      segments.push([x, y, black], [x + 1, y, black])
    } else if (i === 1) {
      segments.push([x, y, black], [x, y - 1, darkGray])
    } else if (i % 2 === 0) {
      segments.push([x, y, black], [x + 1, y, darkGray])
    } else {
      segments.push([x, y, black], [x, y + 1, darkGray])
    }
  }
  return segments
}

function PixelBlackCat ({ state, showControls, layout }: PixelBlackCatProps): React.ReactNode {
  const [internalState, setInternalState] = useState<PixelBlackCatState>('idle')
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((current) => (current + 1) % frameCount)
    }, 300)
    return () => { clearInterval(id) }
  }, [])

  const resolvedState = state ?? internalState
  const resolvedLayout = layout ?? (state === undefined ? 'standalone' : 'compact')
  const canChangeState = state === undefined
  const shouldShowControls = showControls ?? canChangeState

  const eyeOpen = frame < 7 || (frame > 8 && frame < 15)
  const tail = buildTail((frame / frameCount) * Math.PI * 2)
  const eyeShine = eyeOpen && resolvedState !== 'sleep' ? eyeShinePixels : []
  const closedEyes = (!eyeOpen || resolvedState === 'sleep') ? closedEyePixels : []
  const magic = resolvedState === 'happy' ? magicPixels : []
  const zzz = resolvedState === 'sleep' ? zzzPixels : []

  const svgElement = (
    <svg width={canvasWidth} height={canvasHeight} style={{ imageRendering: 'pixelated' }}>
      <rect width={canvasWidth} height={canvasHeight} fill='#0f0a1e' />

      {shadowPixels.map((pixel) => (
        <Pixel key={`shadow-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {frame < frameCount / 2 && tail.map((pixel, index) => (
        <Pixel key={`tail-back-${index}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {catPattern.map((pixel) => (
        <Pixel key={`cat-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {frame >= frameCount / 2 && tail.map((pixel, index) => (
        <Pixel key={`tail-front-${index}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {whiskersPixels.map((pixel) => (
        <Pixel key={`whisker-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {closedEyes.map((pixel) => (
        <Pixel key={`eyes-closed-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {eyeShine.map((pixel) => (
        <Pixel key={`eyes-shine-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {magic.map((pixel) => (
        <Pixel key={`magic-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      {zzz.map((pixel) => (
        <Pixel key={`zzz-${pixel[0]}-${pixel[1]}`} x={pixel[0]} y={pixel[1]} color={pixel[2]} />
      ))}

      <text x={16} y={430} fontSize={14} fill={violet} fontFamily='monospace'>
        STATE: {resolvedState.toUpperCase()}
      </text>
    </svg>
  )

  let controls: React.ReactNode = null
  if (shouldShowControls) {
    controls = (
      <div className='mt-4 flex justify-center gap-2'>
        <button
          onClick={() => { if (canChangeState) setInternalState('idle') }}
          className='rounded bg-purple-600 px-4 py-2 font-mono text-sm text-white transition-colors duration-300 hover:bg-purple-700 disabled:opacity-50'
          disabled={!canChangeState}
        >
          IDLE
        </button>
        <button
          onClick={() => { if (canChangeState) setInternalState('happy') }}
          className='rounded bg-violet-600 px-4 py-2 font-mono text-sm text-white transition-colors duration-300 hover:bg-violet-700 disabled:opacity-50'
          disabled={!canChangeState}
        >
          HAPPY ✨
        </button>
        <button
          onClick={() => { if (canChangeState) setInternalState('sleep') }}
          className='rounded bg-indigo-600 px-4 py-2 font-mono text-sm text-white transition-colors duration-300 hover:bg-indigo-700 disabled:opacity-50'
          disabled={!canChangeState}
        >
          SLEEP 💤
        </button>
      </div>
    )
  }

  if (resolvedLayout === 'compact') {
    return (
      <div className='flex flex-col items-center gap-3 rounded-xl border border-purple-500/40 bg-gray-900/90 p-4 shadow-lg'>
        <div className='font-mono text-xs uppercase tracking-[0.2em] text-purple-300'>
          {resolvedState}
        </div>
        <div className='overflow-hidden rounded-lg border border-purple-500/30 bg-gray-950/80 p-2'>
          {svgElement}
        </div>
        {controls}
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-950 p-8'>
      <div className='rounded-lg border-2 border-purple-500 bg-gray-900 p-6 shadow-2xl'>
        {svgElement}
        {controls}
      </div>
    </div>
  )
}

export type { PixelBlackCatState }
export default PixelBlackCat

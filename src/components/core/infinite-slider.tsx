'use client'
import { cn } from '@/lib/utils'
import { useMotionValue, animate, motion, AnimationPlaybackControls } from 'motion/react'
import { useEffect, useRef } from 'react'
import useMeasure from 'react-use-measure'

export type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  /** Duration in seconds for the content to travel its own width */
  duration?: number
  /** Optional: Different duration on hover */
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure()
  const translation = useMotionValue(0)
  // Ref to hold the animation controls
  const controlsRef = useRef<AnimationPlaybackControls | null>(null)

  // Calculate speed multipliers based on duration
  // Speed = 1 means it takes 'duration' seconds to complete one cycle
  const baseSpeedMultiplier = 1.0
  const hoverSpeedMultiplier = durationOnHover ? duration / durationOnHover : baseSpeedMultiplier

  useEffect(() => {
    // Don't start animation until measured
    if (!width || !height) return

    const containerSize = direction === 'horizontal' ? width : height
    // The distance to travel for one seamless loop cycle is the size of the container plus the gap
    const distance = containerSize + gap

    // Define the start and end points for the translation
    // It moves from 0 to -distance (or +distance if reversed) and loops back to 0
    const from = 0
    const to = reverse ? distance : -distance

    // Stop any previous animation instance before creating a new one
    controlsRef.current?.stop()

    // Create the continuous linear animation
    controlsRef.current = animate(translation, [from, to], {
      ease: 'linear',
      duration: duration, // Base duration for one cycle (from 0 to -distance)
      repeat: Infinity,
      repeatType: 'loop', // Ensures smooth looping without needing manual reset
    })

    // Set the initial speed
    if (controlsRef.current) {
      controlsRef.current.speed = baseSpeedMultiplier
    }

    // Cleanup: stop animation on unmount or when dependencies change
    return () => controlsRef.current?.stop()

    // Rerun effect if major parameters change
  }, [width, height, gap, direction, reverse, duration, translation]) // Removed hoverSpeedMultiplier from deps

  // Define hover event handlers if durationOnHover is provided
  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          // Increase or decrease speed on hover
          if (controlsRef.current) {
            controlsRef.current.speed = hoverSpeedMultiplier
          }
        },
        onHoverEnd: () => {
          // Restore original speed when hover ends
          if (controlsRef.current) {
            controlsRef.current.speed = baseSpeedMultiplier
          }
        },
      }
    : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* The motion.div contains BOTH sets of children and is translated */}
      <motion.div
        className={cn(
          'flex w-max', // Use w-max to allow content to determine width/height
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
        )}
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
        }}
        ref={ref} // Measure this container
        {...hoverProps}
      >
        {/* Render children twice side-by-side for the loop effect */}
        {children}
        {children}
      </motion.div>
    </div>
  )
}

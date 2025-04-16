'use client'

import React, { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import type { Page } from '@/payload-types'
import { FaBolt } from 'react-icons/fa6'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PartnerList } from '@/Partners/PartnerList'
import { poppins } from '@/fonts/font'

// Define enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9], // Custom easing for smoother motion
    },
  },
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  //@ts-expect-error - Type '(i: number) => Variants' is not assignable to type 'Variants'.
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06, // Slightly longer delay for more noticeable effect
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1], // Custom cubic bezier for bounce effect
    },
  }),
}

// New animation for highlighted words
const highlightedWordVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  //@ts-expect-error - Type '(i: number) => Variants' is not assignable to type 'Variants'.
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1.05, // Slightly larger scale for emphasis
    transition: {
      delay: i * 0.06 + 0.2, // Extra delay for highlighted words
      duration: 0.7,
      ease: 'backOut', // Elastic "pop" effect
    },
  }),
  hover: {
    scale: 1.05,
    color: '#10B981', // Tailwind green-500 equivalent
    transition: { duration: 0.2 },
  },
}

// Media animations
const mediaVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0,
    },
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
}

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  subTagline,
  title,
  highlightText,
}) => {
  const controls = useAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Start animations when component mounts
    controls
      .start('visible')
      .then(() => controls.start('pulse'))
      .then(() => setHasAnimated(true))
  }, [controls])

  const wordsToHighlight = new Set(
    highlightText
      ?.toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.replace(/[.,!?;:]$/, '')) || [],
  )

  const titleString = title || ''
  const titleWords = titleString.split(' ')

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="overflow-hidden py-8 md:py-12 lg:py-16"
    >
      <div className="container relative mb-8 md:mb-12">
        {/* Replace the static background decorative element with this bouncing version */}
        <motion.div
          className="absolute w-64 h-64 bg-green-900 dark:bg-green-50 rounded-full blur-3xl opacity-30 z-0"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            x: [0, -30, 40, -20, 30, 0], // Horizontal movement path
            y: [0, 40, -30, 20, -40, 0], // Vertical movement path
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            times: [0, 0.2, 0.4, 0.6, 0.8, 1], // Timing for each point in the animation path
          }}
        />

        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center justify-center relative z-10"
        >
          {subTagline && (
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center rounded-full border border-green-100 px-4 py-2 mb-6"
            >
              <motion.span
                variants={iconVariants}
                animate={controls}
                className="flex items-center justify-center rounded-full bg-green-100 p-1 mr-2"
              >
                <FaBolt className="text-green-500 text-sm" />
              </motion.span>
              <span className="text-sm font-medium text-green-950 dark:text-white">
                {subTagline}
              </span>
            </motion.div>
          )}

          <motion.h1 className="max-w-[1000px] text-5xl md:text-6xl lg:text-7xl text-green-950 dark:text-white font-bold text-center my-5 leading-tight tracking-tight">
            {titleWords.map((word, i) => {
              if (!word) return null
              const normalizedWord = word.toLowerCase().replace(/[.,!?;:]$/, '')
              const isHighlighted = wordsToHighlight.has(normalizedWord)
              const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              const isLastWord = i === titleWords.length - 1

              return (
                <motion.span
                  key={i}
                  custom={i}
                  variants={isHighlighted ? highlightedWordVariants : wordVariants}
                  whileHover={isHighlighted ? 'hover' : undefined}
                  className={`${isHighlighted ? 'text-green-500' : ''} ${poppins.className}`}
                >
                  {capitalizedWord}
                  {!isLastWord && ' '}
                </motion.span>
              )
            })}
          </motion.h1>
        </motion.div>

        {richText && (
          <motion.div variants={fadeInVariants} className="relative z-10">
            <RichText
              className={`text-center max-w-2xl mx-auto mb-8 text-lg ${poppins.className}`}
              data={richText}
              enableGutter={false}
            />
          </motion.div>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <motion.ul
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center items-center relative z-10"
          >
            {links.map(({ link }, i) => {
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.6 + i * 0.1,
                      duration: 0.5,
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CMSLink {...link} />
                </motion.li>
              )
            })}
          </motion.ul>
        )}
        <div className="relative">
          <PartnerList />
        </div>
      </div>
      <div className="container">
        {media && typeof media === 'object' && (
          <motion.div variants={mediaVariants} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.7, duration: 0.8 },
              }}
              className="relative overflow-hidden rounded-xl shadow-2xl"
            >
              <Media
                className="-mx-4 md:-mx-8 2xl:-mx-16"
                imgClassName="w-full transform transition-transform hover:scale-105 duration-700"
                priority
                resource={media}
              />

              {/* Subtle overlay gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5, transition: { delay: 1, duration: 0.8 } }}
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
              />
            </motion.div>

            {media?.caption && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.5 } }}
                className="mt-4 text-center text-sm text-gray-600"
              >
                <RichText data={media.caption} enableGutter={false} />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"

interface FloatingCrystalProps {
  size?: number
  left?: string
  right?: string
  top?: string
  bottom?: string
  delay?: number
  duration?: number
}

export function FloatingCrystal({
  size = 40,
  left,
  right,
  top,
  bottom,
  delay = 0,
  duration = 20,
}: FloatingCrystalProps) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left, right, top, bottom }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        y: [0, -20, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "linear",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
          fill="url(#crystal-gradient)"
          className="opacity-50"
        />
        <defs>
          <linearGradient id="crystal-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}


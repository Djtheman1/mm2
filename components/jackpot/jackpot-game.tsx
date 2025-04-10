"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Diamond, Trophy, Sparkles, Plus, ChevronDown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Layout } from "../layout/layout"
import { motion, AnimatePresence } from "framer-motion"

// Types
type Player = {
  id: string
  name: string
  color: string
  items: Item[]
  percentage: number
}

type Item = {
  id: string
  name: string
  value: number
  image: string
  rarity: string
}

type GameState = "waiting" | "spinning" | "complete"

export default function JackpotGame() {
  const [players, setPlayers] = useState<Player[]>([])
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [timeLeft, setTimeLeft] = useState(120)
  const [winner, setWinner] = useState<Player | null>(null)
  const [totalValue, setTotalValue] = useState(0)
  const [spinProgress, setSpinProgress] = useState(0)
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [arrowPulse, setArrowPulse] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(null)
  const [hoverSegment, setHoverSegment] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)

  const wheelRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const spinTimeRef = useRef<number>(0)
  const spinDurationRef = useRef<number>(8000) // 8 seconds
  const animationRef = useRef<number>(0)

  // Sample players and items for demonstration
  const samplePlayers: Player[] = [
    {
      id: "1",
      name: "JohnDoe",
      color: "#FF5E7D", // Pink
      items: [
        {
          id: "a1",
          name: "Chroma Darkbringer",
          value: 100,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Godly",
        },
        {
          id: "a2",
          name: "Laser",
          value: 50,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Godly",
        },
      ],
      percentage: 20,
    },
    {
      id: "2",
      name: "TradeMaster",
      color: "#4DFFDF", // Teal
      items: [
        {
          id: "b1",
          name: "Elderwood Scythe",
          value: 200,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Ancient",
        },
        {
          id: "b2",
          name: "Luger",
          value: 150,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Godly",
        },
        {
          id: "b3",
          name: "Ghost Blade",
          value: 50,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Godly",
        },
      ],
      percentage: 50,
    },
    {
      id: "3",
      name: "MM2Collector",
      color: "#C17BFF", // Purple
      items: [
        {
          id: "c1",
          name: "Corrupt",
          value: 180,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Unique",
        },
        {
          id: "c2",
          name: "Vintage Laser",
          value: 120,
          image: "/placeholder.svg?height=50&width=50",
          rarity: "Vintage",
        },
      ],
      percentage: 30,
    },
  ]

  // Initialize game with sample players
  useEffect(() => {
    setPlayers(samplePlayers)

    // Calculate total value of all items
    const total = samplePlayers.reduce((sum, player) => {
      return sum + player.items.reduce((itemSum, item) => itemSum + item.value, 0)
    }, 0)

    setTotalValue(total)

    // Expand first player by default for visibility
    setExpandedPlayer(samplePlayers[0]?.id || null)

    // Initialize ambient animations
    initAmbientAnimations()

    // Add subtle wheel rotation in waiting state
    if (gameState === "waiting") {
      const interval = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.2) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [gameState])

  // Initialize ambient animations
  const initAmbientAnimations = () => {
    // Randomly highlight wheel segments
    const interval = setInterval(() => {
      if (gameState === "waiting") {
        const randomPlayer = players[Math.floor(Math.random() * players.length)]
        if (randomPlayer) {
          setHighlightedSegment(randomPlayer.id)
          setTimeout(() => setHighlightedSegment(null), 1000)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  // Timer countdown
  useEffect(() => {
    if (gameState !== "waiting" || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
      if (timeLeft === 1) {
        startSpin()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  // Arrow pulse animation
  useEffect(() => {
    if (gameState === "waiting") {
      const interval = setInterval(() => {
        setArrowPulse((prev) => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState])

  // Start spinning animation
  const startSpin = () => {
    if (gameState !== "waiting") return

    setGameState("spinning")
    spinTimeRef.current = Date.now()

    // Determine final position based on winner
    const randomValue = Math.random() * 100
    let cumulativePercentage = 0
    let winningPlayer: Player | null = null
    let winningAngle = 0

    for (const player of players) {
      const prevCumulative = cumulativePercentage
      cumulativePercentage += player.percentage

      if (randomValue <= cumulativePercentage && !winningPlayer) {
        winningPlayer = player
        // Calculate position to middle of player's segment
        const segmentMiddle = prevCumulative + player.percentage / 2
        winningAngle = (segmentMiddle / 100) * 360
      }
    }

    // Ensure we have a winner
    if (!winningPlayer && players.length > 0) {
      winningPlayer = players[players.length - 1]
      winningAngle = 360 - players[players.length - 1].percentage / 2
    }

    // Calculate final rotation (multiple rotations + winning position)
    // We want the winning position to be at the top (270 degrees)
    const targetAngle = 1800 + (270 - winningAngle) // 5 full rotations (1800) + adjustment to position winner at top

    // Start the spinning animation
    spinAnimation(targetAngle, winningPlayer)
  }

  // Spin animation
  const spinAnimation = (targetAngle: number, winningPlayer: Player | null) => {
    const startTime = Date.now()
    const startAngle = rotationAngle

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / spinDurationRef.current)
      setSpinProgress(progress * 100)

      // Easing function for smooth deceleration
      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)
      const easedProgress = easeOutQuint(progress)

      // Calculate current rotation
      const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress
      setRotationAngle(currentAngle)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setWinner(winningPlayer)
        setGameState("complete")
        setShowParticles(true)
        setConfetti(true)

        // Hide particles after a few seconds
        setTimeout(() => {
          setShowParticles(false)
        }, 5000)
      }
    }

    animate()
  }

  // Reset the game
  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setGameState("waiting")
    setTimeLeft(120)
    setWinner(null)
    setSpinProgress(0)
    setShowParticles(false)
    setConfetti(false)
    // Keep the current rotation angle to avoid jumping
  }

  // Calculate total items in the jackpot
  const totalItems = players.reduce((sum, player) => sum + player.items.length, 0)

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace("#", "")
    let r = Number.parseInt(hex.substring(0, 2), 16)
    let g = Number.parseInt(hex.substring(2, 4), 16)
    let b = Number.parseInt(hex.substring(4, 6), 16)

    r = Math.max(0, Math.min(255, r + amount))
    g = Math.max(0, Math.min(255, g + amount))
    b = Math.max(0, Math.min(255, b + amount))

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Generate wheel segments for players
  const generateWheelSegments = () => {
    let cumulativePercentage = 0
    return players.map((player) => {
      const startAngle = cumulativePercentage * 3.6 // Convert percentage to degrees (out of 360)
      cumulativePercentage += player.percentage
      const endAngle = cumulativePercentage * 3.6
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

      // Calculate coordinates for the segment path
      const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180))
      const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180))
      const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180))
      const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180))

      // Calculate text position (middle of the segment)
      const midAngle = (startAngle + endAngle) / 2 - 90
      const textX = 50 + 35 * Math.cos(midAngle * (Math.PI / 180))
      const textY = 50 + 35 * Math.sin(midAngle * (Math.PI / 180))

      // Calculate inner arc for segment divider
      const innerStartX = 50 + 20 * Math.cos((startAngle - 90) * (Math.PI / 180))
      const innerStartY = 50 + 20 * Math.sin((startAngle - 90) * (Math.PI / 180))
      const innerEndX = 50 + 20 * Math.cos((endAngle - 90) * (Math.PI / 180))
      const innerEndY = 50 + 20 * Math.sin((endAngle - 90) * (Math.PI / 180))

      return {
        player,
        path: `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
        dividerPath: `M ${startX} ${startY} L 50 50 L ${endX} ${endY}`,
        innerArcPath: `M ${innerStartX} ${innerStartY} A 20 20 0 ${largeArcFlag} 1 ${innerEndX} ${innerEndY}`,
        textPosition: { x: textX, y: textY },
        startAngle,
        endAngle,
        midAngle: (startAngle + endAngle) / 2,
      }
    })
  }

  const wheelSegments = generateWheelSegments()

  // Confetti animation
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={
              {
                "--x": `${Math.random() * 100}vw`,
                "--y": `${Math.random() * -100}vh`,
                "--fall-duration": `${Math.random() * 3 + 2}s`,
                "--fall-delay": `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: "var(--x)",
                top: "var(--y)",
                position: "absolute",
                animation: "fall var(--fall-duration) var(--fall-delay) linear infinite",
                transform: `rotate(${Math.random() * 360}deg)`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gradient-radial from-[#3D0F5E] to-[#2D0845] text-white overflow-hidden">
        {/* Background ambient animation */}
        {/* <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 blur-xl"
                style={{
                  width: `${Math.random() * 20 + 10}vw`,
                  height: `${Math.random() * 20 + 10}vw`,
                  top: `${Math.random() * 100}vh`,
                  left: `${Math.random() * 100}vw`,
                  opacity: Math.random() * 0.3,
                  animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        </div> */}

        {confetti && <Confetti />}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-[#2D0845]/80 backdrop-blur-md border-b border-[#4D1A74] p-4 z-20">
            <div className="flex justify-between items-center"></div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="flex flex-col lg:flex-row gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Jackpot Wheel Arena */}
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center bg-[#2D0845]/80 rounded-xl p-6 border-2 border-[#4D1A74] shadow-[0_0_30px_rgba(156,44,243,0.3)] relative overflow-hidden"
                  whileHover={{ boxShadow: "0 0 40px rgba(156,44,243,0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background subtle pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjOWMyY2YzIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9uZCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

                  {/* Enhanced Jackpot Value Display */}
                  <motion.div
                    className="mb-8 relative z-10 w-full max-w-md"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <div className="bg-[#2D0845] border-2 border-[#4D1A74] rounded-xl p-4 shadow-[0_0_15px_rgba(156,44,243,0.4)] relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(156,44,243,0.6)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#9C2CF3]/10 to-[#FF3694]/10"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(156,44,243,0.2)_0%,_transparent_70%)] animate-pulse-slow"></div>

                      <div className="text-center">
                        <motion.h2
                          className="text-lg font-semibold text-[#C17BFF] mb-1 flex items-center justify-center"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Trophy className="h-5 w-5 mr-2 text-[#FF3694]" />
                          CURRENT JACKPOT
                        </motion.h2>
                        <motion.div
                          className="flex items-center justify-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          <Diamond className="h-7 w-7 text-[#FF3694] mr-2 animate-pulse-slow" />
                          <span className="text-5xl font-bold bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent jackpot-value relative">
                            {totalValue.toFixed(1)}
                            <span className="absolute inset-0 bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent blur-sm opacity-70">
                              {totalValue.toFixed(1)}
                            </span>
                          </span>
                        </motion.div>

                        <motion.div
                          className="mt-2 flex items-center justify-center space-x-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center bg-[#4D1A74]/50 px-3 py-1 rounded-full">
                            <span className="text-sm text-white">{totalItems} items</span>
                          </div>

                          {gameState === "waiting" && (
                            <div className="flex items-center bg-[#4D1A74]/50 px-3 py-1 rounded-full">
                              <Clock className="h-4 w-4 mr-1 text-[#FF3694]" />
                              <span className="text-sm text-white countdown">{timeLeft}s</span>
                            </div>
                          )}

                          {gameState === "spinning" && (
                            <div className="flex items-center bg-[#4D1A74]/50 px-3 py-1 rounded-full">
                              <Diamond className="h-4 w-4 mr-1 text-[#FF3694] animate-spin" />
                              <span className="text-sm text-white">Spinning...</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Circular Jackpot Wheel */}
                  <motion.div
                    className="relative mb-6 w-full max-w-md aspect-square"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    {/* Wheel Container */}
                    <div
                      ref={wheelRef}
                      className="relative w-full h-full jackpot-wheel"
                      style={{
                        transform: `rotate(${rotationAngle}deg)`,
                        transition: gameState === "spinning" ? "none" : "transform 0.3s ease-out",
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          {/* Player segment gradients */}
                          {players.map((player) => (
                            <linearGradient
                              key={`gradient-${player.id}`}
                              id={`segment-gradient-${player.id}`}
                              gradientUnits="userSpaceOnUse"
                              x1="50%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor={player.color} />
                              <stop offset="100%" stopColor={adjustColor(player.color, -30)} />
                              <animate attributeName="x1" values="50%;30%;50%" dur="3s" repeatCount="indefinite" />
                              <animate attributeName="y1" values="0%;20%;0%" dur="2.5s" repeatCount="indefinite" />
                            </linearGradient>
                          ))}

                          {/* Highlight gradient */}
                          <radialGradient id="highlight-gradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                            <animate attributeName="r" values="40%;60%;40%" dur="3s" repeatCount="indefinite" />
                          </radialGradient>

                          {/* Outer ring gradient */}
                          <linearGradient id="outer-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9C2CF3" />
                            <stop offset="50%" stopColor="#FF3694" />
                            <stop offset="100%" stopColor="#9C2CF3" />
                            <animate attributeName="x1" values="0%;100%;0%" dur="10s" repeatCount="indefinite" />
                            <animate attributeName="y1" values="0%;100%;0%" dur="10s" repeatCount="indefinite" />
                          </linearGradient>

                          {/* Inner ring gradient */}
                          <linearGradient id="inner-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF3694" />
                            <stop offset="50%" stopColor="#9C2CF3" />
                            <stop offset="100%" stopColor="#FF3694" />
                            <animate attributeName="x2" values="100%;0%;100%" dur="8s" repeatCount="indefinite" />
                          </linearGradient>

                          {/* Glow filter */}
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>

                          {/* Shimmer effect */}
                          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            <animate attributeName="x1" values="-100%;100%" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="x2" values="0%;200%" dur="2s" repeatCount="indefinite" />
                          </linearGradient>
                        </defs>

                        {/* Wheel Background with enhanced design */}
                        <circle
                          cx="50"
                          cy="50"
                          r="49"
                          fill="#2D0845"
                          stroke="url(#outer-ring-gradient)"
                          strokeWidth="2"
                          className="wheel-outer-ring"
                          filter="url(#glow)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="#2D0845"
                          stroke="#9C2CF3"
                          strokeWidth="0.5"
                          strokeDasharray="3,3"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="0;100"
                            dur="30s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Player Segments with enhanced design */}
                        {wheelSegments.map((segment) => (
                          <g key={`segment-${segment.player.id}`}>
                            <path
                              d={segment.path}
                              fill={`url(#segment-gradient-${segment.player.id})`}
                              stroke={
                                winner && winner.id === segment.player.id && gameState === "complete"
                                  ? "#FFFFFF"
                                  : "#4D1A74"
                              }
                              strokeWidth={
                                winner && winner.id === segment.player.id && gameState === "complete" ? "1.5" : "0.5"
                              }
                              className={`wheel-segment ${
                                highlightedSegment === segment.player.id || hoverSegment === segment.player.id
                                  ? "segment-highlight"
                                  : ""
                              } ${
                                winner && winner.id === segment.player.id && gameState === "complete"
                                  ? "winner-segment-outline"
                                  : ""
                              }`}
                              data-player-id={segment.player.id}
                              onMouseEnter={() => setHoverSegment(segment.player.id)}
                              onMouseLeave={() => setHoverSegment(null)}
                            />

                            {/* Shimmer effect overlay */}
                            <path
                              d={segment.path}
                              fill="url(#shimmer)"
                              opacity="0.5"
                              className={`${
                                winner && winner.id === segment.player.id && gameState === "complete"
                                  ? "opacity-100"
                                  : "opacity-30"
                              }`}
                            />

                            {/* Segment divider */}
                            <path
                              d={segment.dividerPath}
                              stroke="#4D1A74"
                              strokeWidth="0.5"
                              fill="none"
                              className="segment-divider"
                            />

                            {/* Inner arc */}
                            <path
                              d={segment.innerArcPath}
                              stroke="#4D1A74"
                              strokeWidth="0.5"
                              fill="none"
                              className="inner-arc"
                            />

                            {/* Player Name */}
                            <text
                              x={segment.textPosition.x}
                              y={segment.textPosition.y}
                              fill="white"
                              fontSize="3"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              style={{ textShadow: "0 0 2px rgba(0,0,0,0.8)" }}
                              className="player-name"
                            >
                              {segment.player.name}
                            </text>

                            {/* Percentage */}
                            <text
                              x={segment.textPosition.x}
                              y={segment.textPosition.y + 4}
                              fill="white"
                              fontSize="2.5"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="player-percentage-text"
                            >
                              {segment.player.percentage}%
                            </text>
                          </g>
                        ))}

                        {/* Enhanced Center Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="20"
                          fill="#2D0845"
                          stroke="url(#inner-ring-gradient)"
                          strokeWidth="2"
                          className="wheel-center"
                          filter="url(#glow)"
                        />

                        <circle
                          cx="50"
                          cy="50"
                          r="15"
                          fill="#2D0845"
                          stroke="#9C2CF3"
                          strokeWidth="0.5"
                          strokeDasharray="2,2"
                        >
                          <animate attributeName="stroke-dashoffset" values="0;50" dur="20s" repeatCount="indefinite" />
                        </circle>

                        {/* Center Logo */}
                        <foreignObject x="35" y="35" width="30" height="30">
                          <div className="w-full h-full flex items-center justify-center">
                            <div
                              className="w-[25px] h-[25px] rounded-full bg-gradient-to-br from-[#FF3694] to-[#9C2CF3] flex items-center justify-center center-logo"
                              style={{
                                transform: `rotate(${90 - rotationAngle}deg)`,
                                boxShadow: "0 0 10px rgba(156,44,243,0.8)",
                              }}
                            >
                              <Diamond className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </foreignObject>
                      </svg>
                    </div>

                    {/* Enhanced Landing Position Indicator with prominent arrow - moved to left side */}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-[60%] z-50 landing-indicator rotate-[270deg]">
                      <motion.div
                        className={`prominent-arrow ${gameState === "spinning" ? "arrow-spinning" : ""}`}
                        animate={{
                          x: arrowPulse ? 5 : 0,
                          scale: arrowPulse ? 1.1 : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <div className="arrow-body bg-gradient-to-r from-[#9C2CF3] to-[#FF3694] h-8 w-4 rounded-t-full"></div>
                        <div className="arrow-point w-0 h-0 border-l-[10px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#FF3694]"></div>
                        <div className="arrow-outline absolute inset-0 bg-white opacity-20 blur-sm"></div>
                        {gameState === "complete" && (
                          <div className="arrow-highlight-pulse absolute inset-0 bg-white animate-pulse opacity-50"></div>
                        )}
                      </motion.div>
                    </div>

                    {/* Particles effect for winner */}
                    {showParticles && (
                      <div ref={particlesRef} className="absolute inset-0 z-20 pointer-events-none">
                        <div className="particles-container">
                          {Array.from({ length: 50 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="particle"
                              initial={{
                                scale: 0,
                                x: "50%",
                                y: "50%",
                                opacity: 1,
                              }}
                              animate={{
                                scale: Math.random() * 1 + 0.5,
                                x: `${Math.random() * 200 - 100}%`,
                                y: `${Math.random() * 200 - 100}%`,
                                opacity: 0,
                              }}
                              transition={{
                                duration: Math.random() * 2 + 1,
                                ease: "easeOut",
                                delay: Math.random() * 0.5,
                              }}
                              style={{
                                backgroundColor: winner ? winner.color : "#FF3694",
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                borderRadius: "50%",
                                position: "absolute",
                                boxShadow: `0 0 10px ${winner ? winner.color : "#FF3694"}`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Winning overlay - only shown when complete */}
                    {gameState === "complete" && winner && (
                      <motion.div
                        className="absolute inset-0 z-30 flex items-center justify-center rounded-full overflow-hidden"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.5,
                          type: "spring",
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle, ${winner.color}80 0%, transparent 70%)`,
                            animation: "pulse 2s infinite",
                          }}
                        />
                        <motion.div
                          className="bg-black/70 backdrop-blur-md px-6 py-4 rounded-xl border-2 text-center winner-card"
                          style={{ borderColor: winner.color }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <motion.div
                            className="text-2xl font-bold mb-1 flex items-center justify-center"
                            style={{ color: winner.color }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 1,
                              type: "spring",
                              stiffness: 300,
                            }}
                          >
                            <Trophy className="h-6 w-6 mr-2" />
                            {winner.name} WINS!
                          </motion.div>
                          <div className="text-white/80 text-sm">
                            {totalItems} items worth {totalValue.toFixed(1)}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                  className="flex-1 flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Join Button */}
                  <div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        className={cn(
                          "w-full py-6 text-xl font-bold rounded-md text-white mb-6 shadow-lg jackpot-button relative overflow-hidden",
                          gameState === "waiting"
                            ? "bg-gradient-to-r from-[#9C2CF3] to-[#FF3694] hover:from-[#8B26D9] hover:to-[#E5337F] shadow-[0_0_15px_rgba(156,44,243,0.5)]"
                            : gameState === "spinning"
                              ? "bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] shadow-[0_0_15px_rgba(67,97,238,0.5)]"
                              : "bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] shadow-[0_0_15px_rgba(76,201,240,0.5)]",
                        )}
                        onClick={gameState === "waiting" ? startSpin : resetGame}
                        disabled={gameState === "spinning"}
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 w-full h-full shine-effect"></div>

                        {gameState === "waiting" ? (
                          <motion.div
                            className="flex items-center justify-center"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          >
                            <Sparkles className="mr-2 h-6 w-6" />
                            <span>JOIN JACKPOT</span>
                          </motion.div>
                        ) : gameState === "spinning" ? (
                          <div className="flex items-center justify-center">
                            <div className="mr-2 animate-spin">
                              <Diamond className="h-5 w-5" />
                            </div>
                            <span>SPINNING...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Zap className="mr-2 h-6 w-6" />
                            <span>PLAY AGAIN</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Player Contributions Panel */}
                  <motion.div
                    className="bg-[#2D0845]/80 backdrop-blur-sm rounded-xl border-2 border-[#4D1A74] p-6 h-full shadow-[0_0_15px_rgba(156,44,243,0.3)] overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent flex items-center">
                      <Diamond className="h-5 w-5 mr-2 text-[#FF3694]" />
                      Player Contributions
                    </h3>

                    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-1 players-list">
                      <AnimatePresence>
                        {players.map((player, index) => (
                          <motion.div
                            key={player.id}
                            className={`bg-[#4D1A74]/50 backdrop-blur-sm rounded-lg overflow-hidden player-card ${
                              winner && winner.id === player.id && gameState === "complete" ? "winner-highlight" : ""
                            }`}
                            style={{
                              opacity: winner && winner.id !== player.id && gameState === "complete" ? 0.6 : 1,
                              borderColor:
                                winner && winner.id === player.id && gameState === "complete"
                                  ? player.color
                                  : "transparent",
                              borderWidth:
                                winner && winner.id === player.id && gameState === "complete" ? "2px" : "0px",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{
                              scale: 1.02,
                              boxShadow: `0 0 15px ${player.color}40`,
                            }}
                          >
                            {/* Player header */}
                            <div
                              className="p-3 flex items-center justify-between cursor-pointer"
                              onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                            >
                              <div className="flex items-center">
                                <motion.div
                                  className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center player-avatar"
                                  style={{
                                    background: `linear-gradient(135deg, ${
                                      player.color
                                    }, ${adjustColor(player.color, -30)})`,
                                    boxShadow: `0 0 10px ${player.color}60`,
                                  }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="text-white font-bold text-lg">{player.name.charAt(0)}</span>
                                </motion.div>
                                <div>
                                  <div className="font-medium text-white">{player.name}</div>
                                  <div className="text-sm text-gray-300 flex items-center">
                                    <Diamond className="h-3 w-3 mr-1 text-gray-300" />
                                    {player.items.length} items
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <motion.div
                                  className="px-3 py-1.5 rounded-lg text-sm font-bold mr-3 player-percentage"
                                  style={{
                                    background: `linear-gradient(135deg, ${
                                      player.color
                                    }, ${adjustColor(player.color, -30)})`,
                                    boxShadow: `0 0 8px ${player.color}40`,
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {player.percentage}%
                                </motion.div>
                                <motion.div
                                  animate={{
                                    rotate: expandedPlayer === player.id ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </motion.div>
                              </div>
                            </div>

                            {/* Player items */}
                            <AnimatePresence>
                              {expandedPlayer === player.id && (
                                <motion.div
                                  className="px-3 pb-3"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="grid grid-cols-3 gap-3 mt-2">
                                    {player.items.map((item, itemIndex) => (
                                      <motion.div
                                        key={item.id}
                                        className="bg-[#2D0845] p-3 rounded-lg text-center border border-[#6B2A9B]/50 player-item"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.05 * itemIndex }}
                                        whileHover={{
                                          scale: 1.05,
                                          borderColor: player.color,
                                          boxShadow: `0 0 10px ${player.color}40`,
                                        }}
                                      >
                                        <div className="relative">
                                          <motion.div
                                            className="w-10 h-10 mx-auto mb-1 flex items-center justify-center"
                                            animate={{
                                              rotate: [0, 10, 0, -10, 0],
                                            }}
                                            transition={{
                                              duration: 5,
                                              repeat: Number.POSITIVE_INFINITY,
                                              repeatType: "loop",
                                              ease: "easeInOut",
                                              delay: itemIndex * 0.2,
                                            }}
                                          >
                                            <Diamond className="h-7 w-7" style={{ color: player.color }} />
                                          </motion.div>
                                        </div>
                                        <div className="text-sm font-medium truncate">{item.name}</div>
                                        <div className="text-sm font-bold mt-1" style={{ color: player.color }}>
                                          {item.value}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">{item.rarity}</div>
                                      </motion.div>
                                    ))}
                                    {player.items.length < 3 && gameState === "waiting" && (
                                      <motion.button
                                        className="bg-[#2D0845] p-3 rounded-lg text-center border border-dashed border-[#6B2A9B]/50 flex items-center justify-center h-full"
                                        whileHover={{
                                          scale: 1.05,
                                          borderColor: "#FF3694",
                                          boxShadow: "0 0 15px rgba(255,54,148,0.3)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Plus className="h-6 w-6 text-gray-400" />
                                      </motion.button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fall {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(100vh) rotate(360deg); }
        }
        
        .shine-effect {
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent
          );
          animation: shine 3s infinite;
          transform: skewX(-20deg);
        }
        
        @keyframes shine {
          0% { left: -100%; }
          20%, 100% { left: 100%; }
        }
        
        .segment-highlight {
          filter: brightness(1.3);
          transition: filter 0.3s ease;
        }
        
        .winner-segment-outline {
          stroke-width: 2px;
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
          animation: pulse-winner-outline 2s infinite;
        }

        @keyframes pulse-winner-outline {
          0%, 100% { stroke-width: 1.5px; stroke-opacity: 0.8; }
          50% { stroke-width: 2.5px; stroke-opacity: 1; }
        }
        
        .winner-highlight {
          animation: winner-glow 2s infinite;
        }
        
        @keyframes winner-glow {
          0%, 100% { box-shadow: 0 0 10px currentColor; }
          50% { box-shadow: 0 0 20px currentColor; }
        }
        
        .players-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .players-list::-webkit-scrollbar-track {
          background: rgba(77, 26, 116, 0.3);
          border-radius: 10px;
        }
        
        .players-list::-webkit-scrollbar-thumb {
          background: rgba(156, 44, 243, 0.5);
          border-radius: 10px;
        }
        
        .players-list::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 44, 243, 0.8);
        }
      `}</style>
    </Layout>
  )
}


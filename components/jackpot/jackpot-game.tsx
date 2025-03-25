"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Diamond, Trophy, Sparkles, Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "../sidebar/sidebar"
import { MobileNav } from "../mobile-nav/mobile-nav"

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
        { id: "a2", name: "Laser", value: 50, image: "/placeholder.svg?height=50&width=50", rarity: "Godly" },
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
        { id: "b2", name: "Luger", value: 150, image: "/placeholder.svg?height=50&width=50", rarity: "Godly" },
        { id: "b3", name: "Ghost Blade", value: 50, image: "/placeholder.svg?height=50&width=50", rarity: "Godly" },
      ],
      percentage: 50,
    },
    {
      id: "3",
      name: "MM2Collector",
      color: "#C17BFF", // Purple
      items: [
        { id: "c1", name: "Corrupt", value: 180, image: "/placeholder.svg?height=50&width=50", rarity: "Unique" },
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
  }, [])

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

  return (
    <div className="flex h-screen bg-[#3D0F5E] text-white overflow-hidden">
      {/* Background ambient animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#3D0F5E] overflow-hidden">
          <div className="floating-light floating-light-1"></div>
          <div className="floating-light floating-light-2"></div>
          <div className="floating-light floating-light-3"></div>
        </div>
      </div>

      {/* New Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#2D0845] border-b border-[#4D1A74] p-4 z-20">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent flex items-center">
              <Diamond className="h-6 w-6 mr-2 text-[#FF3694]" />
              Jackpot
            </h1>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6 bg-gradient-to-b from-[#3D0F5E] to-[#2D0845]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Jackpot Wheel Arena */}
              <div className="flex-1 flex flex-col items-center justify-center bg-[#2D0845]/80 rounded-xl p-6 border-2 border-[#4D1A74] shadow-[0_0_20px_rgba(156,44,243,0.3)] relative overflow-hidden">
                {/* Background subtle pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjOWMyY2YzIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9uZCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

                {/* Enhanced Jackpot Value Display */}
                <div className="mb-8 relative z-10 w-full max-w-md">
                  <div className="bg-[#2D0845] border-2 border-[#4D1A74] rounded-xl p-4 shadow-[0_0_15px_rgba(156,44,243,0.4)] relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(156,44,243,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9C2CF3]/10 to-[#FF3694]/10"></div>
                    <div className="absolute inset-0 jackpot-glow"></div>

                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-[#C17BFF] mb-1 flex items-center justify-center">
                        <Trophy className="h-5 w-5 mr-2 text-[#FF3694]" />
                        CURRENT JACKPOT
                      </h2>
                      <div className="flex items-center justify-center">
                        <Diamond className="h-7 w-7 text-[#FF3694] mr-2 animate-pulse-slow" />
                        <span className="text-5xl font-bold bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent jackpot-value">
                          {totalValue.toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-center space-x-4">
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Circular Jackpot Wheel */}
                <div className="relative mb-6 w-full max-w-md aspect-square">
                  {/* Wheel Container */}
                  <div
                    ref={wheelRef}
                    className="relative w-full h-full jackpot-wheel"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
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
                          </linearGradient>
                        ))}

                        {/* Highlight gradient */}
                        <radialGradient id="highlight-gradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>

                        {/* Outer ring gradient */}
                        <linearGradient id="outer-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9C2CF3" />
                          <stop offset="50%" stopColor="#FF3694" />
                          <stop offset="100%" stopColor="#9C2CF3" />
                        </linearGradient>

                        {/* Inner ring gradient */}
                        <linearGradient id="inner-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF3694" />
                          <stop offset="50%" stopColor="#9C2CF3" />
                          <stop offset="100%" stopColor="#FF3694" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Wheel Background with enhanced design */}
                      <circle
                        cx="50"
                        cy="50"
                        r="49"
                        fill="#2D0845"
                        stroke="#9C2CF3"
                        strokeWidth="2"
                        className="wheel-outer-ring"
                      />
                      <circle cx="50" cy="50" r="48" fill="#2D0845" stroke="#9C2CF3" strokeWidth="0.5" />

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
                            className={`wheel-segment ${highlightedSegment === segment.player.id ? "segment-highlight" : ""} ${winner && winner.id === segment.player.id && gameState === "complete" ? "winner-segment" : ""}`}
                            data-player-id={segment.player.id}
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
                        stroke="#9C2CF3"
                        strokeWidth="2"
                        className="wheel-center"
                      />

                      <circle cx="50" cy="50" r="15" fill="#2D0845" stroke="#9C2CF3" strokeWidth="0.5" />

                      {/* Center Logo */}
                      <foreignObject x="35" y="35" width="30" height="30">
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src="/gem-logo.png"
                            alt="Gem Logo"
                            className="w-[25px] h-[25px] object-contain center-logo"
                          />
                        </div>
                      </foreignObject>
                    </svg>
                  </div>

                  {/* Enhanced Landing Position Indicator with prominent arrow */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[60%] z-50 landing-indicator">
                    <div className={`prominent-arrow ${gameState === "spinning" ? "arrow-spinning" : ""}`}>
                      <div className="arrow-body"></div>
                      <div className="arrow-point"></div>
                      <div className="arrow-outline"></div>
                      {gameState === "complete" && <div className="arrow-highlight-pulse"></div>}
                    </div>
                  </div>

                  {/* Particles effect for winner */}
                  {showParticles && (
                    <div ref={particlesRef} className="absolute inset-0 z-20 pointer-events-none">
                      <div className="particles-container">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="particle"
                            style={
                              {
                                "--delay": `${Math.random() * 2}s`,
                                "--size": `${Math.random() * 10 + 5}px`,
                                "--color": winner ? winner.color : "#FF3694",
                                "--x": `${Math.random() * 100}%`,
                                "--y": `${Math.random() * 100}%`,
                              } as React.CSSProperties
                            }
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Winning overlay - only shown when complete */}
                  {gameState === "complete" && winner && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle, ${winner.color}80 0%, transparent 70%)`,
                          animation: "pulse 2s infinite",
                        }}
                      />
                      <div
                        className="bg-black/50 backdrop-blur-sm px-6 py-4 rounded-xl border-2 text-center winner-card"
                        style={{ borderColor: winner.color }}
                      >
                        <div className="text-2xl font-bold mb-1" style={{ color: winner.color }}>
                          {winner.name} WINS!
                        </div>
                        <div className="text-white/80 text-sm">
                          {totalItems} items worth {totalValue.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex-1 flex flex-col">
                {/* Join Button */}
                <div>
                  <Button
                    className={cn(
                      "w-full py-6 text-xl font-bold rounded-md text-white mb-6 shadow-lg jackpot-button",
                      gameState === "waiting"
                        ? "bg-gradient-to-r from-[#9C2CF3] to-[#FF3694] hover:from-[#8B26D9] hover:to-[#E5337F] shadow-[0_0_15px_rgba(156,44,243,0.5)]"
                        : gameState === "spinning"
                          ? "bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] shadow-[0_0_15px_rgba(67,97,238,0.5)]"
                          : "bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] shadow-[0_0_15px_rgba(76,201,240,0.5)]",
                    )}
                    onClick={gameState === "waiting" ? startSpin : resetGame}
                    disabled={gameState === "spinning"}
                  >
                    {gameState === "waiting" ? (
                      <div className="flex items-center justify-center animate-pulse">
                        <Sparkles className="mr-2 h-6 w-6" />
                        <span>JOIN JACKPOT</span>
                      </div>
                    ) : gameState === "spinning" ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 animate-spin">
                          <Diamond className="h-5 w-5" />
                        </div>
                        <span>SPINNING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="mr-2 h-6 w-6" />
                        <span>PLAY AGAIN</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Player Contributions Panel */}
                <div className="bg-[#2D0845]/80 backdrop-blur-sm rounded-xl border-2 border-[#4D1A74] p-6 h-full shadow-[0_0_15px_rgba(156,44,243,0.3)] overflow-hidden">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#FF5E7D] to-[#FF3694] bg-clip-text text-transparent flex items-center">
                    <Diamond className="h-5 w-5 mr-2 text-[#FF3694]" />
                    Player Contributions
                  </h3>

                  <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-1">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className={`bg-[#4D1A74]/50 backdrop-blur-sm rounded-lg overflow-hidden player-card ${winner && winner.id === player.id && gameState === "complete" ? "winner-highlight" : ""}`}
                        style={{
                          opacity: winner && winner.id !== player.id && gameState === "complete" ? 0.6 : 1,
                        }}
                      >
                        {/* Player header */}
                        <div
                          className="p-3 flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center player-avatar"
                              style={{
                                background: `linear-gradient(135deg, ${player.color}, ${adjustColor(player.color, -30)})`,
                                boxShadow: `0 0 10px ${player.color}60`,
                              }}
                            >
                              <span className="text-white font-bold text-lg">{player.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{player.name}</div>
                              <div className="text-sm text-gray-300 flex items-center">
                                <Diamond className="h-3 w-3 mr-1 text-gray-300" />
                                {player.items.length} items
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className="px-3 py-1.5 rounded-lg text-sm font-bold mr-3 player-percentage"
                              style={{
                                background: `linear-gradient(135deg, ${player.color}, ${adjustColor(player.color, -30)})`,
                                boxShadow: `0 0 8px ${player.color}40`,
                              }}
                            >
                              {player.percentage}%
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                expandedPlayer === player.id ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Player items */}
                        {expandedPlayer === player.id && (
                          <div className="px-3 pb-3">
                            <div className="grid grid-cols-3 gap-3 mt-2">
                              {player.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-[#2D0845] p-3 rounded-lg text-center border border-[#6B2A9B]/50 player-item hover:scale-105 hover:border-[#FF3694] transition-all duration-300"
                                >
                                  <div className="relative">
                                    <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center">
                                      <Diamond className="h-7 w-7" style={{ color: player.color }} />
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium truncate">{item.name}</div>
                                  <div className="text-sm font-bold mt-1" style={{ color: player.color }}>
                                    {item.value}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-0.5">{item.rarity}</div>
                                </div>
                              ))}
                              {player.items.length < 3 && gameState === "waiting" && (
                                <button className="bg-[#2D0845] p-3 rounded-lg text-center border border-dashed border-[#6B2A9B]/50 flex items-center justify-center hover:border-[#FF3694] transition-all duration-300 h-full">
                                  <Plus className="h-6 w-6 text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}


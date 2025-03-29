"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, ArrowUpDown, HandCoins } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../sidebar/sidebar"
// History Popup Component
const HistoryPopup = ({ closePopup }: { closePopup: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTab, setSelectedTab] = useState("all")

  // Mock history data
  const historyData = [
    {
      id: 1,
      type: "win",
      opponent: "shadowblade",
      choice: "Heads",
      result: "Heads",
      items: ["Sword", "Shield"],
      value: "66.00K",
      date: "March 28, 2025 14:30",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      type: "loss",
      opponent: "darkrider",
      choice: "Tails",
      result: "Heads",
      items: ["Gem", "Knife"],
      value: "23.88K",
      date: "March 27, 2025 18:45",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      type: "win",
      opponent: "nightstalker",
      choice: "Heads",
      result: "Heads",
      items: ["Sword", "Gem"],
      value: "45.50K",
      date: "March 26, 2025 09:15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      type: "loss",
      opponent: "firestorm",
      choice: "Tails",
      result: "Heads",
      items: ["Shield", "Knife"],
      value: "12.30K",
      date: "March 25, 2025 21:10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Filter history based on search and tab
  const filteredHistory = historyData
    .filter(
      (item) =>
        (selectedTab === "all" ||
          (selectedTab === "wins" && item.type === "win") ||
          (selectedTab === "losses" && item.type === "loss")) &&
        (item.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.items.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-3xl max-h-[85vh] overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=800')] opacity-5 bg-cover bg-center pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">
            Game History
          </h2>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
              <Input
                placeholder="Search by player or item..."
                className="pl-10 bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-purple-700 bg-purple-900/50 text-white hover:bg-purple-800"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>

              <Button
                variant="outline"
                className="border-purple-700 bg-purple-900/50 text-white hover:bg-purple-800"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortDirection === "desc" ? "Newest" : "Oldest"}
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-purple-900/70 rounded-lg"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Date Range</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-purple-800/50 border-purple-700">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Value Range</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-purple-800/50 border-purple-700">
                      <SelectValue placeholder="Select value range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Values</SelectItem>
                      <SelectItem value="low">Low (0-10K)</SelectItem>
                      <SelectItem value="medium">Medium (10K-50K)</SelectItem>
                      <SelectItem value="high">High (50K+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-4" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 bg-purple-900/50 text-white">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-700 text-white">
                All Games
              </TabsTrigger>
              <TabsTrigger value="wins" className="data-[state=active]:bg-purple-700 text-white">
                Wins
              </TabsTrigger>
              <TabsTrigger value="losses" className="data-[state=active]:bg-purple-700 text-white">
                Losses
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* History List */}
          <div className="overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
            {filteredHistory.length > 0 ? (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-gradient-to-r ${
                      item.type === "win"
                        ? "from-green-900/40 to-purple-900/40 border-l-4 border-green-500"
                        : "from-red-900/40 to-purple-900/40 border-l-4 border-red-500"
                    } p-4 rounded-lg shadow-lg hover:shadow-purple-900/50 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.avatar || "/placeholder.svg"}
                          alt={item.opponent}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-purple-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.opponent}</span>
                            <Badge className={item.type === "win" ? "bg-green-600" : "bg-red-600"}>
                              {item.type === "win" ? "Win" : "Loss"}
                            </Badge>
                          </div>
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.value}</div>
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center">
                            <Image
                              src="/images/heads-coin.png"
                              alt={item.choice}
                              width={24}
                              height={24}
                              className="mr-1"
                            />
                            <span className="text-xs text-purple-300">→</span>
                            <Image
                              src="/images/tails-coin.png"
                              alt={item.result}
                              width={24}
                              height={24}
                              className={`ml-1 ${item.choice === item.result ? "border border-green-400 rounded-full" : "border border-red-400 rounded-full"}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.items.map((itemName, idx) => (
                        <span key={idx} className="bg-purple-800/70 px-2 py-0.5 rounded text-xs">
                          {itemName}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-purple-300">No history matches your search criteria</div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-purple-900/50 p-3 rounded-lg">
              <div className="text-sm text-purple-300">Total Games</div>
              <div className="text-xl font-bold">{historyData.length}</div>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg">
              <div className="text-sm text-green-300">Wins</div>
              <div className="text-xl font-bold">{historyData.filter((i) => i.type === "win").length}</div>
            </div>
            <div className="bg-red-900/30 p-3 rounded-lg">
              <div className="text-sm text-red-300">Losses</div>
              <div className="text-xl font-bold">{historyData.filter((i) => i.type === "loss").length}</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl opacity-80 hover:opacity-100 transition-all"
          onClick={closePopup}
        >
          ✖
        </button>
      </motion.div>
    </div>
  )
}

// Simple Game Details Popup
const GameDetailsPopup = ({ game, closePopup }: { game: any; closePopup: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Game Details</h2>

        <div className="bg-purple-900/30 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Image
                src={game.avatar1 || "/placeholder.svg?height=40&width=40"}
                alt={game.player1}
                width={40}
                height={40}
                className="rounded-full border-2 border-purple-500"
              />
              <span className="font-semibold">{game.player1}</span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {game.choice && (
                  <Image
                    src="/images/heads-coin.png"
                    alt={game.choice}
                    width={30}
                    height={30}
                    className="border border-purple-500 rounded-full"
                  />
                )}
                <span className="text-lg font-bold">{game.value}</span>
                {game.player2 !== "waiting..." && game.player2Choice && (
                  <Image
                    src="/images/tails-coin.png"
                    alt={game.player2Choice}
                    width={30}
                    height={30}
                    className="border border-purple-500 rounded-full"
                  />
                )}
              </div>
              <div className="text-xs text-purple-300">{game.range}</div>
            </div>

            <div className="flex items-center gap-2">
              {game.player2 !== "waiting..." ? (
                <div className="flex items-center gap-2">
                  <Image
                    src={game.avatar2 || "/placeholder.svg?height=40&width=40"}
                    alt={game.player2}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-purple-500"
                  />
                  <span className="font-semibold">{game.player2}</span>
                </div>
              ) : (
                <span className="text-purple-300 italic">Waiting for player...</span>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-wrap gap-3 justify-center mb-3">
            {game.items.map((item: string, idx: number) => (
              <div key={idx} className="relative group">
                <img
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={item}
                  className="w-12 h-12 rounded-md border border-purple-500"
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-purple-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item}
                </div>
              </div>
            ))}
          </div>

          {game.player2 === "waiting..." ? (
            <div className="text-center">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">Join Game</Button>
            </div>
          ) : (
            <div className="text-center text-purple-300">Game already has two players</div>
          )}
        </div>

        <div className="flex justify-center">
          <Button className="bg-purple-800 hover:bg-purple-700 text-white" onClick={closePopup}>
            Close
          </Button>
        </div>

        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl opacity-80 hover:opacity-100 transition-all"
          onClick={closePopup}
        >
          ✖
        </button>
      </motion.div>
    </div>
  )
}

// Inventory Popup Component
const InventoryPopup = ({ items, selectedItems, handleItemClick, handleSelectAll, closePopup, handleFlip }: any) => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [coinAnimation, setCoinAnimation] = useState(false)

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin)
    setCoinAnimation(true)
    setTimeout(() => setCoinAnimation(false), 800) // Increased animation duration
  }

  return (
    <>
      {/* Inventory Popup */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-3xl shadow-2xl w-[42rem] max-w-full sm:w-[40rem] lg:w-[45rem] transition-all duration-500 hover:scale-105"
        >
          <h2 className="text-3xl font-semibold mb-4 text-center tracking-wider">Select Items & Coinflip</h2>

          {/* Select All Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleSelectAll}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg hover:from-indigo-700 hover:to-purple-700 w-28 text-sm"
            >
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {/* Grid for Inventory Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 pr-10">
            {items.map((item: any, index: number) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br from-indigo-900 to-purple-700 p-3 rounded-lg shadow-md transform transition-all duration-300 ${selectedItems.includes(item.name) ? "border-4 border-indigo-500" : ""}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleItemClick(item.name)}
              >
                <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={item.image || "/placeholder.svg?height=96&width=96"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-semibold mt-2 text-center">{item.name}</p>
                <p className="text-xs text-gray-300 text-center">{item.rarity}</p>
              </motion.div>
            ))}
          </div>

          {/* Coinflip Picker */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-16">
              <motion.div
                className={`cursor-pointer relative ${selectedCoin === "heads" ? "scale-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.8)]" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCoinSelect("heads")}
              >
                <motion.div
                  animate={
                    selectedCoin === "heads" && coinAnimation
                      ? {
                          rotateY: [0, 180, 360],
                          scale: [1, 1.2, 1],
                          filter: [
                            "drop-shadow(0 0 0px rgba(255,255,255,0))",
                            "drop-shadow(0 0 15px rgba(255,255,255,0.8))",
                            "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.8 }}
                >
                  <Image src="/images/heads-coin.png" alt="Heads" width={150} height={150} className="drop-shadow-lg" />
                </motion.div>
                <p className="text-center mt-2 font-bold text-white/80">HEADS</p>
              </motion.div>

              <motion.div
                className={`cursor-pointer relative ${selectedCoin === "tails" ? "scale-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.8)]" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCoinSelect("tails")}
              >
                <motion.div
                  animate={
                    selectedCoin === "tails" && coinAnimation
                      ? {
                          rotateY: [0, 180, 360],
                          scale: [1, 1.2, 1],
                          filter: [
                            "drop-shadow(0 0 0px rgba(255,255,255,0))",
                            "drop-shadow(0 0 15px rgba(255,255,255,0.8))",
                            "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.8 }}
                >
                  <Image src="/images/tails-coin.png" alt="Tails" width={150} height={150} className="drop-shadow-lg" />
                </motion.div>
                <p className="text-center mt-2 font-bold text-white/80">TAILS</p>
              </motion.div>
            </div>
          </div>

          {/* Post Game Button */}
          <div className="flex justify-center mt-8">
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-2 text-lg shadow-xl"
              onClick={() => selectedCoin && handleFlip(selectedCoin)}
              disabled={!selectedCoin}
            >
              Post Game
            </Button>
          </div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl opacity-80 hover:opacity-100 transition-all"
            onClick={closePopup}
          >
            ✖
          </button>
        </motion.div>
      </div>
    </>
  )
}

// Coinflip Component
const CoinFlip = () => {
  const [items] = useState([
    { name: "Sword", rarity: "Rare", image: "/placeholder.svg?height=96&width=96" },
    { name: "Shield", rarity: "Common", image: "/placeholder.svg?height=96&width=96" },
    { name: "Gem", rarity: "Epic", image: "/placeholder.svg?height=96&width=96" },
    { name: "Knife", rarity: "Uncommon", image: "/placeholder.svg?height=96&width=96" },
  ])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false)
  const [isGameDetailsPopupOpen, setIsGameDetailsPopupOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)

  const [matches, setMatches] = useState([
    {
      id: 1,
      player1: "devilsservant1",
      avatar1: "/placeholder.svg?height=50&width=50",
      player2: "waiting...",
      avatar2: "",
      items: ["Knife", "Gun"],
      value: "66.00K",
      range: "62.70K - 69.30K",
      choice: "Heads",
    },
    {
      id: 2,
      player1: "shadowblade",
      avatar1: "/placeholder.svg?height=50&width=50",
      player2: "darkrider",
      avatar2: "/placeholder.svg?height=50&width=50",
      items: ["Sword", "Shield"],
      value: "23.88K",
      range: "11.40K - 12.60K",
      choice: "Tails",
      player2Choice: "Heads",
    },
  ])

  const handleItemClick = (itemName: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemName) ? prevSelected.filter((item) => item !== itemName) : [...prevSelected, itemName],
    )
  }

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === items.length ? [] : items.map((item) => item.name))
  }

  const handleFlip = (action: string) => {
    if (action === "post") {
      // Logic to post the coinflip (e.g., save to database, update state, etc.)
      console.log("Game Posted", selectedItems)
    } else {
      console.log(`Coinflip: ${action}`)
    }
  }

  const openHistoryPopup = () => {
    setIsHistoryPopupOpen(true)
  }

  const closeHistoryPopup = () => {
    setIsHistoryPopupOpen(false)
  }

  const openGameDetailsPopup = (game: any) => {
    setSelectedGame(game)
    setIsGameDetailsPopupOpen(true)
  }

  const closeGameDetailsPopup = () => {
    setIsGameDetailsPopupOpen(false)
  }

  const openCreateGamePopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const handleJoinGame = (gameId: number) => {
    console.log(`Join game ${gameId}`)
    // Add logic for joining the game
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 text-white">
      {/* Header Banner */}
      
      <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg shadow-lg mr-4">
              <HandCoins className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
              Coin Flip 
              
            </h1>
            
          </div>
          <div className="flex space-x-3">
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-lg hover:from-pink-600 hover:to-purple-700"
              onClick={openHistoryPopup}
            >
                
              History
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-lg hover:from-pink-600 hover:to-purple-700"
              onClick={openCreateGamePopup}
            >
              Create Game
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Games</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 p-4 rounded-lg flex flex-wrap md:flex-nowrap items-center justify-between shadow-md border border-purple-800/30"
              >
                {/* Player 1 */}
                <div className="flex items-center space-x-3 mb-3 md:mb-0">
                  <Image
                    src={match.avatar1 || "/placeholder.svg"}
                    alt="Avatar 1"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-green-500"
                  />
                  <span className="font-semibold">{match.player1}</span>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2 mb-3 md:mb-0">
                  {match.items.map((item, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`/placeholder.svg?height=30&width=30`}
                        alt={item}
                        className="w-8 h-8 rounded-md border border-purple-500"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-purple-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Value */}
                <div className="text-center mb-3 md:mb-0">
                  <div className="flex items-center justify-center gap-2">
                    {match.choice && (
                      <Image
                        src="/images/heads-coin.png"
                        alt={match.choice}
                        width={24}
                        height={24}
                        className="border border-purple-500 rounded-full"
                      />
                    )}
                    <div className="font-medium">{match.value}</div>
                    {match.player2 !== "waiting..." && match.player2Choice && (
                      <Image
                        src="/images/tails-coin.png"
                        alt={match.player2Choice}
                        width={24}
                        height={24}
                        className="border border-purple-500 rounded-full"
                      />
                    )}
                  </div>
                  <div className="text-xs text-purple-300">{match.range}</div>
                </div>

                {/* Player 2 */}
                <div className="flex items-center space-x-3 mb-3 md:mb-0">
                  {match.player2 !== "waiting..." ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={match.avatar2 || "/placeholder.svg?height=40&width=40"}
                        alt="Avatar 2"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-red-500"
                      />
                      <span className="font-semibold">{match.player2}</span>
                    </div>
                  ) : (
                    <span className="text-purple-300 italic">Waiting for player...</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 w-full md:w-auto justify-center">
                  <Button
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white"
                    onClick={() => openGameDetailsPopup(match)}
                  >
                    View
                  </Button>
                  {match.player2 === "waiting..." && (
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      onClick={() => handleJoinGame(match.id)}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced History Popup */}
      {isHistoryPopupOpen && <HistoryPopup closePopup={closeHistoryPopup} />}

      {/* Simple Game Details Popup */}
      {isGameDetailsPopupOpen && selectedGame && (
        <GameDetailsPopup game={selectedGame} closePopup={closeGameDetailsPopup} />
      )}

      {/* Inventory Popup (Create Game) */}
      {isPopupOpen && (
        <InventoryPopup
          items={items}
          selectedItems={selectedItems}
          handleItemClick={handleItemClick}
          handleSelectAll={handleSelectAll}
          closePopup={closePopup}
          handleFlip={handleFlip}
        />
      )}
      
    </div>
  )
}

export default CoinFlip


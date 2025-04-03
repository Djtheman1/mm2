"use client"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, ArrowUpDown, HandCoins, Eye, Trophy, Clock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../sidebar/sidebar"

// History Popup Component remains unchanged
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
      opponent: "bot1",
      choice: "Heads",
      result: "Heads",
      items: ["Bauble", "Turkey"],
      value: "Unknown",
      date: "March 28, 2025 14:30",
      avatar: "",
    },
    {
      id: 2,
      type: "loss",
      opponent: "bot1",
      choice: "Tails",
      result: "Heads",
      items: ["Harvester", "Evergun"],
      value: "Unknown",
      date: "March 27, 2025 18:45",
      avatar: "",
    },
    {
      id: 3,
      type: "win",
      opponent: "bot1",
      choice: "Heads",
      result: "Heads",
      items: ["Bioblade", "Harvester"],
      value: "Unknown",
      date: "March 26, 2025 09:15",
      avatar: "",
    },
    {
      id: 4,
      type: "loss",
      opponent: "bot1",
      choice: "Tails",
      result: "Heads",
      items: ["Harvester", "Lugar"],
      value: "Unknown",
      date: "March 25, 2025 21:10",
      avatar: "",
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
                            <Image src="/heads.webp" alt={item.choice} width={24} height={24} className="mr-1" />
                            <span className="text-xs text-purple-300">→</span>
                            <Image
                              src="/tails.webp"
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

// Enhanced Game Details Popup
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
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">
            Game Details
          </h2>

          <div className="bg-purple-900/30 p-4 rounded-lg mb-4 border border-purple-700/30 backdrop-blur-sm">
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
                      src="/heads.webp"
                      alt={game.choice}
                      width={30}
                      height={30}
                      className="border border-purple-500 rounded-full shadow-lg"
                    />
                  )}
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">{game.value}</span>
                  {game.player2 !== "waiting..." && game.player2Choice && (
                    <Image
                      src="/tails.webp"
                      alt={game.player2Choice}
                      width={30}
                      height={30}
                      className="border border-purple-500 rounded-full shadow-lg"
                    />
                  )}
                </div>
                <div className="text-xs text-purple-300 mt-1">{game.range}</div>
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
                  <span className="text-purple-300 italic flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Waiting for player...
                  </span>
                )}
              </div>
            </div>

            {/* Game Status Banner */}
            <div className="w-full bg-purple-800/50 p-2 rounded-md mb-4 text-center font-medium">
              {game.player2 === "waiting..." ? (
                <span className="text-yellow-300 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Game Open - Waiting for Opponent
                </span>
              ) : (
                <span className="text-blue-300 flex items-center justify-center">
                  <HandCoins className="w-4 h-4 mr-2" />
                  Game in Progress
                </span>
              )}
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2 text-purple-200">Items at Stake:</h3>
              <div className="flex flex-wrap gap-3 justify-center p-3 bg-purple-900/30 rounded-lg border border-purple-700/20">
                {game.items.map((item: string, idx: number) => (
                  <div key={idx} className="relative group">
                    <div className="w-16 h-16 rounded-md border border-purple-500 p-1 bg-purple-800/30 flex items-center justify-center hover:scale-105 transition-all duration-300 overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=40&width=40`}
                        alt={item}
                        className="w-14 h-14 rounded-md"
                      />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-purple-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      {item}
                    </div>
                    <div className="text-xs mt-1 text-center text-purple-300">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            {game.player2 === "waiting..." ? (
              <div className="text-center">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300">
                  Join Game
                </Button>
              </div>
            ) : (
              <div className="text-center p-2 bg-purple-900/30 rounded-lg text-purple-300">
                Game is in progress with two players
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              className="bg-purple-800 hover:bg-purple-700 text-white px-6" 
              onClick={closePopup}
            >
              Close
            </Button>
          </div>
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

// Inventory Popup Component remains unchanged
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
          className="relative bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-3xl shadow-2xl w-full max-w-4xl transition-all duration-500"
        >
          <h2 className="text-3xl font-semibold mb-4 text-center tracking-wider">
            Select Items & Coinflip
          </h2>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
            onClick={closePopup}
          >
            ✖
          </button>

          {/* Select All Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleSelectAll}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg hover:from-indigo-700 hover:to-purple-700 w-32"
            >
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {/* Grid for Inventory Items - MODIFIED TO MAKE ITEMS SMALLER */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-4">
            {items.map((item: any, index: number) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br from-indigo-900 to-purple-700 p-2 rounded-lg shadow-md transform transition-all duration-300 ${selectedItems.includes(item.name) ? "border-2 border-indigo-500" : ""}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleItemClick(item.name)}
              >
                <div className="w-full h-16 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={item.image || "/placeholder.svg?height=64&width=64"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-semibold mt-1 text-center truncate">{item.name}</p>
                <p className="text-xs text-gray-300 text-center">{item.rarity}</p>
              </motion.div>
            ))}
          </div>
          {/* Decorative Line */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
            <div className="absolute px-4 bg-purple-950 text-purple-200 text-sm font-semibold tracking-wider">
              Choose Your Side
            </div>
          </div>

          {/* Coinflip Picker */}
          <div className="flex justify-center">
            <div className="flex space-x-16">
              <motion.div
                className={`cursor-pointer relative ${selectedCoin === "heads" ? "scale-110 drop-shadow-[0_0_10px_rgba(108,443,226,0.8)]" : ""}`}
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
                  <Image src="/heads.webp" alt="Heads" width={120} height={120} className="drop-shadow-lg" />
                </motion.div>
                <p className="text-center mt-2 font-bold text-white/80">HEADS</p>
              </motion.div>

              <motion.div
                className={`cursor-pointer relative ${selectedCoin === "tails" ? "scale-110 drop-shadow-[0_0_10px_rgba(108,443,226,0.8)]" : ""}`}
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
                  <Image src="/tails.webp" alt="Tails" width={120} height={120} className="drop-shadow-lg" />
                </motion.div>
                <p className="text-center mt-2 font-bold text-white/80">TAILS</p>
              </motion.div>
            </div>
          </div>

          {/* Post Game Button */}
          <div className="flex justify-center mt-8">
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-2 text-lg shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => selectedCoin && handleFlip(selectedCoin)}
              disabled={!selectedCoin || selectedItems.length === 0}
            >
              {selectedItems.length === 0 ? "Select Items to Continue" : "Post Game"}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// Enhanced CoinFlip Component with fixed sidebar layout
const CoinFlip = () => {
  const [items] = useState([
    { name: "Bauble", rarity: "", image: "/mm2_godlies/Bauble.png" },
    { name: "Evergreen", rarity: "", image: "/mm2_godlies/Evergreen.png" },
    { name: "Evergun", rarity: "", image: "/mm2_godlies/Evergun.png" },
    { name: "Turkey", rarity: "", image: "/mm2_godlies/Turkey.png" },
    { name: "VampGun", rarity: "", image: "/mm2_godlies/vampsgun.png" },
    { name: "TravGun", rarity: "", image: "/mm2_godlies/TravGun.png" },
  ])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false)
  const [isGameDetailsPopupOpen, setIsGameDetailsPopupOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("active")

  // Enhanced matches data
  const [matches, setMatches] = useState([
    {
      id: 1,
      player1: "bot1",
      avatar1: "",
      player2: "waiting...",
      avatar2: "",
      items: ["Turkey", "Turkey"],
      value: "Unknown",
      range: "Unknown - Unknown",
      choice: "Heads",
      status: "open",
      timestamp: "5 min ago",
    },
    {
      id: 2,
      player1: "bot1",
      avatar1: "",
      player2: "bot2",
      avatar2: "",
      items: ["Harvester", "Harvester"],
      value: "Unknown",
      range: "Unknown - Unknown",
      choice: "Tails",
      player2Choice: "Heads",
      status: "in_progress",
      timestamp: "2 min ago",
    },
  ])

  // Recent completed games data
  const [recentGames, setRecentGames] = useState([
    {
      id: 101,
      player1: "bot1",
      avatar1: "",
      player2: "bot2",
      avatar2: "",
      items: ["Bioblade", "Harvester"],
      value: "Unknown",
      winnerChoice: "Heads",
      loserChoice: "Tails",
      winner: "player1",
      timestamp: "10 min ago",
    },
    {
      id: 102,
      player1: "bot2",
      avatar1: "",
      player2: "bot3",
      avatar2: "",
      items: ["Ghostblade"],
      value: "Unknown",
      winnerChoice: "Heads",
      loserChoice: "Tails",
      winner: "player2",
      timestamp: "25 min ago",
    },
    {
      id: 103,
      player1: "bot1",
      avatar1: "",
      player2: "bot4",
      avatar2: "",
      items: ["Lugar", "Harvester"],
      value: "Unknown",
      winnerChoice: "Tails",
      loserChoice: "Heads",
      winner: "player1",
      timestamp: "42 min ago",
    },
  ])

  const handleItemClick = (itemName: string) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemName))
    } else {
      setSelectedItems([...selectedItems, itemName])
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.name))
    }
  }

  const handleFlip = (selectedCoin: string) => {
    // Add game to matches with status open
    const newGame = {
      id: Date.now(),
      player1: "bot1", // Would be current user in real app
      avatar1: "",
      player2: "waiting...",
      avatar2: "",
      items: selectedItems,
      value: "Unknown",
      range: "Unknown - Unknown",
      choice: selectedCoin === "heads" ? "Heads" : "Tails",
      status: "open",
      timestamp: "Just now",
    }

    setMatches([newGame, ...matches])
    setSelectedItems([])
    setIsPopupOpen(false)
  }

  const openGameDetails = (game: any) => {
    setSelectedGame(game)
    setIsGameDetailsPopupOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-purple-900/30 backdrop-blur-sm p-4 border-b border-purple-800/50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">
              Coinflip
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsHistoryPopupOpen(true)}
                variant="outline"
                className="border-purple-700 bg-purple-900/50 text-white hover:bg-purple-800"
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                onClick={() => setIsPopupOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-purple-500/20"
              >
                <HandCoins className="h-4 w-4 mr-2" />
                Create Game
              </Button>
            </div>
          </div>
        </header>

        {/* Main content with tabs and games */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-950 to-purple-950/50 p-4">
          {/* Tabs for Active/Recent Games */}
          <Tabs defaultValue="active" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-purple-900/50 text-white">
              <TabsTrigger value="active" className="data-[state=active]:bg-purple-700 text-white">
                Active Games
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-purple-700 text-white">
                Recent Games
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Active Games */}
          {activeTab === "active" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl shadow-lg border border-purple-700/30 overflow-hidden cursor-pointer hover:shadow-purple-500/20 hover:border-purple-600/50 transition-all duration-300"
                    onClick={() => openGameDetails(game)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={game.avatar1 || "/placeholder.svg?height=32&width=32"}
                            alt={game.player1}
                            width={32}
                            height={32}
                            className="rounded-full border border-purple-500"
                          />
                          <span className="font-medium">{game.player1}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Image
                            src={game.choice === "Heads" ? "/heads.webp" : "/tails.webp"}
                            alt={game.choice}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          {game.player2 !== "waiting..." ? (
                            <>
                              <span className="font-medium">{game.player2}</span>
                              <Image
                                src={game.avatar2 || "/placeholder.svg?height=32&width=32"}
                                alt={game.player2}
                                width={32}
                                height={32}
                                className="rounded-full border border-purple-500"
                              />
                            </>
                          ) : (
                            <span className="text-purple-300 italic text-sm">Waiting...</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center my-2 gap-2">
                        {game.items.slice(0, 3).map((item: string, idx: number) => (
                          <div key={idx} className="w-10 h-10 rounded-md bg-purple-800/50 border border-purple-600/50 flex items-center justify-center">
                            <img
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={item}
                              className="w-8 h-8 rounded-sm"
                            />
                          </div>
                        ))}
                        {game.items.length > 3 && (
                          <div className="w-10 h-10 rounded-md bg-purple-800/50 border border-purple-600/50 flex items-center justify-center text-sm">
                            +{game.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="text-center text-sm text-purple-300">{game.value}</div>

                      <div className="mt-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          {game.timestamp}
                        </div>
                        <div>
                          {game.status === "open" ? (
                            <Badge className="bg-green-600/80">Open</Badge>
                          ) : (
                            <Badge className="bg-blue-600/80">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {matches.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <HandCoins className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No active games available</p>
                  <Button 
                    onClick={() => setIsPopupOpen(true)}
                    className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Create a Game
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Recent Games */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentGames.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl shadow-lg border border-purple-700/30 overflow-hidden hover:shadow-purple-500/20 hover:border-purple-600/50 transition-all duration-300"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={game.avatar1 || "/placeholder.svg?height=32&width=32"}
                            alt={game.player1}
                            width={32}
                            height={32}
                            className={`rounded-full border ${game.winner === "player1" ? "border-green-500 shadow-green-500/50" : "border-red-500"}`}
                          />
                          <span className={`font-medium ${game.winner === "player1" ? "text-green-300" : "text-red-300"}`}>{game.player1}</span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Image
                              src={game.winnerChoice === "Heads" ? "/heads.webp" : "/tails.webp"}
                              alt={game.winnerChoice}
                              width={24}
                              height={24}
                              className="rounded-full border border-green-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${game.winner === "player2" ? "text-green-300" : "text-red-300"}`}>{game.player2}</span>
                          <Image
                            src={game.avatar2 || "/placeholder.svg?height=32&width=32"}
                            alt={game.player2}
                            width={32}
                            height={32}
                            className={`rounded-full border ${game.winner === "player2" ? "border-green-500 shadow-green-500/50" : "border-red-500"}`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-center my-2 gap-2">
                        {game.items.slice(0, 3).map((item: string, idx: number) => (
                          <div key={idx} className="w-10 h-10 rounded-md bg-purple-800/50 border border-purple-600/50 flex items-center justify-center">
                            <img
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={item}
                              className="w-8 h-8 rounded-sm"
                            />
                          </div>
                        ))}
                        {game.items.length > 3 && (
                          <div className="w-10 h-10 rounded-md bg-purple-800/50 border border-purple-600/50 flex items-center justify-center text-sm">
                            +{game.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="text-center text-sm text-purple-300">{game.value}</div>

                      <div className="mt-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          {game.timestamp}
                        </div>
                        <div>
                          <Badge className={`${game.winner === "player1" ? "bg-indigo-600/80" : "bg-purple-600/80"}`}>
                            {game.winner === "player1" ? game.player1 : game.player2} Won
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {recentGames.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent games to display</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Popups */}
      {isPopupOpen && (
        <InventoryPopup
          items={items}
          selectedItems={selectedItems}
          handleItemClick={handleItemClick}
          handleSelectAll={handleSelectAll}
          closePopup={() => setIsPopupOpen(false)}
          handleFlip={handleFlip}
        />
      )}

      {isHistoryPopupOpen && <HistoryPopup closePopup={() => setIsHistoryPopupOpen(false)} />}

      {isGameDetailsPopupOpen && selectedGame && (
        <GameDetailsPopup game={selectedGame} closePopup={() => setIsGameDetailsPopupOpen(false)} />
      )}
    </div>
  )
}

export default CoinFlip
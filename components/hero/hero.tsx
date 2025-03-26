"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Wallet Popup State
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // Notification visibility
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Sample MM2 Items
  const items = [
    { name: "Bauble", rarity: "Bauble", image: "/mm2_godlies/Bauble.png" },
    { name: "Evergreen", rarity: "Evergreen", image: "/mm2_godlies/Evergreen.png" },
    { name: "Evergun", rarity: "Evergun", image: "/mm2_godlies/Evergun.png" },
  ];

  // Handle item selection
  const handleItemClick = (itemName: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemName)
        ? prevSelectedItems.filter((item) => item !== itemName)
        : [...prevSelectedItems, itemName]
    );
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(items.map(item => item.name)); // Select all
    }
  };

  // Handle Withdraw
  const handleWithdraw = () => {
    if (selectedItems.length === 0) {
      setShowNotification(true); // Show the notification if no item is selected
      setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
      return;
    }
    const robloxGameURL = `https://robloxlinkwithdraw.com?items=${selectedItems.join(",")}`;
    window.open(robloxGameURL, "_blank");
  };

  // Handle Close Wallet Popup
  const closeWalletPopup = () => {
    setIsWalletOpen(false);
  };

  function handleRedirect(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-2/5 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent leading-tight">
              Welcome to MM2 Amethyst
            </h1>
            <p className="text-xl mb-8 text-purple-200 max-w-2xl">
              MM2 Amethyst is your premier platform for flipping Murder Mystery
              2 items. Experience secure transactions, real-time market data,
              and a vibrant community of players.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={() => setIsWalletOpen(true)} // Open Wallet Popup
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none shadow-lg shadow-pink-600/25 transition-all duration-200 group"
              >
                Deposit/Withdraw
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <Image
                src="/gem.png"
                alt="MM2 Amethyst Gem"
                width={450}
                height={450}
                className="animate-float"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wallet Popup */}
      {isWalletOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-3xl shadow-2xl w-[42rem] max-w-full sm:w-[40rem] lg:w-[45rem] transition-all duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold mb-4 text-center tracking-wider">
              Your Inventory
            </h2>

            {/* Decorative Line */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-full h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
              <div className="absolute px-4 bg-purple-950 text-purple-200 text-sm font-semibold tracking-wider">
                Trade with Bot (MM2_Amethyst)
              </div>
            </div>

            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
              onClick={closeWalletPopup}
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

            {/* Grid for Inventory Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 pr-10">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br from-indigo-900 to-purple-700 p-3 rounded-lg shadow-md transform transition-all duration-300 ${selectedItems.includes(item.name) ? "border-4 border-indigo-500" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleItemClick(item.name)}
                >
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold mt-2 text-center">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-300 text-center">
                    {item.rarity}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Decorative Line */}
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
            </div>

            {/* Buttons for Withdraw and Deposit */}
            <div className="flex justify-center gap-6 mb-6">
              <Button
                onClick={handleWithdraw}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-lg hover:from-pink-600 hover:to-purple-700 w-32"
              >
                Withdraw
              </Button>
              <div className="relative w-16">
                <Image
                  src="/gem-logo.png"
                  alt="Gem Logo"
                  layout="fill"
                  objectFit="contain"
                  className="absolute top-0 left-0 drop-shadow-md"
                />
              </div>
              <Button
                onClick={() => handleRedirect("deposit")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-lg hover:from-pink-600 hover:to-purple-700 w-32"
              >
                Deposit
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Message for No Items Selected */}
      {showNotification && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm">
          <p>You must select at least one item before you can withdraw.</p>
        </div>
      )}
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WalletPopup } from "../inventory/inventory"; // Import your WalletPopup component

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

      {/* Wallet Popup Component */}
      {isWalletOpen && (
        <WalletPopup
          items={items}
          selectedItems={selectedItems}
          handleItemClick={handleItemClick}
          handleSelectAll={handleSelectAll}
          handleWithdraw={handleWithdraw}
          handleRedirect={handleRedirect}
          closeWalletPopup={closeWalletPopup}
        />
      )}
    </section>
  );
}

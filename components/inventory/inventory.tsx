"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WalletPopupProps {
  items: { name: string; rarity: string; image: string }[];
  selectedItems: string[];
  handleItemClick: (itemName: string) => void;
  handleSelectAll: () => void;
  handleWithdraw: () => void;
  handleDeposit: () => void;
  handleRedirect: (type: string) => void;
  closeWalletPopup: () => void;
}

export function WalletPopup({
  items,
  selectedItems,
  handleItemClick,
  handleSelectAll,
  handleWithdraw,
  closeWalletPopup,
}: WalletPopupProps) {
  const [showWithdrawNotification, setShowWithdrawNotification] = useState(false);

  // Show notification when no items are selected for withdrawal
  const handleWithdrawWithCheck = () => {
    if (selectedItems.length === 0) {
      setShowWithdrawNotification(true);
      setTimeout(() => setShowWithdrawNotification(false), 5000); // Hide after 5 seconds
      return;
    }
    handleWithdraw();
  };

  // Handle deposit (redirect to Roblox game URL)
  const handleDepositWithCheck = () => {
    // Redirect to the Roblox game URL for deposits, no need to check if items are selected
    const robloxGameUrl = "https://www.roblox.com/games/YOUR_GAME_ID"; // Replace with the actual game URL
    window.location.href = robloxGameUrl;
  };

  return (
    <>
      {/* Wallet Popup */}
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
                <p className="text-sm font-semibold mt-2 text-center">{item.name}</p>
                <p className="text-xs text-gray-300 text-center">{item.rarity}</p>
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
              onClick={handleWithdrawWithCheck}
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
              onClick={handleDepositWithCheck}  // Handle deposit and redirect
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-lg hover:from-pink-600 hover:to-purple-700 w-32"
            >
              Deposit
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Notification Message for No Items Selected (only for withdraw) */}
      {showWithdrawNotification && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm">
          <p>You must select at least one item before you can withdraw.</p>
        </div>
      )}
    </>
  );
}

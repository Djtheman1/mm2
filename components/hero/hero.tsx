"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WalletPopup } from "../inventory/inventory";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // State for Wallet Popup
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Handlers for WalletPopup
  const closeWalletPopup = () => setIsWalletOpen(false);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-2/5 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Section */}
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
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <img
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
          userId="12345" // Replace with actual user ID
          secret="85cb71959ba5a2df742a2b02a8fda42f75d484b495768da3a4dd9c8f5093cf1c" // Replace with actual secret
          closeWalletPopup={closeWalletPopup}
          items={[]} // Pass items dynamically if needed
          selectedItems={[]} // Pass selected items dynamically if needed
          handleItemClick={() => {}} // Replace with actual handler
          handleSelectAll={() => {}} // Replace with actual handler
          handleWithdraw={() => {}} // Replace with actual handler
          handleDeposit={() => {}} // Replace with actual handler
        />
      )}
    </section>
  );
}

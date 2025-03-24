"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
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
              MM2 Amethyst is your premier platform for trading Murder Mystery 2
              items. Experience secure transactions, real-time market data, and
              a vibrant community of traders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none shadow-lg shadow-pink-600/25 transition-all duration-200 group">
                Start Trading
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30 hover:text-white"
              >
                Learn More
              </Button>
            </div>

            <div className="relative">
              <Input
                placeholder="Search for items, users, or collections..."
                className="bg-purple-900/50 border-purple-700/30 text-purple-100 placeholder-purple-400/50 pl-10 py-6"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
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
                width={500}
                height={500}
                className="animate-float"
              />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500/30 to-purple-600/30 w-[300px] h-[30px] blur-xl rounded-full"></div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center mt-16 gap-8 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            "10,000+ Users",
            "50,000+ Trades",
            "99.9% Secure",
            "24/7 Support",
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl font-bold text-purple-100">{stat}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

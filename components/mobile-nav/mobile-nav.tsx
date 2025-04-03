"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home,
  HandCoins,
  Trophy,
  ShipWheel,
  HelpCircle,
  FileText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "CoinFlip", href: "/coinflip", icon: HandCoins },
  { name: "Leaderboard", href: "/lead", icon: Trophy },
  { name: "Jackpot", href: "/jackpot", icon: ShipWheel },
  { name: "Privacy Policy", href: "/privacy", icon: HelpCircle },
  { name: "Terms of Service", href: "/terms", icon: FileText },
];

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-950/90 backdrop-blur-md border-t border-purple-700/30 z-40 lg:hidden">
      <div className="flex justify-around items-center h-16">
        <TooltipProvider delayDuration={0}>
          {navigation.map((tab, index) => (
            <motion.div
              key={tab.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={tab.href}
                    className="flex items-center justify-center p-3 text-sm font-medium text-purple-200 hover:bg-purple-800/40 hover:text-white group transition-all duration-200"
                  >
                    <tab.icon className="h-6 w-6 text-pink-400 group-hover:text-pink-300 transition-colors duration-200" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-purple-900 border-purple-700/50 text-purple-100">
                  {tab.name}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}

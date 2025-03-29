"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Home,
  Trophy,
  HandCoins,
  HelpCircle,
  FileText,
  Settings,
  ShipWheel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "CoinFlip", href: "/coinflip", icon: HandCoins },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Jackpot", href: "/jackpot", icon: ShipWheel },
  { name: "Privacy Policy", href: "/privacy", icon: HelpCircle },
  { name: "Terms of Service", href: "/terms", icon: FileText },

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // get username from local storage
  const username = localStorage.getItem("username");

  return (
    <div
      className={cn(
        "bg-purple-950/80 backdrop-blur-md border-r border-purple-700/30 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 py-6">
        <div className="px-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-purple-300 hover:text-purple-100 hover:bg-purple-800/40"
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed && <span>Collapse Menu</span>}
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
          {!collapsed ? (
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center justify-center w-fuck-you h-fuck-you bg-purple-800/40 rounded-full p-4">
                  <Image
                    src={localStorage.getItem("picture") || "/gem.png"}
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
                <h2 className="mt-2 text-white">{username}</h2>
              </div>
            </div>

          ) : (
            <></>
          )}
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1 px-2 mt-5">
              {navigation.map((item, index) => (
                <div key={item.name}>
                  {" "}
                  {collapsed ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-center p-3 text-sm font-medium rounded-md text-purple-200 hover:bg-purple-800/40 hover:text-white group transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5 text-pink-400 flex-shrink-0 group-hover:text-pink-300 transition-colors duration-200" />
                    </Link>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >

                      <Link
                        href={item.href}
                        className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-purple-200 hover:bg-purple-800/40 hover:text-white group transition-all duration-200"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors duration-200" />
                        {item.name}
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

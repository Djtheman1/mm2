"use client";

import Link from "next/link";
import { Home, ShoppingCart, BarChart2, User, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "market", label: "Market", icon: ShoppingCart, href: "/marketplace" },
    { id: "trading", label: "Trading", icon: BarChart2, href: "/trading" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-purple-950/90 backdrop-blur-md border-t border-purple-700/30 z-40 lg:hidden">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center justify-center w-full h-full"
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="relative">
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-pink-500/20 rounded-full -m-1"
                    style={{
                      width: "calc(100% + 8px)",
                      height: "calc(100% + 8px)",
                    }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <tab.icon
                  className={`h-5 w-5 ${
                    activeTab === tab.id ? "text-pink-400" : "text-purple-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 ${
                  activeTab === tab.id ? "text-pink-400" : "text-purple-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          ))}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center w-full h-full rounded-none"
              >
                <Menu className="h-5 w-5 text-purple-400" />
                <span className="text-xs mt-1 text-purple-400">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-purple-950/95 backdrop-blur-md border-purple-700/30 p-0">
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-purple-700/30">
                  <h2 className="text-xl font-bold text-purple-100">
                    MM2 Amethyst
                  </h2>
                  <p className="text-sm text-purple-300">
                    Next Generation Trading
                  </p>
                </div>
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    {[
                      { name: "Home", href: "/" },
                      { name: "Marketplace", href: "/marketplace" },
                      { name: "Trading", href: "/trading" },
                      { name: "Leaderboard", href: "/leaderboard" },
                      { name: "Jackpot", href: "/jackpot" },
                      { name: "Community", href: "/community" },
                      { name: "Events", href: "/events" },
                      { name: "FAQ", href: "/faq" },
                      { name: "Terms of Service", href: "/terms" },
                      { name: "Settings", href: "/settings" },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="block py-2 text-purple-200 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-6 border-t border-purple-700/30">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

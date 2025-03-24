"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Trophy,
  Diamond,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  BarChart2,
  Users,
  Zap,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { name: "Trading", href: "/trading", icon: BarChart2 },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Jackpot", href: "/jackpot", icon: Diamond },
  { name: "Community", href: "/community", icon: Users },
  { name: "Events", href: "/events", icon: Zap },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Terms of Service", href: "/terms", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
        </div>
        <TooltipProvider delayDuration={0}>
          <nav className="space-y-1 px-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className="flex items-center justify-center p-3 text-sm font-medium rounded-md text-purple-200 hover:bg-purple-800/40 hover:text-white group transition-all duration-200"
                      >
                        <item.icon className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors duration-200" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-purple-900 border-purple-700/50 text-purple-100"
                    >
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-purple-200 hover:bg-purple-800/40 hover:text-white group transition-all duration-200"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors duration-200" />
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>
        </TooltipProvider>
      </div>

      <div className="p-4 border-t border-purple-700/30">
        {!collapsed && (
          <div className="bg-purple-800/20 rounded-lg p-3 border border-purple-700/30">
            <h3 className="text-sm font-medium text-purple-100 mb-2">
              Premium Membership
            </h3>
            <p className="text-xs text-purple-300 mb-3">
              Unlock exclusive features and benefits
            </p>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Smile, Send, ChevronRight, MessageSquare, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as Popover from "@radix-ui/react-popover";

// Initialize Socket.IO client
const socket = io();

// Emojis for quick selection
const EMOJIS = ["😊", "😂", "❤️", "👍", "🔥", "✨", "🎮", "🎯", "🎲", "🎁", "💎", "🔪", "🔫"];

export function Chat() {
  const [messages, setMessages] = useState<{ user: string; text: string; timestamp: Date }[]>([]);
"use client";

import type React from "react";

import * as Popover from "@radix-ui/react-popover";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Smile,
  Send,
  ChevronRight,
  MessageSquare,
  X,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const EMOJIS = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🔥",
  "✨",
  "🎮",
  "🎯",
  "🎲",
  "🎁",
  "💎",
  "🔪",
  "🔫",
];

export function Chat() {
  const [messages, setMessages] = useState<
    { user: string; text: string; timestamp: Date }[]
  >([
    {
      user: "System",
      text: "Welcome to MM2 Amethyst chat! Please be respectful to other users.",
      timestamp: new Date(),
    },
    {
      user: "JohnDoe",
      text: "Hey everyone! Anyone trading a Chroma Darkbringer?",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      user: "TradeMaster",
      text: "I have one, what's your offer?",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isFullyCollapsed, setIsFullyCollapsed] = useState(false);
  const [userCount, setUserCount] = useState(42); // Initial user count
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle incoming messages and scroll to the bottom when new message arrives
  useEffect(() => {
    socket.on("receiveMessage", (message: { user: string; text: string; timestamp: any }) => {
      // Ensure the timestamp is a valid Date object
      const newMessage = {
        ...message,
        timestamp: new Date(message.timestamp), // Convert timestamp to Date object
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAnimationComplete = () => {
    if (!isChatVisible) {
      setIsFullyCollapsed(true);
    } else {
      setIsFullyCollapsed(false);
    }
  };

  // Handle message submission
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const message = { user: "User123"/*<--CHANGE THIS WHEN LOCALSTORAGE SETUP */, text: input, timestamp: new Date() };
      socket.emit("sendMessage", message); // Send message to server
      setInput(""); // Clear input
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate chat width based on screen size
  const getChatWidth = () => {
    if (isMobile) {
      return "70vw"; // Adjust width for mobile
    }
    return "300px"; // Adjust width for desktop
  };

  return (
    <>
      {/* Toggle button that appears when chat is collapsed */}
      <AnimatePresence>
        {isFullyCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50"
          >
            <Button
              onClick={() => setIsChatVisible(true)}
              className="rounded-full h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-purple-700 text-white shadow-lg"
              size="icon"
              aria-label="Open chat"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: isChatVisible ? 0 : `calc(100% + 20px)`,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed top-0 right-0 h-full z-40"
        style={{ width: getChatWidth() }}
      >
        <div className="h-full flex flex-col">
          {isMobile && isChatVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsChatVisible(false)}
            />
          )}

          {/* Chat container */}
          <div className="h-full flex flex-col relative z-40">
            <Card className="border-l border-t border-b border-purple-700/30 border-r-0 bg-gradient-to-br from-purple-950/95 to-purple-900/95 backdrop-blur-md shadow-xl flex flex-col h-full rounded-r-none rounded-l-lg">
              {/* Chat header */}
              <div className="p-3 border-b border-purple-700/30 flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-purple-100 flex items-center text-sm">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    MM2 Chat
                  </h2>

                  {/* User count */}
                  <motion.div
                    className="flex items-center mt-0.5 text-xs text-purple-300"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Users className="h-3 w-3 mr-1 text-pink-400" />
                    <motion.div
                      key={userCount}
                      initial={{ scale: 1.2, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      <span className="font-medium text-pink-400">
                        {userCount}
                      </span>
                      <span className="ml-1">online</span>
                    </motion.div>
                  </motion.div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
                  onClick={() => setIsChatVisible(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat messages */}
              <ScrollArea className="flex-1 p-3" ref={scrollRef}>
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium text-pink-400">
                          {msg.user}
                        </p>
                        <span className="text-xs text-purple-400">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs bg-purple-800/40 p-2 rounded-md text-purple-100 border border-purple-700/30">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message input */}
              <form
                onSubmit={sendMessage}
                className="p-3 border-t border-purple-700/30 mt-auto"
              >
                <div className="flex space-x-1.5">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-purple-300 hover:text-purple-100 bg-purple-800/30 hover:bg-purple-800/50"
                        aria-label="Open emoji picker"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content className="w-auto p-2 bg-purple-900 border-purple-700/50 rounded-md shadow-lg">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="text-lg hover:bg-purple-800/50 p-1 rounded"
                            onClick={() => addEmoji(emoji)}
                            aria-label={`Add ${emoji} emoji`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Root>

                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-purple-800/30 border-purple-700/30 text-purple-100 placeholder-purple-400/50 text-xs h-8"
                    aria-label="Message input"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white transition-all duration-200"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Fixed toggle button at the bottom right */}
      {isChatVisible && !isFullyCollapsed && (
        <div className="fixed bottom-20 right-6 z-50">
          <Button
            onClick={() => setIsChatVisible(false)}
            className="rounded-full h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-purple-700 text-white shadow-lg flex items-center justify-center"
            aria-label="Minimize chat"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}

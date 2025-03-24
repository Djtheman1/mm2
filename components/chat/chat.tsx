"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { UsersOnline } from "@/components/users-online/users-online";
import { Smile, Send, X, Minimize, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([
        ...messages,
        { user: "User123", text: input, timestamp: new Date() },
      ]);
      setInput("");
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card
          className={`border-purple-700/30 bg-purple-950/80 backdrop-blur-md shadow-xl flex flex-col transition-all duration-300 ${
            minimized ? "w-64 h-12" : "w-80 h-[500px]"
          }`}
        >
          <div className="p-3 border-b border-purple-700/30 flex justify-between items-center">
            <h2 className="font-semibold text-purple-100 flex items-center">
              Chat
              {!minimized && <UsersOnline />}
            </h2>
            <div className="flex items-center space-x-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-purple-300 hover:text-purple-100"
                onClick={() => setMinimized(!minimized)}
              >
                {minimized ? (
                  <Maximize className="h-3 w-3" />
                ) : (
                  <Minimize className="h-3 w-3" />
                )}
              </Button>
              {!minimized && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-purple-300 hover:text-purple-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {!minimized && (
            <>
              <Tabs
                defaultValue="global"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full bg-purple-900/30 border-b border-purple-700/30 rounded-none">
                  <TabsTrigger
                    value="global"
                    className="flex-1 data-[state=active]:bg-purple-800/40"
                  >
                    Global
                  </TabsTrigger>
                  <TabsTrigger
                    value="trade"
                    className="flex-1 data-[state=active]:bg-purple-800/40"
                  >
                    Trade
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="flex-1 data-[state=active]:bg-purple-800/40"
                  >
                    Private
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="global"
                  className="m-0 p-0 flex-1 flex flex-col"
                >
                  <ScrollArea className="flex-1 p-3" ref={scrollRef}>
                    <div className="space-y-3">
                      {messages.map((msg, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-pink-400">
                              {msg.user}
                            </p>
                            <span className="text-xs text-purple-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm bg-purple-800/30 p-2 rounded-md text-purple-100 border border-purple-700/30">
                            {msg.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <form
                    onSubmit={sendMessage}
                    className="p-3 border-t border-purple-700/30"
                  >
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-purple-300 hover:text-purple-100 bg-purple-800/30 hover:bg-purple-800/50"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2 bg-purple-900 border-purple-700/50">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                className="text-lg hover:bg-purple-800/50 p-1 rounded"
                                onClick={() => addEmoji(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-purple-800/30 border-purple-700/30 text-purple-100 placeholder-purple-400/50"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-pink-600 hover:bg-pink-700 text-white transition-all duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent
                  value="trade"
                  className="m-0 p-0 flex-1 flex flex-col"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-purple-300 text-sm">
                      Trade chat coming soon
                    </p>
                  </div>
                </TabsContent>
                <TabsContent
                  value="private"
                  className="m-0 p-0 flex-1 flex flex-col"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-purple-300 text-sm">
                      Private messages coming soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

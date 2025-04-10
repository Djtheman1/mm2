import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, MessageSquare, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

// Initialize Socket.IO client
const socket = io("http://localhost:3000");

export function Chat() {
  const [messages, setMessages] = useState<{ user: string; text: string; timestamp: Date }[]>([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isFullyCollapsed, setIsFullyCollapsed] = useState(false);
  const [userCount, setUserCount] = useState(0); // Initialize with 0
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const username = localStorage.getItem("username") || "Anonymous";

  // Load persisted messages from the server
  useEffect(() => {
    // Request the last 50 messages when the component mounts
    socket.emit("loadMessages");

    // Listen for the "loadMessages" event from the server
    socket.on("loadMessages", (loadedMessages) => {
      const formattedMessages = loadedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp), // Ensure timestamp is a Date object
      }));
      setMessages(formattedMessages); // Update state with messages from the server
    });

    return () => {
      socket.off("loadMessages");
    };
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message: { user: string; text: string; timestamp: any }) => {
      const newMessage = {
        ...message,
        timestamp: new Date(message.timestamp), // Ensure timestamp is a Date object
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Listen for user count updates
  useEffect(() => {
    socket.on("userCount", (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.off("userCount");
    };
  }, []);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAnimationComplete = () => {
    setIsFullyCollapsed(!isChatVisible);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const message = { user: username, text: input, timestamp: new Date() };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getChatWidth = () => (isMobile ? "70vw" : "300px");

  return (
    <>
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

          <div className="h-full flex flex-col relative z-40">
            <Card className="border-l border-t border-b border-purple-700/30 border-r-0 bg-gradient-to-br from-purple-950/95 to-purple-900/95 backdrop-blur-md shadow-xl flex flex-col h-full rounded-r-none rounded-l-lg">
              <div className="p-3 border-b border-purple-700/30 flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-purple-100 flex items-center text-sm">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Chat
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
                      <span className="font-medium text-pink-400">{userCount}</span>
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

              <ScrollArea className="flex-1 p-3" ref={scrollRef}>
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium text-pink-400">{msg.user}</p>
                        <span className="text-xs text-purple-400">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-xs bg-purple-800/40 p-2 rounded-md text-purple-100 border border-purple-700/30">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={sendMessage} className="p-3 border-t border-purple-700/30 mt-auto">
                <div className="flex space-x-1.5">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-purple-800/30 border-purple-700/30 text-purple-100 placeholder-purple-400/50 text-xs h-8"
                    aria-label="Message input"
                  />
                  <Button type="submit" size="icon" className="h-8 w-8 bg-gradient-to-r from-pink-600 to-purple-600">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
}

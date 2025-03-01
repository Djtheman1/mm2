"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FloatingCrystal } from "@/components/floating-crystal"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", { username, bio, agreed })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Floating Crystals */}
      <FloatingCrystal size={30} left="5%" top="10%" duration={15} delay={0} />
      <FloatingCrystal size={40} right="10%" top="15%" duration={18} delay={1} />
      <FloatingCrystal size={25} left="15%" bottom="20%" duration={20} delay={2} />
      <FloatingCrystal size={35} right="15%" bottom="25%" duration={17} delay={3} />
      <FloatingCrystal size={45} left="50%" top="5%" duration={19} delay={4} />
      <FloatingCrystal size={20} right="5%" top="50%" duration={16} delay={5} />

      <div className="container relative mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mm2ameth%20logo-onc1clrTnI6sV88T7EMuskZUoGUtoV.png"
              alt="MM2 Amethyst Logo"
              width={300}
              height={120}
              priority
              className="mx-auto h-auto w-auto"
            />
          </motion.div>
        </header>

        <main className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-xl bg-black/60 p-8 shadow-[0_0_15px_rgba(147,51,234,0.3)] backdrop-blur-sm"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-transparent opacity-50" />

            <div className="relative">
              <h1 className="mb-6 text-center text-3xl font-bold text-white">Create Your Account</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Roblox Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-purple-600 bg-black/50 text-white placeholder:text-gray-400"
                    placeholder="Enter your Roblox username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Bio (Copy the provided prompt into your Roblox bio)
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="border-purple-600 bg-black/50 text-white placeholder:text-gray-400"
                    placeholder="Enter your bio"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="border-purple-600 data-[state=checked]:bg-purple-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-900 to-purple-600 text-white transition-all hover:from-purple-800 hover:to-purple-500"
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </motion.div>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-purple-400">
              Terms and Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-purple-400">
              Privacy Policy
            </Link>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}


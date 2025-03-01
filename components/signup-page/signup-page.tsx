"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { FloatingCrystal } from "@/components/floating-crystal"

export default function SignUpPage() {
  const [bioText] = useState("I verify that this is my MM2 Amethyst account")
  const [copied, setCopied] = useState(false)

  const copyBioText = () => {
    navigator.clipboard.writeText(bioText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-[300px]" // Increased from 200px to 300px
        >
          {/* <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mm2ameth%20logo-VoAzqTu673RsahvGnNPAA5wAWihVCs.png"
            alt="MM2 Amethyst Logo"
            width={300} // Increased from 200 to 300
            height={120} // Increased proportionally
            priority
            className="h-auto w-full"
          /> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full max-w-md rounded-xl bg-black/60 p-6 shadow-[0_0_15px_rgba(147,51,234,0.3)] backdrop-blur-sm"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-transparent opacity-50"></div>

          <div className="relative">
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Create Your Account</h1>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Roblox Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your Roblox username"
                  className="border-purple-600 bg-black/50 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Verification Bio</Label>
                <div className="rounded-lg border border-purple-600 bg-black/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-300">{bioText}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={copyBioText}
                      className="h-8 w-8 hover:bg-purple-900/50"
                    >
                      <CopyIcon className={copied ? "text-green-500" : "text-purple-500"} size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Copy this text and paste it in your Roblox profile bio</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" className="border-purple-600 data-[state=checked]:bg-purple-600" />
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

              <Button className="w-full bg-gradient-to-r from-purple-900 to-purple-600 text-white hover:from-purple-800 hover:to-purple-500">
                Sign Up
              </Button>
            </form>
          </div>
        </motion.div>

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


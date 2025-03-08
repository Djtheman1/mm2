"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingCrystal } from "@/components/floating-crystal";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black text-white p-8">
      {/* Floating Crystals */}
      <FloatingCrystal size={30} left="5%" top="10%" duration={15} delay={0} />
      <FloatingCrystal size={40} right="10%" top="15%" duration={18} delay={1} />
      <FloatingCrystal size={25} left="15%" bottom="20%" duration={20} delay={2} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-3xl mx-auto p-6 bg-black/60 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] backdrop-blur-sm"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
        <p>Welcome to MM2 Amethyst. By using our service, you agree to the following terms:</p>
        
        <h2 className="text-xl font-semibold mt-6">Age Requirement</h2>
        <p>You must be at least 18 years old to use MM2 Amethyst. If you are under 18, discontinue using the Service immediately.</p>
        
        <h2 className="text-xl font-semibold mt-6">Account Registration</h2>
        <p>To access the Service, you must create an account. You are responsible for maintaining its accuracy and confidentiality. MM2 Amethyst is not liable for unauthorized access to your account.</p>
        
        <h2 className="text-xl font-semibold mt-6">Game Rules</h2>
        <p>MM2 Amethyst provides an entertainment service based on fandom. Games do not involve real-money transactions. Failure to comply with the rules may result in penalties, including account suspension.</p>
        
        <h2 className="text-xl font-semibold mt-6">Deposits and Withdrawals</h2>
        <p>Deposits and withdrawals are subject to availability. MM2 Amethyst is not responsible for missing transactions due to technical issues or user errors.</p>
        
        <h2 className="text-xl font-semibold mt-6">Blacklisting and Moderation</h2>
        <p>MM2 Amethyst reserves the right to blacklist or suspend accounts that violate the rules or attempt fraudulent activities. Moderators have full authority to enforce site regulations.</p>
        
        <h2 className="text-xl font-semibold mt-6">Fair Use and Cheating</h2>
        <p>Any manipulation of the system, including using bots or third-party software, is strictly prohibited and will result in immediate account termination.</p>
        
        <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
        <p>Your use of the Service is at your own risk. MM2 Amethyst is not liable for any losses, interruptions, or inaccuracies related to fictional currency.</p>
        
        <h2 className="text-xl font-semibold mt-6">Changes to Terms</h2>
        <p>MM2 Amethyst reserves the right to modify these Terms at any time without prior notice. Continued use of the Service implies acceptance of updated Terms.</p>
        
        <p className="mt-4">For more details, review our <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>.</p>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300 underline">Return to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
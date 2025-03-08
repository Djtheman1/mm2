"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingCrystal } from "@/components/floating-crystal";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
          <p>At MM2 Amethyst, we value your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
          
          <h2 className="text-xl font-semibold mt-6">Information Collection</h2>
          <p>We collect information such as usernames and site stats to provide access to our services. Your data is used solely for account management and support purposes.</p>
          
          <h2 className="text-xl font-semibold mt-6">Data Protection</h2>
          <p>We implement security measures to protect your personal information. However, MM2 Amethyst is not liable for data breaches beyond our control.</p>
          
          <h2 className="text-xl font-semibold mt-6">Cookies and Tracking</h2>
          <p>We use cookies to improve your browsing experience. You can disable cookies in your browser settings, but some features may not function properly.</p>
          
          <h2 className="text-xl font-semibold mt-6">Third-Party Services</h2>
          <p>We do not sell or share your personal data with third parties. However, we may use third-party services for analytics and site performance.</p>
          
          <h2 className="text-xl font-semibold mt-6">User Rights</h2>
          <p>You have the right to request access to or deletion of your personal data. Contact our support team for assistance.</p>
          
          <h2 className="text-xl font-semibold mt-6">Policy Updates</h2>
          <p>We reserve the right to update this Privacy Policy at any time. Continued use of our services constitutes acceptance of any changes.</p>
          
          <p className="mt-4">Read our <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms and Conditions</Link> for more details.</p>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 underline">Return to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  
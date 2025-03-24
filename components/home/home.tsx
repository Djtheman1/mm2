"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Hero } from "@/components/hero/hero";
import { IntroAnimation } from "@/components/intro-animation/intro-animation";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if the animation has been shown before
    const animationShown = localStorage.getItem("animationShown");
    if (animationShown) {
      setShowAnimation(false);
    }

    // Set loaded state after a short delay to allow for smooth transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    // Set a flag in localStorage to indicate the animation has been shown
    localStorage.setItem("animationShown", "true");
  };

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {showAnimation && (
        <IntroAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      <Layout>
        <Hero />
      </Layout>
    </>
  );
}

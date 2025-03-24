"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function IntroAnimation({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 1000);
    const timer2 = setTimeout(() => setAnimationPhase(2), 3000);
    const timer3 = setTimeout(() => {
      setAnimationPhase(3);
      onAnimationComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 bg-purple-950 z-50 flex items-center justify-center">
      <div
        className={`transition-all duration-1000 ease-in-out transform
        ${animationPhase >= 1 ? "scale-150" : "scale-100"}
        ${animationPhase >= 2 ? "scale-200" : ""}
        ${animationPhase === 3 ? "opacity-0" : "opacity-100"}`}
      >
        <div
          className={`relative w-64 h-64 transition-all duration-1000
          ${animationPhase >= 1 ? "animate-pulse" : ""}`}
        >
          <Image
            src="/gem.png"
            alt="MM2 Amethyst Gem"
            layout="fill"
            objectFit="contain"
            className="z-10"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full filter blur-3xl transition-opacity duration-1000
            ${animationPhase >= 1 ? "opacity-50" : "opacity-0"}`}
          />
        </div>
      </div>
    </div>
  );
}

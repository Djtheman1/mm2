"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function CrystalAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 800);
    const timer2 = setTimeout(() => setPhase(2), 1600);
    const timer3 = setTimeout(() => setPhase(3), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-purple-950 z-50">
      <div
        className={`relative transition-all duration-800 ease-out transform
        ${phase === 0 ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        ${phase === 2 ? "scale-110" : ""}
        ${phase === 3 ? "scale-100" : ""}`}
      >
        <div className="relative w-64 h-64">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg blur-2xl transition-opacity duration-500
            ${phase === 0 ? "opacity-0" : "opacity-50"}
            ${phase === 2 ? "opacity-75 scale-110" : ""}
            ${phase === 3 ? "opacity-0" : ""}`}
          />
          <Image
            src="/gem.png"
            alt="Crystal"
            fill
            className={`object-contain relative z-10 transition-transform duration-1000
              ${phase >= 1 ? "animate-pulse-subtle" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

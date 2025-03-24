"use client";

import { motion } from "framer-motion";

interface GradientBlobProps {
  className?: string;
  colors?: string[];
}

export function GradientBlob({
  className,
  colors = ["#4facfe", "#00f2fe"],
}: GradientBlobProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id={`gradient-${colors.join("-")}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <path
          fill={`url(#gradient-${colors.join("-")})`}
          d="M40.8,-62.5C52.5,-56.5,61.3,-44.3,67.7,-30.8C74.1,-17.3,78.1,-2.5,75.5,11.1C72.9,24.7,63.8,37.1,52.4,45.6C41,54.1,27.3,58.7,13.3,62.2C-0.7,65.7,-15,68.1,-28.9,65.2C-42.8,62.3,-56.3,54.1,-64.4,42C-72.5,29.9,-75.2,14.9,-73.1,1.2C-71,-12.5,-64.1,-25,-55.6,-35.2C-47.1,-45.4,-37,-53.3,-25.9,-59.2C-14.8,-65.1,-2.7,-69,9.9,-68.9C22.5,-68.8,29.1,-68.5,40.8,-62.5Z"
          transform="translate(100 100)"
        />
      </svg>
    </motion.div>
  );
}

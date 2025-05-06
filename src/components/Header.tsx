import React, { useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onFindMidpointClick?: () => void;
}

const Header = ({
  title = "MeetInTheMiddle",
  subtitle = "Find the perfect midpoint between two locations",
  onFindMidpointClick = () => console.log("Find midpoint clicked"),
}: HeaderProps) => {
  const animationContainerRef = useRef<HTMLDivElement>(null);

  // Animation variants for the arrows
  const arrowOneVariants = {
    initial: { x: -80, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
  };

  const arrowTwoVariants = {
    initial: { x: 80, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: 1.5,
      opacity: 1,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 0 rgba(250, 204, 21, 0)" },
    animate: {
      boxShadow: "0 0 20px rgba(250, 204, 21, 0.8)",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  const roadLineVariants = {
    initial: { backgroundPosition: "0% 0%" },
    animate: {
      backgroundPosition: "100% 0%",
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Particle effects for arrows
  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut",
        repeatDelay: 0.2,
      },
    },
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-4">
        {/* Title with icon */}
        <div className="flex items-center justify-center mb-1">
          <MapPin className="h-7 w-7 text-yellow-300 mr-2" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            <span className="text-yellow-300">Meet</span>
            <span className="text-white">In</span>
            <span className="text-yellow-300">The</span>
            <span className="text-white">Middle</span>
          </h1>
        </div>

        {/* Animation container */}
        <div
          ref={animationContainerRef}
          className="relative h-16 w-80 mx-auto my-2 overflow-hidden rounded-lg"
        >
          {/* Animated road with dashed lines */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="absolute top-1/2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2"
              variants={roadLineVariants}
            />
            <motion.div
              className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 0%, transparent 50%, rgba(255,255,255,0.8) 50%, transparent 51%, transparent 100%)",
                backgroundSize: "20px 100%",
              }}
              variants={roadLineVariants}
            />
          </motion.div>

          {/* Midpoint marker with glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            >
              <MapPin className="h-6 w-6 text-gray-800" />
              <motion.div
                className="absolute w-16 h-16 bg-yellow-300/30 rounded-full"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </div>

          {/* Arrow 1 animation - modern stylized arrow */}
          <motion.div
            className="absolute top-1/2 left-4 -translate-y-1/2 z-10"
            variants={arrowOneVariants}
            initial="initial"
            animate="animate"
          >
            <div className="w-20 h-10 relative">
              {/* Modern arrow shape */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  filter: [
                    "drop-shadow(0 0 2px #60a5fa)",
                    "drop-shadow(0 0 5px #60a5fa)",
                    "drop-shadow(0 0 2px #60a5fa)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 80 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20H55L45 10M55 20L45 30"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M55 20L70 20"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Particle effects */}
              <motion.div
                className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-blue-300"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                style={{ translateY: "-50%" }}
              />
              <motion.div
                className="absolute top-1/2 right-2 w-1.5 h-1.5 rounded-full bg-blue-200"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                style={{ translateY: "-50%" }}
              />
              <motion.div
                className="absolute top-1/2 right-4 w-1 h-1 rounded-full bg-blue-100"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                style={{ translateY: "-50%" }}
              />
            </div>
          </motion.div>

          {/* Arrow 2 animation - modern stylized arrow */}
          <motion.div
            className="absolute top-1/2 right-4 -translate-y-1/2 z-10"
            variants={arrowTwoVariants}
            initial="initial"
            animate="animate"
          >
            <div className="w-20 h-10 relative transform rotate-180">
              {/* Modern arrow shape */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  filter: [
                    "drop-shadow(0 0 2px #10b981)",
                    "drop-shadow(0 0 5px #10b981)",
                    "drop-shadow(0 0 2px #10b981)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 80 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20H55L45 10M55 20L45 30"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M55 20L70 20"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Particle effects */}
              <motion.div
                className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-green-300"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                style={{ translateY: "-50%" }}
              />
              <motion.div
                className="absolute top-1/2 right-2 w-1.5 h-1.5 rounded-full bg-green-200"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                style={{ translateY: "-50%" }}
              />
              <motion.div
                className="absolute top-1/2 right-4 w-1 h-1 rounded-full bg-green-100"
                variants={particleVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                style={{ translateY: "-50%" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-100 text-xs md:text-sm mb-3">{subtitle}</p>

        {/* Find Midpoint Button */}
        <Button
          onClick={onFindMidpointClick}
          className={cn(
            "bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold transition-colors",
            "flex items-center gap-2 px-5 py-1.5 rounded-full shadow-md text-sm",
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          Find Midpoint
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedTagline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mb-8">
      {/* Screen reader accessible text */}
      <span className="sr-only">Join the Revolution</span>

      {/* Main animated tagline */}
      <motion.div
        className="text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        <motion.span
          className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
          style={{
            background: "linear-gradient(90deg, #00fff2, #bf00ff, #ff00aa, #00fff2)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          JOIN THE REVOLUTION
        </motion.span>
      </motion.div>

      {/* Animated neon glow line underneath */}
      <motion.div
        className="relative h-1 mx-auto mt-4 rounded-full overflow-hidden"
        style={{ maxWidth: "500px" }}
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #00fff2, #bf00ff, #ff00aa, #00fff2, transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ["0% 50%", "200% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-sm"
          style={{
            background: "linear-gradient(90deg, transparent, #00fff2, #bf00ff, #ff00aa, #00fff2, transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ["0% 50%", "200% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Floating particles effect - hidden when reduced motion preferred */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? "#00fff2" : "#bf00ff",
                left: `${15 + i * 15}%`,
                top: "50%",
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Glowing text variant for other uses
export function GlowingText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 blur-lg opacity-50"
        style={{
          background: "linear-gradient(90deg, #00fff2, #bf00ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

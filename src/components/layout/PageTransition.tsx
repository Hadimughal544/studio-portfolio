"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

let hasMountedOnce = false;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const animateIn = hasMountedOnce;

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

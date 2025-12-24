import React from 'react';
import { motion } from 'framer-motion';

export default function HeroParallax() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/40 to-purple-500/40 blur-2xl"
        initial={{ x: -200, y: -120 }}
        animate={{ x: [-200, -100, -150], y: [-120, -60, -140] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-10 top-10 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-400/40 to-indigo-400/40 blur-2xl"
        initial={{ x: 80, y: -40 }}
        animate={{ x: [80, 40, 100], y: [-40, -80, -20] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-fuchsia-400/40 to-sky-400/40 blur-3xl"
        initial={{ x: 0, y: 60 }}
        animate={{ x: [0, 40, -20], y: [60, 20, 70] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </div>
  );
}

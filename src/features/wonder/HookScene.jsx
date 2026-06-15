// src/features/wonder/HookScene.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * The animated "?" orb that anchors the Wonder phase.
 */
export default function HookScene() {
  return (
    <motion.div
      className="wonder-orb"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      aria-hidden="true"
    >
      ?
    </motion.div>
  );
}

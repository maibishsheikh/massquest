// src/features/wonder/DiagnosticQuestion.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * The Wonder question card — large emoji, bold question,
 * italic subtext hinting students to think before continuing.
 */
export default function DiagnosticQuestion({ wonder, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      className="wonder-card glass-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="wonder-emoji" role="img" aria-hidden="true">{wonder.emoji}</div>
      <p className="wonder-question">{wonder.question}</p>
      <p className="wonder-subtext">{wonder.subtext}</p>
    </motion.div>
  );
}

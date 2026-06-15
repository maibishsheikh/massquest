// src/animations/pageTransitions.js
//
// Shared Framer Motion variants for phase transitions.

export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export const pageTransition = {
  duration: 0.4,
  ease: [0.34, 1.56, 0.64, 1],
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

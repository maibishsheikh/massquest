// src/features/story/StoryFrame.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterDialogue from './CharacterDialogue.jsx';

const CHAR_DIALOGUE = [
  "The heavier side goes DOWN on the balance scale!",
  "Small things like sweets and pencils → GRAMS (g)!",
  "Heavy things like flour bags → KILOGRAMS (kg)!",
  "Magic fact: 1 kg = 1000 g. Write it down!",
  "You did it! You're a Mass Master! 🏆",
];

// Illustrated slide visuals using emoji art — no images needed
const SLIDE_VISUALS = [
  // Slide 0: Balance scale scene
  <g key="s0">
    <text x="50%" y="42" textAnchor="middle" fontSize="38">🛒</text>
    <text x="25%" y="80" textAnchor="middle" fontSize="28">🍓</text>
    <text x="75%" y="80" textAnchor="middle" fontSize="28">⚖️</text>
    <text x="50%" y="110" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">Heavier side goes DOWN!</text>
  </g>,
  // Slide 1: Small objects — grams
  <g key="s1">
    <text x="20%" y="75" textAnchor="middle" fontSize="30">🍬</text>
    <text x="40%" y="75" textAnchor="middle" fontSize="30">✏️</text>
    <text x="60%" y="75" textAnchor="middle" fontSize="30">🪶</text>
    <text x="80%" y="75" textAnchor="middle" fontSize="30">🍇</text>
    <text x="50%" y="108" textAnchor="middle" fontSize="14" fill="#ffc107" fontFamily="Fredoka" fontWeight="700">Small & light → GRAMS (g)</text>
  </g>,
  // Slide 2: Heavy objects — kilograms
  <g key="s2">
    <text x="25%" y="70" textAnchor="middle" fontSize="34">🥛</text>
    <text x="50%" y="70" textAnchor="middle" fontSize="34">🏋️</text>
    <text x="75%" y="70" textAnchor="middle" fontSize="34">🎒</text>
    <text x="50%" y="108" textAnchor="middle" fontSize="14" fill="#ffc107" fontFamily="Fredoka" fontWeight="700">Heavy things → KILOGRAMS (kg)</text>
  </g>,
  // Slide 3: 1kg = 1000g
  <g key="s3">
    <text x="50%" y="55" textAnchor="middle" fontSize="34">💡</text>
    <text x="50%" y="88" textAnchor="middle" fontSize="18" fill="#ffc107" fontFamily="Fredoka" fontWeight="800">1 kg = 1000 g</text>
    <text x="50%" y="112" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.6)" fontFamily="Fredoka">500 g = ½ kg  ·  250 g = ¼ kg</text>
  </g>,
  // Slide 4: Trophy
  <g key="s4">
    <text x="50%" y="65" textAnchor="middle" fontSize="46">🏆</text>
    <text x="50%" y="110" textAnchor="middle" fontSize="14" fill="#ffc107" fontFamily="Fredoka" fontWeight="800">Mass Master!</text>
  </g>,
];

export default function StoryFrame({ slide, slideIndex, direction = 1 }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slideIndex}
        custom={direction}
        initial={{ opacity: 0, x: direction * 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -direction * 40 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
      >
        {/* Illustrated visual header */}
        <div className="story-slide-visual">
          <svg viewBox="0 0 320 130" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id={`sg${slideIndex}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a1a40" />
                <stop offset="100%" stopColor="#2d1b5e" />
              </linearGradient>
            </defs>
            <rect width="320" height="130" fill={`url(#sg${slideIndex})`} />
            {SLIDE_VISUALS[slideIndex]}
          </svg>
        </div>

        {/* Text content */}
        <div className="story-content">
          <h2 className="story-title">{slide.title}</h2>
          <p className="story-body">{slide.text}</p>
          {slide.highlight && <div className="story-highlight">{slide.highlight}</div>}
          {slide.answer && <p className="story-answer">💡 {slide.answer}</p>}
          <CharacterDialogue slideIndex={slideIndex} text={CHAR_DIALOGUE[slideIndex]} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

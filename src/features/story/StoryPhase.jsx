// src/features/story/StoryPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterDialogue from './CharacterDialogue.jsx';
import Button from '../../components/Button.jsx';
import { STORY_SLIDES } from './storyScripts/slides.js';
import { storyNarrations } from '../../utils/narration.js';

// ── Per-slide SVG story scene illustrations (viewBox 400×210) ──────────────
const SLIDE_ILLUSTRATIONS = [
  // Slide 0 — Market Day: Sophie & Max at the balance scale
  <g key="s0">
    {/* Stars */}
    <circle cx="25"  cy="14" r="1.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="70"  cy="8"  r="1"   fill="rgba(255,255,255,0.18)" />
    <circle cx="340" cy="12" r="1.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="380" cy="20" r="1"   fill="rgba(255,255,255,0.18)" />
    {/* Sun */}
    <text x="360" y="36" textAnchor="middle" fontSize="22">☀️</text>
    {/* Scene label */}
    <text x="200" y="28" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.38)" fontFamily="Fredoka">☀️ Market Day Morning</text>
    {/* Max */}
    <text x="88"  y="148" textAnchor="middle" fontSize="52">👦</text>
    {/* Balance scale centre */}
    <text x="200" y="145" textAnchor="middle" fontSize="60">⚖️</text>
    {/* Strawberries on left pan */}
    <text x="148" y="118" textAnchor="middle" fontSize="26">🍓</text>
    {/* Sophie */}
    <text x="315" y="148" textAnchor="middle" fontSize="52">👧</text>
    {/* Caption */}
    <text x="200" y="175" textAnchor="middle" fontSize="14" fill="#FFD700" fontFamily="Fredoka" fontWeight="800">Heavier side goes ↓ DOWN!</text>
    <text x="200" y="196" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.42)" fontFamily="Fredoka">Max uses a balance scale to COMPARE masses</text>
  </g>,

  // Slide 1 — Grams: small & light objects at Max's stall
  <g key="s1">
    <circle cx="25"  cy="14" r="1.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="380" cy="18" r="1"   fill="rgba(255,255,255,0.18)" />
    <text x="200" y="28" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.38)" fontFamily="Fredoka">Max's Stall — Small &amp; Light Things</text>
    {/* Objects row */}
    <text x="55"  y="118" textAnchor="middle" fontSize="40">🍬</text>
    <text x="120" y="118" textAnchor="middle" fontSize="40">✏️</text>
    <text x="185" y="118" textAnchor="middle" fontSize="40">🍇</text>
    <text x="250" y="118" textAnchor="middle" fontSize="40">🌿</text>
    <text x="315" y="118" textAnchor="middle" fontSize="40">🪶</text>
    <text x="370" y="118" textAnchor="middle" fontSize="38">🧂</text>
    {/* Weight labels under each item */}
    <text x="55"  y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 3 g</text>
    <text x="120" y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 20 g</text>
    <text x="185" y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 5 g</text>
    <text x="250" y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 2 g</text>
    <text x="315" y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 0.3 g</text>
    <text x="370" y="138" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">≈ 1 g</text>
    {/* Main label */}
    <text x="200" y="165" textAnchor="middle" fontSize="17" fill="#FFD700" fontFamily="Fredoka" fontWeight="800">Small &amp; light things → GRAMS (g)</text>
    <text x="200" y="187" textAnchor="middle" fontSize="12" fill="#fb923c" fontFamily="Fredoka" fontWeight="600">Max says: "Things you can hold in one hand!"</text>
    <text x="200" y="205" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="Fredoka">g is the symbol for grams</text>
  </g>,

  // Slide 2 — Kilograms: Lily the baker with heavy bags
  <g key="s2">
    <circle cx="25"  cy="14" r="1.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="380" cy="10" r="1"   fill="rgba(255,255,255,0.18)" />
    <text x="200" y="28" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.38)" fontFamily="Fredoka">Lily's Bakery Order — Heavy Things</text>
    {/* Lily */}
    <text x="72"  y="148" textAnchor="middle" fontSize="52">👩‍🍳</text>
    {/* Heavy bags */}
    <text x="170" y="140" textAnchor="middle" fontSize="48">🌾</text>
    <text x="248" y="140" textAnchor="middle" fontSize="48">🥛</text>
    <text x="326" y="140" textAnchor="middle" fontSize="48">🎒</text>
    {/* Labels */}
    <text x="170" y="162" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">2 kg flour</text>
    <text x="248" y="162" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">1 kg sugar</text>
    <text x="326" y="162" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Fredoka">school bag</text>
    {/* Main label */}
    <text x="200" y="183" textAnchor="middle" fontSize="17" fill="#FFD700" fontFamily="Fredoka" fontWeight="800">Heavy things → KILOGRAMS (kg)</text>
    <text x="200" y="203" textAnchor="middle" fontSize="12" fill="#a78bfa" fontFamily="Fredoka" fontWeight="600">Lily says: "2 kilograms of flour, please!"</text>
  </g>,

  // Slide 3 — 1 kg = 1000 g: Oliver's science class
  <g key="s3">
    <circle cx="25"  cy="14" r="1.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="380" cy="18" r="1"   fill="rgba(255,255,255,0.18)" />
    <text x="200" y="26" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.38)" fontFamily="Fredoka">Oliver's Science Class — The Magic Fact!</text>
    {/* Oliver */}
    <text x="68"  y="145" textAnchor="middle" fontSize="52">👨‍🏫</text>
    {/* Left side: 1 kg block */}
    <rect x="148" y="82" width="76" height="54" rx="10" fill="rgba(167,139,250,0.22)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="186" y="104" textAnchor="middle" fontSize="11" fill="#a78bfa" fontFamily="Fredoka" fontWeight="700">1 kg</text>
    <text x="186" y="126" textAnchor="middle" fontSize="22">🏋️</text>
    {/* Equals sign */}
    <text x="238" y="117" textAnchor="middle" fontSize="22" fill="#FFD700" fontFamily="Fredoka" fontWeight="900">=</text>
    {/* Right side: 1000 g */}
    <rect x="254" y="82" width="90" height="54" rx="10" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5" />
    <text x="299" y="104" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="Fredoka" fontWeight="700">1000 g</text>
    <text x="299" y="126" textAnchor="middle" fontSize="18">💡⚖️💡</text>
    {/* Big label */}
    <text x="260" y="160" textAnchor="middle" fontSize="21" fill="#FFD700" fontFamily="Fredoka" fontWeight="900">1 kg = 1000 g</text>
    <text x="260" y="180" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.72)" fontFamily="Fredoka">500 g = ½ kg  ·  250 g = ¼ kg</text>
    <text x="200" y="204" textAnchor="middle" fontSize="12" fill="#34d399" fontFamily="Fredoka" fontWeight="600">Oliver says: "Write it down — it's your superpower!"</text>
  </g>,

  // Slide 4 — Trophy: Sophie wins Market Day!
  <g key="s4">
    <text x="200" y="26" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.38)" fontFamily="Fredoka">Sophie Wins Market Day! 🎉</text>
    {/* Confetti */}
    <text x="30"  y="80" textAnchor="middle" fontSize="20">🎊</text>
    <text x="368" y="80" textAnchor="middle" fontSize="20">🎊</text>
    <text x="18"  y="130" textAnchor="middle" fontSize="16">✨</text>
    <text x="382" y="130" textAnchor="middle" fontSize="16">✨</text>
    {/* Characters */}
    <text x="72"  y="150" textAnchor="middle" fontSize="46">👦</text>
    {/* Trophy in middle */}
    <text x="200" y="145" textAnchor="middle" fontSize="66">🏆</text>
    <text x="328" y="150" textAnchor="middle" fontSize="46">👧</text>
    {/* Oliver & Lily small */}
    <text x="140" y="155" textAnchor="middle" fontSize="28">👩‍🍳</text>
    <text x="262" y="155" textAnchor="middle" fontSize="28">👨‍🏫</text>
    {/* Star burst */}
    <text x="200" y="175" textAnchor="middle" fontSize="20" fill="#FFD700" fontFamily="Fredoka" fontWeight="900">🌟 YOU'RE A MASS MASTER! 🌟</text>
    <text x="200" y="196" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.6)" fontFamily="Fredoka">grams · kilograms · 1 kg = 1000 g</text>
  </g>,
];

const CHAR_DIALOGUE = [
  "The heavier side goes DOWN on a balance scale!",
  "Small things like pencils → measure in GRAMS (g)!",
  "Heavy things like bags of flour → use KILOGRAMS (kg)!",
  "The magic fact: 1 kg = 1000 g. Write it down! 💡",
  "You did it! You're a Mass Master! 🏆",
];

// Gradient colours per slide (top → bottom stop)
const SLIDE_GRADIENTS = [
  ['#0a1628', '#1a1040'],  // night market blue-indigo
  ['#0f1a10', '#1a2d18'],  // fresh market green-dark
  ['#1a0a1c', '#2d1230'],  // bakery violet-dark
  ['#0a0f1c', '#101838'],  // science navy
  ['#1a1000', '#2d2000'],  // golden trophy
];

export default function StoryPhase({ onComplete, playNarration, stop }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const narrationFiredRef = useRef(new Set());
  const total = STORY_SLIDES.length;
  const slide = STORY_SLIDES[currentSlide];
  const isLast = currentSlide === total - 1;

  useEffect(() => {
    if (!narrationFiredRef.current.has(currentSlide)) {
      narrationFiredRef.current.add(currentSlide);
      const seg = storyNarrations.mass[currentSlide];
      if (seg) playNarration?.([seg]);
    }
  }, [currentSlide, playNarration]);

  const goTo = (idx) => {
    stop?.();
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };
  const goNext = () => isLast ? onComplete?.() : goTo(currentSlide + 1);
  const goBack = () => currentSlide > 0 && goTo(currentSlide - 1);

  const [g1, g2] = SLIDE_GRADIENTS[currentSlide];

  return (
    <div className="story-screen">
      <div className="story-card glass-card">

        {/* ── Illustrated scene (210 px tall SVG) ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '210px',
          flexShrink: 0,
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <svg
            viewBox="0 0 400 210"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <linearGradient id={`sg-${currentSlide}`} x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%"   stopColor={g1} />
                <stop offset="100%" stopColor={g2} />
              </linearGradient>
            </defs>
            <rect width="400" height="210" fill={`url(#sg-${currentSlide})`} />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.g
                key={currentSlide}
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              >
                {SLIDE_ILLUSTRATIONS[currentSlide]}
              </motion.g>
            </AnimatePresence>
          </svg>
        </div>

        {/* ── Text content (scrollable area) ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 28 }}
            transition={{ duration: 0.28 }}
            className="story-content"
          >
            <h2 className="story-title">{slide.title}</h2>
            <p className="story-body">{slide.text}</p>
            {slide.highlight && <div className="story-highlight">{slide.highlight}</div>}
            {slide.answer    && <p className="story-answer">💡 {slide.answer}</p>}
            <CharacterDialogue slideIndex={currentSlide} text={CHAR_DIALOGUE[currentSlide]} />
          </motion.div>
        </AnimatePresence>

        {/* ── Nav bar inside the card ── */}
        <div className="story-nav">
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={currentSlide === 0}
          >
            ← Back
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div className="story-dots">
              {STORY_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`story-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {currentSlide + 1} / {total}
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={goNext}>
            {isLast ? 'Simulate! 🧪' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  );
}

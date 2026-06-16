// src/features/story/StoryPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterDialogue from './CharacterDialogue.jsx';
import Button from '../../components/Button.jsx';
import { STORY_SLIDES } from './storyScripts/slides.js';
import { storyNarrations } from '../../utils/narration.js';

// ── Real slide images from public/assets/images/story/ ───────────────────────
const SLIDE_IMAGES = [
  '/assets/images/story/story-1-market-day.png',
  '/assets/images/story/story-2-grams.png',
  '/assets/images/story/story-3-kilograms.png',
  '/assets/images/story/story-4-conversion.png',
  '/assets/images/story/story-5-mass-master.png',
];

const CHAR_DIALOGUE = [
  "The heavier side goes DOWN on a balance scale!",
  "Small things like pencils → measure in GRAMS (g)!",
  "Heavy things like bags of flour → use KILOGRAMS (kg)!",
  "The magic fact: 1 kg = 1000 g. Write it down! 💡",
  "You did it! You're a Mass Master! 🏆",
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


  return (
    <div className="story-screen">

      <div className="story-card glass-card">

        {/* ── Real slide image from public/assets/images/story/ ── */}
        <div className="story-image-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={currentSlide}
              src={SLIDE_IMAGES[currentSlide]}
              alt=""
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </AnimatePresence>
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

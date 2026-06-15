// src/features/simulate/simulations/UnitConverter.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';

const ROUNDS = 3;

// Real items with realistic weights for logical context
const ITEMS = [
  { label: 'bag of flour',  emoji: '🌾', kg: 1, g: 0   },
  { label: 'bag of sugar',  emoji: '🧂', kg: 2, g: 0   },
  { label: 'bag of apples', emoji: '🍎', kg: 1, g: 500 },
  { label: 'box of books',  emoji: '📚', kg: 3, g: 0   },
  { label: 'watermelon',    emoji: '🍉', kg: 2, g: 500 },
  { label: 'bag of rice',   emoji: '🍚', kg: 1, g: 250 },
  { label: 'pumpkin',       emoji: '🎃', kg: 4, g: 0   },
  { label: 'dog food bag',  emoji: '🐶', kg: 3, g: 500 },
];

// 4 question templates
const TEMPLATES = [
  {
    q:       (kg, g) => `${kg} kg  =  ___ g`,
    correct: (kg, g) => `${kg * 1000} g`,
    hint:    'Multiply kg × 1000',
    type:    'kg_to_g',
  },
  {
    q:       (kg, g) => `${kg * 1000} g  =  ___ kg`,
    correct: (kg, g) => `${kg} kg`,
    hint:    'Divide grams ÷ 1000',
    type:    'g_to_kg',
  },
  {
    q:       (kg, g) => `${kg} kg ${g} g  =  ___ g`,
    correct: (kg, g) => `${kg * 1000 + g} g`,
    hint:    `Convert kg → g, then add`,
    type:    'mixed_to_g',
  },
  {
    q:       (kg, g) => `${kg * 1000 + g} g  =  ___ kg ___ g`,
    correct: (kg, g) => `${kg} kg ${g} g`,
    hint:    `÷ 1000 → remainder is grams`,
    type:    'g_to_mixed',
  },
];

function buildOptions(correct, kg, g) {
  const total = kg * 1000 + g;
  const pool = new Set([correct]);
  const wrongs = [
    `${kg * 100} g`,
    `${total + 500} g`,
    `${Math.max(0, total - 250)} g`,
    `${kg + 1} kg`,
    `${kg} kg ${g === 0 ? 500 : 0} g`,
    `${kg * 10} g`,
    `${kg} kg`,
    `${total + 1000} g`,
  ];
  for (const w of wrongs) {
    if (pool.size >= 4) break;
    if (w !== correct && w !== `0 g` && w !== `-250 g`) pool.add(w);
  }
  while (pool.size < 4) pool.add(`${total + pool.size * 100} g`);
  const arr = [...pool].slice(0, 4);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function genQuestion() {
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const { kg, g } = item;
  const validTemplates = g === 0
    ? TEMPLATES.filter(t => t.type === 'kg_to_g' || t.type === 'g_to_kg')
    : TEMPLATES;
  const tmpl = validTemplates[Math.floor(Math.random() * validTemplates.length)];
  const correct = tmpl.correct(kg, g);
  return { item, questionText: tmpl.q(kg, g), correctAnswer: correct, options: buildOptions(correct, kg, g), hint: tmpl.hint, kg, g };
}

// ── Platform scale SVG: item sits on a digital kitchen scale ─────────────
function PlatformScaleVisual({ item, kg, g, showBurst, confirmed, isCorrect }) {
  const totalG  = kg * 1000 + g;
  const fillPct = Math.min(totalG / 5000, 1);
  const barW    = fillPct * 60; // max 60 wide inside display

  // Split kg/g visually: two stacked pill indicators
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, position:'relative', width:'100%' }}>

      {/* Burst effect on correct */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            initial={{ scale:0, opacity:1 }}
            animate={{ scale:3, opacity:0 }}
            exit={{}}
            transition={{ duration:0.65 }}
            style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)',
                     fontSize:'1.6rem', pointerEvents:'none', zIndex:10 }}
          >⭐</motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 220 200" style={{ width:'100%', maxWidth:200, height:'auto' }}>

        {/* ── Item sitting on platform ── */}
        <text x="110" y="62" textAnchor="middle" fontSize="42"
          style={{ filter:'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }}>
          {item.emoji}
        </text>
        <text x="110" y="80" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="Fredoka">
          {item.label}
        </text>

        {/* Platform surface */}
        <ellipse cx="110" cy="102" rx="68" ry="9"
          fill={confirmed ? (isCorrect ? 'rgba(0,230,118,0.5)' : 'rgba(255,82,82,0.4)') : 'rgba(140,110,210,0.65)'}
          stroke={confirmed ? (isCorrect ? '#00e676' : '#ff5252') : 'rgba(124,92,191,0.9)'}
          strokeWidth="1.5"
          style={{ transition:'fill 0.4s ease, stroke 0.4s ease' }}
        />

        {/* Scale body */}
        <rect x="42" y="100" width="136" height="52" rx="10"
          fill="rgba(25,25,80,0.9)" stroke="rgba(124,92,191,0.6)" strokeWidth="1.5" />

        {/* Digital display panel */}
        <rect x="55" y="110" width="110" height="34" rx="6"
          fill="rgba(5,5,30,0.95)" stroke="rgba(255,193,7,0.4)" strokeWidth="1.5" />

        {/* Green fill bar */}
        <rect x="58" y="121" width={barW} height="10" rx="3"
          fill="url(#scaleBar)"
          style={{ transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
        <defs>
          <linearGradient id="scaleBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#00e676" />
            <stop offset="70%"  stopColor="#ffc107" />
            <stop offset="100%" stopColor="#ff5252" />
          </linearGradient>
        </defs>

        {/* Digital reading */}
        <text x="110" y="118" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.35)" fontFamily="Fredoka">
          g
        </text>
        <text x="110" y="138" textAnchor="middle" fontSize="11" fill="#ffc107" fontFamily="Fredoka" fontWeight="800">
          {kg} kg {g > 0 ? `${g} g` : ''}
        </text>

        {/* Legs */}
        <rect x="55"  y="150" width="10" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
        <rect x="155" y="150" width="10" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
        {/* Base feet */}
        <rect x="50"  y="162" width="22" height="5"  rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="148" y="162" width="22" height="5"  rx="2" fill="rgba(255,255,255,0.1)" />
      </svg>

      {/* 1 kg = 1000 g reminder pill */}
      <div style={{
        background:'rgba(255,193,7,0.1)', border:'1px solid rgba(255,193,7,0.32)',
        borderRadius:20, padding:'4px 14px',
        fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.82rem', color:'var(--gold)',
      }}>
        1 kg = 1000 g
      </div>
    </div>
  );
}

export default function UnitConverterSim({ onComplete }) {
  const [round,     setRound]     = useState(0);
  const [question,  setQuestion]  = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [score,     setScore]     = useState(0);

  const newRound = () => { setQuestion(genQuestion()); setSelected(null); setConfirmed(false); setShowBurst(false); };
  useEffect(() => { newRound(); }, []);
  if (!question) return null;

  const isCorrect = selected === question.correctAnswer;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 750);
    }
  };

  const handleNext = () => {
    const next  = round + 1;
    const final = score + (isCorrect ? 1 : 0);
    if (next >= ROUNDS) { onComplete?.(final); return; }
    setRound(next); newRound();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:'100%' }}>
      {/* Round counter */}
      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', fontSize:'0.78rem', color:'var(--color-text-muted)', fontFamily:'var(--font-display)', fontWeight:700 }}>
        <span>Round {round+1} of {ROUNDS}</span>
        <span>Score: {score}/{round}</span>
      </div>

      {/* Scale visual */}
      <PlatformScaleVisual
        item={question.item} kg={question.kg} g={question.g}
        showBurst={showBurst} confirmed={confirmed} isCorrect={isCorrect}
      />

      {/* Question */}
      <p style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.15rem', textAlign:'center',
                  color:'var(--color-text)', letterSpacing:'0.5px', margin:'2px 0' }}>
        {question.questionText}
      </p>
      <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.75rem', textAlign:'center', marginBottom:4, fontFamily:'var(--font-display)' }}>
        💡 {question.hint}
      </p>

      {/* Options */}
      <div className="options-grid" style={{ width:'100%', marginBottom:6 }}>
        {question.options.map(opt => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === question.correctAnswer)  cls += ' correct';
            else if (opt === selected)            cls += ' wrong';
            else                                  cls += ' disabled';
          } else if (selected === opt)            cls += ' selected';
          return (
            <button key={opt} className={cls}
              onClick={() => !confirmed && setSelected(opt)}
              style={{ textAlign:'center' }}>
              {opt}
            </button>
          );
        })}
      </div>

      {!confirmed ? (
        <Button variant="primary" size="sm" onClick={handleConfirm} disabled={!selected}>
          Check Answer ✓
        </Button>
      ) : (
        <div style={{ width:'100%', textAlign:'center' }}>
          <div style={{
            padding:'9px 14px', borderRadius:'var(--radius-md)', marginBottom:10,
            background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
            border: `1px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
            fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.88rem',
          }}>
            {isCorrect ? '🎉 Correct! Great converting!' : `❌ Answer: ${question.correctAnswer}`}
          </div>
          <Button variant="primary" size="sm" onClick={handleNext}>
            {round+1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
          </Button>
        </div>
      )}
    </div>
  );
}

// src/features/simulate/simulations/BalanceScale.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';

const ROUNDS = 3;

const PAIRS = [
  { left:  { label:'apple',      emoji:'🍎', mass:150  }, right: { label:'feather',    emoji:'🪶', mass:2    } },
  { left:  { label:'book',       emoji:'📚', mass:500  }, right: { label:'pencil',     emoji:'✏️', mass:15   } },
  { left:  { label:'watermelon', emoji:'🍉', mass:3000 }, right: { label:'grape',      emoji:'🍇', mass:80   } },
  { left:  { label:'1 kg weight',emoji:'⚖️', mass:1000 }, right: { label:'500 g weight',emoji:'⚖️',mass:500 } },
  { left:  { label:'shoe',       emoji:'👟', mass:400  }, right: { label:'leaf',       emoji:'🍃', mass:4    } },
  { left:  { label:'rice bag',   emoji:'🍚', mass:2000 }, right: { label:'egg',        emoji:'🥚', mass:60   } },
];

function fmt(g) { return g >= 1000 ? `${g/1000} kg` : `${g} g`; }

function genRound() {
  const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
  const swap = Math.random() > 0.5;
  return swap ? { left: pair.right, right: pair.left } : { ...pair };
}

function getCorrect(left, right) {
  if (left.mass > right.mass) return `${left.label} is heavier`;
  if (right.mass > left.mass) return `${right.label} is heavier`;
  return 'They weigh the same';
}

// ── Illustrated Balance Scale SVG ────────────────────────────────────────
function BalanceSVG({ left, right, tiltRevealed }) {
  const diff = left.mass - right.mass;
  // Tilt: positive = left heavier → left goes down
  const maxTilt = 16;
  const tiltDeg = tiltRevealed
    ? Math.max(-maxTilt, Math.min(maxTilt, (diff / Math.max(left.mass, right.mass)) * maxTilt))
    : 0;

  return (
    <svg viewBox="0 0 280 200" style={{ width:'100%', maxWidth:260, height:'auto', display:'block', margin:'0 auto' }}>
      {/* Stand pole */}
      <rect x="137" y="60" width="6" height="118" rx="3" fill="rgba(255,255,255,0.25)" />
      {/* Base */}
      <rect x="90"  y="170" width="100" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
      {/* Stand cap */}
      <circle cx="140" cy="62" r="8" fill="rgba(255,193,7,0.8)" />

      {/* Rotating arm */}
      <motion.g
        animate={{ rotate: tiltDeg }}
        transition={{ duration:1.0, type:'spring', stiffness:70, damping:14 }}
        style={{ transformOrigin:'140px 62px' }}
      >
        {/* Arm beam */}
        <rect x="48" y="59" width="184" height="6" rx="3" fill="rgba(200,180,255,0.55)" />

        {/* Left chain */}
        <line x1="72"  y1="62" x2="60"  y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
        <line x1="72"  y1="62" x2="84"  y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
        {/* Left pan */}
        <ellipse cx="72" cy="103" rx="30" ry="8"
          fill="rgba(124,92,191,0.55)" stroke="rgba(160,130,220,0.8)" strokeWidth="1.5" />
        {/* Left item */}
        <text x="72"  y="96"  textAnchor="middle" fontSize="28"
          style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
          {left.emoji}
        </text>
        {/* Left mass label */}
        <rect x="48" y="112" width="48" height="14" rx="5"
          fill="rgba(0,0,0,0.5)" stroke="rgba(255,193,7,0.4)" strokeWidth="1" />
        <text x="72"  y="122" textAnchor="middle" fontSize="8" fill="var(--gold)" fontFamily="Fredoka" fontWeight="800">
          {fmt(left.mass)}
        </text>

        {/* Right chain */}
        <line x1="208" y1="62" x2="196" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
        <line x1="208" y1="62" x2="220" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
        {/* Right pan */}
        <ellipse cx="208" cy="103" rx="30" ry="8"
          fill="rgba(124,92,191,0.55)" stroke="rgba(160,130,220,0.8)" strokeWidth="1.5" />
        {/* Right item */}
        <text x="208" y="96"  textAnchor="middle" fontSize="28"
          style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
          {right.emoji}
        </text>
        {/* Right mass label */}
        <rect x="184" y="112" width="48" height="14" rx="5"
          fill="rgba(0,0,0,0.5)" stroke="rgba(255,193,7,0.4)" strokeWidth="1" />
        <text x="208" y="122" textAnchor="middle" fontSize="8" fill="var(--gold)" fontFamily="Fredoka" fontWeight="800">
          {fmt(right.mass)}
        </text>
      </motion.g>
    </svg>
  );
}

export default function BalanceScaleSim({ onComplete }) {
  const [round,     setRound]     = useState(0);
  const [pair,      setPair]      = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score,     setScore]     = useState(0);

  const newRound = () => { setPair(genRound()); setSelected(null); setConfirmed(false); };
  useEffect(() => { newRound(); }, []);
  if (!pair) return null;

  const correct  = getCorrect(pair.left, pair.right);
  const options  = [
    `${pair.left.label} is heavier`,
    `${pair.right.label} is heavier`,
    'They weigh the same',
  ];
  const isCorrect = selected === correct;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) setScore(s => s + 1);
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

      {/* Scale illustration */}
      <BalanceSVG left={pair.left} right={pair.right} tiltRevealed={confirmed || !!selected} />

      {/* Labels */}
      <div style={{ display:'flex', justifyContent:'space-around', width:'100%', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.88rem', color:'rgba(255,255,255,0.7)', marginBottom:2 }}>
        <span>{pair.left.emoji} {pair.left.label}</span>
        <span>{pair.right.label} {pair.right.emoji}</span>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%', marginBottom:6 }}>
        {options.map(opt => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correct)      cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else                       cls += ' disabled';
          } else if (selected === opt) cls += ' selected';
          return (
            <button key={opt} className={cls} onClick={() => !confirmed && setSelected(opt)}
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
            {isCorrect ? '🎉 Correct! The scale tilts down!' : `❌ Answer: ${correct}`}
          </div>
          <Button variant="primary" size="sm" onClick={handleNext}>
            {round+1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
          </Button>
        </div>
      )}
    </div>
  );
}

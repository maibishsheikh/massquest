// src/features/simulate/simulations/MassReader.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';

const ROUNDS = 3;

// All possible dial readings — options are ALWAYS built from this exact list
const DIAL_VALUES = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 750, 800, 1000];

function formatLabel(g) {
  return g >= 1000 ? '1 kg' : `${g} g`;
}

// Build 4 options: 1 correct + 3 nearest neighbors from DIAL_VALUES
function buildOptions(correctG) {
  const pool = DIAL_VALUES
    .filter(v => v !== correctG)
    .sort((a,b) => Math.abs(a - correctG) - Math.abs(b - correctG))
    .slice(0, 3);
  const all = [correctG, ...pool];
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.map(formatLabel);
}

function genQuestion() {
  const massG = DIAL_VALUES[Math.floor(Math.random() * DIAL_VALUES.length)];
  return { massG, correctLabel: formatLabel(massG), options: buildOptions(massG) };
}

// ── Illustrated Spring Scale SVG ─────────────────────────────────────────
// Shows a wall-mounted circular dial spring scale with a hanging object
function SpringDialSVG({ massG, revealed }) {
  const MAX = 1000;
  const pct = massG / MAX; // 0–1
  // Needle sweeps -135° (0g) to +135° (1000g) — 270° total arc
  const needleDeg = -135 + pct * 270;
  const cx = 120, cy = 108, r = 86;

  const toXY = (deg, radius) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const MAJOR = [0, 250, 500, 750, 1000];
  const MINOR = [50,100,150,200,300,350,400,450,600,650,700,800,850,900,950];
  const valToDeg = v => -135 + (v / MAX) * 270;

  // Arc path endpoints
  const arcS = toXY(-135, r - 14);
  const arcE = toXY(135,  r - 14);

  // Target needle position (animated)
  const needleEnd = toXY(revealed ? needleDeg : -135, r - 18);

  // Items hanging on the scale by weight band
  const OBJECTS = [
    { max: 150,  emoji: '🍬', label: 'candy' },
    { max: 300,  emoji: '🍎', label: 'apple' },
    { max: 500,  emoji: '📖', label: 'book' },
    { max: 750,  emoji: '👟', label: 'shoe' },
    { max: 950,  emoji: '🏋️', label: 'weight' },
    { max: 1001, emoji: '🪨', label: 'rock' },
  ];
  const obj = OBJECTS.find(o => massG <= o.max) ?? OBJECTS[OBJECTS.length - 1];

  return (
    <svg viewBox="0 0 240 310" style={{ width: '100%', maxWidth: 200, height: 'auto' }}>
      {/* ── Scale body ── */}
      {/* Wall bracket */}
      <rect x="96" y="2"  width="48" height="16" rx="6" fill="rgba(255,255,255,0.22)" />
      <rect x="114" y="16" width="12" height="12" rx="2" fill="rgba(255,255,255,0.18)" />

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 6} fill="rgba(30,30,90,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* Inner dial face */}
      <circle cx={cx} cy={cy} r={r}     fill="rgba(18,18,60,0.95)" />
      {/* Coloured arc track: green → yellow → red */}
      <path d={`M${arcS.x} ${arcS.y} A${r-14} ${r-14} 0 1 1 ${arcE.x} ${arcE.y}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />

      {/* Minor tick marks */}
      {MINOR.map(v => {
        const a = valToDeg(v);
        const o2 = toXY(a, r-16); const i2 = toXY(a, r-10);
        return <line key={v} x1={o2.x} y1={o2.y} x2={i2.x} y2={i2.y}
          stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />;
      })}

      {/* Major ticks + labels */}
      {MAJOR.map(v => {
        const a = valToDeg(v);
        const o2 = toXY(a, r-16); const i2 = toXY(a, r-8);
        const lp = toXY(a, r-30);
        const lbl = v === 0 ? '0' : v === 1000 ? '1kg' : `${v}`;
        return (
          <g key={v}>
            <line x1={o2.x} y1={o2.y} x2={i2.x} y2={i2.y} stroke="#ffc107" strokeWidth="2.5" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="8.5" fill="rgba(255,255,255,0.75)" fontFamily="Fredoka" fontWeight="700">
              {lbl}
            </text>
          </g>
        );
      })}

      {/* Unit text */}
      <text x={cx} y={cy + 56} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.4)" fontFamily="Fredoka">
        grams  (g)
      </text>

      {/* Animated needle */}
      <motion.line
        x1={cx} y1={cy}
        x2={needleEnd.x} y2={needleEnd.y}
        stroke="#ff5252" strokeWidth="3.5" strokeLinecap="round"
        animate={{ x2: needleEnd.x, y2: needleEnd.y }}
        transition={{ duration: 1.1, type: 'spring', stiffness: 65, damping: 11 }}
      />
      {/* Needle pivot */}
      <circle cx={cx} cy={cy} r={7} fill="#ffc107" />
      <circle cx={cx} cy={cy} r={3} fill="#1a1a2e" />

      {/* Digital readout window */}
      <rect x={cx - 28} y={cy + 63} width="56" height="18" rx="5"
        fill="rgba(0,0,0,0.6)" stroke="rgba(255,193,7,0.45)" strokeWidth="1.5" />
      <text x={cx} y={cy + 75} textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fill={revealed ? '#ffc107' : 'transparent'}
        fontFamily="Fredoka" fontWeight="800">
        {formatLabel(massG)}
      </text>

      {/* ── Hanging object below scale ── */}
      {/* Hook */}
      <rect x={cx-3} y={cy+84} width="6" height="18" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Chain links */}
      {[0,1,2,3].map(i => (
        <ellipse key={i} cx={cx} cy={cy+106+i*14} rx="4" ry="6"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}
      {/* Object emoji */}
      <text x={cx} y={cy + 172} textAnchor="middle" fontSize="34" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
        {obj.emoji}
      </text>
      {/* Object label */}
      <text x={cx} y={cy + 196} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.45)" fontFamily="Fredoka">
        {obj.label}
      </text>
    </svg>
  );
}

export default function MassReaderSim({ onComplete }) {
  const [round,     setRound]     = useState(0);
  const [question,  setQuestion]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score,     setScore]     = useState(0);

  const newRound = () => {
    setQuestion(genQuestion());
    setRevealed(false); setSelected(null); setConfirmed(false);
    setTimeout(() => setRevealed(true), 350);
  };
  useEffect(() => { newRound(); }, []);
  if (!question) return null;

  const isCorrect = selected === question.correctLabel;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    const next = round + 1;
    const final = score + (isCorrect ? 1 : 0);
    if (next >= ROUNDS) { onComplete?.(final); return; }
    setRound(next); newRound();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, width:'100%' }}>
      {/* Round counter */}
      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', fontSize:'0.78rem', color:'var(--color-text-muted)', fontFamily:'var(--font-display)', fontWeight:700 }}>
        <span>Round {round+1} of {ROUNDS}</span>
        <span>Score: {score}/{round}</span>
      </div>

      {/* Scale illustration */}
      <div style={{ display:'flex', justifyContent:'center', width:'100%' }}>
        <SpringDialSVG massG={question.massG} revealed={revealed} />
      </div>

      {/* Question */}
      <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', textAlign:'center', margin:'2px 0 8px' }}>
        📍 What mass does the scale show?
      </p>

      {/* Options */}
      <div className="options-grid" style={{ width:'100%', marginBottom:8 }}>
        {question.options.map(opt => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === question.correctLabel)  cls += ' correct';
            else if (opt === selected)           cls += ' wrong';
            else                                 cls += ' disabled';
          } else if (selected === opt)           cls += ' selected';
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
            {isCorrect ? '🎉 Correct!' : `❌ The answer was: ${question.correctLabel}`}
          </div>
          <Button variant="primary" size="sm" onClick={handleNext}>
            {round+1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
          </Button>
        </div>
      )}
    </div>
  );
}

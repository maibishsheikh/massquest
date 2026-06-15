// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';

/**
 * Renders a single question card with topic badge, question text,
 * 2×2 option grid, optional hint, and mascot row.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const { questionText, options, correctAnswer, tag, explanation } = question;

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div
        className="topic-badge"
        style={{ borderColor: `${worldAccent}66`, color: worldAccent }}
      >
        {tag.replace(/_/g, ' ')}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>
          Hint: Remember <strong>1 kg = 1000 g</strong>. Convert everything to the same unit!
        </HintBubble>
      )}

      {/* Options */}
      <div className="options-grid">
        {options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button
              key={opt}
              className={cls}
              onClick={() => onSelect(opt)}
              disabled={confirmed}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🧲</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Think carefully about the units…"}
        </div>
      </div>
    </div>
  );
}

// src/core/analytics/events.js
export const EVENTS = {
  PHASE_ENTERED: 'phase_entered',           // { phase }
  PHASE_COMPLETED: 'phase_completed',       // { phase, duration_ms }
  QUESTION_ANSWERED: 'question_answered',   // { id, tag, level, correct }
  WORLD_COMPLETED: 'world_completed',       // { world, score, total, stars }
  BOSS_DEFEATED: 'boss_defeated',           // { world }
  AUDIO_TOGGLED: 'audio_toggled',           // { enabled }
  SESSION_COMPLETED: 'session_completed',   // { totalXP, totalCorrect, duration_ms }
};

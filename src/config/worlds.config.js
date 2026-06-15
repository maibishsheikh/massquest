// src/config/worlds.config.js
export const WORLDS = [
  {
    id: 1,
    name: 'Market Stall',
    emoji: '🛒',
    accent: '#F97316',
    description: "Help Sophie and Max at the morning market",
    tags: ['COMPARE_MASS', 'READ_SCALE'],
    questionCount: 34,
    boss: { name: 'Scale Boss', emoji: '⚖️', reward: 'Market Star Badge 🛒' },
  },
  {
    id: 2,
    name: 'Bakery Lab',
    emoji: '🧁',
    accent: '#7C3AED',
    description: "Measure ingredients in Lily's magical bakery",
    tags: ['MASS_IN_GRAMS', 'MASS_IN_KG', 'ESTIMATION'],
    questionCount: 33,
    boss: { name: 'Oven Boss', emoji: '🔥', reward: 'Bakery Champ Badge 🧁' },
  },
  {
    id: 3,
    name: 'Science Lab',
    emoji: '🔬',
    accent: '#0EA5E9',
    description: "Solve Oliver's weighing experiments",
    tags: ['CONVERT_G_TO_KG', 'CONVERT_KG_TO_G', 'MIXED_UNITS', 'WORD_PROBLEM', 'ORDER_MASS'],
    questionCount: 33,
    boss: { name: 'Lab Boss', emoji: '🧪', reward: 'Lab Expert Badge 🔬' },
  },
];

// ── Play modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_weigh', name: 'First Weigh', icon: '⚖️', desc: 'First correct answer' },
  { id: 'hot_streak', name: 'Hot Streak', icon: '🔥', desc: '5 consecutive correct' },
  { id: 'market_star', name: 'Market Star', icon: '🛒', desc: 'Complete World 1' },
  { id: 'bakery_champ', name: 'Bakery Champ', icon: '🧁', desc: 'Complete World 2' },
  { id: 'lab_expert', name: 'Lab Expert', icon: '🔬', desc: 'Complete World 3' },
  { id: 'mass_master', name: 'Mass Master', icon: '🏆', desc: 'Complete all 3 worlds' },
  { id: 'scale_boss', name: 'Scale Boss', icon: '👑', desc: 'Defeat a boss battle' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};

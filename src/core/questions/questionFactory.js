// src/core/questions/questionFactory.js

import { questionBank } from './questionBank.js';

// Shuffle array in place (Fisher-Yates)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle a question's options while preserving the correct answer reference
export function shuffleOptions(question) {
  return { ...question, options: shuffle(question.options) };
}

// Generate N random questions for a given world
export function generateWorldQuestions(world, count = 34) {
  const pool = questionBank.filter((q) => q.world === world);
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map(shuffleOptions);
}

// Generate a balanced session of questions across all 3 worlds
export function generateSessionQuestions(questionsPerWorld = 10) {
  return [1, 2, 3].flatMap((w) => generateWorldQuestions(w, questionsPerWorld));
}

// Generate questions for a specific world + mode (used by Play phase)
export function generateModeQuestions(world, count, { excludeLevel3 = false } = {}) {
  let pool = questionBank.filter((q) => q.world === world);
  if (excludeLevel3) pool = pool.filter((q) => q.level < 3);
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map(shuffleOptions);
}

// Get reflect phase questions (one per concept, all worlds)
export function getReflectQuestions() {
  const tags = ['COMPARE_MASS', 'READ_SCALE', 'MASS_IN_GRAMS', 'CONVERT_KG_TO_G', 'WORD_PROBLEM'];
  return tags.map((tag) => {
    const pool = questionBank.filter((q) => q.tag === tag && q.level <= 2);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return shuffleOptions(picked);
  });
}

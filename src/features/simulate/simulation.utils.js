// src/features/simulate/simulation.utils.js

import { shuffle } from '../../core/questions/questionFactory.js';
import { buildDialOptions, buildMassOptions } from '../../core/questions/distractorEngine.js';

// ── Station 1: Balance Scale ──────────────────────────────────────────────

export const BALANCE_PAIRS = [
  { left: { label: 'apple', emoji: '🍎', mass: 150 }, right: { label: 'feather', emoji: '🪶', mass: 2 } },
  { left: { label: 'book', emoji: '📚', mass: 500 }, right: { label: 'pencil', emoji: '✏️', mass: 15 } },
  { left: { label: 'watermelon', emoji: '🍉', mass: 3000 }, right: { label: 'grape', emoji: '🍇', mass: 80 } },
  { left: { label: 'bag of sugar', emoji: '🥄', mass: 1000 }, right: { label: 'coin', emoji: '🪙', mass: 5 } },
  { left: { label: 'shoe', emoji: '👟', mass: 400 }, right: { label: 'leaf', emoji: '🍃', mass: 3 } },
  { left: { label: '1 kg weight', emoji: '⚖️', mass: 1000 }, right: { label: '500 g weight', emoji: '⚖️', mass: 500 } },
];

export function genBalancePair() {
  const pair = BALANCE_PAIRS[Math.floor(Math.random() * BALANCE_PAIRS.length)];
  const swapped = Math.random() > 0.5;
  return swapped ? { left: pair.right, right: pair.left } : { ...pair };
}

/**
 * Build the 3 answer options for a balance pair.
 */
export function getBalanceOptions(left, right) {
  return [
    `⬅️ ${left.label} is heavier`,
    `➡️ ${right.label} is heavier`,
    '⚖️ They are equal',
  ];
}

export function getBalanceCorrect(left, right) {
  if (left.mass > right.mass) return `⬅️ ${left.label} is heavier`;
  if (right.mass > left.mass) return `➡️ ${right.label} is heavier`;
  return '⚖️ They are equal';
}

// ── Station 2: Mass Reader (dial) ─────────────────────────────────────────

export const DIAL_VALUES = [100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000];

export function genDialQuestion() {
  const correct = DIAL_VALUES[Math.floor(Math.random() * DIAL_VALUES.length)];
  const correctLabel = correct >= 1000 ? `${correct / 1000} kg` : `${correct} g`;
  const options = buildDialOptions(correct, DIAL_VALUES);
  return {
    massGrams: correct,
    correctLabel,
    options,
    questionText: 'What mass does the scale show?',
  };
}

// ── Station 3: Unit Converter ─────────────────────────────────────────────

const CONVERSION_TEMPLATES = [
  { q: (k) => `${k * 1000} g = ___ kg`,       correct: (k) => `${k} kg`,           type: 'g_to_kg_whole' },
  { q: (k) => `${k} kg = ___ g`,              correct: (k) => `${k * 1000} g`,     type: 'kg_to_g_whole' },
  { q: (k, g) => `${k} kg ${g} g = ___ g`,   correct: (k, g) => `${k * 1000 + g} g`, type: 'mixed_to_g' },
  { q: (k, g) => `${k * 1000 + g} g = ___ kg ___ g`, correct: (k, g) => `${k} kg ${g} g`, type: 'g_to_mixed' },
];

export function genConversionQuestion() {
  const kg = Math.floor(Math.random() * 4) + 1; // 1–4 kg
  const gramsOptions = [0, 250, 500, 750];
  const grams = gramsOptions[Math.floor(Math.random() * gramsOptions.length)];
  const template = CONVERSION_TEMPLATES[Math.floor(Math.random() * CONVERSION_TEMPLATES.length)];

  // Skip mixed template when grams is 0 to avoid "1 kg 0 g = ___ g" (use whole kg template instead)
  const safeTemplate = (template.type === 'mixed_to_g' || template.type === 'g_to_mixed') && grams === 0
    ? CONVERSION_TEMPLATES[1] // fallback to kg_to_g_whole
    : template;

  const correct = safeTemplate.correct(kg, grams);
  const options = buildMassOptions(correct, kg, grams);

  return {
    questionText: safeTemplate.q(kg, grams),
    correctAnswer: correct,
    options,
    kg,
    grams,
  };
}

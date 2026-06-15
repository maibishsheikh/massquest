// src/core/questions/distractorEngine.js
//
// Generates plausible wrong-answer options for dynamically-generated
// simulation questions (Mass Reader, Unit Converter).

import { shuffle } from './questionFactory.js';

/**
 * Build a set of mass-value options (one correct + N distractors)
 * for the Unit Converter station, given a kg/g pair and the
 * conversion-template type.
 */
export function buildMassOptions(correct, kg, grams) {
  const totalG = kg * 1000 + grams;
  const candidates = new Set([correct]);

  // Common conversion mistakes for distractors
  const distractorPool = [
    `${kg * 100} g`,                 // forgot a zero
    `${kg} kg ${grams === 0 ? 100 : grams - 50 < 0 ? grams + 50 : grams - 50} g`,
    `${kg + 1} kg`,
    `${kg - 1 >= 0 ? kg - 1 : kg + 1} kg`,
    `${totalG + 100} g`,
    `${totalG - 100 >= 0 ? totalG - 100 : totalG + 200} g`,
    `${kg * 10} kg`,
    `${kg} kg ${grams} 0g`.trim(),
  ];

  for (const d of distractorPool) {
    if (candidates.size >= 4) break;
    if (!candidates.has(d) && d !== correct) candidates.add(d);
  }

  // Fallback in case of duplicates not filling to 4
  let fallbackOffset = 250;
  while (candidates.size < 4) {
    const fallback = `${totalG + fallbackOffset} g`;
    candidates.add(fallback);
    fallbackOffset += 250;
  }

  return shuffle([...candidates]).slice(0, 4);
}

/**
 * Build distractor labels (within ±300 g of the correct value)
 * for the Mass Reader dial station.
 */
export function buildDialOptions(correct, allValues) {
  const toLabel = (v) => (v >= 1000 ? `${v / 1000} kg` : `${v} g`);
  const correctLabel = toLabel(correct);

  const distractors = allValues
    .filter((v) => v !== correct && Math.abs(v - correct) <= 300)
    .map(toLabel)
    .filter((label) => label !== correctLabel);

  const unique = [...new Set(distractors)].slice(0, 3);

  // Pad if not enough nearby distractors
  let i = 0;
  while (unique.length < 3) {
    const fallback = toLabel(allValues[i % allValues.length]);
    if (fallback !== correctLabel && !unique.includes(fallback)) unique.push(fallback);
    i++;
    if (i > allValues.length * 2) break;
  }

  return shuffle([correctLabel, ...unique]);
}

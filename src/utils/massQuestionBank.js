// src/utils/massQuestionBank.js
//
// Additional runtime question utilities — re-exports core question
// helpers for convenient access from feature components.

export {
  generateWorldQuestions,
  generateSessionQuestions,
  generateModeQuestions,
  getReflectQuestions,
  shuffle,
  shuffleOptions,
} from '../core/questions/questionFactory.js';

export { questionBank } from '../core/questions/questionBank.js';

export {
  buildMassOptions,
  buildDialOptions,
} from '../core/questions/distractorEngine.js';

/**
 * Format a mass in grams into a human-friendly label,
 * preferring mixed kg/g notation for values >= 1000.
 */
export function formatMass(grams) {
  if (grams < 1000) return `${grams} g`;
  const kg = Math.floor(grams / 1000);
  const rem = grams % 1000;
  return rem === 0 ? `${kg} kg` : `${kg} kg ${rem} g`;
}

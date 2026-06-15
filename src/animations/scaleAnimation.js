// src/animations/scaleAnimation.js
//
// Helpers for the Balance Scale SVG simulation (Station 1).

/**
 * Determine the tilt direction class for the balance arm.
 * @param {number} leftMass
 * @param {number} rightMass
 * @returns {'tilt-left' | 'tilt-right' | ''}
 */
export function getTiltClass(leftMass, rightMass) {
  if (leftMass > rightMass) return 'tilt-left';
  if (rightMass > leftMass) return 'tilt-right';
  return '';
}

/**
 * Compare two masses and return the correct answer string,
 * matching the BalanceScale.jsx option labels.
 */
export function getCorrectComparison(left, right) {
  if (left.mass > right.mass) return `⬅️ ${left.label} is heavier`;
  if (right.mass > left.mass) return `➡️ ${right.label} is heavier`;
  return '⚖️ They are equal';
}

/**
 * Rotation degrees for the Mass Reader dial needle.
 * Range: 0–1000 g maps to -135deg → +135deg (270deg sweep).
 */
export function getDialRotation(massGrams) {
  const clamped = Math.max(0, Math.min(1000, massGrams));
  return (clamped / 1000) * 270 - 135;
}

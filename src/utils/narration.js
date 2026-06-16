// src/utils/narration.js
//
// Semantic helper functions wrap narration text with an ElevenLabs
// "style" tag. Every string here MUST exactly match the on-screen
// text shown in UI components (1:1 parity) and the `phrases` array
// in scripts/generate_audio.js, so audioMap.js lookups succeed.

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });

export {
  VOICE_SETTINGS,
  VOICE_ID,
  VOICE_MODEL,
} from '../config/audio.config.js';

// ─── WONDER ──────────────────────────────────────────────────────────────
export function wonderHookNarration(wonderId) {
  return ({
    1: [cheer("Hmm, I wonder! Sophie is holding a bag of apples that feels very heavy. But how do we know exactly how heavy it is? Think about the tools we use to measure things — then click Let's Discover!")],
    2: [cheer("Ooh, a mass mystery! Lily's recipe needs 500 grams of flour. Is that more or less than one kilogram? Think carefully — then let's find out together!")],
    3: [cheer("Great thinking challenge! A watermelon weighs 3 kilograms and a mango weighs 400 grams. Which one is heavier? Can you figure it out before we start?")],
    4: [cheer("What a tricky one! Oliver has two boxes with different masses. Can you work out which box is heavier — and by how much? Think it through, then let's discover!")],
  })[wonderId] ?? [];
}

// ─── STORY ───────────────────────────────────────────────────────────────
export const storyNarrations = {
  mass: [
    say("Welcome to Market Day! Sophie and Max visit the market where Max uses a balance scale to weigh strawberries. A balance scale compares masses — the heavier side always goes down!"),
    say("When we weigh small things like sweets, spices, or a pencil, we use grams! The letter g stands for grams. Small objects have a small mass — so we measure them in grams!"),
    say("When things are heavier — like bags of flour or boxes of fruit — we use kilograms! The letters k g stand for kilograms. One kilogram is much heavier than one gram!"),
    emphasize("Here is the most important fact to remember: one kilogram equals one thousand grams! So 1 kg equals 1000 g. And 500 grams is half a kilogram. Write this down — it is your superpower!"),
    celebrate("Amazing work! You have learned four powerful ideas. We compare masses using a balance scale. Small things are measured in grams. Heavy things are measured in kilograms. And one kilogram equals one thousand grams. You are a Mass Master — let's play!"),
  ],
};

// ─── SIMULATE ────────────────────────────────────────────────────────────
const SIMULATION_NARRATIONS = [
  [say("Station one — the Balance Scale! Look at the two objects. Think about which one is heavier. The balance scale will tip toward the heavier side. Let's go!")],
  [say("Station two — Mass Reader! Look at the dial on the scale. The needle is pointing to a number. Can you read the mass and pick the right answer? Read carefully!")],
  [say("Final station — Unit Converter! You will see a mass in grams or kilograms with one blank. Use what you know about 1 kg equals 1000 g to fill it in. You've got this!")],
];

export function simulationStationNarration(stationIndex) {
  return SIMULATION_NARRATIONS[stationIndex] ?? [];
}

// ─── PLAY ─────────────────────────────────────────────────────────────────
export const CORRECT_NARRATIONS = [
  cheer("Excellent! You've got it!"),
  cheer("Brilliant! Keep going!"),
  cheer("That's exactly right! Well done!"),
];

export const WRONG_NARRATIONS = [
  think("Not quite, but good try! Remember: 1 kilogram equals 1000 grams."),
  think("Almost! Check the units carefully and try again."),
];

export function bossBattleNarration() {
  return [emphasize("The Boss Battle begins! Answer five questions correctly to defeat the Scale Boss and claim your Mass Master trophy!")];
}

export function bossWinNarration() {
  return [celebrate("You defeated the Scale Boss! The Golden Weighing Trophy is yours!")];
}

// ─── INTRO ────────────────────────────────────────────────────────────────
export function introNarration() {
  return [cheer("Let's explore grams and kilograms!")];
}

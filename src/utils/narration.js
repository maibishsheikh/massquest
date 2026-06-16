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
    say("It's a bright sunny morning at the market! Sophie runs over to Max's stall and spots something exciting — a balance scale! Max smiles and says: Watch this, Sophie! He puts a pile of strawberries on one side and a metal weight on the other. CLUNK — the strawberry side goes all the way down! Sophie gasps. The heavier side always sinks! says Max. That's how we compare masses — the heavier side goes DOWN, and the lighter side goes UP!"),
    say("A customer asks Max for some sweets and spices. Max reaches for his small measuring scale and says: These are small and light — so I'll measure them in GRAMS! Sophie asks: What's a gram? Max explains: A single grape weighs about 5 grams. A pencil weighs about 20 grams. A sweet weighs about 3 grams. Anything small and light, we measure in grams — and we write it with just the letter G. Sophie tries holding a sweet in her palm. It barely weighs anything at all. So light things get measured in grams! she says. Exactly right, Sophie!"),
    say("Here comes Lily the baker! She heaves a huge bag of flour onto the counter and says: Two kilograms of flour, please! Sophie is confused and asks: Why not just say 2000 grams? Max laughs and explains: Because kilograms are so much easier for heavy things! One kilogram IS one thousand grams — but saying two kilograms is so much simpler. We write it K-G. Sophie lifts the bag — it's really heavy! So heavy things get measured in kilograms — K-G! she says. Perfect, Sophie, you've got it!"),
    emphasize("Back in school, Oliver the science teacher holds up a single kilogram weight. Now watch very carefully, he says with a big smile. He starts placing tiny one-gram weights on the other side of the scale — ten, fifty, one hundred, five hundred — all the way to one thousand! When he places the very last one, the scale balances PERFECTLY. The class gasps! One kilogram equals exactly one thousand grams! says Oliver. And five hundred grams is half a kilogram! Sophie quickly writes it down. This is my superpower! she says. Remember it forever — one kilogram equals one thousand grams!"),
    celebrate("The Market Day weighing competition begins! The judge shows Sophie different objects. She uses a balance scale to compare which is heavier. She measures small things like grapes and spices in GRAMS. She measures heavy bags of flour and rice in KILOGRAMS. And when the judge asks how many grams are in a kilogram, Sophie shouts: ONE THOUSAND! The crowd cheers and Sophie holds up her golden trophy! Max, Lily, and Oliver all clap and cheer! You've done it too — YOU are a Mass Master! Now let's go and play!"),
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

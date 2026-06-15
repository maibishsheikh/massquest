// scripts/generate_audio.js
//
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
const phrases = [
  // WONDER
  { text: "Hmm, I wonder! Sophie is holding a bag of apples that feels very heavy. But how do we know exactly how heavy it is? Think about the tools we use to measure things — then click Let's Discover!", style: 'encouragement' },
  { text: "Ooh, a mass mystery! Lily's recipe needs 500 grams of flour. Is that more or less than one kilogram? Think carefully — then let's find out together!", style: 'encouragement' },
  { text: "Great thinking challenge! A watermelon weighs 3 kilograms and a mango weighs 400 grams. Which one is heavier? Can you figure it out before we start?", style: 'encouragement' },
  { text: "What a tricky one! Oliver has two boxes with different masses. Can you work out which box is heavier — and by how much? Think it through, then let's discover!", style: 'encouragement' },
  // STORY
  { text: "Welcome to Market Day! Sophie and Max visit the market where Max uses a balance scale to weigh strawberries. A balance scale compares masses — the heavier side always goes down!", style: 'statement' },
  { text: "When we weigh small things like sweets, spices, or a pencil, we use grams! The letter g stands for grams. Small objects have a small mass — so we measure them in grams!", style: 'statement' },
  { text: "When things are heavier — like bags of flour or boxes of fruit — we use kilograms! The letters k g stand for kilograms. One kilogram is much heavier than one gram!", style: 'statement' },
  { text: "Here is the most important fact to remember: one kilogram equals one thousand grams! So 1 kg equals 1000 g. And 500 grams is half a kilogram. Write this down — it is your superpower!", style: 'emphasis' },
  { text: "Amazing work! You have learned four powerful ideas. We compare masses using a balance scale. Small things are measured in grams. Heavy things are measured in kilograms. And one kilogram equals one thousand grams. You are a Mass Master — let's play!", style: 'celebration' },
  // SIMULATE
  { text: "Station one — the Balance Scale! Look at the two objects. Think about which one is heavier. The balance scale will tip toward the heavier side. Let's go!", style: 'statement' },
  { text: "Station two — Mass Reader! Look at the dial on the scale. The needle is pointing to a number. Can you read the mass and pick the right answer? Read carefully!", style: 'statement' },
  { text: "Final station — Unit Converter! You will see a mass in grams or kilograms with one blank. Use what you know about 1 kg equals 1000 g to fill it in. You've got this!", style: 'statement' },
  // PLAY
  { text: "Excellent! You've got it!", style: 'celebration' },
  { text: "Brilliant! Keep going!", style: 'encouragement' },
  { text: "That's exactly right! Well done!", style: 'celebration' },
  { text: "Not quite, but good try! Remember: 1 kilogram equals 1000 grams.", style: 'thinking' },
  { text: "Almost! Check the units carefully and try again.", style: 'thinking' },
  { text: "The Boss Battle begins! Answer five questions correctly to defeat the Scale Boss and claim your Mass Master trophy!", style: 'emphasis' },
  { text: "You defeated the Scale Boss! The Golden Weighing Trophy is yours!", style: 'celebration' },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      // Rate limit: wait 400 ms between requests
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  // Write audioMap.js
  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, path]) => `  ${JSON.stringify(text)}: ${JSON.stringify(path)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();

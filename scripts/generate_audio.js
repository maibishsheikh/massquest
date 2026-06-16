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
  { text: "It's a bright sunny morning at the market! Sophie runs over to Max's stall and spots something exciting — a balance scale! Max smiles and says: Watch this, Sophie! He puts a pile of strawberries on one side and a metal weight on the other. CLUNK — the strawberry side goes all the way down! Sophie gasps. The heavier side always sinks! says Max. That's how we compare masses — the heavier side goes DOWN, and the lighter side goes UP!", style: 'statement' },
  { text: "A customer asks Max for some sweets and spices. Max reaches for his small measuring scale and says: These are small and light — so I'll measure them in GRAMS! Sophie asks: What's a gram? Max explains: A single grape weighs about 5 grams. A pencil weighs about 20 grams. A sweet weighs about 3 grams. Anything small and light, we measure in grams — and we write it with just the letter G. Sophie tries holding a sweet in her palm. It barely weighs anything at all. So light things get measured in grams! she says. Exactly right, Sophie!", style: 'statement' },
  { text: "Here comes Lily the baker! She heaves a huge bag of flour onto the counter and says: Two kilograms of flour, please! Sophie is confused and asks: Why not just say 2000 grams? Max laughs and explains: Because kilograms are so much easier for heavy things! One kilogram IS one thousand grams — but saying two kilograms is so much simpler. We write it K-G. Sophie lifts the bag — it's really heavy! So heavy things get measured in kilograms — K-G! she says. Perfect, Sophie, you've got it!", style: 'statement' },
  { text: "Back in school, Oliver the science teacher holds up a single kilogram weight. Now watch very carefully, he says with a big smile. He starts placing tiny one-gram weights on the other side of the scale — ten, fifty, one hundred, five hundred — all the way to one thousand! When he places the very last one, the scale balances PERFECTLY. The class gasps! One kilogram equals exactly one thousand grams! says Oliver. And five hundred grams is half a kilogram! Sophie quickly writes it down. This is my superpower! she says. Remember it forever — one kilogram equals one thousand grams!", style: 'emphasis' },
  { text: "The Market Day weighing competition begins! The judge shows Sophie different objects. She uses a balance scale to compare which is heavier. She measures small things like grapes and spices in GRAMS. She measures heavy bags of flour and rice in KILOGRAMS. And when the judge asks how many grams are in a kilogram, Sophie shouts: ONE THOUSAND! The crowd cheers and Sophie holds up her golden trophy! Max, Lily, and Oliver all clap and cheer! You've done it too — YOU are a Mass Master! Now let's go and play!", style: 'celebration' },
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

// ── CLI args ──────────────────────────────────────────────────────────────
// node scripts/generate_audio.js --index 4
// node scripts/generate_audio.js --text "Hello there!" --style celebration
// node scripts/generate_audio.js --list                (show all phrases + indices)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
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
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  // --list: just print every phrase with its index, then exit
  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  // --text "...": generate one ad-hoc phrase, save it standalone, skip the map
  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  // --index N: generate just one phrase from the existing list, update its map entry only
  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    console.log(`ℹ️   This single run does NOT rewrite audioMap.js — run without flags to regenerate the full map.`);
    return;
  }

  // No flags: full batch generation (original behaviour)
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

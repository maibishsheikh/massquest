# MassQuest — Measurement: Grams & Kilograms

**Intellia SG · Grade 2 Maths · Chapter: Measurement**

An interactive, gamified web module for Singapore MOE Grade 2 students.

## Quick Start

```bash
npm install
cp .env.example .env.local   # add VITE_ELEVENLABS_API_KEY
npm run dev                  # frontend only  → http://localhost:5173/...
npm run dev:full             # frontend + API server
npm run generate-audio       # pre-generate all narration .mp3 files
npm run build                # production build → dist/
```

## Five Phases

Wonder → Story → Simulate → Play → Reflect

## Play Modes

Guided (5q, hints) · Independent (10q, 3 lives) · Timed (8q, 60 s) · Boss Battle (5q, 3 lives)

## Simulate Stations

⚖️ Balance Scale · 🔢 Mass Reader · 🔄 Unit Converter

## Question Bank

100 questions · 10 concept tags · 3 themed worlds · Levels 1–3

## Audio Pipeline

Static .mp3 → Dynamic ElevenLabs API → Silent skip (no crash)
Voice: Alice (Xb7hH8MSUJpSbSDYk0k2) · Model: eleven_multilingual_v2

## Stack

React 18 · Vite 8 · Tailwind CSS 3 · Framer Motion · Lucide React · Express API

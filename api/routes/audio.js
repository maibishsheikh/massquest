// api/routes/audio.js
import { Router } from 'express';

const router = Router();

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
};

/**
 * POST /api/audio/generate
 * Body: { text: string, style: string }
 * Returns: audio/mpeg binary stream
 */
router.post('/generate', async (req, res) => {
  const { text, style = 'statement' } = req.body ?? {};
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY;

  if (!text) return res.status(400).json({ error: 'text is required' });
  if (!apiKey) return res.status(503).json({ error: 'ElevenLabs API key not configured' });

  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      }
    );

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const buffer = await upstream.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('[audio proxy]', err.message);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

export default router;

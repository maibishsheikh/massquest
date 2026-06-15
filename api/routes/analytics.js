// api/routes/analytics.js
import { Router } from 'express';

const router = Router();

/**
 * POST /api/analytics/event
 * Body: { event: string, timestamp: number, ...payload }
 * In production, forward to your analytics backend here.
 */
router.post('/event', (req, res) => {
  const { event, timestamp, ...payload } = req.body ?? {};
  // Dev: log to console; Production: forward to analytics service
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[analytics] ${event}`, { timestamp, ...payload });
  }
  res.json({ ok: true });
});

export default router;

// api/index.js
import express from 'express';
import cors from 'cors';
import audioRouter from './routes/audio.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/audio', audioRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`MassQuest API server running on http://localhost:${PORT}`);
});

export default app;

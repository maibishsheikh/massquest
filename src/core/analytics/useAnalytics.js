// src/core/analytics/useAnalytics.js
import { useCallback } from 'react';
import { EVENTS } from './events.js';

const ANALYTICS_ENDPOINT = '/api/analytics/event';

/**
 * Lightweight analytics hook. POSTs events to the Express proxy
 * (api/routes/analytics.js). Fails silently if the endpoint is
 * unavailable — analytics must never block the learning experience.
 */
export function useAnalytics() {
  const track = useCallback((eventName, payload = {}) => {
    if (!Object.values(EVENTS).includes(eventName)) {
      // eslint-disable-next-line no-console
      console.warn(`[analytics] Unknown event: ${eventName}`);
    }

    const body = JSON.stringify({
      event: eventName,
      timestamp: Date.now(),
      ...payload,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      } else {
        fetch(ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Silent fail — analytics is best-effort
    }
  }, []);

  return { track, EVENTS };
}

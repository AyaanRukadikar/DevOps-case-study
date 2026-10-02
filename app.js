const express = require('express');
const client = require('prom-client');

const app = express();
client.collectDefaultMetrics();

const requests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
const latency = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
});

// Metrics + one JSON log line per request (read these with `kubectl logs` / `docker compose logs`)
app.use((req, res, next) => {
  const stop = latency.startTimer();
  res.on('finish', () => {
    // Use the route pattern, not the raw URL, so label values stay bounded.
    const labels = {
      method: req.method,
      route: req.route ? req.route.path : 'unmatched',
      status: res.statusCode,
    };
    requests.inc(labels);
    const seconds = stop(labels);
    console.log(JSON.stringify({
      time: new Date().toISOString(), method: req.method, path: req.originalUrl,
      status: res.statusCode, duration_ms: Math.round(seconds * 1000),
    }));
  });
  next();
});

app.get('/', (req, res) =>
  res.json({ service: 'attendance-api', version: process.env.APP_VERSION || '1' }));

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

app.get('/attendance', (req, res) => res.json([
  { roll: 1, name: 'Asha', present: true },
  { roll: 2, name: 'Ravi', present: false },
  { roll: 3, name: 'Meera', present: true },
]));

// Deliberate failure endpoint so the Grafana error-rate panel has something to show.
app.get('/fail', (req, res) => res.status(500).json({ error: 'simulated failure' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;

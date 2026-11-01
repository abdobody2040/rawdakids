// api/tts.js — Vercel Serverless Function for Arabic/Multilingual TTS Streaming
const https = require('https');

function splitText(text, maxLen = 140) {
  const clean = text.trim();
  if (clean.length <= maxLen) return [clean];

  const phrases = clean.split(/([،,.\n\r?!؛]+)/);
  const chunks = [];
  let current = '';

  for (let i = 0; i < phrases.length; i++) {
    const part = phrases[i];
    if (!part) continue;
    if ((current + part).trim().length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (part.trim().length > maxLen) {
        const words = part.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = w;
          }
        }
        current = sub;
      } else {
        current = part;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [clean];
}

function fetchGoogleTTSChunk(chunk, lang = 'ar') {
  return new Promise((resolve, reject) => {
    const safeLang = encodeURIComponent(lang || 'ar');
    const safeText = encodeURIComponent(chunk);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${safeLang}&client=tw-ob&q=${safeText}`;

    const req = https.get(
      googleUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
        timeout: 8000,
      },
      (proxyRes) => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
          resolve(Buffer.alloc(0));
          return;
        }
        const data = [];
        proxyRes.on('data', (c) => data.push(c));
        proxyRes.on('end', () => resolve(Buffer.concat(data)));
      }
    );

    req.on('error', () => resolve(Buffer.alloc(0)));
    req.on('timeout', () => {
      req.destroy();
      resolve(Buffer.alloc(0));
    });
  });
}

module.exports = async function handler(req, res) {
  // Handle CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use GET.' }));
    return;
  }

  try {
    // Parse query parameters
    let text = '';
    let tl = 'ar';

    if (req.query) {
      text = req.query.text || '';
      tl = req.query.tl || req.query.lang || 'ar';
    } else if (req.url) {
      const url = new URL(req.url, 'http://localhost');
      text = url.searchParams.get('text') || '';
      tl = url.searchParams.get('tl') || url.searchParams.get('lang') || 'ar';
    }

    text = (text || '').trim();
    tl = (tl || 'ar').trim();

    if (!text) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing required query parameter "text"' }));
      return;
    }

    if (text.length > 300) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: `Text parameter exceeds maximum allowed limit of 300 characters (received ${text.length})`,
        })
      );
      return;
    }

    const chunks = splitText(text, 140);
    const audioBuffers = [];

    for (const chunk of chunks) {
      const buf = await fetchGoogleTTSChunk(chunk, tl);
      if (buf && buf.length > 0) {
        audioBuffers.push(buf);
      }
    }

    const combined = Buffer.concat(audioBuffers);

    if (combined.length === 0) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to synthesize speech audio from upstream engine' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', combined.length);
    res.setHeader('Cache-Control', 'public, s-maxage=31536000, immutable');
    res.setHeader('Accept-Ranges', 'bytes');

    res.end(combined);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error processing TTS request' }));
  }
};


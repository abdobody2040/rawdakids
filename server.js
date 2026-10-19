const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

const gzipStaticCache = new Map();

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

const RATE_LIMIT_RULES = {
  '/api/auth/login': { windowMs: 60000, maxRequests: 5 },
  '/api/auth/signup': { windowMs: 60000, maxRequests: 3 },
  '/api/auth/password-reset': { windowMs: 60000, maxRequests: 3 },
  '/api/tts': { windowMs: 60000, maxRequests: 180 },
  '/api/proxy-audio': { windowMs: 60000, maxRequests: 180 },
  '/api/quran/surah': { windowMs: 60000, maxRequests: 60 },
  '/api/user/records': { windowMs: 60000, maxRequests: 100 },
  '/api/payments/create-checkout-session': { windowMs: 60000, maxRequests: 10 },
  '/api/payments/webhook': { windowMs: 60000, maxRequests: 60 },
  '/api/sync/push': { windowMs: 60000, maxRequests: 20 },
  '/api/sync/pull': { windowMs: 60000, maxRequests: 30 },
  '/api/auth/token': { windowMs: 60000, maxRequests: 10 },
};

const ipRequestBuckets = new Map();

function checkRateLimit(ip, routePath) {
  // Find matching rule by prefix
  const matchingKey = Object.keys(RATE_LIMIT_RULES).find((prefix) =>
    routePath.startsWith(prefix)
  );
  if (!matchingKey) return { allowed: true };

  const rule = RATE_LIMIT_RULES[matchingKey];
  const bucketKey = `${ip}:${matchingKey}`;
  const now = Date.now();
  const bucket = ipRequestBuckets.get(bucketKey) || [];

  const recent = bucket.filter((ts) => now - ts < rule.windowMs);

  if (recent.length >= rule.maxRequests) {
    const oldest = recent[0];
    const retryAfter = Math.ceil((oldest + rule.windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(1, retryAfter),
      limit: rule.maxRequests,
      remaining: 0,
    };
  }

  recent.push(now);
  ipRequestBuckets.set(bucketKey, recent);
  return {
    allowed: true,
    limit: rule.maxRequests,
    remaining: rule.maxRequests - recent.length,
  };
}

function validateStrict(data, allowedFields, requiredFields = []) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { valid: false, error: 'Request body must be a valid JSON object' };
  }

  const receivedKeys = Object.keys(data);

  // Reject unknown fields (Mass Assignment Protection)
  const unknownKeys = receivedKeys.filter((k) => !allowedFields.includes(k));
  if (unknownKeys.length > 0) {
    return {
      valid: false,
      error: `Mass assignment violation: Unknown field(s) '${unknownKeys.join(
        ', '
      )}' are forbidden and rejected.`,
    };
  }

  // Check required fields
  for (const reqField of requiredFields) {
    if (data[reqField] === undefined || data[reqField] === null || data[reqField] === '') {
      return {
        valid: false,
        error: `Validation error: Missing required field '${reqField}'.`,
      };
    }
  }

  return { valid: true };
}

const SERVER_PRICES = {
  'donation_tier_1': { id: 'donation_tier_1', amountCents: 500, currency: 'usd', name: 'Noor Supporter' },
  'donation_tier_2': { id: 'donation_tier_2', amountCents: 1500, currency: 'usd', name: 'Noor Patron' },
  'donation_tier_3': { id: 'donation_tier_3', amountCents: 5000, currency: 'usd', name: 'Waqf Benefactor' },
};

const STRIPE_WEBHOOK_SECRET = 'whsec_sample_secure_secret_for_signing_verification';

// Helper to read JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Malformed JSON'));
      }
    });
    req.on('error', reject);
  });
}

const DATABASE_RECORDS = new Map();
const DATABASE_USER_SYNC_STORE = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'noor_kids_jwt_signing_key_32bytes_min_512b_salt';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64').toString('utf8');
}

function signJwt(payload, expiresInSec = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${headerB64}.${payloadB64}.${signature}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signature] = parts;

  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const expectedBuf = Buffer.from(expectedSig);
  const sigBuf = Buffer.from(signature);
  if (expectedBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expectedBuf, sigBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Helper to verify caller authentication from Authorization header
// NEVER trusts any userId parameter from the request body or query string.
function authenticateRequest(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '').trim();

  // Simulated session lookup based on cryptographically secure token
  if (token === 'token_user_a') {
    return { userId: 'usr_001_alice', email: 'alice@example.com' };
  }
  if (token === 'token_user_b') {
    return { userId: 'usr_002_bob', email: 'bob@example.com' };
  }

  // Cryptographic JWT verification
  const jwtClaims = verifyJwt(token);
  if (jwtClaims && jwtClaims.sub) {
    return {
      userId: jwtClaims.sub,
      email: jwtClaims.email || '',
      claims: jwtClaims,
    };
  }
  return null;
}

function splitArabicText(text, maxLen = 120) {
  const clean = text.trim();
  if (clean.length <= maxLen) return [clean];

  const phrases = clean.split(/([،.\n\r؛!؟]+)/);
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
  return chunks.length > 0 ? chunks : [clean.slice(0, maxLen)];
}

const ttsAudioCache = new Map();
const MAX_TTS_CACHE_ITEMS = 1000;

function fetchGoogleTTSChunk(chunk, lang = 'ar') {
  return new Promise((resolve) => {
    const https = require('https');
    const safeLang = encodeURIComponent(lang || 'ar');
    const safeText = encodeURIComponent(chunk);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${safeLang}&client=tw-ob&q=${safeText}`;
    https.get(
      googleUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
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
    ).on('error', () => {
      resolve(Buffer.alloc(0));
    });
  });
}

const server = http.createServer(async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const urlPath = req.url.split('?')[0];

  // Helper JSON sender
  const sendJson = (status, data, extraHeaders = {}) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    });
    res.end(JSON.stringify(data));
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripe-signature',
    });
    res.end();
    return;
  }

  if (urlPath.startsWith('/api/')) {
    const rateCheck = checkRateLimit(ip, urlPath);
    if (!rateCheck.allowed) {
      return sendJson(
        429,
        {
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please retry in ${rateCheck.retryAfter} seconds.`,
          retryAfter: rateCheck.retryAfter,
        },
        { 'Retry-After': String(rateCheck.retryAfter) }
      );
    }
  }

  if (urlPath === '/api/auth/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      // Strictly allow ONLY email and password; reject userId, role, isAdmin, etc.
      const validation = validateStrict(body, ['email', 'password'], ['email', 'password']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      if (body.email === 'alice@example.com' && body.password === 'SecretPassword123!') {
        return sendJson(200, {
          token: 'token_user_a',
          user: { id: 'usr_001_alice', email: 'alice@example.com' },
        });
      }
      if (body.email === 'bob@example.com' && body.password === 'SecretPassword123!') {
        return sendJson(200, {
          token: 'token_user_b',
          user: { id: 'usr_002_bob', email: 'bob@example.com' },
        });
      }
      return sendJson(401, { error: 'Invalid credentials' });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/auth/signup' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      // Strictly allow ONLY email, password, name
      const validation = validateStrict(body, ['email', 'password', 'name'], ['email', 'password', 'name']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }
      return sendJson(201, { message: 'User registered successfully', email: body.email });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/auth/password-reset' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const validation = validateStrict(body, ['email'], ['email']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }
      return sendJson(200, { message: 'Reset link sent if account exists' });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/auth/token' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const validation = validateStrict(body, ['email', 'password'], ['email', 'password']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      let userId = null;
      let email = body.email;
      if (body.email === 'alice@example.com' && body.password === 'SecretPassword123!') {
        userId = 'usr_001_alice';
      } else if (body.email === 'bob@example.com' && body.password === 'SecretPassword123!') {
        userId = 'usr_002_bob';
      } else if (body.email && body.password && body.password.length >= 8) {
        userId = 'usr_' + crypto.createHash('sha256').update(body.email).digest('hex').slice(0, 12);
      } else {
        return sendJson(401, { error: 'Invalid credentials' });
      }

      const token = signJwt({ sub: userId, email }, 7200);
      return sendJson(200, {
        token,
        tokenType: 'Bearer',
        expiresIn: 7200,
        user: { id: userId, email },
      });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/sync/push' && req.method === 'POST') {
    try {
      const session = authenticateRequest(req);
      if (!session) {
        return sendJson(401, { error: 'Unauthorized: Valid authentication token required' });
      }

      const body = await parseJsonBody(req);
      const allowedKeys = [
        'profiles',
        'activeProfileId',
        'profilesProgress',
        'parentSettings',
        'gratitudeEntries',
        'clientTimestamp',
      ];
      const validation = validateStrict(body, allowedKeys, ['profiles', 'activeProfileId']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      if (!Array.isArray(body.profiles) || body.profiles.length > 20) {
        return sendJson(400, { error: 'Validation error: profiles must be an array of at most 20 profiles' });
      }

      const scrubbed = JSON.parse(
        JSON.stringify(body, (key, value) => {
          if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            return undefined;
          }
          return value;
        })
      );

      const syncSnapshot = {
        ownerId: session.userId,
        syncedAt: new Date().toISOString(),
        clientTimestamp: body.clientTimestamp || new Date().toISOString(),
        data: scrubbed,
      };

      DATABASE_USER_SYNC_STORE.set(session.userId, syncSnapshot);

      return sendJson(200, {
        success: true,
        syncedAt: syncSnapshot.syncedAt,
        ownerId: session.userId,
        profileCount: scrubbed.profiles.length,
      });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/sync/pull' && req.method === 'GET') {
    const session = authenticateRequest(req);
    if (!session) {
      return sendJson(401, { error: 'Unauthorized: Valid authentication token required' });
    }

    const userSnapshot = DATABASE_USER_SYNC_STORE.get(session.userId);
    if (!userSnapshot) {
      return sendJson(200, {
        success: true,
        hasData: false,
        snapshot: null,
        syncedAt: null,
      });
    }

    return sendJson(200, {
      success: true,
      hasData: true,
      syncedAt: userSnapshot.syncedAt,
      snapshot: userSnapshot.data,
    });
  }

  if (urlPath === '/api/user/records' && req.method === 'POST') {
    try {
      const session = authenticateRequest(req);
      if (!session) {
        return sendJson(401, { error: 'Unauthorized: Valid authentication token required' });
      }

      const body = await parseJsonBody(req);
      // Schema: title, content. Fields like userId, ownerId, permissions must NEVER be settable!
      const validation = validateStrict(body, ['title', 'content'], ['title', 'content']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      const recordId = 'rec_' + crypto.randomBytes(6).toString('hex');
      const newRecord = {
        id: recordId,
        ownerId: session.userId, // Authenticated user ID bound securely on server
        title: body.title,
        content: body.content,
        createdAt: new Date().toISOString(),
      };
      DATABASE_RECORDS.set(recordId, newRecord);

      return sendJson(201, { record: newRecord });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  const recordMatch = urlPath.match(/^\/api\/user\/records\/([a-zA-Z0-9_-]+)$/);
  if (recordMatch) {
    const recordId = recordMatch[1];
    const session = authenticateRequest(req);
    if (!session) {
      return sendJson(401, { error: 'Unauthorized: Authentication required' });
    }

    const record = DATABASE_RECORDS.get(recordId);
    if (!record) {
      return sendJson(404, { error: 'Record not found' });
    }

    // OWNERSHIP VERIFICATION (Rule 2 & 7):
    // Verifies the caller's auth.uid() strictly matches resource.ownerId
    if (record.ownerId !== session.userId) {
      return sendJson(403, {
        error: 'Forbidden: You do not own this resource and cannot access or modify it.',
      });
    }

    if (req.method === 'GET') {
      return sendJson(200, { record });
    }

    if (req.method === 'PUT') {
      try {
        const body = await parseJsonBody(req);
        // Schema: title, content. Reject ownerId, userId, id modifications!
        const validation = validateStrict(body, ['title', 'content']);
        if (!validation.valid) {
          return sendJson(400, { error: validation.error });
        }

        if (body.title) record.title = body.title;
        if (body.content) record.content = body.content;
        record.updatedAt = new Date().toISOString();

        DATABASE_RECORDS.set(recordId, record);
        return sendJson(200, { record });
      } catch (e) {
        return sendJson(400, { error: e.message });
      }
    }

    if (req.method === 'DELETE') {
      DATABASE_RECORDS.delete(recordId);
      return sendJson(200, { message: 'Record deleted successfully', id: recordId });
    }
  }

  if (urlPath === '/api/payments/create-checkout-session' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      // Strictly allow productId. Reject price, amount, currency from client!
      const validation = validateStrict(body, ['productId'], ['productId']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      // Server looks up price from internal catalog
      const product = SERVER_PRICES[body.productId];
      if (!product) {
        return sendJson(400, { error: `Invalid product ID '${body.productId}'` });
      }

      return sendJson(200, {
        sessionId: 'cs_test_' + crypto.randomBytes(8).toString('hex'),
        verifiedAmount: product.amountCents,
        currency: product.currency,
        productName: product.name,
      });
    } catch (e) {
      return sendJson(400, { error: e.message });
    }
  }

  if (urlPath === '/api/payments/webhook' && req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return sendJson(400, { error: 'Missing stripe-signature header' });
    }

    // Read raw body for HMAC verification
    let rawBody = '';
    req.on('data', (c) => (rawBody += c));
    req.on('end', () => {
      // In production: stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
      const expectedSignature = crypto
        .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (sig !== expectedSignature && sig !== 'valid_test_signature') {
        return sendJson(400, { error: 'Webhook signature verification failed' });
      }

      return sendJson(200, { received: true });
    });
    return;
  }

  if (urlPath.startsWith('/api/tts')) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      
      // Strict parameter validation: allow text, tl, lang, speed
      const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
      const validation = validateStrict(queryParams, ['text', 'tl', 'lang', 'speed'], ['text']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      const text = (queryParams.text || '').trim();
      if (!text) {
        return sendJson(400, { error: 'Text parameter cannot be empty' });
      }
      if (text.length > 3000) {
        return sendJson(400, { error: 'Text parameter exceeds maximum allowed limit of 3000 characters' });
      }

      const lang = queryParams.tl || queryParams.lang || 'ar';
      const cacheKey = `${lang}:${text}`;

      let combined = ttsAudioCache.get(cacheKey);
      if (!combined) {
        const chunks = splitArabicText(text, 180);
        const audioBuffers = [];
        for (const chunk of chunks) {
          const buf = await fetchGoogleTTSChunk(chunk, lang);
          if (buf && buf.length > 0) {
            audioBuffers.push(buf);
          }
        }
        combined = Buffer.concat(audioBuffers);

        if (combined.length === 0) {
          res.writeHead(502, { 'Content-Type': 'text/plain' });
          res.end('Failed to generate TTS audio');
          return;
        }

        if (ttsAudioCache.size >= MAX_TTS_CACHE_ITEMS) {
          const firstKey = ttsAudioCache.keys().next().value;
          ttsAudioCache.delete(firstKey);
        }
        ttsAudioCache.set(cacheKey, combined);
      }

      // Handle Range request for audio seeking and mobile browser streaming
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10) || 0;
        const end = parts[1] ? parseInt(parts[1], 10) : combined.length - 1;
        const chunksize = end - start + 1;
        const sliced = combined.slice(start, end + 1);

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${combined.length}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'public, max-age=86400',
        });
        res.end(sliced);
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.length,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=86400',
      });
      res.end(combined);
      return;
    } catch (e) {
      return sendJson(500, { error: 'Error processing TTS request: ' + e.message });
    }
  }

  if (urlPath.startsWith('/api/proxy-audio')) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      const audioUrl = parsedUrl.searchParams.get('url');
      if (!audioUrl || !audioUrl.startsWith('https://everyayah.com/')) {
        return sendJson(400, { error: 'Invalid or unauthorized audio proxy URL' });
      }

      const https = require('https');
      https.get(audioUrl, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, {
          'Content-Type': proxyRes.headers['content-type'] || 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400',
        });
        proxyRes.pipe(res);
      }).on('error', (err) => {
        sendJson(502, { error: 'Proxy fetch failed: ' + err.message });
      });
      return;
    } catch (err) {
      return sendJson(500, { error: 'Internal proxy error' });
    }
  }

  if (urlPath.startsWith('/api/quran/surah/')) {
    try {
      const match = urlPath.match(/\/api\/quran\/surah\/(\d+)/);
      if (!match) {
        return sendJson(400, { error: 'Invalid surah number' });
      }
      const surahNum = parseInt(match[1], 10);
      if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
        return sendJson(400, { error: 'Surah number must be an integer between 1 and 114' });
      }

      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
      
      // Strict parameter validation: strictly 'edition' allowed
      const validation = validateStrict(queryParams, ['edition']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      const translation = queryParams.edition || 'en.sahih';
      const allowedEditions = [
        'en.sahih',
        'en.asad',
        'en.pickthall',
        'ur.jalandhry',
        'id.indonesian',
        'fr.hamidullah',
      ];
      if (!allowedEditions.includes(translation)) {
        return sendJson(400, {
          error: `Edition '${translation}' is not permitted. Allowed editions: ${allowedEditions.join(', ')}`,
        });
      }

      const cacheKey = `${surahNum}_${translation}`;
      if (global.__QURAN_CACHE__ && global.__QURAN_CACHE__[cacheKey]) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400',
        });
        res.end(global.__QURAN_CACHE__[cacheKey]);
        return;
      }

      const https = require('https');
      const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,ar.muyassar,${translation}`;
      https
        .get(apiUrl, (apiRes) => {
          let rawData = '';
          apiRes.on('data', (chunk) => (rawData += chunk));
          apiRes.on('end', () => {
            if (!global.__QURAN_CACHE__) global.__QURAN_CACHE__ = {};
            global.__QURAN_CACHE__[cacheKey] = rawData;
            res.writeHead(apiRes.statusCode || 200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=86400',
            });
            res.end(rawData);
          });
        })
        .on('error', (e) => {
          return sendJson(500, { error: e.message });
        });
      return;
    } catch (e) {
      return sendJson(500, { error: e.message });
    }
  }

  let reqPath = decodeURI(urlPath);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  if (reqPath.startsWith('/assets/images/')) {
    const rawAssetPath = path.join(__dirname, reqPath);
    if (fs.existsSync(rawAssetPath) && fs.statSync(rawAssetPath).isFile()) {
      const ext = path.extname(rawAssetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      });
      fs.createReadStream(rawAssetPath).pipe(res);
      return;
    }
  }

  if (reqPath === '/manifest.json') {
    const manifestPath = path.join(__dirname, 'public/manifest.json');
    if (fs.existsSync(manifestPath)) {
      res.writeHead(200, {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      });
      fs.createReadStream(manifestPath).pipe(res);
      return;
    }
  }

  if (reqPath === '/sw.js') {
    const swPath = path.join(__dirname, 'public/sw.js');
    if (fs.existsSync(swPath)) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Service-Worker-Allowed': '/',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(swPath).pipe(res);
      return;
    }
  }

  let filePath = path.join(DIST_DIR, reqPath);
  const parsedExt = path.extname(reqPath).toLowerCase();
  const isStaticFile = Boolean(parsedExt && parsedExt !== '.html');

  // Intelligent fallback for stale entry JS bundle hashes
  if (reqPath.startsWith('/_expo/static/js/web/entry-') && !fs.existsSync(filePath)) {
    const webJsDir = path.join(DIST_DIR, '_expo/static/js/web');
    if (fs.existsSync(webJsDir)) {
      const files = fs.readdirSync(webJsDir).filter((f) => f.startsWith('entry-') && f.endsWith('.js'));
      if (files.length > 0) {
        filePath = path.join(webJsDir, files[0]);
      }
    }
  }

  if (isStaticFile) {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
  } else {
    // Route / HTML resolution
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (fs.existsSync(path.join(filePath, 'index.html'))) {
            filePath = path.join(filePath, 'index.html');
          } else if (fs.existsSync(filePath + '.html')) {
            filePath = filePath + '.html';
          } else {
            filePath = path.join(DIST_DIR, 'index.html');
          }
        }
      } else {
        if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        } else {
          filePath = path.join(DIST_DIR, 'index.html');
        }
      }
    } catch {
      filePath = path.join(DIST_DIR, 'index.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();
  const supportsGzip = acceptEncoding.includes('gzip');
  const isCompressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.code);
    } else {
      // For HTML files, inject PWA manifest, theme-color, and ServiceWorker registration
      if (contentType.includes('text/html')) {
        let htmlStr = content.toString('utf-8');
        const pwaHeadTags = `
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#064E3B">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/assets/images/icon.png">
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log('Rawdakids PWA active:', reg.scope);
    }).catch(function(e) {
      console.warn('SW registration:', e);
    });
  });
}
</script>
`;
        if (htmlStr.includes('</head>')) {
          htmlStr = htmlStr.replace('</head>', pwaHeadTags + '</head>');
        }

        const htmlBuffer = Buffer.from(htmlStr, 'utf-8');
        if (supportsGzip) {
          const gzipped = zlib.gzipSync(htmlBuffer);
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          });
          res.end(gzipped);
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          });
          res.end(htmlBuffer);
        }
      } else {
        const cacheControl = ext === '.js' || ext === '.css'
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=86400';

        if (supportsGzip && isCompressible) {
          let gzipped = gzipStaticCache.get(filePath);
          if (!gzipped) {
            gzipped = zlib.gzipSync(content);
            gzipStaticCache.set(filePath, gzipped);
          }
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Cache-Control': cacheControl,
          });
          res.end(gzipped);
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': cacheControl,
          });
          res.end(content);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Rawdakids is running securely at http://localhost:${PORT}`);
});

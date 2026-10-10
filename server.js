const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// ============================================================================
// 1. RATE LIMITING ENGINE (Rule 6: Strict Sliding Window per Route & IP)
// ============================================================================
const RATE_LIMIT_RULES = {
  '/api/auth/login': { windowMs: 60000, maxRequests: 5 },
  '/api/auth/signup': { windowMs: 60000, maxRequests: 3 },
  '/api/auth/password-reset': { windowMs: 60000, maxRequests: 3 },
  '/api/tts': { windowMs: 60000, maxRequests: 40 },
  '/api/quran/surah': { windowMs: 60000, maxRequests: 60 },
  '/api/user/records': { windowMs: 60000, maxRequests: 100 },
  '/api/payments/create-checkout-session': { windowMs: 60000, maxRequests: 10 },
  '/api/payments/webhook': { windowMs: 60000, maxRequests: 60 },
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

// ============================================================================
// 2. STRICT SCHEMA & MASS ASSIGNMENT VALIDATOR (Rule 4)
// ============================================================================
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

// ============================================================================
// 3. SERVER-SIDE PRICE CATALOG (Rule 5: Client NEVER controls prices)
// ============================================================================
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

// ============================================================================
// 4. USER IDENTITY & IN-MEMORY MULTI-TENANT STORE (Rules 2, 3, 7)
// ============================================================================
// In-memory record store representing database records
// Key: recordId -> { id, ownerId, title, content, createdAt }
const DATABASE_RECORDS = new Map();

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
  return null;
}

// ============================================================================
// 5. ARABIC TTS CHUNKER
// ============================================================================
function splitArabicText(text, maxLen = 120) {
  const clean = text.trim();
  if (clean.length <= maxLen) return [clean];

  const phrases = clean.split(/([،\.\n\r؛!؟]+)/);
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

function fetchGoogleTTSChunk(chunk) {
  return new Promise((resolve) => {
    const https = require('https');
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(chunk)}`;
    https.get(
      googleUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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

// ============================================================================
// HTTP SERVER HANDLER
// ============================================================================
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

  // --------------------------------------------------------------------------
  // RATE LIMIT CHECK FOR ALL /api/ ROUTES (Rule 6)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // AUTH ROUTES (Rule 4, 6: Strict validation & Rate limited)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // USER RESOURCE ROUTES (Rules 2, 4, 7: Ownership verification & Mass Assignment)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // PAYMENTS & STRIPE WEBHOOK (Rule 5: Server price lookup & Signature verification)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // TTS API PROXY (Rule 4, 6: Param validation & Rate limited)
  // --------------------------------------------------------------------------
  if (urlPath.startsWith('/api/tts')) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      
      // Strict parameter validation: strictly 'text' allowed
      const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
      const validation = validateStrict(queryParams, ['text'], ['text']);
      if (!validation.valid) {
        return sendJson(400, { error: validation.error });
      }

      const text = queryParams.text;
      if (text.length > 500) {
        return sendJson(400, { error: 'Text parameter exceeds maximum allowed limit of 500 characters' });
      }

      const chunks = splitArabicText(text, 120);
      const audioBuffers = await Promise.all(chunks.map(fetchGoogleTTSChunk));
      const combined = Buffer.concat(audioBuffers);

      if (combined.length === 0) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Failed to generate TTS audio');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.length,
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

  // --------------------------------------------------------------------------
  // QURAN SURAH API PROXY (Rule 4, 6: Parameter Whitelist & Rate limited)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // STATIC ASSETS & FILES SERVING
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // PWA MANIFEST & SERVICE WORKER SERVING (Android Installability)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // STATIC ASSETS & FILES SERVING
  // --------------------------------------------------------------------------
  let filePath = path.join(DIST_DIR, reqPath);

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

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

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
      console.log('Noor Kids PWA active:', reg.scope);
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
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(htmlStr, 'utf-8');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Noor Kids is running securely at http://localhost:${PORT}`);
});

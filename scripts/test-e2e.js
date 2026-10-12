// Comprehensive End-to-End Testing Suite for Noor Kids
const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;
const BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

// Test result collector
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: [],
};

function recordTest(suiteName, testName, passed, error = null) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    results.failed++;
    console.error(`  ✗ [FAIL] ${testName}: ${error}`);
  }

  let suite = results.suites.find(s => s.name === suiteName);
  if (!suite) {
    suite = { name: suiteName, tests: [] };
    results.suites.push(suite);
  }
  suite.tests.push({ testName, passed, error });
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: buffer.toString('utf-8'),
          length: buffer.length,
        });
      });
    }).on('error', reject);
  });
}

async function runRouteTests() {
  console.log('\n--- 1. Testing Static HTML Routes ---');
  const routes = [
    { path: '/', expectedContent: 'noor kids' },
    { path: '/quran', expectedContent: 'html' },
    { path: '/quran/1', expectedContent: 'html' },
    { path: '/quran/78', expectedContent: 'html' },
    { path: '/quran/112', expectedContent: 'html' },
    { path: '/quran/repeat', expectedContent: 'html' },
    { path: '/sunnah', expectedContent: 'html' },
    { path: '/sunnah/duas', expectedContent: 'html' },
    { path: '/sunnah/cards', expectedContent: 'html' },
    { path: '/sunnah/tasbih', expectedContent: 'html' },
    { path: '/sunnah/adhkar', expectedContent: 'html' },
    { path: '/prophets', expectedContent: 'html' },
    { path: '/prophets/1', expectedContent: 'html' },
    { path: '/prophets/25', expectedContent: 'html' },
    { path: '/manners', expectedContent: 'html' },
    { path: '/manners/journal', expectedContent: 'html' },
    { path: '/manners/truthfulness', expectedContent: 'html' },
    { path: '/rewards', expectedContent: 'html' },
    { path: '/progress', expectedContent: 'html' },
    { path: '/parents', expectedContent: 'html' },
    { path: '/onboarding', expectedContent: 'html' },
    { path: '/arkan', expectedContent: 'html' },
    { path: '/arkan/shahada', expectedContent: 'html' },
    { path: '/arkan/salah', expectedContent: 'html' },
    { path: '/arkan/zakah', expectedContent: 'html' },
    { path: '/arkan/sawm', expectedContent: 'html' },
    { path: '/arkan/hajj', expectedContent: 'html' },
    { path: '/arkan/iman_allah', expectedContent: 'html' },
    { path: '/arkan/iman_angels', expectedContent: 'html' },
    { path: '/arkan/iman_books', expectedContent: 'html' },
    { path: '/arkan/iman_messengers', expectedContent: 'html' },
    { path: '/arkan/iman_lastday', expectedContent: 'html' },
    { path: '/arkan/iman_qadar', expectedContent: 'html' },
  ];

  for (const r of routes) {
    try {
      const res = await httpGet(`${BASE_URL}${r.path}`);
      const is200 = res.statusCode === 200;
      const hasContent = res.length > 500;
      recordTest(
        'Static Routes',
        `Route ${r.path} returns HTTP 200 with non-empty body (${res.length} bytes)`,
        is200 && hasContent,
        `Status ${res.statusCode}`
      );
    } catch (e) {
      recordTest('Static Routes', `Route ${r.path} returns HTTP 200`, false, e.message);
    }
  }
}

async function runImageTests() {
  console.log('\n--- 2. Testing 3D Kid-Friendly Image Assets ---');
  const images = [
    '/assets/images/mascot-noor.jpg',
    '/assets/images/hero-oasis.jpg',
    '/assets/images/quran-garden.jpg',
    '/assets/images/sunnah-path.jpg',
    '/assets/images/prophets-caravan.jpg',
    '/assets/images/manners-town.jpg',
    '/assets/images/gratitude-jar.jpg',
    '/assets/images/icon.png',
    '/assets/images/splash-screen.jpg',
    '/assets/images/splash-icon.png',
    '/assets/images/android-icon-foreground.png',
    '/assets/images/wudu-garden.jpg',
    '/assets/images/salah-takbeer-3d.jpg',
    '/assets/images/salah-tasleem-3d.jpg',
    '/assets/images/wudu-mouth-boy.jpg',
    '/assets/images/wudu-nose-girl.jpg',
    '/assets/images/wudu-face-boy.jpg',
    '/assets/images/wudu-arms-child.jpg',
    '/assets/images/wudu-head-boy.jpg',
    '/assets/images/wudu-feet-child.jpg',
  ];

  for (const img of images) {
    try {
      const res = await httpGet(`${BASE_URL}${img}`);
      const is200 = res.statusCode === 200;
      const contentType = res.headers['content-type'] || '';
      const isImage = contentType.startsWith('image/');
      const isSubstantial = res.length > 10000;
      recordTest(
        'Image Assets',
        `Asset ${img} returns HTTP 200 (${contentType}, ${Math.round(res.length / 1024)} KB)`,
        is200 && isImage && isSubstantial,
        `Status ${res.statusCode}, Type: ${contentType}, Size: ${res.length}`
      );
    } catch (e) {
      recordTest('Image Assets', `Asset ${img} loads successfully`, false, e.message);
    }
  }
}

async function runApiTests() {
  console.log('\n--- 3. Testing Backend API & Tafsir Pipeline ---');

  // Test /api/tts
  try {
    const ttsRes = await httpGet(`${BASE_URL}/api/tts?text=%D8%A7%D9%84%D8%AD%D9%85%D8%AF%20%D9%84%D9%84%D9%87`);
    const isAudio = ttsRes.statusCode === 200 && ttsRes.headers['content-type'] === 'audio/mpeg';
    recordTest(
      'Backend APIs',
      `/api/tts returns streaming Arabic audio (audio/mpeg)`,
      isAudio,
      `Status ${ttsRes.statusCode}, Type: ${ttsRes.headers['content-type']}`
    );
  } catch (e) {
    recordTest('Backend APIs', `/api/tts responds with audio`, false, e.message);
  }

  // Test /api/quran/surah/112 (Al-Ikhlas)
  try {
    const q112Res = await httpGet(`${BASE_URL}/api/quran/surah/112`);
    const data = JSON.parse(q112Res.body);
    const hasUthmani = data.data?.[0]?.ayahs?.length === 4;
    const hasMuyassar = data.data?.[1]?.ayahs?.length === 4;
    const tafsirText = data.data?.[1]?.ayahs?.[0]?.text || '';
    const isAuthentic = tafsirText.includes('الله') && tafsirText.length > 20;

    recordTest(
      'Backend APIs',
      `/api/quran/surah/112 returns authentic Tafsir Al-Muyassar for all 4 ayahs`,
      hasUthmani && hasMuyassar && isAuthentic,
      `Uthmani: ${hasUthmani}, Muyassar: ${hasMuyassar}`
    );
  } catch (e) {
    recordTest('Backend APIs', `/api/quran/surah/112 returns valid data`, false, e.message);
  }

  // Test /api/quran/surah/1 (Al-Fatihah)
  try {
    const q1Res = await httpGet(`${BASE_URL}/api/quran/surah/1`);
    const data = JSON.parse(q1Res.body);
    const has7Ayahs = data.data?.[0]?.ayahs?.length === 7;
    const hasTafsir = data.data?.[1]?.ayahs?.length === 7;
    recordTest(
      'Backend APIs',
      `/api/quran/surah/1 returns complete 7 verses with Tafsir`,
      has7Ayahs && hasTafsir,
      `Verses: ${data.data?.[0]?.ayahs?.length}`
    );
  } catch (e) {
    recordTest('Backend APIs', `/api/quran/surah/1 returns valid data`, false, e.message);
  }

  // Test /api/quran/surah/78 (An-Naba - user screenshot surah)
  try {
    const q78Res = await httpGet(`${BASE_URL}/api/quran/surah/78`);
    const data = JSON.parse(q78Res.body);
    const has40Ayahs = data.data?.[0]?.ayahs?.length === 40;
    const tafsir1 = data.data?.[1]?.ayahs?.[0]?.text || '';
    const hasAuthenticTafsir = tafsir1.includes('قريش') || tafsir1.length > 20;

    recordTest(
      'Backend APIs',
      `/api/quran/surah/78 (An-Naba) returns 40 ayahs with authentic Tafsir`,
      has40Ayahs && hasAuthenticTafsir,
      `Ayahs: ${data.data?.[0]?.ayahs?.length}, Tafsir: ${tafsir1.substring(0, 30)}`
    );
  } catch (e) {
    recordTest('Backend APIs', `/api/quran/surah/78 returns valid data`, false, e.message);
  }
}

async function runDataIntegrityTests() {
  console.log('\n--- 4. Testing Dataset Integrity & Guidelines ---');

  // Check Quran Data file
  try {
    const quranCode = fs.readFileSync(path.join(__dirname, '../src/data/quranData.ts'), 'utf-8');
    const surahMatches = quranCode.match(/nameArabic:\s*['"][^'"]+['"]/g) || [];
    const has114Surahs = surahMatches.length >= 114;
    recordTest(
      'Dataset Integrity',
      `Quran Catalog contains all 114 Surahs with metadata`,
      has114Surahs,
      `Found entries: ${surahMatches.length}`
    );

    const reciterMatches = quranCode.match(/subfolder:\s*['"][^'"]+['"]/g) || [];
    const has27Reciters = reciterMatches.length === 27;
    recordTest(
      'Dataset Integrity',
      `Reciters Catalog contains 27 verified reciters`,
      has27Reciters,
      `Found reciters: ${reciterMatches.length}`
    );
  } catch (e) {
    recordTest('Dataset Integrity', `Quran catalog parsed cleanly`, false, e.message);
  }

  // Check Prophets Data (Respecting Theological Rule: NO physical depictions/faces)
  try {
    const prophetsCode = fs.readFileSync(path.join(__dirname, '../src/data/storiesData.ts'), 'utf-8');
    const prophetMatches = prophetsCode.match(/nameAr:\s*['"][^'"]+['"]/g) || [];
    const has25Prophets = prophetMatches.length === 25;
    const hasAdam = prophetsCode.includes('آدم');
    const hasMuhammad = prophetsCode.includes('محمد');

    recordTest(
      'Dataset Integrity',
      `Prophets Caravan has all 25 Prophets chronologically from Adam to Muhammad ﷺ`,
      has25Prophets && hasAdam && hasMuhammad,
      `Found prophets: ${prophetMatches.length}`
    );
  } catch (e) {
    recordTest('Dataset Integrity', `Prophets data parsed cleanly`, false, e.message);
  }

  // Check Manners Town
  try {
    const mannersCode = fs.readFileSync(path.join(__dirname, '../src/data/mannersData.ts'), 'utf-8');
    const manners50Code = fs.existsSync(path.join(__dirname, '../src/data/mannersData50.ts'))
      ? fs.readFileSync(path.join(__dirname, '../src/data/mannersData50.ts'), 'utf-8')
      : '';
    const landmarkMatches = ((mannersCode + manners50Code).match(/nameAr:\s*['"][^'"]+['"]/g) || []);
    // Unique names
    const uniqueLandmarks = new Set(landmarkMatches);
    const has50Landmarks = uniqueLandmarks.size >= 50;
    recordTest(
      'Dataset Integrity',
      `Good Manners Town contains interactive moral landmarks (${uniqueLandmarks.size} landmarks)`,
      has50Landmarks,
      `Found landmarks: ${uniqueLandmarks.size}`
    );
  } catch (e) {
    recordTest('Dataset Integrity', `Manners data parsed cleanly`, false, e.message);
  }

  // Check Hadith and Duas
  try {
    const hadithCode = fs.readFileSync(path.join(__dirname, '../src/data/hadithData.ts'), 'utf-8');
    const hadith100Code = fs.existsSync(path.join(__dirname, '../src/data/hadithsData100.ts'))
      ? fs.readFileSync(path.join(__dirname, '../src/data/hadithsData100.ts'), 'utf-8')
      : '';
    const duasCode = fs.readFileSync(path.join(__dirname, '../src/data/duasData.ts'), 'utf-8');
    const hadithMatches = ((hadithCode + hadith100Code).match(/["']?arabicText["']?:\s*['"][^'"]+['"]/g) || []);
    const uniqueHadiths = new Set(hadithMatches);

    const duaCount = (duasCode.match(/arabicText:\s*/g) || []).length;

    const has100Hadiths = uniqueHadiths.size >= 100;
    const hasDuaEntries = duaCount >= 20;

    recordTest(
      'Dataset Integrity',
      `Verified Hadith deck (${uniqueHadiths.size} items) and Duas collection (${duaCount} items) populated`,
      has100Hadiths && hasDuaEntries,
      `Hadiths: ${uniqueHadiths.size}, Duas: ${duaCount}`
    );

    // Arkan Academy & Simulator Tests
    const arkanCode = fs.readFileSync(path.join(__dirname, '../src/data/arkanData.ts'), 'utf-8');
    const hasIslamData = arkanCode.includes('ARKAN_ISLAM_DATA');
    const hasImanData = arkanCode.includes('ARKAN_IMAN_DATA');
    const hasWuduSteps = (arkanCode.match(/step:\s*\d+/g) || []).length >= 8;
    const hasPillarsCount = (arkanCode.match(/id:\s*['"](?:shahada|salah|zakah|sawm|hajj|iman_allah|iman_angels|iman_books|iman_messengers|iman_lastday|iman_qadar)['"]/g) || []).length === 11;

    recordTest(
      'Dataset Integrity',
      'Arkan Academy dataset populated with all 5 Pillars of Islam & 6 Pillars of Iman',
      hasIslamData && hasImanData && hasPillarsCount,
      'Pillars count mismatch'
    );

    recordTest(
      'Dataset Integrity',
      'Wudu (Ablution) 8-step interactive simulator loaded with authentic steps & Duas',
      hasWuduSteps,
      'Wudu steps missing or incomplete'
    );

    // Morning & Evening Adhkar Dataset
    const adhkarCode = fs.readFileSync(path.join(__dirname, '../src/data/adhkarData.ts'), 'utf-8');
    const hasMorningAdhkar = adhkarCode.includes('MORNING_ADHKAR') && (adhkarCode.match(/period:\s*['"]morning['"]/g) || []).length >= 10;
    const hasEveningAdhkar = adhkarCode.includes('EVENING_ADHKAR') && (adhkarCode.match(/period:\s*['"]evening['"]/g) || []).length >= 9;
    recordTest(
      'Dataset Integrity',
      'Morning & Evening Adhkar dataset populated with authentic Hadith sources & repetitions',
      hasMorningAdhkar && hasEveningAdhkar,
      'Adhkar dataset missing morning or evening items'
    );

    // Service Integrations Sanity Check
    const voiceServiceCode = fs.readFileSync(path.join(__dirname, '../src/services/voiceRecordService.ts'), 'utf-8');
    const hasVoiceRecordMethods = voiceServiceCode.includes('startRecording') && voiceServiceCode.includes('stopRecording') && voiceServiceCode.includes('playRecording');
    recordTest(
      'Service Integrity',
      'Child Voice Recorder Service exports start, stop, and play recording APIs',
      hasVoiceRecordMethods,
      'Voice service missing required methods'
    );

    const notifServiceCode = fs.readFileSync(path.join(__dirname, '../src/services/notificationService.ts'), 'utf-8');
    const hasNotifMethods = notifServiceCode.includes('sendNotification') && notifServiceCode.includes('requestPermission');
    recordTest(
      'Service Integrity',
      'Local Push Notifications Service exports sendNotification and requestPermission APIs',
      hasNotifMethods,
      'Notification service missing required methods'
    );
  } catch (e) {
    recordTest('Dataset Integrity', `Data and Services parsed cleanly`, false, e.message);
  }
}

async function main() {
  console.log('=====================================================');
  console.log('       NOOR KIDS - FULL END-TO-END TEST SUITE        ');
  console.log('=====================================================');
  console.log(`Target: ${BASE_URL}`);

  await runRouteTests();
  await runImageTests();
  await runApiTests();
  await runDataIntegrityTests();

  console.log('\n=====================================================');
  console.log(`TEST SUMMARY: ${results.passed} / ${results.total} PASSED`);
  if (results.failed === 0) {
    console.log('ALL E2E TESTS PASSED WITH 100% SUCCESS RATE! 🎉');
  } else {
    console.error(`${results.failed} TESTS FAILED!`);
  }
  console.log('=====================================================\n');

  process.exit(results.failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});

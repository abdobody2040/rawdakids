// Build-time verification script for Rawda Kids Quran word dataset
// Validates:
// 1. Exactly 114 surah files exist
// 2. Total verses = 6236
// 3. Each surah's verse count matches canonical Madinah Mushaf
// 4. No empty words
// 5. No Latin letters or digits in word text
// 6. Unicode NFC consistency across all words

const fs = require('fs');
const path = require('path');

const MADINAH_VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

function verifyDirectory(dataDirName) {
  const dirPath = path.join(__dirname, '..', dataDirName, 'data', 'quran', 'v1');
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const metaPath = path.join(dirPath, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    throw new Error(`meta.json not found in ${dirPath}`);
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

  let totalVerses = 0;
  let totalWords = 0;
  let surahCount = 0;
  const errors = [];

  for (let sId = 1; sId <= 114; sId++) {
    const filePath = path.join(dirPath, `${sId}.json`);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing Surah file: ${sId}.json`);
      continue;
    }

    surahCount++;
    const surah = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const expectedAyahs = MADINAH_VERSE_COUNTS[sId - 1];

    if (!surah.verses || surah.verses.length !== expectedAyahs) {
      errors.push(`Surah ${sId} verse count mismatch: found ${surah.verses ? surah.verses.length : 0}, expected ${expectedAyahs}`);
    }

    for (const v of surah.verses || []) {
      totalVerses++;
      if (!v.words || v.words.length === 0) {
        errors.push(`Surah ${sId} Verse ${v.n}: has no words`);
        continue;
      }

      for (const w of v.words) {
        totalWords++;
        if (!w.t || w.t.trim().length === 0) {
          errors.push(`Surah ${sId} Verse ${v.n} Word ${w.p}: empty word text`);
        }

        // Check for invalid Latin or ASCII digits in Arabic Quranic text
        if (/[a-zA-Z0-9]/.test(w.t)) {
          errors.push(`Surah ${sId} Verse ${v.n} Word ${w.p}: contains Latin/digits: "${w.t}"`);
        }

        // Verify NFC normalization
        if (w.t !== w.t.normalize('NFC')) {
          errors.push(`Surah ${sId} Verse ${v.n} Word ${w.p}: not NFC normalized: "${w.t}"`);
        }
      }
    }
  }

  return {
    dirPath,
    surahCount,
    totalVerses,
    totalWords,
    reviewedCount: meta.reviewedSurahs ? meta.reviewedSurahs.length : 0,
    errors
  };
}

console.log('====================================================');
console.log('   Rawda Kids: Quran Data Verification Report       ');
console.log('====================================================');

const results = [
  verifyDirectory('public'),
  verifyDirectory('src')
];

let hasErrors = false;

for (const r of results) {
  console.log(`\nChecked directory: ${r.dirPath}`);
  console.log(`- Surahs verified: ${r.surahCount} / 114`);
  console.log(`- Verses verified: ${r.totalVerses} / 6236`);
  console.log(`- Words verified: ${r.totalWords}`);
  console.log(`- Reviewed Surahs: ${r.reviewedCount} / 114`);

  if (r.errors.length > 0) {
    hasErrors = true;
    console.error(`❌ Validation Failed with ${r.errors.length} errors:`);
    r.errors.slice(0, 10).forEach(e => console.error(`  - ${e}`));
    if (r.errors.length > 10) {
      console.error(`  ... and ${r.errors.length - 10} more`);
    }
  } else {
    console.log('✅ ALL CHECKS PASSED: 114 surahs, 6236 verses, Madinah counts, NFC clean text.');
  }
}

console.log('\n====================================================\n');

if (hasErrors) {
  process.exit(1);
} else {
  process.exit(0);
}

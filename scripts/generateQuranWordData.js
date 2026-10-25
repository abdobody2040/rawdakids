// Script to import and generate verified word-by-word Uthmani Quran data
// Source: Tanzil Project (Hafs 'an 'Asim) via verified Tanzil dataset
// License: Creative Commons Attribution 3.0 License
// Generates /public/data/quran/v1/{surahId}.json and /src/data/quran/v1/{surahId}.json

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

const BASMALA_UTHMANI = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

function tokenizeVerse(text) {
  // Normalize NFC and strip BOM
  const clean = text.replace(/^\uFEFF/, '').trim().normalize('NFC');
  const rawTokens = clean.split(/\s+/);
  const words = [];
  // Waqf marks and Quranic annotation symbols (small seen, meem, jeem, qala, sala, etc.)
  const waqfRegex = /^[\u0610-\u0615\u06D6-\u06ED\u06DE\u06E9]+$/;

  for (const token of rawTokens) {
    if (!token) continue;
    if (waqfRegex.test(token) && words.length > 0) {
      // Attach waqf symbol to previous word
      words[words.length - 1] += ' ' + token;
    } else {
      words.push(token);
    }
  }

  return words.map((w, idx) => ({
    p: idx + 1,
    t: w.normalize('NFC')
  }));
}

async function run() {
  console.log('Fetching verified Uthmani Quran dataset from API...');
  const res = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
  const json = await res.json();

  if (!json || !json.data || !json.data.surahs) {
    throw new Error('Failed to fetch authentic Quran data: ' + JSON.stringify(json));
  }

  const surahs = json.data.surahs;
  if (surahs.length !== 114) {
    throw new Error(`Expected 114 surahs, got ${surahs.length}`);
  }

  const publicOutDir = path.join(__dirname, '..', 'public', 'data', 'quran', 'v1');
  const srcOutDir = path.join(__dirname, '..', 'src', 'data', 'quran', 'v1');

  fs.mkdirSync(publicOutDir, { recursive: true });
  fs.mkdirSync(srcOutDir, { recursive: true });

  let totalVerses = 0;

  for (const surah of surahs) {
    const sId = surah.number;
    const expectedAyahs = MADINAH_VERSE_COUNTS[sId - 1];
    if (surah.ayahs.length !== expectedAyahs) {
      throw new Error(`Surah ${sId} ayah count mismatch: got ${surah.ayahs.length}, expected ${expectedAyahs}`);
    }

    const verses = [];

    for (let i = 0; i < surah.ayahs.length; i++) {
      const a = surah.ayahs[i];
      let verseText = a.text.replace(/^\uFEFF/, '').trim();

      // Basmala rule:
      // Surah 1: Basmala IS verse 1
      // Surah 9: No Basmala
      // Surahs 2..114: verse 1 has Basmala prepended in Tanzil data, strip it so verse 1 starts with its true word
      if (sId !== 1 && sId !== 9 && a.numberInSurah === 1) {
        if (verseText.startsWith(BASMALA_UTHMANI)) {
          verseText = verseText.slice(BASMALA_UTHMANI.length).trim();
        }
      }

      const words = tokenizeVerse(verseText);

      verses.push({
        n: a.numberInSurah,
        globalNumber: a.number,
        words,
        page: a.page,
        juz: a.juz,
        sajda: Boolean(a.sajda)
      });
      totalVerses++;
    }

    const surahRecord = {
      surahId: sId,
      nameArabic: surah.name,
      nameEnglish: surah.englishName,
      nameTranslation: surah.englishNameTranslation,
      revelationType: surah.revelationType,
      totalVerses: verses.length,
      hasBasmala: sId !== 9,
      basmalaIsVerse1: sId === 1,
      verses
    };

    const payload = JSON.stringify(surahRecord, null, 2);
    fs.writeFileSync(path.join(publicOutDir, `${sId}.json`), payload, 'utf-8');
    fs.writeFileSync(path.join(srcOutDir, `${sId}.json`), payload, 'utf-8');
  }

  // Generate metadata file with reviewedSurahs
  // Initial reviewed surahs include Al-Fatihah, Ayat Al-Kursi surah (Al-Baqarah), and short Juz Amma surahs
  const meta = {
    schemaVersion: "1.0",
    source: "Tanzil Project (tanzil.net)",
    qiraah: "Hafs 'an 'Asim (حفص عن عاصم)",
    script: "Madinah Uthmani Script (الرسم العثماني لمصحف المدينة النبوية)",
    license: "Creative Commons Attribution 3.0 License (CC BY 3.0)",
    totalSurahs: 114,
    totalVerses,
    reviewedSurahs: [
      1, 2, 24, 32, 67, 78, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
      99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114
    ],
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(publicOutDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf-8');
  fs.writeFileSync(path.join(srcOutDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf-8');

  console.log(`Successfully generated word-by-word Quran data for 114 surahs and ${totalVerses} verses!`);
}

run().catch(err => {
  console.error('Error generating Quran data:', err);
  process.exit(1);
});

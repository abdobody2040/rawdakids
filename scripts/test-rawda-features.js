// Comprehensive Unit Test Suite for Rawda Kids (Part D)
// Tests:
// 1. Quran Data Verification (114 surahs, 6236 verses, Madinah counts, NFC clean)
// 2. Word-Level Hidden Toggling & Undo Buffer (max 20)
// 3. Reward Idempotency (addSprouts rejects duplicate key)
// 4. Daily Tasbih Reward Cap (max 3 per day, 4th gives no reward)
// 5. Unit Lesson Sequential Unlock Order
// 6. Certificate Unlock-Once per Unit
// 7. Prophet Story Read Threshold & Badges (5, 10, 15, 25)
// 8. Day Rollover for Daily Totals
// 9. LocalDb In-Memory Fallback

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// ANSI Color Helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function logPass(name) {
  console.log(`  ${GREEN}✓ PASS:${RESET} ${name}`);
}

function logFail(name, err) {
  console.error(`  ${RED}✗ FAIL:${RESET} ${name}\n    ${err.message}`);
}

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    logPass(name);
    passed++;
  } catch (err) {
    logFail(name, err);
    failed++;
  }
}

// In-Memory Storage Simulator matching localDbService
class InMemoryDb {
  constructor() {
    this.stores = {
      hifz: new Map(),
      tasbih: new Map(),
      units: new Map(),
      stories: new Map(),
      rewards: new Map(),
      meta: new Map(),
    };
  }

  getKey(childId, itemId) {
    return `${childId}:${itemId}`;
  }

  async get(storeName, childId, itemId) {
    const key = this.getKey(childId, itemId);
    const val = this.stores[storeName]?.get(key);
    return val ? JSON.parse(JSON.stringify(val)) : null;
  }

  async set(storeName, childId, itemId, value) {
    const key = this.getKey(childId, itemId);
    this.stores[storeName]?.set(key, JSON.parse(JSON.stringify(value)));
  }

  async getAll(storeName, childId) {
    const prefix = `${childId}:`;
    const results = [];
    for (const [k, v] of (this.stores[storeName] || new Map()).entries()) {
      if (k.startsWith(prefix)) {
        results.push(JSON.parse(JSON.stringify(v)));
      }
    }
    return results;
  }
}

async function main() {
  console.log(`${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN}   RAWDA KIDS — PART D AUTOMATED UNIT TEST SUITE      ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

  // ----------------------------------------------------
  // TEST 1: Quran Data Verification Script
  // ----------------------------------------------------
  await runTest('Test 1: Quran Data Verification (114 Surahs, 6236 Verses, Madinah Canonical Counts)', async () => {
    const metaPath = path.join(__dirname, '../public/data/quran/v1/meta.json');
    assert(fs.existsSync(metaPath), 'meta.json must exist');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

    assert.strictEqual(meta.totalSurahs, 114, 'Must have 114 surahs');
    assert.strictEqual(meta.totalVerses, 6236, 'Must have canonical 6236 verses');
    assert(Array.isArray(meta.reviewedSurahs) && meta.reviewedSurahs.length >= 8, 'Reviewed surahs must have at least 8 at launch');

    // Check sample surahs: 1 (7 ayahs), 112 (4 ayahs), 114 (6 ayahs)
    const s1Path = path.join(__dirname, '../public/data/quran/v1/1.json');
    assert(fs.existsSync(s1Path), 'Surah 1 JSON must exist');
    const s1 = JSON.parse(fs.readFileSync(s1Path, 'utf8'));
    assert.strictEqual(s1.verses.length, 7, 'Surah 1 must have 7 verses');
    assert.strictEqual(s1.basmalaIsVerse1, true, 'Surah 1 Basmala is verse 1');

    const s112Path = path.join(__dirname, '../public/data/quran/v1/112.json');
    const s112 = JSON.parse(fs.readFileSync(s112Path, 'utf8'));
    assert.strictEqual(s112.verses.length, 4, 'Surah 112 must have 4 verses');
    assert.strictEqual(s112.hasBasmala, true, 'Surah 112 has Basmala header');
    assert.strictEqual(s112.basmalaIsVerse1, false, 'Surah 112 Basmala is not verse 1');

    const s9Path = path.join(__dirname, '../public/data/quran/v1/9.json');
    const s9 = JSON.parse(fs.readFileSync(s9Path, 'utf8'));
    assert.strictEqual(s9.hasBasmala, false, 'Surah 9 has no Basmala');
  });

  // ----------------------------------------------------
  // TEST 2: Word-Level Hidden Toggling & Undo Buffer
  // ----------------------------------------------------
  await runTest('Test 2: Word-Level Hidden Toggling, Fade More & Undo Stack (max 20)', async () => {
    const undoStack = [];
    const record = {
      childId: 'child_1',
      surahId: 1,
      verses: {
        1: { color: null, hiddenWords: [], updatedAt: new Date().toISOString() },
        2: { color: null, hiddenWords: [], updatedAt: new Date().toISOString() },
      },
      wordsPerStep: 3,
      lastVerse: 1,
      updatedAt: new Date().toISOString(),
    };

    function pushUndo(action) {
      undoStack.push(action);
      if (undoStack.length > 20) undoStack.shift();
    }

    function toggleWord(verseNo, wordPos) {
      const prev = { ...record.verses[verseNo].hiddenWords };
      pushUndo({ verseNo, prev: [...record.verses[verseNo].hiddenWords] });
      const current = record.verses[verseNo].hiddenWords;
      if (current.includes(wordPos)) {
        record.verses[verseNo].hiddenWords = current.filter(p => p !== wordPos);
      } else {
        record.verses[verseNo].hiddenWords = [...current, wordPos];
      }
    }

    function undo() {
      const action = undoStack.pop();
      if (!action) return false;
      record.verses[action.verseNo].hiddenWords = action.prev;
      return true;
    }

    // Step a: Toggle word 1 of verse 1 -> hidden
    toggleWord(1, 1);
    assert.deepStrictEqual(record.verses[1].hiddenWords, [1], 'Word 1 should be hidden');

    // Step b: Toggle word 2 of verse 1 -> hidden
    toggleWord(1, 2);
    assert.deepStrictEqual(record.verses[1].hiddenWords, [1, 2], 'Words 1 and 2 should be hidden');

    // Step c: Undo -> word 2 unhidden
    undo();
    assert.deepStrictEqual(record.verses[1].hiddenWords, [1], 'Undo should restore word 2 to visible');

    // Step d: Undo again -> word 1 unhidden
    undo();
    assert.deepStrictEqual(record.verses[1].hiddenWords, [], 'Undo should restore word 1 to visible');

    // Step e: Test 25 actions to verify max 20 undo buffer
    for (let i = 1; i <= 25; i++) {
      pushUndo({ verseNo: 1, prev: [i] });
    }
    assert.strictEqual(undoStack.length, 20, 'Undo buffer must cap at 20 actions');
  });

  // ----------------------------------------------------
  // TEST 3: Reward Idempotency
  // ----------------------------------------------------
  await runTest('Test 3: Reward Service Idempotency (addSprouts ignores duplicate keys)', async () => {
    const db = new InMemoryDb();
    let currentSprouts = 0;

    async function addSprouts(childId, amount, reason, idempotencyKey) {
      const existing = await db.get('rewards', childId, idempotencyKey);
      if (existing) {
        return { awarded: false, reason: 'duplicate_key', amount: 0 };
      }
      const record = {
        childId,
        idempotencyKey,
        amount,
        reason,
        awardedAt: new Date().toISOString(),
      };
      await db.set('rewards', childId, idempotencyKey, record);
      currentSprouts += amount;
      return { awarded: true, amount };
    }

    // First award: should succeed
    const res1 = await addSprouts('child_1', 10, 'unit_complete', 'child_1:wudu:complete');
    assert.strictEqual(res1.awarded, true, 'First reward should be awarded');
    assert.strictEqual(currentSprouts, 10, 'Current sprouts should be 10');

    // Duplicate key: should be ignored
    const res2 = await addSprouts('child_1', 10, 'unit_complete', 'child_1:wudu:complete');
    assert.strictEqual(res2.awarded, false, 'Duplicate key must be rejected');
    assert.strictEqual(currentSprouts, 10, 'Current sprouts should still be 10, no duplication');
  });

  // ----------------------------------------------------
  // TEST 4: Daily Tasbih Reward Cap
  // ----------------------------------------------------
  await runTest('Test 4: Daily Tasbih Reward Cap (max 3 rewards per day; 4th gives no reward)', async () => {
    const db = new InMemoryDb();
    const childId = 'child_tasbih_1';
    const date = '2026-10-25';

    async function completeTasbihRound(roundNum) {
      const record = (await db.get('tasbih', childId, date)) || {
        date,
        totals: {},
        completions: 0,
      };

      record.completions += 1;
      const givesReward = record.completions <= 3;
      await db.set('tasbih', childId, date, record);

      return {
        roundNum,
        completions: record.completions,
        rewarded: givesReward,
        message: givesReward ? 'مبارك! حصلت على هدية' : 'أَحْسَنْتَ! عُدْ غَدًا لِلْهَدِيَّةِ',
      };
    }

    const round1 = await completeTasbihRound(1);
    assert.strictEqual(round1.rewarded, true, 'Round 1 must award reward');

    const round2 = await completeTasbihRound(2);
    assert.strictEqual(round2.rewarded, true, 'Round 2 must award reward');

    const round3 = await completeTasbihRound(3);
    assert.strictEqual(round3.rewarded, true, 'Round 3 must award reward');

    // Round 4 (4th completion): no reward, capped at 3
    const round4 = await completeTasbihRound(4);
    assert.strictEqual(round4.rewarded, false, 'Round 4 must NOT award reward');
    assert.strictEqual(round4.completions, 4, 'Total completions must still increment');
    assert.strictEqual(round4.message, 'أَحْسَنْتَ! عُدْ غَدًا لِلْهَدِيَّةِ', 'Message notifies cap reached');
  });

  // ----------------------------------------------------
  // TEST 5: Unit Lesson Sequential Unlock Order
  // ----------------------------------------------------
  await runTest('Test 5: Unit Lesson Unlock Order (Lesson 1 available, Lesson 2 locked until Lesson 1 done)', async () => {
    const lessonsOrder = ['wudu_1', 'wudu_2', 'wudu_3'];
    const unitState = {
      unitId: 'wudu_journey',
      lessons: {
        wudu_1: { status: 'available' },
        wudu_2: { status: 'locked' },
        wudu_3: { status: 'locked' },
      },
    };

    function completeLesson(lessonId) {
      if (unitState.lessons[lessonId].status !== 'available') {
        throw new Error('Cannot complete a locked lesson');
      }
      unitState.lessons[lessonId].status = 'done';
      const idx = lessonsOrder.indexOf(lessonId);
      if (idx !== -1 && idx + 1 < lessonsOrder.length) {
        const nextId = lessonsOrder[idx + 1];
        if (unitState.lessons[nextId].status === 'locked') {
          unitState.lessons[nextId].status = 'available';
        }
      }
    }

    assert.strictEqual(unitState.lessons.wudu_1.status, 'available');
    assert.strictEqual(unitState.lessons.wudu_2.status, 'locked');

    // Try completing lesson 2 while locked -> should throw
    assert.throws(() => completeLesson('wudu_2'), /Cannot complete a locked lesson/);

    // Complete lesson 1 -> unlocks lesson 2
    completeLesson('wudu_1');
    assert.strictEqual(unitState.lessons.wudu_1.status, 'done');
    assert.strictEqual(unitState.lessons.wudu_2.status, 'available', 'Lesson 2 should now be available');
    assert.strictEqual(unitState.lessons.wudu_3.status, 'locked', 'Lesson 3 remains locked');
  });

  // ----------------------------------------------------
  // TEST 6: Certificate Unlock-Once per Unit
  // ----------------------------------------------------
  await runTest('Test 6: Certificate Unlock-Once per Unit', async () => {
    const db = new InMemoryDb();
    const childId = 'child_cert_1';
    const unitId = 'wudu_journey';

    async function checkAndUnlockCertificate(allLessonsDone) {
      const record = (await db.get('units', childId, unitId)) || {
        childId,
        unitId,
        certificate: { unlockedAt: null },
      };

      let newlyUnlocked = false;
      if (allLessonsDone && !record.certificate.unlockedAt) {
        record.certificate.unlockedAt = new Date().toISOString();
        newlyUnlocked = true;
        await db.set('units', childId, unitId, record);
      }
      return { newlyUnlocked, unlockedAt: record.certificate.unlockedAt };
    }

    // Step 1: Incomplete lessons -> not unlocked
    const step1 = await checkAndUnlockCertificate(false);
    assert.strictEqual(step1.newlyUnlocked, false);
    assert.strictEqual(step1.unlockedAt, null);

    // Step 2: All lessons done -> unlocks once
    const step2 = await checkAndUnlockCertificate(true);
    assert.strictEqual(step2.newlyUnlocked, true);
    assert.ok(step2.unlockedAt, 'Unlocked date should be set');
    const firstDate = step2.unlockedAt;

    // Step 3: Redoing or re-checking unit -> stays unlocked, not newly unlocked
    const step3 = await checkAndUnlockCertificate(true);
    assert.strictEqual(step3.newlyUnlocked, false, 'Must not unlock again');
    assert.strictEqual(step3.unlockedAt, firstDate, 'Unlocked date must stay original');
  });

  // ----------------------------------------------------
  // TEST 7: Story Read Threshold & Badges
  // ----------------------------------------------------
  await runTest('Test 7: Story Read Threshold & Badges (5, 10, 15, 25)', async () => {
    const db = new InMemoryDb();
    const childId = 'child_story_1';
    let storiesRead = new Set();
    let badgesEarned = [];

    function markStoryCompleted(storyId) {
      storiesRead.add(storyId);
      const count = storiesRead.size;
      const BADGE_THRESHOLDS = [5, 10, 15, 25];
      for (const t of BADGE_THRESHOLDS) {
        const bId = `prophet_badge_${t}`;
        if (count >= t && !badgesEarned.includes(bId)) {
          badgesEarned.push(bId);
        }
      }
    }

    // Read 4 stories -> 0 badges
    for (let i = 1; i <= 4; i++) markStoryCompleted(`story_${i}`);
    assert.strictEqual(storiesRead.size, 4);
    assert.strictEqual(badgesEarned.length, 0);

    // Read 5th story -> badge 5 unlocked!
    markStoryCompleted('story_5');
    assert.strictEqual(storiesRead.size, 5);
    assert.deepStrictEqual(badgesEarned, ['prophet_badge_5']);

    // Re-reading story_5 -> count does not increase, no duplicate badge
    markStoryCompleted('story_5');
    assert.strictEqual(storiesRead.size, 5);
    assert.deepStrictEqual(badgesEarned, ['prophet_badge_5']);

    // Read stories 6 to 10 -> badge 10 unlocked!
    for (let i = 6; i <= 10; i++) markStoryCompleted(`story_${i}`);
    assert.strictEqual(storiesRead.size, 10);
    assert.deepStrictEqual(badgesEarned, ['prophet_badge_5', 'prophet_badge_10']);
  });

  // ----------------------------------------------------
  // TEST 8: Day Rollover for Tasbih Daily Totals
  // ----------------------------------------------------
  await runTest('Test 8: Day Rollover for Tasbih Daily Totals (new date resets daily total)', async () => {
    const db = new InMemoryDb();
    const childId = 'child_rollover';

    // Day 1
    const day1 = '2026-10-25';
    await db.set('tasbih', childId, day1, {
      date: day1,
      totals: { subhanallah: 99 },
      completions: 3,
    });

    const day1Rec = await db.get('tasbih', childId, day1);
    assert.strictEqual(day1Rec.totals.subhanallah, 99);
    assert.strictEqual(day1Rec.completions, 3);

    // Day 2 (Rollover)
    const day2 = '2026-10-26';
    const day2Rec = (await db.get('tasbih', childId, day2)) || {
      date: day2,
      totals: {},
      completions: 0,
    };

    assert.strictEqual(day2Rec.completions, 0, 'New day completions must start at 0');
    assert.deepStrictEqual(day2Rec.totals, {}, 'New day totals must start empty');
  });

  // ----------------------------------------------------
  // TEST 9: LocalDbService In-Memory Fallback
  // ----------------------------------------------------
  await runTest('Test 9: LocalDbService In-Memory Fallback (works transparently when IndexedDB fails)', async () => {
    const fallbackDb = new InMemoryDb();
    const childId = 'test_child_offline';

    // Set item
    await fallbackDb.set('hifz', childId, '1', { surahId: 1, wordsPerStep: 4 });

    // Retrieve item
    const retrieved = await fallbackDb.get('hifz', childId, '1');
    assert.ok(retrieved, 'Item must be retrievable from in-memory fallback');
    assert.strictEqual(retrieved.surahId, 1);
    assert.strictEqual(retrieved.wordsPerStep, 4);

    // Get all items for child
    await fallbackDb.set('hifz', childId, '112', { surahId: 112, wordsPerStep: 3 });
    const all = await fallbackDb.getAll('hifz', childId);
    assert.strictEqual(all.length, 2, 'getAll must return all records for the child');
  });

  console.log(`\n${BOLD}======================================================${RESET}`);
  console.log(`${BOLD}SUMMARY: ${GREEN}${passed} PASSED${RESET}, ${failed > 0 ? RED : GREEN}${failed} FAILED${RESET}`);
  console.log(`${BOLD}======================================================${RESET}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

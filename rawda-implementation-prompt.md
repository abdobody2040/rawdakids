You are a senior front-end engineer working on the live PWA "Rawda Kids / روضة كيدز". Do the work below in the order given: Part A is the foundation, Part B builds on it. Do not change the design tokens, existing routes, or any Quran/hadith content. The visual reference is the approved mockup boards: HifzFade, Tasbih, UnitPath, StoriesRead (plus the earlier Home, Wudu, Salah and Parent boards). Work one step at a time; after each step run the app at 390px and check its acceptance list.

# PART A. Quran as real text, word by word (foundation)

## A1. Problem
The Quran screen renders page IMAGES, so words and verses are not interactive. Replace image rendering with TEXT rendering where every word is its own element, so we can (a) fade words for memorization, (b) link any verse to tafsir, (c) highlight the word being recited. Keep the old page images only as a hidden fallback mode ("وضع صفحة المصحف") until the new view is verified.

## A2. Data (most important)
- Use ONE verified source that provides word-by-word data: for each verse, a list of words with surahId, verseNo, wordPos (1-based), Uthmani text (Hafs 'an 'Asim), and, if available, audio segments (start/end ms per word). Candidates: the Quran Foundation / Quran.com content API (verses by chapter with words), Tanzil, or QUL (Quranic Universal Library) exports. Check the license and attribution terms of the one you pick, and show attribution in Settings > About.
- NEVER retype, regenerate or "fix" Quran text. Never take text from third-party app scrapes. Import it by script into a versioned JSON, one file per surah: /data/quran/v1/{surahId}.json
  Word record: { p: wordPos, t: text }. Verse record: { n: verseNo, words: [...], page: mushafPage, juz, audio?: [[startMs,endMs],...] }.
- Add a build-time verification script that fails the build unless: 114 surahs; total verses = 6236; each surah's verse count matches the Madinah Mushaf; no empty words; no Latin letters or digits inside word text; Unicode is NFC and consistent. Print a report. Mark a surah as reviewed in meta.reviewedSurahs only after a human reviewer signs off. Unreviewed surahs stay in fallback (image) mode for children.
- Basmala: it is verse 1 only in Al-Fatihah. For other surahs show it as a header line, not as a verse (At-Tawbah has none).
- Cache: lazy-load per surah, precache the surahs the child opened, store them in IndexedDB; the service worker serves them offline.

## A3. Rendering
- Component <QuranText surahId> renders verses in order. Each word is <span class="w" data-s data-v data-p tabindex="0" role="button"> inside a verse <span class="v">. After the last word of each verse render the verse-end marker (ayah number in a circle) as a button with aria-label "الْآيَةُ N".
- dir="rtl", lang="ar", font "Amiri Quran" (or KFGQPC Hafs Uthmani if licensed), size ≥24px, line-height ≥1.9. No letter-spacing on Arabic. Never split a word across lines. Special Quranic marks (waqf signs, sajdah mark) must not be dropped: test with 2:255, Al-Ikhlas, 24:35 and a sajdah verse.
- Font size control A−/A+ (saved). Respect prefers-reduced-motion. Long surahs: virtualize by verse.
- Page mode (phase 2, optional): per-page fonts (QPC v2) with the same word model, one word = one glyph element.

## A4. Features that use the word model
1. Tafsir link:
   - Tap a verse-end marker, or long-press (500ms) a word, to open a bottom sheet "تَفْسِيرُ الْآيَةِ" for that verse key surah:verse. A simple tap on a word during normal reading only highlights the verse.
   - Tafsir sources: use only Arabic sources suitable for kids, Al-Muyassar (primary, simplest) and As-Sa'di (secondary). Look up the real tafsir ids from the API's resources endpoint; do not hard-code ids from memory. Show the source name and author at the top of every tafsir text. Add a kid-friendly "شَرْحٌ مُبَسَّطٌ" layer only if the content reviewer provides it; never auto-generate tafsir with AI.
   - Sheet: text ≥18px, scrollable, "السَّابِقَةُ / التَّالِيَةُ" buttons, a listen button if audio exists. Cache tafsir per verse on first open; offline shows the cached text or "يَحْتَاجُ إِنْتَرْنِتْ".
   - Ages 4–6: show tafsir only for the short surahs the app flags.
   - Existing illustrated tafsir content (if any) stays linked by verse key.
2. Recitation highlight: while audio plays, highlight the current word using the segment times (requestAnimationFrame with audio currentTime). If a reciter has no word segments, highlight by verse only. Auto-scroll keeps the current verse visible without jumping.
3. Continue reading: save (surahId, verseNo, wordPos) as the last position. "كَمِّلْ مِنْ حَيْثُ تَوَقَّفْتَ" shows the place ("سُورَةُ الْفَاتِحَةِ، آيَةُ ٣") instead of a score.

## A5. Migration
- Feature flag quranRender = "text" | "image". Default "image" until reviewers approve; flip per surah using meta.reviewedSurahs. Convert old reading positions and bookmarks from page numbers to (surah, verse) using the data's page field. Keep audio files and filenames unchanged.

## A6. Acceptance for Part A
- Every word is focusable and has data-s/v/p; a screen reader reads the Arabic correctly.
- The verification script passes (114 surahs, 6236 verses, per-surah counts).
- Visual check against the Madinah mushaf text for 10 sample verses (including 2:255, 24:35 and a sajdah verse), signed off by a human.
- Tafsir sheet and word highlight work at 360/390/430px, offline for opened surahs, with no console errors and no horizontal scroll.

# PART B. Four features

## B0. Shared foundations (build first)
B0.1 Local-first storage
- Use IndexedDB (a small wrapper such as idb), database "rawda", stores: hifz, tasbih, units, stories, rewards, meta. Each record is keyed per child: key = [childId, itemId].
- Every write updates the local record immediately, sets updatedAt (ISO UTC), then queues it for sync (if a backend exists; if not, keep local only). The UI never waits for the network.
- If IndexedDB is unavailable (private mode, blocked): fall back to an in-memory store and show a small dismissible note for the parent only ("التقدم لن يُحفظ في هذا الوضع"). Never crash.
- Add schemaVersion in meta and a migration function (v1 now).
- Conflict rule if sync is added later: per field, newest updatedAt wins; counters (tasbih totals) merge by summing deltas, never by overwriting.
- Day boundaries use the child's local time zone from the device. Store dates as "YYYY-MM-DD".

B0.2 Rewards
- One rewards service: addSprouts(childId, amount, reason, idempotencyKey). It ignores a repeated idempotencyKey, so a reward is never given twice. Reasons: "tasbih_complete", "unit_lesson", "unit_complete", "story_read", "story_badge".
- Show a short celebration (≤1.5s, no flashing, respects prefers-reduced-motion). Play sound only if sound is on.

B0.3 Analytics events (no personal data, only child age band and anonymous ids): hifz_word_hidden, hifz_verse_colored, tasbih_started, tasbih_completed, unit_lesson_completed, certificate_unlocked, story_read, badge_earned, tafsir_opened. Respect the parent's analytics setting.

B0.4 Accessibility for all: touch targets ≥48px; every icon-only button has an Arabic aria-label; progress rings and bars have role="img" with an Arabic label that says the numbers; no information by color alone; visible focus outlines; respect prefers-reduced-motion; text contrast ≥4.5:1.

## B1. Gradual fade memorization with verse coloring
Where: Quran tab, inside a surah, with a mode toggle "المحو التدريجي" | "اسمع وردّد". Age modes 7–9 and 10–12 only; hidden in 4–6.
Data: use the word model from Part A. Hidden words are stored by (surahId, verseNo, wordPos), never by text. Block fade mode for a surah (show "قريبًا") if it is not in meta.reviewedSurahs.
Model (store "hifz", key [childId, surahId]): { surahId, verses: { [verseNo]: { color: null | "memorized" | "mastered" | "review", hiddenWords: number[] (wordPos), updatedAt } }, wordsPerStep: 1..6 (default 3), lastVerse, updatedAt }
Behavior:
- Tap a word: toggle hidden/shown. A hidden word is a dashed blue pill of the same width as the word, aria-label "كَلِمَةٌ مُخْتَفِيَةٌ"; tapping again reveals it.
- Button "امْحُ الْمَزِيدَ": hide the next N words (N = wordsPerStep), choosing random not-yet-hidden words across the visible verses. When all are hidden, disable it and show "أَحْسَنْتَ! جَرِّبْ أَنْ تَقُولَهَا مِنْ حِفْظِكَ".
- Undo restores the last action (keep the last 20 actions in memory; clear when leaving the screen).
- Stepper − / + changes wordsPerStep (min 1, max 6) and saves it.
- Tap a verse number: a small bottom sheet with 4 choices: حَفِظْتُهَا (green, check icon), مُتْقَنَةٌ (gold, star icon), أُرَاجِعُهَا (rose, refresh icon), بِدُونِ لَوْنٍ. The choice sets the verse color and saves. Never color alone.
- Hidden words are saved so the child can leave and return. A menu action "إِظْهَارُ الْكُلِّ" resets hidden words only, not colors.
- Surah progress = verses colored "memorized" or "mastered" ÷ total verses, shown as a bar.
Edge cases: very long surahs (virtualize); a verse with one word; app killed mid-session (restore the last state); child switched (separate data per child); offline (works fully).

## B2. Tasbih with reward
Where: a new item under "صلاتي" (or Discover; follow the current IA) named "المسبحة". All age modes; in 4–6 mode show only 3 azkar and the counts 3/7/33.
Azkar (config file, each with id, Arabic text, defaultCount): سبحان الله، الحمد لله، الله أكبر، لا إله إلا الله، أستغفر الله. Only these five at start; any other zikr text must be added by the content reviewer. Counts: 3, 7, 33, 100.
Model (store "tasbih"): per child, per day: { date, totals: { [azkarId]: number }, completions: number, lastSession: { azkarId, target, count, startedAt } }
Behavior:
- One big circular button (170px). Each tap: count + 1, light haptic if supported and allowed by the parent (navigator.vibrate(10)), optional click sound (off by default, toggle in settings). Ring progress = count ÷ target.
- Ignore taps closer than 80ms apart. Use pointerdown to avoid the 300ms delay.
- When count reaches the target: completions + 1; one reward (idempotencyKey = `${childId}:${date}:${azkarId}:${target}:${completionNo}`); show the gift animation, then a card with "اِلْعَبْ" (link to an existing mini game, or sprouts only if there is none) and "ابْدَأْ مِنْ جَدِيدٍ".
- Daily reward cap: at most 3 reward-giving completions per child per day. After that, completions still count in totals and the text says "أَحْسَنْتَ! عُدْ غَدًا لِلْهَدِيَّةِ".
- The reward card shows "بَقِيَتْ N تَسْبِيحَةً" until the target.
- "ابْدَأْ مِنْ جَدِيدٍ": no confirm if count is 0; otherwise confirm "هَلْ تُرِيدُ البَدْءَ مِنْ جَدِيدٍ؟". Changing the zikr or the count mid-session keeps the session only when count is 0; otherwise confirm first.
- The session survives app close (restore lastSession). A new day resets the daily totals, never the total history.
- No timers, leaderboards or comparison with other kids.
Edge cases: rapid tapping on low-end phones; rotation; day rollover while the screen is open (continue counting; totals go to the new date on the next tap); audio blocked by the browser.

## B3. Wudu and Salah units with progress and certificate
Where: "صلاتي" tab. Two units: "رِحْلَةُ الْوُضُوءِ" (10 lessons) and "رِحْلَتِي مَعَ الصَّلَاةِ" (lessons from the existing salah simulator). Use the existing wudu/salah step screens as the lesson content. Lesson titles and order live in a config file owned by the content reviewer.
Model (store "units"): { childId, unitId, lessons: { [lessonId]: { status: "locked"|"available"|"done", doneAt, attempts } }, certificate: { unlockedAt|null } }
Behavior:
- Lesson 1 is available; the next unlocks when the previous one is done. A lesson is done when the child finishes its last step ("أَنَا فَعَلْتُهَا!"). Leaving mid-lesson saves the current step and resumes there.
- Path screen: done (green check), current (blue play), locked (gray lock). Tapping a locked lesson shows "أَكْمِلِ الدَّرْسَ السَّابِقَ" and does nothing else.
- The progress ring shows done ÷ total, aria-label "أَنْجَزْتَ ٤ دُرُوسٍ مِنْ ١٠".
- First completion of a lesson gives a reward (idempotencyKey = `${childId}:${unitId}:${lessonId}`). Redoing a done lesson gives no reward and does not change its status.
- When all lessons are done: unlock the certificate once (certificate.unlockedAt), show a celebration screen with the child's first name and the unit name, and a "احْفَظْ الشَّهَادَةَ" button.
- Certificate: generate on the client (canvas/SVG to PNG or PDF, A4 landscape): child's first name only, unit name, date (Gregorian and Hijri), the app logo. No photo, school or location. Arabic must be real text rendered with the embedded app fonts so it does not fall back.
- Certificates are downloadable and shareable only inside the parent zone ("الشَّهَادَاتُ"). On the path screen the child sees the certificate card: locked shows "٤ مِنْ ١٠", unlocked shows "اِفْتَحْ".
- Parent dashboard shows unit progress and the certificates list.
Edge cases: lessons added after release (compute progress by lessonId, not index; a finished unit with a new lesson becomes in-progress but the certificate stays unlocked); two children on one device; empty child name (use "بَطَلُ رَوْضَةِ كِيدْز").

## B4. "قَرَأْتُ" counter on prophet stories
Where: Stories world, "قِصَصُ الْأَنْبِيَاءِ", using the existing 25 stories. Names only, no pictures of prophets (numbered tiles with a check icon, as in the mockup).
Model (store "stories"): { childId, storyId, readAt, readCount }
Behavior:
- A story counts as read when the child reaches its last page, or plays its audio to ≥90%. Opening and leaving does not count.
- Re-reading increases readCount but not the counter total, and gives no new reward.
- Header "قَرَأْتُ N مِنْ M" with a progress bar (role="img" with an Arabic label). Tile states: read (green check, "قَرَأْتُهَا"), next (blue, "اقْرَأِ الْآنَ"), unread (numbered, "لَمْ أَقْرَأْهَا").
- The main button "اقْرَأْ قِصَّةَ …" opens the first unread story in order, or the first story when all are read.
- Badge "الْقَارِئُ الصَّغِيرُ" at 5 read stories, then 10, 15, 25 as separate badge ids; each given once (idempotent) with a sprout reward and a short celebration. A card shows how many are left to the next badge.
Edge cases: stories added or removed (counters use the current list only); offline (text stories work from cache; uncached audio shows "الصَّوْتُ يَحْتَاجُ إِنْتَرْنِتْ").

## B5. Offline behavior (all of Part B)
- The service worker precaches the screens, the fonts (Baloo Bhaijaan 2, Cairo, Amiri Quran) and the Quran text of surahs the child opened. Cache audio only when played (cache-on-play) with a size cap.
- All progress works offline. When back online, sync the queue in the background with exponential backoff; never block the UI; never show a technical error to a child.
- Show a small offline chip only in the parent zone.

## B6. Parent zone additions
- Hifz: per surah, counts of memorized, mastered and review verses.
- Tasbih: total today and total this week.
- Units: lessons done and certificates (download/share).
- Stories: read count and badges.
- A "إِعَادَةُ ضَبْطِ التَّقَدُّمِ" action per feature, behind the PIN, with a confirm dialog.

# PART C. Islamic content integrity (applies to everything)
- No images of prophets, Companions or Allah. No Arabic or Quran text inside generated images.
- Every hadith shows its grade and source (sahih or hasan only).
- Quran text only from the verified data source in A2. Tafsir text only from the cited sources in A4. Azkar, lesson titles, badge names and any new religious wording must be approved by the content reviewer before release; do not invent them.
- Nasheeds are vocal-only by default.

# PART D. Tests and final report
Write unit tests for: the Quran data verification script; word-level hidden toggling and undo; reward idempotency; the daily tasbih reward cap; lesson unlock order; certificate unlock-once; story read threshold; day rollover; the IndexedDB fallback. Manual checks at 360, 390 and 430px:
- Fade: hide words, close the app, reopen → same state. Color a verse → the bar updates.
- Tafsir: long-press a word or tap a verse marker → the correct verse's tafsir with its source name; works offline after the first open.
- Tasbih: 33 taps → exactly one reward; 3 more completions the same day → the 4th gives no reward.
- Unit: complete all 10 lessons offline → the certificate unlocks once; the PNG/PDF renders Arabic correctly.
- Stories: open and leave a story → the count is unchanged; finish it → +1; the badge appears at 5 only once.
- No console errors, nothing scrolls sideways, Lighthouse accessibility ≥95.
Reply with the list of files changed, the chosen Quran data source and its license, which surahs are still in image mode, and a short note per feature on what is done and what is left.

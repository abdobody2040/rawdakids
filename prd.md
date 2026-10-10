# PRD — Kids Islamic Learning App (working title: "Noor Kids")

Version 1.0 | Platforms: Android + iOS (Expo / React Native) | Languages: Arabic-first, English second

---

## 1. Vision & Goals

**Vision:** A safe, joyful app where children (4–13) learn the Quran, the Sunnah, the stories of the Prophets, and Islamic ethics through play, stories, and audio, and come to love them.

**Goals**
1. Kids listen to, understand, and gradually memorize short surahs with per-ayah audio.
2. Kids learn authentic Prophetic habits and short hadiths through mini-stories and scenarios.
3. Kids know the Prophets' stories in order, with lessons they can apply.
4. Kids practice adab (manners/ethics) in daily-life interactive scenarios.
5. Parents trust the content (authentic, reviewed) and can see progress.

**Non-goals (v1):** Social/chat features, ads, in-app purchases targeted at kids, fatwa Q&A, full tafsir, advanced tajweed rules.

**Success metrics:** D1 retention ≥ 40%, D7 ≥ 20%, D30 ≥ 10%; avg session 8–12 min; ≥ 60% of users finish at least one surah; ≥ 70% lesson completion; parent NPS ≥ 50.

---

## 2. Target Users

| Segment | Age | Needs | Design implication |
|---|---|---|---|
| Little Explorers | 4–6 | Can't read well; learns by listening/tapping | Voice-guided, huge buttons, no text-dependent tasks |
| Young Learners | 7–9 | Reading begins; loves games/rewards | Quizzes, mini-games, light reading |
| Growing Minds | 10–13 | Wants meaning, challenge | Meanings, memorization tests, deeper stories |
| Parents/Teachers | adults | Trust, progress, control | Parent dashboard behind a gate |

Age band is chosen at onboarding and changes content depth, UI density, and game difficulty.

---

## 3. Content & Authenticity Principles (Critical)

1. **Quran text:** Uthmani script from the Quran API only. Never edited or retyped manually.
2. **Audio:** Licensed/permitted reciters only (e.g., Mishary Alafasy, Minshawi Murattal, Husary + a child-reciter option "Muallim" repeat-after-me style if licensed). Confirm usage terms of the audio source before launch.
3. **Hadith:** Only authentic (Sahih) hadiths from Bukhari/Muslim (and clearly graded Sahih elsewhere). Show source and number. No weak/fabricated narrations. Prefer the well-known "Kids' 40" selections.
4. **Prophet stories:** Based on the Quran and authentic Sunnah only. No Israiliyyat embellishments. Mark story details that are Quranic vs. narrated.
5. **Depiction:** Do **not** depict the faces/bodies of Prophets or the Sahaba. Use light/silhouette, back views, symbolic objects, voice narration, and environment-focused scenes. Do not depict Allah in any form. Angels shown only as light/abstract.
6. **Tone:** Hope and mercy first. Avoid frightening content about punishment for young bands; frame lessons positively.
7. **Review:** Every lesson passes a qualified Islamic scholar review (sign-off record kept in CMS) before publishing.
8. **Respect:** Quran audio never gets background music or sound effects over it. Game sound effects pause while ayah audio plays. Show a gentle reminder on respectful handling.

---

## 4. Product Structure

Home is a **Journey Map** (adventure style) with 4 worlds:

| World | Content | Core interaction |
|---|---|---|
| 📖 Quran Garden | Short surahs (Juz Amma first), ayah-by-ayah | Listen, repeat, word meanings, memorize, quiz |
| 🌙 Sunnah Path | 40 kid-friendly authentic hadiths + daily sunnah habits | Mini-story, pick-the-action, habit tracker |
| 🕌 Prophets' Caravan | 25 Prophets in order | Illustrated audio stories, timeline, choices, quiz |
| 🌟 Good Manners Town | Adab & ethics scenarios (honesty, parents, neighbors, sharing, cleanliness, kindness, patience) | Scenario choices, role-play, dua cards |

Plus: **Rewards Room** (avatar, stickers), **My Progress**, **Parents Corner**, **Settings**.

---

## 5. Feature Requirements

Priority: **P0** = MVP, **P1** = v1.1, **P2** = later.

### 5.1 Quran Garden

| ID | Feature | Pri | Acceptance criteria |
|---|---|---|---|
| Q1 | Surah list (Juz Amma first: 78–114 + Al-Fatiha) with progress rings | P0 | Locked/unlocked states; shows ayah count and completion % |
| Q2 | Ayah-by-ayah player | P0 | Each ayah shown in Uthmani text; tap ayah → plays that ayah audio; active ayah highlighted; play/pause/next/prev |
| Q3 | Playback modes | P0 | Single ayah, repeat ayah ×N (3/5/10), play whole surah, continuous |
| Q4 | Speed control | P0 | 0.75×, 1×, 1.25× without pitch distortion |
| Q5 | Translation/simple meaning line under each ayah | P0 | Arabic simple tafsir (Muyassar-style) + English translation toggle; text size adjustable |
| Q6 | Word-by-word tap meaning | P1 | Tap a word → meaning bubble (if API provides word data) |
| Q7 | Listen & Repeat (memorization mode) | P0 | Flow: hear → hide text → child repeats → self-rate (😊/🙂/😐) → spaced repetition schedule |
| Q8 | Ayah puzzle games | P1 | Reorder words/ayahs, fill the missing word, match ayah to meaning |
| Q9 | Voice recitation check (child reads aloud) | P2 | Optional; only on-device processing; no audio stored |
| Q10 | Surah story card | P0 | 30–60 s illustrated audio intro: "why this surah, what it teaches" |
| Q11 | Reciter selection | P0 | Min 2 reciters; downloaded audio per reciter |
| Q12 | Offline download per surah | P0 | Audio + text cached; storage indicator; delete option |
| Q13 | Memorization tracker ("My Hifz") | P0 | Per surah/ayah status: new / learning / memorized; review reminders |

### 5.2 Sunnah Path

| ID | Feature | Pri | Acceptance criteria |
|---|---|---|---|
| S1 | Hadith lessons (40 kid hadiths, grouped by theme) | P0 | Arabic text, simple Arabic/English meaning, narrator, source + number, audio reading |
| S2 | Mini-story per hadith | P0 | 3–5 illustrated screens with narration showing the hadith in a kid's life |
| S3 | "What would you do?" interaction | P0 | 2–3 choices; correct choice links to the hadith; gentle feedback on wrong choice, no punishment |
| S4 | Daily Sunnah habits (bismillah before eating, right hand, greeting, sleeping adhkar, entering/leaving home, sneezing, etc.) | P0 | Habit cards + audio dua; daily tick-off with parent confirmation option |
| S5 | Hadith of the Day (push notification, opt-in) | P1 | Pulled from the Sunnah API; age-filtered |
| S6 | Hadith memory cards (flip cards) | P1 | Arabic ↔ meaning |
| S7 | Dua library with audio | P0 | Morning/evening, food, travel, sleep, etc., each with audio |

### 5.3 Prophets' Caravan

| ID | Feature | Pri | Acceptance criteria |
|---|---|---|---|
| P1 | Prophets timeline map | P0 | 25 Prophets, order from Adam to Muhammad ﷺ, locked progressively; "peace be upon him" shown with every name |
| P2 | Story player (chapters of 5–8 scenes) | P0 | Narrated audio, illustrated scenes (no prophet faces), subtitles; pause/replay; progress bar |
| P3 | Quran verses inside stories | P0 | Relevant ayah appears with its audio and a link to its surah (from Quran API) |
| P4 | Decision moments | P1 | Pause points ("What would you do?") that link to lessons learned |
| P5 | Story quiz (3–5 Q) | P0 | Earns stars; can retry unlimited |
| P6 | "Lessons I learned" card | P0 | One takeaway card per story saved to collection |
| P7 | Prophet profile card | P1 | Name (Arabic/English), era, people, place, miracle/message, key Quranic mention |
| P8 | Interactive map/location view | P2 | Locations of stories on a map |

MVP story set (P0): Adam, Nuh, Ibrahim, Yusuf, Musa, Yunus, Sulaiman, Isa, Muhammad ﷺ (early life). Others in v1.1.

### 5.4 Good Manners Town (Ethics/Adab)

| ID | Feature | Pri | Acceptance criteria |
|---|---|---|---|
| E1 | Values list: honesty, trust, kindness to parents, respecting elders, sharing, patience, gratitude, cleanliness, keeping promises, kindness to animals/neighbors, controlling anger, avoiding lying/backbiting | P0 | Each value = 1 "building" in the town with 3–5 scenarios |
| E2 | Scenario cards | P0 | Short animated situation → choose action → consequences shown kindly → link to the Quran ayah or hadith that supports the value |
| E3 | Value pledge & weekly challenge | P1 | "This week: say salam to 3 people"; parent confirms |
| E4 | Gratitude journal (emoji/voice) | P1 | Local only, private |
| E5 | Role-play mini-games | P1 | Drag/drop and timed choices, e.g., "help the neighbor" |

### 5.5 Gamification & Rewards (healthy, no dark patterns)

- **Stars** per lesson (1–3 by quiz/engagement), **gems** for streaks, **stickers** per completed story/surah/hadith.
- **Avatar** (child-friendly character, modest clothing options) unlocked with gems.
- **Streak** (days) with forgiving "streak freeze"; no guilt messaging or loss-aversion pressure.
- **Daily goal** chosen by parent (5/10/15 min), with a friendly stop screen once reached ("Great job! Come back tomorrow").
- **Badges:** "Little Reciter", "Truthful Friend", "Story Explorer", "Kind Neighbor", etc.
- No leaderboards, no competition with strangers. Optional family leaderboard (P2) between siblings on the same device.

### 5.6 Parents Corner (behind a parent gate: simple math problem or PIN)

| ID | Feature | Pri |
|---|---|---|
| PA1 | Child profiles (up to 4), age band, avatar | P0 |
| PA2 | Progress report: surahs memorized, hadiths learned, stories done, time spent, streak | P0 |
| PA3 | Daily time limit + quiet hours (e.g., prayer times, bedtime) | P0 |
| PA4 | Confirm habits/challenges completed in real life | P1 |
| PA5 | Content settings: translation language, reciter, text size, notifications | P0 |
| PA6 | Weekly summary email/notification | P1 |
| PA7 | Prayer-time-aware pause (optional, uses local calculation, no GPS stored) | P2 |

### 5.7 Onboarding (≤ 60 seconds)

1. Splash + Bismillah audio
2. Choose language (AR/EN)
3. Parent gate → create family profile (no email required for local mode)
4. Add child: name/nickname, age band, avatar
5. Pick first journey (Quran / Stories / Manners)
6. Short interactive tutorial (tap ayah, hear audio, earn first star)

---

## 6. Audio Specification

- **Formats:** MP3 128 kbps (or AAC) per ayah, loaded by surah + ayah number.
- **Player requirements:** Ayah-level seek, gapless continuous play, repeat counts, speed control, background playback (optional toggle), respects phone silent/interruptions (calls).
- **Highlighting sync:** Active ayah highlighted when its audio starts; auto-scroll.
- **Preloading:** Preload next ayah while current is playing.
- **Caching:** Download whole surah on demand; LRU cache for streamed audio; offline fallback.
- **Narration audio:** Story/hadith narration recorded in a warm, child-friendly voice (human voice-over preferred; TTS only for drafts). Separate volume channel from Quran audio.
- **Rule:** No background music under Quran recitation. Optional soft ambience only in stories and manners scenes, off by default for Quran.

---

## 7. Data & API Integration

Use a **data-access layer** so the API provider can be swapped without changing the UI.

```
/services
  quranService.ts     // getSurahs(), getAyahs(surah), getAudioUrl(reciter, surah, ayah), getTranslation(surah, lang), getWords(ayah)
  hadithService.ts    // getHadith(collection, number), getByTheme(theme), getDaily(ageBand)
  contentService.ts   // stories, scenarios, quizzes (own CMS/JSON)
  progressService.ts  // local progress, sync
```

**Quran API needs:** surah list (name AR/EN, ayah count, revelation type), ayah text (Uthmani), translation (AR simple + EN), per-ayah audio URL by reciter, optional word-by-word data.

**Sunnah API needs:** hadith text (Arabic), translation, narrator, collection + number, grade (Sahih), topics/tags. Only whitelisted hadith IDs (our curated list) are displayed in the app.

**Strategy**
- Curate a whitelist JSON (`kids_hadith.json`) with IDs, age bands, themes, kid-friendly explanation, and linked story ID. Fetch text from the API by ID, so text comes from the source, not retyped.
- On first run, bundle Fatiha + Juz Amma text locally (small) so the app works instantly offline; audio downloaded on demand.
- Cache all API responses in SQLite; version them; background refresh with fallback to cache.
- Keep API keys server-side (a thin proxy/Edge function) if the API needs a key.

**Content owned by us (CMS/JSON):** stories (scenes, narration audio, images, linked ayat), manners scenarios, quizzes, kid-friendly explanations, badges.

### Core Data Model

```
Child { id, name, avatar, ageBand, createdAt, settings }
SurahProgress { childId, surah, ayahStatus[ayah]: new|learning|memorized, lastReviewAt, nextReviewAt, stars }
HadithProgress { childId, hadithId, status, stars, completedAt }
StoryProgress { childId, storyId, sceneIndex, completed, quizScore, lessonCardUnlocked }
ScenarioProgress { childId, scenarioId, choiceMade, completed }
HabitLog { childId, habitId, date, parentConfirmed }
Rewards { childId, stars, gems, stickers[], badges[], avatarItems[] }
Streak { childId, current, longest, lastActiveDate, freezesLeft }
ParentSettings { dailyLimitMin, quietHours[], language, reciter, translation }
```

---

## 8. Key User Flows

**A. Learn a surah:** Home → Quran Garden → pick surah → surah story card → listen (whole) → ayah-by-ayah with meaning → Listen & Repeat → mini-game → quiz → stars + sticker → mark ayahs "learning/memorized" → review scheduled.

**B. Learn a hadith:** Sunnah Path → pick hadith → watch mini-story → hear hadith audio + meaning → "What would you do?" → earn star → habit suggestion for today.

**C. Prophet story:** Caravan map → pick Prophet → play scenes with narration (+ ayah audio) → decision moments → quiz → "Lesson I learned" card → timeline unlocks next.

**D. Manners scenario:** Town → building (e.g., Honesty) → scenario → choose → feedback with linked ayah/hadith → pledge → reward.

**E. Daily loop (≤ 10 min):** Open → daily mission (1 review ayah set + 1 new item + 1 habit) → rewards → "see you tomorrow".

---

## 9. Screens List

1. Splash / Onboarding (5 screens)
2. Home Journey Map
3. Quran Garden: Surah list, Surah detail/player, Listen & Repeat, Games, Quiz, Result
4. Sunnah Path: Hadith list by theme, Hadith lesson, Mini-story, Scenario, Habits, Dua library
5. Prophets' Caravan: Timeline map, Prophet card, Story player, Quiz, Lesson card
6. Manners Town: Town map, Value page, Scenario player, Pledge
7. Rewards Room: Avatar, Stickers, Badges
8. My Progress (child-friendly charts)
9. Parent Gate → Parents Corner: Profiles, Reports, Limits, Settings, Downloads manager
10. Settings: language, reciter, translation, text size, audio, notifications, about/sources

---

## 10. UX / UI Guidelines

- **Style:** Warm, friendly 2D illustration; soft colors (deep teal, warm gold, cream, sky blue); rounded shapes; Islamic geometric patterns used subtly.
- **Typography:** Uthmani Quran font (e.g., KFGQPC Uthmani / Amiri Quran) for ayat, large and tashkeel-complete; rounded kid-friendly font (e.g., Baloo/Cairo) for UI.
- **RTL first:** Full RTL layout for Arabic; mirrored icons where needed.
- **Touch targets:** ≥ 56 dp; one primary action per screen.
- **Voice guidance:** Mascot (a friendly non-human character, e.g., a little lantern or a cat named "Noor") speaks key instructions for ages 4–6.
- **Feedback:** Positive micro-animations; wrong answers get "try again" not red failure screens.
- **Accessibility:** Adjustable text size, high-contrast mode, screen reader labels, subtitles for narration.
- **Respect UX:** Quran text screens avoid distracting animations; ayah text never used as a game "object" that gets destroyed/dragged to a bin or hit as a target.

---

## 11. Technical Requirements

**Recommended stack**
- **App:** Expo (React Native) + TypeScript, Expo Router
- **Audio:** `expo-audio` (or `react-native-track-player` for background/gapless)
- **Storage:** `expo-sqlite` for content cache + progress; `expo-file-system` for downloaded audio
- **State:** Zustand
- **Animation:** Reanimated + Lottie
- **Backend (optional, v1.1):** Supabase (auth for parent account, progress sync, content CMS) or Firebase
- **CMS:** Strapi/Sanity or versioned JSON for stories/scenarios
- **Analytics:** Privacy-safe (e.g., PostHog self-hosted or Firebase with child-directed settings, no ad IDs)
- **Notifications:** Local notifications (reminders), opt-in via parent

**Non-functional**
- Cold start < 3 s; audio start latency < 500 ms (cached) / < 1.5 s (streamed)
- Works fully offline for downloaded content
- App size < 80 MB base (audio on demand)
- Supports Android 8+, iOS 15+
- Crash-free sessions ≥ 99.5%

---

## 12. Privacy, Safety & Compliance

- Designed for children: COPPA, GDPR-K, Apple Kids Category and Google Play "Designed for Families" policies.
- **No ads, no third-party trackers, no social features, no external links** without parent gate.
- Collect minimum data: nickname + age band; local-first storage; parent account only for optional cloud sync.
- No child voice recordings stored/uploaded (Q9 on-device only).
- Parent gate for settings, purchases, external links.
- Monetization (parent-facing only): free core (Fatiha + Juz Amma short surahs, 5 stories, 10 hadiths) + one-time or yearly "Family Premium" unlock via parent gate. No consumables, no loot boxes.
- Privacy policy and content-sources page in plain Arabic/English.

---

## 13. Analytics (Anonymous, Aggregate)

Events: `onboarding_complete`, `lesson_start/complete`, `ayah_play`, `repeat_mode_used`, `quiz_score`, `story_complete`, `scenario_choice`, `streak_day`, `download_surah`, `parent_gate_open`.
Use to improve content difficulty and drop-off points, never for ads.

---

## 14. Roadmap

| Phase | Scope | Duration |
|---|---|---|
| **0. Prep** | Confirm API fields/audio licensing, scholar reviewer, curate hadith whitelist, story scripts, art direction | 2 weeks |
| **1. MVP (P0)** | Onboarding, profiles, Quran Garden (Fatiha + Juz Amma, player, repeat, meanings, offline, progress), 10 hadith lessons, 9 prophet stories, 6 manners values, stars/stickers, parent gate + basic report | 8–10 weeks |
| **2. v1.1** | Word-by-word, ayah games, more reciters, 25 prophets, 40 hadiths, daily hadith, habit confirmation, cloud sync, weekly parent summary | 6–8 weeks |
| **3. v1.2+** | Voice recitation check, family leaderboard, more surahs, map view, tajweed basics, Arabic letters (Qaida Nuraniyah) module | later |

---

## 15. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Incorrect Islamic content | Whitelisted Sahih hadith by ID; scholar sign-off per lesson; sources visible in-app |
| Audio licensing | Verify reciter/source terms before launch; keep audio provider swappable |
| Disrespectful interactions with Quran text | Strict rule: no destroying/throwing ayat; calm UX on Quran screens |
| Prophet depiction concerns | No faces/bodies; light/silhouette/voice only |
| Child engagement drops | Short sessions, varied activities, kind rewards, parent-set goals |
| API downtime/changes | Local cache + bundled Juz Amma, service abstraction layer |
| Large audio storage | Download-on-demand per surah, cleanup tool |

---

## 16. Open Questions (to confirm before build)

1. Exact Quran API and Sunnah API providers and their fields (word data? translations? audio URLs per ayah? rate limits? license?).
2. Final reciter list and audio rights.
3. Free vs. premium split and price points.
4. Arabic-only first, or Arabic + English from day one?
5. Mascot concept and art style approval.
6. Who is the scholar reviewer, and the sign-off workflow?

---

## 17. Builder Instructions (for AI coding tool)

Paste this with the PRD:

> Build the app in Expo (React Native + TypeScript) with RTL support, offline-first SQLite caching, and a service layer (`quranService`, `hadithService`, `contentService`, `progressService`) so API endpoints are configurable via `.env`. Start with the MVP (P0) scope only. Implement in this order: (1) project setup, theme, RTL, navigation; (2) onboarding + child profiles + parent gate; (3) Quran Garden with ayah-by-ayah audio player (single/repeat/continuous, speed, highlight sync, offline download); (4) progress + stars/stickers engine; (5) hadith lessons + scenario component; (6) story player component driven by JSON (scenes, narration audio, linked ayah, quiz); (7) manners scenarios using the same scenario component; (8) parents corner (reports, daily limit, settings). Follow the content rules in section 3 strictly: no background music under Quran audio, no prophet faces, ayah text is never a draggable/destroyable game object. Use placeholder JSON for stories, scenarios, and quizzes with the schemas defined in section 7.
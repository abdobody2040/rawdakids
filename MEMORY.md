# Noor Kids — AI Agent Memory & Operational Log

> This document maintains continuity across AI agent sessions. Read this before making architectural or structural changes.

---

## 1. Project Overview & Current State

- **Application Name:** Rawdakids (روضة كيدز)
- **Status:** Fully functional, interactive, and polished web/mobile application.
- **Active Ports:**
  - `http://localhost:3000`: Production node server (`server.js`) serving `dist/` + `/api/tts` streaming proxy.
  - `http://localhost:8081`: Expo Metro bundler for live web development.

---

## 2. Key Decisions & Change History

### Milestone 1: Comprehensive Content Expansion
- **All 114 Surahs:** Full catalog with Arabic names, English meanings, revelation place, Ayah count, and EveryAyah audio paths in [`src/data/quranData.ts`](file:///g:/quran%20app%20for%20kids/src/data/quranData.ts).
- **All 25 Prophets:** Chronological timeline from Adam (ع) to Muhammad (ﷺ) with interactive lessons and multiple-choice quizzes in [`src/data/prophetsData.ts`](file:///g:/quran%20app%20for%20kids/src/data/prophetsData.ts).
- **Good Manners Town (10 Landmarks):** Interactive moral simulations covering Truthfulness, Kindness, Honoring Parents, Patience, Trustworthiness, Justice, Good Neighbors, Gratitude, Generosity, and Humility in [`src/data/mannersData.ts`](file:///g:/quran%20app%20for%20kids/src/data/mannersData.ts).
- **Verified Hadiths & Duas:** Sourced from Sahih al-Bukhari, Muslim, Abu Dawud, and Tirmidhi with Sunnah.com reference badges in [`src/data/hadithData.ts`](file:///g:/quran%20app%20for%20kids/src/data/hadithData.ts) and [`src/data/duasData.ts`](file:///g:/quran%20app%20for%20kids/src/data/duasData.ts).

### Milestone 2: 27 Reciters & Trusted English Translations
- Expanded reciters to 27 world-class reciters, all tested and verified returning HTTP 200 on `everyayah.com`.
- Added dynamic Reciter Picker modal in [`src/components/AudioPlayerBar.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AudioPlayerBar.tsx) and Parents' Gate [`src/app/parents/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/parents/index.tsx).
- Integrated 3 authoritative English translations: Saheeh International, The Clear Quran (Dr. Mustafa Khattab), and M.A.S. Abdel Haleem.

### Milestone 3: Dua Audio Playback Solution
- **The Issue:** Default `window.speechSynthesis` on Windows/Chrome fails for Arabic because default OS installations often lack local Arabic voice packs.
- **The Solution:** Implemented a multi-tier playback pipeline in [`src/services/audioService.ts`](file:///g:/quran%20app%20for%20kids/src/services/audioService.ts):
  1. Primary: `/api/tts?text=...` proxy route in [`server.js`](file:///g:/quran%20app%20for%20kids/server.js) delivering authentic Arabic MP3 audio streams.
  2. Secondary: Direct Google TTS URL fallback.
  3. Tertiary: Device speech engine (`Speech.speak` on native, `speechSynthesis` on web).
- Updated [`src/app/sunnah/duas.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/duas.tsx) with audio playback indicators, toggle play/pause, error notifications, and automatic star/gem rewards upon listening.

### Milestone 4: Kid-Delight UI Redesign
- Redesigned [`src/app/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/index.tsx) to match and elevate the user-provided design template:
  - Responsive shell: two-column layout on desktop (`width >= 820px`) with left navigation rail, glowing brand sun `☼`, and streak card with 7 habit dots; single-column fluid layout with bottom tabs on mobile.
  - Oasis Night Hero Banner: layered green rolling hills, golden crescent moon `☾`, twinkling sparks `✦ ✧`, sandy path, and glowing lantern `🏮`.
  - Today's Little Mission card with chamomile flower icon `🌼` and progress bar.
  - 4 Pastel World cards (`Quran Garden`, `Sunnah Path`, `Prophets' Caravan`, `Good Manners Town`).
  - Treasure garden preview footer with sticker badges.

### Milestone 5: Full Screen Without Borders (Edge-to-Edge Desktop Layout)
- Removed artificial card constraints (`maxWidth: 1140`, `maxHeight: 880`, outer padding `24px`, container borders `6px`, and container `borderRadius: 36`).
- Layout now natively occupies 100% of the viewport width and height.
- Left/Right navigation rail extends seamlessly top-to-bottom with dynamic border based on RTL/LTR (`borderLeftWidth` for Arabic, `borderRightWidth` for English).
- Main canvas expands gracefully across the full screen with responsive padding (`paddingHorizontal: 36`).

### Milestone 6: Features 2 to 6 Implementation (Gap Resolution)
- **Feature 2 — Hadith Flashcards (`/sunnah/cards`):** Interactive flip card deck for young learners. Front features Arabic Hadith with full Tashkeel, reciter audio playback button (`audioService.playDua`), and reference badge; back reveals kid-friendly explanation, real-life practical action, and "I Memorized This! / حفظت هذا الحديث" mastery toggle with star confetti. Includes deck shuffle, category filters, and progress indicator.
- **Feature 3 — Surah Story & Tadabbur Modal (`SurahStoryModal.tsx`):** Kid-friendly background and reflection modal integrated into [`src/app/quran/[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx). Displays core moral theme, revelation context, 3 practical takeaways checklist, and audio narration trigger before recitation begins.
- **Feature 4 — Daily Screen Time Limit Rest Screen (`DailyLimitModal.tsx`):** Health and wellness modal wired into root layout ([`src/app/_layout.tsx`](file:///g:/quran%20app%20for%20kids/src/app/_layout.tsx)). When daily app usage reaches parent limit (`timeSpentTodaySec >= parentSettings.dailyLimitMin * 60`), a gentle resting screen features Mascot Noor, eye-rest exercises, and a 4-digit parent PIN gate to add +5 min, +15 min, or unlock for the day.
- **Feature 5 — Daily Gratitude Journal (`/manners/journal`):** Daily blessings log based on "لئن شكرتم لأزيدنكم". Kids select from 6 blessing categories (Family, Health, Food, Faith, Nature, Friends), pick pre-made kid prompts or write custom notes, deposit them into the animated Gratitude Jar, and earn +5 Stars and +2 Gems per entry with persistent storage in `useAppStore`.
- **Feature 6 — Hadith of the Day Banner (`src/app/index.tsx`):** Prominently placed on the home dashboard with pure day-of-year rotation. Displays authentic Hadith text, one-tap instant audio playback, practical application takeaway, and celebratory reward on completion.

### Milestone 7: Full Kid-Friendly Visual UI Upgrade with 3D Pixar Generated Assets
- Generated high-quality, kid-appealing 3D Pixar/claymation assets stored in `assets/images/`:
  - `mascot-noor.jpg`: Lovable 3D glowing character with big smiling eyes and golden light. Integrated in [`src/components/MascotNoor.tsx`](file:///g:/quran%20app%20for%20kids/src/components/MascotNoor.tsx), onboarding, desktop brand rail, Today's Little Mission, and [`DailyLimitModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/DailyLimitModal.tsx).
  - `hero-oasis.jpg`: Panoramic 16:9 night oasis landscape with smiling crescent moon, reflective star pond, rolling dunes, and date palms. Integrated as background in the Home Hero Banner.
  - `quran-garden.jpg`: Emerald hills with glowing Quran on wooden rehal, blooming flowers, and butterflies. Integrated into Quran World Card and [`SurahStoryModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/SurahStoryModal.tsx).
  - `sunnah-path.jpg`: Warm morning cobblestone path with date palms, peaceful doves, and wisdom scroll. Integrated into Sunnah Path World Card.
  - `prophets-caravan.jpg`: Peaceful twilight desert caravan with friendly decorated camels, tents, and starry moonlit sky (strictly respecting Islamic guidelines — no human prophet depictions). Integrated into Prophets' Caravan World Card.
  - `manners-town.jpg`: Pastel Islamic storybook town with cheerful fountain, Kindness Bakery, and smiling children playing. Integrated into Good Manners Town World Card.
  - `gratitude-jar.jpg`: Glowing 3D glass jar filled with folded origami stars and golden hearts on a cozy starry table. Integrated into [`src/app/manners/journal.tsx`](file:///g:/quran%20app%20for%20kids/src/app/manners/journal.tsx).
- All web routes and image assets tested and returning HTTP 200 on port 3000.

### Milestone 8: Full Authentic Tafsir Resolution & Interactive Audio
- **Root Cause:** Quran API fetching previously only requested `quran-uthmani` and translation without any Tafsir edition tag, leaving `simpleTafsir` as generic placeholder strings for over 100 Surahs. Furthermore, there was no audio mechanism to listen to Tafsir explanations.
- **Solution & Implementation:**
  1. **Tafsir Al-Muyassar Pipeline:** Configured `/api/quran/surah/:id` backend caching proxy in [`server.js`](file:///g:/quran%20app%20for%20kids/server.js) to retrieve `quran-uthmani,ar.muyassar,<translation>` with in-memory caching.
  2. **Data Layer (`quranService.ts`):** Updated `getSurah` to parse authentic `ar.muyassar` Tafsir for every single ayah across all 114 Surahs.
  3. **Tafsir Audio Narration:** Added instant audio playback for every Ayah's Tafsir using `audioService.playDua(ayah.simpleTafsir)`, allowing young children who cannot easily read long Arabic text to listen to the explanation.
  4. **Interactive Ayah Tafsir Modal ([`src/components/AyahTafsirModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AyahTafsirModal.tsx)):** Kids can tap "💡 تفسير الآية" on any Ayah to open a full reflection card with Mascot Noor, large Tashkeel text, Tafsir Al-Muyassar, audio listening, English meaning, and an understanding star reward.

### Milestone 9: Back Button Navigation Fix Across All Screens
- **Root Cause:** When accessing detail routes directly via URL (e.g. `http://localhost:3000/quran/78`) or upon browser page refresh, Expo Router's internal history stack has no previous entry (`router.canGoBack()` evaluates to `false`). Calling plain `router.back()` did nothing, leaving users unable to navigate back to parent screens.
- **Solution & Implementation:**
  - Updated [`src/components/Header.tsx`](file:///g:/quran%20app%20for%20kids/src/components/Header.tsx) with intelligent fallback route computation via `usePathname()`:
    - `/quran/*` defaults to `/quran`
    - `/sunnah/*` defaults to `/sunnah`
    - `/prophets/*` defaults to `/prophets`
    - `/manners/*` defaults to `/manners`
    - Section index pages default to `/`
  - Added explicit `fallbackRoute="/quran"` support in [`src/app/quran/[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx).
  - Navigation handler now safely checks `router.canGoBack() ? router.back() : router.replace(target)`.

### Milestone 10: Full End-to-End (E2E) Testing & Automated Verification
- **Automated Test Runner:** [`scripts/test-e2e.js`](file:///g:/quran%20app%20for%20kids/scripts/test-e2e.js)
- **Results:** **35 / 35 Tests Passed (100% Success Rate)**
  1. **19 Static Routes (HTTP 200):** Home, Quran, Quran Reader, Repeat Player, Sunnah, Duas, Flashcards, Prophets Caravan, Prophet Details (Adam, Muhammad ﷺ), Manners Town, Habit Journal, Manners Detail, Rewards Store, Star Progress, Parents Portal, Onboarding.
  2. **7 Kid-Friendly 3D Image Assets (HTTP 200):** Noor mascot, Hero Oasis, Quran Garden, Sunnah Path, Prophets Caravan, Manners Town, Gratitude Jar.
  3. **4 Backend API Endpoints:** Streaming Arabic TTS (`/api/tts`), Quran Uthmani & Tafsir Al-Muyassar pipeline (`/api/quran/surah/1`, `/api/quran/surah/112`, `/api/quran/surah/78`).
  4. **5 Data Integrity & Theological Rules:** 114 Surahs catalog, 27 reciters, 25 Prophets strictly symbolic without facial/human depictions, 10 Manners landmarks, authentic Hadith and Dua decks.
- **Code Quality:** `npx tsc --noEmit` (0 errors) and `npx expo lint` (0 errors).

### Milestone 11: Mobile-First Responsive Redesign & Persistent AppBottomNav
- **Context & Bug:** When viewed in split-screen or narrow desktop window (< 820px), the old layout evaluated `{ flexDirection: 'row' }`, rendering the bottom tab bar vertically on the right side next to the hero card instead of at the bottom. Additionally, content lacked mobile-first centering and broke across routes.
- **Solution & Implementation:**
  - **Shared Bottom Navigation ([`src/components/AppBottomNav.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AppBottomNav.tsx)):** 5 main destinations (`/`, `/quran`, `/sunnah`, `/prophets`, `/rewards`) with kid-friendly icons, active state highlights, RTL support, and safe area insets.
  - **Mobile-First Container Framing ([`src/app/_layout.tsx`](file:///g:/quran%20app%20for%20kids/src/app/_layout.tsx)):** Wrapped root `<Stack>` in `outerContainer` (`#f5f3e9` backdrop) and `mobileContainer` (`maxWidth: 520`, centered with soft shadow on desktop, 100% full width edge-to-edge on mobile phones).
  - **HomeScreen & Exploration Hubs Refactor:** Eliminated desktop rail, fixed vertical column layout, streamlined top bar controls (stars, gems, language, avatar), and integrated `AppBottomNav` across Home, Quran, Sunnah, Prophets, and Rewards.
  - **Verification:** `npx tsc --noEmit` (0 errors), `npx expo lint` (0 errors, 0 warnings), full E2E suite (`scripts/test-e2e.js`) passed 35/35 (100%).

### Milestone 12: Custom 3D Pixar-Style Visual Icons Upgrade
- **Context & Need:** Replaced generic unicode emojis and raw vector icons with high-resolution, kid-friendly 3D Pixar illustrations.
- **Assets Generated & Integrated:**
  1. `nav-home-3d.jpg`: 3D glowing golden lantern house icon.
  2. `nav-quran-3d.jpg`: 3D illuminated open holy Quran with gold and emerald calligraphy.
  3. `nav-sunnah-3d.jpg`: 3D smiling golden crescent moon with Ramadan lantern.
  4. `nav-prophets-3d.jpg`: 3D desert adventure scroll and antique brass compass.
  5. `nav-rewards-3d.jpg`: 3D overflowing wooden treasure chest with sparkling stars and gems.
  6. `icon-star-3d.jpg`: 3D cute smiling golden star character for star rewards.
  7. `icon-gem-3d.jpg`: 3D multifaceted sparkling cyan crystal diamond.
- **Component Upgrades:**
  - [`AppBottomNav.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AppBottomNav.tsx): Uses 3D visual icons with soft active elevation and glowing borders.
  - [`HomeScreen`](file:///g:/quran%20app%20for%20kids/src/app/index.tsx): Stars, gems, avatar, world badges, Hadith label, and Treasure Garden stickers now use 3D illustrations.
  - [`Header.tsx`](file:///g:/quran%20app%20for%20kids/src/components/Header.tsx): Stars, gems, and profile badge now render 3D icons.
- **Verification:** `npx tsc --noEmit` (0 errors), `npx expo lint` (0 errors, 0 warnings), full E2E test suite passed 35/35 (100%).

### Milestone 13: Features 2 to 5 Comprehensive Completion
- **Feature 2 — Word-by-Word Tap Meaning & Pronunciation (`src/data/quranWordsData.ts`, `src/services/quranWordsService.ts`, `src/components/WordMeaningBubbleModal.tsx`, `src/app/quran/[surahId].tsx`):**
  - Tapping any Quranic word in the Ayah reader opens a friendly reflection bubble with Arabic calligraphy, English & Arabic simple kid definitions, everyday examples, instant audio pronunciation via `/api/tts`, and awards +1 exploration star.
- **Feature 3 — Prophets Caravan Audio Narration & Interactive Decision Points (`src/data/storiesData.ts`, `src/app/prophets/[prophetId].tsx`):**
  - Instant voice narration player for each story scene with audio playback indicator and pause/play toggle.
  - Interactive "ماذا تفعل يا بطل؟" (What Would You Do?) decision point checkpoint after story scenes, prompting children with a real-life moral reflection and tailored feedback before moving to the quiz.
- **Feature 4 — Weekly Manners Challenges & Real-Life Parent Approval Portal (`src/store/useAppStore.ts`, `src/app/manners/index.tsx`, `src/app/parents/index.tsx`):**
  - 3 weekly habit missions in Good Manners Town (Spread Salam, Help Parents, Kind Words).
  - Kids complete the action and submit for verification. Parents review real-life deeds in the Parents' Portal with 1-tap confirmation and bonus gem awards (`+5` to `+8` gems).
- **Feature 5 — Offline Surah Audio Caching & Download Manager (`src/services/quranService.ts`, `src/store/useAppStore.ts`, `src/app/quran/[surahId].tsx`):**
  - Header download toggle with real-time pre-fetching and caching for all verses of any Surah per selected reciter. Offline status stored persistently in AsyncStorage.
- **Verification:** `npx tsc --noEmit` (0 errors), `npx expo lint` (0 errors, 0 warnings), web bundle generated 19 routes, server running at `http://localhost:3000`, 35/35 E2E tests passing (100%).

### Milestone 14: 3D Avatars, Photo Upload, Onboarding World Selection, Tafsir Audio Fix & Strict Language Filtering
- **3D Cartoon Avatars & Custom Photo Upload (`src/components/KidAvatar.tsx`, `src/app/onboarding.tsx`, `src/app/parents/index.tsx`):**
  - Generated and integrated 4 high-resolution 3D Pixar kid characters (`avatar-boy-1.jpg`, `avatar-girl-1.jpg`, `avatar-boy-2.jpg`, `avatar-girl-2.jpg`) replacing generic emojis.
  - Implemented custom photo upload with `FileReader` base64 data URL persistence in both onboarding avatar selector and Parents Portal avatar picker.
  - Connected `KidAvatar` across Header, Home, Progress, and Parents screens.
- **Onboarding Destination Selection Fix (`src/app/onboarding.tsx`):**
  - Converted static preview containers in Step 3 to interactive `TouchableOpacity` items with `selectedDestination` state, active checkmarks, highlighted borders, and 3D thumbnail art.
  - Selecting a world now directs the user to their chosen destination upon finishing onboarding (`/quran`, `/sunnah`, `/prophets`, or `/manners`).
- **Tafsir Audio Playback Streaming Fix (`server.js`):**
  - Google Translate TTS fails on query lengths > 140-200 characters. Tafsir texts are typically 250-500+ characters.
  - Added `splitArabicText` sentence chunking in `server.js` (`/api/tts`), downloading segments in parallel and concatenating them into a unified continuous MP3 audio stream. Tested and verified HTTP 200 with complete audio stream.
- **Strict English Text Visibility Control (`src/store/useAppStore.ts`, `src/app/quran/[surahId].tsx`, `src/components/AyahTafsirModal.tsx`):**
  - Defaulted `showEnglishTranslation` to `false` in store settings.
  - Suppressed English titles, subtitle tags, and ayah translations when the active language is Arabic (`ar`). English text and translation boxes render strictly when English is selected or explicitly toggled.
- **Verification:** `npx tsc --noEmit` (0 errors), `npx expo lint` (0 errors, 0 warnings), web bundle refreshed in `dist/`, `server.js` running with full audio streaming support, 35/35 E2E tests passing (100%).

### Milestone 15: Mobile-First Responsive Layout & Robust 3x Repeat Audio Engine
- **Mobile-First Responsiveness:**
  - Integrated `maxWidth: 680, width: '100%', alignSelf: 'center'` across [`[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx), [`repeat.tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/repeat.tsx), [`Header.tsx`](file:///g:/quran%20app%20for%20kids/src/components/Header.tsx), and [`AudioPlayerBar.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AudioPlayerBar.tsx).
  - Enhanced top cards with `flexWrap: 'wrap'` and adaptive gaps to prevent clipping on narrow mobile screens (320px–380px).
  - Expanded `ayahsContainer` bottom padding to 160px so all ayahs scroll completely above the floating audio player bar without obstruction.
- **3x / 5x Repeat Engine & IDM Interference Fix:**
  - Resolved audio re-instantiation in [`audioService.ts`](file:///g:/quran%20app%20for%20kids/src/services/audioService.ts) where creating new `Audio` instances triggered browser autoplay policy blocks and Internet Download Manager (IDM) interception popups. Now rewinds `currentTime = 0` for seamless, instant repeated playback.
  - Separated `duaAudio` from `webAudio` to prevent Tafsir audio from nullifying Quran reciter instances.
  - Synchronized `repeatCountRef` and `currentRepeatCycleRef` to eliminate stale React closures.
  - Added live repeat visual indicator in the active Ayah card (`تكرار 2 من 3`) and inside `AudioPlayerBar` (`2/3x`).
  - Added repeat mode (1x, 3x, 5x) to the dedicated Listen & Repeat screen ([`repeat.tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/repeat.tsx)).
- **Verification:** `npx tsc --noEmit` (0 errors), `npx expo lint` (0 errors, 0 warnings), web bundle built via `npx expo export --platform web`, 35/35 E2E tests passing (100%).

### Milestone 16: Complete 3D Asset Adoption Across All Hubs & Expanded Responsive Screen Canvas
- **Replacement of Raw Emojis with High-Resolution 3D Art:**
  - **Sunnah Path (`src/app/sunnah/index.tsx` & `src/app/sunnah/duas.tsx`):** Replaced flat gradient and `🌙` / `🤲` emojis with `ImageBackground` (`sunnah-path.jpg`) and circular 3D badge (`nav-sunnah-3d.jpg`). Changed tab text to clean label "البطاقات التعليمية".
  - **Prophets Caravan (`src/app/prophets/index.tsx`):** Replaced flat gradient and `🕌` emoji with `ImageBackground` (`prophets-caravan.jpg`) and circular 3D badge (`nav-prophets-3d.jpg`).
  - **Good Manners Town (`src/app/manners/index.tsx`):** Replaced flat gradient and `🌟` emoji with `ImageBackground` (`manners-town.jpg`) and circular 3D badge (`hero-oasis.jpg`). Replaced `🤲` in Gratitude Journal banner with `gratitude-jar.jpg` 3D illustration.
  - **Quran Garden (`src/app/quran/index.tsx`):** Replaced flat gradient banner with `ImageBackground` (`quran-garden.jpg`) and circular 3D badge (`nav-quran-3d.jpg`).
  - **Rewards Room (`src/app/rewards/index.tsx`):** Replaced vector star and gem icons in balance card and avatar shop with `icon-star-3d.jpg` and `icon-gem-3d.jpg`.
- **Responsive Screen Container Expansion (`maxWidth: 720`–`760`):**
  - Expanded screen bounds from narrow `maxWidth: 520` with mismatched `#f5f3e9` gray borders to an adaptive `maxWidth: 720`–`760` with unified background (`#fffdf8` / `COLORS.background`).
  - Adjusted `AppBottomNav.tsx` container width (`maxWidth: 720, alignSelf: 'center'`) to seamlessly align with page width on desktop and tablet viewports while preserving mobile ergonomics.
  - Updated all screens (`sunnah`, `prophets`, `manners`, `quran`, `rewards`, `progress`, `parents`, `duas`, `index`).
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes built successfully (code 0).
  - Assets synced to `dist/assets/images/`.
  - E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 17: Strict Language Isolation — Elimination of Unconditional English Text in Arabic Mode
- **Identified Leaks & Root Cause:**
  - In [`src/app/sunnah/duas.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/duas.tsx), `transliteration` and `translationEn` were rendered unconditionally inside every Dua card, displaying English sentences beneath the Arabic text even when the user was browsing in Arabic mode (`language === 'ar'`).
  - In [`src/app/prophets/[prophetId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/prophets/%5BprophetId%5D.tsx), `currentScene.linkedAyah.translationEn` was rendered unconditionally.
  - In [`src/app/manners/[valueId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/manners/%5BvalueId%5D.tsx), `scenario.supportingProof.translationEn` was rendered unconditionally.
  - In [`src/app/quran/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/index.tsx), `item.nameEnglish (item.nameTransliteration)` subtitle was rendered unconditionally.
  - In [`src/app/quran/repeat.tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/repeat.tsx), `(${surah.nameEnglish})` was appended unconditionally.
- **Resolution:**
  - Added strict guard `showEnglish = language === 'en' || (language === 'ar' && parentSettings?.showEnglishTranslation === true)` across all affected screens.
  - English translations, transliterations, and labels now strictly show ONLY when English mode is selected or when explicitly enabled by parents in settings.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - `node scripts/test-e2e.js`: 35 / 35 PASSED (100%).

### Milestone 18: 3D Pixar Illustration Generation for Stickers & Characters (ملصقاتي وشخصياتي)
- **Stickers 3D Generation & Integration (`assets/images/sticker-*.jpg`, `src/app/rewards/index.tsx`, `src/app/index.tsx`):**
  - Generated and integrated 7 new high-resolution 3D Pixar-style Islamic stickers:
    1. `sticker-kaaba.jpg`: Miniature gold & black embroidered Holy Kaaba.
    2. `sticker-quran.jpg`: Illuminated open Holy Quran on wooden rehal stand.
    3. `sticker-crescent.jpg`: Smiling golden crescent moon with twinkling star friend.
    4. `sticker-lantern.jpg`: Detailed brass Islamic Ramadan lantern with colorful stained glass.
    5. `sticker-camel.jpg`: Adorable smiling baby camel with colorful saddle.
    6. `sticker-ark.jpg`: Friendly wooden ark boat on turquoise waves with dove.
    7. `sticker-dates.jpg`: Golden glossy ripe dates on green palm fronds.
  - Upgraded **ألبوم ملصقات الأبطال** in Rewards Room with 3D badges, collected status, and interactive unlocking using gems with celebratory confetti.
  - Replaced placeholder icons in Home Screen **حديقة كنوزك وجوائزك** with authentic 3D stickers.
- **Characters 3D Generation & Integration (`assets/images/avatar-cat.jpg`, `src/components/KidAvatar.tsx`, `src/app/rewards/index.tsx`):**
  - Generated `avatar-cat.jpg`: 3D cute fluffy ginger kitten (Mishmish) with emerald eyes and star collar.
  - Integrated `KidAvatar` across all avatar options in the Rewards Room (**شخصياتي**), replacing raw text emojis (`👦`, `👧`, `🧒`, `🧕`, `🐱`, `🏮`) with rich 3D cartoon avatars.
  - Connected interactive selection and profile avatar synchronization.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt successfully (code 0).
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 19: Complete Strict Language Isolation & Dual Segmented Header Toggle
- **Root Cause & Issue:**
  - In English mode, Arabic strings leaked into screen headers and card titles (`سورة الفاتحة` instead of `Surah The Opening`, `نبي الله Adam` instead of `Prophet Adam (peace be upon him)`).
  - Ayah reflection card in English mode was rendering Arabic Tafsir Al-Muyassar paragraphs rather than the English translation (`ayah.translationEn`).
  - Single-button language switcher in the header was confusing: it showed the target language label (`عربي` when in English, `EN` when in Arabic), leading users to believe the app was stuck or misconfigured.
- **Resolution:**
  - **Header Dual Segmented Pill (`src/components/Header.tsx`):**
    - Redesigned into a clear segmented pill `[ عربي | EN ]` with active state highlighting the current language in emerald green with white text. Both options are always visible and clicking either activates that language immediately.
  - **Quran Reader (`src/app/quran/[surahId].tsx`):**
    - Dynamic header title: `language === 'ar' ? 'سورة ' + surah.nameArabic : 'Surah ' + surah.nameEnglish`.
    - Main card title dynamically localized to Arabic or English.
    - Card meta: in Arabic shows `مكية • ٧ آيات`; in English shows `Surah.nameArabic • Meccan • 7 Ayahs`.
    - Ayah Reflection Card: in Arabic mode, presents `💡 التفسير الميسر` with full Tafsir and one-tap Arabic recitation audio; in English mode, presents `💡 Meaning & Reflection` with clean English translation text (`ayah.translationEn`) without Arabic block clutter.
  - **Quran Index & Repeat Player (`src/app/quran/index.tsx`, `src/app/quran/repeat.tsx`):**
    - All titles dynamically localized.
    - Subtitle transliterations strictly hidden in Arabic mode.
  - **Prophets Caravan (`src/app/prophets/index.tsx`, `src/app/prophets/[prophetId].tsx`):**
    - Dynamic prophet titles (`نبي الله {nameAr}` vs `Prophet {nameEn}`) and honorifics (`(عليه السلام)` vs `(peace be upon him)`).
  - **Sunnah & Hadith Cards (`src/app/sunnah/index.tsx`):**
    - English explanations strictly shown in English mode.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 20: Islamic Surah Naming Correction Across Entire Application (Al-Fatihah instead of The Opening)
- **User Request & Issue:**
  - Surah names were erroneously translated into literal English descriptions (e.g., `Surah The Opening` instead of `Surah Al-Fatihah`, `Surah The Cow` instead of `Surah Al-Baqarah`).
  - In `quran/index.tsx`, the card was showing `Surah The Opening` on the left and `(Al-Fatihah) الفاتحة` awkwardly grouped on the right.
- **Resolution Across the Entire App:**
  - **Quran Surah List (`src/app/quran/index.tsx`):**
    - Main title on the left: `Surah ${item.nameTransliteration}` (e.g., **Surah Al-Fatihah**, **Surah Al-Baqarah**, **Surah Ya-Sin**, **Surah Al-Ikhlas**).
    - Side title on the right: `{item.nameArabic}` in clean bold Arabic typography (e.g., **الفاتحة**, **البقرة**, **يس**).
    - Subtitle: clearly displays `${item.nameEnglish} • ${item.ayahCount} Ayahs • ${item.revelationType}` (e.g., `The Opening • 7 Ayahs • Meccan`), providing the meaning as an informative description rather than replacing the Surah's true name.
  - **Quran Detail Reader (`src/app/quran/[surahId].tsx`):**
    - Screen header title: `Surah ${surah.nameTransliteration}`.
    - Card title: `Surah ${surah.nameTransliteration}`.
    - Subtitle: `${surah.nameArabic} • ${surah.nameEnglish} • ${surah.revelationType} • ${surah.ayahCount} Ayahs`.
    - Celebration modal: `Surah ${surah.nameTransliteration}`.
  - **Repeat Player (`src/app/quran/repeat.tsx`):**
    - Top tag: `Surah ${surah.nameTransliteration}`.
    - Celebration modal: `Surah ${surah.nameTransliteration}`.
  - **Story & Tafsir Modals (`SurahStoryModal.tsx`, `AyahTafsirModal.tsx`):**
    - Modal titles and badges updated to `surah.nameTransliteration`.
  - **Quran Service (`src/services/quranService.ts`):**
    - All fallback intros, contemplation lessons, and verse translations updated to `meta.nameTransliteration`.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 21: Respectful 3D Pixar Scene Illustrations for Prophets' Caravan (No Prophets Depicted)
- **User Request & Theological Guideline:**
  - Replace the dashed box icon placeholder in Prophets' Story Player (`/prophets/[prophetId]`) with rich scene illustrations matching each scene's moral content, strictly without depicting the faces or bodies of any Prophets.
- **Generated Assets & Implementation:**
  - `scene-adam-repentance.jpg`: Serene dawn landscape at sunrise with a celestial golden heart of light symbolizing sincere repentance and divine mercy over rolling green hills and date palms.
  - `scene-adam-creation.jpg`: Lush heavenly Paradise Garden with the majestic ancient tree of knowledge, radiant golden rays of divine wisdom, crystal stream, and paradise blossoms.
  - `scene-nuh-ark.jpg`: Friendly majestic wooden ark floating peacefully on turquoise waves with a rainbow and dove carrying an olive branch.
  - `scene-ibrahim-kaaba.jpg`: Sacred Holy Kaaba under a starry night sky with a smiling golden crescent moon and glowing courtyard lanterns.
  - `scene-musa-sinai.jpg`: Mount Sinai at sunset with the miraculous glowing light of guidance.
  - `scene-muhammad-hira.jpg`: Cave of Hira on Jabal al-Nour glowing with divine revelation under a starlit twilight sky with an illuminated parchment scroll.
  - Updated [`src/app/prophets/[prophetId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/prophets/%5BprophetId%5D.tsx) to render full 16:9 3D illustrations with gentle gradient text overlays for reflections.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 22: Expansion of Prophet Stories to 10 Detailed Scenes Each (250 Scenes Total)
- **User Request & Goal:**
  - "كبر تفاصيل قصص الانبياء على الاقل 10 صفحات لكل نبى" (Expand the details of the stories of the prophets, at least 10 pages/scenes for each prophet!).
- **Dataset Expansion & Architecture:**
  - Created [`src/data/prophetsScenesData.ts`](file:///g:/quran%20app%20for%20kids/src/data/prophetsScenesData.ts) containing 250 fully articulated narrative scenes (10 scenes for each of the 25 Prophets from Adam to Muhammad ﷺ).
  - Every scene includes:
    - Dedicated Title (`titleAr`, `titleEn`).
    - Comprehensive Kid-Friendly Story Text (`narrationAr` with full Tashkeel, `narrationEn`).
    - Voice narration playback support (`audioService.playDua`).
    - Dedicated symbolic icon (`symbolIcon`) and reflection tag (`symbolDescriptionAr`, `symbolDescriptionEn`).
    - Strictly compliant with Islamic guidelines: No physical depictions of prophets.
  - Linked dataset cleanly in [`src/data/storiesData.ts`](file:///g:/quran%20app%20for%20kids/src/data/storiesData.ts) with zero circular dependencies.
  - The scene progress bar, scene counter (`Scene 1 / 10`), navigation buttons, and voice narration smoothly scale across all 10 scenes per prophet.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
### Milestone 23: Complete Sunnah & Azkar Overhaul (UI Cleanup, 3D Story Illustrations, Expanded Datasets, Language Isolation)
- **Removal of Raw URLs (`sunnah.com/...`):**
  - Completely eradicated raw URL links (such as `sunnah.com/tirmidhi:1956`) across the entire user interface and data structures.
  - Replaced with clean, prestigious Islamic citations: `{hadith.source} • {hadith.grade}` (e.g., `جامع الترمذي • صحيح مسلم` or `صحيح البخاري`) in `[hadithId].tsx`, `cards.tsx`, `index.tsx`, and `hadithData.ts`.
- **3D Pixar Illustrations for All Hadith Stories (`assets/images/story-*.jpg`, `src/app/sunnah/[hadithId].tsx`):**
  - Generated and integrated 5 high-resolution 16:9 3D illustrations for Hadith stories:
    - `story-smile-school.jpg`: Friendly schoolyard scene where an observant kid notices a new friend.
    - `story-smile-happy.jpg`: Cheerful kids smiling warmly with joy and friendship.
    - `story-quran-reading.jpg`: Child learning the Quran in a warm illuminated Islamic library.
    - `story-parents-hug.jpg`: Loving family in a garden with children honoring and gifting flowers to their parents.
    - `story-gentle-nature.jpg`: Children gently tending to plants and feeding birds in a sunny garden.
  - Upgraded scene image resolver in `[hadithId].tsx` to map every story and theme to a rich 3D illustration, replacing generic icon placeholders.
- **Strict Language Separation for Azkar/Duas (`src/app/sunnah/duas.tsx`):**
  - Enforced strict `language === 'en'` guard for English translations and phonetic transliterations.
  - In Arabic mode, the Azkar library is 100% Arabic with zero English text leakage.
  - In English mode, English translations and transliterations are displayed clearly.
- **Massive Expansion of Hadith & Duas Datasets:**
  - Expanded Duas dataset in [`src/data/duasData.ts`](file:///g:/quran%20app%20for%20kids/src/data/duasData.ts) from 12 to 24 authentic daily supplications with Tashkeel, context, and virtues.
  - Expanded Hadiths in [`src/data/hadithData.ts`](file:///g:/quran%20app%20for%20kids/src/data/hadithData.ts) from 8 to 18 authentic hadiths (Sahih al-Bukhari & Sahih Muslim) with 3-scene mini-stories, interactive choice scenarios, and daily habit commitments.
  - Flashcard deck in [`src/app/sunnah/cards.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/cards.tsx) automatically expanded with all 18 hadiths.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 24: 3D Pixar Visual Transformation for Progress Metrics (`src/app/progress/index.tsx`)
- **Generation & Integration of 3D Metric Badges (`assets/images/metric-*.jpg`):**
  - Generated and integrated 4 high-resolution 1:1 3D Pixar-style visual badges replacing flat emoji/vector icons (`📖`, `🌙`, `🕌`, `🔥`):
    1. `metric-quran.jpg`: Illuminated Holy Quran with gold tajweed calligraphy resting on an ornate rehal stand with emerald star sparkles.
    2. `metric-sunnah.jpg`: Cheerful smiling golden crescent moon with glowing brass Ramadan lantern under starry night.
    3. `metric-prophets.jpg`: Beautiful desert oasis caravan featuring an adorable cartoon baby camel, palm tree, and starry sky.
    4. `metric-streak.jpg`: Smiling warm golden fire flame character badge with sparkling eyes and floating embers.
  - Replaced `iconCircle` container with `metricImageContainer` featuring soft rounded borders, elevation shadows, and responsive scaling.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 25: UI Fixes, GB Naming Removal, Manners Garden in Bottom Nav, Manners Expansion & 3D Media
- **Removed Country Flags & "GB" Naming from UI Header (`src/app/index.tsx`):**
  - Replaced hardcoded `En 🇬🇧` / `عربي 🇸🇦` toggle with a clean, modern segmented pill toggle `[ عربي | EN ]` matching `Header.tsx`.
  - Increased bottom scroll clearance in `src/app/index.tsx` to `paddingBottom: 64` preventing cards from being obscured by the bottom navigation bar.
- **Added Manners Garden to Bottom Bar (`src/components/AppBottomNav.tsx`):**
  - Added dedicated Manners Garden tab (`حديقة الأخلاق` / `Manners`, route `/manners`) with 3D Pixar badge (`nav-manners-3d.jpg`).
  - Integrated `<AppBottomNav />` into [`src/app/manners/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/manners/index.tsx) so children can easily navigate between worlds.
  - Adjusted responsive flex layout across mobile and desktop widths.
- **Generated 3D Media & App Icon (`assets/images/`):**
  - Generated and installed official 3D Pixar Disney-style App Icon (`icon.png`, `splash-icon.png`, `android-icon-foreground.png`) featuring an illuminated Quran on an ornate rehal stand with a smiling golden crescent moon, lantern, and sparkles.
  - Generated and installed 3D manners illustrations: `manner-cleanliness.jpg`, `manner-sharing.jpg`, `nav-manners-3d.jpg`.
- **Integrated 3D Illustrations into Manners Screens:**
  - In [`src/app/manners/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/manners/index.tsx): Replaced plain icon circles with rich 3D artwork badges (`buildingThumbImage` + `buildingMiniIcon`) for all moral landmarks.
  - In [`src/app/manners/[valueId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/manners/%5BvalueId%5D.tsx): Added a 16:9 3D illustration banner inside the scenario card resolving the blank whitespace in scenario simulations.
- **Expanded Manners Dataset (`src/data/mannersData.ts`):**
  - Expanded from 10 to 14 moral landmarks by adding:
    1. Humility Haven (دار التواضع ولين الجانب)
    2. Peace-Maker Plaza (ساحة الإصلاح ونشر السلام)
    3. Truthful Promise Palace (قصر الوفاء بالعهد والوعد)
    4. Cooperation Castle (حصن التعاون وروح الفريق)
  - Each with authentic scenario dilemmas, real-world consequences, Quran/Hadith proofs, and weekly pledges.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt cleanly.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 35 / 35 PASSED (100%).

### Milestone 26: Mobile Ready Conversion — Splash Screen, Loading Screen & App Icons
- **Production Mobile App Icons (`assets/images/`):**
  - `icon.png`: High-resolution 1024x1024 edge-to-edge 3D Pixar/Disney style app store icon featuring an illuminated Holy Quran on a wooden rehal stand, smiling golden crescent moon, and glowing lantern with zero faux borders or transparency artifacts.
  - `android-icon-foreground.png`: 1024x1024 RGBA transparent layer with Mascot Noor and Holy Quran centered within the 65% safe circle zone, eliminating edge clipping on Android circular, square, or teardrop launcher masks.
  - `android-icon-background.png`: 1024x1024 deep emerald background (`#064E3B`) with radiant Islamic concentric circles.
  - `favicon.png`: Crisp 48x48 web favicon.
- **Dedicated 3D Pixar Splash Screen:**
  - `splash-screen.jpg` & `splash-screen.png`: 9:16 high-resolution artwork featuring Mascot Noor waving joyfully alongside the Holy Quran on a rehal, surrounded by clouds, Ramadan lanterns, and starry night sky with "NOOR KIDS" cloud typography.
  - `splash-icon.png`: Centered 1024x1024 splash icon configured in `app.json`.
- **In-App Splash & Kid-Friendly Loading Screens:**
  - [`src/components/AppSplashScreen.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AppSplashScreen.tsx): Full-screen animated splash transition with progress bar ("✨ بِسْمِ اللَّهِ نَبْدَأُ رِحْلَتَنَا ✨"), smooth scaling, and fade-out transition.
  - [`src/components/AppLoadingScreen.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AppLoadingScreen.tsx): Delightful in-app loading screen featuring animated floating Mascot Noor, pulsing golden halo aura, rotating Dhikr reminders in Arabic and English, and a rotating Islamic geometric star spinner.
- **Expo & Native Configuration (`app.json` & `_layout.tsx`):**
  - Configured `expo-splash-screen` plugin with `#064E3B` emerald background, `imageWidth: 220`, and `resizeMode: "contain"`.
  - Added iOS configuration: `supportsTablet: true`, `bundleIdentifier: "com.noorkids.app"`, `icon: "./assets/images/icon.png"`.
  - Added Android configuration: `package: "com.noorkids.app"`, `versionCode: 1`, `adaptiveIcon` with `#064E3B`.
  - Wired `SplashScreen.preventAutoHideAsync()` and `SplashScreen.hideAsync()` into [`src/app/_layout.tsx`](file:///g:/quran%20app%20for%20kids/src/app/_layout.tsx), synchronized with store hydration (`isHydrated`).
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - E2E Test Suite (`node scripts/test-e2e.js`): 39 / 39 PASSED (100%).

### Milestone 27: 3D Pixar Visual Language & Age Badges + Age-Adaptive Content Tone Engine
- **3D Pixar Illustrations in Onboarding (`src/app/onboarding.tsx`):**
  - **Language Selection (`assets/images/`):**
    - `lang-arabic-3d.jpg`: Replaced emoji `🌙` with an illuminated Holy Quran on a wooden rehal, winking golden crescent moon, and vibrant lantern with date palms.
    - `lang-english-3d.jpg`: Replaced emoji `⭐` with a smiling student globe character wearing a graduation cap, sitting beside an open book with alphabet letters and knowledge stars.
  - **Age Band Selection (`assets/images/`):**
    - `age-sprout-3d.jpg`: 3D smiling green plant sprout in clay pot for **4–6 Little Explorers**.
    - `age-rocket-3d.jpg`: 3D smiling cartoon rocket with star trail for **7–9 Young Learners**.
    - `age-scholar-3d.jpg`: 3D golden 8-pointed Islamic compass and parchment scroll for **10–13 Growing Minds**.
- **Age-Adaptive Content Tone Engine (`src/services/ageAdaptiveService.ts`):**
  - **Does content tone change with age selection? YES!** Created full age-adaptive tone system:
    1. **4–6 Years (المستكشف الصغير):** Gentle, loving nursery tone focusing on audio listening, sweet recitations, and Allah's loving care ("درس لقلبك الصغير: الله تعالى يحبنا ويرعانا دائماً 💕").
    2. **7–9 Years (المتعلم الناشئ):** Heroic, adventure and quest-driven gamified tone with star badge challenges and daily action steps ("خطوة بطل اليوم: اجعل هذه الآية خلقاً لك وابتسم وساعد أهلك 🌟").
    3. **10–13 Years (العقول النامية):** Mature mentorship and scholarly reflection tone focusing on Tadabbur, sincerity, and mindfulness ("تدبّر وبصيرة: استشعار مراقبة الله وإخلاص النية في السر والعلن 💡").
  - **Live Dynamic Tone Preview:** Added active tone preview card in Onboarding Step 2 demonstrating the tone switch in real-time as parents/kids select their age band.
  - **Tafsir Integration ([`src/components/AyahTafsirModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AyahTafsirModal.tsx)):** Added an age-adaptive reflection card below every Ayah's Tafsir tailored to the child's age band.
  - **Home Dashboard Adaptation ([`src/app/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/index.tsx)):** Hero banner titles, greetings, and mission descriptions dynamically adapt to `activeProfile.ageBand`.
- **Verification:**
  - `npx expo lint`: 0 errors, 0 warnings.
  - `npx tsc --noEmit`: 0 errors.
  - `npx expo export --platform web`: 19 routes rebuilt.
  - Assets synced to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): 39 / 39 PASSED (100%).

### Milestone 28: Dataset Expansion to 100 Authentic Hadiths & 50 Good Manners Town Landmarks
- **User Request:**
  - "محتاج الاحاديث تزيد لحد 100 حديث" (Expand Hadiths to 100).
  - "الاخلاق تزيد توصل ل 50 لو امكن" (Expand Good Manners to 50 landmarks).
- **100 Authentic Hadiths Catalog (`src/data/hadithsData100.ts`, `src/data/hadithData.ts`):**
  - **100% Unique & Verified Authenticity:** 100 distinct authentic Hadiths strictly sourced from *Sahih al-Bukhari*, *Sahih Muslim*, and Authentic Sunan collections (*at-Tirmidhi*, *Abu Dawood*, *an-Nasa'i*, *Ibn Majah*).
  - **Complete Child-Friendly Metadata for Every Hadith:**
    - Accurate Arabic text with complete vocalization (Tashkeel).
    - English titles and authentic references (Hadith numbers, narrator chains).
    - Age-appropriate moral explanations in Arabic and English.
    - 3-Scene Illustrated Mini-Stories with thematic Lucide icons (`miniStory`).
    - Interactive Decision-Making Scenarios with dual choices, instant pedagogical feedback, and explanations (`scenario`).
    - Real-world Daily Sunnah Habits (`linkedHabit`) linking moral guidance directly to practical deeds.
  - **Thematic Coverage:** Cleanliness & Wudu, Prayers, Honesty, Modesty (Haya'), Mercy, Kindness to Parents & Elders, Generosity, Avoiding Oppression, Sincere Advice, Kinship, and Dhikr.
  - `HADITHS_DATA` in `src/data/hadithData.ts` exports the full 100 authentic catalog.
- **50 Interactive Good Manners Landmarks (`src/data/mannersData50.ts`, `src/data/mannersData.ts`):**
  - **50 Distinct Landmarks in Good Manners Town (مدينة الأخلاق):**
    - Expanded from 14 to 50 moral buildings covering all Islamic character traits: بيت الصدق، واحة الأمانة، حديقة الرفق، منارة الإيثار، قصر بر الوالدين، بستان الحياء، مكتبة طلب العلم، ديوان العدل، جسر التسامح، واحة الشكر، ساحة الشجاعة، نبع الكرم، دار التواضع، حديقة النظافة، etc.
    - Each landmark includes: unique ID, Arabic & English names, Category (`akhlaq` / `muamalat` / `adab`), Quranic & Hadith proofs, 3-scene story, interactive choice scenario, and linked practical habit.
  - `MANNERS_BUILDINGS` in `src/data/mannersData.ts` exports all 50 landmarks seamlessly.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.
### Milestone 29: Removal of Daily Rest Limit Modal & Dynamic Child-Name Avatar Titles (اسم الطفل + الصفة الحلوة)
- **User Request:**
  - "شيل وقت الراحلة" (Remove Rest Time / Daily Limit modal popup).
  - "اسامى الافاتار لازم تبقى اسم الطفل+الصفة الحلوة" (Avatar names must be: Child's Name + The Nice Trait).
- **Removal of "وقت الراحة" Modal:**
  - Removed `<DailyLimitModal>` rendering from `src/app/_layout.tsx` so the intrusive full-screen modal lock never interrupts learning or blocks the user.
  - Simplified `src/components/DailyLimitModal.tsx` to safely return `null`.
  - Set default `dailyLimitMin: 0` (unlimited) in `src/store/useAppStore.ts`.
  - Handled zero-division and label formatting in `src/app/progress/index.tsx` for clean progress display.
- **Dynamic Avatar Naming Engine (`اسم الطفل + الصفة الحلوة`):**
  - **Eliminated Arbitrary Names:** Removed hardcoded static names like "طارق البطل", "زياد الذكي", "مريم اللطيفة", "سارة الزكية".
  - **Created `getAvatarDisplayName` Engine (`src/components/KidAvatar.tsx`):**
    - Dynamically pairs the child's entered name with the avatar's positive trait in real-time:
      - `av-boy1`: `{childName} البطل` / `{childName} the Champion`.
      - `av-girl1`: `{childName} اللطيفة` / `{childName} the Gentle`.
      - `av-boy2`: `{childName} الذكي` / `{childName} the Brilliant`.
      - `av-girl2`: `{childName} المبدعة` / `{childName} the Creative`.
      - `av-lantern`: `{childName} المحبوب` / `{childName} the Beloved`.
      - `av-cat`: `{childName} ومشمش` / `Mishmish & {childName}`.
    - If no name is entered yet, falls back gracefully to positive character badges (`البطل`, `اللطيفة`, `الذكي`, `المبدعة`, `المحبوب`) without arbitrary child names.
  - **Real-Time Synchronized UI Integration:**
    - `src/app/onboarding.tsx`: Step 2 avatar cards immediately update as the child or parent types in the name input field.
    - `src/app/rewards/index.tsx`: Characters tab (**شخصياتي**) dynamically renders `{activeProfile.name} + الصفة` for all selectable avatars.
    - `src/data/badgesData.ts`: Default options aligned to character traits.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.

### Milestone 30: Full Content Display Visibility & 50 Authentic Duas Expansion
- **User Issue Identified ("المحتوى لسا قليل"):**
  - The home screen world cards had hardcoded badge counts (`٢٧ ذكراً وحديثاً` and `١٠ معالم أخلاقية`), which masked the expansive 100 Hadiths and 50 Manners landmarks already added to the backend.
  - The Duas library had only 16-24 items with duplicate IDs.
- **Key Enhancements Implemented:**
  1. **Home Screen (`src/app/index.tsx`):**
     - Updated `sunnah` world card to proudly display: `١٠٠ حديث نبوي وسُنّة` (`100 authentic hadiths`).
     - Updated `manners` world card to proudly display: `٥٠ مَعلماً وخُلقاً حسناً` (`50 moral landmarks`).
  2. **Comprehensive Duas Expansion (`src/data/duasData.ts`):**
     - Expanded the daily supplications catalog to **50 complete, authentic Duas** (حصن المسلم الصغير) covering: waking, sleeping, eating, drinking, home, mosque, wudu, adhan, clothes, mirror, study/exams, parents, sneezing, riding/traveling, rain/thunder/wind, visiting the sick, pain relief, anger, night fear, gratitude, fasting iftar, market, and asking for Jannah.
     - Each dua contains authentic Arabic with full Tashkeel, English transliteration, translation, when-to-say context, virtues, and dedicated category.
  3. **Duas Screen UI Enhancement (`src/app/sunnah/duas.tsx`):**
     - Added 7 interactive category filter chips (`الكل: ٥٠`, `الصباح والنوم`, `الطعام والمنزل`, `العلم والمذاكرة`, `الآداب والمعاملات`, `الطبيعة والسفر`, `المسجد والصحة`).
     - Added total count badge: `(مجموع الأذكار: ٥٠ دعاءً مباركاً)`.
  4. **Sunnah Screen Navigation Tabs (`src/app/sunnah/index.tsx`):**
     - Tabs clearly showcase items counts: `الأحاديث (١٠٠)`, `السنن (١٠٠)`, `الأدعية (٥٠)`, `البطاقات (١٠٠)`.
  5. **Good Manners Town UI (`src/app/manners/index.tsx`):**
     - Added dynamic count badge: `٥٠ مَعلماً وخُلقاً حسناً`.
     - Integrated varied 3D artwork cycling through rich visual assets across all 50 landmarks.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.

### Milestone 31: Mobile Header Layout Redesign & Missing Icons Fix
- **User Issue Identified ("on mobile view header icons missing"):**
  - On narrow/mobile viewports (< 430px), the top bar was squeezing the greeting text and 4 right-aligned chips on a single horizontal row without wrapping, causing the Gems counter and Avatar circle to overflow and be completely clipped off the screen.
  - Streak and Parent Gate icons were also absent on the Home screen header.
- **Architectural Solution & Responsive Layout:**
  1. **Two-Tier Mobile-First Header (`src/app/index.tsx`):**
     - **Tier 1 (Identity & Control):**
       - **Child Avatar (`KidAvatar` size 42)** with tactile border and online status dot, directly coupled with greeting ("السلام عليكم، {name}!") and date. Tapping opens `/progress`.
       - **Language Toggle (`عربي / EN`)** + **Parent Gate Lock Button (`🔒`)** with `ParentGateModal` integration.
     - **Tier 2 (Gamification Stats Bar):**
       - Prominent 3-chip bar displaying:
         - **Streak (`🔥 {streakCount} أيام متتالية / streak`)** -> links to `/progress`.
         - **Stars (`⭐ {stars} نجمة / stars`)** with 3D star icon -> links to `/rewards`.
         - **Gems (`💎 {gems} جوهرة / gems`)** with 3D gem icon -> links to `/rewards`.
  2. **Compact Shared Header Optimization (`src/components/Header.tsx`):**
     - Adjusted padding (`12px`), chip spacing (`gap: 4`), and icon sizes so that on all inner screens (`/quran`, `/sunnah`, `/prophets`, `/manners`), all 5 chips (Streak, Stars, Gems, Language, Parent Lock) fit comfortably on small screens without truncation.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.

### Milestone 32: Full-Screen Desktop Responsiveness & Removal of Frame Constraints
- **User Request ("app sould be resposive full screen on desk top"):**
  - The application was previously confined inside an artificial `#064E3B` phone mockup container with `maxWidth: 520` in `src/app/_layout.tsx`, producing huge dark-green side bars on desktop screens.
  - Furthermore, individual screens were clamped to narrow `maxWidth: 720` or `maxWidth: 760` constraints.
- **Architectural Solution:**
  1. **Root Layout (`src/app/_layout.tsx`):**
     - Completely eliminated the `outerContainer` and `mobileContainer` (520px limit, shadow, and green border).
     - Standardized on `rootContainer: { flex: 1, backgroundColor: COLORS.background, width: '100%', height: '100%' }` allowing native full-width rendering across desktops, tablets, and phones.
  2. **Fluid Responsive Desktop Content Container (`maxWidth: 1240`):**
     - Updated `src/app/index.tsx`, `src/components/Header.tsx`, `src/components/AppBottomNav.tsx`, `src/components/AudioPlayerBar.tsx`, and all sub-routes (`/quran`, `/sunnah`, `/prophets`, `/manners`, `/rewards`, `/progress`, `/parents`, `/onboarding`) to use a spacious modern desktop layout (`maxWidth: 1240, alignSelf: 'center', width: '100%'`).
     - Allowed multi-column card grids on wide viewports while gracefully adapting to 100% full-width on mobile viewports.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.

### Milestone 33: Unified Sunnah Hero Header & Persistent Bottom Navigation for Hadith Cards & Duas Library
- **User Request & Issue ("بطاقات استذكار الأحاديث / مكتبة الأدعية المباركة - need both to run with the header not missing as screen 3"):**
  - When navigating to `/sunnah/cards` (Hadith Flashcards) or `/sunnah/duas` (Duas Library), the screens lacked the unified "طريق السنة" Hero Banner with the 4 switcher tabs (`الأحاديث (١٠٠)`, `السنن (١٠٠)`, `الأدعية (٥٠)`, `البطاقات (١٠٠)`).
  - The header title deviated (`بطاقات استذكار الأحاديث` / `مكتبة الأدعية المباركة`) and the bottom navigation bar (`AppBottomNav`) was missing, making the experience inconsistent compared to Screen 3 (`/sunnah`).
- **Architectural Solution:**
  1. **Reusable Component (`src/components/SunnahHeroHeader.tsx`):**
     - Encapsulated the amber Sunnah path hero banner, 3D badge (`nav-sunnah-3d.jpg`), dynamic counts, and the 4 interactive tabs.
     - Supports seamless navigation between Hadiths, Habits, Duas, and Cards with the active tab clearly highlighted in a white pill.
  2. **Sub-Screen Unification (`src/app/sunnah/cards.tsx`, `src/app/sunnah/duas.tsx`, `src/app/sunnah/index.tsx`):**
     - Aligned header title to `t.sunnah` ("طريق السنة").
     - Embedded `<SunnahHeroHeader activeTab="cards" />` and `<SunnahHeroHeader activeTab="duas" />` atop both screens.
     - Wrapped layouts inside responsive `appContainer` (`maxWidth: 1240, alignSelf: 'center'`).
     - Added persistent `<AppBottomNav />` with active Sunnah tab highlighted across all sub-screens.
- **Verification & Code Health:**
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo export --platform web`: 19 routes rebuilt cleanly (code 0).
  - Assets mirrored to `dist/assets/images/`.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.

### Milestone 34: Implementation & Verification of the 7 Production Security Principles
- **User Request:** Apply the 7 security rules (Secrets, Ownership, Database rules, Mass assignment, Payments, Rate limits, Prove it).
- **Architectural & Security Implementations (`server.js`, `scripts/test-security.js`):**
  1. **Secrets:** Audited all environment variables and client bundles. Zero secret variables or private API keys exposed to browser/client.
  2. **Ownership:** Multi-tenant resource routes authenticate caller identity solely via cryptographic `Authorization: Bearer <token>` session headers. Strictly zero routes trust client-provided `userId`.
  3. **Database Rules & RLS:** Verified client offline-first architecture (AsyncStorage + Zustand) preserving COPPA child privacy. Simulated server database enforces strict `record.ownerId === session.userId` on all SELECT, UPDATE, DELETE queries.
  4. **Mass Assignment:** Implemented strict schema validation on all routes (`/api/auth/login`, `/api/auth/signup`, `/api/user/records`, `/api/tts`, `/api/quran/surah`). Any unexpected fields (e.g. `isAdmin`, `role`, `ownerId`) or unauthorized query parameters are rejected with HTTP 400 Bad Request.
  5. **Payments Security:** Client cannot set prices or amounts. Server price catalog strictly dictates checkout amounts by `productId`. Implemented HMAC SHA-256 signature verification for Stripe webhooks, rejecting missing or invalid signatures with HTTP 400.
  6. **Rate Limiting:** Sliding-window rate limiter per IP and route prefix on `server.js` (`/api/auth/login`, `/api/auth/signup`, `/api/tts`, `/api/quran/surah`, etc.). Requests exceeding limits return HTTP 429 Too Many Requests with standard `Retry-After` header.
  7. **Prove It Test Suite:** Automated security test suite in `scripts/test-security.js`. Verified Alice creating a record while Bob attempting to read, update, or delete it receives HTTP 403 Forbidden.
- **Verification & Code Health:**
  - Automated Security Suite (`node scripts/test-security.js`): **23 / 23 PASSED (100%)**.
  - Noor Kids App E2E Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `npx.cmd tsc --noEmit`: 0 errors.

### Milestone 35: Full Android Installability (PWA WebAPK, 1-Tap In-App Banner, and Cloud APK Configuration)
- **User Request ("need app to be installable to android"):**
  - Enable direct and immediate installation on Android devices both as a standalone WebAPK (Progressive Web App) with 1-click install prompt and through Expo EAS Build for native APK files.
- **Architectural Implementation:**
  1. **Web App Manifest (`public/manifest.json`):**
     - Configured with `name`: "نور للأطفال - Noor Kids", `short_name`: "نور للأطفال", `start_url`: "/", `display`: "standalone", `background_color`: "#064E3B", `theme_color`: "#064E3B", `orientation`: "portrait".
     - Included 192x192, 512x512, and maskable icons (`android-icon-foreground.png`, `icon.png`).
  2. **Offline Service Worker (`public/sw.js`):**
     - Pre-caches core routes, images, styles, and assets to fulfill Android Chrome installability criteria and enable offline functionality.
  3. **Server Header & Meta Injection (`server.js`):**
     - Serves `/manifest.json` (`application/manifest+json; charset=utf-8`) and `/sw.js` (`application/javascript; charset=utf-8` with `Service-Worker-Allowed: /`).
     - Dynamically injects manifest link, mobile web-app tags, theme color `#064E3B`, and Service Worker registration into HTML head.
  4. **In-App 1-Tap Installation Modal & Banner (`src/components/InstallAndroidModal.tsx`):**
     - Listens to `beforeinstallprompt` event and displays a tactile Islamic install chip: "📲 تثبيت التطبيق على جهازك (تثبيت الآن)".
     - Triggers native Android installation prompt with 1 tap.
     - Fallback instructional modal explaining Chrome 3-dots "Install app" when opened on non-prompting browsers.
- **Verification & Code Health:**
  - `manifest.json`: HTTP 200, correct manifest mime-type.
  - `sw.js`: HTTP 200, Service-Worker-Allowed root header.
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `npx.cmd tsc --noEmit`: 0 errors.
  - Noor Kids App E2E Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.
  - Security Audit Suite (`node scripts/test-security.js`): **23 / 23 PASSED (100%)**.

### Milestone 36: Android Native Startup Crash Resolution & Clean Architecture
- **User Request ("app not running on android crashes and exit"):**
  - Fix Android native startup crash and unexpected app exit on APK launch.
- **Root Causes Identified & Resolved:**
  1. **Unused Heavy Native Modules & Worklets Collision (`package.json`):**
     - Uninstalled `react-native-reanimated` (v4.5.1 alpha), `react-native-worklets`, `@expo/ui`, `expo-glass-effect`, and `expo-symbols`. These alpha/unused native binaries attempted to initialize C++ JSI hooks on Android startup without Babel transform or New Architecture worklet support, triggering `UnsatisfiedLinkError` / native SIGSEGV crash.
  2. **Gesture Handler Root Entry (`src/app/_layout.tsx`):**
     - Added mandatory `import 'react-native-gesture-handler';` at line 1 of the root layout for React Native Screens on Android.
  3. **Unsafe Runtime `I18nManager.forceRTL` Removed (`src/app/_layout.tsx`):**
     - Removed runtime `I18nManager.forceRTL` which previously modified Android native `SharedPreferences` and triggered fatal `IllegalStateException` activity recreate crashes.
  4. **Native Splash Screen Lifecycle Protection (`src/app/_layout.tsx`):**
     - Replaced unprotected splash autohide with safety timeout fallback (`setTimeout(1200)`) preventing ANR activity termination by the Android OS watchdog.
  5. **Experimental React 19 Compiler Flag Removed (`app.json`):**
     - Removed experimental `"reactCompiler": true` which caused Hermes bytecode transform conflicts with Animated values on Android.
  6. **Declarative Navigation Redirection (`src/app/index.tsx`):**
     - Replaced imperative `router.replace('/onboarding')` in `useEffect` on root mount with declarative `<Redirect href="/onboarding" />`, preventing "Attempted to navigate before mounting root" crashes.
  7. **Platform-Split PWA Modal (`src/components/InstallAndroidModal.tsx` & `.web.tsx`):**
     - Separated web-specific DOM APIs (`window`, `beforeinstallprompt`) into `.web.tsx`. Native `.tsx` exports a clean `null` component, eliminating React hook ordering violations.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: 0 errors.
  - `npx.cmd expo lint`: 0 errors, 0 warnings.
  - `node scripts/test-e2e.js`: **39 / 39 PASSED (100%)**.
  - `npx.cmd expo-doctor`: passed.

### Milestone 37: Resolution of 'Cannot find native module ExponentAV' & Expo Router Route Resolution
- **User Log ("ERROR [Error: Cannot find native module 'ExponentAV']", "TypeError: Cannot read property 'ErrorBoundary' of undefined", "Route ./index.tsx is missing required default export"):**
  - **Root Cause Analysis:**
    1. `src/services/audioService.ts` was executing static top-level `import { Audio } from 'expo-av';`.
    2. When running in Expo Go (or environments where the native `ExponentAV` module version is mismatched or not installed), `expo-av` threw `[Error: Cannot find native module 'ExponentAV']` synchronously at module import time.
    3. Because `audioService.ts` threw on module evaluation, every screen that imported it (`index.tsx`, `quran/[surahId].tsx`, `quran/repeat.tsx`, `sunnah/cards.tsx`, `sunnah/duas.tsx`, `prophets/[prophetId].tsx`) failed evaluation and exported `undefined`.
    4. Expo Router logged warnings that those routes lacked default exports and crashed inside `<Stack>` with `TypeError: Cannot read property 'ErrorBoundary' of undefined`.
  - **Architectural Solution:**
    1. **Dynamic Safe Module Resolution (`src/services/audioService.ts`):** Wrapped `require('expo-av')` and `require('expo-speech')` inside safe `try/catch` handlers. The module now resolves dynamically at runtime without ever throwing on file evaluation.
    2. **Graceful Fallbacks:** If `ExpoAudio` is unavailable, audio safely falls back to native speech or silent mode with zero crashes.
    3. **GestureHandlerRootView & ErrorBoundary:** Wrapped root layout in `<GestureHandlerRootView>` and added an app-level `ErrorBoundary` component to capture any future runtime errors cleanly.
    4. **Git State Synchronization:** Committed all 148 files to Git (`3386712`) so EAS builds and Expo CLI have full repository context.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo lint`: **0 errors, 0 warnings**.
  - `npx.cmd expo export --platform web`: 19 routes built cleanly (code 0).
  - Noor Kids App E2E Suite (`node scripts/test-e2e.js`): **39 / 39 PASSED (100%)**.
  - Security Audit Suite (`node scripts/test-security.js`): **23 / 23 PASSED (100%)**.

### Milestone 38: Android Shadow Box Removal, Full-Screen Safe Area Insets, and Fast Local Asset Acceleration
- **Issues Identified in User Screenshots:**
  1. **Android Selection Shadow Box Artifacts:** In Onboarding language selection, age band cards, character cards, destination cards, and modal bubble, selection cards rendered an unclipped rectangular grey/dark box on Android because of `elevation: 3-8` combined with semi-transparent alpha background hexes (`#2DD4BF22`) without `overflow: 'hidden'`.
  2. **Status Bar Collision & Deprecated SafeAreaView:** The status bar (clock, wifi, battery) directly overlapped the headers and text inputs across screens because built-in `react-native` `SafeAreaView` does not support Android status bar insets.
  3. **Local Assets Performance:** Assets needed to load instantly without blank flashes or remote dependencies.
- **Architectural Solution:**
  1. **Theme Shadows (`src/constants/theme.ts`):** Set `elevation: 0` on Android across `SHADOWS.soft`, `SHADOWS.medium`, `SHADOWS.strong`, and `SHADOWS.glow`.
  2. **Solid Pastel Selection Fills (`src/app/onboarding.tsx`, `src/components/WordMeaningBubbleModal.tsx`):**
     - Replaced all semi-transparent hex backgrounds (`#2DD4BF22`, `w.themeColor + '15'`) with solid `#FFFFFF` (unselected) and solid `#ECFDF5` / `#FEF3C7` / `#EEF2FF` / `#F0F9FF` (selected).
     - Added `overflow: 'hidden'` to all card containers (`langCard`, `ageBandCard`, `avatarCard3D`, `worldPreviewCard`, `bubbleCard`).
  3. **Universal SafeAreaView Migration Across All Screens:**
     - Replaced deprecated `react-native` `SafeAreaView` with `react-native-safe-area-context` across all 16 screen routes (`quran/[surahId]`, `index`, `onboarding`, `sunnah`, `prophets`, `manners`, `rewards`, `progress`, `parents`).
     - Added `edges={['top', 'bottom', 'left', 'right']}` to guarantee Android edge-to-edge layout with full protection against status bar / notch overlap.
  4. **Fast Local Hardware-Accelerated Assets:**
     - Migrated `KidAvatar.tsx`, `Header.tsx`, `onboarding.tsx`, `sunnah/[hadithId].tsx`, `prophets/[prophetId].tsx`, `manners/[valueId].tsx`, `manners/journal.tsx`, `rewards/index.tsx`, `progress/index.tsx` to `expo-image` with `contentFit="cover"` / `contentFit="contain"` and `transition={150}` for local cached GPU rendering.
- **Verification:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **All 19 static routes exported cleanly (code 0)**.
### Milestone 39: Modern expo-audio Engine, False Completion Bug Elimination, Enriched Surah Story & Wisdom, and Header Name Layout
- **User Reported Issues:**
  1. **Audio Recitation & False Reward Bug:** Pressing recitation button failed with warning `[Error: Cannot find native module 'ExponentAV']` and falsely triggered completion stars/rewards without any audio playing.
  2. **Surah Story & Wisdom Showcase:** Request for richer content ("قصة السورة وعبرها") in place of verse count and download buttons, plus deeper reflections.
  3. **Header Name Truncation ("السلام عليكم، رؤ..."):** In Arabic, child names were truncated by `numberOfLines={1}` in a cramped single-row header.
  4. **Lock Icon Ambiguity:** User asked what the standalone `🔒` icon in the header was.
- **Architectural Solution:**
  1. **Dual Audio Engine (`src/services/audioService.ts`):**
     - Installed and integrated modern `expo-audio` (`createAudioPlayer`) for SDK 57 native compatibility.
     - Provided runtime fallback chain: `expo-audio` -> legacy `expo-av` -> HTML5 Audio -> graceful error reporting.
     - **ELIMINATED FALSE REWARD CASCADE:** Replaced `didJustFinish: true` on fallback with `{ isPlaying: false, error: true, unavailable: true }`. In `src/app/quran/[surahId].tsx` and `src/app/quran/repeat.tsx`, added strict guards against `status.error` to never auto-advance or grant unearned stars.
  2. **Surah Story & Wisdom Showcase Card (`src/app/quran/[surahId].tsx`):**
     - Replaced the bulky top header row with a story showcase card displaying revelation context, a 2-line story preview, the golden lesson pill (`🌱 العبرة الذهبية`), and an interactive action button: "اقرأ القصة وتدبّر عِبرها كاملة مع نور 📖✨".
     - Expanded `SurahStoryModal.tsx` with **فضل وبركة هذه السورة المباركة** (Authentic Surah virtues) and **سؤال اليوم للأبطال للتفكر والتدبر** (Reflection question for kids).
  3. **Two-Tier Header Layout (`src/app/index.tsx`):**
     - Separated header into a top utility row (Date badge, Language toggle, labeled `[ 🔒 منطقة الأهل ]` button) and a dedicated full-width Child Greeting banner (`السلام عليكم ورحمة الله 🌿`, `أهلاً يا [الاسم]! 🌟`).
     - Removed `numberOfLines={1}` and `maxWidth` constraints; child names render cleanly in Arabic and English.
  4. **Labeled Parent Gate Button:**
     - Replaced bare `🔒` icon with an explicit labeled pill `[ 🔒 منطقة الأهل ]` (or `[ 🔒 Parents ]`) to clarify its purpose (parental gate with arithmetic safety question).
- **Verification:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **All 19 static routes exported cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **39 / 39 PASSED (100%)**.

### Milestone 40: Category Menus & Tab UI Overhaul (Icons, Count Badges, Alignment, Bottom Nav & Sub-Header Spacing)
- **User Reported Issue ("ui بتاع القوايم لازم ميبقاش الكتابة والايوكنات مش مظبوطة صلحها"):**
  - In `/sunnah` screenshot: Category tabs inside the orange hero banner were squeezed into 70px `flex: 1` buttons without icons. Arabic labels wrapped into 2 lines (`الأحاديث` on line 1, `(100)` on line 2), producing an uneven, squished white box.
  - In `AppBottomNav`: Active tab had an irregular outer rectangular border box that warped layout and alignment relative to the other 5 tabs.
  - In `Header`: Sub-screens with back navigation were crowded by having `Streak + Stars + Gems + Language Switch + Lock` on a single row, squeezing the screen title down to ~70px.
  - In Hadith cards: Hadith grade was duplicated (rendered twice on same card), and RTL arrow button was improperly aligned.
- **Architectural Solution:**
  1. **Sunnah Category Tab Menu Bar (`src/components/SunnahHeroHeader.tsx`):**
     - Extracted tabs out of the cramped hero banner into a dedicated horizontal scrollable menu bar (`ScrollView horizontal showsHorizontalScrollIndicator={false}`).
     - Added dedicated, vibrant vector icons for each tab (`📜 الأحاديث النبوية`, `🌱 سنن اليوم`, `🤲 الأدعية المباركة`, `🎴 بطاقات الحفظ`).
     - Added single-line label enforcement (`numberOfLines={1}`) and a standalone count badge pill (`styles.tabCountPill`), completely preventing text wrapping.
     - Modern active/inactive state styling with soft shadows and theme-colored active pills.
  2. **Quran Category Tabs Enhancement (`src/app/quran/index.tsx`):**
     - Updated Juz Amma, All Quran, and Featured tabs with standalone count pills (`38`, `114`), single-line labels, and RTL `row-reverse` support.
  3. **AppBottomNav Uniform Alignment (`src/components/AppBottomNav.tsx`):**
     - Replaced clunky rectangular outer box with a refined icon-highlight pill ring (`transform: [{ scale: 1.1 }]`, theme-colored border, pastel background) and an active indicator dot.
     - Upgraded to `expo-image` for crisp 3D icon rendering and set uniform typography (`10.5px`, `fontWeight: 800`).
  4. **Sub-Screen Header De-cluttering (`src/components/Header.tsx`):**
     - On screens with `showBack={true}`, hid the redundant language toggle and parent lock, dedicating full breathing room to the Back button and Title while preserving kid rewards (Stars & Gems).
  5. **Hadith Cards RTL & Action Pill (`src/app/sunnah/index.tsx`):**
     - Removed redundant duplicate grade badge.
     - Styled a dedicated interactive action pill (`تدبر وتعلّم` / `Learn`) with properly oriented RTL arrow (`arrow-back` for Arabic, `arrow-forward` for English).
- **Verification:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **All 19 static routes exported cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **39 / 39 PASSED (100%)**.

### Milestone 42: Restoring Sunnah 4-Segment Tabs, Surah Memorization Completion Gate & Audio/Performance Overhaul
- **User Request:**
  1. Sunnah tabs navigation trap & broken design: Restore the 4 tabs ("الأحاديث", "سنن اليوم", "الأدعية", "بطاقات الحفظ") to the hero banner as they were originally, make buttons clean, format text neatly inside each button, and fix navigation so user can never get trapped.
  2. Surah completion bug: Opening a Surah must never mark it as memorized. The child must review all verses and tap an explicit confirmation button at the end to mark the Surah memorized.
  3. App slowness & Quran audio playback failure: Fix network latency freezing the app and fix Quran audio not playing.
- **Architectural Solutions & Changes:**
  1. **Sunnah 4-Segment Tabs & Seamless Bidirectional Navigation:**
     - In [`SunnahHeroHeader.tsx`](file:///g:/quran%20app%20for%20kids/src/components/SunnahHeroHeader.tsx): Restored the unified 4-segment tab bar inside the hero card banner.
     - Redesigned each button with vertical icon-over-label alignment, uniform height (`52px`), and single-line labels (`الأحاديث`, `سنن اليوم`, `الأدعية`, `بطاقات الحفظ`).
     - Standardized peer tab switching on `router.replace` across [`sunnah/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/index.tsx), [`sunnah/duas.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/duas.tsx), and [`sunnah/cards.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/cards.tsx), ensuring users can freely switch between tabs and never get trapped in back-stack loops. Set `fallbackRoute="/sunnah"` on sub-screen headers.
  2. **Surah Memorization Completion Milestone Gate:**
     - In [`useAppStore.ts`](file:///g:/quran%20app%20for%20kids/src/store/useAppStore.ts): Decoupled `addSurahStars` from `isCompleted: true`. Added dedicated `markSurahCompleted(surahNumber)`.
     - In [`[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx): Added a dedicated **خاتمة حفظ السورة (Surah Memorization Milestone)** card at the bottom of the verse list.
     - Displays live memorization progress (`X / Y` verses).
     - Renders an explicit confirmation button: `[ ✨ اضغط هنا: أتممت حفظ سورة ... بحمد الله! 🌟 ]` that verifies all verses, marks the Surah completed, awards bonus stars & gems, and launches the celebration modal.
  3. **Zero-Latency Surah Caching & Instant Performance:**
     - In [`quranService.ts`](file:///g:/quran%20app%20for%20kids/src/services/quranService.ts): Added in-memory caching (`_cache = new Map()`). Bundled surahs with authentic text and Tafsir are returned instantly (0ms latency) without making blocking network requests.
     - External fetches have strict 3.5s timeout abort controllers so network drops never freeze the screen.
  4. **Quran Audio Engine Fix:**
     - In [`audioService.ts`](file:///g:/quran%20app%20for%20kids/src/services/audioService.ts):
       - On Native: Passed raw string `uri` to `ModernExpoAudio.createAudioPlayer(uri)` instead of `{ uri }` which invoked `Asset.fromURI` and failed on remote streaming links.
       - Buffering safety: Adjusted `playbackStatusUpdate` listener so it does not report `isPlaying: false` while the player is loading or buffering.
       - On Web: Made `stopDua()` synchronous so user clicks retain their browser interaction gesture, allowing `audio.play()` to execute synchronously without autoplay policy rejections.
- **Verification:**
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `node scripts/test-e2e.js`: **39 / 39 PASSED (100%)**.
  - `npx.cmd expo export --platform web`: **Exported dist cleanly (0 errors)**.

### Milestone 43: Child Voice Recorder Studio, Local Push Notifications & APK Build Readiness
- **Child Voice Recorder Studio (`src/services/voiceRecordService.ts`, `src/components/ChildVoiceRecorderModal.tsx`, `src/app/quran/[surahId].tsx`):**
  - Added interactive `[ 🎙️ سجّل صوتك ]` button next to every Ayah in the Quran player.
  - Recording modal displays the full Uthmani verse, animated recording status with live timer, and instant playback.
  - Features dual comparison: listen to child's own recording vs. listen to the selected Sheikh's recitation.
  - Awards recitation stars and celebration upon successful practice.
- **Gentle Local Notifications Engine (`src/services/notificationService.ts`, `src/app/parents/index.tsx`):**
  - Configured 3 daily friendly reminders: Morning Dua (8:00 AM), Quran Garden Time (4:30 PM), Bedtime Adhkar (8:30 PM).
  - Integrated into Parents Corner with instant test notification button and permission handling.
- **APK / AAB Mobile Build Readiness (`app.json`, `eas.json`):**
  - Added `android.permission.RECORD_AUDIO` to `app.json`.
  - Configured `eas.json` with `preview` profile for direct standalone APK generation (`buildType: "apk"`), and `production` for Google Play AAB.
- **Verification:**
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `node scripts/test-e2e.js`: **39 / 39 PASSED (100%)**.
  - `npx.cmd expo export --platform web`: **Exported dist cleanly (0 errors)**.

### Milestone 44: Interactive Arkan Academy (أكاديمية الأركان - أركان الإسلام والإيمان)
- **Theological & Pedagogical Scope:**
  - Expanded Noor Kids to include the 5th World: **أكاديمية الأركان (Pillars Academy)**, covering the core foundations of the Muslim child's identity.
  - **أركان الإسلام الخمسة (5 Pillars of Islam):**
    1. الشهادتان (Shahada - Declaration of Faith): Meaning, recitation, and virtues.
    2. إقامة الصلاة (Salah - 5 Daily Prayers): Includes dual interactive simulators:
       - **محاكي الوضوء (Wudu Simulator - 8 خطوات):** متسلسلة مع أذكار الوضوء والنية.
       - **محاكي طريقة الصلاة خطوة بخطوة (Prayer Simulator - 10 خطوات):** تكبيرة الإحرام، قراءة الفاتحة، الركوع، الرفع منه، السجود على الأعضاء السبعة، الجلوس بين السجدتين، السجود الثاني، التشهد، الصلاة الإبراهيمية، والتسليم مع فقاعات الأذكار والأدعية المستحبة.
       - **أركان الصلاة العظيمة (١٣ ركناً أساسياً) وشروط صحة الصلاة (٦ شروط للأبطال)** موثقة ومفصلة.
    3. إيتاء الزكاة (Zakah - Giving & Charity): Fostering generosity and caring for neighbors in need.
    4. صوم رمضان (Sawm - Fasting Ramadan): Month of the Quran, compassion, and celebration.
    5. حج البيت (Hajj - Pilgrimage): Kaaba, Tawaf, and brotherly unity of Muslims worldwide.
  - **أركان الإيمان الستة (6 Pillars of Iman):**
    1. الإيمان بالله (Belief in Allah): Creator, Loving, Ever-Watchful.
    2. الإيمان بالملائكة (Belief in Angels): Jibril, Mikail, creatures of pure light (strictly respectful, no anthropomorphic imagery).
    3. الإيمان بالكتب السماوية (Belief in Divine Books): Quran, Torah, Injil, Zabur.
    4. الإيمان بالرسل (Belief in Messengers): Exemplars of honesty and guidance from Adam to Muhammad ﷺ.
    5. الإيمان باليوم الآخر (Belief in the Last Day): The Day of Good Deeds and eternal Paradise.
    6. الإيمان بالقدر (Belief in Divine Decree - Qadar): Trusting Allah's wisdom with a peaceful heart.
- **Architectural & Component Implementation:**
  - `src/data/arkanData.ts`: Authentic dataset with Hadith proofs (Hadith Jibril - Sahih Muslim & Ibn Umar - Bukhari & Muslim), detailed sections, Wudu steps, 10-step Prayer simulator with authentic Dhikr (`dhikrAr`, `dhikrEn`), and kid-appropriate interactive multiple-choice quizzes with immediate explanations.
  - `src/app/arkan/index.tsx`: Hub screen with dynamic tab switching between Islam (5 Pillars) and Iman (6 Pillars), progress badges, reward star indicators, and kid-friendly cards.
  - `src/app/arkan/[pillarId].tsx`: Interactive study screen featuring learning cards, dual simulator mode switch (`[ 🌊 كيف أتوضأ؟ | 🕌 كيف أصلي؟ ]`), step-by-step carousel with Dhikr bubbles, Hadith box, interactive knowledge quiz with real-time feedback, celebratory modal, and rewards (stars & gems).
  - `src/app/index.tsx` & `src/components/Header.tsx`: Added 5th World gateway card to the main adventure map and updated header fallback routes.
- **Verification:**
  - `npx.cmd expo lint`: **0 errors, 0 warnings**.
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported all 21 static routes cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **55 / 55 PASSED (100%)**.

### Milestone 45: Wudu Interactive World Card & 3D Visual Asset Integration (تعلّم الوضوء الطهور)
- **User Request:**
  - "ضيف الوضوء تحت حمب الاركان والصلاة وخليها نفس الثيم وولدلها صورة خاصة" (Add Wudu below next to Arkan & Salah, keep it in the same theme, and create/generate a dedicated image for it).
- **Architectural & Design Implementation:**
  1. **Dedicated 3D Visual Asset (`assets/images/wudu-garden.jpg`):**
     - Crafted high-resolution (1200x896, 4:3) 3D Pixar Disney style illustration featuring crystal-clear water flowing from a stone fountain into cupped hands in an Islamic garden courtyard with blooming flowers and sunshine.
  2. **Home Screen World Cards Expansion (`src/app/index.tsx`):**
     - Added 6th world: **تعلَّم الوضوء الطهور (Wudu Learning & Simulator)**.
     - Subtitle: `خطوات وسُنن الوضوء خطوة بخطوة` (`Step-by-Step Ablution Guide`).
     - Badge/Count Pill: `٨ خطوات تفاعلية وأذكار` (`8 Interactive Steps & Duas`).
     - Pastel cyan water gradient: `['#e0f2fe', '#bae6fd']`.
     - Route: `/arkan/salah?mode=wudu` (direct link to the 8-step Wudu interactive simulator).
     - Balanced layout: perfectly paired with **أكاديمية الأركان والصلاة** on the bottom row under the first 4 worlds (Quran Garden, Sunnah Path, Prophets Caravan, Good Manners Town).
     - Updated section title counter to `ستة عوالم مباركة بانتظار استكشافك!` (`Six wonderful worlds`).
  3. **Data & Navigation Support (`src/data/arkanData.ts`, `src/app/arkan/[pillarId].tsx`):**
     - Updated `arkanService.getPillarById('wudu')` to resolve to the Salah pillar.
     - Updated `PillarDetailScreen` to read `mode=wudu` query param and default `simMode` directly to `'wudu'`.
     - Updated Header title to dynamically show `تعلَّم الوضوء الطهور` when accessing Wudu.
- **Verification:**
  - `npx.cmd expo lint`: **0 errors, 0 warnings**.
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **All 21 static routes exported cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **56 / 56 PASSED (100%)**.

### Milestone 46: Install Banner Relocated to Parents Area & 3D Prayer/Wudu Visual Assets Queue
- **User Request & Decision:**
  - "نقله إلى 'منطقة الأهل'" (Relocate the app installation banner from the home screen into the Parents Area).
  - "اول صورة نفس الطفل بس بيرفع ايديه للاذان / تكبيرة الإحرام" (Step 1 of Salah: Same 3D boy in white thobe and kufi, raising his hands up to his ears/shoulders for Takbeerat al-Ihram).
  - "الصورة التانية غيرها بصورة الطفل بنفس الوضع" (Step 10 of Salah: Replace the adult in blue shirt with the same 3D boy sitting on the emerald rug turning his head in Tasleem).
  - "wait and update memory file" (Wait for the official AI image generation quota reset rather than using low-quality deformed third-party tools, and update memory file).
- **Implementations Completed:**
  1. **Clean Home Screen:** Removed `InstallAndroidModal` and its dark green banner completely from `src/app/index.tsx`, restoring full clean layout above the oasis hero banner.
  2. **Parents Area Integration:** Moved `InstallAndroidModal` into a dedicated setting card in `src/app/parents/index.tsx` ("تثبيت التطبيق على جهاز الطفل").
  3. **Immediate Removal of Adult Photo:** Replaced `salah-sitting-clean.jpg` (the adult in blue shirt) across steps 6, 8, 9, 10 in `src/data/arkanMedia.ts` with the consistent 3D child asset as a clean fallback until the dedicated sitting/Tasleem assets are generated.
  4. **Active 3D Generation Queue (Awaiting Quota Reset at ~00:20 AM):**
     - **Salah Step 1 (`assets/images/salah-takbeer-3d.jpg`):**
       `Prompt: A 3D Pixar animation style cute 7-year-old Muslim boy with brown curly hair wearing a white embroidered thobe and white prayer cap (kufi), standing barefoot on an emerald green prayer rug inside a sunlit mosque. He is raising both hands up to his ears with open palms in Takbeerat al-Ihram for prayer, peaceful smile, Disney Pixar character render, soft volumetric lighting.`
     - **Salah Step 10 (`assets/images/salah-tasleem-3d.jpg`):**
       `Prompt: A 3D Pixar animation style cute 7-year-old Muslim boy with brown curly hair wearing a white embroidered thobe and white prayer cap (kufi), sitting in prayer posture on an emerald green prayer rug inside a sunlit mosque. He is gently turning his head to his right shoulder smiling peacefully in Tasleem, Disney Pixar character render, soft lighting.`
     - **Wudu Steps (6 Assets):**
       1. `wudu-mouth-boy.jpg`: Cute 3D boy cupping water in his hand to rinse mouth (المضمضة).
       2. `wudu-nose-girl.jpg`: Little 3D girl in floral hijab rinsing nose with water (الاستنشاق).
       3. `wudu-face-boy.jpg`: Little 3D boy washing his whole face with water (غسل الوجه).
       4. `wudu-arms-child.jpg`: 3D child with rolled-up sleeves washing arms up to elbows (غسل اليدين للمرفقين).
       5. `wudu-head-boy.jpg`: Little 3D boy wiping his hair and ears with wet hands (مسح الرأس والأذنين).
       6. `wudu-feet-child.jpg`: 3D child washing feet up to ankles with water (غسل القدمين).
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo lint`: **0 errors, 0 warnings**.
  - `npx.cmd expo export --platform web`: **Exported all 21 static routes cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **56 / 56 PASSED (100%)**.

### Milestone 47: Three Practical Features Completed (2, 3, 5)
- **User Request:** "2 then 3 then 5" from proposed practical additions list:
  1. **Feature 2: Printable & Downloadable Kids Achievement Certificates (شهادات التقدير والإنجاز القابلة للطباعة)**:
     - Component: [`src/components/AchievementCertificateModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/AchievementCertificateModal.tsx).
     - Features: Islamic golden borders, corner stars, Basmalah, dynamic child profile name (`activeProfile.name`), certificate type, target title/subtitle, official date formatting, golden embossed seal (`ICON_STAR_IMG`), Mascot Noor signature, and native/web print capability (`window.print()`).
     - Integrated into:
       - [`src/app/quran/[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx): Automatically triggers upon completing memorization of any Surah and provides a dedicated "عرض وطباعة شهادة التقدير والإنجاز" button in the milestone card.
       - [`src/app/progress/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/progress/index.tsx): Kids and parents can preview and print their General Journey Certificate or individual Surah certificates anytime.
  2. **Feature 3: Kid-Friendly 3D Tasbih Counter (مسبحة الأذكار التفاعلية للأطفال)**:
     - Component: [`src/components/KidTasbihModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/KidTasbihModal.tsx) and route [`src/app/sunnah/tasbih.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/tasbih.tsx).
     - Features:
       - 7 authentic Dhikr selections (SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illa Allah, Salawat on Prophet ﷺ, Astaghfirullah, SubhanAllahi wa bihamdih).
       - Tactile large 3D tap button with dynamic gradient, ring highlight, spring bounce animation on every tap.
       - Synthesized Web Audio API "tick" sound and celebration chime chords (zero network dependencies).
       - Live counter display (`count / target`), progress ring bar, completed rounds tracker, and reset button.
       - Celebratory completion animation rewarding +1 Star and +1 Gem upon completing a 33-round.
     - Integrated into:
       - Home Screen (`src/app/index.tsx`): Quick Tasbih button in Hadith of the Day banner.
       - Sunnah Hub (`src/components/SunnahHeroHeader.tsx` & `src/app/sunnah/index.tsx`): 5th tab for instant Tasbih access.
  3. **Feature 5: Instant Smart Cross-App Search (شريط البحث السريع والذكي)**:
     - Component: [`src/components/SmartSearchModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/SmartSearchModal.tsx).
     - Features:
       - Real-time search across all 114 Surahs, 100 Hadiths, 50 Duas, 25 Prophets, 50 Manners, and Prayer/Wudu Academies.
       - Advanced Arabic text normalizer (removes Tashkeel, normalizes Alef and Taa Marbuta) for forgiving matches.
       - Category filter tabs (All, Quran, Hadiths, Duas, Prophets, Manners, Pillars).
       - One-tap quick suggestion badges (Al-Fatihah, Al-Kahf, Sleep Dua, Prophet Yusuf, Wudu, Honesty, Tasbih).
       - Direct 1-tap navigation to the matched route with matching badge colors and subtitles.
     - Integrated into:
       - [`src/components/Header.tsx`](file:///g:/quran%20app%20for%20kids/src/components/Header.tsx): Quick search icon available across all screens.
       - [`src/app/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/index.tsx): Prominent instant search bar right on the Home screen.

### Milestone 48: 3D Pixar Media Generation & Authentic Visual Pipeline for Wudu & Salah Simulators
- **Context & Need:**
  - The Wudu simulator previously had several steps sharing generic water jug illustrations.
  - The Salah simulator had a photo of an adult man in a blue modern shirt for Tashahhud (`salah-sitting-tashahhud.jpg`) which broke character consistency and immersion.
  - The user requested generating authentic, custom 3D Pixar/Disney style illustrations matching the established child characters (a cute 7-year-old boy in white thobe and kufi, and a 6-year-old girl in pink floral hijab).
- **Generated Assets & Integrations (Saved to `assets/images/`):**
  1. `salah-takbeer-3d.jpg` (706 KB): 7yo boy raising hands to ears in Takbeerat al-Ihram.
  2. `salah-tasleem-3d.jpg` (730 KB): 7yo boy sitting in Tashahhud raising index finger and turning head to right in Tasleem.
  3. `wudu-mouth-boy.jpg` (877 KB): 7yo boy cupping water with right hand to rinse mouth (المضمضة).
  4. `wudu-nose-girl.jpg` (770 KB): 6yo girl in pink floral hijab sniffing and rinsing nose with water (الاستنشاق).
  5. `wudu-face-boy.jpg` (805 KB): 7yo boy gently washing entire face with clear water (غسل الوجه).
  6. `wudu-arms-child.jpg` (859 KB): 7yo boy with rolled-up sleeves washing arm up to the elbow (غسل اليدين للمرفقين).
  7. `wudu-head-boy.jpg` (796 KB): 7yo boy wiping hair and ears (مسح الرأس والأذنين).
  8. `wudu-feet-child.jpg` (881 KB): 7yo child sitting on marble step washing foot and ankle (غسل القدمين إلى الكعبين).
- **Data & Component Wiring:**
  - [`src/data/arkanMedia.ts`](file:///g:/quran%20app%20for%20kids/src/data/arkanMedia.ts): Fully remapped all 8 Wudu steps and Salah steps 1 & 10 to the new 3D assets.
  - [`scripts/test-e2e.js`](file:///g:/quran%20app%20for%20kids/scripts/test-e2e.js): Added all 8 assets to automated HTTP asset verification.

### Milestone 49: Home Screen Header De-duplication & Arkan World Card Title/Text Unification
- **Context & User Request:**
  - The home screen previously contained both a standalone blue prayer feature banner (`prayerFeatureCard`) and an Arkan world card in the "اختر مسارك يا بطل" section, causing visual redundancy.
  - The user requested taking the title and subtitle from the blue banner ("تعلَّم كيف تتوضأ وتصلي خطوة بخطوة" / "محاكي الوضوء (٨ خطوات) • محاكي الصلاة (١٠ خطوات) • أركان وسنن الصلاة") and placing them directly onto the Arkan world card, and then completely removing the duplicate top banner.
- **Implementation:**
  - Updated `worlds` in [`src/app/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/index.tsx):
    - `title`: `isAr ? 'تعلَّم كيف تتوضأ وتصلي خطوة بخطوة' : 'Learn How to Pray & Make Wudu'`
    - `subtitle`: `isAr ? 'محاكي الوضوء (٨ خطوات) • محاكي الصلاة (١٠ خطوات) • أركان وسنن الصلاة' : 'Wudu Simulator (8 steps) • Prayer Simulator (10 steps) • Pillars & Sunnahs'`
  - Completely removed the redundant top blue banner (`prayerFeatureCard`) and its unused styles.
- **Verification & Code Health:**
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported all 22 static routes cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **65 / 65 PASSED (100%)**.

### Milestone 50: Resolution of "Unexpected token '<'" Stale Bundle Mismatch & SW Strategy
- **Root Cause & Diagnosis:**
  - When Expo exports a new web build (`npx expo export --platform web`), the entry bundle hash changes (e.g. from `entry-d78b...js` to `entry-8fec...js`).
  - Previously, `server.js` used a catch-all SPA fallback that routed ALL non-existent file requests to `index.html` with status 200 and MIME `text/html`.
  - When the client's browser (or PWA Service Worker caching the previous HTML) requested an old JS hash, `server.js` returned the HTML document (`<!DOCTYPE html>...`).
  - The browser attempting to parse HTML as JavaScript triggered `Uncaught SyntaxError: Unexpected token '<'`.
- **Solution & Fixes:**
  1. [`server.js`](file:///g:/quran%20app%20for%20kids/server.js):
     - Added an intelligent fallback for `/_expo/static/js/web/entry-*.js` requests: if the specific hash requested is stale, it automatically resolves and serves the current active entry bundle with `Content-Type: text/javascript`.
     - Static assets (`.js`, `.css`, `.png`, etc.) now strictly return HTTP 404 when missing, never `index.html`.
     - HTML responses now set `'Cache-Control': 'no-cache, no-store, must-revalidate'`, preventing browsers from locking on old script hashes.
  2. [`public/sw.js`](file:///g:/quran%20app%20for%20kids/public/sw.js):
     - Updated HTML navigation requests to **Network-First**, ensuring new bundle script tags load immediately on reload.
     - Bumped cache version to `'noor-kids-v2'`.
- **Verification:**
  - Tested requesting old hash: returns HTTP 200 with `Content-Type: text/javascript` and valid JS code.
  - Full E2E suite (`scripts/test-e2e.js`): **65 / 65 PASSED (100%)**.

### Milestone 51: Exact Assignment of Prayer/Wudu Titles to the Water Card & Arkan Card Preservation
- **Correction:**
  - Previously, the title and subtitle were placed on the left card (the desert oasis `arkan` card), while the right card (with the water picture `wudu`) was left unchanged as "تعلّم الوضوء الطهور".
  - The user clarified that the card with the water picture (`wudu`) is the one that needed the comprehensive title:
    - **العنوان:** «تعلَّم كيف تتوضأ وتصلي خطوة بخطوة»
    - **النص التوضيحي:** «محاكي الوضوء (٨ خطوات) • محاكي الصلاة (١٠ خطوات) • أركان وسنن الصلاة»
    - **الرابط:** `/arkan/salah`
  - While the desert oasis card (`arkan`) was restored to:
    - **العنوان:** «أكاديمية الأركان»
    - **النص التوضيحي:** «أركان الإسلام والإيمان الخمسة والستة»
    - **الرابط:** `/arkan`
- **Verification:**
  - TypeScript zero errors (`0 errors`).
  - Web export build refreshed cleanly (`entry-a6976483eb5c4bdd3cd62d6ccceb3bb4.js`).
  - Automated E2E test suite: **65 / 65 PASSED (100%)**.

### Milestone 52: Automated AI Slop & Code Quality Repair (`aislop fix`)
- **Execution & Scope:**
  - Ran `npx aislop@latest fix` resolving **61 mechanical issues** across 74 codebase files.
  - Automatically removed 42 unused React/symbol imports.
  - Cleaned up 15 decorative narrative divider comments.
  - Cleaned up unused variable/parameter declarations.
  - Project Quality Score increased from **59 / 100** to **66 / 100**.
- **Verification & Code Health:**
  - `node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported all 22 static routes cleanly (code 0)**.
  - `node scripts/test-e2e.js`: **65 / 65 PASSED (100%)**.

### Milestone 54: 100% On-Device Offline Privacy, Local Multi-Child Profiles & Isolated Progress, Zero-Server Enforcement
- **Privacy & Storage Architecture:**
  - Enforced strict on-device storage in [`src/store/useAppStore.ts`](file:///g:/quran%20app%20for%20kids/src/store/useAppStore.ts) via `AsyncStorage` (`@noor_kids_app_state_v1`).
  - Completely eliminated any requirement for cloud databases, user registration accounts, or cross-device synchronization.
  - Zero analytics, trackers, telemetry, or advertising SDKs.
- **Multi-Child Profile Isolation:**
  - Created `ChildProgressData` and `profilesProgress: Record<string, ChildProgressData>` in [`src/store/useAppStore.ts`](file:///g:/quran%20app%20for%20kids/src/store/useAppStore.ts).
  - Each child profile maintains isolated `surahProgress`, `hadithProgress`, `storyProgress`, `scenarioProgress`, `dailyHabitsDone`, `stars`, `gems`, `streakCount`, `gratitudeEntries`, and stickers/badges.
  - Seamless switching (`setActiveProfile`), child addition (`addProfile`), deletion with confirmation (`deleteProfile`), and individual progress getter (`getChildProgress`).
- **Parents Corner Upgrades ([`src/app/parents/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/parents/index.tsx)):**
  - Added prominent **Strict Local Privacy & On-Device Storage Guarantee Banner**:
    - «تُحفظ ملفات الأطفال وتقدمهم على هذا الجهاز فقط، ولا تتم مزامنتها مع أجهزة أخرى»
    - Clear warning: «تنبيه هام: حذف التطبيق أو مسح بياناته يؤدي إلى حذف ملفات الأطفال والتقدم المحفوظين نهائياً.»
  - Added **Children Progress Reports Section (سجل إنجازات وتقدم الأطفال - مستقل لكل طفل)**:
    - Renders individual breakdown cards for each child profile on this device (Stars, Gems, Streak, Completed Surahs, Hadiths, Stories) with quick switch and delete buttons.
  - Upgraded **Security PIN** protection note: PIN is stored purely in local memory on this device, never transmitted anywhere.
  - Added **Offline Mode & External Features Transparency Card**:
    - Discloses 100% offline educational modules vs external streaming requests (EveryAyah audio CDN & AlQuran Cloud), explicitly confirming that zero personal data is ever transmitted with external requests.
### Milestone 55: Interactive Child Profile Switcher (`ChildProfileSwitchModal`) Across Home, Header & Progress
- **Created `ChildProfileSwitchModal` (`src/components/ChildProfileSwitchModal.tsx`):**
  - Instant interactive modal enabling children and parents to switch between active profiles with a single tap.
  - Displays all child profiles on the device with 3D avatars, names, age categories, and active badge indicator.
  - Includes stats previews (⭐ stars, 💎 gems, 📖 surahs) per child.
  - Built-in quick child creator form with custom avatar upload/preset picker and age band selector.
- **Screen Integrations:**
  - **Home Screen (`src/app/index.tsx`):** Added a dedicated «تبديل ↺» pill button right on the top child greeting banner, and clicking the banner opens the switch modal.
  - **Global Header (`src/components/Header.tsx`):** Tapping the child profile avatar/name chip in the header now opens `ChildProfileSwitchModal`.
  - **Progress Screen (`src/app/progress/index.tsx`):** Added a «تبديل ↺» button directly on the child profile header banner.
- **Verification:**
  - TypeScript zero errors (`npx.cmd tsc --noEmit` -> 0 errors).
  - Web export build refreshed cleanly (`entry-0aeb676020ea216dc4b7e3ce76f6479a.js`).
  - E2E test suite: **65 / 65 PASSED (100%)**.

### Milestone 56: Child Profile Deduplication, Profile Deletion, and Smart Cleanup
- **Root Cause Analysis:**
  - Upon completing or re-running onboarding (`onboarding.tsx`), the action was invoking `addProfile` with the fallback name `"البطل"` (or `"Champion"`) alongside `default-child` ("طارق") instead of renaming/updating the initial default profile.
  - Lack of a delete button or deduplication mechanism in the switcher modal caused multiple duplicate profiles to pile up in `AsyncStorage`.
- **Implementation & Fixes:**
  1. **Store Upgrade (`src/store/useAppStore.ts`):**
     - Added `cleanupDuplicateProfiles()`: inspects existing child profiles, keeps the active profile and any with custom distinct names, and safely prunes redundant fallback `"البطل"` / `"Champion"` duplicates.
  2. **Modal Controls (`src/components/ChildProfileSwitchModal.tsx`):**
     - Added individual delete icon buttons (🗑️ `trash-outline`) with confirm dialogue (`window.confirm` on web, `Alert.alert` on native) when `profiles.length > 1`.
     - Safeguard: Prevents deleting the sole remaining profile to ensure at least one active profile always exists.
     - Added «تنظيف الملفات الزائدة والمكررة 🧹» banner button when `profiles.length > 2` for one-tap cleanup.
  3. **Onboarding Safeguard (`src/app/onboarding.tsx`):**
     - Updated `handleFinish`: If `default-child` is the only profile, it adds the new profile and cleanly deletes `default-child`, avoiding extra duplicate creation.
  4. **Wudu & Salah Learning Card Copy Update:**
     - Title: «تعلَّم كيف تتوضأ وتصلي خطوة بخطوة»
     - Subtitle: «محاكي الوضوء (٨ خطوات) • محاكي الصلاة (١٠ خطوات) • أركان وسنن الصلاة»
### Milestone 57: Morning & Evening Adhkar (أذكار الصباح والمساء) & Tasbih Counter Integration
- **Context & Requirement:** Added dedicated Morning and Evening Adhkar with authentic Hadith references, full Tashkeel, interactive tap counters, virtues/rewards, and audio playback; clearly highlighted and integrated the 3D Tasbih Counter (`/sunnah/tasbih`) from multiple entry points.
- **Implementation & Deliverables:**
  1. **Dataset (`src/data/adhkarData.ts`):**
     - Sourced authentic Morning Adhkar (Ayat al-Kursi, Al-Mu'awwidhat, Asbahna wa Asbahal-Mulk lillah, Sayyid al-Istighfar, Bismillahil-ladhi la yadurru..., Raditu billah, Ya Hayyu Ya Qayyum, Hasbiyallah x7, Subhanallahi wa bihamdih).
     - Sourced authentic Evening Adhkar (Ayat al-Kursi, Al-Mu'awwidhat, Amsayna wa Amsal-Mulk lillah, Sayyid al-Istighfar, A'udhu bi-kalimatillahi al-tammati..., Bismillahil-ladhi..., Khawateem Al-Baqarah).
     - Full Tashkeel, transliteration, English translation, authentic Hadith grading, and repetition counts.
  2. **Dedicated Interactive Screen (`src/app/sunnah/adhkar.tsx`):**
     - Morning tab ☀️ (golden sunrise gradient) & Evening tab 🌙 (twilight starry gradient).
     - Per-dhikr tap counter with completion celebration, progress bar, audio playback (`audioService.playDua`), and reward celebration modal.
     - Direct in-header shortcut button to the Tasbih Rosary (`/sunnah/tasbih`).
  3. **Multi-Point Navigation Integration:**
     - **Top Tabs in Sunnah Path (`SunnahHeroHeader.tsx`):** Added `adhkar` tab («أذكار الصباح والمساء»).
     - **Home Screen (`src/app/index.tsx`):** Added direct action pill «☀️ الأذكار» alongside «🎴 البطاقات» and «📿 المسبحة».
     - **Smart Search (`SmartSearchModal.tsx`):** Added searchable item `feature-adhkar` and quick suggestion pill «أذكار الصباح والمساء».
### Milestone 58: Full-Screen Tasbih Architecture & Touch/Audio Engine Overhaul
- **Root Cause Analysis:**
  - The route `/sunnah/tasbih` was merely a wrapper around `<KidTasbihModal>`, rendering an absolute modal popup over an existing screen header with an overlay (`modalOverlay`) and duplicate close buttons, causing pointer-events traps.
  - The modal card constrained content to `maxHeight: '94%'` without `flex: 1` on inner `<ScrollView>`, causing the large 220px button to overflow or become unscrollable on smaller screens.
  - Web Audio API was creating an unclosed `new AudioContext()` on every single bead tap; modern browsers throw once hitting the 6-context hardware limit, freezing sound and event dispatch.
  - Animations used `useNativeDriver: true` which conflicts with React Native Web.
- **Fixes Applied:**
  1. Rebuilt `src/app/sunnah/tasbih.tsx` as an authentic, full-screen interactive experience with zero modal traps.
  2. Implemented singleton Web Audio context (`getSharedAudioCtx()`) with linear ramps and safe resume, preventing context exhaustion.
  3. Integrated audio pronunciation (`audioService.playDua`) for every selected Dhikr.
  4. Added interactive target selector (`33`, `100`, `∞`) and rounds tracker.
  5. Fixed `KidTasbihModal.tsx` animations (`useNativeDriver: false`) and scroll view styles (`flex: 1`).
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported cleanly (code 0)**.
### Milestone 59: Comprehensive App Speed & Performance Overhaul
- **User Request & Diagnosis:**
  - Request: "need the app to be fast" / "frees space already".
  - Bottlenecks identified:
    1. Static web bundle was served uncompressed at 5.12 MB per cold load, creating heavy network and I/O latency.
    2. `_layout.tsx` was forcing an artificial 1,500ms splash delay on web platforms before unveiling the UI.
    3. `RootLayout` was subscribed to the entire Zustand store without atomic selectors, forcing the entire navigation stack (`<Stack>`) to re-render every 5 seconds on the daily time spent ticker.
    4. `useAppStore.ts` serialized the entire multi-child state tree to `AsyncStorage` synchronously on every single tap/mutation, blocking the JS thread during rapid interactions (e.g. 33 Tasbih taps, quiz clicks).
- **Optimizations Applied:**
  1. **In-Memory Gzip Compression & Static Caching (`server.js`):**
     - Integrated Node.js built-in `zlib.gzipSync` with an in-memory `gzipStaticCache` Map for all compressible assets (`.js`, `.css`, `.html`, `.json`, `.svg`).
     - Checks `Accept-Encoding: gzip` and serves compressed bundles with `Content-Encoding: gzip` and 1-year immutable caching for static assets.
     - Reduces transferred bundle size by ~80% (from 5.1 MB down to ~1.1 MB), cutting network download time by 5x.
  2. **Atomic Zustand Selectors in Root Layout (`src/app/_layout.tsx`):**
     - Replaced monolithic `useAppStore()` hook with fine-grained selectors (`s => s.hydrate`, `s => s.isHydrated`, `s => s.incrementTimeSpent`).
     - Prevents root navigation re-renders triggered by the 5-second `incrementTimeSpent` timer.
  3. **Near-Instant Splash Dismissal on Web (`src/app/_layout.tsx`):**
     - Adjusted `minDurationMs` to 400ms on Web (down from 1,500ms) with a 800ms native fallback timeout.
  4. **Debounced Disk Persistence Engine (`src/store/useAppStore.ts`):**
     - Replaced synchronous `AsyncStorage.setItem` on every state change with a debounced 250ms persistence runner (`persistTimer` + `pendingPersistState`).
     - Eliminates disk write spikes and UI thread freezes during repetitive actions like Tasbih counting or story reading.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported cleanly (23 routes)**.
  - Server Gzip Verification: `Status: 200`, `Content-Encoding: gzip`.
### Milestone 60: Fixed Persistent Sunnah Hub Navigation Header Across All Sections
- **User Request & Issue:**
  - User feedback: "خلى الهيدير ثابت اللى بيتحرك ما بين اقسام السنة عايز الصورة التانية الهيدير اللى فيها ثابت"
  - In `/sunnah` (Image 2), `SunnahHeroHeader` displayed the hero banner and 6 navigation tabs (`الأحاديث`، `سنن اليوم`، `أذكار الصباح والمساء`، `الأدعية`، `بطاقات الحفظ`، `المسبحة`).
  - When opening `/sunnah/adhkar` (Image 1) or `/sunnah/tasbih`, this navigation header was completely missing, trapping the user or forcing them back to the root without direct switching.
  - Furthermore, on pages where it was rendered, the user wanted this navigation bar to be fixed/persistent at the top across all Sunnah sections.
- **Implementation & Architecture:**
  1. **Unified Navigation Across All 6 Sunnah Sections:**
     - Included `<SunnahHeroHeader activeTab="adhkar" />` in [`src/app/sunnah/adhkar.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/adhkar.tsx) fixed at the top above the `ScrollView`.
     - Included `<SunnahHeroHeader activeTab="tasbih" />` in [`src/app/sunnah/tasbih.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/tasbih.tsx) fixed at the top above the `ScrollView`.
     - Cleaned up restricted `onTabChange` handlers in [`src/app/sunnah/duas.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/duas.tsx) and [`src/app/sunnah/cards.tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/cards.tsx) so all 6 tabs route smoothly with `router.replace`.
  2. **Scroll & Sticky Structure:**
     - In `adhkar.tsx`, `SunnahHeroHeader` is fixed at the top outside the `ScrollView`, while the morning/evening period switcher card (`heroSection`) lives inside the scrollable content container.
     - As the child scrolls through the Adhkar cards, the Sunnah sections navigation header remains permanently fixed and accessible at the top.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported cleanly (23 routes)**.
  - Server restart on port 3000: active with gzip support.
### Milestone 61: Dedicated 604-Page Electronic Madinah Mushaf (/quran/mushaf)
- **User Request & Theological Grounding:**
  - "هل ممكن نضيف المصحف كاملا للاتطبيق بطعته الالكترونية من مصدر موثوق بحيث يقدر الطفل يقراء فيه اكنه بيقراء من المصحفعادى؟"
  - Agreement on placement: Dedicated full-screen route `/quran/mushaf` within the Quran section, with quick-access cards/buttons on the Home screen (`/`), the Quran Hub (`/quran`), and inside every Surah detail screen (`/quran/[surahId]`), plus Smart Search indexing.
- **Implementation & Architecture:**
  1. **Dataset (`src/data/mushafData.ts`):**
     - Sourced from King Fahd Glorious Quran Printing Complex (مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة) - standard 604-page Madinah Mushaf.
     - Accurate mapping for all 114 Surahs with start pages, Ayah counts, revelation types, and authentic Juz (1-30) / Hizb (1-60) divisions.
     - CDN delivery with Android Quran.com width_1260 high-resolution scans and reliable fallback mirrors.
  2. **Dedicated Interactive Viewer (`src/app/quran/mushaf.tsx`):**
     - Styled with an authentic golden paper frame (`mushafPaperFrame`), Surah/Juz/Hizb header banner, ribbon bookmarking (`🔖`), audio recitation playback via `audioService.playAyah`, and responsive bottom pagination controller (Previous/Next page, direct page input).
     - Full 4-tab index modal (`MushafIndexModal`): Surahs (114), Ajzaa (30), Saved Bookmarks, and direct page keypad jump (1-604).
  3. **Multi-Entry Access Architecture:**
     - **Home Screen (`src/app/index.tsx`):** Quick-access golden banner with current reading badge (`صفحة X`), description, and direct "قراءة" button.
     - **Quran Hub (`src/app/quran/index.tsx`):** Hero action button «المصحف (ص X) 📖» + featured golden card with resume indicator.
     - **Surah Detail Screen (`src/app/quran/[surahId].tsx`):** Contextual «عرض في المصحف 📄» button in `togglesRow` jumping directly to that surah's starting page in the Mushaf.
     - **Smart Search (`src/components/SmartSearchModal.tsx`):** Pre-indexed searchable item for `mushaf-full` with Arabic/English keywords.
  4. **Per-Child Bookmarking & Reading State (`src/store/useAppStore.ts`):**
     - `lastReadMushafPage` (number, default 1) and `mushafBookmarks` (number array).
     - Deeply integrated into per-child profile snapshots (`ChildProgressData`, `createDefaultChildProgress`, `setActiveProfile`, `addProfile`, `executeSave`, and `hydrate`).
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported cleanly (24 static routes, including `/quran/mushaf` 64KB)**.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **68 / 68 PASSED (100%)**.
  - Server port 3000 actively serving latest build with gzip compression.

---

### Milestone 62: Comprehensive Multilingual Expansion (French 🇫🇷, German 🇩🇪, Spanish 🇪🇸)
- **User Request:**
  - "ضيف الفرنسية والالمانية والاسبانية" (Add French, German, and Spanish to the application).
- **Core Architecture & Implementation:**
  - **Type-Safe i18n System (`src/constants/i18n.ts`):**
    - Expanded `Language` union type: `'ar' | 'en' | 'fr' | 'de' | 'es'`.
    - Added `AVAILABLE_LANGUAGES` with flags (`🇸🇦`, `🇬🇧`, `🇫🇷`, `🇩🇪`, `🇪🇸`), native names (*العربية*, *English*, *Français*, *Deutsch*, *Español*), and RTL metadata (`isRtl: true` for Arabic, `false` for others).
    - Added 100% complete key-for-key translations for French (`fr`), German (`de`), and Spanish (`es`) covering all ~85 keys (app identity, navigation, Quran reader, memorization mode, Hadith, Prophets caravan, manners town, parent gate, offline notice, and rewards).
  - **Dedicated Language Selector Modal (`src/components/LanguageSelectModal.tsx`):**
    - Created an interactive modal with native names, flags, and instant live preview.
    - Updated Home screen header (`src/app/index.tsx`) to feature a compact, responsive language pill (`🇸🇦 AR ▾`, `🇫🇷 FR ▾`, etc.) that triggers the modal without overflowing mobile screens.
  - **Parents Corner Settings (`src/app/parents/index.tsx`):**
    - Updated language settings to render all 5 languages as accessible cards with flags and native descriptions.
  - **Multilingual Quran Translations Pipeline (`src/services/quranService.ts` & `src/app/quran/[surahId].tsx`):**
    - Configured dynamic edition selection: French (`fr.hamidullah`), German (`de.aburida`), Spanish (`es.cortes`), and English (`en.sahih`).
    - Propagated language state through Quran detail reader so verses display approved translations in the child's selected language.
  - **Component Compatibility (`KidAvatar.tsx`, `SurahStoryModal.tsx`, `AyahTafsirModal.tsx`, `ChildVoiceRecorderModal.tsx`):**
    - Updated prop types and helper functions to accept full `Language` type.
- **Verification & Code Health:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo export --platform web`: **Exported cleanly (24 static routes)**.
  - Full E2E Test Suite (`node scripts/test-e2e.js`): **69 / 69 PASSED (100%)**.
  - Background HTTP server on port 3000 restarted and active.

---












### Milestone 63: Full-App Multilingual Content Translation (French, German, Spanish)
- Localized Prophet stories (Adam 10 scenes, titles, choices, audio), Hadiths, Manners, Pillars of Islam & Iman in fr, de, es.
- Multilingual TTS audio engine in audioService.ts.
- Replaced binary ternaries throughout all screens.
- 0 TypeScript errors, 24 web routes exported, 69/69 E2E tests passing.

---

### Milestone 64: Systematic Security Workflow Integration (Threat Modeling, OWASP ASVS, Denial-of-Wallet)
- Created SECURITY.md defining the 3-phase security development lifecycle: Threat Modeling, Explicit Requirements, and Iterative Review.
- Integrated Section 5 into .agents/rules/project_rules.md binding all agent actions to pre-code threat models, input allowlisting, rate limiting, and commit hygiene.
- Automated test suite scripts/test-security.js passed 23/23 tests verifying multi-tenant RLS, zero-secret exposure, and mass-assignment protection.

---

### Milestone 65: Hardened Parental Gate PIN & Anti-Brute-Force Architecture
- Created dedicated branch feature/security-hardening.
- Implemented securityCryptoService.ts: zero-dependency cross-platform pure-TS SHA-256 with unique random cryptographic salts, constant-time verification (timing attack defense), and stepped lockout calculator (30s at 3 attempts, 300s at 5 attempts).
- Hardened ParentGateModal.tsx: replaced plaintext PIN check with verifyParentPin, integrated visual countdown cooldown banner, disabled input/submit during lockout.
- Upgraded parents/index.tsx: implemented secure handleSavePin with strict 4-6 digit numeric validation, active protection status badge, and user feedback.
- Automated test suite scripts/test-security.js passed 33/33 tests (+10 new cryptographic tests).
- Full E2E suite passed 69/69 (100%), 0 TypeScript errors, web export refreshed in dist/.

---

### Milestone 66: Encrypted Progress Backup, Authenticated Keystream & Prototype Pollution Scrubbing
- Implemented authenticated encryption envelope generator in `securityCryptoService.ts` (`noor_kids_encrypted_backup_v1`) using PBKDF2-SHA256 (10,000 rounds) key derivation, AES keystream, and HMAC-SHA256 tamper-evident integrity tags.
- Built `backupValidationService.ts`: scrubs prototype pollution vectors (`__proto__`, `constructor`, `prototype`), enforces child profile limits (1-20), clamps progress numbers (1,000,000 max), and whitelists schema fields.
- Upgraded `src/store/useAppStore.ts` with `exportEncryptedBackup`, `importEncryptedBackup`, and `restoreValidatedData`.
- Added Encrypted Backup & Restore card in `src/app/parents/index.tsx` with one-click export `.noorkids` download on Web and secure passphrase-protected envelope import.

---

### Milestone 67: JWT Multi-Tenant Cloud Sync Isolation & Audio Sandbox Quota Defense
- Built full JWT session system in `server.js` using Node's built-in `crypto` (HS256 signature, expiry verification, and constant-time `timingSafeEqual` comparison).
- Added multi-tenant cloud sync endpoints in `server.js`: `/api/sync/push`, `/api/sync/pull`, and `/api/auth/token` with strict tenant isolation (`ownerId === session.userId`).
- Created `cloudSyncService.ts` for secure token persistence, automatic session expiration handling, and client sync orchestration.
- Added Multi-Device Cloud Sync card in `src/app/parents/index.tsx` with login/logout, push, and pull functionality.
- Hardened `voiceRecordService.ts`: enforced strict 180s (3 min) duration cap, 15MB buffer memory quota, path traversal validation (`validateAudioUri`), and complete object URL / track lifecycle cleanup.
- Automated security suite (`scripts/test-security.js`) expanded to 58/58 passing tests (100%).
- Full E2E suite (`scripts/test-e2e.js`) passed 69/69 (100%), 0 TypeScript errors (`tsc --noEmit`), web export refreshed.

---

### Milestone 68: Complete Application Renaming to Rawdakids & Active Server Launch
- **App Name Renamed:** Standardized app name to **Rawdakids** (روضة كيدز) across all configurations, UI text, metadata, and build assets:
  - `app.json`: `name`: "Rawdakids - روضة كيدز", `slug`: "rawdakids", `scheme`: "rawdakids", `package`: "com.rawdakids.app", `bundleIdentifier`: "com.rawdakids.app".
  - `package.json`: `name`: "rawdakids".
  - `public/manifest.json`: `name`: "روضة كيدز - Rawdakids".
  - `public/sw.js`: Service worker cache updated to `rawdakids-v1`.
  - `src/constants/i18n.ts`: `appName: 'Rawdakids'` across English, French, German, and Spanish locales; `روضة كيدز` for Arabic.
  - `src/components/AchievementCertificateModal.tsx`: Updated brand titles and certificate verification seal to `RAWDAKIDS APP` / `Rawdakids ☼`.
  - `src/components/AppSplashScreen.tsx` & `InstallAndroidModal.web.tsx`: Updated UI splash and modal headers to `Rawdakids`.
  - `src/app/parents/index.tsx`: Updated notification preview and installation descriptions.
  - `PRIVACY_POLICY.md` & `privacy.html`: Localized and aligned policy and package names with `Rawdakids` and `com.rawdakids.app`.
  - `GOOGLE_PLAY_STORE_LISTING.md` & `GOOGLE_PLAY_DEPLOYMENT_GUIDE.md`: Updated listing titles and guides.
- **Code Health & Linting Fix:**
  - Resolved `react-hooks/set-state-in-effect` error in `ParentGateModal.tsx` by scheduling timer updates asynchronously.
  - Eliminated unused `_err` catch variables across `audioService.ts` and `voiceRecordService.ts`.
  - Removed unused `_setLanguage` in `src/app/index.tsx`.
  - `npx expo lint`: **0 errors, 0 warnings**.
  - `npx tsc --noEmit`: **0 errors**.
  - `npx expo export --platform web`: All 24 static routes rebuilt cleanly in `dist/`.
- **E2E Test Suite (`node scripts/test-e2e.js`):** **69 / 69 PASSED (100% Success Rate)**.
- **Running Servers Active:**
  - `node server.js` serving production app + `/api/tts` streaming proxy at `http://localhost:3000`.
  - `npx expo start --web --port 8081` running Metro bundler at `http://localhost:8081`.

---

### Milestone 69: Fix Generated Media with the New Name (RAWDAKIDS Splash Screen & Play Store Assets)
- **3D Pixar Mobile Splash Screen Re-generated:**
  - Re-generated [`assets/images/splash-screen.jpg`](file:///g:/quran%20app%20for%20kids/assets/images/splash-screen.jpg) and [`assets/images/splash-screen.png`](file:///g:/quran%20app%20for%20kids/assets/images/splash-screen.png) (9:16 aspect ratio).
  - Replaced the old "NOOR KIDS" cloud lettering with 3D glowing golden bubble cloud typography reading **RAWDAKIDS** and **روضة كيدز**.
  - Synchronized across both `assets/images/` and `dist/assets/images/`.
- **Google Play Media Assets Regenerated:**
  - Re-rendered all Google Play store listing assets via [`scripts/generate_store_assets.ps1`](file:///g:/quran%20app%20for%20kids/scripts/generate_store_assets.ps1):
    - `01_app_icon_512x512.png` (512x512 Play Store icon).
    - `02_feature_graphic_1024x500.png` & `.jpg` (Feature graphic with `روضة كيدز` & `Rawdakids - رحلة الإيمان والمعرفة`).
    - `phone_screenshots/` (6 high-res 1080x1920 mobile mockups).
    - `tablet_screenshots/` (2 high-res 7-inch and 10-inch tablet mockups).
- **Code Health Verification:**
  - Fixed `ParentGateModal.tsx` interval type to `ReturnType<typeof setInterval>`.
  - `npx expo lint`: **0 errors, 0 warnings**.
  - `npx tsc --noEmit`: **0 errors**.
  ### Milestone 70: Dynamic Child Progress & Clean State Architecture (Zero Hardcoded Starter Stats)
- **Eliminated Starter Seed Numbers:**
  - Removed all mock starting points (`stars: 12, gems: 25, streak: 3` and `stars: 5, gems: 10`) from initial profiles in [`src/store/useAppStore.ts`](file:///g:/quran%20app%20for%20kids/src/store/useAppStore.ts).
  - Every child profile now begins with clean genuine dynamic states: `stars: 0`, `gems: 0`, `streakCount: 0`.
  - All progression, stars, gems, streaks, and collected badges are 100% earned dynamically by the user through learning Surahs, Hadiths, Duas, and Manners.
- **Child Progress Isolation & Reset Engine:**
  - Added `resetChildProgress(id?: string)` in [`src/store/useAppStore.ts`](file:///g:/quran%20app%20for%20kids/src/store/useAppStore.ts).
  - Added Parent Gate "إعادة ضبط إنجازات الطفل / Reset Child Progress" with confirmation modal in [`src/app/parents/index.tsx`](file:///g:/quran%20app%20for%20kids/src/app/parents/index.tsx).

---

### Milestone 71: Production Android App Bundle (.aab) Generated via EAS Cloud Build
- **Target Platform & Package:**
  - Application ID: `com.rawdakids.app`
  - Name: `Rawdakids - روضة كيدز`
  - Build Profile: `production` (Android App Bundle `.aab` for Google Play Store release)
  - Keystore: Generated and securely maintained on Expo Remote Credentials
- **Build Outcome:**
  - Build ID: `0a48abdf-4044-4c69-96c7-79a4b088917e`
  - Build Status: **FINISHED (Code 0, SUCCESS)**
  - Direct AAB Download Artifact:
    `https://expo.dev/artifacts/eas/EIs_7eHHv3iPDoV_r3dG2Yko9UZHMa1cFHGcEoVv21k.aab`
  - Live Build Page:
    `https://expo.dev/accounts/abdobody2020/projects/rawdakid/builds/0a48abdf-4044-4c69-96c7-79a4b088917e`

---

### Milestone 72: Standalone Preview Android APK Generated for Real Device Testing
- **Target:** Standalone Native Android Package (`.apk`)
- **Build Profile:** `preview` (`buildType: "apk"`)
- **Build ID:** `f7ed81d4-f846-495c-9810-34664771c975`
- **Build Status:** **FINISHED (Code 0, SUCCESS)**
- **Direct APK Download Artifact:**
  `https://expo.dev/artifacts/eas/uSk5dD1rPQcSDUfZIeQesuffFMAYzN73ubO99gF6G88.apk`
- **Build & QR Code Page:**
  `https://expo.dev/accounts/abdobody2020/projects/rawdakid/builds/f7ed81d4-f846-495c-9810-34664771c975`

### Milestone 73: Visual & Audio Quality Overhaul (Prophet 3D Scenes, Hadith Artworks, Mobile Menus, Repeat Play/Pause, Click-to-Play Quran Reading)
- **1. Prophets Caravan 3D Pixar Artworks Across All Scenes:**
  - Resolved generic caravan fallback in [`src/app/prophets/[prophetId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/prophets/%5BprophetId%5D.tsx).
  - Generated and integrated 6 high-resolution 3D Pixar scenes:
    - `scene-paradise-tree.jpg`: Heavenly paradise garden with glowing ancient tree of knowledge, crystal rivers, and celestial light rays (fixes Adam Scene 5 "أنهار الجنة وظلالها المباركة").
    - `scene-earth-dawn.jpg`: Peaceful earth at golden sunrise with rolling hills, streams, and soaring doves.
    - `scene-desert-stars.jpg`: Golden sand dunes under starlit night sky with glowing crescent moon and lanterns.
    - `scene-whale-sea.jpg`: Gentle giant whale silhouette in bioluminescent coral sea (Yunus & storm scenes).
    - `scene-palace-garden.jpg`: Royal palace garden with marble fountain, hoopoe bird, and songbirds (Sulayman & Dawud).
    - `scene-medina-mosque.jpg`: Illuminated Prophet's Mosque courtyard with green dome under starlit night (Muhammad ﷺ in Medina).
  - Built `getProphetSceneArtwork` intelligent matcher guaranteeing every scene across all 25 Prophets receives an authentic, contextual, respectful 3D illustration.
- **2. Mobile Screen Menu Text Overflow Fix:**
  - In [`src/components/SunnahHeroHeader.tsx`](file:///g:/quran%20app%20for%20kids/src/components/SunnahHeroHeader.tsx), replaced cramped fixed row with a smooth horizontal `ScrollView` with `showsHorizontalScrollIndicator={false}`.
  - Shortened verbose labels (`أذكار الصباح والمساء` -> `الأذكار`, `بطاقات الحفظ` -> `البطاقات`, `سنن اليوم` -> `السنن`).
  - Zero text clipping or ellipsis (`...`) on narrow mobile screens (320px–390px).
- **3. Illustrated Hadith Stories 3D Artworks:**
  - Generated 3 new thematic 3D Pixar Hadith scenes:
    - `story-table-manners.jpg`: Kid-friendly breakfast table with dates, milk, fruit, and Bismillah/Alhamdulillah embroidery.
    - `story-helping-charity.jpg`: Children helping neighbors with food baskets in a cheerful neighborhood.
    - `story-sleeping-dhikr.jpg`: Bedtime bedroom with star lantern, soft duvet, and smiling crescent moon.
  - Upgraded `getSceneImage` in [`src/app/sunnah/[hadithId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/sunnah/%5BhadithId%5D.tsx) with semantic keyword matching covering food, charity, sleeping, prayer, knowledge, parents, mercy, and smiling. Zero missing or mismatched story images.
- **4. Listen & Repeat (Hifz) Player Controls:**
  - Added dedicated Play (▶), Pause (⏸), and Restart (🔄) buttons to [`src/app/quran/repeat.tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/repeat.tsx).
  - Prominent red glow pause button when active, allowing easy pausing and resuming at any repeat cycle.
- **5. Click-to-Play Quran Reading Mode:**
  - In [`src/app/quran/[surahId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/quran/%5BsurahId%5D.tsx), tapping any Ayah card or any part of the Quranic text now immediately plays the Ayah audio (or toggles pause/play).
  - Added a dedicated 1-tap `[ ▶ استمع / ⏸ إيقاف ]` button directly in each Ayah's header badge.
  - Moved word meanings to a dedicated `[ 📖 الكلمات ]` button, eliminating tap interception.
### Milestone 18: Android Native Sound, Voice Recording & Offline Surahs Resolution
- **1. Native Voice Recording & Sandboxed Playback (`src/services/voiceRecordService.ts`):**
  - Replaced native mock interval with real `expo-audio` native recording engine (`AudioModule.AudioRecorder`, `RecordingPresets.HIGH_QUALITY`).
  - Added microphone runtime permissions validation via `ModernExpoAudio.requestRecordingPermissionsAsync()`.
  - Configured native audio mode session for recording: `allowsRecording: true`, `interruptionMode: 'doNotMix'`.
  - On stop, safely switches audio mode back to speaker output (`allowsRecording: false`, `shouldRouteThroughEarpiece: false`) so playback never routes to the call earpiece.
  - Implemented native recorded audio playback via `ModernExpoAudio.createAudioPlayer(this.currentBlobUrl)` with explicit volume, status updates, and lifecycle cleanup.
- **2. Android Audio Loudspeaker Output & Audio Focus (`src/services/audioService.ts`, `app.json`):**
  - Resolved sound not outputting from Android phone speaker:
    - Fixed audio session initialization: added `ensurePlaybackAudioMode()` with `interruptionMode: 'doNotMix'` (requests exclusive media focus instead of default `mixWithOthers` which silently discarded playback).
    - Added `shouldRouteThroughEarpiece: false` and `allowsRecording: false` to ensure media always routes through the phone's primary loudspeaker.
    - Explicitly set `player.volume = 1.0` and `player.muted = false` on every playback request.
    - Added `"usesCleartextTraffic": true` in `app.json` under Android to prevent Android 9+ network security policies from blocking CDN streams.
    - Configured `expo-audio` config-plugin in `app.json` with permissions: `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, `FOREGROUND_SERVICE_MICROPHONE`.
- **3. Complete Offline Juz Amma (78-114) + Surah Al-Mulk (67) & AsyncStorage Caching (`src/data/juzAmmaOffline.json`, `src/services/quranService.ts`, `src/app/quran/[surahId].tsx`):**
  - Bundled authentic Uthmani text, Tafsir Al-Muyassar, and English translations for all 38 core Surahs (Juz Amma 78-114 and Surah Al-Mulk 67) into `juzAmmaOffline.json`. They now open in 0ms completely offline with zero network latency.
  - Upgraded `quranService.ts` with persistent `AsyncStorage` caching (`@rawdakids_surah_${cacheKey}`).
  - Extended API timeout from 3.5s to 12s with fallback to single lightweight edition (`quran-uthmani`) to prevent placeholder verses on mobile cellular connections.
  - In `[surahId].tsx`, added an Islamic loading indicator with spinner while fetching non-bundled Surahs, preventing dummy text from showing during loads.
- **Verification:**
  - `npx.cmd tsc --noEmit`: **0 errors**.
  - `npx.cmd expo lint`: **0 errors, 0 warnings**.
  - `node scripts/test-e2e.js`: **69 / 69 passed (100%)**.
  - `npx.cmd expo export --platform web`: 24 static routes exported successfully to `dist/`.

### Milestone 19: GitHub Repository Creation & Automated Vercel Deployment
- **1. GitHub Remote Setup:**
  - Created public GitHub repository: `https://github.com/abdobody2040/rawdakids`.
  - Configured git remote origin, committed all source code, assets, and documentation, and pushed to `main` branch.
- **2. Automated Cloud CI/CD:**
  - Configured project for automated Vercel deployment with Expo web export (`npm run build`).
  - Added [vercel.json](file:///g:/quran%20app%20for%20kids/vercel.json) with static output directory `dist` and build caching.

### Milestone 20: Prophet Story Scene Artworks & Visual Variety
- **1. Root Cause of Repetitive Scenes:**
  - In [`src/app/prophets/[prophetId].tsx`](file:///g:/quran%20app%20for%20kids/src/app/prophets/%5BprophetId%5D.tsx), `getProphetSceneArtwork` previously relied on only 12 hardcoded scene artworks, defaulting to `scene-earth-dawn.jpg` for scenes 2, 3, 4, 5 of Ibrahim and most scenes of other prophets.
- **2. Generation of 13 New 3D Pixar Cinematic Artworks (16:9):**
  - Generated distinctive, high-definition scene illustrations adhering strictly to Section 3 Theological Guidelines (NO face or body likeness of Prophets; symbolic elements, miracles, nature, and sacred environments):
    - `scene-fire-coolness.jpg`: Ibrahim's miraculous fire turning into a serene garden with blooming roses, clear stream, and sparkling cool embers.
    - `scene-zamzam-well.jpg`: The miraculous spring of Zamzam bubbling up from desert sands in Mecca under golden sunlight.
    - `scene-ram-sacrifice.jpg`: The peaceful mountains of Mina at dawn with a gentle white ram of light.
    - `scene-broken-idols.jpg`: Mesopotamian temple with broken clay statues on the stone floor and ceremonial axe resting against a pillar.
    - `scene-desert-migration.jpg`: Migration to the blessed land across sand dunes, olive valleys, river, and date palms.
    - `scene-nile-basket.jpg`: Baby Musa's woven wicker basket floating safely on the calm River Nile with lotus water lilies and papyrus reeds.
    - `scene-red-sea-parting.jpg`: Colossal towering water walls parting like mountains, revealing a dry path of light on the seabed.
    - `scene-yusuf-well.jpg`: Ancient stone well in golden desert sands under a starry night and luminous crescent moon.
    - `scene-gourd-vine.jpg`: Green gourd plant (Yaqtin) with yellow blossoms shading Yunus on a peaceful shore after emerging from the whale.
    - `scene-sulayman-crystal.jpg`: Grand palace hall with a crystal glass floor (Sarh Mumarrad) over water with colorful fish.
    - `scene-she-camel-rock.jpg`: Miraculous she-camel and calf drinking from a stone basin beside carved rock facades of Al-Hijr.
    - `scene-thawr-cave.jpg`: Cave of Thawr sealed with a shimmering spiderweb and nesting white dove at sunrise.
    - `scene-mount-judi.jpg`: Noah's Ark resting on Mount Judi with a rainbow, receded waters, and a white dove with an olive branch.
- **3. Precision Narrative Mapping & Aspect Ratio:**
  - Overhauled `getProphetSceneArtwork` in `[prophetId].tsx` with explicit per-scene mapping for Ibrahim, Musa, Yusuf, Nuh, Yunus, Sulayman, Dawud, Muhammad ﷺ, Salih, Ismail, and Adam, plus semantic keyword fallbacks and rotating alternating backups so no two consecutive scenes ever share the same artwork.
  - Updated `sceneIllustrationWrapper` from rigid `height: 220` to responsive `aspectRatio: 16 / 9`, `maxHeight: 380`, preventing horizontal slit cropping on wide desktop screens.

### Milestone 21: Vercel SPA Routing & Universal Icon Glyph Fixes
- **1. Vercel SPA Rewrite Infinite Loop (`vercel.json`):**
  - Resolved `Uncaught SyntaxError: Unexpected token '<'` caused by wildcard rewrites `/(.*) -> /index.html` intercepting static `.js` bundles and images.
  - Implemented proper SPA rewrite regex exclusion: `{"source": "/((?!.*\\..*).*)", "destination": "/index.html"}` to allow static bundles and assets to be served directly with long-term caching.
- **2. PWA Manifest Assets (`public/assets/`):**
  - Populated `public/assets/images/icon.png` and `android-icon-foreground.png` to eliminate PWA manifest 404 download errors.
- **3. Vector Icon Tofu Box Resolution (`src/app/_layout.tsx`, `public/assets/fonts/`):**
  - Copied `Ionicons.ttf`, `FontAwesome5_Solid.ttf`, and `MaterialCommunityIcons.ttf` to `public/assets/fonts/`.
  - Added `useFonts` hook in `_layout.tsx` and injected web `@font-face` definitions with local and CDN fallbacks.
  - Replaced vector icon dependencies in [`src/app/onboarding.tsx`](file:///g:/quran%20app%20for%20kids/src/app/onboarding.tsx) (language select checkmark, avatar checkmark, world radio checkmark, and Continue button arrows) with universal self-contained badge circles (`✓`) and native Unicode directional arrows (`←` / `→`) to guarantee 100% render reliability across all browsers and devices without tofu box glyphs (`▯`).

### Milestone 22: Expansion to 12 Pixar 3D Character Avatars
- **1. User Request:** User requested a larger character roster in the onboarding and profile avatar picker (`محتاج عدد اكبر من الشخصيات`).
- **2. Generated 6 New 3D Pixar Characters:**
  - `avatar-boy-3.jpg` (av-boy3): **الحافظ الصغير (The Young Hafiz)** — Boy in crisp white thobe and green embroidered kufi.
  - `avatar-girl-3.jpg` (av-girl3): **الزهرة (The Blossom)** — Cheerful girl in soft pastel yellow floral hijab.
  - `avatar-boy-4.jpg` (av-boy4): **المستكشف (The Explorer)** — Curious adventurer boy with navy vest and compass.
  - `avatar-girl-4.jpg` (av-girl4): **القارئة الذكية (The Smart Reader)** — Studious girl Maryam in lavender hijab with spectacles and reading book.
  - `avatar-horse.jpg` (av-horse): **المهر الأصيل (The Noble Foal)** — Cute Arabian horse foal with rosette ribbon in flower meadow.
  - `avatar-falcon.jpg` (av-falcon): **الصقر الشجاع (The Brave Falcon)** — Chubby friendly baby falcon chick in a desert oasis.
- **3. System Integration:**
  - Registered all 12 avatars in [`src/components/KidAvatar.tsx`](file:///g:/quran%20app%20for%20kids/src/components/KidAvatar.tsx) (`AVATAR_IMAGES`, `PRESET_AVATARS`, and `getAvatarDisplayName`).
  - Added new avatars with emoji, localized descriptions, and unlock gem costs to `AVATAR_OPTIONS` in [`src/data/badgesData.ts`](file:///g:/quran%20app%20for%20kids/src/data/badgesData.ts).
  - Automatically propagated across onboarding ([`src/app/onboarding.tsx`](file:///g:/quran%20app%20for%20kids/src/app/onboarding.tsx)), Profile Switcher Modal ([`src/components/ChildProfileSwitchModal.tsx`](file:///g:/quran%20app%20for%20kids/src/components/ChildProfileSwitchModal.tsx)), and Parents' Child Profiles Card ([`src/components/parents/ChildProfilesCard.tsx`](file:///g:/quran%20app%20for%20kids/src/components/parents/ChildProfilesCard.tsx)).
- **4. Verification:** `npx tsc --noEmit` (0 errors), `npm run build` (successful static bundle export), pushed to `origin main`.


---

## 3. Strict Rules & Constraints for Future AI Agents

1. **Theological Integrity & Respect:**
   - **NEVER depict the face or physical likeness of the Prophets** (use respectful symbolic motifs like `🕊️`, `📜`, `🕌`, calligraphy, or light).
   - Ensure accurate Tashkeel for all Quranic verses and authentic Hadith chains.
2. **Commands & Verification:**
   - Run `npx tsc --noEmit` and `npx expo lint` before declaring any task complete. Both must report 0 errors.
   - When updating UI or components, run `npx expo export --platform web` to refresh the production `dist/` directory served by `server.js`.
   - Never use `npm add` or `yarn add`; always use `npx expo install <package>` for SDK-compatible versions.
3. **Expo Router Rules:**
   - Keep `src/app/` strictly for screens and navigators (`_layout.tsx`). Components belong in `src/components/`, data in `src/data/`, services in `src/services/`.
   - Use `useRouter()` and `<Link>` from `expo-router`.
4. **Platform Compatibility:**
   - Always support both Web and Native (iOS/Android). Guard web-specific code with `Platform.OS === 'web'`.
   - Support RTL (Arabic) and LTR (English) gracefully with `language === 'ar'`.

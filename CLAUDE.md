# CLAUDE.md — Agent Guidelines & Instructions for Noor Kids

## Commands

```bash
# Development
npx expo start --web --port 8081    # Start Expo Metro web server
node server.js                       # Start Node server on port 3000 (serves dist/ and /api/tts proxy)

# Verification & Build (Mandatory before finishing any task)
npx tsc --noEmit                    # TypeScript check
npx expo lint                       # ESLint check (must report 0 problems)
npx expo export --platform web      # Build production bundle to dist/
node scripts/test-e2e.js            # Run full automated E2E test suite (65 tests)

# Dependencies
npx expo install <package>          # ALWAYS use expo install for SDK 54 compatibility
```

## Architecture & Code Structure

- **Navigation:** Expo Router v5 (`src/app/`). Routes define screens; `_layout.tsx` defines the navigator.
- **Components:** `src/components/` (Header, MascotNoor, DailyMissionCard, AudioPlayerBar, StarRewardCelebration, ChildProfileSwitchModal, SurahStoryModal, DailyLimitModal, AyahTafsirModal).
- **State Management:** `src/store/useAppStore.ts` (Zustand with AsyncStorage persistence `@noor_kids_app_state_v1`, isolated multi-child `profilesProgress`, deduplication & cleanup).
- **Audio Service:** `src/services/audioService.ts` (EveryAyah for Quran across 27 reciters, `/api/tts` proxy + Google TTS fallback + device speech for Duas & Hadiths).
- **Content Datasets:** `src/data/` (114 Surahs with Tafsir Al-Muyassar, 27 reciters, 25 Prophets, 64 moral landmarks, authentic hadiths, 51 duas, 5 pillars of Islam & 6 pillars of Iman, 8-step Wudu & 10-step Salah simulators).
- **Theme & Styles:** `src/constants/theme.ts` (Kid delight color palette, shadows, borders, radii).
- **Localization:** `src/constants/i18n.ts` (Full Arabic and English strings).

## Key Development Rules

1. **Islamic Content Authenticity & Reverence:**
   - **Strict prohibition:** Do NOT depict the physical faces or bodies of any Prophets. Use symbolic motifs (`🕊️`, `📜`, `🕌`, radiant glow).
   - Ensure accurate Tashkeel on all Arabic texts.
   - All hadiths must reference authentic collections (Bukhari, Muslim, Tirmidhi, Abu Dawud).
2. **Privacy & Offline Independence:**
   - 100% free with zero ads, zero trackers, and zero telemetry.
   - All child profiles, progress, and settings persist solely on the local device via `AsyncStorage`.
   - Never send personal child data to external servers. External requests are limited to audio CDN streaming (EveryAyah) and AlQuran Cloud.
3. **Multi-Child Profile Management:**
   - Supports multiple children on the same device with isolated stars, gems, memorized surahs, and streaks.
   - Switching accessible via `ChildProfileSwitchModal`. Clean up duplicates via `cleanupDuplicateProfiles`.
4. **Audio Reliability:**
   - Quran recitations stream from `everyayah.com` across 27 tested reciters.
   - Dua audio uses the node `/api/tts` proxy on port 3000 to prevent browser CORS and missing Arabic voice errors.
5. **UI Aesthetics & Responsiveness:**
   - Delightful, playful, tactile design for kids (warm gradients, 3D buttons with bevels, soft shadows, rounded corners).
   - Responsive: Two-column shell with navigation rail on desktop (`width >= 820px`), fluid layout with bottom tabs on mobile.
6. **Code Quality & Testing:**
   - Always verify `npx tsc --noEmit` and `node scripts/test-e2e.js` pass with 100% before completing your turn.
   - Run `npx expo export --platform web` when modifying code so `http://localhost:3000` reflects changes.

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

# Dependencies
npx expo install <package>          # ALWAYS use expo install for SDK 54 compatibility
```

## Architecture & Code Structure

- **Navigation:** Expo Router v5 (`src/app/`). Routes define screens; `_layout.tsx` defines the navigator.
- **Components:** `src/components/` (Header, MascotNoor, DailyMissionCard, AudioPlayerBar, StarRewardCelebration).
- **State Management:** `src/store/useAppStore.ts` (Zustand with AsyncStorage persistence).
- **Audio Service:** `src/services/audioService.ts` (EveryAyah for Quran, `/api/tts` proxy + Google TTS fallback + device speech for Duas & Hadiths).
- **Content Datasets:** `src/data/` (114 Surahs, 27 reciters, 25 Prophets, 10 Manners landmarks, authentic hadiths & duas).
- **Theme & Styles:** `src/constants/theme.ts` (Kid delight color palette, shadows, borders, radii).
- **Localization:** `src/constants/i18n.ts` (Full Arabic and English strings).

## Key Development Rules

1. **Islamic Content Authenticity:**
   - **Strict prohibition:** Do NOT depict the physical faces or bodies of any Prophets. Use symbolic icons (`🕊️`, `📜`, `🕌`, radiant glow).
   - Ensure accurate Tashkeel on all Arabic texts.
   - All hadiths must reference authentic collections (Bukhari, Muslim, Tirmidhi, Abu Dawud).
2. **Audio Reliability:**
   - Quran recitations stream from `everyayah.com` across 27 tested reciters.
   - Dua audio uses the node `/api/tts` proxy on port 3000 to prevent browser CORS and missing Arabic voice errors.
3. **UI Aesthetics:**
   - Delightful, playful, tactile design for kids (warm gradients, 3D buttons with bevels, soft shadows, rounded corners).
   - Responsive: Two-column shell with navigation rail on desktop (`width >= 820px`), fluid layout with bottom tabs on mobile.
4. **Code Quality:**
   - Always verify `npx tsc --noEmit` and `npx expo lint` exit with code 0 before completing your turn.
   - Run `npx expo export --platform web` when modifying code so `http://localhost:3000` reflects changes.

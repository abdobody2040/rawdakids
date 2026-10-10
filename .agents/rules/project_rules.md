# Noor Kids — AI Agent Customization & Workspace Rules

## 1. Context References
Before starting any task, read:
- `CONTEXT.md`: Master architecture, content datasets, and component hierarchy.
- `MEMORY.md`: Chronological log of recent changes, bug fixes, and active tasks.
- `prd.md`: Product Requirements Document detailing pedagogical and Islamic guidelines.

## 2. Audio Pipeline Rules
- Quran recitation must utilize the 27 tested reciters mapped in `src/data/quranData.ts` and streamed from `everyayah.com`.
- Duas and Hadiths audio must be routed through `audioService.playDua(arabicText)` which leverages `/api/tts?text=...` proxy in `server.js` with multi-tier fallback. Never rely solely on client-side `window.speechSynthesis` as browser environments on Windows often lack Arabic voice packs.

## 3. Strict Islamic Guidelines
- Never introduce illustrations or avatars depicting the face, body, or physical likeness of Prophets (Prophets are honored with respectful symbols such as `🕊️`, `📜`, `🕌`, calligraphy, or radiant lanterns).
- Preserve authentic Tashkeel on Arabic Quran and Hadith texts.
- All Hadiths must maintain authentic source citations (Bukhari, Muslim, etc.).

## 4. Engineering Standards
- Follow Expo Router v5 structure: only routes inside `src/app/`.
- Ensure all screens support both Arabic (RTL) and English (LTR).
- Verify `npx tsc --noEmit` and `npx expo lint` pass with 0 errors before completing tasks.
- When updating UI, run `npx expo export --platform web` to sync `dist/` with `server.js`.

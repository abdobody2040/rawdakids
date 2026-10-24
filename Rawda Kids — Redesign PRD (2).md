# Rawda Kids — Redesign PRD

Oct 24, 2026 · @Abdallah el sherbiny

## 1. Overview

This redesign turns Rawda Kids from a content-rich directory of 13 cards into a calm, age-adaptive daily companion that helps a Muslim child learn Quran, prayer, character and stories with one clear next step on every screen.

**Product:** Rawda Kids (روضة كيدز) is an Arabic-first PWA at rawdakids.vercel.app covering Quran with audio (114 surahs), 100 hadith, 25 prophets' stories, 50 character lessons, pillars of Islam and faith, wudu and prayer simulators, 99 Names of Allah, Seerah, young Companions, animals in the Quran, and reflection on the universe.

**Baseline reviewed:** 24 Oct 2026, text, structure and meta tags only (visual rendering not inspected).

**What changes**

| Area | Today | After redesign |
| --- | --- | --- |
| Home | About 25 elements before the first world card | 7 blocks, one primary action |
| Navigation | 6 tabs that mirror content cards | 5 task-based tabs |
| Content structure | 13 cards, while the heading says six worlds | 6 real worlds |
| Age fit | One level label (7–9) | Three UI modes: 4–6, 7–9, 10–12 |
| Prayer and wudu | A card inside the list | A flagship tab |
| Rewards | Stars and gems with a streak | Garden-growth model that rewards effort, not worship |
| Parent zone | A link in the header | Gated dashboard with limits and settings |
| Offline | PWA meta only | Cached audio and surahs |

**Design promise:** every screen answers three questions for a child within three seconds: where am I, what can I do now, and what happens when I tap.

## 2. Problem and audit findings

The app has strong content but the home screen asks a 7–9 year old to choose among about 25 controls and cards, which risks random tapping, abandonment and parent frustration.

| # | Finding | Impact | Severity |
| --- | --- | --- | --- |
| 1 | Home shows date, flag, language, parent zone, greeting, user switch, 3 stats, search, Mushaf card, level card, daily mission, hadith, 3 shortcuts, then 13 world cards | Decision overload for ages 7–9 | High |
| 2 | Heading says "ستة عوالم" (six worlds) but 13 cards are listed | Broken trust in copy and structure | High |
| 3 | Bottom nav has 6 tabs (Home, Quran, Sunnah, Prophets, Akhlaq, Treasures) duplicating cards; no tab for prayer or profile | Navigation by content, not by task | High |
| 4 | Wudu and prayer simulators sit as a card in the list; the card repeats its own title as the subtitle and mentions two simulators with one button | The most practical feature is buried | High |
| 5 | "بِسْمِ اللّهِ نَبْدَأُ رِحْلَتَنَا" appears at the bottom of the page | Bismillah should open the session | Medium |
| 6 | Header date reads "Sunday, 4 Rabi al-Awwal" while the real date is Saturday 24 Oct 2026 (about 12 Jumada al-Ula 1448); likely a build-time or server-rendered value | Wrong Hijri date erodes trust; needs verification | Medium |
| 7 | Greeting names "طارق" on first load; streak shows 3 days beside 0 stars and 0 gems | Looks hard-coded and inconsistent | Medium |
| 8 | Emoji used as icons (☀️ 🎴 📿 ⭐) | Renders differently per OS; feels cheap beside a Mushaf | Medium |
| 9 | "بحث ذكي" text search, "عرض الكل" and "تبديل" are text-heavy for early readers | Young readers cannot use them | Medium |
| 10 | Cards labelled for age 9+ are visible to every child | Content gating is not enforced in the UI | Medium |

**Strengths to keep:** hadith grading label ("صحيح"), a single primary call to action ("أكمل رحلتي الآن"), Fahd Complex Mushaf attribution, warm Arabic tone, PWA meta tags, theme color `#064E3B`, and the breadth of vetted content.

## 3. Goals, non-goals and success metrics

The redesign succeeds if children return on their own most days and parents trust the content and controls enough to keep it installed.

**Goals**

1. Reduce home-screen decisions to one primary action plus three daily steps.
2. Make prayer and wudu learning the most reachable feature (one tap from the home tab bar).
3. Adapt the interface to three age bands rather than only adapting content.
4. Reward effort and consistency without turning worship into a points transaction.
5. Give parents a gated dashboard with time limits, content filters and a madhhab setting.
6. Work well offline on low-end Android phones.

**Non-goals (this release)**

- No chat, social feed, ads, or external links.
- No user-generated content.
- No new content authoring beyond what exists (the content team continues separately).
- No native app store build; the PWA stays the delivery format (Capacitor wrapper is a later option).

**Success metrics** (targets are proposals to confirm after a 2-week baseline)

| Metric | Baseline | Target at 8 weeks |
| --- | --- | --- |
| Taps to start today's lesson from app open | To be measured | 1 |
| Day-7 retention | To be measured | +25% relative |
| Sessions per child per week | To be measured | 4 or more |
| Median session length (ages 7–9) | To be measured | 6–10 min |
| Wudu or prayer simulator completion | To be measured | 60% of starts |
| Parent zone opened per household per month | To be measured | 50% |
| First contentful paint on mid-range Android over 4G | To be measured | Under 2 s |
| Crash-free sessions | To be measured | 99.5% |

## 4. Users and age modes

The primary user is a Muslim child aged 4–12 using a parent's or their own phone or tablet; the buyer and gatekeeper is the parent. The interface switches mode at onboarding based on the child's age.

| Mode | Age | Reading ability | UI behavior |
| --- | --- | --- | --- |
| البذرة (Seedling) | 4–6 | Little or none | Voice-first; 3 large tiles; spoken instructions on every screen; no search; no text-only controls; sessions capped at about 10 min |
| الناشئ (Young Learner) | 7–9 | Reads short Arabic with tashkeel | Current mode, simplified: 3 daily steps, illustrated world map, short sentences, optional audio for all text |
| المستكشف (Explorer) | 10–12 | Reads comfortably | Quizzes, memorization tracking, tajweed colors, Quranic lessons unlocked, search with keyboard |

**Personas**

1. **Tariq, 8** (placeholder name from current build): reads slowly, loves stickers and animals, uses a shared family tablet after school. Needs one obvious next step and sound he can toggle.
2. **Mariam, 5**: cannot read yet; follows her mother's voice. Needs voice prompts, large icons and nothing that requires typing.
3. **Yusuf, 11**: memorizing Juz Amma at school. Needs repeat loops, hide-the-ayah mode and progress he can see.
4. **Parent (mother or father):** worried about screen time, content authenticity and privacy. Needs a PIN-gated dashboard, time limits and a visible "no ads, no chat" promise.

**Profiles:** each household can hold multiple child profiles (nickname, age band, boy or girl avatar). The address form follows the avatar: "يا بطل" or "يا بطلة".

## 5. Information architecture

Navigation is organized by what the child wants to do, not by content category: five tabs lead to six worlds, with worship promoted to its own tab.

&#91;embedded content: navigation tree · 5 tabs\]

Home holds the daily path, Quran and My prayer each own one world, Discover groups three story and wonder worlds, and Me holds rewards and the gated parent zone.

**Tab names (Arabic UI labels)**

| Tab | Arabic label | Icon concept |
| --- | --- | --- |
| Home | الرئيسية | Lantern (فانوس) |
| Quran | القرآن | Open book on a rehal stand |
| My prayer | صلاتي | Prayer mat |
| Discover | اكتشف | Compass |
| Me | أنا | Garden sprout |

**The six worlds and where the 13 current cards go**

| World | Current cards merged | Age gate |
| --- | --- | --- |
| Quran Garden حديقة القرآن | Quran garden, Mushaf, Quranic lessons (عبر الأمم) | Lessons 9+ |
| Worship العبادة | Wudu and prayer simulators, pillars of Islam and faith, adhkar | All |
| Stories القصص | Prophets, young Companions, Seerah | All, with gentler tone for 7–9 |
| Akhlaq and Sunnah الأخلاق والسنة | Akhlaq city, 100 hadith | All |
| Names of Allah أسماء الله | 99 Names (one per day) | All |
| Wonder التفكر | Reflection on the universe, animals in the Quran | All |

The tab bar always shows five items and never scrolls. Search moves to a magnifier icon in the header, with a microphone for ages 4–9.

## 6. Design system

The visual language moves from a dark, serious emerald to a warm, light garden palette with emerald kept as the brand anchor for headers and navigation.

**Color tokens** (all text and UI pairs must reach WCAG AA contrast of 4.5:1 for body, 3:1 for large text)

| Token | Hex (proposed) | Use |
| --- | --- | --- |
| `brand-emerald` | `#064E3B` | App bar, tab bar, headings |
| `garden-green` | `#16A34A` | Success, growth, progress rings |
| `sand-50` | `#FFF8EB` | Default screen background |
| `sand-100` | `#FBEFD5` | Cards, grouped sections |
| `sky-300` | `#7DD3FC` | Calm accent, Quran and wonder worlds |
| `gold-400` | `#F5B83D` | Rewards, stars, highlights (never behind Quran text) |
| `coral-500` | `#F26B4F` | Primary call-to-action buttons |
| `ink-900` | `#1F2937` | Body text on light backgrounds |
| `night-900` | `#0B2A24` | Dark mode background (bedtime mode) |

Hex values are proposals for the design team to tune against real renders.

**Typography**

| Role | Font (proposed) | Size | Notes |
| --- | --- | --- | --- |
| Headings and UI | Baloo Bhaijaan 2, Cairo or Readex Pro | 22–28 px | Rounded Arabic, friendly |
| Body | Same family | 18 px minimum, line height 1.7 | Full tashkeel on all child-facing text |
| Quran text | KFGQPC Uthmanic Hafs or Amiri Quran | 28 px minimum, line height 2.0 | Never replaced by a decorative font; never over patterns |
| Numbers | Arabic-Indic numerals in Arabic UI | Match body | English UI uses Latin digits |

**Components and spacing**

- Spacing scale of 4 px steps; screen gutter 16 px; card radius 20 px.
- Touch targets 56 dp minimum for ages 4–9, 48 dp for 10–12, with 12 dp or more between targets.
- Primary button: full-width, coral, 56 dp tall, icon plus label; one per screen.
- Cards: illustrated top, title, one-line subtitle; no more than 12 words.
- Progress: rings for daily steps, a growing plant for long-term progress.

**Icons and illustration**

- Replace every emoji with a custom SVG set in one style (rounded 2 px strokes, flat color fills).
- Subtle arabesque pattern at 5% opacity on headers only.
- Illustrations avoid depicting prophets and Companions; use light, silhouettes from behind, or scenery and objects.

**Mascot:** a non-human guide, a small lantern-bird named in user testing (name to be decided). It reacts with small animations, speaks the voice prompts for ages 4–6 and never appears on Quran text screens.

**Motion:** 150–300 ms ease-out transitions; star-burst only for completed steps; no animation on Quran reading screens; honor `prefers-reduced-motion`.

**Sound:** vocal-only nasheeds or duff by default, no instruments; soft chimes for feedback; master mute and music toggle in settings and parent zone; audio never auto-plays on Quran screens.

## 7. Screen specifications

Each screen below lists its purpose, its elements top to bottom, and the behaviors engineers and designers must implement; all screens are RTL-first.

### 7.1 Onboarding (first launch only)

**Purpose:** collect the minimum needed to personalize the app in under 60 seconds, without typing for young children.

1. **Splash:** lantern-bird animation, spoken "بسم الله" with text; 2 seconds, skippable.
2. **Who is learning?** Choose boy or girl avatar from 6 options; the nickname field is optional with a parent-keyboard prompt ("اكتب اسمك أو تخطّى").
3. **How old are you?** Three large age tiles (4–6, 7–9, 10–12) with the mascot's voice reading each.
4. **Parent step:** set a 4-digit PIN, choose madhhab for prayer (Hanafi, Maliki, Shafi'i, Hanbali; default per country), choose city for prayer times, accept the privacy summary (3 bullet lines: no ads, no chat, minimal data).
5. **Welcome:** lands on Home with the first daily path pre-built.

**Rules:** parent step appears only after a parent gate; skipping it applies safe defaults and shows a reminder card in Me.

### 7.2 Home

**Purpose:** show one next action and the day's three steps.

| Order | Block | Behavior |
| --- | --- | --- |
| 1 | Header (64 dp): avatar, short greeting ("أهلاً يا بطل"), streak chip, magnifier and mic | Streak chip is a flame-free icon (a sprout); tap opens Me > progress |
| 2 | Bismillah banner (one line) | Shows on first open of the day, then collapses to nothing |
| 3 | **Continue card** (primary action, coral, full width) | Resumes the last lesson with a thumbnail and one verb: "كمل" |
| 4 | **Today's 3 steps:** progress ring plus three tiles (listen, learn, practice) | Tiles auto-pick from the child's level; tapping a tile starts it; completed tiles turn green with a small sprout |
| 5 | Hadith of the day (collapsed card) | Shows grade label and source; play button reads it aloud; expands to translation and one action to try today |
| 6 | Six worlds grid (2 columns, large illustrated tiles) | Locked 9+ worlds are hidden from younger profiles instead of greyed out |
| 7 | Prayer-time strip (only when within 30 min of a prayer) | "حان وقت الظهر" with a button to start wudu; dismissible |

**Ages 4–6:** replaces blocks 4–6 with three huge tiles (Listen, Pray, Play-and-learn), mascot voice-over, no search.

**Date:** the Hijri and Gregorian dates are computed on the device at open (not at build time) and shown in the header only on tablets; on phones they appear in the parent zone and the hadith card.

### 7.3 Quran world

**Purpose:** listen, read and memorize without friction.

1. **Surah list:** grid of surah cards sorted by Juz Amma first (short surahs for 4–9), with a progress ring on each card.
2. **Reader:** Uthmani text, ayah-by-ayah or page mode; tapping an ayah plays it; the current word is highlighted in sync with audio.
3. **Control bar (bottom, thumb reach):** play/pause, previous/next ayah, speed (0.75×, 1×, 1.25×), repeat (1, 3, 5, 10, loop), reciter.
4. **Memorize mode:** choose an ayah range, hide words progressively (25%, 50%, 100%), listen, repeat, then self-check ("هل حفظتها؟" with Yes/Try again). No speech scoring in the first release.
5. **Tajweed colors:** off by default for 4–9, optional toggle for 10–12, with a legend sheet.
6. **Meaning sheet:** a short simplified tafsir per ayah from the approved source list, audio available.
7. **Etiquette hint:** a dismissible line before the reader opens ("تأكّد من طهارتك وانتبه") as guidance, never a blocker.

**Reciters:** at least two child-learning recitations (for example Al-Minshawi and Al-Husary Mu'allim) plus one slow murattal; the reciter list is configurable server-side.

### 7.4 My prayer (flagship)

**Purpose:** teach wudu and salah step by step, then support daily practice.

1. **Hub:** four large tiles: Wudu, Salah, Adhkar and tasbih, Prayer times; below them a row for pillars of Islam and faith.
2. **Wudu simulator:** 10 numbered steps, each a full-screen illustration with a 5–15 second audio line, a "repeat" button, and a "I did it" tap; step dots at the top; the mascot demonstrates with hands only (no face of a person).
3. **Salah simulator:** choose the prayer (Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4), then walk through positions (standing, ruku, sujud, sitting) with the correct recitation text and audio at each step; the girl avatar shows the girl's posture variant; differences by madhhab show as a parent-set option, not as a child choice.
4. **Practice checklist:** after finishing, the child ticks what they learned; this is for learning, not tracking that they actually prayed.
5. **Prayer times:** list of five times plus sunrise for the parent's city; a gentle card appears on Home as time approaches; adhan audio is optional and off by default.
6. **Adhkar and tasbih:** morning, evening, sleep and meal supplications with audio; a tap-counter tasbih that vibrates lightly and stops at 33 or 100 with a calm sound.

**Special modes:** Friday (Surah Al-Kahf and salawat prompt), Ramadan (daily fasting-learning path), Eid and Hijri occasions (short cards).

### 7.5 Discover (stories, character, wonder)

**Purpose:** story-led learning in the Stories, Akhlaq and Sunnah, Names of Allah and Wonder worlds.

- **World page:** illustrated map with 6–12 numbered stops; locked stops show a small lock only when unlocking is by sequence.
- **Story player:** 6–10 short cards, each with 2–3 lines of text, audio narration, one image; final card asks one reflection question and offers one "try today" action.
- **Names of Allah:** one name per day with meaning, a gentle everyday example, and a collectible card; browsing all 99 is available.
- **Wonder:** short observations with a "look around you" activity; claims limited to what the source states.
- **Prophets and Companions stories:** respectful narration only; no depiction of faces.
- **Quranic lessons (9+):** hidden for younger profiles.

### 7.6 Me

1. **My garden:** a plant that grows from stars earned; each completed step adds a leaf or flower; stickers collected appear on a shelf.
2. **My progress:** surahs memorized, stories read, days active, with a weekly sprout calendar (no loss shaming).
3. **Avatar and name:** change avatar and nickname.
4. **Settings (child-safe):** sound on or off, music on or off, text size, dark bedtime theme.
5. **Parent zone entry** (gated; see section 11).

### 7.7 Search

Magnifier opens a full-screen search with large mic button (ages 4–9 default to mic), recent items as picture chips, and results grouped by world; results respect the age gate; offline search covers downloaded content only.

## 8. Functional requirements

The release contains 30 requirements; P0 ships first and is the minimum for the redesign to be considered done.

| ID | Requirement | Priority |
| --- | --- | --- |
| NAV-1 | Bottom tab bar with 5 tabs (Home, Quran, My prayer, Discover, Me), always visible, never scrolling | P0 |
| NAV-2 | Header magnifier opens search; mic button for ages 4–9 | P0 |
| NAV-3 | Back behavior returns to the previous screen, never exits the app from a tab root without confirmation | P0 |
| HOME-1 | Home shows at most 7 blocks in the order of section 7.2 | P0 |
| HOME-2 | Continue card resumes the last lesson in one tap | P0 |
| HOME-3 | Daily path of 3 steps generated from level, last activity and age band | P0 |
| HOME-4 | Hijri and Gregorian dates computed on the device at open; correct after midnight and Maghrib handling configurable | P0 |
| HOME-5 | Bismillah banner on first open of the day | P0 |
| ONB-1 | Onboarding with avatar, age band, optional nickname, parent step | P0 |
| ONB-2 | No hard-coded names; empty nickname shows "يا بطل" or "يا بطلة" | P0 |
| AGE-1 | Three UI modes (4–6, 7–9, 10–12) switch layout, text amount and control set | P1 |
| AGE-2 | Content flagged 9+ hidden entirely from younger profiles | P0 |
| QUR-1 | Ayah audio with word highlighting and speed control | P0 |
| QUR-2 | Repeat modes (1, 3, 5, 10, loop) and hide-the-ayah memorize mode | P1 |
| QUR-3 | At least two child-learning reciters plus one murattal | P1 |
| QUR-4 | Optional tajweed colors with legend | P2 |
| QUR-5 | Simplified meaning sheet per ayah from approved sources | P1 |
| PRY-1 | Wudu simulator, 10 steps, audio per step, repeat | P0 |
| PRY-2 | Salah simulator for the 5 prayers, positions, recitations, audio | P0 |
| PRY-3 | Girl posture variant and madhhab setting from parent zone | P1 |
| PRY-4 | Prayer times by city with gentle Home card; adhan optional | P1 |
| PRY-5 | Adhkar sets (morning, evening, sleep, meals) and tasbih counter | P1 |
| STO-1 | Story player with cards, audio, reflection question, "try today" action | P0 |
| STO-2 | Names of Allah: one name per day plus collectible card | P1 |
| RWD-1 | Garden growth model replaces raw stars and gems display | P1 |
| RWD-2 | Streak shown as a sprout with a gentle freeze; no loss messages | P1 |
| PAR-1 | Parent gate: 4-digit PIN with fallback hold-to-open | P0 |
| PAR-2 | Parent dashboard: weekly progress, time spent, weak areas | P1 |
| PAR-3 | Parent controls: daily limit, bedtime lock, sound settings, content age filter | P1 |
| OFF-1 | Offline cache for the Home shell, last 10 surahs listened, wudu and salah audio | P1 |

**Acceptance example (HOME-2):** with a lesson in progress, tapping the Continue card opens that lesson at the last position within 1 second on a mid-range Android phone, with audio ready to play.

**Acceptance example (AGE-2):** a 7–9 profile cannot reach Quranic lessons by browsing, search, deep link or recent history.

## 9. Islamic content integrity

Every piece of content must be authentic, age-appropriate and respectful before it is beautiful or fun; these rules apply to design, copy, audio and rewards.

| Area | Rule |
| --- | --- |
| Quran text | Uthmani script from the Fahd Complex edition; never edited, abbreviated or paraphrased inside the text; never used as decoration, loading screens, confetti or backgrounds |
| Quran audio | Only licensed or permitted reciters; every audio shows the reciter name |
| Hadith | Only authentic (sahih) or hasan hadith for children; each shows grade and source book; no weak narrations even as stories |
| Stories | Based on Quran and authentic Sunnah; narration marks what is from the Quran versus what is explanation; no invented dialogue presented as fact |
| Prophets and Companions | No depiction of their faces or bodies; use light, silhouettes from behind, scenery or objects; blessings said in text and audio (عليه السلام, رضي الله عنه) |
| The Prophet صلى الله عليه وسلم | Salawat shown with every mention; never animated or voiced by a character |
| Allah | No depiction of any kind; no anthropomorphic language in child-simplified text |
| Names of Allah | Meanings taken from established references, simplified without changing the meaning |
| Fiqh | Differences between madhhabs handled by a parent-set option; child screens show one clear way |
| Scary topics | Grave, hell and punishment stories use a gentle register for 7–9 and are hidden for 4–6 |
| Science and wonder | Only claims the source states; no unproven scientific interpretations of verses |
| Music and sound | Vocal-only or duff-only nasheeds by default; instruments only if a parent enables them |
| Dress and imagery | Modest avatars and illustrations; no inappropriate clothing or mixed-gender intimacy |
| Tone | Encouraging and warm; never shaming a child for missing a prayer or a day |

**Review workflow**

1. Every new content item has an author, a source citation and a status: draft, reviewed, approved.
2. A qualified reviewer approves all Quran, hadith, fiqh and story content before release; the reviewer name or council appears in the parent zone under "About our content".
3. A report button in the parent zone lets families flag an error; reports go to a tracked queue with a 7-day response target.
4. Changes to approved content require re-approval; version history is kept.

## 10. Rewards and gamification

Rewards celebrate learning and good character with a growing garden, and never present worship as a transaction or punish a missed day.

**Principles**

1. **Reward effort and learning, not acts of worship.** The child earns growth for listening, finishing a story, repeating an ayah or completing a wudu lesson; marking that they prayed earns nothing.
2. **Intrinsic framing.** Messages say "ما شاء الله" and "أحسنت" with a reflection, not "you earned 10 points".
3. **No loss aversion.** No "you will lose your streak"; a missed day pauses the sprout, and a returning child is welcomed back.
4. **Visible, finite goals.** A garden has a clear next flower; collectibles (Names of Allah cards, character stickers) are finite sets, not endless loot.
5. **No competition between children.** No leaderboards, no comparisons; only personal progress.
6. **Parent control.** The parent zone can turn rewards down (hide stars, keep stickers) or off.

**Mechanics**

| Element | Replaces | Behavior |
| --- | --- | --- |
| Garden | Stars and gems counters | Each completed step adds a leaf, bud or flower; the plant grows through 5 stages per world |
| Sticker shelf | Sticker "vault" | One sticker per finished story or character lesson; stickers are art with a one-line lesson |
| Sprout streak | Day streak | Counts active days; a pause token is granted weekly so a missed day does not reset it |
| Daily 3 steps ring | Mission card | Fills as steps finish; completion plays a short, calm animation and sound |
| Weekly sprout calendar | None | Shows days with activity as small green sprouts; empty days stay empty, never red |

**Rules for celebration:** animations under 2 seconds; no full-screen confetti on Quran screens; sound effects respect the music toggle.

## 11. Parent zone, safety and privacy

The parent zone is the only place with settings, reports and external information, and it sits behind a gate a child under 10 cannot pass by tapping.

**Gate**

- 4-digit PIN set at onboarding; reset through a hold-for-3-seconds challenge plus a simple Arabic-numerals math question.
- 3 failed attempts lock the zone for 1 minute, then 5 minutes.
- Gate required for: settings, dashboard, profile deletion, madhhab and location, content filter, any link that leaves the app.

**Dashboard and controls**

| Area | Content |
| --- | --- |
| Progress | Weekly activity, surahs listened and memorized, stories read, wudu and salah simulator completions |
| Time | Time spent per day and week; daily limit (15, 30, 45, 60 min or off); bedtime lock window |
| Content | Age filter per profile; hide reward counters; hide scary topics |
| Worship settings | Madhhab, city and calculation method for prayer times, adhan audio on or off |
| Sound | Music toggle, sound effects, volume cap |
| Profiles | Add, rename or delete child profiles; export or delete data |
| About our content | Sources list, reviewer council, report-an-error button |
| Privacy | Plain summary: no ads, no chat, no third-party trackers, minimal data |

**Privacy requirements**

1. Collect only a nickname, age band, avatar, progress and city; no real name, photo, voice recording or contact details from the child.
2. Store progress locally first and sync to an account only after the parent opts in.
3. No third-party advertising or behavioral tracking SDKs; analytics are anonymous, aggregated and event-based (section 14).
4. Align with Egypt's Personal Data Protection Law (Law 151 of 2020) and, for users outside Egypt, GDPR-K and COPPA principles; confirm legal review before launch.
5. Provide data export and deletion from the parent zone.
6. External links are not available to children; the only links in the app open from the parent zone.
7. Voice search audio is processed on the device where possible and never stored; if cloud speech is used, the parent must opt in.

**Safety:** no chat, comments, user uploads or social sharing; the app contains no ads or in-app purchases visible to the child.

## 12. Accessibility and localization

The app must be usable by a child who cannot read, by a child with low vision, and in Arabic and English with correct right-to-left behavior.

**Accessibility requirements**

| Area | Requirement |
| --- | --- |
| Contrast | 4.5:1 for body text, 3:1 for large text and icons; verified for gold on sand and white on emerald |
| Touch | 56 dp targets for ages 4–9, 48 dp for 10–12; no gesture-only actions (every swipe has a button) |
| Text size | System font scaling honored up to 200%; in-app text size control (3 steps) |
| Audio | Every text screen for ages 4–9 can be read aloud; every audio has visible controls and, where a script exists, highlighted text |
| Screen readers | All icons have Arabic labels; focus order follows RTL reading order; Quran ayah numbers announced |
| Motion | Respects reduced-motion; no flashing above 3 flashes per second |
| Color | Meaning never carried by color alone (completed steps also show a check or sprout) |
| Input | Parent PIN works with the system numeric keypad; no timed interactions required |

**Localization**

- **Arabic first:** default language Arabic (Modern Standard, with simple vocabulary for children); English as a full second language; the switch lives in the parent zone and a small header control.
- **RTL:** layouts, progress bars, sliders, carousels and arrows mirror correctly; numerals follow the language; Quran stays RTL in both languages.
- **Tashkeel:** all child-facing Arabic carries full diacritics; fonts tested for correct shaping of Uthmani marks.
- **Dates:** Hijri (Umm al-Qura or local sighting setting) and Gregorian, computed on the device, with a configurable day-change at Maghrib.
- **Voice:** Arabic voice prompts recorded by a human narrator; no robotic text-to-speech for Quran, hadith or supplications.
- **Regional notes:** Egyptian dialect hints allowed in mascot lines for 4–6 only; all other text in simple Fusha.

## 13. Technical requirements

The app stays a PWA hosted on Vercel and must feel instant on a mid-range Android phone over a weak connection, with the child never blocked by the network.

| Area | Requirement |
| --- | --- |
| Delivery | PWA with install prompt shown in the parent zone, not on child screens; Capacitor wrapper evaluated for a later release |
| Performance | First contentful paint under 2 s on mid-range Android over 4G; Home interactive under 3 s; route changes under 300 ms from cache |
| Bundle | Code-split per tab; Quran reader and simulators loaded on demand; initial JS under 200 KB gzipped (target, to confirm after profiling) |
| Rendering | Date, greeting, prayer times and streak computed on the client at open; no per-user values baked at build time |
| Offline | Service worker caches the app shell, current profile data, last 10 surahs' audio, wudu and salah audio and images; offline banner is calm and informative |
| Audio | Streaming with preload of the next ayah; caching by surah; audio element controlled by one global player so only one audio plays at a time |
| Images | SVG for icons and illustrations where possible; WebP/AVIF for raster with responsive sizes |
| State | Local storage or IndexedDB first; optional account sync after parent opt-in |
| Data | Existing Quran and Sunnah APIs kept; add a content service for stories, names, simulators and age flags with versioned JSON |
| Prayer times | Calculated on the device from the city and method set in the parent zone (an established library), with an offline fallback |
| Fonts | Subset Arabic fonts and self-host them; Quran font loaded only when the Quran world opens |
| Compatibility | Android 8+ with Chrome 100+, iOS 15+ Safari; tablet layouts at 768 px and above |
| Reliability | Crash-free sessions 99.5%; error states always offer a retry and a way home |
| Security | HTTPS only; Content Security Policy; no third-party scripts on child screens; parent PIN stored hashed and salted |

**Architecture notes for the build team**

1. Introduce a design-token layer (colors, spacing, type) so the palette in section 6 can be tuned without touching components.
2. Build an age-mode provider that exposes the mode to every component; components choose layout and text amount from it.
3. Treat every content item as data with fields for age range, source, grade, reviewer status, audio URL and image URL, so gating (AGE-2) is enforced in one place.
4. Make the date, greeting and daily-path logic pure functions with unit tests (a regression for the stale-date issue found in the audit).

## 14. Analytics and event plan

Analytics measure whether the redesign works using anonymous, aggregated events with no personal data and no third-party advertising SDKs.

| Event | When it fires | Properties | Answers |
| --- | --- | --- | --- |
| `app_open` | App becomes visible | age\_band, is\_installed, offline | Retention, install share |
| `onboarding_step` | Each onboarding step completes | step, duration | Drop-off in onboarding |
| `home_action` | Tap on a Home block | block, position | Is the Continue card used |
| `daily_step_complete` | A daily step completes | step\_type, age\_band | Daily path completion |
| `lesson_start` and `lesson_complete` | Start and finish of a story, surah session or simulator | world, content\_id, duration | Content engagement |
| `quran_audio_play` | Audio starts | surah, mode, speed, repeat | Reader feature use |
| `memorize_session` | A memorize session ends | surah, range, self\_check\_result | Memorization progress |
| `sim_start`, `sim_step`, `sim_complete` | Wudu or salah simulator | sim\_type, step, repeats | Simulator completion |
| `search_use` | Search opened | method (text, mic), result\_count | Is voice search needed |
| `parent_gate` | Gate shown | outcome | Do parents reach the zone |
| `parent_setting_change` | A setting changes | setting, value | Which controls matter |
| `error` | An error state is shown | area, code | Reliability |
| `perf_fcp` | Page loaded | fcp\_ms, effective\_type | Performance targets |

**Privacy rules for analytics**

1. No identifiers that can link events to a real person; a random install ID rotates every 30 days.
2. No free-text input and no audio ever leaves the device through analytics.
3. Parent opt-out in the parent zone; defaults follow local law.
4. Dashboards report aggregates only, with a minimum cohort of 20 users.

**Experiments:** the redesign ships behind a flag so the old and new home can be compared for 2 weeks on taps to start a lesson, Day-7 retention and simulator completion.

## 15. Roadmap and release plan

The redesign ships in four phases over about 14 weeks, with the core experience (Phase 2) as the first release candidate and a go or no-go gate after each phase.

&#91;embedded content: roadmap · 4 phases, 4 gates\]

Phase 2 is the highlighted release candidate; Phases 3 and 4 add depth and reach once the core is validated with families.

**What each phase delivers (requirement IDs from section 8)**

| Phase | Requirements | Output |
| --- | --- | --- |
| 1 Foundations | HOME-4, ONB-2, design tokens, analytics events | Token layer, SVG icon set, age-mode provider, date and greeting functions with tests |
| 2 Core redesign | NAV-1 to NAV-3, HOME-1 to HOME-3, HOME-5, ONB-1, AGE-2, PRY-1, PRY-2, STO-1, QUR-1, PAR-1 | New Home and 5-tab navigation, wudu and salah simulators, story player, word-highlighted ayah audio, parent gate, age gating |
| 3 Depth | AGE-1, QUR-2, QUR-3, QUR-5, PRY-3, PRY-4, PRY-5, STO-2, PAR-2, PAR-3 | Three age modes, memorize and repeat tools, prayer times, adhkar, Names of Allah, parent dashboard and controls |
| 4 Delight and reach | RWD-1, RWD-2, OFF-1, QUR-4, mascot, voice prompts, Friday and Ramadan modes | Garden rewards, offline audio, mascot and voice, special-time modes |

**Release plan**

1. **Internal alpha** (end of Phase 2): team and 5 trusted families on the staging build.
2. **Closed beta** (during Phase 3): 20 to 30 families across the three age bands; 2 moderated sessions per band; weekly feedback summary.
3. **Staged rollout** (Phase 4): 10%, 50%, 100% of users over 2 weeks behind the feature flag, with the old Home kept as a fallback until metrics are confirmed.
4. **Post-launch:** weekly review of metrics in section 3 and the open question list in section 16.

**Launch acceptance criteria**

- All P0 requirements pass their acceptance tests on Android 8+ (Chrome) and iOS 15+ (Safari).
- Content review sign-off recorded for every Quran, hadith, fiqh and story item in the release.
- Contrast, touch-target and RTL checks pass on the 10 key screens.
- Parent-zone usability test: 8 of 10 parents complete setting a time limit unaided.
- Child usability test: 8 of 10 children aged 7 to 9 start today's lesson from Home without help.
- Performance targets in section 13 met on a reference mid-range Android device.

## 16. Risks, open questions and appendix

The largest risks are content review capacity, offline audio size and parent trust, and the open questions below need answers before Phase 2 starts.

**Risks**

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Content review is slower than build speed | High | High | Start reviewer onboarding in Phase 1; ship only approved items; keep a visible backlog |
| Audio caching grows too large on low-storage phones | Medium | Medium | Cache by surah with a size cap and a parent-controlled "download" list; show storage use |
| Age modes triple the QA surface | High | Medium | Build from one component set with the age-mode provider; test the 10 key screens per band |
| Reciter or audio licensing limits | Medium | High | Confirm permitted sources and attribution before Phase 2; keep the reciter list server-side |
| Illustration without human figures is hard to make engaging | Medium | Medium | Brief illustrators early; prototype 3 story scenes in Phase 1 |
| Parents distrust a free app without an account | Medium | Medium | Clear privacy summary, content sources page and a named reviewer council |
| Simulator differences across madhhabs cause objections | Medium | Medium | Parent-set madhhab option; reviewer sign-off per variant |
| Voice search accuracy for children's Arabic | High | Low | Treat as optional; keep tappable alternatives; evaluate on-device models in beta |

**Open questions**

- [ ] Who is the content reviewer or council, and what is their sign-off process?
- [ ] Which reciters and audio sources are licensed for children's use and offline caching?
- [ ] Which markets are in scope (Egypt only, MENA, or global), which sets default madhhab, language and calendar?
- [ ] Do you want accounts and cross-device sync in this release, or local-only?
- [ ] Mascot: confirm a non-human lantern-bird or another character, and who illustrates it.
- [ ] Should the app support more than one child profile per device from day one?
- [ ] Is the Hijri date calculated by Umm al-Qura or by local sighting (Egypt's Dar al-Ifta)?
- [ ] Is a native wrapper (Capacitor) planned for app store distribution?
- [ ] Confirm numeric targets in section 3 after the 2-week baseline.

**Appendix A: current home content order observed (24 Oct 2026)**

Hijri date and flag, language switch, parent zone link, greeting, user switch, three stats (streak, stars, gems), smart search, Mushaf card (page 1, Fahd Complex edition), level card (Young Learner 7–9) with continue button, daily gentle mission, hadith of the day with grade and audio, three shortcuts (adhkar, cards, tasbih), then 13 world cards: Quran garden, Sunnah path, prophets caravan, character city, pillars academy, wudu and prayer simulators, animals in the Quran, Names of Allah, Seerah, young Companions, reflection on the universe, lessons from past nations (9+), and treasures and rewards; footer line "بِسْمِ اللّهِ نَبْدَأُ رِحْلَتَنَا"; bottom nav: Home, Quran, Sunnah, Prophets, Akhlaq, Treasures.

**Appendix B: glossary**

| Term | Meaning |
| --- | --- |
| Mushaf | The written Quran |
| Tajweed | Rules of Quranic recitation |
| Madhhab | School of Islamic jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali) |
| Adhkar | Daily remembrances and supplications |
| Tasbih | Counting phrases of glorification |
| Akhlaq | Character and manners |
| Seerah | Life of the Prophet صلى الله عليه وسلم |
| Murattal | Slow, measured recitation |
| Tashkeel | Arabic diacritics |

## 17. Implementation status (scan of 25 Oct 2026)

The live home screen already matches the PRD's structure (six worlds, five tabs, daily steps), but five defects need fixing and most inner features are unverified. The scan covered the home page text and structure only; inner pages and visuals were not inspected.

| Requirement group | Status | Notes |
| --- | --- | --- |
| NAV-1 (5 tabs) | Done in structure | Home, Quran, My prayer, Discover, Me are present; fixed-bar behavior not verified |
| NAV-2, NAV-3 (search, back) | Unverified | Search and mic appear to be icon-only, not visible in the page text |
| HOME-1 (7 blocks) | Done in structure | Header, Bismillah, continue, 3 steps, hadith, six worlds, prayer strip |
| HOME-2 (continue card) | Partial | Card present ("كمل من حيث توقفت"); one-tap resume and speed not verified |
| HOME-3 (daily 3 steps) | Done in structure | 0/3 ring with listen, learn, practice; level-based picking not verified |
| HOME-4 (device-computed dates) | Partial | Hijri date now correct (13 Jumada al-Ula 1448); weekday and Hijri day disagree after Maghrib |
| HOME-5 (Bismillah) | Done | Shown at the top, but also repeated in the footer |
| ONB-1 (onboarding) | Unverified | Not scanned |
| ONB-2 (no hard-coded name) | Open | Greeting still reads "يا طارق" |
| AGE-1 (three age modes) | Open | No age band visible on Home |
| AGE-2 (9+ gating) | Unverified | Quranic lessons card no longer on Home; gating behavior not checked |
| QUR-1 to QUR-5 | Unverified | Quran reader not scanned |
| PRY-1, PRY-2 (simulators) | Unverified | Wudu button exists on the prayer strip; simulators not scanned |
| PRY-4 (prayer times) | Defect | Strip said "حان وقت صلاة الفجر (04:45 ص)" at about 00:18 Cairo time |
| PRY-3, PRY-5, STO-1, STO-2 | Unverified | Names of Allah world exists (99 names, one per day); other items not scanned |
| RWD-1 (garden model) | Partial | Stars and gems removed from Home; garden not verified |
| RWD-2 (sprout streak) | Partial | Streak shows as a bare "3" with no label |
| PAR-1 to PAR-3 | Unverified | Parent zone icon not visible in the page text |
| OFF-1 (offline) | Unverified | Not tested |

**Defects to fix first**

1. **Prayer strip logic:** show it only within about 30 minutes before or after a prayer, computed on the device from the parent's city and method.
2. **Hard-coded name:** replace "يا طارق" with "يا بطل" or "يا بطلة" until a nickname is set.
3. **Weekday and Hijri pairing:** apply one day-change rule (configurable at Maghrib) to both, from the device clock and time zone.
4. **Emoji icons** (🌿 💧 ✨): replace with the SVG icon set.
5. **Duplicate Bismillah:** remove the footer line or turn it into a plain brand line.

**Smaller fixes:** give the streak number an accessible label and a sprout icon; label or move the 🇸🇦 flag; tighten the hadith explanation for "الضيافة ثلاثة أيام" so it states the three days and the first-day جائزة, and show grade, source and reviewer status on every hadith; add the age-mode picker.

## 18. Visual review of Home in 4–6 mode (screenshot, 25 Oct 2026)

The 4–6 mode now exists and its three giant tiles are the right idea, but the header is crowded, contrast looks weak on two tiles, and several details break the PRD's own rules. Findings are from one screenshot at about 540 px width; contrast values are visual estimates to be confirmed with a checker.

| # | Observation | Fix | Priority |
| --- | --- | --- | --- |
| 1 | Header packs a lock, a "SA" chip, a streak chip, a switch button and a small date pill into two rows at about 11–12 px | In 4–6 mode show only avatar, greeting, sprout streak and lock; move date, region and profile switch to the parent zone or a profile sheet | P0 |
| 2 | Nickname "dfd" is shown large and bold in the greeting | Validate nicknames (letters only, 2 to 15 characters), offer name suggestions, fall back to "يا بطل" or "يا بطلة" | P0 |
| 3 | White subtitles on the amber tile and on the light end of the blue tile look below 4.5:1 | Darken the gradient stops or use dark text on amber; verify every tile at 4.5:1 | P0 |
| 4 | Each tile shows a large white icon and a duplicate emoji in its title (🎧 💧 🎈); the mascot message also uses emoji | One icon per tile, from the SVG set; remove emoji from titles and messages | P1 |
| 5 | Coral Continue card plus three saturated tiles: four blocks of equal weight, and coral and orange are close in hue | Make Continue a slim card or the first tile; give each world its own hue (Quran green, prayer sky blue, stories gold) and keep coral for the one primary action | P1 |
| 6 | Third tile is titled "العب وتعلم" but its subtitle is prophets' stories and Quran animals | Rename to "قصص وعجائب" or "اكتشف"; keep "play" wording for games, not for prophets' stories | P1 |
| 7 | Green presence dot on the avatar suggests online status | Remove it; the app has no social or presence features | P1 |
| 8 | "SA" chip has no clear meaning | Remove from the child screen or label it in the parent zone as region or prayer-time method | P1 |
| 9 | Mascot message is small (about 12–14 px) and long for a pre-reader, with no play button; the mascot drawing is hard to recognize | Add a speaker button, voice the line once, shorten to one sentence at 18 px or more; redraw the mascot as the planned lantern-bird | P1 |
| 10 | Tab labels are about 10 px; tab icons are raster, 3D-style, while tile icons are flat white line icons | Labels at 12–13 px or more, icons 32 dp or larger, one icon style across the app | P2 |
| 11 | Prayer-time strip is not visible at 00:24 | Likely fixed; recheck at a prayer time and confirm the strip appears only within 30 minutes | Verify |
| 12 | Hadith card and any other blocks are below the fold or absent in this mode | Confirm what 4–6 mode shows below the tiles and that all text there can be read aloud | Verify |

**Working well:** very large touch targets, a single clear Continue card, a parent lock icon, a correct Hijri date and weekday on the device (Sunday 14 Jumada al-Ula 1448 at 00:24), RTL tab order, a mascot in place, and a calm light background.

**Status updates from this screenshot:** the weekday and Hijri date now agree (they use the civil day, with no Maghrib rule yet); the 4–6 age mode is present (AGE-1 partial); the parent lock icon is present (PAR-1 entry point seen, gate behavior unverified).

## 19. Visual asset kit

The best style for ages 4–9 is warm flat-vector illustration with soft gradients, rounded shapes and layered scenery, made as one consistent kit instead of mixed sources. This section is the brief for an illustrator or an image generator, and it tightens section 9: the default for prophet stories is no human figure at all (scenery, objects and light), and whether silhouettes are allowed is a reviewer decision.

**Art direction**

| Element | Decision |
| --- | --- |
| Style | Flat vector, no outlines, soft gradients, paper-cut layering for depth, rounded corners everywhere |
| Light | Warm sunrise or lantern glow; no harsh shadows, no dark or scary scenes |
| Palette | Section 6 tokens; one dominant hue per world: Quran garden-green, Worship sky, Stories gold, Akhlaq and Sunnah coral, Names of Allah emerald, Wonder dusk-violet (new token `#7C6BC4`, to be tuned) |
| Characters | Child avatars and the mascot have simple faces (dot eyes, small smile); prophets, Companions and Allah are never drawn |
| Clothing | Modest for every avatar; varied skin tones and hair; hijab option for girl avatars |
| Pattern | Geometric arabesque at 5% opacity in headers and card corners, generated in code |
| World tiles | Illustrated cards: a 3:2 scene on top, a solid title bar below in the world hue with text at 4.5:1 or better (replaces the flat gradient blocks with white text) |

**Asset list**

| Area | Assets | Count | Best way to produce |
| --- | --- | --- | --- |
| Mascot (lantern-bird) | Master character sheet, 8 poses, one idle loop | 8 | Human illustrator for the sheet; animate in Lottie or Rive |
| Child avatars | 6 avatars (3 boys, 3 girls), 3 expressions each | 18 | Illustrator, or generator with a character sheet plus human cleanup |
| World tiles | One scene per world | 6 | Generator with the master prompt, then cleanup |
| Tab and UI icons | 5 tab icons in 2 states, about 60 UI icons | 70 | One open-source icon set restyled with rounded strokes, or a designer |
| Wudu | One scene per step | 10 | Human-drawn vector with reviewer sign-off |
| Salah | Standing, ruku, sujud, sitting, salam for boy and girl | 10 | Human-drawn vector with reviewer sign-off |
| Stories | 6 to 8 scenes per story; first 5 stories | 30 to 40 | Generator for scenery and light scenes, human cleanup |
| Animals in the Quran | One illustration per animal | 16 | Generator or vector pack in the same style |
| Names of Allah | One card per name, one shared template | 99 | Batch generation of a symbolic scene per meaning; Arabic text set in code |
| Rewards | Garden growth stages, sticker set | 5 + 30 | Illustrator or batch generation |
| Backgrounds | Home, Quran, bedtime, story | 4 | Generator plus code-made pattern |

**Prompt templates** (replace the bracketed parts; keep the master line in every prompt)

```text
MASTER LINE: Flat vector children's book illustration, rounded shapes, no outlines, soft gradients, layered paper-cut depth, warm cream background, palette of emerald green, garden green, sky blue, soft gold, coral, cream, subtle geometric Islamic pattern, calm and friendly for ages 4 to 9, clean high-contrast shapes, no text, no letters, no Arabic script, no watermark, no scary elements.

MASCOT: Character sheet of a small friendly lantern-bird mascot, round body shaped like a glowing fanous lantern, tiny wings, soft glowing belly, big dot eyes, gentle smile. Show 8 poses: waving, happy jump, thinking, cheering, listening with a wing to the ear, pointing, sleeping, sitting calm. Same design in every pose, plain background. [MASTER LINE]

STORY SCENE: [Place and moment from the story, for example a desert valley at dawn]. Wide scene, scenery and objects only, warm light rays from the sky, no human figures, no faces. [MASTER LINE]

ANIMAL: A friendly [ant / hoopoe / whale / camel] in a simple natural scene, gentle expression, no clothes, no human features. [MASTER LINE]

NAME OF ALLAH CARD: Square illustration of the meaning of the name [for example Ar-Razzaq, the Provider: a green garden with fruit trees and a stream]. Symbolic scene only, nothing that depicts Allah. [MASTER LINE]

WORLD TILE: Wide 3:2 scene for the [Quran garden] world with a [garden-green] dominant hue, a small [open book on a stand] as the focal object. [MASTER LINE]
```

**Sources and licenses** (verify the license of every asset before use in a children's commercial app, and keep a license log)

| Need | Source | License note |
| --- | --- | --- |
| Game-style art and UI | Kenney.nl | CC0, no attribution required |
| Icons | Phosphor, Lucide, Tabler | Open-source (MIT or ISC); restyle for roundness |
| Spot illustrations | unDraw, Storyset | Free with terms; check attribution and redistribution rules |
| Animations | LottieFiles | License varies per file; check each |
| Fonts | Google Fonts for UI; KFGQPC Uthmanic Hafs or Amiri Quran for Quran | Open font licenses; confirm for embedding |
| Sounds | Freesound filtered to CC0, Kenney audio | Check per file |
| Patterns | Generated in code from geometric rules | You own them |

**Production pipeline**

1. **Lock the style first.** Produce one mascot sheet, 3 sample scenes and 1 world tile; approve them; reuse them as the style reference for everything else.
2. **Batch by world.** Generate 4 variants per asset, pick one, clean it in an editor, and keep the prompt with the file.
3. **Export by target:** icons as SVG; scenes as WebP about 1200 px wide, 80 KB or less; backgrounds 60 KB or less; mascot animation 100 KB or less as Lottie or Rive.
4. **Set all text in code.** Arabic titles, names, Quran and hadith are never baked into images.
5. **Log every asset** in the content table: id, world, age range, Arabic alt text, source, license, reviewer status.
6. **Reviewer sign-off** on every worship illustration (wudu, salah, adhkar) before release.

**Do not use an image generator for**

- Arabic or Quran text inside images; generators produce broken letters.
- Wudu and salah postures or hand anatomy; use human-drawn vector art checked against reference and a reviewer.
- Any depiction of prophets, Companions or Allah.
- Photos or likenesses of real children.

**Image QA checklist (every asset)**

- [ ] No text or letter artifacts; no watermark
- [ ] Correct hands and fingers; modest clothing
- [ ] No faces or bodies of sacred figures
- [ ] Palette matches section 6 tokens
- [ ] Overlay text on the image reaches 4.5:1
- [ ] Readable at tile size (about 160 px wide)
- [ ] File size within budget
- [ ] License and source logged

// Multilingual Upgrade Service for Noor Kids
// Covers 10 Languages: ar, en, fr, de, es, ru, ur, id, bn, tr
// For Asma Allah, Young Companions, Tafakkur Universe, Lessons of Nations, and Seerah Journey

import { Language } from '../constants/i18n';
import { AsmaAllahItem } from '../data/asmaAllahData';
import { CompanionStoryItem } from '../data/companionsData';
import { TafakkurStationItem } from '../data/tafakkurData';
import { NationLessonItem } from '../data/nationsData';
import { SeerahStationItem } from '../data/seerahData';
import {
  UPGRADE_HUB_LABELS,
  COMPANIONS_LOCALIZED,
  TAFAKKUR_LOCALIZED,
  NATIONS_LOCALIZED,
  SEERAH_LOCALIZED,
  WEEKLY_CHALLENGES_LOCALIZED,
} from './multilingualUpgradeData';

export { UPGRADE_HUB_LABELS };

export function getUpgradeLabel(key: string, lang: Language): string {
  const item = UPGRADE_HUB_LABELS[key];
  if (!item) return '';
  return item[lang] || item.en || item.ar || '';
}

// Localized Asma Allah Helper
export function getLocalizedAsmaAllah(item: AsmaAllahItem, lang: Language): { name: string; meaning: string; apply: string } {
  if (lang === 'ar') {
    return { name: item.name, meaning: item.meaning, apply: item.apply };
  }
  return {
    name: item.name,
    meaning: item.meaning,
    apply: item.apply,
  };
}

// Localized Companion Story Helper
export function getLocalizedCompanionStory(item: CompanionStoryItem, lang: Language): CompanionStoryItem {
  if (lang === 'ar') return item;
  const loc = COMPANIONS_LOCALIZED[item.id]?.[lang];
  if (loc) {
    return {
      ...item,
      title: loc.title || item.title,
      source: loc.source || item.source,
      story: loc.story || item.story,
      lesson: loc.lesson || item.lesson,
      areYouLikeThem: loc.areYouLikeThem || item.areYouLikeThem,
      apply: loc.apply || item.apply,
      cardTitle: loc.cardTitle || item.cardTitle,
    };
  }
  return item;
}

// Localized Tafakkur Station Helper
export function getLocalizedTafakkurStation(item: TafakkurStationItem, lang: Language): TafakkurStationItem {
  if (lang === 'ar') return item;
  const loc = TAFAKKUR_LOCALIZED[item.id]?.[lang];
  if (loc) {
    return {
      ...item,
      title: loc.title || item.title,
      ayah: loc.ayah || item.ayah,
      ponder: loc.ponder || item.ponder,
      scienceFact: loc.scienceFact || item.scienceFact,
      activity: loc.activity || item.activity,
      dhikr: loc.dhikr || item.dhikr,
      cardTitle: loc.cardTitle || item.cardTitle,
    };
  }
  return item;
}

// Localized Nation Lesson Helper
export function getLocalizedNationLesson(item: NationLessonItem, lang: Language): NationLessonItem {
  if (lang === 'ar') return item;
  const loc = NATIONS_LOCALIZED[item.id]?.[lang];
  if (loc) {
    return {
      ...item,
      title: loc.title || item.title,
      story: loc.story || item.story,
      lesson: loc.lesson || item.lesson,
      discussion: loc.discussion || item.discussion,
      activity: loc.activity || item.activity,
      caution: loc.caution || item.caution,
      cardTitle: loc.cardTitle || item.cardTitle,
    };
  }
  return item;
}

// Localized Seerah Station Helper
export function getLocalizedSeerahStation(item: SeerahStationItem, lang: Language): SeerahStationItem {
  if (lang === 'ar') return item;
  const loc = SEERAH_LOCALIZED[item.id]?.[lang];
  if (loc) {
    return {
      ...item,
      title: loc.title || item.title,
      source: loc.source || item.source,
      story: loc.story || item.story,
      lesson: loc.lesson || item.lesson,
      emulate: loc.emulate || item.emulate,
      quizText: loc.quizText || item.quizText,
      caution: loc.caution || item.caution,
      cardTitle: loc.cardTitle || item.cardTitle,
    };
  }
  return item;
}

export { WEEKLY_CHALLENGES_LOCALIZED };

export function getLocalizedWeeklyChallenge(
  challenge: { id: string; titleAr?: string; titleEn?: string; descAr?: string; descEn?: string },
  lang: Language
): { title: string; desc: string } {
  if (lang === 'ar') {
    return {
      title: challenge.titleAr || '',
      desc: challenge.descAr || '',
    };
  }
  const custom = WEEKLY_CHALLENGES_LOCALIZED[challenge.id]?.[lang];
  if (custom) return custom;
  return {
    title: challenge.titleEn || challenge.titleAr || '',
    desc: challenge.descEn || challenge.descAr || '',
  };
}

// Hadith Service (Data Access Layer)
import { HADITHS_DATA, KidHadith } from '@/data/hadithData';

export const hadithService = {
  getAll: (): KidHadith[] => {
    return HADITHS_DATA;
  },

  getById: (id: string): KidHadith | undefined => {
    return HADITHS_DATA.find((h) => h.id === id);
  },

  getByTheme: (theme: KidHadith['theme']): KidHadith[] => {
    return HADITHS_DATA.filter((h) => h.theme === theme);
  },

  getDailyHadith: (): KidHadith => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % HADITHS_DATA.length;
    return HADITHS_DATA[index] || HADITHS_DATA[0];
  },
};

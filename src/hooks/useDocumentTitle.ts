// src/hooks/useDocumentTitle.ts
// Sets unique, meaningful document title for each route on web (Accessibility Audit Phase 2, Item 7)

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export function useDocumentTitle(titleArOrCombined: string, titleEn?: string) {
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const isAr = language === 'ar';
      const chosenTitle = isAr ? titleArOrCombined : (titleEn || titleArOrCombined);
      const fullTitle = chosenTitle
        ? `${chosenTitle} – روضة كيدز`
        : 'روضة كيدز – تطبيق تعليم القرآن والسنّة للأطفال';
      document.title = fullTitle;
    }
  }, [titleArOrCombined, titleEn, language]);
}

export default useDocumentTitle;

// src/hooks/useDocumentTitle.ts
// Sets unique, meaningful document title for each route on web (Accessibility Audit Phase 2, Item 7)

import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fullTitle = title
        ? `${title} – روضة كيدز`
        : 'روضة كيدز – تطبيق تعليم القرآن والسنّة للأطفال';
      document.title = fullTitle;
    }
  }, [title]);
}

export default useDocumentTitle;

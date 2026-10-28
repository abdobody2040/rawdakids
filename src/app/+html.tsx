// src/app/+html.tsx
// Web root HTML for static rendering (PRD & Accessibility Audit Phase 2)
// Sets html lang="ar" and dir="rtl" before client JS hydrates, with viewport and PWA meta tags.

import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>روضة كيدز – تطبيق تعليم القرآن والسنّة للأطفال</title>
        <meta name="description" content="تطبيق تعليم القرآن الكريم والأذكار والصلوات للأطفال بأسلوب تفاعلي مبهج وآمن." />
        <meta name="theme-color" content="#0F9D6B" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />

        {/* Global Web Accessibility Focus Rings and resets */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :focus-visible {
                outline: 3px solid #0F9D6B !important;
                outline-offset: 2px !important;
              }
              button:focus-visible,
              [role="button"]:focus-visible,
              [role="radio"]:focus-visible,
              [role="switch"]:focus-visible,
              input:focus-visible,
              a:focus-visible {
                outline: 3px solid #0F9D6B !important;
                outline-offset: 2px !important;
              }
            `,
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

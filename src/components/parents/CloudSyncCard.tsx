// src/components/parents/CloudSyncCard.tsx
// Permanently disabled per Privacy Policy Section 1 & Section 4 (Zero server-side storage / Zero accounts).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { SPACING, RADIUS } from '@/constants/theme';
import { ValidatedBackupData } from '@/services/backupValidationService';

interface CloudSyncCardProps {
  language: Language;
  restoreValidatedData?: (data: ValidatedBackupData) => { success: boolean; profileCount: number };
}

export default function CloudSyncCard({ language }: CloudSyncCardProps) {
  const isAr = language === 'ar';

  return (
    <View style={styles.card}>
      <View style={[styles.headerRow, isAr && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="shield-checkmark" size={24} color="#059669" />
        <Text style={styles.title}>
          {isAr ? 'حفظ البيانات محلياً فقط (غير متاح سحابياً)' : 'Local-Only Storage (Cloud Sync Disabled)'}
        </Text>
      </View>
      <Text style={[styles.bodyText, isAr && { textAlign: 'right' }]}>
        {isAr
          ? 'التزاماً بسياسة الخصوصية الصارمة وحماية براءة الأطفال، لا يوجد خادم سحابي ولا تسجيل حسابات. تبقى جميع ملفات وتقدم الأطفال محفوظة بالكامل على هذا الجهاز فقط.'
          : 'In accordance with our strict privacy policy, no cloud server or account registration exists. All child profiles and progress remain 100% on this local device.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
  },
});

// src/components/parents/ScreenTimeCard.tsx
// Screen time daily limits and Bedtime Lock Window (PRD §8 - PAR-2 & PAR-3)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';

interface ScreenTimeCardProps {
  language: string;
  dailyLimitMin: number;
  bedtimeLockEnabled: boolean;
  bedtimeStart: string;
  bedtimeEnd: string;
  onUpdateDailyLimit: (min: number) => void;
  onToggleBedtimeLock: (enabled: boolean) => void;
  onUpdateBedtimeRange: (start: string, end: string) => void;
}

const LIMIT_OPTIONS = [
  { min: 0, labelAr: 'بلا حد', labelEn: 'Unlimited' },
  { min: 15, labelAr: '١٥ دقيقة', labelEn: '15 min' },
  { min: 30, labelAr: '٣٠ دقيقة', labelEn: '30 min' },
  { min: 45, labelAr: '٤٥ دقيقة', labelEn: '45 min' },
  { min: 60, labelAr: '٦٠ دقيقة', labelEn: '60 min' },
];

const BEDTIME_PRESETS = [
  { start: '20:00', end: '06:00', labelAr: '٠٨:٠٠ م – ٠٦:٠٠ ص', labelEn: '8:00 PM – 6:00 AM' },
  { start: '20:30', end: '06:30', labelAr: '٠٨:٣٠ م – ٠٦:٣٠ ص', labelEn: '8:30 PM – 6:30 AM' },
  { start: '21:00', end: '07:00', labelAr: '٠٩:٠٠ م – ٠٧:٠٠ ص', labelEn: '9:00 PM – 7:00 AM' },
];

export default function ScreenTimeCard({
  language,
  dailyLimitMin,
  bedtimeLockEnabled,
  bedtimeStart,
  bedtimeEnd,
  onUpdateDailyLimit,
  onToggleBedtimeLock,
  onUpdateBedtimeRange,
}: ScreenTimeCardProps) {
  const isAr = language === 'ar';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="timer" size={20} color="#D97706" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {isAr ? 'حدود الشاشة وقفل النوم الهادئ 🌙' : 'Screen Time & Bedtime Lock 🌙'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isAr
              ? 'الحفاظ على توازن وقت طفلك وصحته الرقمية وتنظيم نومه المبارك'
              : 'Foster healthy digital balance and restful Islamic sleep routines'}
          </Text>
        </View>
      </View>

      {/* 1. DAILY SCREEN TIME LIMIT (PAR-2) */}
      <View style={styles.subSection}>
        <View style={styles.subHeaderRow}>
          <Ionicons name="hourglass-outline" size={17} color={COLORS.secondaryDark} />
          <Text style={styles.subSectionTitle}>
            {isAr ? 'الحد اليومي للاستخدام الموصى به:' : 'Recommended Daily Limit:'}
          </Text>
        </View>
        <Text style={styles.hintText}>
          {isAr
            ? 'عند بلوغ الحد، تظهر رسالة رقيقة تشجع البطل على راحة عينيه ومساعدة والديه أو اللعب الحركي.'
            : 'When reached, a gentle mascot encouragement prompts the child to rest their eyes and help family.'}
        </Text>

        <View style={styles.limitButtonsRow}>
          {LIMIT_OPTIONS.map((opt) => {
            const isSelected = dailyLimitMin === opt.min;
            return (
              <TouchableOpacity
                key={opt.min}
                style={[styles.limitBtn, isSelected && styles.limitBtnSelected]}
                onPress={() => onUpdateDailyLimit(opt.min)}
                activeOpacity={0.8}
              >
                <Text style={[styles.limitBtnText, isSelected && styles.limitBtnTextSelected]}>
                  {isAr ? opt.labelAr : opt.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2. BEDTIME LOCK WINDOW (PAR-3) */}
      <View style={styles.subSection}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: SPACING.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="moon" size={16} color="#6366F1" />
              <Text style={styles.switchTitle}>
                {isAr ? 'قفل النوم الهادئ (Bedtime Lock)' : 'Bedtime Quiet Lock'}
              </Text>
            </View>
            <Text style={styles.switchSubtitle}>
              {isAr
                ? 'إغلاق الألعاب والأنشطة خلال ساعات الليل وتحويل الشاشة لأذكار النوم والقرآن الهادئ.'
                : 'Locks games during night hours and presents soothing Quran recitation & bedtime dua.'}
            </Text>
          </View>
          <Switch
            value={bedtimeLockEnabled}
            onValueChange={onToggleBedtimeLock}
            trackColor={{ false: COLORS.border, true: '#C7D2FE' }}
            thumbColor={bedtimeLockEnabled ? '#4F46E5' : COLORS.cardAlt}
          />
        </View>

        {bedtimeLockEnabled && (
          <View style={styles.bedtimePresetsContainer}>
            <Text style={styles.presetsLabel}>
              {isAr ? 'اختر الفترة الزمنية لنوم طفلك:' : 'Select Bedtime Window:'}
            </Text>
            <View style={styles.presetsRow}>
              {BEDTIME_PRESETS.map((preset) => {
                const isSelected = bedtimeStart === preset.start && bedtimeEnd === preset.end;
                return (
                  <TouchableOpacity
                    key={preset.start}
                    style={[styles.presetPill, isSelected && styles.presetPillSelected]}
                    onPress={() => onUpdateBedtimeRange(preset.start, preset.end)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="bed-outline"
                      size={14}
                      color={isSelected ? '#FFFFFF' : '#4F46E5'}
                    />
                    <Text style={[styles.presetPillText, isSelected && styles.presetPillTextSelected]}>
                      {isAr ? preset.labelAr : preset.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subSection: {
    marginTop: SPACING.xs,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  limitButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  limitBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  limitBtnSelected: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  limitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  limitBtnTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  switchSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
  bedtimePresetsContainer: {
    marginTop: SPACING.md,
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  presetsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: SPACING.xs,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  presetPillSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  presetPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

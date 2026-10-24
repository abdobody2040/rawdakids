// src/components/parents/WorshipSettingsCard.tsx
// Fiqh Madhhab selector, city prayer calculation, and Adhan audio controls (PRD §8 - PRY-3 & PRY-4)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { SUPPORTED_CITIES } from '@/services/prayerTimeService';

interface WorshipSettingsCardProps {
  language: string;
  madhhab: 'hanafi' | 'maliki' | 'shafii' | 'hanbali';
  prayerCity: string;
  adhanAudioEnabled: boolean;
  onUpdateMadhhab: (madhhab: 'hanafi' | 'maliki' | 'shafii' | 'hanbali') => void;
  onUpdateCity: (cityKey: string) => void;
  onToggleAdhan: (enabled: boolean) => void;
}

const MADHHABS = [
  {
    id: 'shafii',
    nameAr: 'المذهب الشافعي',
    nameEn: 'Shafi’i Madhhab',
    descAr: 'وضع اليدين فوق السرة وتحت الصدر، وقنوت الفجر، ورفع السبابة عند «إلا الله».',
    descEn: 'Hands placed above navel, Qunut in Fajr, index finger raised at Shahadah.',
    badgeAr: 'الأكثر شيوعاً بمصر والشام',
    badgeEn: 'Common in Egypt & Levant',
  },
  {
    id: 'hanafi',
    nameAr: 'المذهب الحنفي',
    nameEn: 'Hanafi Madhhab',
    descAr: 'وضع اليدين تحت السرة، وحساب وقت العصر عند بلوغ الظل مثليه.',
    descEn: 'Hands below navel for boys, Asr calculated when shadow is 2x object length.',
    badgeAr: 'الأكثر انتشاراً بالعالم الإسلامي',
    badgeEn: 'Widespread across Muslim world',
  },
  {
    id: 'maliki',
    nameAr: 'المذهب المالكي',
    nameEn: 'Maliki Madhhab',
    descAr: 'السدل المشهور أو القبض، وتحريك السبابة يميناً وشمالاً برفق في التشهد.',
    descEn: 'Sadl (arms at sides) or Qabd, gentle side-to-side finger motion in Tashahhud.',
    badgeAr: 'سائد بالمغرب العربي والخليج',
    badgeEn: 'Predominant in North & West Africa',
  },
  {
    id: 'hanbali',
    nameAr: 'المذهب الحنبلي',
    nameEn: 'Hanbali Madhhab',
    descAr: 'وضع اليدين تحت السرة أو فوقها، والإشارة بالسبابة عند كل ذكر لله تعالى.',
    descEn: 'Hands placed below or above navel, finger pointed at mention of Allah.',
    badgeAr: 'سائد بشبه الجزيرة العربية',
    badgeEn: 'Predominant in Arabian Peninsula',
  },
] as const;

export default function WorshipSettingsCard({
  language,
  madhhab,
  prayerCity,
  adhanAudioEnabled,
  onUpdateMadhhab,
  onUpdateCity,
  onToggleAdhan,
}: WorshipSettingsCardProps) {
  const isAr = language === 'ar';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass" size={20} color="#059669" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {isAr ? 'الفقه ومواقيت الصلاة والأذان 🕌' : 'Fiqh, Prayer Times & Adhan 🕌'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isAr
              ? 'تخصيص المذهب الفقهي المعتمد لأسرتك، والمدينة لحساب المواقيت بدقة'
              : 'Customize family fiqh school, prayer city calculation & Adhan audio'}
          </Text>
        </View>
      </View>

      {/* 1. FIQH MADHHAB SELECTOR (PRY-3) */}
      <View style={styles.subSection}>
        <View style={styles.subHeaderRow}>
          <Ionicons name="book-outline" size={17} color={COLORS.primary} />
          <Text style={styles.subSectionTitle}>
            {isAr ? 'المذهب الفقهي المعتمد للصلاة:' : 'Family Fiqh School (Madhhab):'}
          </Text>
        </View>
        <Text style={styles.hintText}>
          {isAr
            ? 'تُراعي محاكاة الصلاة في الروضة الفروق الفقهية اللطيفة (موضع اليدين، الإشارة في التشهد، وقت العصر).'
            : 'Prayer simulator gently respects nuanced fiqh variations (hand placement, Tashahhud gesture, Asr timing).'}
        </Text>

        <View style={styles.madhhabList}>
          {MADHHABS.map((m) => {
            const isSelected = (madhhab || 'shafii') === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.madhhabCard, isSelected && styles.madhhabCardSelected]}
                onPress={() => onUpdateMadhhab(m.id)}
                activeOpacity={0.8}
              >
                <View style={styles.madhhabTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.madhhabName, isSelected && styles.madhhabNameSelected]}>
                      {isAr ? m.nameAr : m.nameEn}
                    </Text>
                    <Text style={styles.madhhabDesc}>
                      {isAr ? m.descAr : m.descEn}
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>

                <View style={styles.badgeRow}>
                  <View style={styles.badgePill}>
                    <Ionicons name="ribbon-outline" size={12} color="#059669" />
                    <Text style={styles.badgeText}>
                      {isAr ? m.badgeAr : m.badgeEn}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Respectful Girl Posture Guidance Note */}
        <View style={styles.guidanceBox}>
          <Ionicons name="information-circle" size={18} color="#0284C7" />
          <Text style={styles.guidanceText}>
            {isAr
              ? 'تنبيه لطيف: عند اختيار شخصية فتاة، يُظهر محاكي الصلاة هيئة ضم اليدين والأعضاء في السجود والركوع طلباً للمزيد من الحشمة وفق ما استحبه جمهور الفقهاء.'
              : 'Gentle note: When a girl avatar is active, the simulator shows modest body postures (arms gathered close during Sujood) recommended by classical jurists.'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2. PRAYER TIMES CITY SELECTOR (PRY-4) */}
      <View style={styles.subSection}>
        <View style={styles.subHeaderRow}>
          <Ionicons name="location-outline" size={17} color="#0284C7" />
          <Text style={styles.subSectionTitle}>
            {isAr ? 'المدينة لحساب مواقيت الصلاة:' : 'City for Prayer Calculation:'}
          </Text>
        </View>
        <Text style={styles.hintText}>
          {isAr
            ? 'يتم حساب مواقيت الصلوات الخمس والعد التنازلي للأذان محلياً بناءً على المدينة المختارة.'
            : '5 daily prayer times and countdowns are calculated on-device for the selected city.'}
        </Text>

        <View style={styles.cityPillsGrid}>
          {SUPPORTED_CITIES.map((city) => {
            const isSelected = (prayerCity || 'cairo') === city.key;
            return (
              <TouchableOpacity
                key={city.key}
                style={[styles.cityPill, isSelected && styles.cityPillSelected]}
                onPress={() => onUpdateCity(city.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'location'}
                  size={14}
                  color={isSelected ? '#FFFFFF' : COLORS.textMuted}
                />
                <Text style={[styles.cityPillText, isSelected && styles.cityPillTextSelected]}>
                  {isAr ? city.nameAr : city.nameEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      {/* 3. ADHAN AUDIO TOGGLE (PRY-4) */}
      <View style={styles.switchRow}>
        <View style={{ flex: 1, paddingRight: SPACING.md }}>
          <Text style={styles.switchTitle}>
            {isAr ? 'صوت الأذان العذب 🔊' : 'Adhan Audio Notification 🔊'}
          </Text>
          <Text style={styles.switchSubtitle}>
            {isAr
              ? 'تشغيل نداء الأذان عند دخول وقت الصلاة لتشجيع الأطفال على الصلاة مع الجماعة.'
              : 'Play melodious Adhan call at prayer times to encourage young champions to pray.'}
          </Text>
        </View>
        <Switch
          value={adhanAudioEnabled}
          onValueChange={onToggleAdhan}
          trackColor={{ false: COLORS.border, true: '#86EFAC' }}
          thumbColor={adhanAudioEnabled ? '#059669' : COLORS.cardAlt}
        />
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
    backgroundColor: '#ECFDF5',
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
    marginTop: SPACING.sm,
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
  madhhabList: {
    gap: SPACING.sm,
  },
  madhhabCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  madhhabCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  madhhabTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  madhhabName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  madhhabNameSelected: {
    color: '#065F46',
  },
  madhhabDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: '#059669',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
  },
  badgeRow: {
    marginTop: 6,
    flexDirection: 'row',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065F46',
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#F0F9FF',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  guidanceText: {
    flex: 1,
    fontSize: 11,
    color: '#0369A1',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: SPACING.md,
  },
  cityPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityPillSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cityPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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
});

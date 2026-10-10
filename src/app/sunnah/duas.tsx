import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { contentService } from '@/services/contentService';
import { audioService } from '@/services/audioService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import SunnahHeroHeader from '@/components/SunnahHeroHeader';
import StarRewardCelebration from '@/components/StarRewardCelebration';

interface CategoryFilter {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', nameAr: 'الكل (٥٠)', nameEn: 'All (50)', icon: 'apps' },
  { id: 'morning_sleep', nameAr: 'الصباح والنوم', nameEn: 'Morning & Sleep', icon: 'sunny' },
  { id: 'food_home', nameAr: 'الطعام والمنزل', nameEn: 'Food & Home', icon: 'restaurant' },
  { id: 'study', nameAr: 'العلم والمذاكرة', nameEn: 'Study & Wisdom', icon: 'book' },
  { id: 'manners', nameAr: 'الآداب والمعاملات', nameEn: 'Manners & Adab', icon: 'heart' },
  { id: 'nature_travel', nameAr: 'الطبيعة والسفر', nameEn: 'Nature & Travel', icon: 'rainy' },
  { id: 'mosque_health', nameAr: 'المسجد والصحة', nameEn: 'Mosque & Health', icon: 'business' },
];

export default function DuaLibraryScreen() {
  const { language, addStars, addGems } = useAppStore();
  const t = TRANSLATIONS[language];
  const duas = contentService.getDuas();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  const handleToggleDuaAudio = async (duaId: string, arabicText: string) => {
    setAudioError(null);
    if (playingDuaId === duaId) {
      await audioService.stopDua();
      setPlayingDuaId(null);
      return;
    }

    setPlayingDuaId(duaId);
    await audioService.playDua(arabicText, (status) => {
      if (status.didJustFinish) {
        setPlayingDuaId(null);
        addStars(1);
        addGems(2);
        setShowCelebration(true);
      } else if (status.error) {
        setPlayingDuaId(null);
        setAudioError(
          language === 'ar'
            ? 'تعذر تشغيل الصوت، تأكد من الاتصال بالإنترنت'
            : 'Could not play audio. Please check internet connection'
        );
      } else if (!status.isPlaying) {
        setPlayingDuaId(null);
      }
    });
  };

  const filteredDuas = duas.filter((d) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'morning_sleep')
      return d.category === 'morning' || d.category === 'sleep';
    if (selectedCategory === 'food_home')
      return d.category === 'food' || d.category === 'home';
    if (selectedCategory === 'study') return d.category === 'study';
    if (selectedCategory === 'manners') return d.category === 'manners';
    if (selectedCategory === 'nature_travel')
      return d.category === 'nature' || d.category === 'travel';
    if (selectedCategory === 'mosque_health')
      return d.category === 'mosque' || d.category === 'health' || d.category === 'daily';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <Header showBack title={t.sunnah} />
        <SunnahHeroHeader activeTab="duas" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Horizontal Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = selectedCategory === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(filter.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={15}
                  color={isActive ? '#ffffff' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {language === 'ar' ? filter.nameAr : filter.nameEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {audioError && (
          <View style={styles.errorAlertBox}>
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorAlertText}>{audioError}</Text>
          </View>
        )}

        <View style={styles.duasList}>
          {filteredDuas.map((dua, index) => {
            return (
              <View key={dua.id} style={styles.duaCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name={(dua.iconName as any) || 'sparkles'}
                      size={20}
                      color={COLORS.secondaryDark}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.duaIndex}>#{index + 1}</Text>
                      <Text style={styles.duaTitle}>
                        {language === 'ar' ? dua.titleAr : dua.titleEn}
                      </Text>
                    </View>
                    <Text style={styles.whenToSay}>
                      {language === 'ar' ? dua.whenToSayAr : dua.whenToSayEn}
                    </Text>
                  </View>
                </View>

                {/* Arabic Dua */}
                <Text style={styles.arabicText}>{dua.arabicText}</Text>

                {/* Transliteration & English Translation (Only in English mode) */}
                {language === 'en' && (
                  <View style={{ gap: 6, marginVertical: 6 }}>
                    <Text style={styles.transliterationText}>{dua.transliteration}</Text>
                    <Text style={styles.translationText}>{dua.translationEn}</Text>
                  </View>
                )}

                {/* Virtue badge */}
                <View style={styles.virtueBox}>
                  <Ionicons name="gift" size={14} color={COLORS.secondaryDark} />
                  <Text style={styles.virtueText}>
                    {language === 'ar' ? dua.virtueAr : dua.virtueEn}
                  </Text>
                </View>

                {/* Action button */}
                <TouchableOpacity
                  style={[
                    styles.listenBtn,
                    playingDuaId === dua.id && styles.listenBtnPlaying,
                  ]}
                  onPress={() => handleToggleDuaAudio(dua.id, dua.arabicText)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      playingDuaId === dua.id ? 'pause-circle' : 'volume-medium'
                    }
                    size={20}
                    color={COLORS.textLight}
                  />
                  <Text style={styles.listenBtnText}>
                    {playingDuaId === dua.id
                      ? language === 'ar'
                        ? 'جارٍ الاستماع للدعاء... (إيقاف)'
                        : 'Listening to Dua... (Pause)'
                      : t.listenToDua}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AppBottomNav />
      </View>

      {/* Reward modal on finish */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={1}
        gemsEarned={2}
        subtitle={
          language === 'ar'
            ? 'ما شاء الله! حفظت دعاءً مباركاً اليوم 🌟'
            : 'Masha’Allah! You recited a blessed Dua today 🌟'
        }
        onDismiss={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 60,
    gap: SPACING.md,
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  bannerBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  banner3dImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: SPACING.xs,
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondaryDark,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryDark,
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center',
  },
  totalBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterChipActive: {
    backgroundColor: COLORS.secondaryDark,
    borderColor: COLORS.secondaryDark,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  duasList: {
    gap: SPACING.md,
  },
  duaCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duaIndex: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.secondary,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  whenToSay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  arabicText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondaryDark,
    textAlign: 'center',
    lineHeight: 30,
    marginVertical: SPACING.sm,
  },
  transliterationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  virtueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  virtueText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.glow(COLORS.secondary),
  },
  listenBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  listenBtnPlaying: {
    backgroundColor: '#059669',
  },
  errorAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  errorAlertText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '700',
  },
});

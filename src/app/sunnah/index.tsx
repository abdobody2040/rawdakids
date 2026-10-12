// Sunnah Path Hub (طريق السنة - S1, S4, S7)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hadithService } from '@/services/hadithService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import SunnahHeroHeader, { SunnahTab } from '@/components/SunnahHeroHeader';

export default function SunnahPathScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { language, hadithProgress, dailyHabitsDone, toggleDailyHabit } = useAppStore();
  const t = TRANSLATIONS[language];

  const resolvedTab: SunnahTab = params.tab === 'habits' ? 'habits' : 'hadiths';
  const [selectedTab, setSelectedTab] = useState<SunnahTab | null>(null);
  const activeTab: SunnahTab = selectedTab ?? resolvedTab;
  const hadiths = hadithService.getAll();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack title={t.sunnah} />

        {/* Hero Header with 3D Generated Image Background & 4 Tabs */}
        <SunnahHeroHeader
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'hadiths' || tab === 'habits') {
              setSelectedTab(tab);
            } else if (tab === 'adhkar') {
              router.replace('/sunnah/adhkar');
            } else if (tab === 'duas') {
              router.replace('/sunnah/duas');
            } else if (tab === 'cards') {
              router.replace('/sunnah/cards');
            } else if (tab === 'tasbih') {
              router.push('/sunnah/tasbih');
            }
          }}
        />

      {/* Content depending on active tab */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'hadiths' && (
          <View style={styles.listArea}>
            {hadiths.map((hadith) => {
              const progress = hadithProgress[hadith.id];
              const isCompleted = progress?.completed;

              return (
                <TouchableOpacity
                  key={hadith.id}
                  style={styles.hadithCard}
                  onPress={() => router.push(`/sunnah/${hadith.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.hadithCardTop, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                    <View style={styles.gradeBadge}>
                      <Ionicons name="ribbon" size={12} color={COLORS.secondaryDark} />
                      <Text style={styles.gradeBadgeText}>{hadith.grade}</Text>
                    </View>
                    {isCompleted && (
                      <View style={styles.doneBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={15}
                          color={COLORS.success}
                        />
                        <Text style={styles.doneBadgeText}>{t.habitDone}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.hadithTitle, { textAlign: language === 'ar' ? 'right' : 'left' }]}>
                    {language === 'ar' ? hadith.titleAr : hadith.titleEn}
                  </Text>
                  <Text style={[styles.hadithArabicText, { textAlign: 'right' }]}>{hadith.arabicText}</Text>
                  {language === 'en' && (
                    <Text style={styles.hadithExplanationEn}>{hadith.explanationEn}</Text>
                  )}

                  <View style={[styles.hadithFooter, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                    <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                      <Text style={styles.hadithSourceText}>
                        {hadith.source} ({hadith.hadithNumber})
                      </Text>
                    </View>
                    <View style={styles.hadithActionBtn}>
                      <Text style={styles.hadithActionBtnText}>
                        {language === 'ar' ? 'تدبر وتعلّم' : 'Learn'}
                      </Text>
                      <Ionicons
                        name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                        size={13}
                        color="#B45309"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'habits' && (
          <View style={styles.listArea}>
            <Text style={styles.habitsIntro}>
              {language === 'ar'
                ? 'طبق هذه السنن المباركة اليوم واكسب النجوم والجواهر!'
                : 'Practice these blessed sunnah habits today to earn rewards!'}
            </Text>

            {hadiths.map((h) => {
              const isDone = !!dailyHabitsDone[h.linkedHabit.id];

              return (
                <TouchableOpacity
                  key={h.linkedHabit.id}
                  style={[styles.habitItemCard, isDone && styles.habitItemCardDone]}
                  onPress={() => toggleDailyHabit(h.linkedHabit.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isDone ? 'checkbox' : 'square-outline'}
                    size={26}
                    color={isDone ? COLORS.success : COLORS.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.habitItemTitle, isDone && styles.habitTextDone]}
                    >
                      {language === 'ar' ? h.linkedHabit.nameAr : h.linkedHabit.nameEn}
                    </Text>
                    <Text style={styles.habitItemAction}>
                      {language === 'ar'
                        ? h.linkedHabit.actionAr
                        : h.linkedHabit.actionEn}
                    </Text>
                  </View>
                  <View style={styles.habitStarBadge}>
                    <Ionicons name="star" size={14} color={COLORS.starActive} />
                    <Text style={styles.habitStarText}>+1</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AppBottomNav />
      </View>
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
  heroBannerContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroBannerImage: {
    width: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  hero3dBadgeBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
    ...SHADOWS.soft,
  },
  hero3dBadgeImg: {
    width: '100%',
    height: '100%',
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.lg,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.soft,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  tabBtnTextActive: {
    color: COLORS.secondaryDark,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  listArea: {
    gap: SPACING.md,
  },
  hadithCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  hadithCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gradeBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  doneBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  hadithTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  hadithArabicText: {
    fontSize: 16,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    lineHeight: 26,
    marginVertical: SPACING.xs,
  },
  hadithExplanationEn: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  hadithFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  hadithSourceText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  hadithActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hadithActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  habitsIntro: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  habitItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  habitItemCardDone: {
    backgroundColor: COLORS.successLight + '22',
    borderColor: COLORS.successLight,
  },
  habitItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  habitTextDone: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  habitItemAction: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  habitStarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  habitStarText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  sunnahBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  sunnahBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
});

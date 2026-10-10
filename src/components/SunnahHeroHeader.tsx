import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { hadithService } from '@/services/hadithService';
import { contentService } from '@/services/contentService';

const SUNNAH_PATH_IMG = require('../../assets/images/sunnah-path.jpg');
const NAV_SUNNAH_IMG = require('../../assets/images/nav-sunnah-3d.jpg');

export type SunnahTab = 'hadiths' | 'habits' | 'duas' | 'cards';

interface SunnahHeroHeaderProps {
  activeTab: SunnahTab;
  onTabChange?: (tab: SunnahTab) => void;
}

export default function SunnahHeroHeader({ activeTab, onTabChange }: SunnahHeroHeaderProps) {
  const router = useRouter();
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const hadiths = hadithService.getAll();
  const duas = contentService.getDuas();

  const tabs: {
    id: SunnahTab;
    labelAr: string;
    labelEn: string;
    icon: keyof typeof Ionicons.glyphMap;
    count: number;
    color: string;
    activeBg: string;
  }[] = [
    {
      id: 'hadiths',
      labelAr: 'الأحاديث النبوية',
      labelEn: 'Hadiths',
      icon: 'book',
      count: hadiths.length,
      color: '#B45309',
      activeBg: '#FEF3C7',
    },
    {
      id: 'habits',
      labelAr: 'سنن اليوم',
      labelEn: 'Daily Habits',
      icon: 'sparkles',
      count: hadiths.length,
      color: '#059669',
      activeBg: '#D1FAE5',
    },
    {
      id: 'duas',
      labelAr: 'الأدعية المباركة',
      labelEn: 'Duas',
      icon: 'heart',
      count: duas.length,
      color: '#E11D48',
      activeBg: '#FFE4E6',
    },
    {
      id: 'cards',
      labelAr: 'بطاقات الحفظ',
      labelEn: 'Flashcards',
      icon: 'albums',
      count: hadiths.length,
      color: '#7C3AED',
      activeBg: '#EDE9FE',
    },
  ];

  const handlePressTab = (tab: SunnahTab) => {
    if (activeTab === tab) return;
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    if (tab === 'hadiths') {
      router.push('/sunnah');
    } else if (tab === 'habits') {
      router.push({ pathname: '/sunnah', params: { tab: 'habits' } });
    } else if (tab === 'duas') {
      router.push('/sunnah/duas');
    } else if (tab === 'cards') {
      router.push('/sunnah/cards');
    }
  };

  return (
    <View style={styles.headerWrapper}>
      {/* 1. Hero Visual Banner */}
      <View style={styles.heroBannerContainer}>
        <Image
          source={SUNNAH_PATH_IMG}
          style={styles.heroBannerImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(180, 83, 9, 0.88)', 'rgba(217, 119, 6, 0.94)']}
          style={styles.heroBannerOverlay}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>{t.sunnah}</Text>
              <Text style={styles.heroDesc}>{t.sunnahDesc}</Text>
            </View>
            <View style={styles.hero3dBadgeBox}>
              <Image
                source={NAV_SUNNAH_IMG}
                style={styles.hero3dBadgeImg}
                contentFit="cover"
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 2. Dedicated Kid-Friendly Category Tabs Menu with Icons & Count Badges */}
      <View style={styles.tabsMenuContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.tabsScrollContent,
            { flexDirection: isAr ? 'row-reverse' : 'row' },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabCard,
                  isActive
                    ? { backgroundColor: tab.activeBg, borderColor: tab.color, borderWidth: 1.5 }
                    : styles.tabCardInactive,
                ]}
                onPress={() => handlePressTab(tab.id)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.tabIconBadge,
                    { backgroundColor: isActive ? tab.color : '#F3F4F6' },
                  ]}
                >
                  <Ionicons
                    name={tab.icon}
                    size={16}
                    color={isActive ? '#FFFFFF' : '#6B7280'}
                  />
                </View>

                <Text
                  style={[
                    styles.tabTitleText,
                    isActive && { color: tab.color, fontWeight: '900' },
                  ]}
                  numberOfLines={1}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </Text>

                <View
                  style={[
                    styles.tabCountPill,
                    { backgroundColor: isActive ? tab.color : '#E5E7EB' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      { color: isActive ? '#FFFFFF' : '#4B5563' },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
  },
  heroBannerContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
  },
  heroTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.sm,
  },
  hero3dBadgeBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
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
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 4,
    lineHeight: 18,
  },
  tabsMenuContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tabsScrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 8,
    alignItems: 'center',
  },
  tabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    ...SHADOWS.soft,
  },
  tabCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  tabCountPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
});


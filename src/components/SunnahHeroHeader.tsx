import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
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
  const hadiths = hadithService.getAll();
  const duas = contentService.getDuas();

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
    <View style={styles.heroBannerContainer}>
      <ImageBackground
        source={SUNNAH_PATH_IMG}
        style={styles.heroBannerImage}
        imageStyle={{ borderRadius: RADIUS.xl }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(180, 83, 9, 0.88)', 'rgba(217, 119, 6, 0.94)']}
          style={styles.heroBannerOverlay}
        >
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{t.sunnah}</Text>
              <Text style={styles.heroDesc}>{t.sunnahDesc}</Text>
            </View>
            <View style={styles.hero3dBadgeBox}>
              <Image
                source={NAV_SUNNAH_IMG}
                style={styles.hero3dBadgeImg}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* 4 Tabs Switcher */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'hadiths' && styles.tabBtnActive]}
              onPress={() => handlePressTab('hadiths')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'hadiths' && styles.tabBtnTextActive,
                ]}
              >
                {language === 'ar' ? `الأحاديث (${hadiths.length})` : `Hadiths (${hadiths.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'habits' && styles.tabBtnActive]}
              onPress={() => handlePressTab('habits')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'habits' && styles.tabBtnTextActive,
                ]}
              >
                {language === 'ar' ? `السنن (${hadiths.length})` : `Habits (${hadiths.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'duas' && styles.tabBtnActive]}
              onPress={() => handlePressTab('duas')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'duas' && styles.tabBtnTextActive,
                ]}
              >
                {language === 'ar' ? `الأدعية (${duas.length})` : `Duas (${duas.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'cards' && styles.tabBtnActive]}
              onPress={() => handlePressTab('cards')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'cards' && styles.tabBtnTextActive,
                ]}
              >
                {language === 'ar' ? `البطاقات (${hadiths.length})` : `Cards (${hadiths.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';

const SUNNAH_PATH_IMG = require('../../assets/images/sunnah-path.jpg');
const NAV_SUNNAH_IMG = require('../../assets/images/nav-sunnah-3d.jpg');

export type SunnahTab = 'hadiths' | 'habits' | 'adhkar' | 'duas' | 'cards' | 'tasbih';

interface SunnahHeroHeaderProps {
  activeTab: SunnahTab;
  onTabChange?: (tab: SunnahTab) => void;
}

export default function SunnahHeroHeader({ activeTab, onTabChange }: SunnahHeroHeaderProps) {
  const router = useRouter();
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const tabs: {
    id: SunnahTab;
    labelAr: string;
    labelEn: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    {
      id: 'hadiths',
      labelAr: 'الأحاديث',
      labelEn: 'Hadiths',
      icon: 'book',
      color: '#B45309',
    },
    {
      id: 'habits',
      labelAr: 'السنن',
      labelEn: 'Daily Habits',
      icon: 'sparkles',
      color: '#059669',
    },
    {
      id: 'adhkar',
      labelAr: 'الأذكار',
      labelEn: 'Adhkar',
      icon: 'sunny',
      color: '#D97706',
    },
    {
      id: 'duas',
      labelAr: 'الأدعية',
      labelEn: 'Duas',
      icon: 'heart',
      color: '#E11D48',
    },
    {
      id: 'cards',
      labelAr: 'البطاقات',
      labelEn: 'Cards',
      icon: 'albums',
      color: '#7C3AED',
    },
    {
      id: 'tasbih',
      labelAr: 'المسبحة',
      labelEn: 'Tasbih',
      icon: 'finger-print',
      color: '#0D9488',
    },
  ];

  const handlePressTab = (tab: SunnahTab) => {
    if (activeTab === tab) return;
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    // Sibling tab switching using replace to prevent navigation loop traps
    if (tab === 'hadiths') {
      router.replace('/sunnah');
    } else if (tab === 'habits') {
      router.replace({ pathname: '/sunnah', params: { tab: 'habits' } });
    } else if (tab === 'adhkar') {
      router.replace('/sunnah/adhkar');
    } else if (tab === 'duas') {
      router.replace('/sunnah/duas');
    } else if (tab === 'cards') {
      router.replace('/sunnah/cards');
    } else if (tab === 'tasbih') {
      router.replace('/sunnah/tasbih');
    }
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Hero Visual Banner with Integrated 6-Tabs Switcher */}
      <View style={styles.heroBannerContainer}>
        <Image
          source={SUNNAH_PATH_IMG}
          style={styles.heroBannerImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(180, 83, 9, 0.90)', 'rgba(217, 119, 6, 0.95)']}
          style={styles.heroBannerOverlay}
        >
          {/* Top Title & 3D Badge Row */}
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

          {/* Integrated Horizontal Scrollable Tabs Switcher */}
          <View style={styles.tabsWrapper}>
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
                    style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                    onPress={() => handlePressTab(tab.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={tab.icon}
                      size={18}
                      color={isActive ? tab.color : '#FFFFFF'}
                      style={styles.tabIcon}
                    />
                    <Text
                      style={[
                        styles.tabBtnText,
                        isActive && [styles.tabBtnTextActive, { color: tab.color }],
                      ]}
                      numberOfLines={1}
                    >
                      {tab.id === 'hadiths' ? (t.tabHadiths || (isAr ? tab.labelAr : tab.labelEn))
                        : tab.id === 'habits' ? (t.tabDailyHabits || (isAr ? tab.labelAr : tab.labelEn))
                        : tab.id === 'adhkar' ? (t.tabAdhkar || (isAr ? tab.labelAr : tab.labelEn))
                        : tab.id === 'duas' ? (t.tabDuas || (isAr ? tab.labelAr : tab.labelEn))
                        : tab.id === 'cards' ? (t.tabCards || (isAr ? tab.labelAr : tab.labelEn))
                        : (t.tabTasbih || (isAr ? tab.labelAr : tab.labelEn))}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </LinearGradient>
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
    marginBottom: SPACING.xs,
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
    padding: SPACING.md,
  },
  heroTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.sm,
  },
  hero3dBadgeBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 2,
    lineHeight: 17,
  },
  tabsWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: RADIUS.lg,
    padding: 4,
  },
  tabsScrollContent: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  tabBtn: {
    minWidth: 66,
    minHeight: 52,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.medium,
  },
  tabIcon: {
    marginBottom: 3,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tabBtnTextActive: {
    fontWeight: '900',
  },
});

// AppBottomNav — 5 task-based tabs per PRD §5 (NAV-1)
// Home · Quran · My Prayer · Discover · Me
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Language, isRTL } from '@/constants/i18n';
import { SHADOWS, COLORS } from '@/constants/theme';

// 3D Pixar-style visual assets for bottom navigation menu
const TAB_IMAGES: Record<string, any> = {
  home: require('../../assets/images/nav-home-3d.jpg'),
  quran: require('../../assets/images/nav-quran-3d.jpg'),
  prayer: require('../../assets/images/salah-takbeer-3d.jpg'),
  discover: require('../../assets/images/nav-prophets-3d.jpg'),
  me: require('../../assets/images/nav-rewards-3d.jpg'),
};

// Multilingual labels for each of the 5 tabs
const NAV_TAB_LABELS: Record<string, Record<Language, string>> = {
  home: {
    ar: 'الرَّئِيسِيَّةُ',
    en: 'Home',
    fr: 'Accueil',
    de: 'Start',
    es: 'Inicio',
    ru: 'Главная',
    ur: 'ہوم',
    id: 'Beranda',
    bn: 'হোম',
    tr: 'Ana Sayfa',
  },
  quran: {
    ar: 'الْقُرْآنُ',
    en: 'Quran',
    fr: 'Coran',
    de: 'Koran',
    es: 'Corán',
    ru: 'Коран',
    ur: 'قرآن',
    id: 'Al-Quran',
    bn: 'কুরআন',
    tr: 'Kuran',
  },
  prayer: {
    ar: 'صَلَاتِي',
    en: 'My Prayer',
    fr: 'Ma Prière',
    de: 'Mein Gebet',
    es: 'Mi Oración',
    ru: 'Молитва',
    ur: 'میری نماز',
    id: 'Salatku',
    bn: 'আমার সালাত',
    tr: 'Namazım',
  },
  discover: {
    ar: 'اِكْتَشِفْ',
    en: 'Discover',
    fr: 'Découvrir',
    de: 'Entdecken',
    es: 'Explorar',
    ru: 'Изучить',
    ur: 'دریافت',
    id: 'Temukan',
    bn: 'আবিষ্কার',
    tr: 'Keşfet',
  },
  me: {
    ar: 'أَنَا',
    en: 'Me',
    fr: 'Moi',
    de: 'Ich',
    es: 'Yo',
    ru: 'Я',
    ur: 'میں',
    id: 'Aku',
    bn: 'আমি',
    tr: 'Ben',
  },
};

// Tab color accents
const TAB_COLORS: Record<string, string> = {
  home: COLORS.gardenGreen,
  quran: '#059669',
  prayer: '#0284C7',
  discover: '#7C3AED',
  me: '#D97706',
};

export default function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { language } = useAppStore();

  const isHomeActive = pathname === '/';
  const isQuranActive = pathname.startsWith('/quran');
  // Prayer tab: prayer hub, wudu, salah, arkan, adhkar, tasbih screens
  const isPrayerActive =
    pathname.startsWith('/prayer') ||
    pathname.startsWith('/arkan') ||
    pathname.startsWith('/wudu') ||
    pathname.startsWith('/sunnah/adhkar') ||
    pathname.startsWith('/sunnah/tasbih');
  // Discover: discover hub, prophets, companions, seerah, manners, asma-allah, tafakkur, nations, animals, sunnah
  const isDiscoverActive =
    pathname.startsWith('/discover') ||
    pathname.startsWith('/prophets') ||
    pathname.startsWith('/companions') ||
    pathname.startsWith('/seerah') ||
    pathname.startsWith('/manners') ||
    pathname.startsWith('/asma-allah') ||
    pathname.startsWith('/tafakkur') ||
    pathname.startsWith('/nations') ||
    pathname.startsWith('/animals') ||
    (pathname.startsWith('/sunnah') && !pathname.startsWith('/sunnah/adhkar') && !pathname.startsWith('/sunnah/tasbih'));
  // Me: me hub, profile, progress, rewards, parents
  const isMeActive =
    pathname.startsWith('/me') ||
    pathname.startsWith('/rewards') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/parents') ||
    pathname.startsWith('/profile');

  const tabs = [
    {
      id: 'home',
      route: '/',
      isActive: isHomeActive,
    },
    {
      id: 'quran',
      route: '/quran',
      isActive: isQuranActive,
    },
    {
      id: 'prayer',
      route: '/prayer',
      isActive: isPrayerActive,
    },
    {
      id: 'discover',
      route: '/discover',
      isActive: isDiscoverActive,
    },
    {
      id: 'me',
      route: '/me',
      isActive: isMeActive,
    },
  ];

  return (
    <View
      style={styles.navWrapper}
      role="navigation"
      aria-label={language === 'ar' ? 'شريط التنقل الرئيسي' : 'Main Navigation'}
    >
      <View
        style={styles.container}
        role="tablist"
      >
        {tabs.map((tab) => {
          const color = TAB_COLORS[tab.id] || COLORS.gardenGreen;
          const imageSrc = TAB_IMAGES[tab.id];
          const label = NAV_TAB_LABELS[tab.id]?.[language] || tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => {
                if (pathname !== tab.route) {
                  router.push(tab.route as any);
                }
              }}
              activeOpacity={0.75}
              accessibilityLabel={label}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab.isActive }}
            >
              {/* Active indicator bar at top */}
              {tab.isActive && (
                <View style={[styles.activeBar, { backgroundColor: color }]} />
              )}

              {/* 3D Visual Icon Badge */}
              <View
                style={[
                  styles.iconBadge,
                  tab.isActive
                    ? [styles.iconBadgeActive, { borderColor: color }]
                    : null,
                ]}
              >
                {imageSrc ? (
                  <Image
                    source={imageSrc}
                    style={[
                      styles.tabImage,
                      { opacity: tab.isActive ? 1 : 0.72 },
                    ]}
                    resizeMode="cover"
                  />
                ) : null}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.tabLabel,
                  tab.isActive && { color, fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8D9BF',
    ...SHADOWS.soft,
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 56, // PRD: 56dp touch target for ages 4-9
    paddingTop: 2,
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 2,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 2,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconBadgeActive: {
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    ...SHADOWS.soft,
  },
  tabImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

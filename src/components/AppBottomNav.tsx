// AppBottomNav — 5 task-based tabs with Rawda Kids final UI navigation assets
// Home · Quran · My Prayer · Discover · Me
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { useAppStore } from '@/store/useAppStore';
import { Language } from '@/constants/i18n';
import { SHADOWS } from '@/constants/theme';
import { UI_NAV, getNavAvatarAsset } from '@/constants/uiAssets';

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

export default function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const insets = useSafeAreaInsets();
  const { language, profiles, activeProfileId } = useAppStore();

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const avatarStr = activeProfile?.avatar || '';
  const isGirl = Boolean(
    activeProfile?.gender === 'female' ||
    avatarStr.includes('girl') ||
    avatarStr.includes('female') ||
    avatarStr.includes('zahra') ||
    avatarStr.includes('maryam') ||
    avatarStr === '👧' ||
    avatarStr === '🧕' ||
    avatarStr === '🌸'
  );

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
    (pathname.startsWith('/sunnah') &&
      !pathname.startsWith('/sunnah/adhkar') &&
      !pathname.startsWith('/sunnah/tasbih'));
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
      image: UI_NAV.home,
      isActive: isHomeActive,
    },
    {
      id: 'quran',
      route: '/quran',
      image: UI_NAV.quran,
      isActive: isQuranActive,
    },
    {
      id: 'prayer',
      route: '/prayer',
      image: UI_NAV.stories,
      isActive: isPrayerActive,
    },
    {
      id: 'discover',
      route: '/discover',
      image: UI_NAV.discover,
      isActive: isDiscoverActive,
    },
    {
      id: 'me',
      route: '/me',
      image: getNavAvatarAsset(isGirl ? 'girl' : 'boy'),
      isActive: isMeActive,
    },
  ];

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 8);

  return (
    <View
      style={styles.navWrapper}
      role="navigation"
      aria-label={language === 'ar' ? 'شريط التنقل الرئيسي' : 'Main Navigation'}
    >
      <View
        style={[styles.container, { paddingBottom: bottomPadding }]}
        role="tablist"
      >
        {tabs.map((tab) => {
          const label = NAV_TAB_LABELS[tab.id]?.[language] || tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                tab.isActive && styles.tabButtonActive,
              ]}
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
              {/* Slim green active indicator at the very top of the tab */}
              {tab.isActive && <View style={styles.activeBar} />}

              {/* Navigation Icon */}
              <View style={styles.iconWrap}>
                <ExpoImage
                  source={tab.image}
                  style={styles.tabImage}
                  contentFit="contain"
                  accessible={false}
                />
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.tabLabel,
                  tab.isActive && styles.tabLabelActive,
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
    paddingTop: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // PRD: min 56dp touch target for children
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 20,
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: '#D1FAE5', // Active tab pill background
  },
  activeBar: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#059669', // Slim green top indicator
    borderRadius: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabImage: {
    width: 38,
    height: 38,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: '#064E3B',
    fontWeight: '900',
  },
});

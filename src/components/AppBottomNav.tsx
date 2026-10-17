import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, usePathname } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Language, isRTL } from '@/constants/i18n';
import { SHADOWS } from '@/constants/theme';

const NAV_HOME_IMG = require('../../assets/images/nav-home-3d.jpg');
const NAV_QURAN_IMG = require('../../assets/images/nav-quran-3d.jpg');
const NAV_SUNNAH_IMG = require('../../assets/images/nav-sunnah-3d.jpg');
const NAV_PROPHETS_IMG = require('../../assets/images/nav-prophets-3d.jpg');
const NAV_MANNERS_IMG = require('../../assets/images/nav-manners-3d.jpg');
const NAV_REWARDS_IMG = require('../../assets/images/nav-rewards-3d.jpg');

const NAV_TAB_LABELS: Record<string, Record<Language, string>> = {
  home: {
    ar: 'الرئيسية',
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
    ar: 'القرآن',
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
  sunnah: {
    ar: 'السنّة',
    en: 'Sunnah',
    fr: 'Sunnah',
    de: 'Sunnah',
    es: 'Sunna',
    ru: 'Сунна',
    ur: 'سنت',
    id: 'Sunnah',
    bn: 'সুন্নাহ',
    tr: 'Sünnet',
  },
  prophets: {
    ar: 'الأنبياء',
    en: 'Stories',
    fr: 'Histoires',
    de: 'Geschichten',
    es: 'Historias',
    ru: 'Истории',
    ur: 'کہانیاں',
    id: 'Kisah',
    bn: 'গল্পমালা',
    tr: 'Hikayeler',
  },
  manners: {
    ar: 'الأخلاق',
    en: 'Manners',
    fr: 'Manières',
    de: 'Manieren',
    es: 'Modales',
    ru: 'Нравы',
    ur: 'اخلاق',
    id: 'Akhlak',
    bn: 'আচরণ',
    tr: 'Ahlak',
  },
  rewards: {
    ar: 'الكنوز',
    en: 'Treasures',
    fr: 'Trésors',
    de: 'Schätze',
    es: 'Tesoros',
    ru: 'Сокровища',
    ur: 'خزانے',
    id: 'Hadiah',
    bn: 'পুরস্কার',
    tr: 'Ödüller',
  },
};

export default function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { language } = useAppStore();
  const isAr = language === 'ar';

  const isHomeActive = pathname === '/';
  const isQuranActive = pathname.startsWith('/quran');
  const isSunnahActive = pathname.startsWith('/sunnah');
  const isProphetsActive = pathname.startsWith('/prophets');
  const isMannersActive = pathname.startsWith('/manners');
  const isRewardsActive = pathname.startsWith('/rewards') || pathname.startsWith('/progress');

  const tabs = [
    {
      id: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      image: NAV_HOME_IMG,
      route: '/',
      isActive: isHomeActive,
      color: '#16A34A',
      activeBg: '#DCFCE7',
      borderColor: '#86EFAC',
    },
    {
      id: 'quran',
      labelAr: 'القرآن',
      labelEn: 'Quran',
      image: NAV_QURAN_IMG,
      route: '/quran',
      isActive: isQuranActive,
      color: '#0D9488',
      activeBg: '#CCFBF1',
      borderColor: '#5EEAD4',
    },
    {
      id: 'sunnah',
      labelAr: 'السنّة',
      labelEn: 'Sunnah',
      image: NAV_SUNNAH_IMG,
      route: '/sunnah',
      isActive: isSunnahActive,
      color: '#D97706',
      activeBg: '#FEF3C7',
      borderColor: '#FDE68A',
    },
    {
      id: 'prophets',
      labelAr: 'الأنبياء',
      labelEn: 'Stories',
      image: NAV_PROPHETS_IMG,
      route: '/prophets',
      isActive: isProphetsActive,
      color: '#7C3AED',
      activeBg: '#EDE9FE',
      borderColor: '#DDD6FE',
    },
    {
      id: 'manners',
      labelAr: 'الأخلاق',
      labelEn: 'Manners',
      image: NAV_MANNERS_IMG,
      route: '/manners',
      isActive: isMannersActive,
      color: '#0284C7',
      activeBg: '#E0F2FE',
      borderColor: '#BAE6FD',
    },
    {
      id: 'rewards',
      labelAr: 'الكنوز',
      labelEn: 'Treasures',
      image: NAV_REWARDS_IMG,
      route: '/rewards',
      isActive: isRewardsActive,
      color: '#E11D48',
      activeBg: '#FFE4E6',
      borderColor: '#FECDD3',
    },
  ];

  return (
    <View style={styles.navWrapper}>
      <View
        style={[
          styles.container,
          { flexDirection: isRTL(language) ? 'row-reverse' : 'row' },
        ]}
      >
        {tabs.map((tab) => {
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
            >
              <View
                style={[
                  styles.iconBadge,
                  tab.isActive && {
                    borderColor: tab.color,
                    borderWidth: 2,
                    backgroundColor: tab.activeBg,
                    transform: [{ scale: 1.1 }],
                  },
                ]}
              >
                <Image
                  source={tab.image}
                  style={styles.tabImage}
                  contentFit="cover"
                  transition={150}
                />
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  tab.isActive && { color: tab.color, fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {NAV_TAB_LABELS[tab.id]?.[language] || tab.labelEn}
              </Text>

              {tab.isActive && (
                <View style={[styles.activeDot, { backgroundColor: tab.color }]} />
              )}
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
    borderTopColor: '#E5E7EB',
    ...SHADOWS.soft,
    zIndex: 999,
  },
  container: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === 'ios' ? 22 : 6,
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    minHeight: 52,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabImage: {
    width: '100%',
    height: '100%',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});

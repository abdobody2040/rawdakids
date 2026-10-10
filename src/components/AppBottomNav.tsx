import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { SHADOWS } from '@/constants/theme';

const NAV_HOME_IMG = require('../../assets/images/nav-home-3d.jpg');
const NAV_QURAN_IMG = require('../../assets/images/nav-quran-3d.jpg');
const NAV_SUNNAH_IMG = require('../../assets/images/nav-sunnah-3d.jpg');
const NAV_PROPHETS_IMG = require('../../assets/images/nav-prophets-3d.jpg');
const NAV_MANNERS_IMG = require('../../assets/images/nav-manners-3d.jpg');
const NAV_REWARDS_IMG = require('../../assets/images/nav-rewards-3d.jpg');

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
      color: '#1a7550',
      activeBg: '#e8f7ee',
      borderColor: '#bbf0d0',
    },
    {
      id: 'quran',
      labelAr: 'القرآن',
      labelEn: 'Quran',
      image: NAV_QURAN_IMG,
      route: '/quran',
      isActive: isQuranActive,
      color: '#0d9488',
      activeBg: '#e2f8f6',
      borderColor: '#a7f3d0',
    },
    {
      id: 'sunnah',
      labelAr: 'السنّة',
      labelEn: 'Sunnah',
      image: NAV_SUNNAH_IMG,
      route: '/sunnah',
      isActive: isSunnahActive,
      color: '#d97706',
      activeBg: '#fef3c7',
      borderColor: '#fde68a',
    },
    {
      id: 'prophets',
      labelAr: 'الأنبياء',
      labelEn: 'Stories',
      image: NAV_PROPHETS_IMG,
      route: '/prophets',
      isActive: isProphetsActive,
      color: '#7c3aed',
      activeBg: '#ede9fe',
      borderColor: '#ddd6fe',
    },
    {
      id: 'manners',
      labelAr: 'الأخلاق',
      labelEn: 'Manners',
      image: NAV_MANNERS_IMG,
      route: '/manners',
      isActive: isMannersActive,
      color: '#0284c7',
      activeBg: '#e0f2fe',
      borderColor: '#bae6fd',
    },
    {
      id: 'rewards',
      labelAr: 'الكنوز',
      labelEn: 'Treasures',
      image: NAV_REWARDS_IMG,
      route: '/rewards',
      isActive: isRewardsActive,
      color: '#e11d48',
      activeBg: '#ffe4e6',
      borderColor: '#fecdd3',
    },
  ];

  return (
    <View style={styles.navWrapper}>
      <View
        style={[
          styles.container,
          { flexDirection: isAr ? 'row-reverse' : 'row' },
        ]}
      >
        {tabs.map((tab) => {
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                tab.isActive && {
                  backgroundColor: tab.activeBg,
                  borderColor: tab.borderColor,
                  borderWidth: 1.5,
                },
              ]}
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
                  tab.isActive && styles.iconBadgeActive,
                ]}
              >
                <Image source={tab.image} style={styles.tabImage} resizeMode="cover" />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  tab.isActive && { color: tab.color, fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {isAr ? tab.labelAr : tab.labelEn}
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1.5,
    borderTopColor: '#ebe7dc',
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
    paddingHorizontal: 6,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    backgroundColor: '#ffffff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 16,
    marginHorizontal: 1,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 2,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f6f3eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeActive: {
    transform: [{ scale: 1.08 }],
    ...SHADOWS.soft,
  },
  tabImage: {
    width: '100%',
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#768780',
    textAlign: 'center',
    marginTop: 1,
  },
});

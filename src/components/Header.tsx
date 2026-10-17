import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { AVAILABLE_LANGUAGES } from '@/constants/i18n';
import ParentGateModal from './ParentGateModal';
import SmartSearchModal from './SmartSearchModal';
import ChildProfileSwitchModal from './ChildProfileSwitchModal';
import LanguageSelectModal from './LanguageSelectModal';

const ICON_STAR_IMG = require('../../assets/images/icon-star-3d.jpg');
const ICON_GEM_IMG = require('../../assets/images/icon-gem-3d.jpg');
const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  fallbackRoute?: string;
  onBack?: () => void;
  showSearch?: boolean;
}

export default function Header({
  showBack = false,
  title,
  fallbackRoute,
  onBack,
  showSearch = true,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    stars,
    gems,
    streakCount,
    profiles,
    activeProfileId,
  } = useAppStore();

  const [parentGateVisible, setParentGateVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [profileSwitcherVisible, setProfileSwitcherVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const onParentGateSuccess = () => {
    setParentGateVisible(false);
    router.push('/parents');
  };

  const getComputedFallback = (): string => {
    if (fallbackRoute) return fallbackRoute;
    if (!pathname) return '/';
    if (pathname.startsWith('/quran/')) return '/quran';
    if (pathname === '/quran') return '/';
    if (pathname.startsWith('/sunnah/')) return '/sunnah';
    if (pathname === '/sunnah') return '/';
    if (pathname.startsWith('/prophets/')) return '/prophets';
    if (pathname === '/prophets') return '/';
    if (pathname.startsWith('/manners/')) return '/manners';
    if (pathname === '/manners') return '/';
    if (pathname.startsWith('/arkan/')) return '/arkan';
    if (pathname === '/arkan') return '/';
    return '/';
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const target = getComputedFallback();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(target as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name={language === 'ar' ? 'chevron-forward' : 'chevron-back'}
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => setProfileSwitcherVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.headerMascotBox}>
              <Image source={MASCOT_NOOR_IMG} style={styles.headerMascotBadge} contentFit="cover" transition={150} />
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
              {activeProfile?.name || 'البطل'}
            </Text>
            <Ionicons name="swap-horizontal" size={12} color="#059669" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        )}

        {title ? (
          <Text style={styles.screenTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightRow}>
        {/* Streak */}
        <View style={styles.statChip}>
          <Ionicons name="flame" size={15} color={COLORS.streak} />
          <Text style={styles.statText}>{streakCount}</Text>
        </View>

        {/* Stars */}
        <TouchableOpacity
          style={styles.statChip}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.7}
        >
          <Image source={ICON_STAR_IMG} style={styles.headerChipImg} contentFit="contain" transition={150} />
          <Text style={styles.statText}>{stars}</Text>
        </TouchableOpacity>

        {/* Gems */}
        <TouchableOpacity
          style={styles.statChip}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.7}
        >
          <Image source={ICON_GEM_IMG} style={styles.headerChipImg} contentFit="contain" transition={150} />
          <Text style={styles.statText}>{gems}</Text>
        </TouchableOpacity>

        {/* Quick Smart Search Button */}
        {showSearch && (
          <TouchableOpacity
            style={styles.searchHeaderBtn}
            onPress={() => setSearchModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={16} color="#059669" />
          </TouchableOpacity>
        )}

        {/* Multilingual Selector & Parent Lock (only on screens without back navigation) */}
        {!showBack && (
          <>
            <TouchableOpacity
              style={styles.langSelectorBtn}
              onPress={() => setLanguageModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.langSelectorFlag}>
                {AVAILABLE_LANGUAGES.find((l) => l.code === language)?.flagEmoji || '🇸🇦'}
              </Text>
              <Text style={styles.langSelectorCode}>
                {language.toUpperCase()}
              </Text>
              <Ionicons name="chevron-down" size={11} color="#267960" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.parentLockButton}
              onPress={() => setParentGateVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <LanguageSelectModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />

      <ParentGateModal
        visible={parentGateVisible}
        onClose={() => setParentGateVisible(false)}
        onSuccess={onParentGateSuccess}
      />

      <SmartSearchModal
        visible={searchModalVisible}
        onDismiss={() => setSearchModalVisible(false)}
      />

      <ChildProfileSwitchModal
        visible={profileSwitcherVisible}
        onClose={() => setProfileSwitcherVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    ...SHADOWS.soft,
    zIndex: 10,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  headerMascotBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffc14d',
  },
  headerMascotBadge: {
    width: '100%',
    height: '100%',
  },
  headerChipImg: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    maxWidth: 70,
  },
  screenTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginLeft: 4,
    flexShrink: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  statText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langSelectorFlag: {
    fontSize: 13,
  },
  langSelectorCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  parentLockButton: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHeaderBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

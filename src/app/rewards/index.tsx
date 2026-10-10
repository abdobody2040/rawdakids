// Rewards Room (Section 5.5 - غرفة المكافآت)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { contentService } from '@/services/contentService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import AppBottomNav from '@/components/AppBottomNav';
import KidAvatar, { getAvatarDisplayName } from '@/components/KidAvatar';

const ICON_STAR_IMG = require('../../../assets/images/icon-star-3d.jpg');
const ICON_GEM_IMG = require('../../../assets/images/icon-gem-3d.jpg');

const STICKER_IMAGES: Record<string, any> = {
  'st-kaaba': require('../../../assets/images/sticker-kaaba.jpg'),
  'st-quran': require('../../../assets/images/sticker-quran.jpg'),
  'st-crescent': require('../../../assets/images/sticker-crescent.jpg'),
  'st-lantern': require('../../../assets/images/sticker-lantern.jpg'),
  'st-ark': require('../../../assets/images/sticker-ark.jpg'),
  'st-dates': require('../../../assets/images/sticker-dates.jpg'),
  'st-camel': require('../../../assets/images/sticker-camel.jpg'),
  'st-star': require('../../../assets/images/icon-star-3d.jpg'),
};

export default function RewardsRoomScreen() {
  const {
    language,
    profiles,
    activeProfileId,
    stars,
    gems,
    unlockedBadges,
    unlockedStickers,
    unlockSticker,
    addGems,
    selectedAvatarId,
    setSelectedAvatarId,
  } = useAppStore();

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'badges' | 'stickers' | 'avatars'>('badges');
  const [showCelebration, setShowCelebration] = useState(false);

  const badges = contentService.getBadges();
  const stickers = contentService.getStickers();
  const avatars = contentService.getAvatars();

  const handleUnlockAvatar = (avatar: any) => {
    if (selectedAvatarId === avatar.id) return;
    if (avatar.gemCost === 0) {
      setSelectedAvatarId(avatar.id);
      setShowCelebration(true);
      return;
    }
    if (gems >= avatar.gemCost) {
      addGems(-avatar.gemCost);
      setSelectedAvatarId(avatar.id);
      setShowCelebration(true);
    }
  };

  const handleUnlockSticker = (sticker: any) => {
    const isUnlocked = sticker.unlockedByDefault || unlockedStickers.includes(sticker.id);
    if (isUnlocked) return;
    const cost = 10;
    if (gems >= cost) {
      addGems(-cost);
      unlockSticker(sticker.id);
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <Header showBack title={t.rewards} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <LinearGradient
          colors={['#EC4899', '#F43F5E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceBanner}
        >
          <Text style={styles.balanceTitle}>{t.rewards}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Image source={ICON_STAR_IMG} style={styles.statIconImg} resizeMode="contain" />
              <Text style={styles.statValue}>{stars}</Text>
              <Text style={styles.statLabel}>{t.stars}</Text>
            </View>

            <View style={styles.statPill}>
              <Image source={ICON_GEM_IMG} style={styles.statIconImg} resizeMode="contain" />
              <Text style={styles.statValue}>{gems}</Text>
              <Text style={styles.statLabel}>{t.gems}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 3 Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'badges' && styles.tabBtnActive]}
            onPress={() => setActiveTab('badges')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'badges' && styles.tabBtnTextActive,
              ]}
            >
              {t.badges}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'stickers' && styles.tabBtnActive]}
            onPress={() => setActiveTab('stickers')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'stickers' && styles.tabBtnTextActive,
              ]}
            >
              {t.stickers}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'avatars' && styles.tabBtnActive]}
            onPress={() => setActiveTab('avatars')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'avatars' && styles.tabBtnTextActive,
              ]}
            >
              {t.avatars}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <View style={styles.grid}>
            {badges.map((b) => {
              const isUnlocked = unlockedBadges.includes(b.id);

              return (
                <View
                  key={b.id}
                  style={[styles.badgeCard, !isUnlocked && styles.cardLocked]}
                >
                  <View
                    style={[
                      styles.badgeIconCircle,
                      { backgroundColor: isUnlocked ? b.color : COLORS.border },
                    ]}
                  >
                    <Ionicons
                      name={(b.iconName as any) || 'star'}
                      size={28}
                      color={COLORS.textLight}
                    />
                  </View>

                  <Text style={styles.badgeName}>
                    {language === 'ar' ? b.nameAr : b.nameEn}
                  </Text>
                  <Text style={styles.badgeDesc}>
                    {language === 'ar' ? b.descAr : b.descEn}
                  </Text>

                  <View
                    style={[
                      styles.statusPill,
                      isUnlocked ? styles.statusPillUnlocked : styles.statusPillLocked,
                    ]}
                  >
                    <Text style={styles.statusPillText}>
                      {isUnlocked ? t.earned : `يحتاج ${b.requiredGems} جوهرة`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* STICKERS TAB (ملصقاتي) */}
        {activeTab === 'stickers' && (
          <View>
            <View style={styles.tabIntroBanner}>
              <View style={styles.tabIntroRow}>
                <Ionicons name="sparkles" size={20} color="#D97706" />
                <Text style={styles.tabIntroTitle}>
                  {language === 'ar' ? 'ألبوم ملصقات الأبطال' : 'Heroes Sticker Album'}
                </Text>
              </View>
              <Text style={styles.tabIntroSubtitle}>
                {language === 'ar'
                  ? `جمّع ملصقاتك الإسلامية المجسمة (${stickers.filter((s) => s.unlockedByDefault || unlockedStickers.includes(s.id)).length} من ${stickers.length} ملصقات)`
                  : `Collect your 3D Islamic stickers (${stickers.filter((s) => s.unlockedByDefault || unlockedStickers.includes(s.id)).length} of ${stickers.length} collected)`}
              </Text>
            </View>

            <View style={styles.stickersGrid}>
              {stickers.map((st) => {
                const isUnlocked =
                  st.unlockedByDefault || unlockedStickers.includes(st.id);
                const stickerImg = STICKER_IMAGES[st.id] || STICKER_IMAGES['st-star'];

                return (
                  <TouchableOpacity
                    key={st.id}
                    style={[styles.stickerCard, !isUnlocked && styles.stickerCardLocked]}
                    onPress={() => handleUnlockSticker(st)}
                    activeOpacity={isUnlocked ? 1 : 0.8}
                  >
                    <View style={styles.stickerImgWrap}>
                      <Image
                        source={stickerImg}
                        style={[styles.stickerImage, !isUnlocked && styles.stickerImageLocked]}
                        resizeMode="contain"
                      />
                      {!isUnlocked && (
                        <View style={styles.lockOverlay}>
                          <Ionicons name="lock-closed" size={24} color="#ffffff" />
                        </View>
                      )}
                    </View>

                    <Text style={styles.stickerName}>
                      {language === 'ar' ? st.nameAr : st.nameEn}
                    </Text>

                    {isUnlocked ? (
                      <View style={styles.stickerOwnedBadge}>
                        <Ionicons name="checkmark-circle" size={13} color="#059669" />
                        <Text style={styles.stickerOwnedText}>
                          {language === 'ar' ? 'في ألبومك' : 'Collected'}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.stickerUnlockBtn}>
                        <Image source={ICON_GEM_IMG} style={{ width: 14, height: 14 }} resizeMode="contain" />
                        <Text style={styles.stickerUnlockText}>10 {t.gems}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* AVATARS TAB (شخصياتي) */}
        {activeTab === 'avatars' && (
          <View>
            <View style={styles.tabIntroBanner}>
              <View style={styles.tabIntroRow}>
                <Ionicons name="happy" size={20} color="#0D9488" />
                <Text style={styles.tabIntroTitle}>
                  {language === 'ar' ? 'اختر شخصيتك الكرتونية المفضلة' : 'Choose Your 3D Character'}
                </Text>
              </View>
              <Text style={styles.tabIntroSubtitle}>
                {language === 'ar'
                  ? 'سترافقك هذه الشخصية في كل رحلاتك ومغامراتك في التطبيق!'
                  : 'This character will accompany you in all your journeys and adventures!'}
              </Text>
            </View>

            <View style={styles.avatarsGrid}>
              {avatars.map((av) => {
                const isSelected = selectedAvatarId === av.id;

                return (
                  <TouchableOpacity
                    key={av.id}
                    style={[
                      styles.avatarCard,
                      isSelected && styles.avatarCardSelected,
                    ]}
                    onPress={() => handleUnlockAvatar(av)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.avatarImgWrap}>
                      <KidAvatar
                        avatar={av.id}
                        size={84}
                        borderWidth={isSelected ? 3 : 1}
                        borderColor={isSelected ? COLORS.primary : '#E2E8F0'}
                      />
                    </View>

                    <Text style={styles.avatarName}>
                      {getAvatarDisplayName(av.id, activeProfile?.name, language)}
                    </Text>

                    {isSelected ? (
                      <View style={styles.selectedPill}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={COLORS.textLight}
                        />
                        <Text style={styles.selectedPillText}>
                          {language === 'ar' ? 'مختار حالياً' : 'Active'}
                        </Text>
                      </View>
                    ) : av.gemCost > 0 ? (
                      <View style={styles.costRow}>
                        <Image source={ICON_GEM_IMG} style={{ width: 14, height: 14 }} resizeMode="contain" />
                        <Text style={styles.costText}>{av.gemCost}</Text>
                        <Text style={styles.costLabel}>
                          {language === 'ar' ? 'جوهرة' : 'gems'}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.selectBtn}>
                        <Text style={styles.selectBtnText}>
                          {language === 'ar' ? 'اختيار' : 'Select'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <AppBottomNav />
      </View>

      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={1}
        gemsEarned={0}
        title={t.congratulations}
        subtitle={
          language === 'ar'
            ? 'تم تحديث مظهر شخصيتك بنجاح!'
            : 'Avatar appearance updated!'
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  balanceBanner: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  statIconImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: 3,
    marginBottom: SPACING.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.soft,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.text,
  },
  grid: {
    gap: SPACING.sm,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
    ...SHADOWS.soft,
  },
  cardLocked: {
    opacity: 0.6,
  },
  badgeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  badgeDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusPillUnlocked: {
    backgroundColor: COLORS.successLight,
  },
  statusPillLocked: {
    backgroundColor: COLORS.cardAlt,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  tabIntroBanner: {
    backgroundColor: '#fffbeb',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  tabIntroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tabIntroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  tabIntroSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  stickerCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  stickerCardLocked: {
    opacity: 0.85,
    backgroundColor: '#FAFAF9',
  },
  stickerImgWrap: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  stickerImage: {
    width: '100%',
    height: '100%',
  },
  stickerImageLocked: {
    opacity: 0.35,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  stickerOwnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  stickerOwnedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  stickerUnlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  stickerUnlockText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  avatarCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  avatarCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#ECFDF5',
  },
  avatarImgWrap: {
    marginBottom: SPACING.xs,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  costText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  costLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  selectBtn: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
});

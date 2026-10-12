// Star & Reward Celebration Modal
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';

interface StarRewardCelebrationProps {
  visible: boolean;
  starsEarned: number;
  gemsEarned: number;
  title?: string;
  subtitle?: string;
  onDismiss: () => void;
}

export default function StarRewardCelebration({
  visible,
  starsEarned,
  gemsEarned,
  title,
  subtitle,
  onDismiss,
}: StarRewardCelebrationProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.celebrationEmoji}>🎉</Text>

          <Text style={styles.title}>{title || t.congratulations}</Text>
          <Text style={styles.subtitle}>
            {subtitle || (language === 'ar' ? 'عمل رائع يرضي الله ويسعد والديك!' : 'Amazing work pleasing Allah!')}
          </Text>

          <View style={styles.rewardsRow}>
            {/* Stars */}
            <View style={styles.rewardPill}>
              <Ionicons name="star" size={24} color={COLORS.starActive} />
              <Text style={styles.rewardNumber}>+{starsEarned}</Text>
              <Text style={styles.rewardLabel}>{t.stars}</Text>
            </View>

            {/* Gems */}
            <View style={styles.rewardPill}>
              <FontAwesome5 name="gem" size={20} color={COLORS.gem} />
              <Text style={styles.rewardNumber}>+{gemsEarned}</Text>
              <Text style={styles.rewardLabel}>{t.gems}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={onDismiss} activeOpacity={0.8}>
            <Text style={styles.confirmBtnText}>{t.continue}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  rewardPill: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  rewardNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 4,
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    width: '100%',
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow(COLORS.primary),
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});

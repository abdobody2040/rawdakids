// src/components/parents/WeeklyChallengesCard.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { WeeklyChallenge } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { getUpgradeLabel, getLocalizedWeeklyChallenge } from '@/services/multilingualUpgradeService';

interface WeeklyChallengesCardProps {
  language: Language;
  weeklyChallenges: WeeklyChallenge[];
  confirmWeeklyChallenge: (id: string) => void;
}

export default function WeeklyChallengesCard({
  language,
  weeklyChallenges,
  confirmWeeklyChallenge,
}: WeeklyChallengesCardProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="shield-checkmark" size={20} color="#059669" />
        <Text style={styles.sectionTitle}>
          {getUpgradeLabel('realLifeMannersTitle', language)}
        </Text>
      </View>

      <Text style={styles.settingDesc}>
        {getUpgradeLabel('realLifeMannersDesc', language)}
      </Text>

      <View style={styles.challengesList}>
        {weeklyChallenges.map((c) => {
          const isConfirmed = c.confirmedByParent;
          const isChildDone = c.completedByChild;
          const loc = getLocalizedWeeklyChallenge(c, language);

          return (
            <View
              key={c.id}
              style={[
                styles.challengeCard,
                isConfirmed && styles.challengeCardConfirmed,
              ]}
            >
              <View style={styles.challengeTopRow}>
                <Text style={styles.challengeEmoji}>{c.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>
                    {loc.title}
                  </Text>
                  <Text style={styles.challengeDesc}>
                    {loc.desc}
                  </Text>
                </View>
                <View style={styles.challengeRewardBadge}>
                  <Text style={styles.challengeRewardText}>
                    +{c.gemReward} 💎
                  </Text>
                </View>
              </View>

              <View style={styles.challengeActionRow}>
                {isConfirmed ? (
                  <View style={styles.confirmedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.confirmedBadgeText}>
                      {language === 'ar' ? 'تم الاعتماد ومنح الجواهر ✓' : 'Approved & Rewarded ✓'}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.approveBtn,
                      isChildDone && styles.approveBtnHighlighted,
                    ]}
                    onPress={() => {
                      confirmWeeklyChallenge(c.id);
                      Alert.alert(
                        language === 'ar' ? 'تم الاعتماد بنجاح! 🎉' : 'Approved! 🎉',
                        language === 'ar'
                          ? `بارك الله في طفلك! تم منح +${c.gemReward} جواهر و +3 نجوم.`
                          : `Mabrook! Awarded +${c.gemReward} gems and +3 stars.`
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="sparkles"
                      size={15}
                      color={COLORS.textLight}
                    />
                    <Text style={styles.approveBtnText}>
                      {isChildDone
                        ? (language === 'ar'
                            ? `✨ مصادقة إنجاز البطل (+${c.gemReward} جواهر)`
                            : `✨ Verify Child’s Deed (+${c.gemReward} Gems)`)
                        : (language === 'ar'
                            ? `✓ اعتماد السلوك الطيب (+${c.gemReward} جواهر)`
                            : `✓ Confirm Good Deed (+${c.gemReward} Gems)`)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  challengesList: {
    gap: SPACING.sm,
  },
  challengeCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  challengeCardConfirmed: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  challengeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  challengeEmoji: {
    fontSize: 28,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  challengeDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  challengeRewardBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  challengeRewardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  challengeActionRow: {
    marginTop: 4,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  confirmedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  approveBtnHighlighted: {
    backgroundColor: '#059669',
    ...SHADOWS.glow('#059669'),
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});

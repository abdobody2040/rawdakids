// src/components/parents/ChildProgressReportsCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { ChildProfile, ChildProgressData } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import KidAvatar from '@/components/KidAvatar';

interface ChildProgressReportsCardProps {
  language: Language;
  t: {
    ageBandExplorers: string;
    ageBandLearners: string;
    ageBandMinds: string;
  };
  profiles: ChildProfile[];
  activeProfileId: string;
  setActiveProfile: (id: string) => void;
  getChildProgress: (id: string) => ChildProgressData;
}

export default function ChildProgressReportsCard({
  language,
  t,
  profiles,
  activeProfileId,
  setActiveProfile,
  getChildProgress,
}: ChildProgressReportsCardProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="stats-chart" size={20} color="#0284c7" />
        <Text style={styles.sectionTitle}>
          {language === 'ar'
            ? 'سجل إنجازات وتقدم الأطفال (مستقل لكل طفل على هذا الجهاز)'
            : 'Children Progress Reports (Independent per child)'}
        </Text>
      </View>

      <Text style={styles.settingDesc}>
        {language === 'ar'
          ? 'تُعرض هنا إنجازات كل طفل بشكل منفصل بناءً على البيانات المخزنة محلياً على هذا الجهاز فقط، دون مزامنة مع أي جهاز آخر.'
          : 'Each child’s progress is tracked independently and saved locally on this device only without cross-device sync.'}
      </Text>

      <View style={styles.childReportsList}>
        {profiles.map((p) => {
          const childProg = getChildProgress(p.id);
          const isActive = p.id === activeProfileId;
          const surahsCount = Object.values(childProg.surahProgress || {}).filter(
            (s) => s.isCompleted
          ).length;
          const hadithsCount = Object.values(childProg.hadithProgress || {}).filter(
            (h) => h.completed
          ).length;
          const storiesCount = Object.values(childProg.storyProgress || {}).filter(
            (st) => st.completed
          ).length;

          return (
            <View
              key={`report-${p.id}`}
              style={[
                styles.childReportCard,
                isActive && styles.childReportCardActive,
              ]}
            >
              <View style={styles.childReportHeader}>
                <KidAvatar avatar={p.avatar} size={46} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.childReportName}>{p.name}</Text>
                    {isActive && (
                      <View style={styles.activePillBadge}>
                        <Text style={styles.activePillText}>
                          {language === 'ar' ? 'الملف النشط' : 'Active'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.childReportAge}>
                    {p.ageBand === '4-6'
                      ? t.ageBandExplorers
                      : p.ageBand === '7-9'
                      ? t.ageBandLearners
                      : t.ageBandMinds}
                  </Text>
                </View>

                {!isActive && (
                  <TouchableOpacity
                    style={styles.switchChildBtn}
                    onPress={() => setActiveProfile(p.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.switchChildBtnText}>
                      {language === 'ar' ? 'تفعيل ↺' : 'Switch ↺'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Stats Grid */}
              <View style={styles.childStatsGrid}>
                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>⭐</Text>
                  <Text style={styles.childStatValue}>{childProg.stars}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'النجوم' : 'Stars'}
                  </Text>
                </View>

                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>💎</Text>
                  <Text style={styles.childStatValue}>{childProg.gems}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'الجواهر' : 'Gems'}
                  </Text>
                </View>

                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>🔥</Text>
                  <Text style={styles.childStatValue}>{childProg.streakCount}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'أيام متتالية' : 'Streak'}
                  </Text>
                </View>

                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>📖</Text>
                  <Text style={styles.childStatValue}>{surahsCount}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'سور مكتملة' : 'Surahs'}
                  </Text>
                </View>

                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>📜</Text>
                  <Text style={styles.childStatValue}>{hadithsCount}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'أحاديث' : 'Hadiths'}
                  </Text>
                </View>

                <View style={styles.childStatBox}>
                  <Text style={styles.childStatEmoji}>🕌</Text>
                  <Text style={styles.childStatValue}>{storiesCount}</Text>
                  <Text style={styles.childStatLabel}>
                    {language === 'ar' ? 'قصص الأنبياء' : 'Stories'}
                  </Text>
                </View>
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
  childReportsList: {
    gap: SPACING.md,
  },
  childReportCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  childReportCardActive: {
    borderColor: '#0284c7',
    backgroundColor: COLORS.card,
    ...SHADOWS.glow('#0284c7'),
  },
  childReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  childReportName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  childReportAge: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activePillBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switchChildBtn: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchChildBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284c7',
  },
  childStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  childStatBox: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  childStatEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  childStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  childStatLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
});

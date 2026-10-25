// Unit Path Screen for Wudu & Salah (B3)
// Visual path progression: Done (green check), Current (blue play), Locked (gray lock)
// Progress ring: role="img" aria-label="أَنْجَزْتَ N دُرُوسٍ مِنْ M"
// Certificate card at bottom unlocking client-side certificate

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import UnitCertificateModal from '@/components/UnitCertificateModal';
import {
  unitsService,
  PRAYER_UNITS,
  UnitProgressRecord,
} from '@/services/unitsService';

export default function UnitPathScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ unit?: string }>();
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    params.unit === 'salah_journey' ? 'salah_journey' : 'wudu_journey'
  );

  const { activeProfileId, profiles } = useAppStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const childId = activeProfile?.id || 'child_default';

  const [progress, setProgress] = useState<UnitProgressRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unitConfig = PRAYER_UNITS[selectedUnitId] || PRAYER_UNITS.wudu_journey;

  useEffect(() => {
    let isCurrent = true;

    unitsService
      .getUnitProgress(childId, selectedUnitId)
      .then((rec) => {
        if (isCurrent) {
          setProgress(rec);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [childId, selectedUnitId]);

  const showLockedNotice = () => {
    setToastMessage('أَكْمِلِ الدَّرْسَ السَّابِقَ لِفَتْحِ هَذَا الدَّرْسِ 🔒');
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLessonPress = (lesson: any, status: 'locked' | 'available' | 'done') => {
    if (status === 'locked') {
      showLockedNotice();
      return;
    }
    router.push(lesson.route as any);
  };

  const totalLessons = unitConfig.lessons.length;
  const doneCount = progress
    ? unitConfig.lessons.filter((l) => progress.lessons[l.id]?.status === 'done').length
    : 0;

  const percentComplete = Math.round((doneCount / totalLessons) * 100);
  const isCertificateUnlocked = Boolean(progress?.certificate?.unlockedAt);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={unitConfig.titleArabic}
          showBack
          fallbackRoute="/prayer"
        />

        {/* Unit Selector Tabs */}
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitTab,
              selectedUnitId === 'wudu_journey' && styles.unitTabActive,
            ]}
            onPress={() => setSelectedUnitId('wudu_journey')}
            accessibilityRole="tab"
            accessibilityLabel="رحلة الوضوء"
          >
            <Ionicons
              name="water"
              size={18}
              color={selectedUnitId === 'wudu_journey' ? '#FFFFFF' : '#0284C7'}
            />
            <Text
              style={[
                styles.unitTabText,
                selectedUnitId === 'wudu_journey' && styles.unitTabTextActive,
              ]}
            >
              رِحْلَةُ الْوُضُوءِ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.unitTab,
              selectedUnitId === 'salah_journey' && styles.unitTabActive,
            ]}
            onPress={() => setSelectedUnitId('salah_journey')}
            accessibilityRole="tab"
            accessibilityLabel="رحلتي مع الصلاة"
          >
            <Ionicons
              name="sunny"
              size={18}
              color={selectedUnitId === 'salah_journey' ? '#FFFFFF' : '#16A34A'}
            />
            <Text
              style={[
                styles.unitTabText,
                selectedUnitId === 'salah_journey' && styles.unitTabTextActive,
              ]}
            >
              رِحْلَتِي مَعَ الصَّلَاةِ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toast locked notice */}
        {toastMessage && (
          <View style={styles.toastWrap}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Overview Card */}
          <View
            style={styles.progressCard}
            // @ts-ignore
            role="img"
            aria-label={`أَنْجَزْتَ ${doneCount} دُرُوسٍ مِنْ ${totalLessons}`}
          >
            <LinearGradient
              colors={selectedUnitId === 'wudu_journey' ? ['#0284C7', '#0369A1'] : ['#16A34A', '#15803D']}
              style={styles.progressGradient}
            >
              <View style={styles.progressTextCol}>
                <Text style={styles.progressTitle}>{unitConfig.titleArabic}</Text>
                <Text style={styles.progressSub}>{unitConfig.descriptionArabic}</Text>
                <Text style={styles.progressStat}>
                  أَنْجَزْتَ {doneCount} مِنْ {totalLessons} دُرُوسٍ ({percentComplete}%)
                </Text>
              </View>

              <View style={styles.progressRing}>
                <Text style={styles.progressRingNumber}>{percentComplete}%</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Lessons Progression Path */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.pathList}>
              {unitConfig.lessons.map((lesson, idx) => {
                const lessonProg = progress?.lessons[lesson.id] || { status: 'locked' };
                const status = lessonProg.status;
                const isLast = idx === totalLessons - 1;

                return (
                  <View key={lesson.id} style={styles.pathItemWrap}>
                    {/* Connecting vertical path line */}
                    {!isLast && (
                      <View
                        style={[
                          styles.pathConnector,
                          status === 'done' && styles.pathConnectorDone,
                        ]}
                      />
                    )}

                    <TouchableOpacity
                      style={[
                        styles.lessonCard,
                        status === 'done' && styles.lessonCardDone,
                        status === 'available' && styles.lessonCardAvailable,
                        status === 'locked' && styles.lessonCardLocked,
                      ]}
                      onPress={() => handleLessonPress(lesson, status)}
                      activeOpacity={status === 'locked' ? 0.9 : 0.75}
                      accessibilityRole="button"
                      accessibilityLabel={`${lesson.titleArabic} - ${status === 'done' ? 'مكتمل' : status === 'available' ? 'الدرس الحالي' : 'مغلق'}`}
                    >
                      {/* Status Icon */}
                      <View
                        style={[
                          styles.statusBadge,
                          status === 'done' && styles.statusBadgeDone,
                          status === 'available' && styles.statusBadgeAvailable,
                          status === 'locked' && styles.statusBadgeLocked,
                        ]}
                      >
                        {status === 'done' && (
                          <Ionicons name="checkmark-sharp" size={20} color="#FFFFFF" />
                        )}
                        {status === 'available' && (
                          <Ionicons name="play" size={18} color="#FFFFFF" />
                        )}
                        {status === 'locked' && (
                          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                        )}
                      </View>

                      {/* Lesson Text */}
                      <View style={styles.lessonTextCol}>
                        <View style={styles.lessonHeaderRow}>
                          <Text style={styles.lessonOrder}>الدرس {lesson.order}</Text>
                          {status === 'done' && (
                            <View style={styles.doneChip}>
                              <Text style={styles.doneChipText}>مُكْتَمَلٌ ✨</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.lessonTitle}>{lesson.titleArabic}</Text>
                        <Text style={styles.lessonSubtitle}>{lesson.subtitleArabic}</Text>
                      </View>

                      <Ionicons
                        name="chevron-back"
                        size={20}
                        color={status === 'locked' ? '#D1D5DB' : COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Certificate Card at bottom of path */}
          <View style={styles.certificateSection}>
            <TouchableOpacity
              style={[
                styles.certCard,
                isCertificateUnlocked ? styles.certCardUnlocked : styles.certCardLocked,
              ]}
              onPress={() => {
                if (isCertificateUnlocked) {
                  setShowCertificate(true);
                } else {
                  showLockedNotice();
                }
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="شهادة الإتقان"
            >
              <LinearGradient
                colors={isCertificateUnlocked ? ['#FEF3C7', '#FDE68A'] : ['#F3F4F6', '#E5E7EB']}
                style={styles.certGradient}
              >
                <View style={[styles.certIconBox, isCertificateUnlocked && styles.certIconBoxUnlocked]}>
                  <Ionicons
                    name={isCertificateUnlocked ? 'ribbon' : 'lock-closed'}
                    size={28}
                    color={isCertificateUnlocked ? '#D97706' : '#9CA3AF'}
                  />
                </View>

                <View style={styles.certTextCol}>
                  <Text style={styles.certTitle}>شَهَادَةُ إِتْقَانِ {unitConfig.titleArabic}</Text>
                  <Text style={styles.certSubtitle}>
                    {isCertificateUnlocked
                      ? 'مُبَارَكٌ! تَمَّ فَتْحُ الشَّهَادَةِ، اضْغَطْ لِعَرْضِهَا وَحِفْظِهَا'
                      : `أَكْمِلْ جَمِيعَ الدُّرُوسِ لِفَتْحِ الشَّهَادَةِ (${doneCount} مِنْ ${totalLessons})`}
                  </Text>
                </View>

                <View style={[styles.certActionBtn, isCertificateUnlocked && styles.certActionBtnUnlocked]}>
                  <Text style={[styles.certActionText, isCertificateUnlocked && styles.certActionTextUnlocked]}>
                    {isCertificateUnlocked ? 'اِفْتَحْ' : `${doneCount}/${totalLessons}`}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Certificate Modal */}
        <UnitCertificateModal
          visible={showCertificate}
          childName={activeProfile?.name}
          unitTitleArabic={unitConfig.titleArabic}
          onDismiss={() => setShowCertificate(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row-reverse',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unitTab: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
    minHeight: 48,
  },
  unitTabActive: {
    backgroundColor: COLORS.primary,
  },
  unitTabText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  unitTabTextActive: {
    color: '#FFFFFF',
  },
  toastWrap: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toastText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  progressCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  progressGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  progressTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    textAlign: 'right',
  },
  progressStat: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FDE047',
    marginTop: 8,
  },
  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  progressRingNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  pathList: {
    marginVertical: SPACING.xs,
  },
  pathItemWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  pathConnector: {
    position: 'absolute',
    right: 28,
    top: 50,
    width: 4,
    height: 24,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  pathConnectorDone: {
    backgroundColor: '#10B981',
  },
  lessonCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    ...SHADOWS.sm,
    minHeight: 64,
  },
  lessonCardDone: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  lessonCardAvailable: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  lessonCardLocked: {
    opacity: 0.7,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  statusBadgeDone: {
    backgroundColor: '#10B981',
  },
  statusBadgeAvailable: {
    backgroundColor: '#0284C7',
  },
  statusBadgeLocked: {
    backgroundColor: '#E5E7EB',
  },
  lessonTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  lessonHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  lessonOrder: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  doneChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  doneChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'right',
  },
  certificateSection: {
    marginTop: SPACING.sm,
  },
  certCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  certCardUnlocked: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  certCardLocked: {
    opacity: 0.8,
  },
  certGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: SPACING.md,
  },
  certIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  certIconBoxUnlocked: {
    backgroundColor: '#FEF3C7',
  },
  certTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  certSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'right',
  },
  certActionBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  certActionBtnUnlocked: {
    backgroundColor: '#D97706',
  },
  certActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  certActionTextUnlocked: {
    color: '#FFFFFF',
  },
});

// src/components/parents/OfflineStorageCard.tsx
// Offline Audio Storage & Cache Manager (PRD §10 - OFF-1 & §16)
// Provides parent-managed audio caching, storage quota caps, and one-tap Juz Amma downloads.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { MUSHAF_SURAHS, MushafSurahMeta } from '@/data/mushafData';
import { quranService } from '@/services/quranService';

interface OfflineStorageCardProps {
  language: string;
  downloadedSurahs: Record<number, boolean>;
  reciterId: string;
  audioStorageLimitMB: number;
  onUpdateStorageLimit: (limitMB: number) => void;
  onToggleSurahDownload: (surahNumber: number, downloaded: boolean) => void;
  onClearAllAudio: () => void;
}

const STORAGE_LIMIT_OPTIONS = [
  { mb: 100, labelAr: '١٠٠ ميغابايت', labelEn: '100 MB' },
  { mb: 200, labelAr: '٢٠٠ ميغابايت (الموصى به)', labelEn: '200 MB (Recommended)' },
  { mb: 500, labelAr: '٥٠٠ ميغابايت', labelEn: '500 MB' },
  { mb: 0, labelAr: 'بلا حد أقصى ♾️', labelEn: 'Unlimited ♾️' },
];

export default function OfflineStorageCard({
  language,
  downloadedSurahs,
  reciterId,
  audioStorageLimitMB = 200,
  onUpdateStorageLimit,
  onToggleSurahDownload,
  onClearAllAudio,
}: OfflineStorageCardProps) {
  const isAr = language === 'ar';

  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [activeDownloadingSurah, setActiveDownloadingSurah] = useState<number | null>(null);
  const [showSurahList, setShowSurahList] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  // Filter Juz Amma surahs (Surahs 78 to 114 + Surah 1 Al-Fatihah)
  const juzAmmaSurahs = useMemo(() => {
    return MUSHAF_SURAHS.filter((s) => s.juzNumber === 30 || s.number === 1);
  }, []);

  // Compute downloaded count and estimated size in MB
  const { downloadedCount, estimatedMB } = useMemo(() => {
    let count = 0;
    let totalAyahs = 0;
    Object.keys(downloadedSurahs).forEach((numStr) => {
      const num = parseInt(numStr, 10);
      if (downloadedSurahs[num]) {
        count += 1;
        const s = MUSHAF_SURAHS.find((m) => m.number === num);
        if (s) totalAyahs += s.ayahCount;
      }
    });
    // Estimated ~55 KB per audio verse on CDN
    const size = parseFloat((totalAyahs * 0.055).toFixed(1));
    return { downloadedCount: count, estimatedMB: size };
  }, [downloadedSurahs]);

  // Quota percentage for progress bar
  const quotaPct = audioStorageLimitMB > 0
    ? Math.min(100, Math.round((estimatedMB / audioStorageLimitMB) * 100))
    : 0;

  const isNearLimit = audioStorageLimitMB > 0 && quotaPct >= 85;

  // Batch download all Juz Amma Surahs
  const handleBatchDownloadJuzAmma = async () => {
    if (isBatchDownloading) return;
    setIsBatchDownloading(true);
    setBatchProgress(0);

    const surahsToDownload = juzAmmaSurahs.filter((s) => !downloadedSurahs[s.number]);
    if (surahsToDownload.length === 0) {
      setIsBatchDownloading(false);
      return;
    }

    let completed = 0;
    for (const s of surahsToDownload) {
      setActiveDownloadingSurah(s.number);
      await quranService.downloadSurahAudio(reciterId, s.number, s.ayahCount);
      onToggleSurahDownload(s.number, true);
      completed += 1;
      setBatchProgress(Math.round((completed / surahsToDownload.length) * 100));
    }

    setActiveDownloadingSurah(null);
    setIsBatchDownloading(false);
  };

  // Handle single surah download toggle
  const handleSingleSurahToggle = async (surah: MushafSurahMeta) => {
    const isDownloaded = !!downloadedSurahs[surah.number];
    if (isDownloaded) {
      onToggleSurahDownload(surah.number, false);
      return;
    }

    setActiveDownloadingSurah(surah.number);
    const ok = await quranService.downloadSurahAudio(reciterId, surah.number, surah.ayahCount);
    setActiveDownloadingSurah(null);
    if (ok) {
      onToggleSurahDownload(surah.number, true);
    }
  };

  const handleClearCache = () => {
    onClearAllAudio();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-download" size={20} color="#059669" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {isAr
              ? 'إدارة التخزين والتلاوات الصوتية دون إنترنت 💾'
              : 'Offline Audio & Storage Quota 💾'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isAr
              ? 'التحكم في سعة ذاكرة الهاتف وتنزيل سور جزء عمّ للاستماع دون اتصال'
              : 'Manage phone storage quota and download Surahs for offline listening'}
          </Text>
        </View>
      </View>

      {/* STORAGE USAGE DASHBOARD */}
      <View style={styles.storageDashboard}>
        <View style={styles.dashboardStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{downloadedCount}</Text>
            <Text style={styles.statLabel}>
              {isAr ? 'سور محفوظة محلياً' : 'Surahs Downloaded'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, isNearLimit && { color: '#DC2626' }]}>
              {estimatedMB}
              <Text style={{ fontSize: 13, fontWeight: 'normal' }}> MB</Text>
            </Text>
            <Text style={styles.statLabel}>
              {isAr ? 'حجم الصوت المستهلك' : 'Audio Cache Size'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {audioStorageLimitMB > 0 ? `${audioStorageLimitMB} MB` : '∞'}
            </Text>
            <Text style={styles.statLabel}>
              {isAr ? 'الحد الأقصى للذاكرة' : 'Storage Quota'}
            </Text>
          </View>
        </View>

        {/* Quota Progress Bar */}
        {audioStorageLimitMB > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${quotaPct}%` },
                  isNearLimit && { backgroundColor: '#DC2626' },
                ]}
              />
            </View>
            <View style={styles.progressLabelsRow}>
              <Text style={styles.progressText}>
                {isAr
                  ? `تم استهلاك ${quotaPct}% من الحد الأقصى المسموح`
                  : `Used ${quotaPct}% of allowed audio quota`}
              </Text>
              {isNearLimit && (
                <Text style={styles.warningText}>
                  {isAr ? '⚠️ قارب التخزين على الامتلاء' : '⚠️ Storage near limit'}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* STORAGE LIMIT SELECTOR (PRD §10 - OFF-1 & §16) */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>
          {isAr ? 'الحد الأقصى لحجم التخزين الصوتي المسموح به:' : 'Allowed Audio Cache Quota:'}
        </Text>
        <Text style={styles.hintText}>
          {isAr
            ? 'لحماية ذاكرة الهاتف من الامتلاء، يمنع التطبيق التنزيل التلقائي عند بلوغ هذا الحد.'
            : 'Protects phone storage by capping offline recitations to this quota limit.'}
        </Text>
        <View style={styles.chipsRow}>
          {STORAGE_LIMIT_OPTIONS.map((opt) => {
            const isSelected = audioStorageLimitMB === opt.mb;
            return (
              <TouchableOpacity
                key={opt.mb}
                style={[styles.limitChip, isSelected && styles.limitChipSelected]}
                onPress={() => onUpdateStorageLimit(opt.mb)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.limitChipText, isSelected && styles.limitChipTextSelected]}
                >
                  {isAr ? opt.labelAr : opt.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* BATCH DOWNLOAD JUZ AMMA BUTTON */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.batchDownloadBtn,
            isBatchDownloading && styles.batchDownloadBtnActive,
          ]}
          onPress={handleBatchDownloadJuzAmma}
          disabled={isBatchDownloading}
          activeOpacity={0.85}
        >
          {isBatchDownloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="cloud-download-outline" size={20} color="#FFFFFF" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.batchDownloadBtnText}>
              {isBatchDownloading
                ? isAr
                  ? `جاري تنزيل جزء عمّ... (${batchProgress}%)`
                  : `Downloading Juz Amma... (${batchProgress}%)`
                : isAr
                ? 'تحميل سور جزء عمّ كاملة (٣٧ سورة) دون إنترنت'
                : 'Download Full Juz Amma (37 Surahs) for Offline'}
            </Text>
            <Text style={styles.batchDownloadBtnSub}>
              {isAr
                ? 'حفظ تلاوة القارئ المختار لتشغيلها دائماً دون استهلاك باقة الإنترنت'
                : 'Stores selected reciter audio locally for 100% offline playback'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Clear All Cache Button */}
        {clearedNotice ? (
          <View style={styles.clearedBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#166534" />
            <Text style={styles.clearedBannerText}>
              {isAr ? '✓ تم مسح جميع التلاوات المحفوظة بنجاح!' : '✓ All audio cache cleared!'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
            <Text style={styles.clearBtnText}>
              {isAr
                ? 'مسح التلاوات المحفوظة محلياً لتوفير المساحة 🗑️'
                : 'Clear Downloaded Audio to Free Space 🗑️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* EXPANDABLE JUZ AMMA SURAHS LIST */}
      <View style={styles.surahListToggleContainer}>
        <TouchableOpacity
          style={styles.surahListToggleBtn}
          onPress={() => setShowSurahList(!showSurahList)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="list" size={17} color="#059669" />
            <Text style={styles.surahListToggleText}>
              {isAr
                ? `عرض قائمة سور جزء عمّ المفردة (${juzAmmaSurahs.length} سورة)`
                : `View Individual Juz Amma Surahs (${juzAmmaSurahs.length})`}
            </Text>
          </View>
          <Ionicons
            name={showSurahList ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#059669"
          />
        </TouchableOpacity>

        {showSurahList && (
          <ScrollView
            style={styles.surahsScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {juzAmmaSurahs.map((surah) => {
              const isDownloaded = !!downloadedSurahs[surah.number];
              const isThisDownloading = activeDownloadingSurah === surah.number;

              return (
                <View key={surah.number} style={styles.surahRow}>
                  <View style={styles.surahRowLeft}>
                    <View style={styles.surahNumBadge}>
                      <Text style={styles.surahNumText}>{surah.number}</Text>
                    </View>
                    <View>
                      <Text style={styles.surahNameText}>
                        {isAr ? `سورة ${surah.nameArabic}` : surah.nameTransliteration}
                      </Text>
                      <Text style={styles.surahAyahCountText}>
                        {isAr
                          ? `${surah.ayahCount} آيات • ~${(surah.ayahCount * 0.055).toFixed(1)} ميغابايت`
                          : `${surah.ayahCount} verses • ~${(surah.ayahCount * 0.055).toFixed(1)} MB`}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.surahActionBtn,
                      isDownloaded && styles.surahActionBtnDownloaded,
                    ]}
                    onPress={() => handleSingleSurahToggle(surah)}
                    disabled={isThisDownloading}
                    activeOpacity={0.75}
                  >
                    {isThisDownloading ? (
                      <ActivityIndicator size="small" color="#059669" />
                    ) : isDownloaded ? (
                      <>
                        <Ionicons name="checkmark-circle" size={15} color="#047857" />
                        <Text style={styles.surahActionBtnTextDownloaded}>
                          {isAr ? 'محفوظة ✓' : 'Saved ✓'}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="cloud-download-outline" size={15} color="#059669" />
                        <Text style={styles.surahActionBtnText}>
                          {isAr ? 'تحميل' : 'Download'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
    gap: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  storageDashboard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: SPACING.sm,
  },
  dashboardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  progressContainer: {
    gap: 4,
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  warningText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  subSection: {
    gap: SPACING.xs,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  limitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  limitChipSelected: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  limitChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  limitChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 8,
  },
  batchDownloadBtn: {
    backgroundColor: '#059669',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.soft,
  },
  batchDownloadBtnActive: {
    backgroundColor: '#047857',
  },
  batchDownloadBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  batchDownloadBtnSub: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
    lineHeight: 15,
  },
  clearBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  clearedBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  clearedBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  surahListToggleContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  surahListToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  surahListToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  surahsScroll: {
    maxHeight: 220,
    marginTop: SPACING.sm,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  surahRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  surahNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  surahNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  surahAyahCountText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  surahActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  surahActionBtnDownloaded: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  surahActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  surahActionBtnTextDownloaded: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
});

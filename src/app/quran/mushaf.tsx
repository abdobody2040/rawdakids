// Dedicated Madinah Mushaf Page Reader (/quran/mushaf)
// Authentic 604 Pages of the Holy Quran with Bookmarking, Audio, and Surah/Juz Index
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  Vibration,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import {
  TOTAL_MUSHAF_PAGES,
  MUSHAF_SURAHS,
  MUSHAF_AJZAA,
  getMushafPageInfo,
  MushafSurahMeta,
  MushafJuzMeta,
} from '@/data/mushafData';
import { audioService } from '@/services/audioService';
import { quranService } from '@/services/quranService';

export default function MushafReaderScreen() {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const params = useLocalSearchParams<{ page?: string }>();
  const {
    language,
    lastReadMushafPage,
    setLastReadMushafPage,
    mushafBookmarks,
    toggleMushafBookmark,
    parentSettings,
  } = useAppStore();

  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  // Resolve initial page
  const initialPage = params.page
    ? Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, parseInt(params.page, 10) || 1))
    : lastReadMushafPage || 1;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showIndexModal, setShowIndexModal] = useState<boolean>(false);
  const [indexTab, setIndexTab] = useState<'surahs' | 'ajzaa' | 'bookmarks' | 'jump'>('surahs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jumpInput, setJumpInput] = useState<string>('');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 0.75, 1.0, 1.25, 1.5, 1.75, 2.0
  const [viewMode, setViewMode] = useState<'fit-width' | 'fit-screen'>('fit-width');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const pageInfo = getMushafPageInfo(currentPage);
  const isBookmarked = mushafBookmarks.includes(currentPage);

  // Sync to store whenever current page changes & reset scroll position
  useEffect(() => {
    setLastReadMushafPage(currentPage);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentPage, setLastReadMushafPage]);

  // Proportional Page Dimensions Calculation
  const isDesktop = windowWidth >= 768;
  const ASPECT_RATIO = 2038 / 1260; // 1.61746

  let pageWidth: number;
  let pageHeight: number;

  if (viewMode === 'fit-width') {
    // Large, clear readable view: fills container width, scrolls smoothly vertically
    const baseWidth = isDesktop
      ? Math.min(windowWidth - 48, 860)
      : Math.max(300, windowWidth - 16);
    pageWidth = Math.round(baseWidth * zoomLevel);
    pageHeight = Math.round(pageWidth * ASPECT_RATIO);
  } else {
    // Full page compact fit view
    const reservedHeight = isFullscreen ? 110 : (isDesktop ? 220 : 250);
    const availableHeight = Math.max(320, windowHeight - reservedHeight);
    pageHeight = Math.round(availableHeight * zoomLevel);
    pageWidth = Math.round(pageHeight / ASPECT_RATIO);
    if (pageWidth > windowWidth - 16) {
      pageWidth = windowWidth - 16;
      pageHeight = Math.round(pageWidth * ASPECT_RATIO);
    }
  }

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(25);
      } catch {
        /* vibration ignored */
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < TOTAL_MUSHAF_PAGES) {
      triggerHaptic();
      setIsImageLoading(true);
      setImageError(false);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      triggerHaptic();
      setIsImageLoading(true);
      setImageError(false);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleToggleBookmark = () => {
    triggerHaptic();
    toggleMushafBookmark(currentPage);
    const msg = isBookmarked
      ? (isAr ? 'تمت إزالة الفاصلة 🔖' : 'Bookmark removed')
      : (isAr ? `تم حفظ الفاصلة عند صفحة ${currentPage} 🔖` : `Bookmark saved at page ${currentPage}`);
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleToggleAudio = async () => {
    triggerHaptic();
    if (isPlayingAudio) {
      await audioService.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    // Play Surah recitation for the page's primary surah
    const reciter = parentSettings.reciterId || 'minshawi_teacher';
    const audioUrl = quranService.getAudioUrl(reciter, pageInfo.surahNumber, 1);
    await audioService.playAyah(audioUrl, 1.0, (status: any) => {
      if (status?.didJustFinish || status?.error || !status?.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  const handleJumpToPage = (target: number) => {
    const valid = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, target));
    triggerHaptic();
    setCurrentPage(valid);
    setIsImageLoading(true);
    setImageError(false);
    setShowIndexModal(false);
    setJumpInput('');
  };

  const filteredSurahs = MUSHAF_SURAHS.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.nameArabic.includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameTransliteration.toLowerCase().includes(q) ||
      s.number.toString() === q
    );
  });

  return (
    <SafeAreaView style={[styles.safeArea, isFullscreen && styles.safeAreaFullscreen]} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* Top Header Bar (Hidden in Fullscreen Mode) */}
        {!isFullscreen && (
          <Header
            showBack
            fallbackRoute="/quran"
            title={isAr ? 'المصحف الشريف 📖' : 'The Holy Quran 📖'}
          />
        )}

        {/* Mushaf Navigation Ribbon Bar */}
        <View style={styles.mushafTopRibbon}>
          {/* Row 1: Surah / Juz Metadata + Action Buttons */}
          <View style={[styles.mushafRibbonRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            {/* Page & Juz Info Tag */}
            <View style={styles.pageInfoCol}>
              <View style={[styles.titleBadgeRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Text style={styles.surahBadgeText}>
                  {isAr ? `سورة ${pageInfo.surahNameArabic}` : `Surah ${pageInfo.surahNameEnglish}`}
                </Text>
                <Text style={styles.bulletSeparator}>•</Text>
                <Text style={styles.juzBadgeText}>
                  {isAr ? `الجزء ${pageInfo.juzNumber}` : `Juz ${pageInfo.juzNumber}`}
                </Text>
                <Text style={styles.bulletSeparator}>•</Text>
                <Text style={styles.hizbBadgeText}>
                  {isAr ? `الحزب ${pageInfo.hizbNumber}` : `Hizb ${pageInfo.hizbNumber}`}
                </Text>
              </View>
              <Text style={[styles.pageNumberSubText, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? `صفحة ${currentPage} من ٦٠٤` : `Page ${currentPage} of 604`}
              </Text>
            </View>

            {/* Quick Toolbar Actions */}
            <View style={[styles.toolbarActionsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              {/* Bookmark Ribbon */}
              <TouchableOpacity
                style={[styles.toolBtn, isBookmarked && styles.toolBtnActiveBookmark]}
                onPress={handleToggleBookmark}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={isBookmarked ? '#B45309' : '#4B5563'}
                />
                <Text style={[styles.toolBtnText, isBookmarked && styles.toolBtnTextActive]}>
                  {isAr ? 'الفاصلة' : 'Bookmark'}
                </Text>
              </TouchableOpacity>

              {/* Audio Recitation */}
              <TouchableOpacity
                style={[styles.toolBtn, isPlayingAudio && styles.toolBtnActiveAudio]}
                onPress={handleToggleAudio}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingAudio ? 'volume-high' : 'volume-medium-outline'}
                  size={16}
                  color={isPlayingAudio ? '#059669' : '#4B5563'}
                />
                <Text style={[styles.toolBtnText, isPlayingAudio && { color: '#059669' }]}>
                  {isPlayingAudio ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع' : 'Listen')}
                </Text>
              </TouchableOpacity>

              {/* Index Modal Trigger */}
              <TouchableOpacity
                style={styles.toolBtnIndex}
                onPress={() => setShowIndexModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="list" size={16} color="#FFFFFF" />
                <Text style={styles.toolBtnIndexText}>
                  {isAr ? 'الفهرس' : 'Index'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Zoom & View Control Bar */}
          <View style={[styles.zoomToolbarRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            {/* View Mode Toggle */}
            <TouchableOpacity
              style={[styles.modeToggleChip, viewMode === 'fit-width' && styles.modeToggleChipActive]}
              onPress={() => {
                triggerHaptic();
                setViewMode((m) => (m === 'fit-width' ? 'fit-screen' : 'fit-width'));
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name={viewMode === 'fit-width' ? 'expand-outline' : 'contract-outline'}
                size={14}
                color={viewMode === 'fit-width' ? '#047857' : '#92400E'}
              />
              <Text style={[styles.modeToggleChipText, viewMode === 'fit-width' && styles.modeToggleChipTextActive]}>
                {viewMode === 'fit-width'
                  ? (isAr ? 'عرض مكبّر وواضح 🔍' : 'Zoomed View 🔍')
                  : (isAr ? 'صفحة كاملة 📄' : 'Full Page 📄')}
              </Text>
            </TouchableOpacity>

            {/* Stepper Zoom Buttons */}
            <View style={[styles.zoomControlsGroup, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={styles.zoomIconBtn}
                onPress={() => {
                  triggerHaptic();
                  setZoomLevel((z) => Math.max(0.75, parseFloat((z - 0.25).toFixed(2))));
                }}
                disabled={zoomLevel <= 0.75}
                activeOpacity={0.8}
              >
                <Ionicons name="remove" size={15} color={zoomLevel <= 0.75 ? '#D1D5DB' : '#78350F'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.zoomBadgePill}
                onPress={() => {
                  triggerHaptic();
                  setZoomLevel(1.0);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.zoomBadgeText}>
                  {Math.round(zoomLevel * 100)}%
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.zoomIconBtn}
                onPress={() => {
                  triggerHaptic();
                  setZoomLevel((z) => Math.min(2.0, parseFloat((z + 0.25).toFixed(2))));
                }}
                disabled={zoomLevel >= 2.0}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={15} color={zoomLevel >= 2.0 ? '#D1D5DB' : '#78350F'} />
              </TouchableOpacity>
            </View>

            {/* Fullscreen Button */}
            <TouchableOpacity
              style={[styles.fullscreenBtn, isFullscreen && styles.fullscreenBtnActive]}
              onPress={() => {
                triggerHaptic();
                setIsFullscreen(!isFullscreen);
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isFullscreen ? 'contract' : 'scan-outline'}
                size={14}
                color={isFullscreen ? '#FFFFFF' : '#78350F'}
              />
              <Text style={[styles.fullscreenBtnText, isFullscreen && { color: '#FFFFFF' }]}>
                {isFullscreen
                  ? (isAr ? 'إنهاء التكبير' : 'Exit Full')
                  : (isAr ? 'ملء الشاشة ⛶' : 'Fullscreen ⛶')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Toast Notification */}
        {showToast && (
          <View style={styles.toastContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.toastText}>{showToast}</Text>
          </View>
        )}

        {/* Scrollable Canvas for Large, High-Definition Mushaf Page */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollCanvas}
          contentContainerStyle={styles.scrollCanvasContent}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          <View
            style={[
              styles.mushafPaperFrame,
              {
                width: pageWidth,
                minHeight: pageHeight,
              },
            ]}
          >
            {isImageLoading && !imageError && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="large" color="#B45309" />
                <Text style={styles.loadingPageText}>
                  {isAr ? `جاري فتح صفحة ${currentPage}...` : `Opening page ${currentPage}...`}
                </Text>
              </View>
            )}

            {/* High-Definition Madinah Mushaf Page with double-tap zoom */}
            <TouchableOpacity
              activeOpacity={0.96}
              onPress={() => {
                triggerHaptic();
                setZoomLevel((z) => (z === 1.0 ? 1.35 : 1.0));
              }}
            >
              <Image
                source={{ uri: imageError ? pageInfo.backupImageUri : pageInfo.imageUri }}
                style={{
                  width: pageWidth,
                  height: pageHeight,
                }}
                contentFit="contain"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => {
                  if (!imageError) {
                    setImageError(true);
                  } else {
                    setIsImageLoading(false);
                  }
                }}
              />
            </TouchableOpacity>

            {/* Bookmark Ribbon on Canvas */}
            {isBookmarked && (
              <View style={styles.canvasRibbonMarker}>
                <Ionicons name="bookmark" size={38} color="#DC2626" />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Paging Controller Bar */}
        <View style={styles.bottomControllerBar}>
          {/* Previous Page Button (In Arabic, Next is left, Prev is right) */}
          <TouchableOpacity
            style={[
              styles.navPageBtn,
              currentPage <= 1 && styles.navPageBtnDisabled,
              { flexDirection: isAr ? 'row-reverse' : 'row' },
            ]}
            onPress={handlePrevPage}
            disabled={currentPage <= 1}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isAr ? 'arrow-forward' : 'arrow-back'}
              size={18}
              color={currentPage <= 1 ? '#9CA3AF' : '#FFFFFF'}
            />
            <Text style={[styles.navPageBtnText, currentPage <= 1 && styles.navPageBtnTextDisabled]}>
              {isAr ? 'الصفحة السابقة' : 'Previous'}
            </Text>
          </TouchableOpacity>

          {/* Quick Page Jump Pill */}
          <TouchableOpacity
            style={styles.pageJumpPill}
            onPress={() => {
              setIndexTab('jump');
              setShowIndexModal(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.pageJumpPillText}>
              {isAr ? `صفحة ${currentPage} / ٦٠٤` : `${currentPage} / 604`}
            </Text>
            <Ionicons name="chevron-up" size={14} color="#B45309" />
          </TouchableOpacity>

          {/* Next Page Button */}
          <TouchableOpacity
            style={[
              styles.navPageBtn,
              currentPage >= TOTAL_MUSHAF_PAGES && styles.navPageBtnDisabled,
              { flexDirection: isAr ? 'row-reverse' : 'row' },
            ]}
            onPress={handleNextPage}
            disabled={currentPage >= TOTAL_MUSHAF_PAGES}
            activeOpacity={0.8}
          >
            <Text style={[styles.navPageBtnText, currentPage >= TOTAL_MUSHAF_PAGES && styles.navPageBtnTextDisabled]}>
              {isAr ? 'الصفحة التالية' : 'Next'}
            </Text>
            <Ionicons
              name={isAr ? 'arrow-back' : 'arrow-forward'}
              size={18}
              color={currentPage >= TOTAL_MUSHAF_PAGES ? '#9CA3AF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Index & Surahs / Ajzaa Modal */}
        <Modal
          visible={showIndexModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowIndexModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.indexModalCard}>
              {/* Modal Top Header */}
              <View style={[styles.modalHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={[styles.modalHeaderTitleBox, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="book" size={22} color="#B45309" />
                  <Text style={styles.modalTitleText}>
                    {isAr ? 'فهرس المصحف الشريف' : 'Mushaf Index'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowIndexModal(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>

              {/* Index Tabs Row */}
              <View style={[styles.indexTabsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[styles.indexTabBtn, indexTab === 'surahs' && styles.indexTabBtnActive]}
                  onPress={() => setIndexTab('surahs')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.indexTabBtnText, indexTab === 'surahs' && styles.indexTabBtnTextActive]}>
                    {isAr ? 'السور (١١٤)' : 'Surahs (114)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.indexTabBtn, indexTab === 'ajzaa' && styles.indexTabBtnActive]}
                  onPress={() => setIndexTab('ajzaa')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.indexTabBtnText, indexTab === 'ajzaa' && styles.indexTabBtnTextActive]}>
                    {isAr ? 'الأجزاء (٣٠)' : 'Juz (30)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.indexTabBtn, indexTab === 'bookmarks' && styles.indexTabBtnActive]}
                  onPress={() => setIndexTab('bookmarks')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.indexTabBtnText, indexTab === 'bookmarks' && styles.indexTabBtnTextActive]}>
                    {isAr ? `الفواصل (${mushafBookmarks.length})` : `Bookmarks (${mushafBookmarks.length})`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.indexTabBtn, indexTab === 'jump' && styles.indexTabBtnActive]}
                  onPress={() => setIndexTab('jump')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.indexTabBtnText, indexTab === 'jump' && styles.indexTabBtnTextActive]}>
                    {isAr ? 'رقم الصفحة' : 'Jump'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab 1: Surahs List */}
              {indexTab === 'surahs' && (
                <View style={styles.modalContentArea}>
                  <View style={[styles.searchBox, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="search" size={18} color="#9CA3AF" />
                    <TextInput
                      style={[styles.searchInput, { textAlign: isAr ? 'right' : 'left' }]}
                      placeholder={isAr ? 'ابحث عن اسم السورة أو رقمها...' : 'Search surah...'}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <ScrollView style={styles.indexListScroll} showsVerticalScrollIndicator={false}>
                    {filteredSurahs.map((surah) => {
                      const isCurrent = pageInfo.surahNumber === surah.number;
                      return (
                        <TouchableOpacity
                          key={surah.number}
                          style={[
                            styles.indexSurahRow,
                            isCurrent && styles.indexSurahRowCurrent,
                            { flexDirection: isAr ? 'row-reverse' : 'row' },
                          ]}
                          onPress={() => handleJumpToPage(surah.startPage)}
                          activeOpacity={0.75}
                        >
                          <View style={styles.surahNumberPill}>
                            <Text style={styles.surahNumberPillText}>{surah.number}</Text>
                          </View>

                          <View style={[styles.surahInfoCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                            <Text style={styles.surahRowArabicTitle}>
                              سورة {surah.nameArabic}
                            </Text>
                            <Text style={styles.surahRowSubText}>
                              {surah.nameTransliteration} • {surah.ayahCount} {isAr ? 'آية' : 'ayahs'} • {isAr ? (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية') : surah.revelationType}
                            </Text>
                          </View>

                          <View style={styles.pageStartTag}>
                            <Text style={styles.pageStartTagText}>
                              {isAr ? `صفحة ${surah.startPage}` : `p. ${surah.startPage}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Tab 2: Ajzaa (Juz 1 to 30) List */}
              {indexTab === 'ajzaa' && (
                <View style={styles.modalContentArea}>
                  <ScrollView style={styles.indexListScroll} showsVerticalScrollIndicator={false}>
                    {MUSHAF_AJZAA.map((juz) => {
                      const isCurrent = pageInfo.juzNumber === juz.number;
                      return (
                        <TouchableOpacity
                          key={juz.number}
                          style={[
                            styles.indexJuzRow,
                            isCurrent && styles.indexSurahRowCurrent,
                            { flexDirection: isAr ? 'row-reverse' : 'row' },
                          ]}
                          onPress={() => handleJumpToPage(juz.startPage)}
                          activeOpacity={0.75}
                        >
                          <View style={styles.juzNumberCircle}>
                            <Text style={styles.juzNumberCircleText}>{juz.number}</Text>
                          </View>

                          <View style={[styles.surahInfoCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                            <Text style={styles.surahRowArabicTitle}>{juz.nameArabic}</Text>
                            <Text style={styles.surahRowSubText}>
                              {isAr ? `يبدأ من سورة ${juz.startSurahName}` : `Starts at Surah ${juz.startSurahName}`}
                            </Text>
                          </View>

                          <View style={styles.pageStartTag}>
                            <Text style={styles.pageStartTagText}>
                              {isAr ? `صفحة ${juz.startPage}` : `p. ${juz.startPage}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Tab 3: Saved Bookmarks */}
              {indexTab === 'bookmarks' && (
                <View style={styles.modalContentArea}>
                  {mushafBookmarks.length === 0 ? (
                    <View style={styles.emptyBookmarksBox}>
                      <Ionicons name="bookmark-outline" size={48} color="#D1D5DB" />
                      <Text style={styles.emptyBookmarksText}>
                        {isAr ? 'لا توجد فواصل محفوظة بعد' : 'No bookmarks saved yet'}
                      </Text>
                      <Text style={styles.emptyBookmarksSub}>
                        {isAr ? 'اضغط على زر الفاصلة 🔖 في أي صفحة لحفظ موضع قراءتك' : 'Tap the bookmark icon to save your reading spot'}
                      </Text>
                    </View>
                  ) : (
                    <ScrollView style={styles.indexListScroll} showsVerticalScrollIndicator={false}>
                      {mushafBookmarks.map((page) => {
                        const info = getMushafPageInfo(page);
                        return (
                          <TouchableOpacity
                            key={page}
                            style={[
                              styles.bookmarkRowItem,
                              page === currentPage && styles.indexSurahRowCurrent,
                              { flexDirection: isAr ? 'row-reverse' : 'row' },
                            ]}
                            onPress={() => handleJumpToPage(page)}
                            activeOpacity={0.75}
                          >
                            <View style={styles.bookmarkRibbonIcon}>
                              <Ionicons name="bookmark" size={20} color="#DC2626" />
                            </View>

                            <View style={[styles.surahInfoCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                              <Text style={styles.surahRowArabicTitle}>
                                {isAr ? `سورة ${info.surahNameArabic}` : `Surah ${info.surahNameEnglish}`}
                              </Text>
                              <Text style={styles.surahRowSubText}>
                                {isAr ? `الجزء ${info.juzNumber} • الحزب ${info.hizbNumber}` : `Juz ${info.juzNumber} • Hizb ${info.hizbNumber}`}
                              </Text>
                            </View>

                            <View style={styles.pageStartTag}>
                              <Text style={styles.pageStartTagText}>
                                {isAr ? `صفحة ${page}` : `p. ${page}`}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              )}

              {/* Tab 4: Jump Directly to Page Number */}
              {indexTab === 'jump' && (
                <View style={styles.jumpContainerArea}>
                  <Text style={styles.jumpPromptTitle}>
                    {isAr ? 'أدخل رقم الصفحة (١ - ٦٠٤):' : 'Enter page number (1 - 604):'}
                  </Text>

                  <View style={styles.jumpInputRow}>
                    <TextInput
                      style={styles.jumpNumberInput}
                      keyboardType="number-pad"
                      placeholder="1"
                      maxLength={3}
                      value={jumpInput}
                      onChangeText={setJumpInput}
                      autoFocus
                    />
                  </View>

                  {/* Common Shortcuts */}
                  <View style={[styles.jumpShortcutsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    {[1, 50, 106, 293, 440, 562, 582, 604].map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={styles.shortcutPageChip}
                        onPress={() => handleJumpToPage(p)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.shortcutPageChipText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.confirmJumpBtn,
                      !jumpInput && styles.confirmJumpBtnDisabled,
                    ]}
                    onPress={() => {
                      const num = parseInt(jumpInput, 10);
                      if (num >= 1 && num <= TOTAL_MUSHAF_PAGES) {
                        handleJumpToPage(num);
                      }
                    }}
                    disabled={!jumpInput}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    <Text style={styles.confirmJumpBtnText}>
                      {isAr ? 'انتقل إلى الصفحة' : 'Go to Page'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Persistent Bottom Nav (Hidden in fullscreen mode) */}
        {!isFullscreen && <AppBottomNav />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  appContainer: {
    flex: 1,
  },
  mushafTopRibbon: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8D2',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  pageInfoCol: {
    flex: 1,
  },
  titleBadgeRow: {
    alignItems: 'center',
    gap: 6,
  },
  surahBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  bulletSeparator: {
    color: '#D97706',
    fontWeight: 'bold',
  },
  juzBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  pageNumberSubText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  toolbarActionsRow: {
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
  },
  toolBtnActiveBookmark: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  toolBtnActiveAudio: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  toolBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  toolBtnTextActive: {
    color: '#B45309',
  },
  toolBtnIndex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  toolBtnIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toastContainer: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  safeAreaFullscreen: {
    backgroundColor: '#0F172A',
  },
  mushafRibbonRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  hizbBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  zoomToolbarRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3E8D2',
    gap: 8,
    flexWrap: 'wrap',
  },
  modeToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  modeToggleChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  modeToggleChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  modeToggleChipTextActive: {
    color: '#065F46',
  },
  zoomControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8D2',
    borderRadius: RADIUS.full,
    padding: 2,
    gap: 2,
  },
  zoomIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  zoomBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#78350F',
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  fullscreenBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  fullscreenBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
  },
  scrollCanvas: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F7F4EC',
  },
  scrollCanvasContent: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  mushafPaperFrame: {
    backgroundColor: '#FFFDF9',
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: '#E7D5A9',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  imageLoadingOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingPageText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  canvasRibbonMarker: {
    position: 'absolute',
    top: -2,
    right: 28,
    zIndex: 15,
  },
  bottomControllerBar: {
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F3E8D2',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  navPageBtn: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  navPageBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  navPageBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navPageBtnTextDisabled: {
    color: '#9CA3AF',
  },
  pageJumpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  pageJumpPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  indexModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    height: '82%',
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  modalHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  modalHeaderTitleBox: {
    alignItems: 'center',
    gap: 8,
  },
  modalTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#064E3B',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexTabsRow: {
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.lg,
    padding: 3,
    marginBottom: SPACING.sm,
    gap: 4,
  },
  indexTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexTabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  indexTabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  indexTabBtnTextActive: {
    color: '#064E3B',
    fontWeight: '900',
  },
  modalContentArea: {
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    paddingVertical: 2,
  },
  indexListScroll: {
    flex: 1,
  },
  indexSurahRow: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  indexSurahRowCurrent: {
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.md,
  },
  surahNumberPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumberPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  surahInfoCol: {
    flex: 1,
  },
  surahRowArabicTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  surahRowSubText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  pageStartTag: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
  },
  pageStartTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  indexJuzRow: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  juzNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  juzNumberCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  emptyBookmarksBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyBookmarksText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B5563',
    marginTop: 12,
  },
  emptyBookmarksSub: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  bookmarkRowItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  bookmarkRibbonIcon: {
    padding: 4,
  },
  jumpContainerArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.md,
  },
  jumpPromptTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    marginBottom: SPACING.md,
  },
  jumpInputRow: {
    width: 120,
    height: 60,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: '#B45309',
    backgroundColor: '#FFFDF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  jumpNumberInput: {
    fontSize: 28,
    fontWeight: '900',
    color: '#B45309',
    textAlign: 'center',
    width: '100%',
  },
  jumpShortcutsRow: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  shortcutPageChip: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  shortcutPageChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  confirmJumpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
  },
  confirmJumpBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmJumpBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

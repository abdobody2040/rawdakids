// Hadith Flashcards Screen (بطاقات استذكار الأحاديث النبوية للأطفال)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { HADITHS_DATA, KidHadith } from '@/data/hadithData';
import { audioService } from '@/services/audioService';
import { SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import SunnahHeroHeader from '@/components/SunnahHeroHeader';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { TRANSLATIONS } from '@/constants/i18n';

export default function HadithFlashcardsScreen() {
  const { language, addStars, addGems } = useAppStore();
  const t = TRANSLATIONS[language];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const isAr = language === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [memorizedIds, setMemorizedIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const hadithList = HADITHS_DATA;
  const currentHadith: KidHadith = hadithList[currentIndex] || hadithList[0];
  const isMemorized = memorizedIds.includes(currentHadith.id);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % hadithList.length);
  };

  const handlePrev = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + hadithList.length) % hadithList.length);
  };

  const handleShuffle = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * hadithList.length);
    setCurrentIndex(randomIndex);
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      await audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await audioService.playDua(currentHadith.arabicText, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  const handleMarkMemorized = () => {
    if (!isMemorized) {
      setMemorizedIds([...memorizedIds, currentHadith.id]);
      addStars(2);
      addGems(3);
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header
          showBack
          title={t.sunnah}
        />
        <SunnahHeroHeader activeTab="cards" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.container,
            isDesktop && styles.containerDesktop,
          ]}
          showsVerticalScrollIndicator={false}
        >
        {/* Progress & Deck Status Bar */}
        <View
          style={[
            styles.statusBar,
            { flexDirection: isAr ? 'row-reverse' : 'row' },
          ]}
        >
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {isAr
                ? `حديث ${currentIndex + 1} من ${hadithList.length}`
                : `Hadith ${currentIndex + 1} of ${hadithList.length}`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.shuffleBtn}
            onPress={handleShuffle}
            activeOpacity={0.8}
          >
            <Ionicons name="shuffle" size={18} color="#267960" />
            <Text style={styles.shuffleText}>
              {isAr ? 'حديث عشوائي' : 'Shuffle'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* THE MAIN INTERACTIVE FLASHCARD */}
        <TouchableOpacity
          style={[styles.cardContainer, isDesktop && styles.cardContainerDesktop]}
          onPress={handleFlip}
          activeOpacity={0.95}
        >
          <View style={[styles.flashCard, isFlipped ? styles.flashCardBack : styles.flashCardFront]}>
            {/* Card Header */}
            <View
              style={[
                styles.cardTopRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={styles.themeBadge}>
                <Text style={styles.themeBadgeText}>
                  {isAr ? currentHadith.titleAr : currentHadith.titleEn}
                </Text>
              </View>

              <View style={styles.flipHintPill}>
                <Ionicons name="sync" size={14} color="#789087" />
                <Text style={styles.flipHintText}>
                  {isFlipped
                    ? isAr
                      ? 'المتن الشريف'
                      : 'Show Arabic'
                    : isAr
                    ? 'المعنى والدرس'
                    : 'Show Meaning'}
                </Text>
              </View>
            </View>

            {/* CARD FRONT: Arabic Hadith & Audio */}
            {!isFlipped ? (
              <View style={styles.frontContent}>
                <Text style={styles.narratorText}>
                  {isAr ? `عن ${currentHadith.narratorAr}` : `Narrated by ${currentHadith.narratorEn}`}
                </Text>

                <Text style={styles.arabicHadithText}>
                  {currentHadith.arabicText}
                </Text>

                <Text style={styles.sourceText}>
                  {currentHadith.source} ({currentHadith.hadithNumber})
                </Text>

                {/* Audio Listen Button */}
                <TouchableOpacity
                  style={[
                    styles.audioBtn,
                    isPlayingAudio && styles.audioBtnPlaying,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handlePlayAudio();
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPlayingAudio ? 'pause' : 'volume-high'}
                    size={22}
                    color="#ffffff"
                  />
                  <Text style={styles.audioBtnText}>
                    {isPlayingAudio
                      ? isAr
                        ? 'جارٍ الاستماع... (إيقاف)'
                        : 'Playing Audio... (Pause)'
                      : isAr
                      ? 'استمع للنطق النبوي الشريف'
                      : 'Listen to Prophetic Words'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* CARD BACK: Meaning, Kid Story Lesson, and Action */
              <View style={styles.backContent}>
                <View style={styles.meaningBox}>
                  <Text style={styles.meaningLabel}>
                    {isAr ? '💡 المعنى اللطيف للأبطال:' : '💡 What it means for you:'}
                  </Text>
                  <Text style={styles.meaningText}>
                    {isAr
                      ? currentHadith.explanationAr
                      : currentHadith.explanationEn}
                  </Text>
                </View>

                <View style={styles.deedBox}>
                  <Text style={styles.deedLabel}>
                    {isAr ? '🌟 فكرة للتطبيق اليوم:' : '🌟 Practice this today:'}
                  </Text>
                  <Text style={styles.deedText}>
                    {isAr
                      ? currentHadith.linkedHabit.actionAr
                      : currentHadith.linkedHabit.actionEn}
                  </Text>
                </View>

                <View style={styles.sourceTagRow}>
                  <Ionicons name="ribbon" size={14} color="#D97706" />
                  <Text style={styles.sourceTagText}>
                    {currentHadith.source} • {currentHadith.grade}
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom tap hint */}
            <Text style={styles.tapToFlipHint}>
              {isAr ? '👆 اضغط على البطاقة لقلبها' : '👆 Tap card to flip'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* CONTROLS BAR: Prev, Memorized, Next */}
        <View
          style={[
            styles.controlsRow,
            { flexDirection: isAr ? 'row-reverse' : 'row' },
          ]}
        >
          <TouchableOpacity
            style={styles.navDeckBtn}
            onPress={handlePrev}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isAr ? 'arrow-forward' : 'arrow-back'}
              size={22}
              color="#267960"
            />
            <Text style={styles.navDeckBtnText}>
              {isAr ? 'السابق' : 'Previous'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.memorizeBtn,
              isMemorized && styles.memorizeBtnDone,
            ]}
            onPress={handleMarkMemorized}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isMemorized ? 'checkmark-circle' : 'star'}
              size={22}
              color={isMemorized ? '#ffffff' : '#92400E'}
            />
            <Text
              style={[
                styles.memorizeBtnText,
                isMemorized && styles.memorizeBtnTextDone,
              ]}
            >
              {isMemorized
                ? isAr
                  ? 'تم الحفظ بنجاح! 🌟'
                  : 'Memorized! 🌟'
                : isAr
                ? 'حفظت هذا الحديث'
                : 'I Memorized This!'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navDeckBtn}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.navDeckBtnText}>
              {isAr ? 'التالي' : 'Next'}
            </Text>
            <Ionicons
              name={isAr ? 'arrow-back' : 'arrow-forward'}
              size={22}
              color="#267960"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppBottomNav />
      </View>

      {/* Star Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={2}
        gemsEarned={3}
        title={isAr ? 'ما شاء الله يا بطل!' : 'MashaAllah, Star Learner!'}
        subtitle={
          isAr
            ? 'لقد حفظت حديثاً نبوياً شريفاً يضيء قلبك وحياتك!'
            : 'You memorized an authentic Prophetic pearl! Keep shining!'
        }
        onDismiss={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffdf8',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: '#fffdf8',
  },
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 48,
  },
  containerDesktop: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  statusBar: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterBadge: {
    backgroundColor: '#eef6f0',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7e8db',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#267960',
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff7df',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fce3a3',
  },
  shuffleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#976a13',
  },

  // CARD
  cardContainer: {
    width: '100%',
    minHeight: 400,
  },
  cardContainerDesktop: {
    minHeight: 440,
  },
  flashCard: {
    minHeight: 400,
    borderRadius: 28,
    padding: 28,
    justifyContent: 'space-between',
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  flashCardFront: {
    backgroundColor: '#ffffff',
    borderColor: '#e8f2ea',
  },
  flashCardBack: {
    backgroundColor: '#fffdf7',
    borderColor: '#fde8be',
  },
  cardTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeBadge: {
    backgroundColor: '#eaf4ee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  themeBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#267960',
  },
  flipHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f6f4ea',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  flipHintText: {
    fontSize: 11,
    color: '#789087',
    fontWeight: '700',
  },

  // FRONT
  frontContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 16,
  },
  narratorText: {
    fontSize: 13,
    color: '#789087',
    fontWeight: '700',
  },
  arabicHadithText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#183c38',
    textAlign: 'center',
    lineHeight: 44,
    paddingHorizontal: 12,
  },
  sourceText: {
    fontSize: 12,
    color: '#95a59d',
    fontWeight: '600',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#267960',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginTop: 8,
    ...SHADOWS.glow('#267960'),
  },
  audioBtnPlaying: {
    backgroundColor: '#059669',
  },
  audioBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },

  // BACK
  backContent: {
    gap: 14,
    paddingVertical: 8,
  },
  meaningBox: {
    backgroundColor: '#fbf7ed',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f2e8d0',
  },
  meaningLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#976a13',
    marginBottom: 6,
  },
  meaningText: {
    fontSize: 15,
    color: '#294345',
    lineHeight: 24,
    fontWeight: '600',
  },
  deedBox: {
    backgroundColor: '#eef8f1',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d2edd9',
  },
  deedLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f6e4a',
    marginBottom: 6,
  },
  deedText: {
    fontSize: 14,
    color: '#215c41',
    lineHeight: 22,
    fontWeight: '600',
  },
  sourceTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  sourceTagText: {
    fontSize: 11,
    color: '#8b9b92',
    fontWeight: '700',
  },
  tapToFlipHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9aac9f',
    fontWeight: '700',
    marginTop: 10,
  },

  // CONTROLS
  controlsRow: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  navDeckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef6f0',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d6e9dc',
  },
  navDeckBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#267960',
  },
  memorizeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffcf5c',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#d99835',
    ...SHADOWS.glow('#d99835'),
  },
  memorizeBtnDone: {
    backgroundColor: '#10B981',
    borderBottomColor: '#059669',
  },
  memorizeBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
  },
  memorizeBtnTextDone: {
    color: '#ffffff',
  },
});

// Hadith Flashcards Screen (بطاقات استذكار الأحاديث النبوية للأطفال)
import { useState } from "react";
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
import { TRANSLATIONS, isRTL, SupportedLanguage } from '@/constants/i18n';

const CARDS_I18N: Record<
  SupportedLanguage,
  {
    hadithCount: string;
    shuffle: string;
    showText: string;
    showMeaning: string;
    narratedBy: string;
    playingAudio: string;
    listenAudio: string;
    meaningLabel: string;
    deedLabel: string;
    tapToFlip: string;
    prev: string;
    next: string;
    memorized: string;
    markMemorized: string;
    celebrationTitle: string;
    celebrationSub: string;
  }
> = {
  ar: {
    hadithCount: 'حديث {curr} من {total}',
    shuffle: 'حديث عشوائي',
    showText: 'المتن الشريف',
    showMeaning: 'المعنى والدرس',
    narratedBy: 'عن {narrator}',
    playingAudio: 'جارٍ الاستماع... (إيقاف)',
    listenAudio: 'استمع للنطق النبوي الشريف',
    meaningLabel: '💡 المعنى اللطيف للأبطال:',
    deedLabel: '🌟 فكرة للتطبيق اليوم:',
    tapToFlip: '👆 اضغط على البطاقة لقلبها',
    prev: 'السابق',
    next: 'التالي',
    memorized: 'تم الحفظ بنجاح! 🌟',
    markMemorized: 'حفظت هذا الحديث',
    celebrationTitle: 'ما شاء الله يا بطل!',
    celebrationSub: 'لقد حفظت حديثاً نبوياً شريفاً يضيء قلبك وحياتك!',
  },
  en: {
    hadithCount: 'Hadith {curr} of {total}',
    shuffle: 'Shuffle',
    showText: 'Show Arabic',
    showMeaning: 'Show Meaning',
    narratedBy: 'Narrated by {narrator}',
    playingAudio: 'Playing Audio... (Pause)',
    listenAudio: 'Listen to Prophetic Words',
    meaningLabel: '💡 What it means for you:',
    deedLabel: '🌟 Practice this today:',
    tapToFlip: '👆 Tap card to flip',
    prev: 'Previous',
    next: 'Next',
    memorized: 'Memorized! 🌟',
    markMemorized: 'I Memorized This!',
    celebrationTitle: 'MashaAllah, Star Learner!',
    celebrationSub: 'You memorized an authentic Prophetic pearl! Keep shining!',
  },
  bn: {
    hadithCount: '{total} টির মধ্যে {curr} নং হাদিস',
    shuffle: 'এলোমেলো হাদিস',
    showText: 'মূল আরবি দেখুন',
    showMeaning: 'অর্থ ও শিক্ষা দেখুন',
    narratedBy: '{narrator} হতে বর্ণিত',
    playingAudio: 'অডিও শুনছি... (বিরতি)',
    listenAudio: 'নবীজির পবিত্র বাণী শুনুন',
    meaningLabel: '💡 সহজ অর্থ ও শিক্ষা:',
    deedLabel: '🌟 আজকের অনুশীলনের ধারণা:',
    tapToFlip: '👆 কার্ড উল্টাতে ট্যাপ করুন',
    prev: 'পূর্ববর্তী',
    next: 'পরবর্তী',
    memorized: 'আলহামদুলিল্লাহ মুখস্থ হয়েছে! 🌟',
    markMemorized: 'আমি এই হাদিসটি মুখস্থ করেছি',
    celebrationTitle: 'মাশাআল্লাহ, প্রিয় শিক্ষার্থী!',
    celebrationSub: 'তুমি প্রিয় নবীজির একটি মূল্যবান হাদিস মুখস্থ করেছ!',
  },
  ru: {
    hadithCount: 'Хадис {curr} из {total}',
    shuffle: 'Случайный хадис',
    showText: 'Показать арабский текст',
    showMeaning: 'Показать смысл и урок',
    narratedBy: 'Передал {narrator}',
    playingAudio: 'Воспроизведение... (Пауза)',
    listenAudio: 'Послушать благословенные слова',
    meaningLabel: '💡 Что это значит для тебя:',
    deedLabel: '🌟 Примени это сегодня:',
    tapToFlip: '👆 Нажми, чтобы перевернуть',
    prev: 'Назад',
    next: 'Вперед',
    memorized: 'Успешно выучено! 🌟',
    markMemorized: 'Я выучил этот хадис',
    celebrationTitle: 'Машааллах, юный знаток!',
    celebrationSub: 'Ты выучил прекрасный хадис Пророка ﷺ!',
  },
  ur: {
    hadithCount: 'حدیث {curr} از {total}',
    shuffle: 'کوئی بھی حدیث',
    showText: 'اصل عربی متن',
    showMeaning: 'مفہوم اور سبق',
    narratedBy: 'روایت از {narrator}',
    playingAudio: 'تلاوت جاری ہے... (وقفہ)',
    listenAudio: 'پیارے نبی ﷺ کے الفاظ سنیں',
    meaningLabel: '💡 بچوں کے لیے آسان مفہوم:',
    deedLabel: '🌟 آج کے عمل کا خیال:',
    tapToFlip: '👆 الٹنے کے لیے کارڈ چھوئیں',
    prev: 'پچھلا',
    next: 'اگلا',
    memorized: 'کامیابی سے یاد ہو گیا! 🌟',
    markMemorized: 'میں نے یہ حدیث یاد کر لی',
    celebrationTitle: 'ماشاء اللہ، شاباش!',
    celebrationSub: 'آپ نے پیارے نبی ﷺ کی ایک مبارک حدیث یاد کر لی ہے!',
  },
  id: {
    hadithCount: 'Hadis {curr} dari {total}',
    shuffle: 'Acak',
    showText: 'Teks Bahasa Arab',
    showMeaning: 'Makna & Pelajaran',
    narratedBy: 'Diriwayatkan oleh {narrator}',
    playingAudio: 'Memutar Audio... (Jeda)',
    listenAudio: 'Dengarkan Sabda Nabi ﷺ',
    meaningLabel: '💡 Maknanya bagimu:',
    deedLabel: '🌟 Praktikkan hari ini:',
    tapToFlip: '👆 Ketuk kartu untuk membalik',
    prev: 'Sebelumnya',
    next: 'Selanjutnya',
    memorized: 'Berhasil Dihafal! 🌟',
    markMemorized: 'Saya Menghafal Ini!',
    celebrationTitle: 'Masha Allah, Hebat Sekali!',
    celebrationSub: 'Kamu telah menghafal mutiara hadis Nabi ﷺ!',
  },
  tr: {
    hadithCount: '{total} Hadisten {curr}. Hadis',
    shuffle: 'Rastgele Hadis',
    showText: 'Arapça Metni Gör',
    showMeaning: 'Anlamı ve Dersi Gör',
    narratedBy: '{narrator} rivayetiyle',
    playingAudio: 'Ses Çalınıyor... (Duraklat)',
    listenAudio: 'Nebevi Sözleri Dinle',
    meaningLabel: '💡 Senin için anlamı:',
    deedLabel: '🌟 Bugün bunu uygula:',
    tapToFlip: '👆 Çevirmek için dokun',
    prev: 'Önceki',
    next: 'Sonraki',
    memorized: 'Ezberlendi! 🌟',
    markMemorized: 'Bu Hadisi Ezberledim!',
    celebrationTitle: 'Maşaallah, Tebrikler!',
    celebrationSub: 'Sevgili Peygamberimiz ﷺ’in güzel bir hadisini ezberledin!',
  },
  fr: {
    hadithCount: 'Hadith {curr} sur {total}',
    shuffle: 'Aléatoire',
    showText: 'Texte arabe',
    showMeaning: 'Sens & Enseignement',
    narratedBy: 'Rapporté par {narrator}',
    playingAudio: 'Lecture en cours... (Pause)',
    listenAudio: 'Écouter les paroles prophétiques',
    meaningLabel: '💡 Ce que cela signifie pour toi :',
    deedLabel: '🌟 Action pratique aujourd’hui :',
    tapToFlip: '👆 Touche la carte pour la retourner',
    prev: 'Précédent',
    next: 'Suivant',
    memorized: 'Mémorisé ! 🌟',
    markMemorized: 'J’ai mémorisé ce hadith !',
    celebrationTitle: 'Macha’Allah, champion !',
    celebrationSub: 'Tu as mémorisé un noble hadith du Prophète ﷺ !',
  },
  de: {
    hadithCount: 'Hadith {curr} von {total}',
    shuffle: 'Zufällig',
    showText: 'Arabischen Text anzeigen',
    showMeaning: 'Bedeutung & Lehre',
    narratedBy: 'Überliefert von {narrator}',
    playingAudio: 'Audio wird abgespielt... (Pause)',
    listenAudio: 'Prophetische Worte anhören',
    meaningLabel: '💡 Was es für dich bedeutet:',
    deedLabel: '🌟 Setze das heute um:',
    tapToFlip: '👆 Antippen zum Umdrehen',
    prev: 'Zurück',
    next: 'Weiter',
    memorized: 'Gelernt! 🌟',
    markMemorized: 'Ich habe diesen Hadith gelernt!',
    celebrationTitle: 'Mascha’Allah, wunderbar!',
    celebrationSub: 'Du hast einen gesegneten Hadith des Propheten ﷺ gelernt!',
  },
  es: {
    hadithCount: 'Hadiz {curr} de {total}',
    shuffle: 'Aleatorio',
    showText: 'Ver texto en árabe',
    showMeaning: 'Ver significado y lección',
    narratedBy: 'Narrado por {narrator}',
    playingAudio: 'Reproduciendo... (Pausar)',
    listenAudio: 'Escuchar las palabras proféticas',
    meaningLabel: '💡 Lo que significa para ti:',
    deedLabel: '🌟 Practica esto hoy:',
    tapToFlip: '👆 Toca la tarjeta para girarla',
    prev: 'Anterior',
    next: 'Siguiente',
    memorized: '¡Memorizado! 🌟',
    markMemorized: '¡He memorizado este hadiz!',
    celebrationTitle: '¡Masha’Allah, excelente!',
    celebrationSub: '¡Has memorizado un bendito hadiz del Profeta ﷺ!',
  },
};

export default function HadithFlashcardsScreen() {
  const { language, addStars, addGems } = useAppStore();
  const t = TRANSLATIONS[language];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const isRtl = isRTL(language);
  const langKey = (CARDS_I18N[language as SupportedLanguage] ? language : 'en') as SupportedLanguage;
  const c = CARDS_I18N[langKey];

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
          fallbackRoute="/sunnah"
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
            { flexDirection: isRtl ? 'row-reverse' : 'row' },
          ]}
        >
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {c.hadithCount
                .replace('{curr}', String(currentIndex + 1))
                .replace('{total}', String(hadithList.length))}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.shuffleBtn}
            onPress={handleShuffle}
            activeOpacity={0.8}
          >
            <Ionicons name="shuffle" size={18} color="#267960" />
            <Text style={styles.shuffleText}>
              {c.shuffle}
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
                { flexDirection: isRtl ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={styles.themeBadge}>
                <Text style={styles.themeBadgeText}>
                  {language === 'ar' ? currentHadith.titleAr : currentHadith.titleEn}
                </Text>
              </View>

              <View style={styles.flipHintPill}>
                <Ionicons name="sync" size={14} color="#789087" />
                <Text style={styles.flipHintText}>
                  {isFlipped ? c.showText : c.showMeaning}
                </Text>
              </View>
            </View>

            {/* CARD FRONT: Arabic Hadith & Audio */}
            {!isFlipped ? (
              <View style={styles.frontContent}>
                <Text style={[styles.narratorText, isRtl && { textAlign: 'right' }]}>
                  {c.narratedBy.replace(
                    '{narrator}',
                    language === 'ar' ? currentHadith.narratorAr : currentHadith.narratorEn
                  )}
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
                    { flexDirection: isRtl ? 'row-reverse' : 'row' },
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
                    {isPlayingAudio ? c.playingAudio : c.listenAudio}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* CARD BACK: Meaning, Kid Story Lesson, and Action */
              <View style={styles.backContent}>
                <View style={styles.meaningBox}>
                  <Text style={[styles.meaningLabel, isRtl && { textAlign: 'right' }]}>
                    {c.meaningLabel}
                  </Text>
                  <Text style={[styles.meaningText, isRtl && { textAlign: 'right' }]}>
                    {language === 'ar'
                      ? currentHadith.explanationAr
                      : currentHadith.explanationEn}
                  </Text>
                </View>

                <View style={styles.deedBox}>
                  <Text style={[styles.deedLabel, isRtl && { textAlign: 'right' }]}>
                    {c.deedLabel}
                  </Text>
                  <Text style={[styles.deedText, isRtl && { textAlign: 'right' }]}>
                    {language === 'ar'
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
              {c.tapToFlip}
            </Text>
          </View>
        </TouchableOpacity>

        {/* CONTROLS BAR: Prev, Memorized, Next */}
        <View
          style={[
            styles.controlsRow,
            { flexDirection: isRtl ? 'row-reverse' : 'row' },
          ]}
        >
          <TouchableOpacity
            style={[styles.navDeckBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            onPress={handlePrev}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRtl ? 'arrow-forward' : 'arrow-back'}
              size={22}
              color="#267960"
            />
            <Text style={styles.navDeckBtnText}>
              {c.prev}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.memorizeBtn,
              isMemorized && styles.memorizeBtnDone,
              { flexDirection: isRtl ? 'row-reverse' : 'row' },
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
              {isMemorized ? c.memorized : c.markMemorized}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navDeckBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.navDeckBtnText}>
              {c.next}
            </Text>
            <Ionicons
              name={isRtl ? 'arrow-back' : 'arrow-forward'}
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
        title={c.celebrationTitle}
        subtitle={c.celebrationSub}
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

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordMeaning } from '@/data/quranWordsData';
import { audioService } from '@/services/audioService';
import { SHADOWS, RADIUS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

import { isRTL, SupportedLanguage } from '@/constants/i18n';

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');
const ICON_STAR_IMG = require('../../assets/images/icon-star-3d.jpg');

interface WordMeaningBubbleModalProps {
  visible: boolean;
  wordMeaning: WordMeaning | null;
  ayahNumber?: number;
  onClose: () => void;
}

const WORD_MODAL_I18N: Record<
  SupportedLanguage,
  {
    title: string;
    fromAyah: string;
    pronouncing: string;
    listen: string;
    meaningLabel: string;
    exampleLabel: string;
    rewardText: string;
    closeBtn: string;
  }
> = {
  ar: {
    title: 'معجم نور الصغير',
    fromAyah: 'من الآية الكريمة ({num})',
    pronouncing: 'نطق الكلمة...',
    listen: 'استمع لنطق الكلمة',
    meaningLabel: '🌱 المعنى المبسط:',
    exampleLabel: '💡 في حياتنا اليومية:',
    rewardText: 'أحسنت! الاستماع للكلمة يمنحك +1 نجمة ✦',
    closeBtn: 'فهمت المعنى، شكراً نور! ✨',
  },
  en: {
    title: 'Noor’s Word Garden',
    fromAyah: 'From Ayah ({num})',
    pronouncing: 'Pronouncing...',
    listen: 'Listen to pronunciation',
    meaningLabel: '🌱 Kid Meaning:',
    exampleLabel: '💡 In our daily life:',
    rewardText: 'MashaAllah! Exploring words earns you +1 star ✦',
    closeBtn: 'I understood, thank you Noor! ✨',
  },
  bn: {
    title: 'নূরের ছোট্ট শব্দকোষ',
    fromAyah: 'পবিত্র আয়াত ({num}) থেকে',
    pronouncing: 'উচ্চারণ হচ্ছে...',
    listen: 'শব্দের উচ্চারণ শুনুন',
    meaningLabel: '🌱 সহজ অর্থ:',
    exampleLabel: '💡 আমাদের দৈনন্দিন জীবনে:',
    rewardText: 'মাশাআল্লাহ! নতুন শব্দ শেখার জন্য +১ তারা ✦',
    closeBtn: 'বুঝেছি, ধন্যবাদ নূর! ✨',
  },
  ru: {
    title: 'Детский словарик Нура',
    fromAyah: 'Из благородного аята ({num})',
    pronouncing: 'Произношение...',
    listen: 'Послушать произношение',
    meaningLabel: '🌱 Простое значение:',
    exampleLabel: '💡 В нашей жизни:',
    rewardText: 'Молодец! За изучение слова +1 звезда ✦',
    closeBtn: 'Понятно, спасибо Нур! ✨',
  },
  ur: {
    title: 'نور کی چھوٹی لغت',
    fromAyah: 'مبارک آیت ({num}) سے',
    pronouncing: 'تلفظ سن رہے ہیں...',
    listen: 'لفظ کا تلفظ سنیں',
    meaningLabel: '🌱 آسان مفہوم:',
    exampleLabel: '💡 ہماری روزمرہ زندگی میں:',
    rewardText: 'ماشاء اللہ! لفظ سننے پر +1 ستارہ ✦',
    closeBtn: 'سمجھ گیا، شکریہ نور! ✨',
  },
  id: {
    title: 'Kamus Cilik Noor',
    fromAyah: 'Dari Ayat ({num})',
    pronouncing: 'Melafalkan...',
    listen: 'Dengarkan pelafalan',
    meaningLabel: '🌱 Makna Sederhana:',
    exampleLabel: '💡 Dalam kehidupan kita:',
    rewardText: 'Masha Allah! Mengenal kata memberimu +1 bintang ✦',
    closeBtn: 'Aku sudah paham, terima kasih Noor! ✨',
  },
  tr: {
    title: 'Nur’un Küçük Sözlüğü',
    fromAyah: 'Ayet ({num})’den',
    pronouncing: 'Seslendiriliyor...',
    listen: 'Telaffuzunu dinle',
    meaningLabel: '🌱 Kolay Anlamı:',
    exampleLabel: '💡 Günlük hayatımızda:',
    rewardText: 'Maşaallah! Kelimeyi öğrenmek sana +1 yıldız kazandırdı ✦',
    closeBtn: 'Anladım, teşekkürler Nur! ✨',
  },
  fr: {
    title: 'Le Petit Dictionnaire de Noor',
    fromAyah: 'Du noble verset ({num})',
    pronouncing: 'Prononciation...',
    listen: 'Écouter la prononciation',
    meaningLabel: '🌱 Sens simple :',
    exampleLabel: '💡 Dans notre quotidien :',
    rewardText: 'Macha’Allah ! Découvrir des mots te rapporte +1 étoile ✦',
    closeBtn: 'J’ai compris, merci Noor ! ✨',
  },
  de: {
    title: 'Noors kleines Wörterbuch',
    fromAyah: 'Aus Vers ({num})',
    pronouncing: 'Aussprache...',
    listen: 'Aussprache anhören',
    meaningLabel: '🌱 Einfache Bedeutung:',
    exampleLabel: '💡 Im täglichen Leben:',
    rewardText: 'Mascha’Allah! Wörter lernen bringt dir +1 Stern ✦',
    closeBtn: 'Verstanden, danke Noor! ✨',
  },
  es: {
    title: 'El Pequeño Diccionario de Noor',
    fromAyah: 'De la aleya ({num})',
    pronouncing: 'Pronunciando...',
    listen: 'Escuchar pronunciación',
    meaningLabel: '🌱 Significado sencillo:',
    exampleLabel: '💡 En nuestra vida diaria:',
    rewardText: '¡Masha’Allah! Aprender palabras te da +1 estrella ✦',
    closeBtn: '¡Entendido, gracias Noor! ✨',
  },
};

export default function WordMeaningBubbleModal({
  visible,
  wordMeaning,
  ayahNumber,
  onClose,
}: WordMeaningBubbleModalProps) {
  const { language, addStars } = useAppStore();
  const isRtl = isRTL(language);
  const langKey = (WORD_MODAL_I18N[language as SupportedLanguage] ? language : 'en') as SupportedLanguage;
  const wm = WORD_MODAL_I18N[langKey];

  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [hasAwardedWord, setHasAwardedWord] = useState(false);

  if (!visible || !wordMeaning) return null;

  const handlePlayWord = async () => {
    if (isPlayingWord) {
      await audioService.stopDua();
      setIsPlayingWord(false);
      return;
    }

    setIsPlayingWord(true);
    // Award 1 star the first time kid listens to a word
    if (!hasAwardedWord) {
      addStars(1);
      setHasAwardedWord(true);
    }

    await audioService.playDua(wordMeaning.wordArabic, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingWord(false);
      }
    });
  };

  const handleClose = () => {
    if (isPlayingWord) {
      audioService.stopDua();
      setIsPlayingWord(false);
    }
    setHasAwardedWord(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bubbleCard}>
          {/* Header Row with Noor Mascot */}
          <View
            style={[
              styles.headerRow,
              { flexDirection: isRtl ? 'row-reverse' : 'row' },
            ]}
          >
            <View
              style={{
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View style={styles.mascotThumb}>
                <Image source={MASCOT_NOOR_IMG} style={styles.mascotImg} />
              </View>
              <View>
                <Text style={styles.titleLabel}>
                  {wm.title}
                </Text>
                {ayahNumber && (
                  <Text style={styles.ayahSub}>
                    {wm.fromAyah.replace('{num}', String(ayahNumber))}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={20} color="#788b83" />
            </TouchableOpacity>
          </View>

          {/* Large Word Display Box */}
          <View style={styles.wordBox}>
            <Text style={styles.arabicWordText}>{wordMeaning.wordArabic}</Text>

            {/* Audio Listen Button */}
            <TouchableOpacity
              style={[
                styles.audioListenBtn,
                isPlayingWord && styles.audioListenBtnPlaying,
                { flexDirection: isRtl ? 'row-reverse' : 'row' },
              ]}
              onPress={handlePlayWord}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlayingWord ? 'pause' : 'volume-high'}
                size={18}
                color={isPlayingWord ? '#ffffff' : '#0d9488'}
              />
              <Text
                style={[
                  styles.audioListenBtnText,
                  isPlayingWord && { color: '#ffffff' },
                ]}
              >
                {isPlayingWord ? wm.pronouncing : wm.listen}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Meaning Content */}
          <View style={styles.contentWrap}>
            <View style={styles.meaningRow}>
              <Text style={styles.badgeLabel}>
                {wm.meaningLabel}
              </Text>
              <Text
                style={[
                  styles.meaningText,
                  isRtl ? { textAlign: 'right' } : { textAlign: 'left' },
                ]}
              >
                {language === 'ar' ? wordMeaning.meaningAr : wordMeaning.meaningEn}
              </Text>
            </View>

            {wordMeaning.childExampleAr && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>
                  {wm.exampleLabel}
                </Text>
                <Text
                  style={[
                    styles.exampleText,
                    isRtl ? { textAlign: 'right' } : { textAlign: 'left' },
                  ]}
                >
                  {language === 'ar' ? wordMeaning.childExampleAr : wordMeaning.childExampleEn}
                </Text>
              </View>
            )}
          </View>

          {/* Star Reward Encouragement */}
          <View
            style={[
              styles.rewardRow,
              { flexDirection: isRtl ? 'row-reverse' : 'row' },
            ]}
          >
            <Image source={ICON_STAR_IMG} style={styles.starIcon} resizeMode="contain" />
            <Text style={styles.rewardText}>
              {wm.rewardText}
            </Text>
          </View>

          {/* Close Action Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleClose}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>
              {wm.closeBtn}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 34, 26, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  bubbleCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xxl,
    padding: 22,
    borderWidth: 2,
    borderColor: '#e8f4ec',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
  },
  mascotImg: {
    width: '100%',
    height: '100%',
  },
  titleLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#153e35',
  },
  ayahSub: {
    fontSize: 11,
    color: '#768780',
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2f4f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBox: {
    backgroundColor: '#f7faf7',
    borderRadius: RADIUS.lg,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ddede2',
    marginBottom: 16,
  },
  arabicWordText: {
    fontFamily: 'Amiri-Bold',
    fontSize: 34,
    color: '#0f766e',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 52,
  },
  audioListenBtn: {
    backgroundColor: '#e6f7f3',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#bbf0e4',
  },
  audioListenBtnPlaying: {
    backgroundColor: '#0d9488',
    borderColor: '#0f766e',
  },
  audioListenBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d9488',
  },
  contentWrap: {
    gap: 12,
    marginBottom: 16,
  },
  meaningRow: {
    backgroundColor: '#fffdf6',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#b45309',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#292524',
    lineHeight: 22,
  },
  exampleBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  exampleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
    marginBottom: 2,
  },
  exampleText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
    fontWeight: '600',
  },
  rewardRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: '#fffbeb',
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706',
  },
  actionBtn: {
    backgroundColor: '#10b981',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
});

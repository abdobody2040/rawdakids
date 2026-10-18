// Mascot Noor (فانوس نور المحبوب)
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

import { isRTL, SupportedLanguage } from '@/constants/i18n';

interface MascotNoorProps {
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ENCOURAGEMENTS_BY_LANG: Record<SupportedLanguage, string[]> = {
  ar: [
    'أنت بطل رائع ومثابر!',
    'ما شاء الله عليك، يا ذكي!',
    'كل آية تحفظها نور في قلبك!',
    'رسولنا الحبيب ﷺ يحب الأطفال الطيبين!',
    'هيا نستمر ونجمع المزيد من النجوم!',
  ],
  en: [
    'You are doing wonderfully!',
    'Masha’Allah, you are super smart!',
    'Every ayah memorized is light in your heart!',
    'Our beloved Prophet ﷺ loves kind children!',
    'Let’s keep going and collect more stars!',
  ],
  bn: [
    'তুমি চমৎকার করছ, এগিয়ে যাও!',
    'মাশাআল্লাহ, তুমি ভীষণ বুদ্ধিমান!',
    'প্রতিটি আয়াত তোমার হৃদয়ের আলো!',
    'আমাদের প্রিয় নবী ﷺ সৎ শিশুদের ভালোবাসেন!',
    'চলো আরও অনেক উজ্জ্বল তারা সংগ্রহ করি!',
  ],
  ru: [
    'Ты замечательно стараешься!',
    'Машааллах, какой ты умница!',
    'Каждый выученный аят — свет в твоем сердце!',
    'Наш любимый Пророк ﷺ любит добрых детей!',
    'Давай продолжать и собирать больше звезд!',
  ],
  ur: [
    'آپ بہت شاندار محنت کر رہے ہیں!',
    'ماشاء اللہ، آپ بہت ذہین ہیں!',
    'ہر یاد کی گئی آیت آپ کے دل کا نور ہے!',
    'ہمارے پیارے نبی ﷺ اچھے بچوں سے محبت فرماتے ہیں!',
    'آئیے آگے بڑھیں اور مزید ستارے جمع کریں!',
  ],
  id: [
    'Kamu luar biasa dan tekun!',
    'Masha Allah, kamu sangat pintar!',
    'Setiap ayat yang dihafal adalah cahaya di hatimu!',
    'Nabi kita tercinta ﷺ mencintai anak-anak yang baik!',
    'Ayo terus kumpulkan lebih banyak bintang!',
  ],
  tr: [
    'Harika gidiyorsun, tebrikler!',
    'Maşaallah, çok zekisin!',
    'Ezberlediğin her ayet kalbinde bir nurdur!',
    'Sevgili Peygamberimiz ﷺ iyi çocukları çok sever!',
    'Hadi devam edelim ve daha fazla yıldız toplayalım!',
  ],
  fr: [
    'Tu fais des progrès magnifiques !',
    'Macha’Allah, tu es très intelligent !',
    'Chaque verset mémorisé est une lumière dans ton cœur !',
    'Notre bien-aimé Prophète ﷺ aime les enfants bienveillants !',
    'Continuons ensemble pour récolter plus d’étoiles !',
  ],
  de: [
    'Du machst das wunderbar!',
    'Mascha’Allah, du bist so klug!',
    'Jeder gelernte Vers ist ein Licht in deinem Herzen!',
    'Unser geliebter Prophet ﷺ liebt gütige Kinder!',
    'Lass uns weitermachen und mehr Sterne sammeln!',
  ],
  es: [
    '¡Lo estás haciendo de maravilla!',
    '¡Masha’Allah, qué inteligente eres!',
    '¡Cada aleya aprendida es luz en tu corazón!',
    '¡Nuestro amado Profeta ﷺ ama a los niños buenos!',
    '¡Sigamos adelante y reunamos más estrellas!',
  ],
};

const MASCOT_IMG = require('../../assets/images/mascot-noor.jpg');

export default function MascotNoor({ customMessage, size = 'md' }: MascotNoorProps) {
  const { language } = useAppStore();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const isRtl = isRTL(language);
  const langKey = (ENCOURAGEMENTS_BY_LANG[language as SupportedLanguage] ? language : 'en') as SupportedLanguage;
  const messages = ENCOURAGEMENTS_BY_LANG[langKey];
  const currentText = customMessage || messages[quoteIndex % messages.length];

  const handleTap = () => {
    setQuoteIndex((prev) => prev + 1);
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View style={[styles.container, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
      <TouchableOpacity
        style={[
          styles.mascotBadge,
          isSmall && styles.badgeSm,
          isLarge && styles.badgeLg,
        ]}
        onPress={handleTap}
        activeOpacity={0.85}
      >
        <Image
          source={MASCOT_IMG}
          style={[
            styles.mascotImage,
            isSmall && styles.imageSm,
            isLarge && styles.imageLg,
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.bubble}>
        <View
          style={[
            styles.arrow,
            isRtl ? styles.arrowRight : styles.arrowLeft,
          ]}
        />
        <Text
          style={[
            styles.bubbleText,
            isSmall && styles.bubbleTextSm,
            isLarge && styles.bubbleTextLg,
            isRtl && { textAlign: 'right' },
          ]}
        >
          {currentText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.sm + 2,
    marginVertical: SPACING.xs,
  },
  mascotBadge: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff4db',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffc14d',
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  badgeSm: {
    width: 42,
    height: 42,
    borderWidth: 2,
  },
  badgeLg: {
    width: 78,
    height: 78,
    borderWidth: 3,
    borderColor: '#ffb326',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },
  imageSm: {
    width: '100%',
    height: '100%',
  },
  imageLg: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#faecd1',
    ...SHADOWS.soft,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    top: '38%',
    width: 12,
    height: 12,
    backgroundColor: '#ffffff',
    borderColor: '#faecd1',
  },
  arrowLeft: {
    left: -7,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  arrowRight: {
    right: -7,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#28463c',
    lineHeight: 19,
  },
  bubbleTextSm: {
    fontSize: 12,
    lineHeight: 16,
  },
  bubbleTextLg: {
    fontSize: 15,
    lineHeight: 22,
  },
});

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Vibration,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import SunnahHeroHeader from '@/components/SunnahHeroHeader';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { audioService } from '@/services/audioService';
import { tasbihService } from '@/services/tasbihService';

export interface DhikrItem {
  id: string;
  textArabic: string;
  transliteration: string;
  meaningAr: string;
  meaningEn: string;
  defaultTarget: number;
  rewardNoteAr: string;
  rewardNoteEn: string;
  colorScheme: readonly [string, string];
}


const DHIKR_LOCALIZATIONS: Record<string, Partial<Record<string, { meaning: string; reward: string }>>> = {
  subhanallah: {
    bn: { meaning: 'সকল ত্রুটি ও অপূর্ণতা থেকে আল্লাহ মহাপবিত্র', reward: 'জান্নাতে তোমার জন্য একটি বরকতময় খেজুর গাছ রোপণ করা হলো 🌴' },
    ru: { meaning: 'Пречист Аллах от всякого недостатка', reward: 'Благословенная пальма сажается для тебя в Раю 🌴' },
    ur: { meaning: 'اللہ تعالیٰ ہر عیب اور نقص سے پاک ہے', reward: 'جنت میں آپ کے لیے ایک مبارک کھجور کا درخت لگا دیا گیا 🌴' },
    id: { meaning: 'Maha Suci Allah dari segala kekurangan', reward: 'Pohon kurma penuh berkah ditanam untukmu di Surga 🌴' },
    tr: { meaning: 'Allah her türlü noksanlıktan münezzehtir', reward: 'Cennette senin için mübarek bir hurma ağacı dikildi 🌴' },
    fr: { meaning: 'Gloire à Allah au-delà de toute imperfection', reward: 'Un palmier béni est planté pour toi au Paradis 🌴' },
    de: { meaning: 'Gepriesen sei Allah über jeden Mangel erhaben', reward: 'Eine gesegnete Palme wird für dich im Paradies gepflanzt 🌴' },
    es: { meaning: 'Gloria a Allah por encima de toda imperfección', reward: 'Una palmera bendita se planta para ti en el Paraíso 🌴' },
  },
  alhamdulillah: {
    bn: { meaning: 'সকল প্রশংসা ও কৃতজ্ঞতা কেবল আল্লাহর জন্য', reward: 'নেকির পাল্লাকে মহান আলো ও কল্যাণে পূর্ণ করে ⚖️' },
    ru: { meaning: 'Вся хвала и благодарность принадлежат Аллаху', reward: 'Наполняет чашу добрых дел великим светом ⚖️' },
    ur: { meaning: 'تمام تعریفیں اور شکر اللہ کے لیے ہیں', reward: 'نیکیوں کے ترازو کو عظیم خیر سے بھر دیتا ہے ⚖️' },
    id: { meaning: 'Segala puji dan syukur hanya milik Allah', reward: 'Memenuhi timbangan amal kebaikan dengan cahaya ⚖️' },
    tr: { meaning: 'Bütün hamd ve şükürler yalnızca Allah’a aittir', reward: 'Mizanı büyük bir hayır ve nur ile doldurur ⚖️' },
    fr: { meaning: 'Toute louange et gratitude reviennent à Allah', reward: 'Remplit la balance des bonnes actions de lumière ⚖️' },
    de: { meaning: 'Alles Lob und aller Dank gebührt Allah', reward: 'Füllt die Waage der guten Taten mit Licht ⚖️' },
    es: { meaning: 'Toda alabanza y gratitud pertenecen a Allah', reward: 'Llena la balanza de las buenas obras de luz ⚖️' },
  },
  allahuakbar: {
    bn: { meaning: 'আল্লাহ সবকিছুর চেয়ে মহান ও শ্রেষ্ঠতম', reward: 'অন্তরকে শক্তি, সাহস ও প্রশান্তিতে ভরিয়ে দেয় 🛡️' },
    ru: { meaning: 'Аллах превыше и величественнее всего', reward: 'Наполняет сердце мужеством и спокойствием 🛡️' },
    ur: { meaning: 'اللہ تعالیٰ ہر چیز سے بڑا اور بلند ہے', reward: 'دل کو سکون اور ایمان کی طاقت عطا کرتا ہے 🛡️' },
    id: { meaning: 'Allah Maha Besar atas segala sesuatu', reward: 'Memenuhi hati dengan ketenangan dan keberanian 🛡️' },
    tr: { meaning: 'Allah her şeyden daha büyük ve yücedir', reward: 'Kalbe huzur, cesaret ve manevi güç verir 🛡️' },
    fr: { meaning: 'Allah est plus Grand que toute chose', reward: 'Remplit le cœur d’apaisement et de courage 🛡️' },
    de: { meaning: 'Allah ist größer als alles andere', reward: 'Erfüllt das Herz mit Ruhe und Mut 🛡️' },
    es: { meaning: 'Allah es Más Grande que todas las cosas', reward: 'Llena el corazón de paz y valentía 🛡️' },
  },
  lailahaillallah: {
    bn: { meaning: 'আল্লাহ ব্যতীত সত্য কোনো উপাস্য নেই', reward: 'সর্বোত্তম জিকির এবং জান্নাতের চাবিকাঠি 🗝️' },
    ru: { meaning: 'Нет бога достойного поклонения кроме Аллаха', reward: 'Лучшее поминание и ключ к Раю 🗝️' },
    ur: { meaning: 'اللہ کے سوا کوئی سچا معبود نہیں', reward: 'افضل ترین ذکر اور جنت کی چابی 🗝️' },
    id: { meaning: 'Tiada Tuhan yang berhak disembah selain Allah', reward: 'Dzikir terbaik dan kunci pintu Surga 🗝️' },
    tr: { meaning: 'Allah’tan başka hak ilah yoktur', reward: 'Zikirlerin en faziletlisi ve Cennetin anahtarıdır 🗝️' },
    fr: { meaning: 'Nul n’est digne d’adoration excepté Allah', reward: 'La meilleure évocation et la clé du Paradis 🗝️' },
    de: { meaning: 'Es gibt keinen anbetungswürdigen Gott außer Allah', reward: 'Das beste Gedenken und der Schlüssel zum Paradies 🗝️' },
    es: { meaning: 'No hay más deidad digna de adoración que Allah', reward: 'El mejor recuerdo y la llave del Paraíso 🗝️' },
  },
  salawat: {
    bn: { meaning: 'আমাদের প্রিয় নবী ﷺ-এর ওপর শান্তি ও বরকত বর্ষিত হোক', reward: 'যে একবার দরুদ পড়ে, আল্লাহ তাকে দশটি রহমত দান করেন 🌸' },
    ru: { meaning: 'Мир и благословение нашему любимому Пророку ﷺ', reward: 'Кто призовет благословение один раз, того Аллах благословит десятикратно 🌸' },
    ur: { meaning: 'ہمارے پیارے نبی ﷺ پر درود اور سلام', reward: 'جو آپ ﷺ پر ایک بار درود بھیجے، اللہ اس پر دس رحمتیں نازل فرماتا ہے 🌸' },
    id: { meaning: 'Shalawat dan berkah untuk Nabi kita tercinta ﷺ', reward: 'Barangsiapa bershalawat sekali, Allah melimpahkan sepuluh rahmat 🌸' },
    tr: { meaning: 'Sevgili Peygamberimiz Hz. Muhammed’e ﷺ salat ve selam olsun', reward: 'Kim O’na bir salavat getirirse, Allah ona on rahmet bahşeder 🌸' },
    fr: { meaning: 'Paix et bénédictions sur notre bien-aimé Prophète ﷺ', reward: 'Quiconque prie sur lui une fois, Allah le bénit dix fois 🌸' },
    de: { meaning: 'Frieden und Segen auf unserem geliebten Propheten ﷺ', reward: 'Wer einmal für ihn betet, den segnet Allah zehnfach 🌸' },
    es: { meaning: 'Paz y bendiciones sobre nuestro amado Profeta ﷺ', reward: 'Quien pida bendiciones para él una vez, Allah le bendice diez veces 🌸' },
  },
  istighfar: {
    bn: { meaning: 'আমি আল্লাহর ক্ষমা চাই এবং তাওবা করে তাঁর দিকেই ফিরছি', reward: 'গুনাহ মোচন করে এবং জীবনে রহমত ও রিজিক আনে 🌧️' },
    ru: { meaning: 'Я прошу прощения у Аллаха и каюсь перед Ним', reward: 'Стирает грехи и приносит облегчение и удел 🌧️' },
    ur: { meaning: 'میں اللہ سے بخشش مانگتا ہوں اور اسی کی طرف رجوع کرتا ہوں', reward: 'گناہوں کو مٹاتا ہے اور رزق و آسانی لاتا ہے 🌧️' },
    id: { meaning: 'Aku memohon ampunan Allah dan bertobat kepada-Nya', reward: 'Menghapus dosa serta mendatangkan kemudahan dan rezeki 🌧️' },
    tr: { meaning: 'Allah’tan mağfiret diler ve O’na tövbe ederim', reward: 'Günahları siler, ferahlık ve bereketli rızık getirir 🌧️' },
    fr: { meaning: 'Je demande pardon à Allah et je reviens à Lui', reward: 'Efface les péchés et apporte le soulagement 🌧️' },
    de: { meaning: 'Ich bitte Allah um Vergebung und kehre reuig zu Ihm zurück', reward: 'Tilgt Sünden und schenkt Erleichterung und Segen 🌧️' },
    es: { meaning: 'Pido perdón a Allah y me vuelvo a Él con arrepentimiento', reward: 'Borra los errores y trae alivio y bendición 🌧️' },
  },
  subhanallahi_wabihamdih: {
    bn: { meaning: 'মুখে উচ্চারণে সহজ, মীজানের পাল্লায় ভারী ও রহমানের নিকট অতি প্রিয়', reward: 'মীজানে ভারী এবং পরম দয়াময়ের প্রিয় ⭐' },
    ru: { meaning: 'Два слова, легкие для языка и тяжелые на Весах', reward: 'Любимы Милостивым и тяжелы на Весах деяний ⭐' },
    ur: { meaning: 'زبان پر ہلکے اور میزان میں بھاری کلمات', reward: 'رحمان کو محبوب اور نیکیوں کے ترازو میں بھاری ⭐' },
    id: { meaning: 'Dua kalimat yang ringan di lisan dan berat di timbangan', reward: 'Dicintai oleh Ar-Rahman dan berat di timbangan ⭐' },
    tr: { meaning: 'Dile hafif, mizanda ağır, Rahman’a çok sevimli iki kelime', reward: 'Mizanda çok ağır ve Rahman olan Allah’a pek sevimlidir ⭐' },
    fr: { meaning: 'Deux paroles légères sur la langue, lourdes sur la balance', reward: 'Aimées du Tout-Miséricordieux et lourdes sur la balance ⭐' },
    de: { meaning: 'Zwei Worte, leicht auf der Zunge, schwer auf der Waage', reward: 'Geliebt vom Allerbarmer und schwer auf der Waage ⭐' },
    es: { meaning: 'Dos palabras ligeras en la lengua, pesadas en la balanza', reward: 'Amadas por el Clementísimo y pesadas en la balanza ⭐' },
  },
  hawqalah: {
    bn: { meaning: 'আল্লাহর সাহায্য ও শক্তি ব্যতীত কোনো শক্তি বা সামর্থ্য নেই', reward: 'জান্নাতের অমূল্য ভাণ্ডারসমূহের একটি রত্ন 💎' },
    ru: { meaning: 'Нет мощи и силы ни у кого кроме как с помощью Аллаха', reward: 'Одно из драгоценных сокровищ Рая 💎' },
    ur: { meaning: 'اللہ کی مدد کے بغیر کسی برائی سے بچنے اور نیکی کرنے کی طاقت نہیں', reward: 'جنت کے خزانوں میں سے ایک قیمتی خزانہ 💎' },
    id: { meaning: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah', reward: 'Salah satu simpanan harta berharga di Surga 💎' },
    tr: { meaning: 'Allah’ın güç ve yardımı olmadan hiçbir şeye güç yetmez', reward: 'Cennet hazinelerinden çok kıymetli bir hazine 💎' },
    fr: { meaning: 'Il n’y a de puissance ni de force qu’en Allah', reward: 'Un trésor précieux parmi les trésors du Paradis 💎' },
    de: { meaning: 'Es gibt keine Macht noch Kraft außer durch Allah', reward: 'Ein kostbarer Schatz aus den Schätzen des Paradieses 💎' },
    es: { meaning: 'No hay poder ni fuerza sino con Allah', reward: 'Un tesoro precioso de los tesoros del Paraíso 💎' },
  },
};

const TASBIH_PROPHET_BENEFITS: Record<string, string> = {
  ar: '«مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلاةٍ ثَلاثاً وَثَلاثِينَ، وَحَمِدَ اللَّهَ ثَلاثاً وَثَلاثِينَ، وَكَبَّرَ اللَّهَ ثَلاثاً وَثَلاثِينَ، فَتِلْكَ تِسْعَةٌ وَتِسْعُونَ، وَقَالَ تَمَامَ الْمِائَةِ: لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ... غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ»',
  en: 'Saying SubhanAllah (33), Alhamdulillah (33), and Allahu Akbar (33) after prayer forgives shortcomings and brings immense peace.',
  bn: 'ফরজ সালাতের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ ও ৩৩ বার আল্লাহু আকবার পাঠ করলে অন্তর শান্তিময় হয় এবং গুনাহ মাফ হয়।',
  ru: 'Произнесение после молитвы Субханаллах (33), Альхамдулиллях (33) и Аллаху Акбар (33) очищает от грехов и приносит глубокий покой.',
  ur: 'نماز کے بعد 33 بار سبحان اللہ، 33 بار الحمد للہ اور 33 بار اللہ اکبر پڑھنا گناہوں کی بخشش اور دل کے سکون کا ذریعہ ہے۔',
  id: 'Membaca Subhanallah (33x), Alhamdulillah (33x), dan Allahu Akbar (33x) setiap selesai shalat membawa ketenangan dan ampunan dosa.',
  tr: 'Namazlardan sonra 33 defa Sübhanallah, 33 defa Elhamdülillah ve 33 defa Allahu Ekber demek kalbe huzur verir ve günahları bağışlatır.',
  fr: 'Dire SubhanAllah (33 fois), Alhamdulillah (33 fois) et Allahu Akbar (33 fois) après la prière apporte paix au cœur et pardon.',
  de: 'Das Aufsagen von SubhanAllah (33), Alhamdulillah (33) und Allahu Akbar (33) nach dem Gebet schenkt inneren Frieden und Vergebung.',
  es: 'Decir SubhanAllah (33), Alhamdülillah (33) y Allahu Akbar (33) tras la oración trae paz al corazón y perdón de faltas.',
};

function getLocalizedDhikr(dhikr: DhikrItem, lang: string): { meaning: string; reward: string } {
  if (lang === 'ar') {
    return { meaning: dhikr.meaningAr, reward: dhikr.rewardNoteAr };
  }
  const custom = DHIKR_LOCALIZATIONS[dhikr.id]?.[lang];
  if (custom) return custom;
  return { meaning: dhikr.meaningEn, reward: dhikr.rewardNoteEn };
}

export const DHIKR_LIST: DhikrItem[] = [
  {
    id: 'subhanallah',
    textArabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    meaningAr: 'أُنَزِّهُ اللَّهَ عَنْ كُلِّ عَيْبٍ وَنَقْصٍ',
    meaningEn: 'Glory be to Allah above any imperfection',
    defaultTarget: 33,
    rewardNoteAr: 'شجرة طيبة تُغرس لك في الجنة 🌴',
    rewardNoteEn: 'A blessed palm tree planted in Jannah 🌴',
    colorScheme: ['#047857', '#065F46'] as const,
  },
  {
    id: 'alhamdulillah',
    textArabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    meaningAr: 'الشُّكْرُ وَالثَّنَاءُ الْكَامِلُ لِلَّهِ عَلَى نِعَمِهِ',
    meaningEn: 'All praise and gratitude belong to Allah',
    defaultTarget: 33,
    rewardNoteAr: 'تملأ ميزان الحسنات بالخير العظيم ⚖️',
    rewardNoteEn: 'Fills the scale of good deeds with light ⚖️',
    colorScheme: ['#0284C7', '#0369A1'] as const,
  },
  {
    id: 'allahuakbar',
    textArabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    meaningAr: 'اللَّهُ أَعْظَمُ وَأَجَلُّ مِنْ كُلِّ شَيْءٍ',
    meaningEn: 'Allah is Greater than everything',
    defaultTarget: 33,
    rewardNoteAr: 'تزيد القلب سكينة وعزة وقوة 🛡️',
    rewardNoteEn: 'Fills the young heart with courage and tranquility 🛡️',
    colorScheme: ['#D97706', '#B45309'] as const,
  },
  {
    id: 'lailahaillallah',
    textArabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illā Allāh',
    meaningAr: 'لا مَعْبُودَ بِحَقٍّ فِي الْكَوْنِ إِلا اللَّهُ',
    meaningEn: 'There is none worthy of worship except Allah',
    defaultTarget: 33,
    rewardNoteAr: 'أفضل الذكر ومفتاح أبواب الجنة 🗝️',
    rewardNoteEn: 'The best remembrance and key to Jannah 🗝️',
    colorScheme: ['#7C3AED', '#6D28D9'] as const,
  },
  {
    id: 'istighfar',
    textArabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfiru Allāh',
    meaningAr: 'أَطْلُبُ مَغْفِرَةَ رَبِّي وَرَحْمَتَهُ الْوَاسِعَةَ',
    meaningEn: 'I seek Allah’s forgiveness and return to Him in repentance',
    defaultTarget: 33,
    rewardNoteAr: 'تَمْحُو الذُّنُوبَ وَتَجْلِبُ الرِّزْقَ وَالفَرَجَ 🌧️',
    rewardNoteEn: 'Brings forgiveness, ease, and endless blessings 🌧️',
    colorScheme: ['#0D9488', '#0F766E'] as const,
  },
];

// Web Audio Singleton
let sharedAudioCtx: any = null;

function getSharedAudioCtx(): any {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const win = window as any;
    const AudioCtx = win.AudioContext || win.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playBeadClickSound() {
  try {
    const ctx = getSharedAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    /* audio not supported */
  }
}

function playCompletionChimeSound() {
  try {
    const ctx = getSharedAudioCtx();
    if (!ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  } catch {
    /* audio not supported */
  }
}

export default function TasbihScreen() {
  const { language, activeProfileId, profiles, parentSettings } = useAppStore();
  const isAr = language === 'ar';
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const childId = activeProfile?.id || 'child_default';
  const ageMode = activeProfile?.ageBand || '7-9';

  const availableAzkar = tasbihService.getAzkarForAge(ageMode);
  const availableTargets = tasbihService.getTargetsForAge(ageMode);

  const [activeDhikr, setActiveDhikr] = useState<DhikrItem>(availableAzkar[0] as any);
  const [count, setCount] = useState<number>(0);
  const [customTarget, setCustomTarget] = useState<number>(availableTargets[2] || 33);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationReward, setCelebrationReward] = useState<{ rewarded: boolean; message: string }>({
    rewarded: true,
    message: '',
  });
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const lastTapRef = useRef<number>(0);
  const [scaleAnim] = useState(() => new Animated.Value(1));

  // Restore session from localDbService
  useEffect(() => {
    tasbihService.getDailyRecord(childId).then((record: any) => {
      setCompletedRounds(record.completions || 0);
      if (record.lastSession) {
        const found = availableAzkar.find((z: any) => z.id === record.lastSession.azkarId);
        if (found) setActiveDhikr(found as any);
        if (record.lastSession.target) setCustomTarget(record.lastSession.target);
        if (typeof record.lastSession.count === 'number') setCount(record.lastSession.count);
      }
    }).catch(() => {});
  }, [childId]);

  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  const handleTapBead = async () => {
    // 1. Rate limiting: ignore taps closer than 80ms apart (B2)
    const now = Date.now();
    if (now - lastTapRef.current < 80) return;
    lastTapRef.current = now;

    // 2. Audio & Haptic feedback (10ms light haptic)
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(10); } catch {}
      }
      if (parentSettings?.soundEffectsEnabled ?? false) {
        playBeadClickSound();
      }
    } else {
      try { Vibration.vibrate(10); } catch {}
    }

    // 3. Tactile button bounce
    scaleAnim.setValue(0.92);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: false,
    }).start();

    // 4. Counter logic
    const nextCount = count + 1;

    if (customTarget > 0 && nextCount >= customTarget) {
      // Reached Target!
      setCount(0);
      playCompletionChimeSound();

      const result = await tasbihService.handleTargetReached(childId, activeDhikr.id, customTarget);
      setCompletedRounds(result.totalCompletions);

      const message = result.rewarded
        ? 'مَا شَاءَ اللَّهُ! حَصَلْتَ عَلَى هَدِيَّةِ التَّسْبِيحِ 🌱'
        : 'أَحْسَنْتَ! عُدْ غَدًا لِلْهَدِيَّةِ (الْحَدُّ الْيَوْمِيُّ: ٣ هَدَايَا)';

      setCelebrationReward({
        rewarded: result.rewarded,
        message,
      });
      setShowCelebration(true);
    } else {
      setCount(nextCount);
      tasbihService.saveSession(childId, activeDhikr.id, customTarget, nextCount).catch(() => {});
    }
  };

  const handleResetRequest = () => {
    if (count === 0) {
      setCount(0);
      tasbihService.resetSession(childId, activeDhikr.id, customTarget).catch(() => {});
      return;
    }
    setPendingAction(() => () => {
      setCount(0);
      tasbihService.resetSession(childId, activeDhikr.id, customTarget).catch(() => {});
    });
    setShowResetConfirm(true);
  };

  const handleSelectDhikr = (dhikr: DhikrItem) => {
    if (count === 0) {
      setActiveDhikr(dhikr);
      return;
    }
    setPendingAction(() => () => {
      setActiveDhikr(dhikr);
      setCount(0);
      tasbihService.resetSession(childId, dhikr.id, customTarget).catch(() => {});
    });
    setShowResetConfirm(true);
  };

  const handleSelectTarget = (tVal: number) => {
    if (count === 0) {
      setCustomTarget(tVal);
      return;
    }
    setPendingAction(() => () => {
      setCustomTarget(tVal);
      setCount(0);
      tasbihService.resetSession(childId, activeDhikr.id, tVal).catch(() => {});
    });
    setShowResetConfirm(true);
  };

  const confirmResetAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowResetConfirm(false);
  };

  const cancelResetAction = () => {
    setPendingAction(null);
    setShowResetConfirm(false);
  };

  const remainingToTarget = Math.max(0, customTarget - count);
  const progressPercent =
    customTarget > 0 ? Math.min(100, Math.round((count / customTarget) * 100)) : 100;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header
          showBack
          fallbackRoute="/prayer"
          title={isAr ? 'الْمِسْبَحَةُ' : 'Tasbih'}
        />

        {/* Persistent Sunnah Navigation Hub Header */}
        <SunnahHeroHeader activeTab="tasbih" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Horizontal Dhikr Selector Chips */}
          <View style={styles.dhikrListWrap}>
            <Text style={[styles.sectionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
              {isAr ? 'اخْتَرِ الذِّكْرَ الْمُبَارَكَ:' : 'Choose Dhikr:'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.dhikrChipsRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              {availableAzkar.map((d: any) => {
                const isSelected = d.id === activeDhikr.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.dhikrChip,
                      isSelected && {
                        backgroundColor: d.colorScheme[0],
                        borderColor: d.colorScheme[1],
                      },
                    ]}
                    onPress={() => handleSelectDhikr(d as any)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={d.textArabic}
                  >
                    <Text
                      style={[
                        styles.dhikrChipText,
                        isSelected && styles.dhikrChipTextActive,
                      ]}
                    >
                      {d.textArabic}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Active Dhikr Card */}
          <LinearGradient
            colors={activeDhikr.colorScheme}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeDhikrCard}
          >
            <View style={styles.dhikrHeaderRow}>
              <TouchableOpacity
                style={styles.audioSpeakerBtn}
                onPress={() => audioService.playDua(activeDhikr.textArabic).catch(() => {})}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="استمع للذكر"
              >
                <Ionicons name="volume-high" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.activeDhikrArabic}>{activeDhikr.textArabic}</Text>
            </View>

            <Text style={styles.activeDhikrTranslit}>{activeDhikr.transliteration}</Text>
            <View style={styles.activeDhikrDivider} />
            <Text style={styles.activeDhikrMeaning}>
              {getLocalizedDhikr(activeDhikr, language).meaning}
            </Text>

            {/* Remaining To Target Banner */}
            <View style={styles.rewardPill}>
              <Ionicons name="sparkles" size={14} color="#FEF3C7" />
              <Text style={styles.rewardPillText}>
                بَقِيَتْ {remainingToTarget} تَسْبِيحَةً لِإِتْمَامِ الْهَدَفِ
              </Text>
            </View>
          </LinearGradient>

          {/* Target & Rounds Controller Row */}
          <View
            style={[
              styles.controlsRow,
              { flexDirection: isAr ? 'row-reverse' : 'row' },
            ]}
          >
            {/* Target Selectors */}
            <View style={[styles.targetsBox, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              {availableTargets.map((tVal: any) => (
                <TouchableOpacity
                  key={tVal}
                  style={[
                    styles.targetPill,
                    customTarget === tVal && styles.targetPillActive,
                  ]}
                  onPress={() => handleSelectTarget(tVal)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`الهدف ${tVal}`}
                >
                  <Text
                    style={[
                      styles.targetPillText,
                      customTarget === tVal && styles.targetPillTextActive,
                    ]}
                  >
                    {tVal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rounds Pill */}
            <View style={styles.roundsPill}>
              <Ionicons name="refresh-circle" size={16} color="#047857" />
              <Text style={styles.roundsPillText}>
                {isAr ? `الْمَرَّاتُ: ${completedRounds}` : `Rounds: ${completedRounds}`}
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetRequest}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="ابدأ من جديد"
            >
              <Ionicons name="reload" size={15} color="#64748B" />
              <Text style={styles.resetBtnText}>{isAr ? 'ابْدَأْ مِنْ جَدِيدٍ' : 'Reset'}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar (role="img" with Arabic label) */}
          <View
            style={styles.progressTrack}
            // @ts-ignore
            role="img"
            aria-label={`التسبيح: ${count} من ${customTarget}`}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: activeDhikr.colorScheme[0],
                },
              ]}
            />
          </View>

          {/* 170PX BIG CIRCULAR TASBIH BUTTON (B2) */}
          <View style={styles.bigButtonContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.bigTapButton,
                  {
                    shadowColor: activeDhikr.colorScheme[0],
                    borderColor: 'rgba(255, 255, 255, 0.45)',
                  },
                ]}
                onPressIn={handleTapBead}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="تسبيح"
              >
                <LinearGradient
                  colors={activeDhikr.colorScheme}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bigTapGradient}
                >
                  <View style={styles.innerHighlightRing}>
                    <Text style={styles.bigCounterNumber}>{count}</Text>
                    <Text style={styles.bigCounterTarget}>/ {customTarget}</Text>
                    <View style={styles.tapPromptBadge}>
                      <Ionicons name="finger-print" size={18} color="#FFFFFF" />
                      <Text style={styles.tapPromptText}>
                        {isAr ? 'اضْغَطْ هُنَا 👆' : 'Tap 👆'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Hadith Benefit Footer */}
          <View style={styles.footerBenefitBox}>
            <Text
              style={[
                styles.footerBenefitTitle,
                { textAlign: isAr ? 'right' : 'left' },
              ]}
            >
              {isAr ? '💡 هَدْيُ النَّبِيِّ ﷺ فِي التَّسْبِيحِ:' : '💡 Prophet Muhammad ﷺ taught us:'}
            </Text>
            <Text
              style={[
                styles.footerBenefitText,
                { textAlign: isAr ? 'right' : 'left' },
              ]}
            >
              {TASBIH_PROPHET_BENEFITS[language] || TASBIH_PROPHET_BENEFITS.ar}
            </Text>
          </View>
        </ScrollView>

        <AppBottomNav />
      </View>

      {/* Confirmation Modal when count > 0 */}
      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        onRequestClose={cancelResetAction}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Ionicons name="help-circle" size={40} color={COLORS.primary} />
            <Text style={styles.confirmTitle}>هَلْ تُرِيدُ البَدْءَ مِنْ جَدِيدٍ؟</Text>
            <Text style={styles.confirmSub}>
              سَيَتِمُّ إِعَادَةُ الْعَدَّادِ إِلَى الصِّفْرِ مَعَ حِفْظِ إِجْمَالِيِّ دَوْرَاتِكَ الْيَوْمِيَّةِ.
            </Text>
            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.confirmYesBtn}
                onPress={confirmResetAction}
                accessibilityRole="button"
                accessibilityLabel="نعم ابدأ من جديد"
              >
                <Text style={styles.confirmYesText}>نَعَمْ، ابْدَأْ مِنْ جَدِيدٍ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={cancelResetAction}
                accessibilityRole="button"
                accessibilityLabel="إلغاء ومتابعة التسبيح"
              >
                <Text style={styles.confirmCancelText}>مُتَابَعَةُ التَّسْبِيحِ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Target Reached Celebration Modal (B2) */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={celebrationReward.rewarded ? 15 : 0}
        gemsEarned={celebrationReward.rewarded ? 5 : 0}
        title={`أَتْمَمْتَ ${customTarget} تَسْبِيحَةً مُبَارَكَةً! 🎉`}
        subtitle={celebrationReward.message}
        onDismiss={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: 110,
    gap: SPACING.md,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  dhikrListWrap: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  dhikrChipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  dhikrChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
  },
  dhikrChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  dhikrChipTextActive: {
    color: '#FFFFFF',
  },
  activeDhikrCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  dhikrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  audioSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioSpeakerBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  activeDhikrArabic: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activeDhikrTranslit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  activeDhikrDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: '80%',
    marginVertical: 10,
  },
  activeDhikrMeaning: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    gap: 6,
    marginTop: 10,
  },
  rewardPillText: {
    fontSize: 12,
    color: '#FEF3C7',
    fontWeight: '700',
  },
  controlsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: SPACING.xs,
    ...SHADOWS.soft,
  },
  targetsBox: {
    gap: 4,
  },
  targetPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9',
  },
  targetPillActive: {
    backgroundColor: COLORS.primary,
  },
  targetPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  targetPillTextActive: {
    color: '#FFFFFF',
  },
  roundsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  roundsPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bigButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  bigTapButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 4,
    ...SHADOWS.medium,
  },
  bigTapGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  innerHighlightRing: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCounterNumber: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 50,
  },
  bigCounterTarget: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: -2,
  },
  tapPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  tapPromptText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerBenefitBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  footerBenefitTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  footerBenefitText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#78350F',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 10,
    textAlign: 'center',
  },
  confirmSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  confirmButtonsRow: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
    marginTop: SPACING.md,
  },
  confirmYesBtn: {
    backgroundColor: '#F43F5E',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  confirmYesText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmCancelBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
});

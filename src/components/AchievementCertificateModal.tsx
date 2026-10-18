// Achievement Certificate Modal for Kids (شهادة التقدير والإنجاز القابلة للطباعة)
import { useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');
const ICON_STAR_IMG = require('../../assets/images/icon-star-3d.jpg');

import { isRTL, SupportedLanguage } from '@/constants/i18n';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  certificateType?: 'surah' | 'arkan' | 'prophets' | 'manners' | 'general';
  title?: string;
  subtitle?: string;
}

const CERTIFICATE_I18N: Record<
  SupportedLanguage,
  {
    heading: string;
    print: string;
    ribbon: string;
    brandTitle: string;
    brandSubtitle: string;
    presentation: string;
    achievement: string;
    dua: string;
    dateLabel: string;
    sealLabel: string;
    verifiedLabel: string;
    defaultChampion: string;
    printPdf: string;
    continueBtn: string;
  }
> = {
  ar: {
    heading: '📜 شهادة فخر وإنجاز مباركة',
    print: 'طباعة الشهادة',
    ribbon: 'شَهَادَةُ إِتْمَامٍ وَتَمَيُّزٍ رَفِيعٍ',
    brandTitle: 'تَطْبِيقُ رَوْضَة كِيدْز',
    brandSubtitle: 'رِحْلَةُ الإِيمَانِ وَالْقُرْآنِ وَالأَخْلاقِ',
    presentation: 'تَفْخَرُ إِدَارَةُ "رَوْضَة كِيدْز" بِمَنْحِ هَذِهِ الشَّهَادَةِ التَّقْدِيرِيَّةِ لِلْبَطَلِ الْمُجْتَهِدِ:',
    achievement: 'تَقْدِيراً لِجُهْدِهِ الْمُبَارَكِ وَهِمَّتِهِ الْعَالِيَةِ فِي إِتْمَامِ وَحِفْظِ وَتَدَبُّرِ:',
    dua: '«سَائِلِينَ اللَّهَ تَعَالَى أَنْ يَجْعَلَ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قَلْبِهِ، وَنُورَ صَدْرِهِ، وَشَفِيعاً لَهُ وَلِوَالِدَيْهِ»',
    dateLabel: 'تَارِيخُ الإِنْجَازِ',
    sealLabel: 'خَتْمُ التَّمَيُّزِ',
    verifiedLabel: 'إِدَارَةُ التَّطْبِيقِ',
    defaultChampion: 'البطل الصغير',
    printPdf: '🖨️ طباعة الشهادة أو حفظها كـ PDF',
    continueBtn: 'متابعة رحلتي ➔',
  },
  en: {
    heading: '📜 Certificate of Honor',
    print: 'Print Certificate',
    ribbon: 'CERTIFICATE OF EXCELLENCE',
    brandTitle: 'RAWDAKIDS APP',
    brandSubtitle: 'Journey of Faith, Quran & Ethics',
    presentation: 'Rawdakids proudly awards this Certificate of Honor to the outstanding champion:',
    achievement: 'In recognition of blessed dedication and high aspiration in completing:',
    dua: '“May Allah bless this young heart with wisdom, light, and love for the Holy Quran.”',
    dateLabel: 'Date of Completion',
    sealLabel: 'GOLD SEAL',
    verifiedLabel: 'Verified By',
    defaultChampion: 'Little Champion',
    printPdf: '🖨️ Print or Save as PDF',
    continueBtn: 'Continue Journey ➔',
  },
  bn: {
    heading: '📜 সম্মান ও অর্জনের সনদপত্র',
    print: 'সনদ প্রিন্ট করুন',
    ribbon: 'কৃতিত্ব ও শ্রেষ্ঠত্বের সনদ',
    brandTitle: 'রওজা কিডস অ্যাপ',
    brandSubtitle: 'ঈমান, কুরআন ও উত্তম চরিত্রের অভিযাত্রা',
    presentation: 'রওজা কিডস পরিবার অত্যন্ত গর্বের সাথে এই সম্মাননা সনদ প্রদান করছে আমাদের প্রিয় নায়ককে:',
    achievement: 'আন্তরিক প্রচেষ্টা ও উচ্চাকাঙ্ক্ষার সাথে সফলভাবে সমাপ্ত ও মুখস্থ করার স্বীকৃতিস্বরূপ:',
    dua: '“মহান আল্লাহর নিকট প্রার্থনা, তিনি যেন কুরআনকে তোমার অন্তরের আলো ও পথপ্রদর্শক বানান।”',
    dateLabel: 'অর্জনের তারিখ',
    sealLabel: 'স্বর্ণের সিলমোহর',
    verifiedLabel: 'অনুমোদনকারী',
    defaultChampion: 'ছোট্ট বিজয়ী',
    printPdf: '🖨️ প্রিন্ট করুন বা PDF হিসেবে সংরক্ষণ করুন',
    continueBtn: 'আমার পথচলা অব্যাহত রাখুন ➔',
  },
  ru: {
    heading: '📜 Почетная грамота и свидетельство успеха',
    print: 'Печать грамоты',
    ribbon: 'СВИДЕТЕЛЬСТВО ОБ УСПЕШНОМ ЗАВЕРШЕНИИ',
    brandTitle: 'ПРИЛОЖЕНИЕ РАВДА КИДС',
    brandSubtitle: 'Путь веры, Корана и нравственности',
    presentation: 'Администрация «Равда Кидс» с гордостью вручает эту почетную грамоту прилежному герою:',
    achievement: 'В знак признания благословенного усердия и высокого стремления в изучении и завершении:',
    dua: '«Молим Всевышнего Аллаха сделать Коран светом твоего сердца и радостью твоей души».',
    dateLabel: 'Дата достижения',
    sealLabel: 'ЗОЛОТАЯ ПЕЧАТЬ',
    verifiedLabel: 'Подтверждено',
    defaultChampion: 'Юный герой',
    printPdf: '🖨️ Распечатать или сохранить в PDF',
    continueBtn: 'Продолжить путешествие ➔',
  },
  ur: {
    heading: '📜 عزت و کامیابی کی سند',
    print: 'سند پرنٹ کریں',
    ribbon: 'تکمیل اور نمایاں کامیابی کی سند',
    brandTitle: 'روضہ کڈز ایپ',
    brandSubtitle: 'ایمان، قرآن اور اخلاق کا روشن سفر',
    presentation: 'روضہ کڈز انتظامیہ انتہائی فخر کے ساتھ یہ اعزازی سند پیش کرتی ہے محنتی ہیرو کو:',
    achievement: 'حفظ، تفہیم اور مکمل کرنے میں مبارک محنت اور بلند ہمتی کے اعتراف میں:',
    dua: '«اللہ تعالیٰ سے دعا ہے کہ وہ قرآن مجید کو آپ کے دل کی بہار اور نور بنائے»',
    dateLabel: 'تکمیل کی تاریخ',
    sealLabel: 'سنہری مہر',
    verifiedLabel: 'تصدیق کنندہ',
    defaultChampion: 'ننھا ہیرو',
    printPdf: '🖨️ پرنٹ کریں یا بطور PDF محفوظ کریں',
    continueBtn: 'میرا سفر جاری رکھیں ➔',
  },
  id: {
    heading: '📜 Sertifikat Penghargaan & Prestasi',
    print: 'Cetak Sertifikat',
    ribbon: 'SERTIFIKAT KELULUSAN & PRESTASI',
    brandTitle: 'APLIKASI RAWDAKIDS',
    brandSubtitle: 'Perjalanan Iman, Al-Quran & Akhlak Mulia',
    presentation: 'Rawdakids dengan bangga menganugerahkan Sertifikat Penghargaan ini kepada sang juara teladan:',
    achievement: 'Sebagai penghargaan atas ketekunan berkah dan semangat tinggi dalam menyelesaikan:',
    dua: '“Semoga Allah memberkahi hati yang bersih ini dengan hikmah, cahaya, dan kecintaan pada Al-Quran.”',
    dateLabel: 'Tanggal Penyelesaian',
    sealLabel: 'SEGEL EMAS',
    verifiedLabel: 'Diverifikasi Oleh',
    defaultChampion: 'Juara Cilik',
    printPdf: '🖨️ Cetak atau Simpan sebagai PDF',
    continueBtn: 'Lanjutkan Perjalanan ➔',
  },
  tr: {
    heading: '📜 Başarı ve Onur Belgesi',
    print: 'Belgeyi Yazdır',
    ribbon: 'ÜSTÜN BAŞARI VE TAMAMLAMA BELGESİ',
    brandTitle: 'RAWDAKIDS UYGULAMASI',
    brandSubtitle: 'İman, Kuran ve Güzel Ahlak Yolculuğu',
    presentation: 'Rawdakids, bu Onur Belgesini gayretli ve başarılı kahramanımıza gururla takdim eder:',
    achievement: 'Tamamlama, ezberleme ve tefekkür etmedeki gayretli ve bereketli çabasının takdiriyle:',
    dua: '“Yüce Allah’tan bu güzel kalbe hikmet, nur ve Kuran sevgisi bahşetmesini dileriz.”',
    dateLabel: 'Tamamlanma Tarihi',
    sealLabel: 'ALTIN MÜHÜR',
    verifiedLabel: 'Onaylayan',
    defaultChampion: 'Küçük Şampiyon',
    printPdf: '🖨️ Yazdır veya PDF olarak Kaydet',
    continueBtn: 'Yolculuğuma Devam Et ➔',
  },
  fr: {
    heading: '📜 Certificat d’Honneur et d’Accomplissement',
    print: 'Imprimer le certificat',
    ribbon: 'CERTIFICAT D’EXCELLENCE ET DE RÉUSSITE',
    brandTitle: 'APPLICATION RAWDAKIDS',
    brandSubtitle: 'Voyage de foi, de Coran et de belles valeurs',
    presentation: 'L’équipe de Rawdakids est fière de décerner ce Certificat d’Honneur au vaillant champion :',
    achievement: 'En reconnaissance de ses efforts bénis et de sa noble détermination à accomplir :',
    dua: '« Puisse Allah illuminer ce jeune cœur de sagesse, de lumière et d’amour pour le Noble Coran. »',
    dateLabel: 'Date d’accomplissement',
    sealLabel: 'SCEAU D’OR',
    verifiedLabel: 'Vérifié par',
    defaultChampion: 'Petit Champion',
    printPdf: '🖨️ Imprimer ou enregistrer en PDF',
    continueBtn: 'Continuer mon voyage ➔',
  },
  de: {
    heading: '📜 Ehrenurkunde & Auszeichnung',
    print: 'Zertifikat drucken',
    ribbon: 'URKUNDE FÜR BESONDERE LEISTUNGEN',
    brandTitle: 'RAWDAKIDS APP',
    brandSubtitle: 'Reise des Glaubens, des Korans und der guten Werte',
    presentation: 'Rawdakids verleiht diese Ehrenurkunde mit Stolz an unseren vorbildlichen Champion:',
    achievement: 'In Anerkennung des gesegneten Fleißes und der großen Hingabe beim erfolgreichen Lernen von:',
    dua: '„Möge Allah dieses junge Herz mit Weisheit, Licht und Liebe zum Heiligen Koran segnen.“',
    dateLabel: 'Datum der Fertigstellung',
    sealLabel: 'GOLDSIEGEL',
    verifiedLabel: 'Bestätigt durch',
    defaultChampion: 'Kleiner Champion',
    printPdf: '🖨️ Drucken oder als PDF speichern',
    continueBtn: 'Reise fortsetzen ➔',
  },
  es: {
    heading: '📜 Certificado de Honor y Logro',
    print: 'Imprimir certificado',
    ribbon: 'CERTIFICADO DE EXCELENCIA Y LOGRO',
    brandTitle: 'APLICACIÓN RAWDAKIDS',
    brandSubtitle: 'Viaje de fe, Corán y valores nobles',
    presentation: 'Rawdakids concede con orgullo este Certificado de Honor al destacado campeón:',
    achievement: 'En reconocimiento a su bendito esfuerzo y alta dedicación al completar:',
    dua: '«Que Alá bendiga este joven corazón con sabiduría, luz y amor por el Sagrado Corán.»',
    dateLabel: 'Fecha de logro',
    sealLabel: 'SELLO DE ORO',
    verifiedLabel: 'Verificado por',
    defaultChampion: 'Pequeño Campeón',
    printPdf: '🖨️ Imprimir o guardar como PDF',
    continueBtn: 'Continuar mi viaje ➔',
  },
};

function formatCertificateDate(lang: SupportedLanguage): string {
  try {
    const locale =
      lang === 'ar' ? 'ar-EG' :
      lang === 'bn' ? 'bn-BD' :
      lang === 'ru' ? 'ru-RU' :
      lang === 'ur' ? 'ur-PK' :
      lang === 'id' ? 'id-ID' :
      lang === 'tr' ? 'tr-TR' :
      lang === 'fr' ? 'fr-FR' :
      lang === 'de' ? 'de-DE' :
      lang === 'es' ? 'es-ES' : 'en-US';
    return new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return new Date().toLocaleDateString('en-US');
  }
}

export default function AchievementCertificateModal({
  visible,
  onDismiss,
  certificateType: _certificateType = 'surah',
  title = 'سورة الفاتحة',
  subtitle,
}: Props) {
  const { language, profiles, activeProfileId } = useAppStore();
  const certRef = useRef<View>(null);

  const isRtl = isRTL(language);
  const isAr = language === 'ar';
  const langKey = (CERTIFICATE_I18N[language as SupportedLanguage] ? language : 'en') as SupportedLanguage;
  const c = CERTIFICATE_I18N[langKey];

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ||
    profiles[0] || { name: c.defaultChampion };

  // Date formatting
  const todayDateStr = useMemo(() => formatCertificateDate(langKey), [langKey]);

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Actions Bar (Hidden during print) */}
          <View style={[styles.topActionBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <View style={styles.topActionLeft}>
              <Text style={styles.topActionHeading}>
                {c.heading}
              </Text>
            </View>

            <View style={[styles.topActionButtons, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.printActionBtn}
                  onPress={handlePrint}
                  activeOpacity={0.8}
                >
                  <Ionicons name="print" size={17} color="#FFFFFF" />
                  <Text style={styles.printActionBtnText}>
                    {c.print}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeActionBtn}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Certificate Canvas (Print Target) */}
          <ScrollView
            contentContainerStyle={styles.scrollCanvas}
            showsVerticalScrollIndicator={false}
          >
            <View ref={certRef} style={styles.certificateFrame} nativeID="noor-kids-printable-certificate">
              {/* Outer Golden Border */}
              <View style={styles.outerBorder}>
                {/* Inner Ornamental Border */}
                <View style={styles.innerBorder}>
                  {/* Decorative Corner Stars */}
                  <View style={[styles.cornerStar, styles.cornerTL]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerTR]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerBL]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerBR]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>

                  {/* Basmalah Header */}
                  <Text style={styles.basmalahText}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </Text>

                  {/* Ribbon & Badge */}
                  <View style={styles.ribbonWrapper}>
                    <LinearGradient
                      colors={['#047857', '#065F46']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.ribbonPill}
                    >
                      <Ionicons name="sparkles" size={15} color="#FDE68A" />
                      <Text style={styles.ribbonText}>
                        {c.ribbon}
                      </Text>
                      <Ionicons name="sparkles" size={15} color="#FDE68A" />
                    </LinearGradient>
                  </View>

                  {/* App Brand Header */}
                  <Text style={styles.brandTitle}>
                    {c.brandTitle}
                  </Text>
                  <Text style={styles.brandSubtitle}>
                    {c.brandSubtitle}
                  </Text>

                  <View style={styles.goldDivider} />

                  {/* Presentation Text */}
                  <Text style={styles.presentationText}>
                    {c.presentation}
                  </Text>

                  {/* Child Name (Spotlight) */}
                  <View style={styles.childNameBox}>
                    <Text style={styles.childNameDecoration}>❊</Text>
                    <Text style={styles.childNameText}>{activeProfile.name}</Text>
                    <Text style={styles.childNameDecoration}>❊</Text>
                  </View>

                  {/* Achievement Text */}
                  <Text style={styles.achievementDesc}>
                    {c.achievement}
                  </Text>

                  {/* Target Title (Surah / World / Pillar) */}
                  <View style={styles.targetTitleBox}>
                    <Text style={styles.targetTitleText}>
                      {title}
                    </Text>
                    {subtitle ? (
                      <Text style={styles.targetSubtitleText}>{subtitle}</Text>
                    ) : null}
                  </View>

                  {/* Du'a blessing line */}
                  <Text style={styles.duaBlessingText}>
                    {c.dua}
                  </Text>

                  {/* Footer Credentials & Signatures */}
                  <View style={[styles.certFooterRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    {/* Date */}
                    <View style={styles.footerCol}>
                      <Text style={styles.footerLabel}>
                        {c.dateLabel}
                      </Text>
                      <Text style={styles.footerValue}>{todayDateStr}</Text>
                    </View>

                    {/* Golden Embossed Seal (Center) */}
                    <View style={styles.footerSealBox}>
                      <View style={styles.sealCircle}>
                        <Image source={ICON_STAR_IMG} style={styles.sealStarImg} resizeMode="contain" />
                        <Text style={styles.sealText}>
                          {c.sealLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Signature */}
                    <View style={styles.footerCol}>
                      <Text style={styles.footerLabel}>
                        {c.verifiedLabel}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Image source={MASCOT_NOOR_IMG} style={styles.footerMascot} resizeMode="cover" />
                        <Text style={styles.footerValue}>
                          {c.brandTitle} ☼
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions Bar */}
          <View style={[styles.bottomBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.printBigBtn}
                onPress={handlePrint}
                activeOpacity={0.85}
              >
                <Ionicons name="print" size={20} color="#FFFFFF" />
                <Text style={styles.printBigBtnText}>
                  {c.printPdf}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={onDismiss}
              activeOpacity={0.85}
            >
              <Text style={styles.dismissBtnText}>
                {c.continueBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 820,
    maxHeight: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  topActionBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topActionLeft: {
    flex: 1,
  },
  topActionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  topActionButtons: {
    alignItems: 'center',
    gap: 8,
  },
  printActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  printActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollCanvas: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  certificateFrame: {
    width: '100%',
    maxWidth: 740,
    backgroundColor: '#FFFDF8',
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  outerBorder: {
    borderWidth: 5,
    borderColor: '#D97706',
    borderRadius: RADIUS.lg,
    padding: 6,
    backgroundColor: '#FFFDF8',
  },
  innerBorder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#047857',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FFFEFA',
  },
  cornerStar: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerStarText: {
    fontSize: 20,
    color: '#D97706',
    fontWeight: '900',
  },
  cornerTL: { top: 8, left: 8 },
  cornerTR: { top: 8, right: 8 },
  cornerBL: { bottom: 8, left: 8 },
  cornerBR: { bottom: 8, right: 8 },
  basmalahText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ribbonWrapper: {
    marginVertical: 6,
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    ...SHADOWS.soft,
  },
  ribbonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FEF3C7',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  goldDivider: {
    width: '60%',
    height: 2,
    backgroundColor: '#FDE68A',
    marginVertical: SPACING.md,
  },
  presentationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  childNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: RADIUS.xl,
    marginVertical: SPACING.md,
    ...SHADOWS.soft,
  },
  childNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#065F46',
  },
  childNameDecoration: {
    fontSize: 18,
    color: '#D97706',
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  targetTitleBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    marginVertical: SPACING.sm,
  },
  targetTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#92400E',
  },
  targetSubtitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 2,
  },
  duaBlessingText: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 580,
    marginVertical: SPACING.md,
  },
  certFooterRow: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: SPACING.md,
    marginTop: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerCol: {
    alignItems: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  footerSealBox: {
    alignItems: 'center',
  },
  sealCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFBEB',
    borderWidth: 3,
    borderColor: '#D97706',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  sealStarImg: {
    width: 26,
    height: 26,
  },
  sealText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400E',
    marginTop: 2,
  },
  footerMascot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  printBigBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#047857',
    paddingVertical: 13,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  printBigBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dismissBtn: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.lg,
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
});

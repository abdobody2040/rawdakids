// src/components/TajweedLegendModal.tsx
// Tajweed Color Coding Legend & Guide (PRD §7.3.5 & QUR-4)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';

interface TajweedRule {
  id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  bg: string;
  descriptionAr: string;
  descriptionEn: string;
  exampleAr: string;
  exampleEn: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  {
    id: 'ghunnah',
    nameAr: 'الغُنّة (حركتان)',
    nameEn: 'Ghunnah (2 Counts)',
    color: '#059669',
    bg: '#ECFDF5',
    descriptionAr: 'صوت رخيم يخرج من الخيشوم عند النون والميم المشددتين.',
    descriptionEn: 'Nasal sound held for 2 counts on doubled Noon (نّ) and Meem (مّ).',
    exampleAr: 'إِنَّ — ثُمَّ',
    exampleEn: 'Inna — Thumma',
  },
  {
    id: 'qalqalah',
    nameAr: 'القلقلة (قطب جد)',
    nameEn: 'Qalqalah (Echoing)',
    color: '#0284C7',
    bg: '#E0F2FE',
    descriptionAr: 'اضطراب صوت الحرف عند السكون: ق، ط، ب، ج، د.',
    descriptionEn: 'Echo/rebound sound on resting letters: Qaaf, Taa, Baa, Jeem, Daal.',
    exampleAr: 'الفَلَقْ — أَحَدْ — حَبْلٌ',
    exampleEn: 'Al-Falaq — Ahad — Habl',
  },
  {
    id: 'madd',
    nameAr: 'المدّ الواجب واللازم',
    nameEn: 'Madd (Long Vowels)',
    color: '#DC2626',
    bg: '#FEF2F2',
    descriptionAr: 'إطالة الصوت بحرف المد بمقدار ٤ إلى ٦ حركات لوجود الهمزة أو السكون.',
    descriptionEn: 'Elongation of long vowel sounds (4–6 counts) due to Hamzah or Sukoon.',
    exampleAr: 'جَاءَ — السَّمَاءِ — الضَّالِّينَ',
    exampleEn: 'Jaa’a — As-Samaa’ — Ad-Daalleen',
  },
  {
    id: 'ikhfa',
    nameAr: 'الإخفاء الحقيقي',
    nameEn: 'Ikhfa’ (Concealment)',
    color: '#D97706',
    bg: '#FEF3C7',
    descriptionAr: 'نطق النون الساكنة أو التنوين بصفة بين الإظهار والإدغام مع بقاء الغنة.',
    descriptionEn: 'Softly concealing Noon Saakin or Tanween before 15 specific letters.',
    exampleAr: 'مِن قَبْلِ — كُنتُمْ',
    exampleEn: 'Min qabli — Kuntum',
  },
  {
    id: 'idgham',
    nameAr: 'الإدغام (يرملون)',
    nameEn: 'Idgham (Merging)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    descriptionAr: 'إدخال حرف ساكن في حرف متحرك بحيث يصيران حرفاً واحداً مشدداً.',
    descriptionEn: 'Merging Noon Saakin into the following letter (Yaa, Raa, Meem, Laam, Waw, Noon).',
    exampleAr: 'مَن يَقُولُ — مِن رَّبِّهِمْ',
    exampleEn: 'May-yaqool — Mir-rabbihim',
  },
];

interface TajweedLegendModalProps {
  visible: boolean;
  language: string;
  onClose: () => void;
}

export default function TajweedLegendModal({
  visible,
  language,
  onClose,
}: TajweedLegendModalProps) {
  const isAr = language === 'ar';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={[styles.headerRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.titleIconBox}>
                <Ionicons name="color-palette" size={20} color="#7C3AED" />
              </View>
              <View>
                <Text style={styles.titleText}>
                  {isAr ? 'دليل ألوان التجويد المباركة 🎨' : 'Tajweed Color Guide 🎨'}
                </Text>
                <Text style={styles.subtitleText}>
                  {isAr
                    ? 'ألوان تساعدك على ترتيل القرآن بإتقان كما أُنزل'
                    : 'Visual colors to help you recite Quran with proper rules'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Rules List */}
          <ScrollView style={styles.rulesList} showsVerticalScrollIndicator={false}>
            {TAJWEED_RULES.map((rule) => (
              <View key={rule.id} style={[styles.ruleCard, { borderLeftColor: rule.color }]}>
                <View style={[styles.ruleHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.colorDot, { backgroundColor: rule.color }]} />
                  <Text style={[styles.ruleName, { color: rule.color }]}>
                    {isAr ? rule.nameAr : rule.nameEn}
                  </Text>
                  <View style={[styles.exampleBadge, { backgroundColor: rule.bg }]}>
                    <Text style={[styles.exampleText, { color: rule.color }]}>
                      {isAr ? rule.exampleAr : rule.exampleEn}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.ruleDesc, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr ? rule.descriptionAr : rule.descriptionEn}
                </Text>
              </View>
            ))}

            <View style={styles.gentleNoteBox}>
              <Ionicons name="sparkles" size={16} color="#D97706" />
              <Text style={styles.gentleNoteText}>
                {isAr
                  ? 'قال رسول الله ﷺ: «الَّذِي يَقْرَأُ القُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الكِرَامِ البَرَرَةِ» (متفق عليه).'
                  : 'Prophet Muhammad ﷺ said: “The one who is proficient in the recitation of the Quran will be with the honourable noble scribes (angels).”'}
              </Text>
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity style={styles.gotItBtn} onPress={onClose} activeOpacity={0.88}>
            <Text style={styles.gotItBtnText}>
              {isAr ? 'فهمت وبإذن الله سأرتل 🌟' : 'Got it, let’s recite! 🌟'}
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    ...SHADOWS.lg,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  titleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitleText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rulesList: {
    marginVertical: SPACING.xs,
  },
  ruleCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  ruleHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ruleName: {
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  exampleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  exampleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ruleDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  gentleNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#FEF3C7',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  gentleNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    fontWeight: '600',
  },
  gotItBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

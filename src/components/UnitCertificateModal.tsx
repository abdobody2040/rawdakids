// Unit Certificate Modal (B3)
// Client-side A4 landscape certificate with real Arabic text, Gregorian & Hijri dates
// No child photo, school, or location. First name only (or "بَطَلُ رَوْضَةِ كِيدْز")

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { unitsService } from '@/services/unitsService';

interface UnitCertificateModalProps {
  visible: boolean;
  childName?: string;
  unitTitleArabic: string;
  onDismiss: () => void;
}

export default function UnitCertificateModal({
  visible,
  childName,
  unitTitleArabic,
  onDismiss,
}: UnitCertificateModalProps) {
  if (!visible) return null;

  const displayName = (childName || '').trim() || 'بَطَلُ رَوْضَةِ كِيدْز';
  const { gregorian, hijri } = unitsService.getFormattedDates();

  const handlePrintOrSave = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
          accessibilityLabel="إغلاق الشهادة"
        />

        <View style={styles.certificateContainer}>
          {/* Top Bar with Close & Print */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handlePrintOrSave}
              accessibilityRole="button"
              accessibilityLabel="احفظ الشهادة"
            >
              <Ionicons name="download-outline" size={20} color={COLORS.primary} />
              <Text style={styles.actionBtnText}>احْفَظْ الشَّهَادَةَ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Certificate Frame (A4 Landscape aspect ratio feel) */}
          <View style={styles.certificateFrame} id="rawda-certificate-print">
            <View style={styles.certificateInnerBorder}>
              {/* Header Islamic Ornament */}
              <View style={styles.ornamentTop}>
                <Ionicons name="ribbon" size={32} color="#D97706" />
                <Text style={styles.appTitle}>رَوْضَةُ كِيدْز</Text>
              </View>

              <Text style={styles.certificateHeading}>شَهَادَةُ إِتْقَانٍ وَتَمَيُّزٍ</Text>
              <Text style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>

              <Text style={styles.certifyText}>
                تَشْهَدُ إِدَارَةُ رَوْضَةِ كِيدْز بِأَنَّ الْبَطَلَ الْمُثَابِرَ:
              </Text>

              {/* Child First Name */}
              <View style={styles.childNameWrap}>
                <Text style={styles.childNameText}>{displayName}</Text>
              </View>

              <Text style={styles.achievementText}>
                قَدْ أَتَمَّ بِنَجَاحٍ وَإِتْقَانٍ جَمِيعَ دُرُوسِ:
              </Text>

              {/* Unit Title */}
              <Text style={styles.unitNameText}>« {unitTitleArabic} »</Text>

              <Text style={styles.duaText}>
                نَسْأَلُ اللَّهَ تَعَالَى أَنْ يَنْفَعَ بِهِ وَيَجْعَلَهُ قُرَّةَ عَيْنٍ لِوَالِدَيْهِ
              </Text>

              {/* Dates & Seal Footer */}
              <View style={styles.certFooter}>
                <View style={styles.dateCol}>
                  <Text style={styles.dateLabel}>التَّارِيخُ:</Text>
                  <Text style={styles.dateValue}>{hijri}</Text>
                  <Text style={styles.dateSubValue}>{gregorian}</Text>
                </View>

                {/* Golden Seal */}
                <View style={styles.goldenSeal}>
                  <Ionicons name="star" size={24} color="#FFFFFF" />
                  <Text style={styles.sealText}>إِتْقَانٌ</Text>
                </View>

                <View style={styles.signatureCol}>
                  <Text style={styles.signatureLabel}>الْمُعْتَمَدُ:</Text>
                  <Text style={styles.signatureValue}>رَوْضَةُ كِيدْز</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  certificateContainer: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  actionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
    minHeight: 48,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateFrame: {
    backgroundColor: '#FFFDF7',
    borderWidth: 4,
    borderColor: '#D97706',
    borderRadius: RADIUS.lg,
    padding: 10,
  },
  certificateInnerBorder: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#F59E0B',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  ornamentTop: {
    alignItems: 'center',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
  },
  certificateHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#065F46',
    marginVertical: 4,
  },
  bismillah: {
    fontSize: 16,
    color: '#047857',
    marginBottom: 8,
  },
  certifyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  childNameWrap: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 4,
    marginVertical: 8,
  },
  childNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#047857',
    textAlign: 'center',
  },
  achievementText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  unitNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D97706',
    marginVertical: 6,
  },
  duaText: {
    fontSize: 12,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
  },
  certFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  dateCol: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  dateSubValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  goldenSeal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D97706',
    ...SHADOWS.medium,
  },
  sealText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  signatureCol: {
    alignItems: 'flex-start',
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  signatureValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
});

// Verse Coloring Modal (B1)
// 4 choices: حَفِظْتُهَا (green check), مُتْقَنَةٌ (gold star), أُرَاجِعُهَا (rose refresh), بِدُونِ لَوْنٍ
// Accessible buttons >=48px with Arabic labels

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

export type VerseColor = 'memorized' | 'mastered' | 'review' | null;

interface VerseColoringModalProps {
  visible: boolean;
  surahNumber: number;
  verseNumber: number;
  currentColor: VerseColor;
  onSelectColor: (color: VerseColor) => void;
  onDismiss: () => void;
}

export default function VerseColoringModal({
  visible,
  surahNumber,
  verseNumber,
  currentColor,
  onSelectColor,
  onDismiss,
}: VerseColoringModalProps) {
  if (!visible) return null;

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
          accessibilityLabel="إغلاق"
        />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>تَقْيِيمُ حِفْظِ الْآيَةِ {verseNumber}</Text>
            <Text style={styles.subtitle}>اخْتَرْ لَوْنًا لِمُتَابَعَةِ إِتْقَانِكَ لِهَذِهِ الْآيَةِ</Text>
          </View>

          <View style={styles.optionsList}>
            {/* 1. حَفِظْتُهَا (Green check) */}
            <TouchableOpacity
              style={[
                styles.optionBtn,
                styles.memorizedBtn,
                currentColor === 'memorized' && styles.optionBtnActive,
              ]}
              onPress={() => onSelectColor('memorized')}
              accessibilityRole="button"
              accessibilityLabel="حَفِظْتُهَا"
            >
              <View style={[styles.iconCircle, { backgroundColor: '#10B981' }]}>
                <Ionicons name="checkmark-sharp" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.optionLabel}>حَفِظْتُهَا</Text>
                <Text style={styles.optionHint}>أَسْتَطِيعُ تِلَاوَتَهَا بِشَكْلٍ جَيِّدٍ</Text>
              </View>
              {currentColor === 'memorized' && (
                <Ionicons name="radio-button-on" size={22} color="#10B981" />
              )}
            </TouchableOpacity>

            {/* 2. مُتْقَنَةٌ (Gold star) */}
            <TouchableOpacity
              style={[
                styles.optionBtn,
                styles.masteredBtn,
                currentColor === 'mastered' && styles.optionBtnActive,
              ]}
              onPress={() => onSelectColor('mastered')}
              accessibilityRole="button"
              accessibilityLabel="مُتْقَنَةٌ"
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="star" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.optionLabel}>مُتْقَنَةٌ</Text>
                <Text style={styles.optionHint}>حِفْظٌ قَوِيٌّ وَمُتْقَنٌ بِلَا تَرَدُّدٍ</Text>
              </View>
              {currentColor === 'mastered' && (
                <Ionicons name="radio-button-on" size={22} color="#F59E0B" />
              )}
            </TouchableOpacity>

            {/* 3. أُرَاجِعُهَا (Rose refresh) */}
            <TouchableOpacity
              style={[
                styles.optionBtn,
                styles.reviewBtn,
                currentColor === 'review' && styles.optionBtnActive,
              ]}
              onPress={() => onSelectColor('review')}
              accessibilityRole="button"
              accessibilityLabel="أُرَاجِعُهَا"
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F43F5E' }]}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.optionLabel}>أُرَاجِعُهَا</Text>
                <Text style={styles.optionHint}>تَحْتَاجُ إِلَى تَكْرَارٍ وَتَثْبِيتٍ</Text>
              </View>
              {currentColor === 'review' && (
                <Ionicons name="radio-button-on" size={22} color="#F43F5E" />
              )}
            </TouchableOpacity>

            {/* 4. بِدُونِ لَوْنٍ (Clear) */}
            <TouchableOpacity
              style={[
                styles.optionBtn,
                styles.clearBtn,
                currentColor === null && styles.optionBtnActive,
              ]}
              onPress={() => onSelectColor(null)}
              accessibilityRole="button"
              accessibilityLabel="بِدُونِ لَوْنٍ"
            >
              <View style={[styles.iconCircle, { backgroundColor: '#9CA3AF' }]}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.optionLabel}>بِدُونِ لَوْنٍ</Text>
                <Text style={styles.optionHint}>إِعَادَةُ الْآيَةِ إِلَى الْحَالَةِ الْأَصْلِيَّةِ</Text>
              </View>
              {currentColor === null && (
                <Ionicons name="radio-button-on" size={22} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  sheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  optionBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  memorizedBtn: {
    borderColor: '#D1FAE5',
  },
  masteredBtn: {
    borderColor: '#FEF3C7',
  },
  reviewBtn: {
    borderColor: '#FFE4E6',
  },
  clearBtn: {
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  textWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  optionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

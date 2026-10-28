import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { RECITERS } from '@/data/quranData';
import { useAppStore } from '@/store/useAppStore';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  activeAyahNumber: number;
  totalAyahs: number;
  speed: number;
  repeatCount: number;
  currentRepeatCycle?: number;
  onPlayPause: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onSpeedChange: (speed: number) => void;
  onRepeatChange: (repeat: number) => void;
  reciterName?: string;
  onRecordRepeat?: () => void;
}

export default function AudioPlayerBar({
  isPlaying,
  activeAyahNumber,
  totalAyahs,
  speed,
  repeatCount,
  currentRepeatCycle = 1,
  onPlayPause,
  onNextAyah,
  onPrevAyah,
  onSpeedChange,
  onRepeatChange,
  onRecordRepeat,
}: AudioPlayerBarProps) {
  const { language, parentSettings, updateParentSettings } = useAppStore();
  const [reciterModalOpen, setReciterModalOpen] = useState(false);
  const isAr = language === 'ar';

  const currentReciter =
    RECITERS.find((r) => r.id === parentSettings.reciterId) || RECITERS[0];

  const toggleSpeed = () => {
    if (speed === 1.0) onSpeedChange(1.25);
    else if (speed === 1.25) onSpeedChange(1.5);
    else if (speed === 1.5) onSpeedChange(0.75);
    else onSpeedChange(1.0);
  };

  const toggleRepeat = () => {
    if (repeatCount === 1) onRepeatChange(3);
    else if (repeatCount === 3) onRepeatChange(5);
    else onRepeatChange(1);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: Reciter Name on left, Speed Chip on right */}
      <View style={[styles.infoRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={styles.reciterPickerBtn}
          onPress={() => setReciterModalOpen(true)}
          activeOpacity={0.75}
        >
          <Ionicons name="mic-outline" size={15} color="#4B5563" />
          <Text style={styles.reciterPickerText}>
            {isAr ? currentReciter.nameArabic : currentReciter.nameEnglish}
          </Text>
          <Ionicons name="chevron-down" size={12} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.speedChip, speed !== 1.0 && styles.speedChipActive]}
          onPress={toggleSpeed}
          activeOpacity={0.75}
        >
          <Text style={[styles.speedChipText, speed !== 1.0 && styles.speedChipTextActive]}>
            {isAr ? `السرعة ${speed}x` : `Speed ${speed}x`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Controls Row (Mockup: Repeat | Skip Prev | Big Green Play | Skip Next | Repeat After Me) */}
      <View style={[styles.controlsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
        {/* Labeled Repeat Button */}
        <TouchableOpacity
          style={styles.actionColumnBtn}
          onPress={toggleRepeat}
          activeOpacity={0.75}
        >
          <Ionicons
            name="repeat"
            size={22}
            color={repeatCount > 1 ? '#0F9D6B' : '#5F5E5A'}
          />
          <Text style={[styles.actionColumnText, repeatCount > 1 && { color: '#0F9D6B', fontWeight: '800' }]}>
            {repeatCount > 1
              ? `${repeatCount}x ${isAr ? 'تكرار' : 'Repeat'}`
              : (isAr ? 'تكرار' : 'Repeat')}
          </Text>
        </TouchableOpacity>

        {/* Previous Ayah Button (Clear, never looks disabled) */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onPrevAyah}
          activeOpacity={0.75}
        >
          <Ionicons
            name={isAr ? 'play-skip-forward' : 'play-skip-back'}
            size={26}
            color="#475569"
          />
        </TouchableOpacity>

        {/* Big Green Play / Pause Button (64x64, #0F9D6B) */}
        <TouchableOpacity
          style={styles.heroPlayBtn}
          onPress={onPlayPause}
          activeOpacity={0.88}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={30}
            color="#FFFFFF"
            style={{ marginLeft: isPlaying ? 0 : 3 }}
          />
        </TouchableOpacity>

        {/* Next Ayah Button (Clear, never looks disabled) */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onNextAyah}
          activeOpacity={0.75}
        >
          <Ionicons
            name={isAr ? 'play-skip-back' : 'play-skip-forward'}
            size={26}
            color="#475569"
          />
        </TouchableOpacity>

        {/* Labeled "رددها" (Repeat after me mic button) */}
        <TouchableOpacity
          style={styles.actionColumnBtn}
          onPress={onRecordRepeat}
          activeOpacity={0.75}
        >
          <Ionicons name="mic-circle-outline" size={24} color="#0F9D6B" />
          <Text style={[styles.actionColumnText, { color: '#0F9D6B', fontWeight: '800' }]}>
            {isAr ? 'رددها' : 'Repeat'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reciter Selection Modal */}
      <Modal
        visible={reciterModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReciterModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isAr ? 'اختر القارئ المفضل' : 'Choose Reciter'}
              </Text>
              <TouchableOpacity onPress={() => setReciterModalOpen(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: 420 }}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: SPACING.md }}
            >
              {RECITERS.map((r) => {
                const isSelected = r.id === parentSettings.reciterId;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.reciterItem,
                      isSelected && styles.reciterItemSelected,
                    ]}
                    onPress={() => {
                      updateParentSettings({ reciterId: r.id });
                      setReciterModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.reciterItemLeft}>
                      <Ionicons
                        name="mic-circle"
                        size={28}
                        color={isSelected ? '#0F9D6B' : COLORS.textSecondary}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reciterItemName}>
                          {isAr ? r.nameArabic : r.nameEnglish}
                        </Text>
                        <Text style={styles.reciterItemStyle}>{r.style}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#0F9D6B"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    ...SHADOWS.medium,
  },
  infoRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reciterPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  reciterPickerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  speedChip: {
    backgroundColor: '#F5F4EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8D9BF',
  },
  speedChipActive: {
    backgroundColor: '#E1F5EE',
    borderColor: '#5DCAA5',
  },
  speedChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  speedChipTextActive: {
    color: '#0F6E56',
  },
  controlsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  actionColumnBtn: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  actionColumnText: {
    fontSize: 11,
    color: '#5F5E5A',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F9D6B',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#F8FAFC',
  },
  reciterItemSelected: {
    backgroundColor: '#E1F5EE',
    borderWidth: 1.5,
    borderColor: '#0F9D6B',
  },
  reciterItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reciterItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  reciterItemStyle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

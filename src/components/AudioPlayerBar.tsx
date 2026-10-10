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
}: AudioPlayerBarProps) {
  const { language, parentSettings, updateParentSettings } = useAppStore();
  const [reciterModalOpen, setReciterModalOpen] = useState(false);

  const currentReciter =
    RECITERS.find((r) => r.id === parentSettings.reciterId) || RECITERS[0];

  const toggleSpeed = () => {
    if (speed === 1.0) onSpeedChange(1.25);
    else if (speed === 1.25) onSpeedChange(0.75);
    else onSpeedChange(1.0);
  };

  const toggleRepeat = () => {
    if (repeatCount === 1) onRepeatChange(3);
    else if (repeatCount === 3) onRepeatChange(5);
    else onRepeatChange(1);
  };

  return (
    <View style={styles.container}>
      {/* Top micro info: Ayah counter & Reciter name */}
      <View style={styles.infoRow}>
        <View style={styles.ayahBadge}>
          <Text style={styles.ayahBadgeText}>
            {language === 'ar' ? 'الآية' : 'Ayah'} {activeAyahNumber} / {totalAyahs}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reciterPickerBtn}
          onPress={() => setReciterModalOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="mic" size={14} color={COLORS.primary} />
          <Text style={styles.reciterPickerText}>
            {language === 'ar' ? currentReciter.nameArabic : currentReciter.nameEnglish}
          </Text>
          <Ionicons name="chevron-down" size={12} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main player controls row */}
      <View style={styles.controlsRow}>
        {/* Speed button */}
        <TouchableOpacity
          style={[styles.smallBtn, speed !== 1.0 && styles.activeSmallBtn]}
          onPress={toggleSpeed}
          activeOpacity={0.7}
        >
          <Text style={[styles.smallBtnText, speed !== 1.0 && styles.activeSmallBtnText]}>
            {speed}x
          </Text>
        </TouchableOpacity>

        {/* Previous Ayah */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={onPrevAyah}
          disabled={activeAyahNumber <= 1}
          activeOpacity={0.7}
        >
          <Ionicons
            name={language === 'ar' ? 'play-skip-forward' : 'play-skip-back'}
            size={22}
            color={activeAyahNumber <= 1 ? COLORS.border : COLORS.text}
          />
        </TouchableOpacity>

        {/* Big Play / Pause Button */}
        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={onPlayPause}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={30}
            color={COLORS.textLight}
            style={{ marginLeft: isPlaying ? 0 : 3 }}
          />
        </TouchableOpacity>

        {/* Next Ayah */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={onNextAyah}
          disabled={activeAyahNumber >= totalAyahs}
          activeOpacity={0.7}
        >
          <Ionicons
            name={language === 'ar' ? 'play-skip-back' : 'play-skip-forward'}
            size={22}
            color={activeAyahNumber >= totalAyahs ? COLORS.border : COLORS.text}
          />
        </TouchableOpacity>

        {/* Repeat Mode */}
        <TouchableOpacity
          style={[styles.smallBtn, repeatCount > 1 && styles.activeSmallBtn]}
          onPress={toggleRepeat}
          activeOpacity={0.7}
        >
          <Ionicons
            name="repeat"
            size={14}
            color={repeatCount > 1 ? COLORS.primaryDark : COLORS.textSecondary}
          />
          <Text
            style={[styles.smallBtnText, repeatCount > 1 && styles.activeSmallBtnText]}
          >
            {repeatCount > 1 && isPlaying
              ? `${currentRepeatCycle}/${repeatCount}x`
              : `${repeatCount}x`}
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
                {language === 'ar' ? 'اختر القارئ المفضل' : 'Choose Reciter'}
              </Text>
              <TouchableOpacity onPress={() => setReciterModalOpen(false)}>
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
                        color={isSelected ? COLORS.primary : COLORS.textSecondary}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reciterItemName}>
                          {language === 'ar' ? r.nameArabic : r.nameEnglish}
                        </Text>
                        <Text style={styles.reciterItemStyle}>{r.style}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.primary}
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
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    ...SHADOWS.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ayahBadge: {
    backgroundColor: COLORS.quranGarden.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  ayahBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
  },
  reciterPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  reciterPickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  activeSmallBtn: {
    backgroundColor: COLORS.primaryLight + '44',
  },
  smallBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  activeSmallBtnText: {
    color: COLORS.primaryDark,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardAlt,
  },
  playPauseBtn: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow(COLORS.primary),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.cardAlt,
  },
  reciterItemSelected: {
    backgroundColor: COLORS.primaryLight + '22',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
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

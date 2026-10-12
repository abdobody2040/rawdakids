// ChildProfileSwitchModal.tsx - Fast Champion Profile Switcher & Creator
import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, AgeBand } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import KidAvatar, { PRESET_AVATARS } from './KidAvatar';

interface ChildProfileSwitchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChildProfileSwitchModal({
  visible,
  onClose,
}: ChildProfileSwitchModalProps) {
  const {
    language,
    profiles,
    activeProfileId,
    setActiveProfile,
    addProfile,
    deleteProfile,
    cleanupDuplicateProfiles,
    getChildProgress,
  } = useAppStore();

  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAgeBand, setNewChildAgeBand] = useState<AgeBand>('7-9');
  const [newChildAvatar, setNewChildAvatar] = useState('av-boy1');

  const handleSelectChild = (id: string) => {
    setActiveProfile(id);
    onClose();
  };

  const handleDeleteChild = (e: any, id: string, name: string) => {
    e?.stopPropagation?.();
    if (profiles.length <= 1) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        isAr
          ? `هل تريد بالتأكيد حذف ملف "${name}" وإزالته نهائياً؟`
          : `Permanently delete profile "${name}"?`
      );
      if (confirmed) {
        deleteProfile(id);
      }
    } else {
      Alert.alert(
        isAr ? 'حذف ملف الطفل' : 'Delete Child Profile',
        isAr
          ? `هل تريد حذف ملف "${name}" وإزالته؟`
          : `Delete profile "${name}"?`,
        [
          { text: isAr ? 'إلغاء' : 'Cancel', style: 'cancel' },
          {
            text: isAr ? 'حذف' : 'Delete',
            style: 'destructive',
            onPress: () => deleteProfile(id),
          },
        ]
      );
    }
  };

  const handleCreateNewChild = () => {
    if (!newChildName.trim()) return;
    addProfile({
      name: newChildName.trim(),
      ageBand: newChildAgeBand,
      avatar: newChildAvatar,
    });
    setNewChildName('');
    setShowAddChildForm(false);
    onClose();
  };

  const handleUploadPhoto = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const res = ev.target?.result as string;
            if (res) {
              setNewChildAvatar(res);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={[styles.headerRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isAr ? 'flex-end' : 'flex-start' }}>
              <Text style={styles.modalTitle}>
                {isAr ? 'من يتعلم معنا الآن؟ 🌟' : 'Who is learning now? 🌟'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {isAr
                  ? 'اختر ملف البطل للمتابعة بإنجازاته الخاصة'
                  : 'Select champion to resume their own progress'}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick cleanup banner if duplicate profiles exist */}
            {profiles.length > 2 && (
              <TouchableOpacity
                style={[styles.cleanupDuplicatesBtn, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
                onPress={() => cleanupDuplicateProfiles()}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={14} color="#047857" />
                <Text style={styles.cleanupDuplicatesText}>
                  {isAr
                    ? 'تنظيف الملفات الزائدة والمكررة 🧹'
                    : 'Clean Up Duplicate Profiles 🧹'}
                </Text>
              </TouchableOpacity>
            )}

            {/* List of Children Profiles */}
            <View style={styles.profilesGrid}>
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const childProg = getChildProgress(p.id);
                const surahsCount = Object.values(childProg.surahProgress || {}).filter(
                  (s) => s.isCompleted
                ).length;

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.profileItemCard,
                      isActive && styles.profileItemCardActive,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                    onPress={() => handleSelectChild(p.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.avatarWrap}>
                      <KidAvatar avatar={p.avatar} size={54} />
                      {isActive && (
                        <View style={styles.activeCheckDot}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    <View style={[styles.profileInfoCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                      <View style={[styles.nameRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                        <Text style={styles.childNameText}>{p.name}</Text>
                        {isActive && (
                          <View style={styles.activePill}>
                            <Text style={styles.activePillText}>
                              {isAr ? 'البطل الحالي' : 'Active'}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.ageBandText}>
                        {p.ageBand === '4-6'
                          ? t.ageBandExplorers
                          : p.ageBand === '7-9'
                          ? t.ageBandLearners
                          : t.ageBandMinds}
                      </Text>

                      {/* Mini stats row */}
                      <View style={[styles.miniStatsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                        <Text style={styles.miniStatBadge}>⭐ {childProg.stars}</Text>
                        <Text style={styles.miniStatBadge}>💎 {childProg.gems}</Text>
                        <Text style={styles.miniStatBadge}>📖 {surahsCount} {isAr ? 'سور' : 'surahs'}</Text>
                      </View>
                    </View>

                    {/* Delete button if more than 1 profile exists */}
                    {profiles.length > 1 && (
                      <TouchableOpacity
                        style={styles.deleteProfileIconBtn}
                        onPress={(e) => handleDeleteChild(e, p.id, p.name)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}

                    <View style={styles.actionArrow}>
                      <Ionicons
                        name={isAr ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={isActive ? '#059669' : COLORS.textMuted}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick Add Child Button or Form */}
            {!showAddChildForm ? (
              <TouchableOpacity
                style={[styles.addProfileBtn, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
                onPress={() => setShowAddChildForm(true)}
                activeOpacity={0.8}
              >
                <View style={styles.addIconCircle}>
                  <Ionicons name="add" size={18} color="#059669" />
                </View>
                <Text style={styles.addProfileBtnText}>
                  {isAr ? 'إضافة بطل / طفل جديد على هذا الجهاز' : 'Add New Child on this device'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addFormContainer}>
                <View style={[styles.formHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.formTitle}>
                    {isAr ? 'تسجيل طفل جديد' : 'New Child Profile'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowAddChildForm(false)}
                    style={styles.cancelFormBtn}
                  >
                    <Text style={styles.cancelFormText}>{isAr ? 'إلغاء' : 'Cancel'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.fieldLabel, isAr && { textAlign: 'right' }]}>
                  {isAr ? 'اسم الطفل / البطل' : "Child's Name"}
                </Text>
                <TextInput
                  style={[styles.textInput, isAr && { textAlign: 'right' }]}
                  placeholder={isAr ? 'مثال: مريم، عمر، فاطمة...' : 'e.g. Maryam, Omar...'}
                  placeholderTextColor={COLORS.textMuted}
                  value={newChildName}
                  onChangeText={setNewChildName}
                />

                <Text style={[styles.fieldLabel, isAr && { textAlign: 'right' }]}>
                  {isAr ? 'الفئة العمرية' : 'Age Category'}
                </Text>
                <View style={styles.ageBandButtonsRow}>
                  {(['4-6', '7-9', '10-13'] as AgeBand[]).map((ab) => (
                    <TouchableOpacity
                      key={ab}
                      style={[
                        styles.ageBandBtn,
                        newChildAgeBand === ab && styles.ageBandBtnSelected,
                      ]}
                      onPress={() => setNewChildAgeBand(ab)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.ageBandBtnText,
                          newChildAgeBand === ab && styles.ageBandBtnTextSelected,
                        ]}
                      >
                        {ab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Avatar Picker */}
                <View style={[styles.avatarHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.fieldLabel}>{isAr ? 'اختر الشخصية' : 'Choose Avatar'}</Text>
                  <TouchableOpacity
                    style={styles.uploadPhotoPill}
                    onPress={handleUploadPhoto}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera" size={13} color="#047857" />
                    <Text style={styles.uploadPhotoText}>
                      {isAr ? 'رفع صورة 📷' : 'Upload 📷'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.avatarScrollRow}
                >
                  {PRESET_AVATARS.map((av) => (
                    <TouchableOpacity
                      key={av.id}
                      style={[
                        styles.avatarPickCircle,
                        newChildAvatar === av.id && styles.avatarPickCircleActive,
                      ]}
                      onPress={() => setNewChildAvatar(av.id)}
                    >
                      <KidAvatar avatar={av.id} size={40} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.confirmAddBtn}
                  onPress={handleCreateNewChild}
                  activeOpacity={0.8}
                >
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text style={styles.confirmAddBtnText}>
                    {isAr ? 'حفظ والبدء فوراً ✨' : 'Save & Start Learning ✨'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Privacy Reassurance Note */}
            <View style={[styles.privacyNoticeCard, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <Ionicons name="shield-checkmark" size={16} color="#059669" />
              <Text style={[styles.privacyNoticeText, isAr && { textAlign: 'right' }]}>
                {isAr
                  ? 'تُحفظ ملفات الأطفال وتقدمهم على هذا الجهاز فقط، ولا تتم مزامنتها مع أجهزة أخرى.'
                  : 'Profiles & progress are saved locally on this device only.'}
              </Text>
            </View>
          </ScrollView>
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
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
  },
  profilesGrid: {
    gap: SPACING.sm,
  },
  profileItemCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: SPACING.md,
  },
  profileItemCardActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  avatarWrap: {
    position: 'relative',
  },
  activeCheckDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  nameRow: {
    alignItems: 'center',
    gap: 6,
  },
  childNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  activePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  ageBandText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  miniStatsRow: {
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  miniStatBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  actionArrow: {
    padding: 4,
  },
  addProfileBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderStyle: 'dashed',
  },
  addIconCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  addFormContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  formHeaderRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  cancelFormBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cancelFormText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  textInput: {
    height: 42,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ageBandButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ageBandBtn: {
    flex: 1,
    height: 36,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ageBandBtnSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  ageBandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  ageBandBtnTextSelected: {
    color: '#065F46',
    fontWeight: '900',
  },
  avatarHeaderRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  uploadPhotoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  uploadPhotoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  avatarScrollRow: {
    gap: 8,
    paddingVertical: 4,
  },
  avatarPickCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  avatarPickCircleActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  confirmAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    height: 44,
    borderRadius: RADIUS.lg,
    marginTop: 6,
  },
  confirmAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  privacyNoticeCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  privacyNoticeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    lineHeight: 16,
  },
  cleanupDuplicatesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 4,
  },
  cleanupDuplicatesText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  deleteProfileIconBtn: {
    padding: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#FEE2E2',
    marginHorizontal: 4,
  },
});

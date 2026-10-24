// src/components/parents/ChildProfilesCard.tsx
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { ChildProfile, AgeBand } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import KidAvatar, { PRESET_AVATARS } from '@/components/KidAvatar';

interface ChildProfilesCardProps {
  language: Language;
  t: {
    childProfiles: string;
    ageBandExplorers: string;
    ageBandLearners: string;
    ageBandMinds: string;
    addChild: string;
    childName: string;
    ageBand: string;
    avatars: string;
    save: string;
  };
  profiles: ChildProfile[];
  activeProfileId: string;
  setActiveProfile: (id: string) => void;
  addProfile: (p: { name: string; ageBand: AgeBand; avatar: string }) => void;
  deleteProfile: (id: string) => void;
}

export default function ChildProfilesCard({
  language,
  t,
  profiles,
  activeProfileId,
  setActiveProfile,
  addProfile,
  deleteProfile,
}: ChildProfilesCardProps) {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAgeBand, setNewChildAgeBand] = useState<AgeBand>('7-9');
  const [newChildAvatar, setNewChildAvatar] = useState('av-girl1');

  const handleDeleteChild = (id: string, name: string) => {
    if (profiles.length <= 1) {
      Alert.alert(
        language === 'ar' ? 'تنبيه' : 'Notice',
        language === 'ar'
          ? 'يجب أن يبقى ملف طفل واحد على الأقل في التطبيق.'
          : 'At least one child profile must remain in the app.'
      );
      return;
    }
    Alert.alert(
      language === 'ar' ? 'حذف ملف الطفل' : 'Delete Child Profile',
      language === 'ar'
        ? `هل أنت متأكد من حذف ملف "${name}" وجميع إنجازاته وتقدمه المحفوظ على هذا الجهاز نهائياً؟`
        : `Are you sure you want to permanently delete "${name}" and all progress saved on this device?`,
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ar' ? 'حذف نهائي' : 'Delete',
          style: 'destructive',
          onPress: () => deleteProfile(id),
        },
      ]
    );
  };

  const handleUploadAvatarChild = () => {
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

  const handleCreateChild = () => {
    if (!newChildName.trim()) {
      return;
    }
    addProfile({
      name: newChildName.trim(),
      ageBand: newChildAgeBand,
      avatar: newChildAvatar,
    });
    setNewChildName('');
    setShowAddChildModal(false);
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="people" size={20} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>{t.childProfiles}</Text>
      </View>

      <Text style={styles.settingDesc}>
        {language === 'ar'
          ? 'يمكنك إنشاء ملف لطفل أو أكثر على هذا الجهاز. تقدم كل طفل منفصل تماماً عن الآخر.'
          : 'You can create one or more child profiles on this device. Each child has isolated progress.'}
      </Text>

      <View style={styles.profilesList}>
        {profiles.map((p) => {
          const isActive = p.id === activeProfileId;

          return (
            <View
              key={p.id}
              style={[
                styles.profileCard,
                isActive && styles.profileCardActive,
              ]}
            >
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.md }}
                onPress={() => setActiveProfile(p.id)}
                activeOpacity={0.8}
              >
                <KidAvatar avatar={p.avatar} size={42} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileNameText}>{p.name}</Text>
                  <Text style={styles.profileAgeText}>
                    {p.ageBand === '4-6'
                      ? t.ageBandExplorers
                      : p.ageBand === '7-9'
                      ? t.ageBandLearners
                      : t.ageBandMinds}
                  </Text>
                </View>
                {isActive ? (
                  <View style={styles.activeProfileBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#059669"
                    />
                    <Text style={styles.activeProfileBadgeText}>
                      {language === 'ar' ? 'النشط حالياً' : 'Active'}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>

              {profiles.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteProfileIconBtn}
                  onPress={() => handleDeleteChild(p.id, p.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {profiles.length < 4 && (
        <TouchableOpacity
          style={styles.addChildBtn}
          onPress={() => setShowAddChildModal(!showAddChildModal)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color={COLORS.primary} />
          <Text style={styles.addChildBtnText}>{t.addChild}</Text>
        </TouchableOpacity>
      )}

      {/* Add Child Form */}
      {showAddChildModal && (
        <View style={styles.addChildForm}>
          <Text style={styles.formLabel}>{t.childName}</Text>
          <TextInput
            style={styles.formInput}
            placeholder={language === 'ar' ? 'اسم الطفل' : 'Child name'}
            placeholderTextColor={COLORS.textMuted}
            value={newChildName}
            onChangeText={setNewChildName}
          />

          <Text style={styles.formLabel}>{t.ageBand}</Text>
          <View style={styles.ageBandRow}>
            {(['4-6', '7-9', '10-13'] as AgeBand[]).map((ab) => (
              <TouchableOpacity
                key={ab}
                style={[
                  styles.ageBandBtn,
                  newChildAgeBand === ab && styles.ageBandBtnActive,
                ]}
                onPress={() => setNewChildAgeBand(ab)}
              >
                <Text
                  style={[
                    styles.ageBandBtnText,
                    newChildAgeBand === ab && styles.ageBandBtnTextActive,
                  ]}
                >
                  {ab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.formLabel}>{t.avatars}</Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLight + '25', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md }}
              onPress={handleUploadAvatarChild}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={14} color={COLORS.primaryDark} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primaryDark }}>
                {language === 'ar' ? 'رفع صورة 📷' : 'Upload Photo 📷'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, marginBottom: SPACING.md, paddingVertical: 4 }}
          >
            {newChildAvatar.startsWith('data:') && (
              <TouchableOpacity
                style={[styles.avatarPickCircle, styles.avatarPickCircleActive]}
              >
                <KidAvatar avatar={newChildAvatar} size={38} />
              </TouchableOpacity>
            )}
            {PRESET_AVATARS.map((av) => (
              <TouchableOpacity
                key={av.id}
                style={[
                  styles.avatarPickCircle,
                  newChildAvatar === av.id && styles.avatarPickCircleActive,
                ]}
                onPress={() => setNewChildAvatar(av.id)}
              >
                <KidAvatar avatar={av.id} size={38} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.saveChildBtn}
            onPress={handleCreateChild}
          >
            <Text style={styles.saveChildBtnText}>{t.save}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  profilesList: {
    gap: SPACING.sm,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    ...SHADOWS.glow(COLORS.primary),
  },
  profileNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  profileAgeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activeProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  activeProfileBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  deleteProfileIconBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FEE2E2',
    marginLeft: SPACING.sm,
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingVertical: 10,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addChildBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  addChildForm: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  formInput: {
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ageBandRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  ageBandBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageBandBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ageBandBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  ageBandBtnTextActive: {
    color: '#FFFFFF',
  },
  avatarPickCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarPickCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  saveChildBtn: {
    height: 42,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  saveChildBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

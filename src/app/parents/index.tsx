// Parents' Corner (Section 5.6 - ركن الوالدين)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, AgeBand } from '@/store/useAppStore';
import { TRANSLATIONS, AVAILABLE_LANGUAGES, LANGUAGE_LOCALIZED_NAMES } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import KidAvatar, { PRESET_AVATARS } from '@/components/KidAvatar';
import InstallAndroidModal from '@/components/InstallAndroidModal';
import { RECITERS } from '@/data/quranData';
import { notificationService, DEFAULT_KID_REMINDERS } from '@/services/notificationService';
import { securityCryptoService } from '@/services/securityCryptoService';

export default function ParentsCornerScreen() {
  const {
    language,
    setLanguage,
    profiles,
    activeProfileId,
    setActiveProfile,
    addProfile,
    deleteProfile,
    getChildProgress,
    parentSettings,
    updateParentSettings,
    setParentPin,
    weeklyChallenges,
    confirmWeeklyChallenge,
  } = useAppStore();

  const t = TRANSLATIONS[language];

  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAgeBand, setNewChildAgeBand] = useState<AgeBand>('7-9');
  const [newChildAvatar, setNewChildAvatar] = useState('av-girl1');

  const [pinInput, setPinInput] = useState('');
  const [pinErrorMessage, setPinErrorMessage] = useState('');
  const [pinSuccessMessage, setPinSuccessMessage] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

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

  const handleTestNotification = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      const sent = await notificationService.sendNotification(
        language === 'ar' ? '🌟 نور للأطفال' : '🌟 Noor Kids',
        language === 'ar'
          ? 'أهلاً بك يا بطل! حان وقت وردك القرآني ودعاء المساء المبارك 📖'
          : 'Welcome, young champion! Time for your Quran Garden recitation and evening Dua 📖'
      );
      if (sent) {
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 4000);
      }
    }
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

  const handleSavePin = () => {
    setPinErrorMessage('');
    const validation = securityCryptoService.validatePinFormat(pinInput);
    if (!validation.valid) {
      const err = language === 'ar' ? (validation.errorAr || 'رمز غير صالح') : (validation.errorEn || 'Invalid PIN');
      setPinErrorMessage(err);
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Validation Error', err);
      return;
    }

    const success = setParentPin(pinInput);
    if (success) {
      setPinInput('');
      setPinSuccessMessage(true);
      setTimeout(() => setPinSuccessMessage(false), 4000);
      Alert.alert(
        language === 'ar' ? 'تم الحفظ بأمان! 🔒' : 'PIN Saved Securely! 🔒',
        language === 'ar'
          ? 'تم تشفير رمز PIN الجديد وحفظه محلياً بنجاح. سيُطلب هذا الرمز عند فتح قسم الوالدين.'
          : 'Your new PIN has been cryptographically salted, hashed, and saved on this device.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header showBack title={t.parents} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Strict Local Privacy Guarantee Banner */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <View style={styles.privacyIconCircle}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>
                {language === 'ar'
                  ? 'الخصوصية التامة والتخزين المحلي 🛡️'
                  : 'Strict On-Device Privacy 🛡️'}
              </Text>
              <Text style={styles.privacyTagline}>
                {language === 'ar'
                  ? '«تُحفظ ملفات الأطفال وتقدمهم على هذا الجهاز فقط، ولا تتم مزامنتها مع أجهزة أخرى»'
                  : '«Child profiles and progress are saved strictly on this device only and are never synced with other devices»'}
              </Text>
            </View>
          </View>

          <View style={styles.privacyBadgesList}>
            <View style={styles.privacyBadgeItem}>
              <Ionicons name="lock-closed" size={15} color="#059669" />
              <Text style={styles.privacyBadgeText}>
                {language === 'ar'
                  ? 'لا توجد خوادم سحابية أو قواعد بيانات خارجية أو حسابات مستخدمين.'
                  : 'No cloud servers, external databases, or user accounts.'}
              </Text>
            </View>
            <View style={styles.privacyBadgeItem}>
              <Ionicons name="eye-off" size={15} color="#059669" />
              <Text style={styles.privacyBadgeText}>
                {language === 'ar'
                  ? 'لا نرسل أي بيانات إلى الإنترنت (أسماء، أعمار، تقدم، نتائج، سجل).'
                  : 'No personal data is sent online (names, ages, scores, or activity).'}
              </Text>
            </View>
            <View style={styles.privacyBadgeItem}>
              <Ionicons name="ban" size={15} color="#059669" />
              <Text style={styles.privacyBadgeText}>
                {language === 'ar'
                  ? 'تطبيق مجاني بالكامل وخالٍ من الإعلانات وأدوات التتبع والتحليلات.'
                  : '100% Free: Zero ads, zero trackers, and zero analytics telemetry.'}
              </Text>
            </View>
            <View style={styles.privacyBadgeItem}>
              <Ionicons name="key" size={15} color="#059669" />
              <Text style={styles.privacyBadgeText}>
                {language === 'ar'
                  ? 'رمز PIN وقفل الأهل محفوظان محلياً داخل ذاكرة هذا الهاتف فقط.'
                  : 'Parent PIN and lock stored strictly in local device memory.'}
              </Text>
            </View>
          </View>

          {/* Local Storage Loss Warning */}
          <View style={styles.privacyWarningBox}>
            <Ionicons name="warning" size={18} color="#D97706" />
            <Text style={styles.privacyWarningText}>
              {language === 'ar'
                ? 'تنبيه هام: نظراً لأن التطبيق لا يستخدم خوادم سحابية لحماية خصوصية أسرتك، فإن مسح بيانات التطبيق أو إلغاء تثبيته سيؤدي إلى حذف ملفات الأطفال والتقدم المحفوظين نهائياً.'
                : 'Notice: Because the app uses no cloud servers to protect privacy, clearing app data or uninstalling the app will permanently erase all saved child profiles and progress.'}
            </Text>
          </View>
        </View>

        {/* Child Profiles Section (PA1) */}
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

        {/* Children Progress Reports Section (Isolated per child on this device) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={20} color="#0284c7" />
            <Text style={styles.sectionTitle}>
              {language === 'ar'
                ? 'سجل إنجازات وتقدم الأطفال (مستقل لكل طفل على هذا الجهاز)'
                : 'Children Progress Reports (Independent per child)'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'تُعرض هنا إنجازات كل طفل بشكل منفصل بناءً على البيانات المخزنة محلياً على هذا الجهاز فقط، دون مزامنة مع أي جهاز آخر.'
              : 'Each child’s progress is tracked independently and saved locally on this device only without cross-device sync.'}
          </Text>

          <View style={styles.childReportsList}>
            {profiles.map((p) => {
              const childProg = getChildProgress(p.id);
              const isActive = p.id === activeProfileId;
              const surahsCount = Object.values(childProg.surahProgress || {}).filter(
                (s) => s.isCompleted
              ).length;
              const hadithsCount = Object.values(childProg.hadithProgress || {}).filter(
                (h) => h.completed
              ).length;
              const storiesCount = Object.values(childProg.storyProgress || {}).filter(
                (st) => st.completed
              ).length;

              return (
                <View
                  key={`report-${p.id}`}
                  style={[
                    styles.childReportCard,
                    isActive && styles.childReportCardActive,
                  ]}
                >
                  <View style={styles.childReportHeader}>
                    <KidAvatar avatar={p.avatar} size={46} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.childReportName}>{p.name}</Text>
                        {isActive && (
                          <View style={styles.activePillBadge}>
                            <Text style={styles.activePillText}>
                              {language === 'ar' ? 'الملف النشط' : 'Active'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.childReportAge}>
                        {p.ageBand === '4-6'
                          ? t.ageBandExplorers
                          : p.ageBand === '7-9'
                          ? t.ageBandLearners
                          : t.ageBandMinds}
                      </Text>
                    </View>

                    {!isActive && (
                      <TouchableOpacity
                        style={styles.switchChildBtn}
                        onPress={() => setActiveProfile(p.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.switchChildBtnText}>
                          {language === 'ar' ? 'تفعيل ↺' : 'Switch ↺'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Stats Grid */}
                  <View style={styles.childStatsGrid}>
                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>⭐</Text>
                      <Text style={styles.childStatValue}>{childProg.stars}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'النجوم' : 'Stars'}
                      </Text>
                    </View>

                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>💎</Text>
                      <Text style={styles.childStatValue}>{childProg.gems}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'الجواهر' : 'Gems'}
                      </Text>
                    </View>

                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>🔥</Text>
                      <Text style={styles.childStatValue}>{childProg.streakCount}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'أيام متتالية' : 'Streak'}
                      </Text>
                    </View>

                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>📖</Text>
                      <Text style={styles.childStatValue}>{surahsCount}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'سور مكتملة' : 'Surahs'}
                      </Text>
                    </View>

                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>📜</Text>
                      <Text style={styles.childStatValue}>{hadithsCount}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'أحاديث' : 'Hadiths'}
                      </Text>
                    </View>

                    <View style={styles.childStatBox}>
                      <Text style={styles.childStatEmoji}>🕌</Text>
                      <Text style={styles.childStatValue}>{storiesCount}</Text>
                      <Text style={styles.childStatLabel}>
                        {language === 'ar' ? 'قصص الأنبياء' : 'Stories'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Time Limit (PA3) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="timer" size={20} color={COLORS.secondaryDark} />
            <Text style={styles.sectionTitle}>{t.dailyLimit}</Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'حدد الوقت اليومي المسموح به للتعلم، ليظهر للبطل رسالة تشجيعية عند الوصول للهدف'
              : 'Set a healthy daily time goal for your child.'}
          </Text>

          <View style={styles.limitButtonsRow}>
            {[5, 10, 15, 20, 30].map((min) => {
              const isSelected = parentSettings.dailyLimitMin === min;

              return (
                <TouchableOpacity
                  key={min}
                  style={[
                    styles.limitBtn,
                    isSelected && styles.limitBtnSelected,
                  ]}
                  onPress={() => updateParentSettings({ dailyLimitMin: min })}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.limitBtnText,
                      isSelected && styles.limitBtnTextSelected,
                    ]}
                  >
                    {min} {t.minutes}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Real-Life Manners Challenges Approval (PA4, E3) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#059669" />
            <Text style={styles.sectionTitle}>
              {language === 'ar'
                ? 'مصادقة تحديات الأخلاق الحقيقية (PA4)'
                : 'Real-Life Manners Approval'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'عندما يُطبّق طفلك خُلقاً وسلوكاً حسناً في الحياة الواقعية (مثل بر الوالدين أو إفشاء السلام)، صدّق على إنجازه هنا لمنحه جواهر ومكافآت التميز!'
              : 'When your child puts good manners into real-life practice, verify their achievement here to award them bonus gems and celebrate!'}
          </Text>

          <View style={styles.challengesList}>
            {weeklyChallenges.map((c) => {
              const isConfirmed = c.confirmedByParent;
              const isChildDone = c.completedByChild;

              return (
                <View
                  key={c.id}
                  style={[
                    styles.challengeCard,
                    isConfirmed && styles.challengeCardConfirmed,
                  ]}
                >
                  <View style={styles.challengeTopRow}>
                    <Text style={styles.challengeEmoji}>{c.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.challengeTitle}>
                        {language === 'ar' ? c.titleAr : c.titleEn}
                      </Text>
                      <Text style={styles.challengeDesc}>
                        {language === 'ar' ? c.descAr : c.descEn}
                      </Text>
                    </View>
                    <View style={styles.challengeRewardBadge}>
                      <Text style={styles.challengeRewardText}>
                        +{c.gemReward} 💎
                      </Text>
                    </View>
                  </View>

                  <View style={styles.challengeActionRow}>
                    {isConfirmed ? (
                      <View style={styles.confirmedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#059669" />
                        <Text style={styles.confirmedBadgeText}>
                          {language === 'ar' ? 'تم الاعتماد ومنح الجواهر ✓' : 'Approved & Rewarded ✓'}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.approveBtn,
                          isChildDone && styles.approveBtnHighlighted,
                        ]}
                        onPress={() => {
                          confirmWeeklyChallenge(c.id);
                          Alert.alert(
                            language === 'ar' ? 'تم الاعتماد بنجاح! 🎉' : 'Approved! 🎉',
                            language === 'ar'
                              ? `بارك الله في طفلك! تم منح +${c.gemReward} جواهر و +3 نجوم.`
                              : `Mabrook! Awarded +${c.gemReward} gems and +3 stars.`
                          );
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="sparkles"
                          size={15}
                          color={COLORS.textLight}
                        />
                        <Text style={styles.approveBtnText}>
                          {isChildDone
                            ? (language === 'ar'
                                ? `✨ مصادقة إنجاز البطل (+${c.gemReward} جواهر)`
                                : `✨ Verify Child’s Deed (+${c.gemReward} Gems)`)
                            : (language === 'ar'
                                ? `✓ اعتماد السلوك الطيب (+${c.gemReward} جواهر)`
                                : `✓ Confirm Good Deed (+${c.gemReward} Gems)`)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Content & Reciter Settings (PA5) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={20} color={COLORS.primaryDark} />
            <Text style={styles.sectionTitle}>{t.contentSettings}</Text>
          </View>

          {/* Reciter Selector */}
          <Text style={styles.formLabel}>
            {t.reciter} ({RECITERS.length}{' '}
            {language === 'ar' ? 'قارئ متاح' : 'reciters available'})
          </Text>
          <ScrollView
            style={{ maxHeight: 280, marginBottom: SPACING.md }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.recitersList}>
              {RECITERS.map((r) => {
                const isSelected = parentSettings.reciterId === r.id;

                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.reciterRow,
                      isSelected && styles.reciterRowSelected,
                    ]}
                    onPress={() => updateParentSettings({ reciterId: r.id })}
                  >
                    <Ionicons
                      name="mic"
                      size={18}
                      color={isSelected ? COLORS.primary : COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reciterName}>
                        {language === 'ar' ? r.nameArabic : r.nameEnglish}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: COLORS.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {r.style}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Translation Switch */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t.translation}</Text>
            <Switch
              value={parentSettings.showEnglishTranslation}
              onValueChange={(val) =>
                updateParentSettings({ showEnglishTranslation: val })
              }
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={
                parentSettings.showEnglishTranslation
                  ? COLORS.primary
                  : COLORS.cardAlt
              }
            />
          </View>

          {/* Trusted Translation Source Selector */}
          {parentSettings.showEnglishTranslation && (
            <View style={styles.translationSourcesBox}>
              <Text style={styles.subFormLabel}>
                {language === 'ar'
                  ? 'مصدر الترجمة الإنجليزية المعتمد:'
                  : 'Trusted English Translation Source:'}
              </Text>
              {[
                {
                  id: 'sahih',
                  nameAr: 'صحيح إنترناشونال (Saheeh International)',
                  nameEn: 'Saheeh International',
                  descAr: 'الأكثر اعتماداً وانتشاراً عالمياً، دقيقة ومطابقة لتفاسير أهل السنة.',
                  descEn: 'Most widely accepted standard in the Muslim world, highly faithful to classical tafsir.',
                  badge: 'Standard / المعتمد',
                },
                {
                  id: 'clearquran',
                  nameAr: 'التفسير الواضح (The Clear Quran - د. مصطفى خطاب)',
                  nameEn: 'The Clear Quran (Dr. Mustafa Khattab)',
                  descAr: 'مصرح رسمياً من مجمع البحوث الإسلامية بالأزهر الشريف، لغة إنجليزية معاصرة وواضحة جداً للأطفال.',
                  descEn: 'Officially approved by Al-Azhar Academy; modern, fluid, and ideal for kids and young learners.',
                  badge: 'Al-Azhar Approved / مصرح من الأزهر',
                },
                {
                  id: 'abdelhaleem',
                  nameAr: 'أكسفورد (د. محمد عبد الحليم - M.A.S. Abdel Haleem)',
                  nameEn: 'M.A.S. Abdel Haleem (Oxford)',
                  descAr: 'صادرة عن مطبعة جامعة أكسفورد، تتميز بالأسلوب الأدبي الإنجليزي السلس.',
                  descEn: 'Oxford World’s Classics edition; renowned for literary flow and readability.',
                  badge: 'Oxford Classics',
                },
              ].map((src) => {
                const isSelected =
                  (parentSettings.translationSource || 'sahih') === src.id;

                return (
                  <TouchableOpacity
                    key={src.id}
                    style={[
                      styles.translationSourceCard,
                      isSelected && styles.translationSourceCardSelected,
                    ]}
                    onPress={() =>
                      updateParentSettings({
                        translationSource: src.id as
                          | 'sahih'
                          | 'clearquran'
                          | 'abdelhaleem',
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.translationSourceTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.translationSourceName}>
                          {language === 'ar' ? src.nameAr : src.nameEn}
                        </Text>
                        <Text style={styles.translationSourceDesc}>
                          {language === 'ar' ? src.descAr : src.descEn}
                        </Text>
                      </View>
                      <View style={styles.sourceRadio}>
                        {isSelected && <View style={styles.sourceRadioInner} />}
                      </View>
                    </View>
                    <View style={styles.sourceBadgePill}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#059669"
                      />
                      <Text style={styles.sourceBadgePillText}>
                        {src.badge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Simple Tafsir Switch */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t.simpleMeaning}</Text>
            <Switch
              value={parentSettings.showSimpleTafsir}
              onValueChange={(val) =>
                updateParentSettings({ showSimpleTafsir: val })
              }
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={
                parentSettings.showSimpleTafsir
                  ? COLORS.primary
                  : COLORS.cardAlt
              }
            />
          </View>
        </View>

        {/* Daily Kid Gentle Reminders Card (PA6 / Push Notifications) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={20} color={COLORS.primaryDark} />
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'التنبيهات اليومية اللطيفة للطفل' : 'Daily Gentle Reminders'}
            </Text>
          </View>

          <Text style={styles.remindersSubtext}>
            {language === 'ar'
              ? 'تذكيرات محببة غير مزعجة في مواعيد مناسبة لتحفيز الطفل على ورد القرآن والأذكار اليومية:'
              : 'Gentle, friendly reminders to encourage your child to learn and practice daily:'}
          </Text>

          <View style={styles.remindersList}>
            {DEFAULT_KID_REMINDERS.map((rem) => (
              <View
                key={rem.id}
                style={[
                  styles.reminderItemRow,
                  { flexDirection: language === 'ar' ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={styles.reminderTimeBadge}>
                  <Text style={styles.reminderTimeText}>{rem.timeLabel}</Text>
                </View>
                <View style={[styles.reminderTextCol, { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.reminderItemTitle}>
                    {language === 'ar' ? rem.titleAr : rem.titleEn}
                  </Text>
                  <Text style={styles.reminderItemBody}>
                    {language === 'ar' ? rem.bodyAr : rem.bodyEn}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.testNotificationBtn,
              testNotificationSent && styles.testNotificationBtnSuccess,
            ]}
            onPress={handleTestNotification}
            activeOpacity={0.8}
          >
            <Ionicons
              name={testNotificationSent ? 'checkmark-circle' : 'notifications-outline'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.testNotificationBtnText}>
              {testNotificationSent
                ? (language === 'ar' ? '✓ تم إرسال التنبيه التجريبي بنجاح!' : '✓ Test Notification Sent!')
                : (language === 'ar' ? 'إرسال تنبيه تجريبي لهاتف الطفل الآن 🔔' : 'Send Test Notification Now 🔔')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security PIN Setting */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.parentPin}</Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'رمز الحماية (PIN) يُحفظ محلياً بصيغة مشفرة (Salted SHA-256) على هذا الجهاز لحماية قسم الأهل ومنع تخمين الرمز بمؤقت أمان تصاعدي.'
              : 'Your security PIN is stored locally using salted SHA-256 hashing on this device only, backed by exponential brute-force lockout.'}
          </Text>

          <View style={styles.pinStatusRow}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.pinStatusText}>
              {language === 'ar'
                ? `الحماية الحالية: ${parentSettings.pinHash ? 'مشفر ومحمي بنجاح ✓' : 'الرمز الافتراضي (1234)'}`
                : `Status: ${parentSettings.pinHash ? 'Encrypted & Active ✓' : 'Default PIN Active'}`}
            </Text>
          </View>

          <View style={[styles.pinRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={(text) => {
                setPinInput(text);
                setPinErrorMessage('');
              }}
              placeholder={language === 'ar' ? 'رمز جديد (٤-٦ أرقام)' : 'New PIN (4-6 digits)'}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.pinSaveBtn} onPress={handleSavePin} activeOpacity={0.8}>
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
              <Text style={styles.pinSaveBtnText}>{t.save}</Text>
            </TouchableOpacity>
          </View>

          {pinErrorMessage ? (
            <Text style={styles.pinErrorText}>{pinErrorMessage}</Text>
          ) : null}

          {pinSuccessMessage ? (
            <View style={styles.pinSuccessBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#065F46" />
              <Text style={styles.pinSuccessBadgeText}>
                {language === 'ar' ? '✓ تم تشفير وحفظ رمز PIN الجديد بنجاح!' : '✓ PIN updated and encrypted!'}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Language switch */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.changeLanguage}</Text>
          </View>

          <View style={styles.langGrid}>
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langCardItem,
                    isSelected && styles.langCardItemActive,
                  ]}
                  onPress={() => setLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.langCodeBadge}>
                    <Text style={styles.langCodeBadgeText}>{lang.code.toUpperCase()}</Text>
                  </View>
                  <View style={styles.langTextCol}>
                    <Text
                      style={[
                        styles.langNameNative,
                        isSelected && styles.langNameNativeActive,
                      ]}
                    >
                      {lang.nameNative}
                    </Text>
                    <Text style={styles.langNameSub}>
                      {LANGUAGE_LOCALIZED_NAMES[language]?.[lang.code] || lang.nameNative}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* App Installation on Child's Device (Android / PWA) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'تثبيت التطبيق على جهاز الطفل' : 'Install App on Child’s Device'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'يمكنك تثبيت تطبيق "نور للأطفال" كـ تطبيق أصلي مستقل على هاتف أو جهاز طفلك اللوحي (أندرويد) ليعمل مباشرة وبدون الحاجة لمتجر التطبيقات.'
              : 'You can install Noor Kids as a standalone app on your child’s Android phone or tablet directly without an app store.'}
          </Text>

          <InstallAndroidModal />
        </View>

        {/* Offline Mode & External Features Transparency */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud-offline" size={20} color="#059669" />
            <Text style={styles.sectionTitle}>
              {language === 'ar'
                ? 'العمل دون إنترنت وشفافية الميزات الخارجية'
                : 'Offline First & External Services Transparency'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'يعمل التطبيق وجميع محتوياته التعليمية دون اتصال بالإنترنت، لحماية طفلك وتوفير بيئة تعليمية هادئة وآمنة.'
              : 'The app and all its educational content work offline without internet, ensuring a calm, safe environment for your child.'}
          </Text>

          <View style={styles.offlineFeaturesBox}>
            <Text style={styles.offlineBoxHeading}>
              {language === 'ar' ? '✨ يعمل ١٠٠٪ دون اتصال بالإنترنت (Offline):' : '✨ 100% Offline Features:'}
            </Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'سور جزء عمّ كاملة وسورة الفاتحة وآية الكرسي' : 'All Juz Amma Surahs, Al-Fatiha, and Ayat Al-Kursi'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'الأحاديث النبوية الشريفة الـ ٥٠ والـ ١٠٠ مع المعاني اللطيفة' : 'Noble Hadiths (50 & 100 collections) with kid-friendly meanings'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'قصص الأنبياء المصورة والاختبارات التفاعلية' : 'Prophets stories and quizzes'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'محاكي الوضوء ومحاكي الصلاة ثلاثي الأبعاد وأكاديمية الأركان' : '3D Wudu Simulator, 3D Salah Simulator, and Pillars Academy'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'المسبحة الذكية والأذكار اليومية ومولد الشهادات' : 'Kid Tasbih, daily adhkar, and certificate generator'}</Text>
          </View>

          <View style={[styles.offlineFeaturesBox, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', marginTop: SPACING.sm }]}>
            <Text style={[styles.offlineBoxHeading, { color: '#0369A1' }]}>
              {language === 'ar' ? '🌐 ميزات خارجية تتطلب اتصالاً بالإنترنت:' : '🌐 External Features Requiring Internet:'}
            </Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'استماع تلاوة القراء (بث صوتي مباشر من أرشيف EveryAyah المفتوح)' : 'Streaming audio recitations (from open EveryAyah CDN)'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'تحميل سور القرآن الكريم الكاملة خارج جزء عمّ (من AlQuran Cloud)' : 'Loading Surah texts outside Juz Amma (from AlQuran Cloud)'}</Text>
            <Text style={styles.offlineBullet}>• {language === 'ar' ? 'النطق الصوتي السحابي البديل في حال عدم توفر محرك أندرويد الصوتي' : 'Cloud TTS fallback if local Android voice synthesis engine is absent'}</Text>

            <View style={styles.privacyAssurancePill}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.privacyAssurancePillText}>
                {language === 'ar'
                  ? 'تأكيد صارم: لا نرسل أي بيانات شخصية أو معلومات عن طفلك مع أي من هذه الطلبات الخارجية.'
                  : 'Strict Guarantee: No personal data or child info is ever sent with these external requests.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
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
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  profileCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '22',
  },
  profileEmoji: {
    fontSize: 28,
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
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primaryLight + '22',
    borderRadius: RADIUS.lg,
  },
  addChildBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  addChildForm: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  formInput: {
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ageBandBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '33',
  },
  ageBandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  ageBandBtnTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  saveChildBtn: {
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveChildBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  avatarPickCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  avatarPickCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '33',
  },
  limitButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  limitBtn: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  limitBtnSelected: {
    borderColor: COLORS.secondaryDark,
    backgroundColor: COLORS.secondaryLight,
  },
  limitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  limitBtnTextSelected: {
    color: COLORS.secondaryDark,
  },
  recitersList: {
    gap: 6,
    marginBottom: SPACING.md,
  },
  reciterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  reciterRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '22',
  },
  reciterName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 4,
  },
  pinInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 2,
  },
  pinSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    ...SHADOWS.glow(COLORS.primary),
  },
  pinSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  langGrid: {
    gap: 8,
  },
  langCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  langCardItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '18',
  },
  langCodeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FBBF24',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langCodeBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  langTextCol: {
    flex: 1,
  },
  langNameNative: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  langNameNativeActive: {
    color: COLORS.primaryDark,
  },
  langNameSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
    fontWeight: '600',
  },
  translationSourcesBox: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.xs + 2,
  },
  subFormLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  translationSourceCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 8,
  },
  translationSourceCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
  },
  translationSourceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  translationSourceName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  translationSourceDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sourceRadio: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  sourceRadioInner: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  sourceBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: COLORS.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  sourceBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  challengesList: {
    gap: SPACING.sm,
  },
  challengeCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  challengeCardConfirmed: {
    borderColor: '#059669',
    backgroundColor: '#05966910',
  },
  challengeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  challengeEmoji: {
    fontSize: 26,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  challengeDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  challengeRewardBadge: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  challengeRewardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284c7',
  },
  challengeActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 4,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#05966920',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  confirmedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  approveBtnHighlighted: {
    backgroundColor: COLORS.secondaryDark,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  remindersSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  remindersList: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  reminderItemRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 10,
  },
  reminderTimeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  reminderTimeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  reminderItemBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  testNotificationBtnSuccess: {
    backgroundColor: '#059669',
  },
  testNotificationBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  privacyCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    ...SHADOWS.soft,
    gap: SPACING.md,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  privacyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
  },
  privacyTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
    lineHeight: 17,
  },
  privacyBadgesList: {
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  privacyBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyBadgeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    lineHeight: 16,
  },
  privacyWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  privacyWarningText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 16,
  },
  activeProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  activeProfileBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  deleteProfileIconBtn: {
    padding: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#FEE2E2',
    marginLeft: 6,
  },
  childReportsList: {
    gap: SPACING.md,
  },
  childReportCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  childReportCardActive: {
    borderColor: '#0284c7',
    backgroundColor: '#F0F9FF',
  },
  childReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  childReportName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  activePillBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  childReportAge: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  switchChildBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  switchChildBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  childStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  childStatBox: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  childStatEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  childStatValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  childStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  offlineFeaturesBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 6,
  },
  offlineBoxHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
    marginBottom: 2,
  },
  offlineBullet: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
  },
  privacyAssurancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: RADIUS.md,
    marginTop: 6,
  },
  privacyAssurancePillText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    lineHeight: 16,
  },
  pinStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  pinStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  pinErrorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  pinSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginTop: 8,
  },
  pinSuccessBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
});

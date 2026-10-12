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
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import KidAvatar, { PRESET_AVATARS } from '@/components/KidAvatar';
import InstallAndroidModal from '@/components/InstallAndroidModal';
import { RECITERS } from '@/data/quranData';
import { notificationService, DEFAULT_KID_REMINDERS } from '@/services/notificationService';

export default function ParentsCornerScreen() {
  const {
    language,
    setLanguage,
    profiles,
    activeProfileId,
    setActiveProfile,
    addProfile,
    parentSettings,
    updateParentSettings,
    weeklyChallenges,
    confirmWeeklyChallenge,
  } = useAppStore();

  const t = TRANSLATIONS[language];

  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAgeBand, setNewChildAgeBand] = useState<AgeBand>('7-9');
  const [newChildAvatar, setNewChildAvatar] = useState('av-girl1');

  const [pinInput, setPinInput] = useState(parentSettings.pin);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

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
    if (pinInput.trim().length >= 4) {
      updateParentSettings({ pin: pinInput.trim() });
      Alert.alert(
        language === 'ar' ? 'تم الحفظ' : 'Saved',
        language === 'ar' ? 'تم تحديث رمز الحماية بنجاح' : 'PIN updated successfully'
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
        {/* Child Profiles Section (PA1) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.childProfiles}</Text>
          </View>

          <View style={styles.profilesList}>
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;

              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.profileCard,
                    isActive && styles.profileCardActive,
                  ]}
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
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  ) : null}
                </TouchableOpacity>
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
            <Ionicons name="key" size={20} color={COLORS.textSecondary} />
            <Text style={styles.sectionTitle}>{t.parentPin}</Text>
          </View>

          <View style={styles.pinRow}>
            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.pinSaveBtn} onPress={handleSavePin}>
              <Text style={styles.pinSaveBtnText}>{t.save}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language switch */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.changeLanguage}</Text>
          </View>

          <View style={styles.langSwitchRow}>
            <TouchableOpacity
              style={[
                styles.langChoiceBtn,
                language === 'ar' && styles.langChoiceBtnActive,
              ]}
              onPress={() => setLanguage('ar')}
            >
              <Text
                style={[
                  styles.langChoiceText,
                  language === 'ar' && styles.langChoiceTextActive,
                ]}
              >
                العربية (Arabic)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langChoiceBtn,
                language === 'en' && styles.langChoiceBtnActive,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text
                style={[
                  styles.langChoiceText,
                  language === 'en' && styles.langChoiceTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
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
    gap: SPACING.sm,
  },
  pinInput: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pinSaveBtn: {
    width: 80,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinSaveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  langSwitchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  langChoiceBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  langChoiceBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '22',
  },
  langChoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langChoiceTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
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
});

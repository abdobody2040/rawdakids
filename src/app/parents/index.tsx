// src/app/parents/index.tsx
// Parents' Corner (Section 5.6 - ركن الوالدين)
// Orchestrates modular parental controls, child profile management, and privacy dashboards.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, AVAILABLE_LANGUAGES, LANGUAGE_LOCALIZED_NAMES } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import InstallAndroidModal from '@/components/InstallAndroidModal';
import { RECITERS } from '@/data/quranData';
import { notificationService, DEFAULT_KID_REMINDERS } from '@/services/notificationService';

// Modular Child & Security Cards
import ChildProfilesCard from '@/components/parents/ChildProfilesCard';
import ChildProgressReportsCard from '@/components/parents/ChildProgressReportsCard';
import WeeklyChallengesCard from '@/components/parents/WeeklyChallengesCard';
import ParentPinCard from '@/components/parents/ParentPinCard';
import EncryptedBackupCard from '@/components/parents/EncryptedBackupCard';
import CloudSyncCard from '@/components/parents/CloudSyncCard';

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
    exportEncryptedBackup,
    importEncryptedBackup,
    restoreValidatedData,
    weeklyChallenges,
    confirmWeeklyChallenge,
    resetChildProgress,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleTestNotification = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      const sent = await notificationService.sendNotification(
        language === 'ar' ? '🌟 روضة كيدز' : '🌟 Rawdakids',
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

          <View style={styles.privacyWarningBox}>
            <Ionicons name="warning" size={18} color="#D97706" />
            <Text style={styles.privacyWarningText}>
              {language === 'ar'
                ? 'تنبيه هام: نظراً لأن التطبيق لا يستخدم خوادم سحابية لحماية خصوصية أسرتك، فإن مسح بيانات التطبيق أو إلغاء تثبيته سيؤدي إلى حذف ملفات الأطفال والتقدم المحفوظين نهائياً.'
                : 'Notice: Because the app uses no cloud servers to protect privacy, clearing app data or uninstalling the app will permanently erase all saved child profiles and progress.'}
            </Text>
          </View>
        </View>

        {/* 1. Child Profiles Management Card */}
        <ChildProfilesCard
          language={language}
          t={t}
          profiles={profiles}
          activeProfileId={activeProfileId}
          setActiveProfile={setActiveProfile}
          addProfile={addProfile}
          deleteProfile={deleteProfile}
        />

        {/* 2. Isolated Progress Reports Card */}
        <ChildProgressReportsCard
          language={language}
          t={t}
          profiles={profiles}
          activeProfileId={activeProfileId}
          setActiveProfile={setActiveProfile}
          getChildProgress={getChildProgress}
        />

        {/* 3. Daily Time Limit Goal */}
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

        {/* 4. Real-Life Manners Challenges Approval Card */}
        <WeeklyChallengesCard
          language={language}
          weeklyChallenges={weeklyChallenges}
          confirmWeeklyChallenge={confirmWeeklyChallenge}
        />

        {/* 5. Content & Reciter Settings */}
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

        {/* 6. Daily Gentle Reminders Card */}
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

        {/* 7. Security PIN Setting Card */}
        <ParentPinCard
          language={language}
          t={t}
          parentSettings={parentSettings}
          setParentPin={setParentPin}
        />

        {/* 8. Language Selector */}
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

        {/* 9. Standalone Android PWA Installation */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'تثبيت التطبيق على جهاز الطفل' : 'Install App on Child’s Device'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'يمكنك تثبيت تطبيق "روضة كيدز" كـ تطبيق أصلي مستقل على هاتف أو جهاز طفلك اللوحي (أندرويد) ليعمل مباشرة وبدون الحاجة لمتجر التطبيقات.'
              : 'You can install Rawdakids as a standalone app on your child’s Android phone or tablet directly without an app store.'}
          </Text>

          <InstallAndroidModal />
        </View>

        {/* 10. Authenticated Encrypted Backup & Restore */}
        <EncryptedBackupCard
          language={language}
          exportEncryptedBackup={exportEncryptedBackup}
          importEncryptedBackup={importEncryptedBackup}
        />

        {/* 11. Multi-Device Cloud Sync */}
        <CloudSyncCard
          language={language}
          restoreValidatedData={restoreValidatedData}
        />

        {/* 12. Reset Active Child Progress */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="refresh-circle" size={20} color="#DC2626" />
            <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>
              {language === 'ar' ? 'إعادة ضبط إنجازات الطفل' : 'Reset Child Progress'}
            </Text>
          </View>

          <Text style={styles.settingDesc}>
            {language === 'ar'
              ? 'يمكنك تصفير النجوم والجواهر والأيام المتتالية للطفل الحالي لتبدأ رحلة التعلم من الصفر (0).'
              : 'Reset stars, gems, streak, and achievements for the active child to start fresh from zero (0).'}
          </Text>

          {resetSuccess ? (
            <View style={{ backgroundColor: '#DCFCE7', padding: 12, borderRadius: RADIUS.md, alignItems: 'center' }}>
              <Text style={{ color: '#166534', fontWeight: 'bold' }}>
                {language === 'ar' ? '✓ تم تصفير إنجازات الطفل بنجاح!' : '✓ Child progress reset to 0 successfully!'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#FEE2E2',
                borderWidth: 1,
                borderColor: '#F87171',
                paddingVertical: 12,
                borderRadius: RADIUS.md,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => {
                resetChildProgress();
                setResetSuccess(true);
                setTimeout(() => setResetSuccess(false), 3500);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color="#DC2626" />
              <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>
                {language === 'ar' ? 'تصفير إنجازات الطفل الحالي والبدء من 0' : 'Reset Active Child Progress to 0'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 13. Offline Mode & Transparency */}
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
  privacyCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    ...SHADOWS.soft,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  privacyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
  },
  privacyTagline: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16,
  },
  privacyBadgesList: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  privacyBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
  privacyWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  privacyWarningText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  limitButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  limitBtn: {
    flex: 1,
    minWidth: 54,
    paddingVertical: 10,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  limitBtnSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondaryDark,
  },
  limitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  limitBtnTextSelected: {
    color: COLORS.textLight,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subFormLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  recitersList: {
    gap: SPACING.xs,
  },
  reciterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardAlt,
  },
  reciterRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '22',
  },
  reciterName: {
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
  translationSourcesBox: {
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  translationSourceCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  translationSourceCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  translationSourceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  translationSourceName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  translationSourceDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  sourceRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  sourceRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  sourceBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  sourceBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  remindersSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  remindersList: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  reminderItemRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reminderTimeBadge: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  reminderTimeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  reminderItemBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  testNotificationBtnSuccess: {
    backgroundColor: '#059669',
  },
  testNotificationBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  langGrid: {
    gap: SPACING.sm,
  },
  langCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  langCardItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
    ...SHADOWS.glow(COLORS.primary),
  },
  langCodeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langCodeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
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
    marginTop: 2,
  },
  offlineFeaturesBox: {
    backgroundColor: '#F0FDF4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  offlineBoxHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: SPACING.xs,
  },
  offlineBullet: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  privacyAssurancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  privacyAssurancePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    flex: 1,
    lineHeight: 15,
  },
});

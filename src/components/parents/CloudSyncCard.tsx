// src/components/parents/CloudSyncCard.tsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { cloudSyncService, ParentUserSession } from '@/services/cloudSyncService';
import { ValidatedBackupData } from '@/services/backupValidationService';

interface CloudSyncCardProps {
  language: Language;
  restoreValidatedData: (data: ValidatedBackupData) => { success: boolean; profileCount: number };
}

export default function CloudSyncCard({
  language,
  restoreValidatedData,
}: CloudSyncCardProps) {
  const [syncSession, setSyncSession] = useState<ParentUserSession | null>(null);
  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    cloudSyncService.getSession().then((sess) => setSyncSession(sess));
    cloudSyncService.getLastSyncTime().then((time) => setLastSyncTime(time));
  }, []);

  const handleSyncLogin = async () => {
    if (!syncEmail.trim() || !syncPassword.trim()) {
      setSyncNotice({
        type: 'error',
        text: language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Please enter email and password.',
      });
      return;
    }
    setSyncLoading(true);
    setSyncNotice(null);
    const res = await cloudSyncService.login(syncEmail.trim(), syncPassword.trim());
    setSyncLoading(false);
    if (res.success && res.session) {
      setSyncSession(res.session);
      setSyncPassword('');
      setSyncNotice({
        type: 'success',
        text: language === 'ar' ? '✓ تم تسجيل الدخول بنجاح وتفعيل الربط السحابي الآمن!' : '✓ Logged in successfully. Secure cloud sync activated!',
      });
    } else {
      setSyncNotice({
        type: 'error',
        text: language === 'ar' ? (res.errorAr || 'فشل تسجيل الدخول') : (res.errorEn || 'Login failed'),
      });
    }
  };

  const handleSyncLogout = async () => {
    await cloudSyncService.logout();
    setSyncSession(null);
    setLastSyncTime(null);
    setSyncNotice({
      type: 'success',
      text: language === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Logged out successfully.',
    });
  };

  const handleSyncPush = async () => {
    setSyncLoading(true);
    setSyncNotice(null);
    const state = useAppStore.getState();
    const res = await cloudSyncService.pushProgress({
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      profilesProgress: state.profilesProgress,
      parentSettings: state.parentSettings,
      gratitudeEntries: state.gratitudeEntries,
    });
    setSyncLoading(false);
    if (res.success && res.syncedAt) {
      setLastSyncTime(res.syncedAt);
      setSyncNotice({
        type: 'success',
        text: language === 'ar' ? '✓ تم رفع ومزامنة تقدم الأطفال بنجاح إلى السحابة!' : '✓ Progress synced successfully to secure cloud!',
      });
    } else {
      setSyncNotice({
        type: 'error',
        text: language === 'ar' ? (res.errorAr || 'فشلت المزامنة') : (res.errorEn || 'Sync push failed'),
      });
    }
  };

  const handleSyncPull = async () => {
    setSyncLoading(true);
    setSyncNotice(null);
    const res = await cloudSyncService.pullProgress();
    setSyncLoading(false);
    if (res.success) {
      if (!res.hasData || !res.data) {
        setSyncNotice({
          type: 'error',
          text: language === 'ar' ? 'لا توجد بيانات سحابية محفوظة لحسابك حتى الآن.' : 'No cloud data found for your account.',
        });
        return;
      }
      const restoreRes = restoreValidatedData(res.data);
      if (restoreRes.success) {
        if (res.syncedAt) setLastSyncTime(res.syncedAt);
        setSyncNotice({
          type: 'success',
          text: language === 'ar'
            ? `✓ تم استعادة البيانات بنجاح (${restoreRes.profileCount} ملفات أطفال)!`
            : `✓ Restored successfully (${restoreRes.profileCount} child profiles)!`,
        });
        Alert.alert(
          language === 'ar' ? 'اكتملت المزامنة السحابية 🎉' : 'Cloud Sync Complete 🎉',
          language === 'ar' ? 'تم تحديث بيانات وملفات أطفالك من السحابة بنجاح.' : 'Child progress updated from cloud.'
        );
      }
    } else {
      setSyncNotice({
        type: 'error',
        text: language === 'ar' ? (res.errorAr || 'فشلت الاستعادة') : (res.errorEn || 'Pull failed'),
      });
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="cloud-upload" size={20} color="#0284C7" />
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'المزامنة السحابية متعددة الأجهزة' : 'Multi-Device Cloud Sync'}
        </Text>
      </View>

      <Text style={styles.settingDesc}>
        {language === 'ar'
          ? 'مزامنة سحابية آمنة ومشفرة بالـ JWT لحساب الأسرة مع عزل كامل للبيانات (Multi-Tenant RLS). تتيح لك نقل ومزامنة تقدم أطفالك بين هاتفك وجهاز طفلك اللوحي.'
          : 'Secure JWT-authenticated cloud sync with strict multi-tenant isolation (RLS). Sync child progress seamlessly between your phone and child’s tablet.'}
      </Text>

      {syncNotice ? (
        <View
          style={[
            styles.backupNoticeBox,
            syncNotice.type === 'error' ? styles.backupNoticeError : styles.backupNoticeSuccess,
          ]}
        >
          <Ionicons
            name={syncNotice.type === 'error' ? 'alert-circle' : 'checkmark-circle'}
            size={16}
            color={syncNotice.type === 'error' ? '#DC2626' : '#059669'}
          />
          <Text
            style={[
              styles.backupNoticeText,
              { color: syncNotice.type === 'error' ? '#DC2626' : '#065F46' },
            ]}
          >
            {syncNotice.text}
          </Text>
        </View>
      ) : null}

      {syncSession ? (
        <View style={styles.backupSubCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="shield-checkmark" size={18} color="#059669" />
              <Text style={[styles.backupSubTitle, { color: '#059669', marginBottom: 0 }]}>
                {language === 'ar' ? 'الحساب متصل وآمن' : 'Connected & Authenticated'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSyncLogout} activeOpacity={0.7}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#DC2626' }}>
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 13, color: COLORS.text, fontWeight: '600', marginBottom: 4 }}>
            {language === 'ar' ? `البريد: ${syncSession.email}` : `Account: ${syncSession.email}`}
          </Text>
          {lastSyncTime ? (
            <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: SPACING.md }}>
              {language === 'ar'
                ? `آخر مزامنة: ${new Date(lastSyncTime).toLocaleDateString()} ${new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : `Last Synced: ${new Date(lastSyncTime).toLocaleDateString()} ${new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </Text>
          ) : (
            <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: SPACING.md }}>
              {language === 'ar' ? 'لم تتم المزامنة بعد' : 'No sync performed yet'}
            </Text>
          )}

          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <TouchableOpacity
              style={[styles.backupExportBtn, { flex: 1, backgroundColor: '#0284C7' }]}
              onPress={handleSyncPush}
              disabled={syncLoading}
              activeOpacity={0.8}
            >
              {syncLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.backupBtnText}>
                    {language === 'ar' ? 'رفع ومزامنة الآن' : 'Push to Cloud'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backupImportBtn, { flex: 1, marginTop: 0, backgroundColor: '#059669' }]}
              onPress={handleSyncPull}
              disabled={syncLoading}
              activeOpacity={0.8}
            >
              {syncLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-download-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.backupBtnText}>
                    {language === 'ar' ? 'استعادة من السحابة' : 'Pull from Cloud'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.backupSubCard}>
          <Text style={styles.backupSubTitle}>
            {language === 'ar' ? 'تسجيل دخول حساب ولي الأمر:' : 'Parent Account Sign In:'}
          </Text>
          <TextInput
            style={styles.backupInput}
            placeholder={language === 'ar' ? 'البريد الإلكتروني (مثال: parent@example.com)' : 'Email (e.g. parent@example.com)'}
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={syncEmail}
            onChangeText={setSyncEmail}
          />
          <TextInput
            style={styles.backupInput}
            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={true}
            value={syncPassword}
            onChangeText={setSyncPassword}
          />
          <TouchableOpacity
            style={[styles.backupExportBtn, { backgroundColor: '#0284C7' }]}
            onPress={handleSyncLogin}
            disabled={syncLoading}
            activeOpacity={0.8}
          >
            {syncLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                <Text style={styles.backupBtnText}>
                  {language === 'ar' ? 'تسجيل الدخول وربط المزامنة' : 'Sign In & Connect'}
                </Text>
              </>
            )}
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
  backupNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  backupNoticeError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  backupNoticeSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  backupNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  backupSubCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backupSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  backupInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 46,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  backupExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#0284C7',
    ...SHADOWS.glow('#0284C7'),
  },
  backupImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#059669',
    ...SHADOWS.glow('#059669'),
  },
  backupBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

// src/components/parents/EncryptedBackupCard.tsx
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { EncryptedBackupEnvelope } from '@/services/securityCryptoService';

interface EncryptedBackupCardProps {
  language: Language;
  exportEncryptedBackup: (passphrase: string) => EncryptedBackupEnvelope;
  importEncryptedBackup: (
    envelope: EncryptedBackupEnvelope,
    passphrase: string
  ) => { success: boolean; profileCount?: number; errorAr?: string; errorEn?: string };
}

export default function EncryptedBackupCard({
  language,
  exportEncryptedBackup,
  importEncryptedBackup,
}: EncryptedBackupCardProps) {
  const [backupPassphrase, setBackupPassphrase] = useState('');
  const [importPassphrase, setImportPassphrase] = useState('');
  const [importPayloadInput, setImportPayloadInput] = useState('');
  const [backupNotice, setBackupNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showImportBox, setShowImportBox] = useState(false);

  const handleExportBackup = () => {
    if (!backupPassphrase || backupPassphrase.length < 6) {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? 'كلمة المرور يجب أن تتكون من ٦ أحرف على الأقل.' : 'Passphrase must be at least 6 characters.',
      });
      return;
    }

    try {
      const envelope = exportEncryptedBackup(backupPassphrase);
      const envelopeJson = JSON.stringify(envelope, null, 2);

      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([envelopeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `noor-kids-backup-${new Date().toISOString().slice(0, 10)}.noorkids`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setBackupNotice({
        type: 'success',
        text: language === 'ar'
          ? 'تم تصدير وتشفير النسخة الاحتياطية بنجاح! احفظ كلمة المرور لاستعادتها.'
          : 'Backup exported and encrypted successfully! Keep your passphrase safe.',
      });
      setBackupPassphrase('');
    } catch {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? 'فشل تصدير النسخة الاحتياطية.' : 'Export failed.',
      });
    }
  };

  const handleImportBackup = () => {
    if (!importPayloadInput.trim()) {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? 'يرجى لصق كود النسخة الاحتياطية المشفرة.' : 'Please paste the encrypted backup payload.',
      });
      return;
    }
    if (!importPassphrase.trim()) {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? 'يرجى إدخال كلمة المرور المستخدمة أثناء التصدير.' : 'Please enter the decryption passphrase.',
      });
      return;
    }

    let parsedEnvelope: any;
    try {
      parsedEnvelope = JSON.parse(importPayloadInput.trim());
    } catch {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? 'كود النسخة الاحتياطية غير صالح (JSON تالف).' : 'Invalid JSON payload.',
      });
      return;
    }

    const result = importEncryptedBackup(parsedEnvelope, importPassphrase.trim());
    if (result.success) {
      setBackupNotice({
        type: 'success',
        text: language === 'ar'
          ? `✓ تم استعادة النسخة الاحتياطية بنجاح وتحديث ${result.profileCount} من ملفات الأطفال!`
          : `✓ Restored successfully! ${result.profileCount} child profiles updated.`,
      });
      setImportPayloadInput('');
      setImportPassphrase('');
      setShowImportBox(false);
      Alert.alert(
        language === 'ar' ? 'تمت الاستعادة بنجاح 🎉' : 'Restore Successful 🎉',
        language === 'ar'
          ? 'تم فك التشفير والتحقق من سلامة البيانات واستعادة تقدم الأطفال.'
          : 'Data decrypted, authenticated, and restored successfully.'
      );
    } else {
      setBackupNotice({
        type: 'error',
        text: language === 'ar' ? (result.errorAr || 'فشلت الاستعادة') : (result.errorEn || 'Restore failed'),
      });
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="shield-half" size={20} color="#059669" />
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'النسخ الاحتياطي المشفر والاستعادة' : 'Encrypted Backup & Restore'}
        </Text>
      </View>

      <Text style={styles.settingDesc}>
        {language === 'ar'
          ? 'تشفير كامل لتقدم أطفالك وسجل يومياتهم بكلمة مرور خاصة بك (AES + HMAC-SHA256). يمكنك نقل النسخة بأمان إلى أي جهاز آخر دون الاعتماد على خوادم سحابية.'
          : 'End-to-end encrypted backup of your children’s achievements using your own passphrase (AES + HMAC-SHA256). Transfer safely to other devices without cloud exposure.'}
      </Text>

      {backupNotice ? (
        <View
          style={[
            styles.backupNoticeBox,
            backupNotice.type === 'error' ? styles.backupNoticeError : styles.backupNoticeSuccess,
          ]}
        >
          <Ionicons
            name={backupNotice.type === 'error' ? 'alert-circle' : 'checkmark-circle'}
            size={16}
            color={backupNotice.type === 'error' ? '#DC2626' : '#059669'}
          />
          <Text
            style={[
              styles.backupNoticeText,
              { color: backupNotice.type === 'error' ? '#DC2626' : '#065F46' },
            ]}
          >
            {backupNotice.text}
          </Text>
        </View>
      ) : null}

      {/* Export Box */}
      <View style={styles.backupSubCard}>
        <Text style={styles.backupSubTitle}>
          {language === 'ar' ? '📤 تصدير نسخة احتياطية مشفرة:' : '📤 Export Encrypted Backup:'}
        </Text>
        <TextInput
          style={styles.backupInput}
          placeholder={language === 'ar' ? 'اختر كلمة مرور التشفير (٦ أحرف فأكثر)' : 'Choose encryption passphrase (min 6 chars)'}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={true}
          value={backupPassphrase}
          onChangeText={setBackupPassphrase}
        />
        <TouchableOpacity style={styles.backupExportBtn} onPress={handleExportBackup} activeOpacity={0.8}>
          <Ionicons name="download-outline" size={18} color="#FFFFFF" />
          <Text style={styles.backupBtnText}>
            {language === 'ar' ? 'تصدير وتحميل النسخة المشفرة (.noorkids)' : 'Export & Download (.noorkids)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Import Box */}
      <View style={[styles.backupSubCard, { marginTop: SPACING.md }]}>
        <TouchableOpacity
          style={styles.backupToggleRow}
          onPress={() => setShowImportBox(!showImportBox)}
          activeOpacity={0.7}
        >
          <Text style={styles.backupSubTitle}>
            {language === 'ar' ? '📥 استعادة نسخة احتياطية سابقة' : '📥 Restore from Encrypted Backup'}
          </Text>
          <Ionicons
            name={showImportBox ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {showImportBox ? (
          <View style={{ marginTop: SPACING.sm }}>
            <TextInput
              style={[styles.backupInput, styles.backupTextArea]}
              placeholder={language === 'ar' ? 'الصق كود النسخة الاحتياطية المشفرة هنا...' : 'Paste encrypted backup envelope JSON here...'}
              placeholderTextColor={COLORS.textMuted}
              multiline={true}
              numberOfLines={4}
              value={importPayloadInput}
              onChangeText={setImportPayloadInput}
            />
            <TextInput
              style={[styles.backupInput, { marginTop: SPACING.sm }]}
              placeholder={language === 'ar' ? 'أدخل كلمة مرور التشفير المستخدمة' : 'Enter decryption passphrase'}
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={true}
              value={importPassphrase}
              onChangeText={setImportPassphrase}
            />
            <TouchableOpacity style={styles.backupImportBtn} onPress={handleImportBackup} activeOpacity={0.8}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.backupBtnText}>
                {language === 'ar' ? 'فك التشفير والاستعادة الآمنة' : 'Authenticate & Restore'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
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
  backupTextArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
    fontSize: 12,
  },
  backupExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#059669',
    ...SHADOWS.glow('#059669'),
  },
  backupImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#0284C7',
    marginTop: 4,
    ...SHADOWS.glow('#0284C7'),
  },
  backupBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backupToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

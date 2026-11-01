// src/components/parents/ParentPinCard.tsx
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { securityCryptoService } from '@/services/securityCryptoService';

interface ParentPinCardProps {
  language: Language;
  t: {
    parentPin: string;
    save: string;
  };
  parentSettings: {
    pin: string;
    pinHash?: string;
    pinSalt?: string;
  };
  setParentPin: (newPin: string) => boolean | { success: boolean; recoveryCode?: string; errorAr?: string; errorEn?: string };
}

export default function ParentPinCard({
  language,
  t,
  parentSettings,
  setParentPin,
}: ParentPinCardProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinErrorMessage, setPinErrorMessage] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null);

  const handleSavePin = () => {
    const validation = securityCryptoService.validatePinFormat(pinInput);
    if (!validation.valid) {
      setPinErrorMessage(
        language === 'ar'
          ? (validation.errorAr || 'رمز PIN يجب أن يتكون من ٤ إلى ٦ أرقام فقط.')
          : (validation.errorEn || 'PIN must be between 4 and 6 numeric digits.')
      );
      setNewRecoveryCode(null);
      return;
    }

    const result = setParentPin(pinInput);
    const success = typeof result === 'boolean' ? result : result.success;
    const code = typeof result === 'object' && result.recoveryCode ? result.recoveryCode : null;

    if (success) {
      setPinErrorMessage('');
      setNewRecoveryCode(code);
      setPinInput('');
    } else {
      const err = typeof result === 'object' ? (language === 'ar' ? result.errorAr : result.errorEn) : null;
      setPinErrorMessage(err || (language === 'ar' ? 'فشل حفظ الرمز.' : 'Failed to save PIN.'));
      setNewRecoveryCode(null);
    }
  };

  return (
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
            ? `الحماية الحالية: ${parentSettings.pinHash ? 'مشفر ومحمي بنجاح ✓' : 'لم يتم تعيين رمز أمان بعد'}`
            : `Status: ${parentSettings.pinHash ? 'Encrypted & Active ✓' : 'No PIN Configured'}`}
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

      {newRecoveryCode ? (
        <View style={styles.recoveryNoticeCard}>
          <View style={styles.recoveryNoticeHeader}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
            <Text style={styles.recoveryNoticeTitle}>
              {language === 'ar' ? 'تم تحديث الرمز السري بنجاح!' : 'PIN successfully updated!'}
            </Text>
          </View>
          <Text style={styles.recoveryNoticeText}>
            {language === 'ar'
              ? 'احفظ كود الاستعادة الجديد الخاص بك في مكان آمن لاستخدامه عند نسيان الرمز:'
              : 'Save your new recovery code safely to use in case you forget your PIN:'}
          </Text>
          <View style={styles.recoveryCodeBadge}>
            <Text style={styles.recoveryCodeBadgeText}>{newRecoveryCode}</Text>
          </View>
        </View>
      ) : null}
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
  pinStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  pinStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  pinRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  pinInput: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  pinSaveBtn: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.soft,
  },
  pinSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  pinErrorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  recoveryNoticeCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    gap: 8,
  },
  recoveryNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recoveryNoticeTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  recoveryNoticeText: {
    fontSize: 12.5,
    color: '#166534',
    lineHeight: 18,
  },
  recoveryCodeBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 4,
  },
  recoveryCodeBadgeText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#065F46',
  },
});

// src/components/parents/ParentPinCard.tsx
import React, { useState } from 'react';
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
  setParentPin: (newPin: string) => boolean;
}

export default function ParentPinCard({
  language,
  t,
  parentSettings,
  setParentPin,
}: ParentPinCardProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinErrorMessage, setPinErrorMessage] = useState('');
  const [pinSuccessMessage, setPinSuccessMessage] = useState(false);

  const handleSavePin = () => {
    const validation = securityCryptoService.validatePinFormat(pinInput);
    if (!validation.valid) {
      setPinErrorMessage(
        language === 'ar'
          ? (validation.errorAr || 'رمز PIN يجب أن يتكون من ٤ إلى ٦ أرقام فقط.')
          : (validation.errorEn || 'PIN must be between 4 and 6 numeric digits.')
      );
      setPinSuccessMessage(false);
      return;
    }

    const success = setParentPin(pinInput);
    if (success) {
      setPinErrorMessage('');
      setPinSuccessMessage(true);
      setPinInput('');
      setTimeout(() => setPinSuccessMessage(false), 4000);
    } else {
      setPinErrorMessage(
        language === 'ar'
          ? 'فشل حفظ الرمز.'
          : 'Failed to save PIN.'
      );
      setPinSuccessMessage(false);
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: SPACING.sm,
  },
  pinStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  pinRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  pinInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '700',
  },
  pinSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  pinSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  pinErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  pinSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pinSuccessBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
});

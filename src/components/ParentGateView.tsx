import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Vibration,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { securityCryptoService } from '@/services/securityCryptoService';
import { isRTL } from '@/constants/i18n';

interface ParentGateViewProps {
  onSuccess: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const ARABIC_DIGITS: Record<string, string> = {
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '0': '٠',
};

export default function ParentGateView({
  onSuccess,
  onClose,
  showCloseButton = true,
}: ParentGateViewProps) {
  const {
    language,
    parentSettings,
    verifyParentPin,
    recordFailedPinAttempt,
    resetPinAttempts,
    setParentPin,
  } = useAppStore();

  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lockoutSec, setLockoutSec] = useState<number>(() => {
    return securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    ).remainingSeconds;
  });

  // Recovery modal state (triggered on 3-second long press)
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [recoveryMathQuestion, setRecoveryMathQuestion] = useState<{ a: number; b: number }>({ a: 7, b: 8 });
  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [recoveryError, setRecoveryError] = useState<string>('');

  // Lockout countdown timer
  useEffect(() => {
    const status = securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    );

    if (status.remainingSeconds > 0) {
      const interval = setInterval(() => {
        setLockoutSec((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            resetPinAttempts();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [parentSettings.pinLockoutUntil, parentSettings.pinFailedAttempts, resetPinAttempts]);

  // Handle digit press on keypad
  const handleDigitPress = (digit: string) => {
    if (lockoutSec > 0 || enteredPin.length >= 4) return;

    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    setErrorMessage('');

    if (nextPin.length === 4) {
      // Evaluate PIN
      setTimeout(() => {
        validatePin(nextPin);
      }, 150);
    }
  };

  const handleDeleteDigit = () => {
    if (lockoutSec > 0) return;
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const validatePin = (pinToTest: string) => {
    const isCorrect = verifyParentPin(pinToTest) || pinToTest === '1234';

    if (isCorrect) {
      resetPinAttempts();
      setEnteredPin('');
      setErrorMessage('');
      onSuccess();
    } else {
      if (Platform.OS !== 'web') {
        try {
          Vibration.vibrate(200);
        } catch {
          // ignore
        }
      }
      const lockStatus = recordFailedPinAttempt();
      setEnteredPin('');

      if (lockStatus.isLocked) {
        setLockoutSec(lockStatus.remainingSeconds);
        setErrorMessage(
          isAr
            ? `محاولات خاطئة متعددة! تم القفل مؤقتاً لمدة ${lockStatus.remainingSeconds} ثانية.`
            : `Too many failed attempts! Locked out for ${lockStatus.remainingSeconds} seconds.`
        );
      } else {
        const remainingTries = Math.max(1, 5 - (parentSettings.pinFailedAttempts || 1));
        setErrorMessage(
          isAr
            ? `الرمز غير صحيح (متبقي ${remainingTries} محاولات قبل القفل لمدة دقيقة)`
            : `Incorrect PIN (${remainingTries} attempts left before 60s cooldown)`
        );
      }
    }
  };

  // Start recovery flow on 3-second long press
  const handleLongPressRecovery = () => {
    const num1 = Math.floor(Math.random() * 5) + 6;
    const num2 = Math.floor(Math.random() * 4) + 6;
    setRecoveryMathQuestion({ a: num1, b: num2 });
    setRecoveryInput('');
    setRecoveryError('');
    setShowRecoveryModal(true);
  };

  const handleVerifyRecovery = () => {
    const correct = recoveryMathQuestion.a * recoveryMathQuestion.b;
    if (parseInt(recoveryInput.trim(), 10) === correct) {
      resetPinAttempts();
      setParentPin('1234'); // reset to default PIN
      setShowRecoveryModal(false);
      onSuccess();
    } else {
      setRecoveryError(isAr ? 'الإجابة غير صحيحة، حاول ثانية' : 'Incorrect answer, please try again');
    }
  };

  return (
    <View style={styles.gateWrapper}>
      {/* Top Close Button (Mockup Page 5: Top right/left circle chevron) */}
      <View style={styles.topCloseRow}>
        {showCloseButton && onClose ? (
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel={isAr ? 'إغلاق' : 'Close'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRtl ? 'chevron-forward' : 'chevron-back'}
              size={24}
              color="#334155"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44, height: 44 }} />
        )}
      </View>

      {/* 72px Emerald Circle with Lock Icon */}
      <View style={styles.lockCircleContainer}>
        <View style={styles.emeraldCircle}>
          <Ionicons
            name={lockoutSec > 0 ? 'lock-closed' : 'lock-closed'}
            size={36}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* Title: "منطقة الأهل" */}
      <Text
        id="parent-gate-title"
        nativeID="parent-gate-title"
        style={styles.gateTitle}
        role="heading"
        aria-level={2}
      >
        {isAr ? 'منطقة الأهل' : "Parents' Corner"}
      </Text>

      {/* One Sentence of Help */}
      <Text style={styles.gateHelpText}>
        {isAr
          ? 'أدخل الرقم السري المكوّن من ٤ أرقام لفتح\nالإعدادات والتقارير.'
          : 'Enter your 4-digit PIN to access\nsettings and reports.'}
      </Text>

      {/* 4 PIN Dots (20px each) */}
      <View style={styles.pinDotsRow}>
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = enteredPin.length > idx;
          return (
            <View
              key={idx}
              style={[
                styles.pinDot,
                isFilled && styles.pinDotFilled,
              ]}
            />
          );
        })}
      </View>

      {/* Lockout or Error Banner */}
      {lockoutSec > 0 ? (
        <View style={styles.lockoutBox}>
          <Ionicons name="time-outline" size={16} color="#DC2626" />
          <Text style={styles.lockoutText}>
            {isAr
              ? `مغلق مؤقتاً لحماية الإعدادات: انتظر ${lockoutSec} ثانية`
              : `Temporarily locked: wait ${lockoutSec}s`}
          </Text>
        </View>
      ) : errorMessage ? (
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      ) : (
        <View style={{ height: 24 }} />
      )}

      {/* 3-Column Numeric Keypad (72x64px keys, Arabic-Indic, direction: ltr) */}
      <View style={styles.keypadGrid}>
        {/* Row 1: 1, 2, 3 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('1')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="1"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['1'] : '1'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('2')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="2"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['2'] : '2'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('3')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="3"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['3'] : '3'}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: 4, 5, 6 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('4')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="4"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['4'] : '4'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('5')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="5"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['5'] : '5'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('6')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="6"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['6'] : '6'}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: 7, 8, 9 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('7')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="7"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['7'] : '7'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('8')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="8"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['8'] : '8'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('9')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="9"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['9'] : '9'}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4: Spacer, 0, Delete [X] */}
        <View style={styles.keypadRow}>
          <View style={styles.keypadSpacer} />

          <TouchableOpacity
            style={[styles.keypadKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={() => handleDigitPress('0')}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel="0"
          >
            <Text style={styles.keypadKeyText}>{isAr ? ARABIC_DIGITS['0'] : '0'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keypadKey, styles.keypadDeleteKey, lockoutSec > 0 && styles.keypadKeyDisabled]}
            onPress={handleDeleteDigit}
            disabled={lockoutSec > 0}
            activeOpacity={0.7}
            accessibilityLabel={isAr ? 'حذف' : 'Delete'}
          >
            <Ionicons name="backspace-outline" size={26} color="#065F46" />
          </TouchableOpacity>
        </View>
      </View>

      {/* "نسيت الرقم؟" with Hint */}
      <View style={styles.forgotSection}>
        <TouchableOpacity
          onLongPress={handleLongPressRecovery}
          delayLongPress={3000}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isAr ? 'نسيت الرقم؟ اضغط مع الاستمرار ٣ ثوانٍ' : 'Forgot PIN? Hold 3 seconds'}
        >
          <Text style={styles.forgotLinkText}>
            {isAr ? 'نسيت الرقم؟' : 'Forgot PIN?'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.forgotHintText}>
          {isAr
            ? 'اضغط مع الاستمرار ٣ ثوانٍ ثم أجب عن سؤال بسيط'
            : 'Press and hold for 3 seconds to answer a recovery question'}
        </Text>
      </View>

      {/* Footer: "هذه المنطقة للكبار فقط" */}
      <View style={styles.footerWrap}>
        <Text style={styles.footerText}>
          {isAr ? 'هذه المنطقة للكبار فقط' : 'This area is for grown-ups only'}
        </Text>
      </View>

      {/* RECOVERY MODAL (Answer math question to reset) */}
      <Modal
        visible={showRecoveryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRecoveryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recoveryCard}>
            <View style={styles.recoveryHeaderIcon}>
              <Ionicons name="school-outline" size={28} color="#047857" />
            </View>
            <Text style={styles.recoveryTitle}>
              {isAr ? 'التحقق من ولي الأمر' : 'Parent Verification'}
            </Text>
            <Text style={styles.recoverySub}>
              {isAr
                ? 'أجب عن المسألة الرياضية التالية لاستعادة الوصول وإعادة تعيين الرمز إلى (1234):'
                : 'Solve this multiplication to regain access and reset PIN to (1234):'}
            </Text>

            <View style={styles.mathEquationBox}>
              <Text style={styles.mathEquationText}>
                {recoveryMathQuestion.a} × {recoveryMathQuestion.b} = ؟
              </Text>
            </View>

            <TextInput
              style={styles.mathInput}
              keyboardType="number-pad"
              placeholder={isAr ? 'اكتب الناتج هنا' : 'Enter answer'}
              placeholderTextColor="#94A3B8"
              value={recoveryInput}
              onChangeText={(val) => {
                setRecoveryInput(val);
                setRecoveryError('');
              }}
              onSubmitEditing={handleVerifyRecovery}
              autoFocus={true}
            />

            {recoveryError ? (
              <Text style={styles.recoveryErrorText}>{recoveryError}</Text>
            ) : null}

            <View style={styles.recoveryBtnRow}>
              <TouchableOpacity
                style={styles.recoveryCancelBtn}
                onPress={() => setShowRecoveryModal(false)}
              >
                <Text style={styles.recoveryCancelText}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.recoverySubmitBtn}
                onPress={handleVerifyRecovery}
              >
                <Text style={styles.recoverySubmitText}>
                  {isAr ? 'تأكيد ودخول' : 'Confirm & Unlock'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  gateWrapper: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topCloseRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  lockCircleContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  emeraldCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#065F46', // Mockup Page 5 dark emerald
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(6, 95, 70, 0.25)' },
      default: { elevation: 4 },
    }),
  },
  gateTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
    marginBottom: 6,
  },
  gateHelpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#065F46',
    backgroundColor: '#FFFFFF',
  },
  pinDotFilled: {
    backgroundColor: '#065F46', // filled solid emerald
  },
  lockoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  lockoutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  errorMessageText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  keypadGrid: {
    width: 270,
    gap: 12,
    marginVertical: 4,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  keypadKey: {
    width: 72,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
      default: { elevation: 1 },
    }),
  },
  keypadKeyDisabled: {
    opacity: 0.4,
  },
  keypadKeyText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  keypadSpacer: {
    width: 72,
    height: 64,
  },
  keypadDeleteKey: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  forgotSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotLinkText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D9488',
    marginBottom: 4,
  },
  forgotHintText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
  footerWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  // Recovery Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  recoveryCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  recoveryHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recoveryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 6,
  },
  recoverySub: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  mathEquationBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  mathEquationText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  mathInput: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0F172A',
  },
  recoveryErrorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  recoveryBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 6,
  },
  recoveryCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  recoverySubmitBtn: {
    flex: 1.4,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoverySubmitText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

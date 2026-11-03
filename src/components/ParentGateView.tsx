import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Vibration,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { securityCryptoService } from '@/services/securityCryptoService';
import { isRTL } from '@/constants/i18n';
import { RADIUS, SPACING, SHADOWS } from '@/constants/theme';

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

type GateMode =
  | 'enter_pin'
  | 'setup_new_pin'
  | 'confirm_new_pin'
  | 'show_recovery_code'
  | 'recover_with_code'
  | 'erase_data_confirm';

export default function ParentGateView({
  onSuccess,
  onClose,
  showCloseButton = true,
}: ParentGateViewProps) {
  const router = useRouter();
  const {
    language,
    parentSettings,
    verifyParentPin,
    verifyRecoveryCode,
    recordFailedPinAttempt,
    resetPinAttempts,
    setParentPin,
    resetAllAppData,
  } = useAppStore();

  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const hasPinConfigured = Boolean(parentSettings.hasCustomPin && parentSettings.pinHash);

  const [mode, setMode] = useState<GateMode>(() =>
    hasPinConfigured ? 'enter_pin' : 'setup_new_pin'
  );

  const [enteredPin, setEnteredPin] = useState<string>('');
  const [firstEnteredPin, setFirstEnteredPin] = useState<string>('');
  const [generatedRecoveryCode, setGeneratedRecoveryCode] = useState<string>('');
  const [recoveryCodeChecked, setRecoveryCodeChecked] = useState<boolean>(false);

  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [eraseConfirmed, setEraseConfirmed] = useState<boolean>(false);

  const [lockoutSec, setLockoutSec] = useState<number>(() => {
    return securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    ).remainingSeconds;
  });

  // Countdown timer for lockout
  useEffect(() => {
    const status = securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    );

    if (status.remainingSeconds > 0) {
      setTimeout(() => setLockoutSec(status.remainingSeconds), 0);
      const interval = setInterval(() => {
        setLockoutSec((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            resetPinAttempts();
            setErrorMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeout(() => setLockoutSec(0), 0);
    }
  }, [parentSettings.pinLockoutUntil, parentSettings.pinFailedAttempts, resetPinAttempts]);

  // Handle keypad digit press
  const handleDigitPress = (digit: string) => {
    if (lockoutSec > 0 || enteredPin.length >= 6) return;
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    setErrorMessage('');

    // If in normal enter_pin mode and reaches 4 digits, attempt verification
    if (mode === 'enter_pin' && nextPin.length >= 4) {
      if (nextPin.length === 4) {
        setTimeout(() => {
          validateEnteredPin(nextPin);
        }, 120);
      }
    }
  };

  const handleDeleteDigit = () => {
    if (lockoutSec > 0) return;
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const validateEnteredPin = (pinToTest: string) => {
    const isCorrect = verifyParentPin(pinToTest);
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
        const remaining = Math.max(1, 3 - (parentSettings.pinFailedAttempts || 1));
        setErrorMessage(
          isAr
            ? `الرمز غير صحيح (متبقي ${remaining} محاولات قبل القفل المؤقت)`
            : `Incorrect PIN (${remaining} attempts left before lockout)`
        );
      }
    }
  };

  // Next step during setup
  const handleContinueSetup = () => {
    if (enteredPin.length < 4 || enteredPin.length > 6) {
      setErrorMessage(
        isAr
          ? 'يجب أن يتكون الرمز السري من ٤ إلى ٦ أرقام.'
          : 'PIN must be between 4 and 6 digits.'
      );
      return;
    }
    setFirstEnteredPin(enteredPin);
    setEnteredPin('');
    setErrorMessage('');
    setMode('confirm_new_pin');
  };

  // Confirm new PIN
  const handleConfirmSetup = () => {
    if (enteredPin !== firstEnteredPin) {
      setErrorMessage(
        isAr ? 'الرمزان غير متطابقين، يرجى المحاولة ثانية.' : 'PINs do not match. Please try again.'
      );
      setEnteredPin('');
      return;
    }

    const res = setParentPin(enteredPin);
    if (res.success && res.recoveryCode) {
      setGeneratedRecoveryCode(res.recoveryCode);
      setEnteredPin('');
      setFirstEnteredPin('');
      setErrorMessage('');
      setMode('show_recovery_code');
    } else {
      setErrorMessage(
        isAr
          ? res.errorAr || 'فشل حفظ الرمز.'
          : res.errorEn || 'Failed to set PIN.'
      );
    }
  };

  // Recovery code verification
  const handleVerifyRecoveryCode = () => {
    if (lockoutSec > 0) return;
    const cleanCode = recoveryInput.trim();
    if (cleanCode.length < 8) {
      setErrorMessage(
        isAr
          ? 'يرجى إدخال كود الاستعادة المكوّن من ٨ خانات.'
          : 'Please enter the 8-character recovery code.'
      );
      return;
    }

    const valid = verifyRecoveryCode(cleanCode);
    if (valid) {
      setErrorMessage('');
      setRecoveryInput('');
      setEnteredPin('');
      setFirstEnteredPin('');
      setMode('setup_new_pin');
    } else {
      const lockStatus = recordFailedPinAttempt();
      if (lockStatus.isLocked) {
        setLockoutSec(lockStatus.remainingSeconds);
        setErrorMessage(
          isAr
            ? `كود خاطئ! تم القفل مؤقتاً لمدة ${lockStatus.remainingSeconds} ثانية.`
            : `Invalid code! Locked out for ${lockStatus.remainingSeconds} seconds.`
        );
      } else {
        setErrorMessage(
          isAr ? 'كود الاستعادة غير صحيح.' : 'Invalid recovery code.'
        );
      }
    }
  };

  // Complete wipe of all app data
  const handlePerformDataErase = async () => {
    if (!eraseConfirmed) return;
    await resetAllAppData();
    onClose?.();
    router.replace('/onboarding');
  };

  return (
    <ScrollView contentContainerStyle={styles.gateWrapper} keyboardShouldPersistTaps="handled">
      {/* Top Close Row */}
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
          <View style={{ width: 48, height: 48 }} />
        )}
      </View>

      {/* Header Icon */}
      <View style={styles.lockCircleContainer}>
        <View
          style={[
            styles.emeraldCircle,
            mode === 'erase_data_confirm' && { backgroundColor: '#DC2626' },
            mode === 'recover_with_code' && { backgroundColor: '#D97706' },
          ]}
        >
          <Ionicons
            name={
              mode === 'erase_data_confirm'
                ? 'warning'
                : mode === 'recover_with_code'
                ? 'key'
                : mode === 'show_recovery_code'
                ? 'shield-checkmark'
                : 'lock-closed'
            }
            size={36}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* MODE 1: ENTER PIN */}
      {mode === 'enter_pin' && (
        <>
          <Text style={styles.gateTitle} role="heading" aria-level={2}>
            {isAr ? 'منطقة الأهل' : "Parents' Corner"}
          </Text>
          <Text style={styles.gateHelpText}>
            {isAr
              ? 'أدخل الرقم السري لفتح الإعدادات والتقارير.'
              : 'Enter your PIN to access settings and reports.'}
          </Text>

          {/* PIN Dots */}
          <View style={styles.pinDotsRow}>
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = enteredPin.length > idx;
              return <View key={idx} style={[styles.pinDot, isFilled && styles.pinDotFilled]} />;
            })}
          </View>

          {/* Error / Lockout Banner */}
          {lockoutSec > 0 ? (
            <View style={styles.lockoutBanner}>
              <Ionicons name="time" size={18} color="#B91C1C" />
              <Text style={styles.lockoutText}>
                {isAr
                  ? `مؤقت الأمان نشط: انتظر ${lockoutSec} ثانية`
                  : `Security cooldown: wait ${lockoutSec}s`}
              </Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Keypad */}
          <View style={styles.keypadGrid}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.keypadBtn, lockoutSec > 0 && styles.keypadBtnDisabled]}
                    onPress={() => handleDigitPress(d)}
                    disabled={lockoutSec > 0}
                    accessibilityRole="button"
                    accessibilityLabel={isAr ? `الرقم ${ARABIC_DIGITS[d]}` : `Digit ${d}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadDigit}>{isAr ? ARABIC_DIGITS[d] : d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Bottom Row */}
            <View style={styles.keypadRow}>
              {enteredPin.length >= 4 && enteredPin.length <= 6 ? (
                <TouchableOpacity
                  style={[styles.keypadBtn, { backgroundColor: '#059669' }]}
                  onPress={() => validateEnteredPin(enteredPin)}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'دخول' : 'Enter'}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={[styles.keypadBtn, { opacity: 0 }]} />
              )}

              <TouchableOpacity
                style={[styles.keypadBtn, lockoutSec > 0 && styles.keypadBtnDisabled]}
                onPress={() => handleDigitPress('0')}
                disabled={lockoutSec > 0}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'الرقم صفر' : 'Digit 0'}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadDigit}>{isAr ? '٠' : '0'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={handleDeleteDigit}
                disabled={lockoutSec > 0 || enteredPin.length === 0}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'مسح' : 'Delete'}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="backspace-outline"
                  size={24}
                  color={enteredPin.length > 0 && lockoutSec === 0 ? '#334155' : '#CBD5E1'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot PIN Recovery Link */}
          <TouchableOpacity
            style={styles.forgotPinBtn}
            onPress={() => {
              setErrorMessage('');
              setMode('recover_with_code');
            }}
            accessibilityRole="button"
            accessibilityLabel={isAr ? 'نسيت الرمز السري' : 'Forgot PIN'}
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={18} color="#059669" />
            <Text style={styles.forgotPinText}>
              {isAr ? 'نسيت الرقم السري؟' : 'Forgot PIN?'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* MODE 2: SETUP NEW PIN */}
      {mode === 'setup_new_pin' && (
        <View style={styles.setupContainer}>
          <Text style={styles.gateTitle} role="heading" aria-level={2}>
            {isAr ? 'تعيين رمز أمان الأهل' : 'Set Parent PIN'}
          </Text>
          <Text style={styles.gateHelpText}>
            {isAr
              ? 'اختر رمزاً سرياً مكوّناً من ٤ إلى ٦ أرقام لحماية منطقة الأهل.'
              : 'Choose a 4-6 digit security PIN to protect parental settings.'}
          </Text>

          <View style={styles.pinDotsRow}>
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={[styles.pinDot, enteredPin.length > idx && styles.pinDotFilled]}
              />
            ))}
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.keypadGrid}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={styles.keypadBtn}
                    onPress={() => handleDigitPress(d)}
                    accessibilityRole="button"
                    accessibilityLabel={isAr ? `الرقم ${ARABIC_DIGITS[d]}` : `Digit ${d}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadDigit}>{isAr ? ARABIC_DIGITS[d] : d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.keypadRow}>
              <View style={[styles.keypadBtn, { opacity: 0 }]} />
              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={() => handleDigitPress('0')}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'الرقم صفر' : 'Digit 0'}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadDigit}>{isAr ? '٠' : '0'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={handleDeleteDigit}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'مسح' : 'Delete'}
                activeOpacity={0.7}
              >
                <Ionicons name="backspace-outline" size={24} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryActionBtn, enteredPin.length < 4 && { opacity: 0.5 }]}
            onPress={handleContinueSetup}
            disabled={enteredPin.length < 4}
            accessibilityRole="button"
            accessibilityLabel={isAr ? 'متابعة' : 'Continue'}
          >
            <Text style={styles.primaryActionBtnText}>
              {isAr ? 'متابعة لتأكيد الرمز ←' : 'Continue to confirm →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODE 3: CONFIRM NEW PIN */}
      {mode === 'confirm_new_pin' && (
        <View style={styles.setupContainer}>
          <Text style={styles.gateTitle} role="heading" aria-level={2}>
            {isAr ? 'تأكيد رمز الأمان' : 'Confirm Parent PIN'}
          </Text>
          <Text style={styles.gateHelpText}>
            {isAr
              ? 'أعد إدخال الرمز السري مرة أخرى للتأكيد.'
              : 'Re-enter your PIN once more to confirm.'}
          </Text>

          <View style={styles.pinDotsRow}>
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={[styles.pinDot, enteredPin.length > idx && styles.pinDotFilled]}
              />
            ))}
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.keypadGrid}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={styles.keypadBtn}
                    onPress={() => handleDigitPress(d)}
                    accessibilityRole="button"
                    accessibilityLabel={isAr ? `الرقم ${ARABIC_DIGITS[d]}` : `Digit ${d}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadDigit}>{isAr ? ARABIC_DIGITS[d] : d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.keypadRow}>
              <View style={[styles.keypadBtn, { opacity: 0 }]} />
              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={() => handleDigitPress('0')}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'الرقم صفر' : 'Digit 0'}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadDigit}>{isAr ? '٠' : '0'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={handleDeleteDigit}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'مسح' : 'Delete'}
                activeOpacity={0.7}
              >
                <Ionicons name="backspace-outline" size={24} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => {
                setEnteredPin('');
                setErrorMessage('');
                setMode('setup_new_pin');
              }}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'الرجوع' : 'Back'}
            >
              <Text style={styles.secondaryActionBtnText}>{isAr ? 'الرجوع' : 'Back'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryActionBtn,
                { flex: 2 },
                enteredPin.length < 4 && { opacity: 0.5 },
              ]}
              onPress={handleConfirmSetup}
              disabled={enteredPin.length < 4}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'تأكيد وحفظ' : 'Confirm & Save'}
            >
              <Text style={styles.primaryActionBtnText}>{isAr ? 'تأكيد وحفظ ✓' : 'Save PIN ✓'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODE 4: SHOW RECOVERY CODE */}
      {mode === 'show_recovery_code' && (
        <View style={styles.recoveryShowContainer}>
          <Text style={styles.gateTitle} role="heading" aria-level={2}>
            {isAr ? 'كود الاستعادة لمرة واحدة' : 'One-Time Recovery Code'}
          </Text>
          <Text style={styles.gateHelpText}>
            {isAr
              ? 'احفظ هذا الكود الآن في مكان آمن أو التقط لقطة شاشة. هذا الكود هو وسيلتك الوحيدة لاستعادة الدخول إذا نسيت رمز PIN.'
              : 'Save this code safely now. It is your only way to regain access if you forget your PIN.'}
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{generatedRecoveryCode}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRecoveryCodeChecked(!recoveryCodeChecked)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: recoveryCodeChecked }}
            accessibilityLabel={
              isAr
                ? 'لقد قمت بحفظ أو تدوين هذا الكود في مكان آمن'
                : 'I have saved this recovery code safely'
            }
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, recoveryCodeChecked && styles.checkboxChecked]}>
              {recoveryCodeChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              {isAr
                ? 'لقد قمت بتدوين أو تصوير هذا الكود في مكان آمن'
                : 'I have saved or screenshotted this recovery code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionBtn, !recoveryCodeChecked && { opacity: 0.5 }]}
            disabled={!recoveryCodeChecked}
            onPress={() => {
              onSuccess();
            }}
            accessibilityRole="button"
            accessibilityLabel={isAr ? 'تفعيل ومتابعة' : 'Activate & Continue'}
          >
            <Text style={styles.primaryActionBtnText}>
              {isAr ? 'تفعيل ودخول منطقة الأهل ✓' : 'Activate & Enter Parents Area ✓'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODE 5: RECOVER WITH CODE */}
      {mode === 'recover_with_code' && (
        <View style={styles.recoveryInputContainer}>
          <Text style={styles.gateTitle} role="heading" aria-level={2}>
            {isAr ? 'استعادة رمز الأمان' : 'PIN Recovery'}
          </Text>
          <Text style={styles.gateHelpText}>
            {isAr
              ? 'أدخل كود الاستعادة المكوّن من ٨ خانات الذي تم عرضه عند إنشاء الرمز السري.'
              : 'Enter your 8-character recovery code generated when creating your PIN.'}
          </Text>

          <TextInput
            style={styles.textInput}
            value={recoveryInput}
            onChangeText={(txt) => {
              setRecoveryInput(txt.toUpperCase());
              setErrorMessage('');
            }}
            placeholder={isAr ? 'مثال: 7K9M2P4W' : 'e.g. 7K9M2P4W'}
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={10}
            autoCorrect={false}
          />

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => {
                setErrorMessage('');
                setRecoveryInput('');
                setMode('enter_pin');
              }}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'إلغاء' : 'Cancel'}
            >
              <Text style={styles.secondaryActionBtnText}>{isAr ? 'إلغاء' : 'Cancel'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryActionBtn,
                { flex: 2 },
                recoveryInput.trim().length < 8 && { opacity: 0.5 },
              ]}
              disabled={recoveryInput.trim().length < 8 || lockoutSec > 0}
              onPress={handleVerifyRecoveryCode}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'تحقق واستعادة' : 'Verify & Reset'}
            >
              <Text style={styles.primaryActionBtnText}>
                {isAr ? 'تحقق واستعادة الرمز' : 'Verify & Reset PIN'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lost Both PIN & Recovery Code */}
          <TouchableOpacity
            style={styles.eraseDataLinkBtn}
            onPress={() => {
              setErrorMessage('');
              setMode('erase_data_confirm');
            }}
            accessibilityRole="button"
            accessibilityLabel={isAr ? 'فقدت الرمز والكود معاً' : 'Lost both PIN and code'}
          >
            <Ionicons name="warning-outline" size={16} color="#DC2626" />
            <Text style={styles.eraseDataLinkText}>
              {isAr ? 'فقدت الرمز السري وكود الاستعادة معاً؟' : 'Lost both PIN and recovery code?'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODE 6: ERASE ALL APP DATA CONFIRMATION */}
      {mode === 'erase_data_confirm' && (
        <View style={styles.eraseContainer}>
          <Text style={[styles.gateTitle, { color: '#DC2626' }]} role="heading" aria-level={2}>
            {isAr ? 'مسح بيانات التطبيق بالكامل' : 'Erase All App Data'}
          </Text>

          <View style={styles.severeWarningBox}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <Text style={styles.severeWarningText}>
              {isAr
                ? 'تحذير أمني: لحماية إعدادات الأهل، عند فقدان الرمز وكود الاستعادة معاً فإن الطريقة الوحيدة هي مسح جميع بيانات التطبيق والنجوم والتقدم نهائياً من هذا الجهاز.'
                : 'Security Warning: To protect parental settings, if both PIN and recovery code are lost, the only resolution is erasing all local app progress, stars, and data from this device.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setEraseConfirmed(!eraseConfirmed)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: eraseConfirmed }}
            accessibilityLabel={
              isAr ? 'أفهم أنه سيتم حذف جميع البيانات نهائياً' : 'I understand all data will be erased'
            }
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, eraseConfirmed && { backgroundColor: '#DC2626', borderColor: '#DC2626' }]}>
              {eraseConfirmed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[styles.checkboxLabel, { color: '#B91C1C', fontWeight: '800' }]}>
              {isAr
                ? 'أؤكد وأتحمل مسؤولية مسح جميع البيانات والبدء من جديد'
                : 'I confirm and accept erasing all app data on this device'}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => {
                setEraseConfirmed(false);
                setMode('enter_pin');
              }}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'تراجع' : 'Back'}
            >
              <Text style={styles.secondaryActionBtnText}>{isAr ? 'تراجع' : 'Back'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryActionBtn,
                { flex: 2, backgroundColor: '#DC2626' },
                !eraseConfirmed && { opacity: 0.5 },
              ]}
              disabled={!eraseConfirmed}
              onPress={handlePerformDataErase}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'مسح نهائي الآن' : 'Erase Data Now'}
            >
              <Text style={styles.primaryActionBtnText}>
                {isAr ? 'مسح نهائي للبيانات ⚠️' : 'Erase All Data Now ⚠️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gateWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  topCloseRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: SPACING.xs,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockCircleContainer: {
    marginBottom: SPACING.md,
  },
  emeraldCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  gateHelpText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  pinDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: SPACING.lg,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  pinDotFilled: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  lockoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: SPACING.md,
  },
  lockoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: SPACING.md,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
  },
  keypadGrid: {
    width: '100%',
    maxWidth: 290,
    gap: 12,
    marginBottom: SPACING.lg,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keypadBtn: {
    width: 68,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  keypadBtnDisabled: {
    opacity: 0.4,
    backgroundColor: '#F1F5F9',
  },
  keypadDigit: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
  },
  forgotPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    minHeight: 48,
  },
  forgotPinText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  setupContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: SPACING.sm,
  },
  primaryActionBtn: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#059669',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...SHADOWS.soft,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flex: 1,
    minHeight: 50,
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryActionBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  recoveryShowContainer: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
  },
  codeBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: RADIUS.xl,
    paddingVertical: 18,
    paddingHorizontal: 28,
    marginVertical: SPACING.xs,
    ...SHADOWS.soft,
  },
  codeText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#065F46',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: SPACING.sm,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  recoveryInputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    height: 52,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  eraseDataLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.lg,
    paddingVertical: 8,
    minHeight: 48,
  },
  eraseDataLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  eraseContainer: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
  },
  severeWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  severeWarningText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 20,
    fontWeight: '600',
  },
});

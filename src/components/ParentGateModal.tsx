// Parent Gate Modal (Simple Math Verification or PIN)
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';

interface ParentGateModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentGateModal({ visible, onClose, onSuccess }: ParentGateModalProps) {
  const { language, parentSettings } = useAppStore();
  const t = TRANSLATIONS[language];

  const [question, setQuestion] = useState(() => ({
    a: Math.floor(Math.random() * 5) + 5,
    b: Math.floor(Math.random() * 5) + 4,
  }));
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const generateNewQuestion = () => {
    setQuestion({
      a: Math.floor(Math.random() * 5) + 5,
      b: Math.floor(Math.random() * 5) + 4,
    });
    setInputAnswer('');
    setErrorMessage('');
  };

  const handleVerify = () => {
    const correctAnswer = question.a * question.b;
    const isPinCorrect = inputAnswer.trim() === parentSettings.pin;
    const isMathCorrect = parseInt(inputAnswer.trim(), 10) === correctAnswer;

    if (isMathCorrect || isPinCorrect) {
      setErrorMessage('');
      generateNewQuestion();
      onSuccess();
    } else {
      setErrorMessage(t.wrongAnswer);
    }
  };

  const handleClose = () => {
    generateNewQuestion();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>{t.parentGateTitle}</Text>
          <Text style={styles.subtitle}>{t.parentGateSub}</Text>

          <View style={styles.localSecurityBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#059669" />
            <Text style={styles.localSecurityBadgeText}>
              {language === 'ar'
                ? 'حماية محلية برمز PIN (محفوظ على هذا الجهاز فقط)'
                : 'Local on-device PIN protection'}
            </Text>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {question.a} × {question.b} = ?
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={
              language === 'ar'
                ? `اكتب رمز PIN (${parentSettings.pin ? '••••' : '1234'}) أو ناتج الضرب`
                : 'Enter local PIN or math answer'
            }
            placeholderTextColor={COLORS.textMuted}
            keyboardType="number-pad"
            value={inputAnswer}
            onChangeText={(text) => {
              setInputAnswer(text);
              setErrorMessage('');
            }}
            onSubmitEditing={handleVerify}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleVerify}>
              <Text style={styles.submitBtnText}>{t.submitAnswer}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  localSecurityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  localSecurityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  questionContainer: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  submitBtn: {
    flex: 2,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow(COLORS.primary),
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});

// LanguageSelectModal.tsx - Multilingual Selector (Arabic, English, French, German, Spanish)
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { AVAILABLE_LANGUAGES, TRANSLATIONS, LANGUAGE_LOCALIZED_NAMES, Language } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';

interface LanguageSelectModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelectModal({
  visible,
  onClose,
}: LanguageSelectModalProps) {
  const { language, setLanguage } = useAppStore();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              { flexDirection: isAr ? 'row-reverse' : 'row' },
            ]}
          >
            <View
              style={[
                styles.titleContainer,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={styles.globeBadge}>
                <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text
                  style={[
                    styles.title,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {t.chooseLanguage}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {isAr
                    ? 'اختر اللغة المناسبة لك ولطفلك'
                    : 'Select your preferred language'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Languages List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.flagBox}>
                    <Text style={styles.flagCodeText}>{lang.code.toUpperCase()}</Text>
                  </View>

                  <View
                    style={[
                      styles.langInfo,
                      isAr ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.langNativeName,
                        isSelected && styles.langNativeNameSelected,
                      ]}
                    >
                      {lang.nameNative}
                    </Text>
                    <Text style={styles.langSubName}>
                      {LANGUAGE_LOCALIZED_NAMES[language]?.[lang.code] || lang.nameNative}
                    </Text>
                  </View>

                  <View style={styles.indicatorContainer}>
                    {isSelected ? (
                      <View style={styles.selectedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={COLORS.primary}
                        />
                      </View>
                    ) : (
                      <View style={styles.unselectedRadio} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Ionicons name="sparkles" size={14} color="#D97706" />
            <Text style={styles.footerNoteText}>
              {isAr
                ? 'يتم تطبيق اللغة فوراً على جميع الأقسام والقصص والآيات'
                : 'Language is applied instantly across all sections and stories'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    padding: SPACING.lg,
    ...SHADOWS.strong,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  globeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
  },
  list: {
    marginVertical: SPACING.xs,
  },
  listContent: {
    gap: 10,
    paddingVertical: 4,
  },
  langCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  langCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.primary,
  },
  flagBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FBBF24',
    ...SHADOWS.soft,
  },
  flagCodeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  langInfo: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  langNativeNameSelected: {
    color: COLORS.primaryDark,
  },
  langSubName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  indicatorContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerNoteText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});

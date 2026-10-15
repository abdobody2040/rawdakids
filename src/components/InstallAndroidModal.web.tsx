import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const ANDROID_ICON = require('../../assets/images/android-icon-foreground.png');

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAndroidModal() {
  const { language } = useAppStore();
  const isAr = language === 'ar';

  const isStandalone = () => {
    if (typeof window === 'undefined') return false;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean(nav.standalone)
    );
  };

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isStandalone);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  // If already installed, don't show the floating banner
  if (isInstalled) return null;

  return (
    <>
      {/* Floating or Top Install Banner on Mobile/Desktop */}
      <View style={styles.bannerContainer}>
        <TouchableOpacity
          style={styles.installChip}
          onPress={handleInstallClick}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Image source={ANDROID_ICON} style={styles.chipIcon} resizeMode="contain" />
          </View>
          <View style={styles.chipTextContainer}>
            <Text style={styles.chipTitle}>
              {isAr ? '📲 تثبيت التطبيق على جهازك' : '📲 Install App on Android'}
            </Text>
            <Text style={styles.chipSubtitle}>
              {isAr
                ? 'ثبّته كـ تطبيق أندرويد حقيقي بدون متجر'
                : 'Install directly on home screen with 1 tap'}
            </Text>
          </View>
          <View style={styles.installActionBtn}>
            <Text style={styles.installActionText}>
              {isAr ? 'تثبيت الآن' : 'Install'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Instructional Modal when beforeinstallprompt is not directly available */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Image source={ANDROID_ICON} style={styles.modalIcon} resizeMode="contain" />
              </View>
              <Text style={styles.modalTitle}>
                {isAr ? 'تثبيت تطبيق روضة كيدز على أندرويد' : 'Install Rawdakids on Android'}
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  {isAr
                    ? 'افتح التطبيق في متصفح Google Chrome على هاتفك الأندرويد.'
                    : 'Open the app in Google Chrome on your Android phone.'}
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  {isAr
                    ? 'اضغط على زر القائمة (النقاط الثلاث ⁝ في أعلى يسار المتصفح).'
                    : 'Tap the three-dots menu (⁝ in top right of Chrome).'}
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  {isAr
                    ? 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Install App / Add to Home screen).'
                    : 'Select "Install app" or "Add to Home screen".'}
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  {isAr
                    ? 'سيظهر التطبيق كأيقونة مستقلة كاملة الشاشة وتعمل بدون إنترنت!'
                    : 'The app installs as a standalone fullscreen app on your home screen!'}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeBtnText}>{isAr ? 'حسناً، فهمت' : 'Got it'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  installChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: RADIUS.lg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#10B981',
    ...SHADOWS.medium,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#042F2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  chipIcon: {
    width: 24,
    height: 24,
  },
  chipTextContainer: {
    flex: 1,
  },
  chipTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  chipSubtitle: {
    color: '#A7F3D0',
    fontSize: 10,
    marginTop: 2,
  },
  installActionBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    marginLeft: 8,
  },
  installActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xxl,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    ...SHADOWS.strong,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  modalIcon: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    lineHeight: 18,
  },
  modalActions: {
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: RADIUS.full,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});

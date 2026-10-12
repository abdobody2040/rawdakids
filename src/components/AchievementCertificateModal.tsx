// Achievement Certificate Modal for Kids (شهادة التقدير والإنجاز القابلة للطباعة)
import { useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');
const ICON_STAR_IMG = require('../../assets/images/icon-star-3d.jpg');

interface Props {
  visible: boolean;
  onDismiss: () => void;
  certificateType?: 'surah' | 'arkan' | 'prophets' | 'manners' | 'general';
  title?: string;
  subtitle?: string;
}

function formatCertificateDate(isAr: boolean): string {
  return isAr
    ? new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}

export default function AchievementCertificateModal({
  visible,
  onDismiss,
  certificateType: _certificateType = 'surah',
  title = 'سورة الفاتحة',
  subtitle,
}: Props) {
  const { language, profiles, activeProfileId } = useAppStore();
  const isAr = language === 'ar';
  const certRef = useRef<View>(null);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ||
    profiles[0] || { name: isAr ? 'البطل' : 'Champion' };

  // Date formatting
  const todayDateStr = useMemo(() => formatCertificateDate(isAr), [isAr]);

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Actions Bar (Hidden during print) */}
          <View style={[styles.topActionBar, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={styles.topActionLeft}>
              <Text style={styles.topActionHeading}>
                {isAr ? '📜 شهادة فخر وإنجاز مباركة' : '📜 Certificate of Honor'}
              </Text>
            </View>

            <View style={[styles.topActionButtons, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.printActionBtn}
                  onPress={handlePrint}
                  activeOpacity={0.8}
                >
                  <Ionicons name="print" size={17} color="#FFFFFF" />
                  <Text style={styles.printActionBtnText}>
                    {isAr ? 'طباعة الشهادة' : 'Print'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeActionBtn}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Certificate Canvas (Print Target) */}
          <ScrollView
            contentContainerStyle={styles.scrollCanvas}
            showsVerticalScrollIndicator={false}
          >
            <View ref={certRef} style={styles.certificateFrame} nativeID="noor-kids-printable-certificate">
              {/* Outer Golden Border */}
              <View style={styles.outerBorder}>
                {/* Inner Ornamental Border */}
                <View style={styles.innerBorder}>
                  {/* Decorative Corner Stars */}
                  <View style={[styles.cornerStar, styles.cornerTL]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerTR]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerBL]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>
                  <View style={[styles.cornerStar, styles.cornerBR]}>
                    <Text style={styles.cornerStarText}>✦</Text>
                  </View>

                  {/* Basmalah Header */}
                  <Text style={styles.basmalahText}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </Text>

                  {/* Ribbon & Badge */}
                  <View style={styles.ribbonWrapper}>
                    <LinearGradient
                      colors={['#047857', '#065F46']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.ribbonPill}
                    >
                      <Ionicons name="sparkles" size={15} color="#FDE68A" />
                      <Text style={styles.ribbonText}>
                        {isAr
                          ? 'شَهَادَةُ إِتْمَامٍ وَتَمَيُّزٍ رَفِيعٍ'
                          : 'CERTIFICATE OF EXCELLENCE'}
                      </Text>
                      <Ionicons name="sparkles" size={15} color="#FDE68A" />
                    </LinearGradient>
                  </View>

                  {/* App Brand Header */}
                  <Text style={styles.brandTitle}>
                    {isAr ? 'تَطْبِيقُ نُور لِلأَطْفَالِ' : 'NOOR KIDS APP'}
                  </Text>
                  <Text style={styles.brandSubtitle}>
                    {isAr ? 'رِحْلَةُ الإِيمَانِ وَالْقُرْآنِ وَالأَخْلاقِ' : 'Journey of Faith, Quran & Ethics'}
                  </Text>

                  <View style={styles.goldDivider} />

                  {/* Presentation Text */}
                  <Text style={styles.presentationText}>
                    {isAr
                      ? 'تَفْخَرُ إِدَارَةُ "نُور لِلأَطْفَالِ" بِمَنْحِ هَذِهِ الشَّهَادَةِ التَّقْدِيرِيَّةِ لِلْبَطَلِ الْمُجْتَهِدِ:'
                      : 'Noor Kids proudly awards this Certificate of Honor to the outstanding champion:'}
                  </Text>

                  {/* Child Name (Spotlight) */}
                  <View style={styles.childNameBox}>
                    <Text style={styles.childNameDecoration}>❊</Text>
                    <Text style={styles.childNameText}>{activeProfile.name}</Text>
                    <Text style={styles.childNameDecoration}>❊</Text>
                  </View>

                  {/* Achievement Text */}
                  <Text style={styles.achievementDesc}>
                    {isAr
                      ? `تَقْدِيراً لِجُهْدِهِ الْمُبَارَكِ وَهِمَّتِهِ الْعَالِيَةِ فِي إِتْمَامِ وَحِفْظِ وَتَدَبُّرِ:`
                      : `In recognition of blessed dedication and high aspiration in completing:`}
                  </Text>

                  {/* Target Title (Surah / World / Pillar) */}
                  <View style={styles.targetTitleBox}>
                    <Text style={styles.targetTitleText}>
                      {title}
                    </Text>
                    {subtitle ? (
                      <Text style={styles.targetSubtitleText}>{subtitle}</Text>
                    ) : null}
                  </View>

                  {/* Du'a blessing line */}
                  <Text style={styles.duaBlessingText}>
                    {isAr
                      ? '«سَائِلِينَ اللَّهَ تَعَالَى أَنْ يَجْعَلَ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قَلْبِهِ، وَنُورَ صَدْرِهِ، وَشَفِيعاً لَهُ وَلِوَالِدَيْهِ»'
                      : '“May Allah bless this young heart with wisdom, light, and love for the Holy Quran.”'}
                  </Text>

                  {/* Footer Credentials & Signatures */}
                  <View style={[styles.certFooterRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    {/* Date */}
                    <View style={styles.footerCol}>
                      <Text style={styles.footerLabel}>
                        {isAr ? 'تَارِيخُ الإِنْجَازِ' : 'Date'}
                      </Text>
                      <Text style={styles.footerValue}>{todayDateStr}</Text>
                    </View>

                    {/* Golden Embossed Seal (Center) */}
                    <View style={styles.footerSealBox}>
                      <View style={styles.sealCircle}>
                        <Image source={ICON_STAR_IMG} style={styles.sealStarImg} resizeMode="contain" />
                        <Text style={styles.sealText}>
                          {isAr ? 'خَتْمُ التَّمَيُّزِ' : 'GOLD SEAL'}
                        </Text>
                      </View>
                    </View>

                    {/* Signature */}
                    <View style={styles.footerCol}>
                      <Text style={styles.footerLabel}>
                        {isAr ? 'إِدَارَةُ التَّطْبِيقِ' : 'Verified By'}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Image source={MASCOT_NOOR_IMG} style={styles.footerMascot} resizeMode="cover" />
                        <Text style={styles.footerValue}>
                          {isAr ? 'نُور لِلأَطْفَالِ ☼' : 'Noor Kids ☼'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions Bar */}
          <View style={[styles.bottomBar, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.printBigBtn}
                onPress={handlePrint}
                activeOpacity={0.85}
              >
                <Ionicons name="print" size={20} color="#FFFFFF" />
                <Text style={styles.printBigBtnText}>
                  {isAr ? '🖨️ طباعة الشهادة أو حفظها كـ PDF' : '🖨️ Print or Save as PDF'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={onDismiss}
              activeOpacity={0.85}
            >
              <Text style={styles.dismissBtnText}>
                {isAr ? 'متابعة رحلتي ➔' : 'Continue Journey ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 820,
    maxHeight: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  topActionBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topActionLeft: {
    flex: 1,
  },
  topActionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  topActionButtons: {
    alignItems: 'center',
    gap: 8,
  },
  printActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  printActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollCanvas: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  certificateFrame: {
    width: '100%',
    maxWidth: 740,
    backgroundColor: '#FFFDF8',
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  outerBorder: {
    borderWidth: 5,
    borderColor: '#D97706',
    borderRadius: RADIUS.lg,
    padding: 6,
    backgroundColor: '#FFFDF8',
  },
  innerBorder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#047857',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FFFEFA',
  },
  cornerStar: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerStarText: {
    fontSize: 20,
    color: '#D97706',
    fontWeight: '900',
  },
  cornerTL: { top: 8, left: 8 },
  cornerTR: { top: 8, right: 8 },
  cornerBL: { bottom: 8, left: 8 },
  cornerBR: { bottom: 8, right: 8 },
  basmalahText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ribbonWrapper: {
    marginVertical: 6,
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    ...SHADOWS.soft,
  },
  ribbonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FEF3C7',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  goldDivider: {
    width: '60%',
    height: 2,
    backgroundColor: '#FDE68A',
    marginVertical: SPACING.md,
  },
  presentationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  childNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: RADIUS.xl,
    marginVertical: SPACING.md,
    ...SHADOWS.soft,
  },
  childNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#065F46',
  },
  childNameDecoration: {
    fontSize: 18,
    color: '#D97706',
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  targetTitleBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    marginVertical: SPACING.sm,
  },
  targetTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#92400E',
  },
  targetSubtitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 2,
  },
  duaBlessingText: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 580,
    marginVertical: SPACING.md,
  },
  certFooterRow: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: SPACING.md,
    marginTop: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerCol: {
    alignItems: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  footerSealBox: {
    alignItems: 'center',
  },
  sealCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFBEB',
    borderWidth: 3,
    borderColor: '#D97706',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  sealStarImg: {
    width: 26,
    height: 26,
  },
  sealText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400E',
    marginTop: 2,
  },
  footerMascot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  printBigBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#047857',
    paddingVertical: 13,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  printBigBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dismissBtn: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.lg,
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
});

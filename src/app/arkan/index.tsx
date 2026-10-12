// Pillars Academy Hub (أكاديمية الأركان - أركان الإسلام وأركان الإيمان للأطفال)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import { arkanService, PillarItem } from '@/data/arkanData';
import { getPillarMedia } from '@/data/arkanMedia';

export default function ArkanAcademyScreen() {
  const router = useRouter();
  const { language } = useAppStore();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'islam' | 'iman'>('islam');

  const islamPillars = arkanService.getIslamPillars();
  const imanPillars = arkanService.getImanPillars();
  const currentList: PillarItem[] = activeTab === 'islam' ? islamPillars : imanPillars;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack fallbackRoute="/" title={isAr ? 'أكاديمية الأركان' : 'Pillars Academy'} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <LinearGradient
              colors={['#065F46', '#047857']}
              style={styles.heroGradient}
            >
              <View style={[styles.heroRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={[styles.heroTextCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                  <View style={styles.heroBadgePill}>
                    <Text style={styles.heroBadgeText}>
                      {isAr ? '🌟 رحلة الإيمان والعمل' : '🌟 Journey of Faith'}
                    </Text>
                  </View>
                  <Text style={styles.heroTitle}>
                    {isAr ? 'أكاديمية الأركان' : 'Pillars Academy'}
                  </Text>
                  <Text style={[styles.heroSubtitle, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? 'تعلم أركان الإسلام الخمسة وأركان الإيمان الستة بأسلوب تفاعلي مشوق وجميل!'
                      : 'Explore the 5 Pillars of Islam and 6 Pillars of Iman through interactive lessons!'}
                  </Text>
                </View>
                <View style={styles.heroIconBox}>
                  <Text style={{ fontSize: 36 }}>🕌</Text>
                </View>
              </View>

              {/* 2-Category Tab Switcher */}
              <View style={[styles.categoryTabsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[
                    styles.catTabBtn,
                    activeTab === 'islam' && styles.catTabBtnActive,
                  ]}
                  onPress={() => setActiveTab('islam')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={18}
                    color={activeTab === 'islam' ? '#065F46' : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.catTabBtnText,
                      activeTab === 'islam' && styles.catTabBtnTextActive,
                    ]}
                  >
                    {isAr ? 'أركان الإسلام (٥)' : 'Pillars of Islam (5)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.catTabBtn,
                    activeTab === 'iman' && styles.catTabBtnActive,
                  ]}
                  onPress={() => setActiveTab('iman')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={activeTab === 'iman' ? '#065F46' : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.catTabBtnText,
                      activeTab === 'iman' && styles.catTabBtnTextActive,
                    ]}
                  >
                    {isAr ? 'أركان الإيمان (٦)' : 'Pillars of Iman (6)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Pillars Cards List */}
          <View style={styles.listContainer}>
            {currentList.map((pillar) => {
              return (
                <TouchableOpacity
                  key={pillar.id}
                  style={styles.pillarCard}
                  onPress={() => router.push({ pathname: '/arkan/[pillarId]', params: { pillarId: pillar.id } })}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.cardHeaderRow,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <View style={[styles.numberBadge, { backgroundColor: pillar.color }]}>
                      <Text style={styles.numberBadgeText}>
                        {isAr ? `الركن ${pillar.number}` : `Pillar ${pillar.number}`}
                      </Text>
                    </View>

                    <View style={[styles.mediaThumbContainer, { borderColor: pillar.color }]}>
                      <Image
                        source={getPillarMedia(pillar.id)}
                        style={styles.mediaThumbImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.pillarTitle,
                      { textAlign: isAr ? 'right' : 'left' },
                    ]}
                  >
                    {isAr ? pillar.titleAr : pillar.titleEn}
                  </Text>

                  <Text
                    style={[
                      styles.pillarSubtitle,
                      { textAlign: isAr ? 'right' : 'left' },
                    ]}
                  >
                    {isAr ? pillar.subtitleAr : pillar.subtitleEn}
                  </Text>

                  <Text
                    style={[
                      styles.pillarSummary,
                      { textAlign: isAr ? 'right' : 'left' },
                    ]}
                    numberOfLines={2}
                  >
                    {isAr ? pillar.summaryAr : pillar.summaryEn}
                  </Text>

                  {/* Card Bottom CTA */}
                  <View
                    style={[
                      styles.cardFooterRow,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <View style={styles.rewardPill}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.rewardText}>+{pillar.rewardStars} {isAr ? 'نجوم' : 'stars'}</Text>
                    </View>

                    <View style={[styles.ctaButton, { backgroundColor: pillar.color }]}>
                      <Text style={styles.ctaButtonText}>
                        {isAr ? 'استكشف وتعلّم' : 'Explore'}
                      </Text>
                      <Ionicons
                        name={isAr ? 'arrow-back' : 'arrow-forward'}
                        size={15}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <AppBottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroBanner: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroGradient: {
    padding: SPACING.lg,
  },
  heroRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroTextCol: {
    flex: 1,
  },
  heroBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE68A',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 4,
    lineHeight: 18,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTabsRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: RADIUS.lg,
    padding: 4,
    gap: 6,
    marginTop: SPACING.md,
  },
  catTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  catTabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  catTabBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catTabBtnTextActive: {
    color: '#065F46',
    fontWeight: '900',
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  pillarCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  cardHeaderRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  numberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  numberBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mediaThumbContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    backgroundColor: '#F3F4F6',
    ...SHADOWS.soft,
  },
  mediaThumbImage: {
    width: '100%',
    height: '100%',
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 2,
  },
  pillarSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  pillarSummary: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  cardFooterRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

// Prophets' Caravan: Timeline Map (P1)
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { contentService } from '@/services/contentService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedProphetMeta } from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';

const PROPHETS_CARAVAN_IMG = require('../../../assets/images/prophets-caravan.jpg');
const NAV_PROPHETS_IMG = require('../../../assets/images/nav-prophets-3d.jpg');

export default function ProphetsTimelineScreen() {
  const router = useRouter();
  const { language, storyProgress } = useAppStore();
  const t = TRANSLATIONS[language];
  const prophets = contentService.getProphets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack title={t.prophets} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Caravan Hero Banner with 3D Generated Image */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground
            source={PROPHETS_CARAVAN_IMG}
            style={styles.heroBannerImage}
            imageStyle={{ borderRadius: RADIUS.xl }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(79, 70, 229, 0.88)', 'rgba(124, 58, 237, 0.94)']}
              style={styles.heroBannerOverlay}
            >
              <View style={styles.heroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>{t.prophets}</Text>
                  <Text style={styles.heroDesc}>{t.prophetsDesc}</Text>
                </View>
                <View style={styles.hero3dBadgeBox}>
                  <Image
                    source={NAV_PROPHETS_IMG}
                    style={styles.hero3dBadgeImg}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <Text style={styles.timelineHeading}>{t.prophetsTimeline}</Text>

        {/* Vertical Timeline Path */}
        <View style={styles.timelineList}>
          {prophets.map((prophet, index) => {
            const progress = storyProgress[prophet.id];
            const isCompleted = progress?.completed;
            const meta = getLocalizedProphetMeta(prophet, language);

            return (
              <View key={prophet.id} style={styles.timelineItemRow}>
                {/* Timeline Node & Connecting Line */}
                <View style={styles.timelineAxis}>
                  <View
                    style={[
                      styles.axisNode,
                      isCompleted && styles.axisNodeCompleted,
                    ]}
                  >
                    <Text style={styles.axisOrderText}>{prophet.order}</Text>
                  </View>
                  {index < prophets.length - 1 && <View style={styles.axisLine} />}
                </View>

                {/* Prophet Story Card */}
                <TouchableOpacity
                  style={[styles.prophetCard, { borderLeftColor: prophet.themeColor }]}
                  onPress={() => router.push(`/prophets/${prophet.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.nameRow}>
                      <Text style={styles.prophetName}>
                        {language === 'ar' ? `نبي الله ${meta.name}` : `${t.prophetPrefix} ${meta.name}`}
                      </Text>
                      <View style={styles.honorificBadge}>
                        <Text style={styles.honorificText}>
                          {meta.honorific}
                        </Text>
                      </View>
                    </View>

                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={COLORS.success}
                        />
                        <Text style={styles.completedBadgeText}>{t.done}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.titleBadge}>
                    {meta.titleBadge}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      📍 {meta.location}
                    </Text>
                    <Text style={styles.metaText}>
                      ⏳ {meta.era}
                    </Text>
                  </View>

                  <View style={styles.startRow}>
                    <Text style={styles.startText}>{t.startStory}</Text>
                    <Ionicons
                      name={
                        language === 'ar'
                          ? 'arrow-back-circle'
                          : 'arrow-forward-circle'
                      }
                      size={22}
                      color={prophet.themeColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
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
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroBannerContainer: {
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroBannerImage: {
    width: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  hero3dBadgeBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd6fe',
    backgroundColor: '#ede9fe',
    ...SHADOWS.soft,
  },
  hero3dBadgeImg: {
    width: '100%',
    height: '100%',
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  timelineHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: SPACING.sm,
  },
  timelineList: {
    marginTop: SPACING.xs,
  },
  timelineItemRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  timelineAxis: {
    alignItems: 'center',
    width: 36,
  },
  axisNode: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  axisNodeCompleted: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  axisOrderText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  axisLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  prophetCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    ...SHADOWS.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prophetName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  honorificBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  honorificText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  titleBadge: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  metaRow: {
    gap: 2,
    marginBottom: SPACING.sm,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  startRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.xs,
  },
  startText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';

const GRATITUDE_JAR_IMG = require('../../../assets/images/gratitude-jar.jpg');

interface GratitudeCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  promptsAr: string[];
  promptsEn: string[];
}

const CATEGORIES: GratitudeCategory[] = [
  {
    id: 'family',
    nameAr: 'أهلي وأسرتي',
    nameEn: 'My Family',
    emoji: '👨‍👩‍👧',
    promptsAr: [
      'الحمد لله على نعمة أمي وأبي اللذين يحباني',
      'شكراً لله على إخوتي ولعبنا معاً بمودة',
      'الحمد لله على بيت دافئ يجمع عائلتي',
    ],
    promptsEn: [
      'Thank Allah for my loving parents',
      'Thank Allah for my siblings playing with me',
      'Thank Allah for a safe, warm home',
    ],
  },
  {
    id: 'health',
    nameAr: 'صحتي وعافيتي',
    nameEn: 'My Health',
    emoji: '💪',
    promptsAr: [
      'الحمد لله على عيني التي أرى بها الأشياء الجميلة',
      'شكراً لله على قدمي التي أركض بها وألعب',
      'الحمد لله على قلبي الذي ينبض بالحياة',
    ],
    promptsEn: [
      'Thank Allah for my eyes to see wonders',
      'Thank Allah for my legs to run and play',
      'Thank Allah for a healthy, beating heart',
    ],
  },
  {
    id: 'food',
    nameAr: 'طعامي وشرابي',
    nameEn: 'My Food & Drink',
    emoji: '🍎',
    promptsAr: [
      'الحمد لله الذي أطعمني طعاماً لذيذاً وسقاني ماءً عذباً',
      'شكراً لله على الفواكه الحلوة والحلويات الطيبة',
    ],
    promptsEn: [
      'Thank Allah for delicious meals and fresh water',
      'Thank Allah for sweet fruits and treats',
    ],
  },
  {
    id: 'faith',
    nameAr: 'صلاتي ومصحفي',
    nameEn: 'Prayer & Faith',
    emoji: '📖',
    promptsAr: [
      'الحمد لله على نعمة الإسلام وهداية ربي',
      'شكراً لله على حفظي لآيات جديدة من القرآن اليوم',
      'الحمد لله على شعوري بالأمان عند الدعاء',
    ],
    promptsEn: [
      'Thank Allah for the blessing of Islam',
      'Thank Allah for memorizing new Quran ayahs',
      'Thank Allah for peace during prayer and dua',
    ],
  },
  {
    id: 'nature',
    nameAr: 'الطبيعة والكون',
    nameEn: 'Nature & Wonders',
    emoji: '🌸',
    promptsAr: [
      'الحمد لله على شمس الصباح المشرقة',
      'شكراً لله على الأزهار الملونة ورائحتها العطرة',
      'الحمد لله على المطر الذي يسقي الأرض',
    ],
    promptsEn: [
      'Thank Allah for the bright morning sun',
      'Thank Allah for colorful flowers and birds',
      'Thank Allah for refreshing rain',
    ],
  },
  {
    id: 'friends',
    nameAr: 'أصدقائي ومدرستي',
    nameEn: 'Friends & School',
    emoji: '🎒',
    promptsAr: [
      'الحمد لله على أصدقاء طيبين يبتسمون في وجهي',
      'شكراً لله على معلمي ومعلمتي الذين يعلمونني الخير',
    ],
    promptsEn: [
      'Thank Allah for kind friends at school',
      'Thank Allah for teachers who guide us',
    ],
  },
];

export default function GratitudeJournalScreen() {
  const { language, gratitudeEntries, addGratitudeEntry } = useAppStore();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const isAr = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<GratitudeCategory>(CATEGORIES[0]);
  const [customText, setCustomText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelectPrompt = (prompt: string) => {
    setCustomText(prompt);
  };

  const handleSaveGratitude = () => {
    const textToSave = customText.trim();
    if (!textToSave) return;

    addGratitudeEntry({
      category: isAr ? selectedCategory.nameAr : selectedCategory.nameEn,
      emoji: selectedCategory.emoji,
      text: textToSave,
    });

    setCustomText('');
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        title={isAr ? 'دفتر شكر الله والامتنان' : 'Gratitude Journal'}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDesktop && styles.containerDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner with Ayah */}
        <LinearGradient
          colors={['#174e46', '#257960', '#419976']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerEmojiBox}>
            <Text style={styles.bannerEmoji}>🤲</Text>
          </View>
          <Text style={styles.bannerAyah}>
            {isAr ? '«لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ»' : '“If you are grateful, I will surely increase you”'}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {isAr
              ? 'كلما شكرنا الله على نعمه العظيمة، زادنا فرحاً وبركة ونوراً في حياتنا!'
              : 'Every time we thank Allah for His blessings, our hearts fill with joy and light!'}
          </Text>
        </LinearGradient>

        {/* Section Title */}
        <View style={[styles.sectionRow, isAr && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.sectionTitle}>
            {isAr ? 'اختر باباً من نعم الله عليك:' : 'Pick a blessing to thank Allah for:'}
          </Text>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.catRow,
            isAr && { flexDirection: 'row-reverse' },
          ]}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  isSelected && styles.catChipActive,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.catChipText,
                    isSelected && styles.catChipTextActive,
                  ]}
                >
                  {isAr ? cat.nameAr : cat.nameEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Input & Suggested Prompts Box */}
        <View style={styles.inputBox}>
          <Text style={[styles.inputLabel, isAr && { textAlign: 'right' }]}>
            {isAr ? 'بماذا تشكر ربك اليوم؟' : 'What are you thankful for today?'}
          </Text>

          <TextInput
            style={[
              styles.textInput,
              isAr && { textAlign: 'right' },
            ]}
            value={customText}
            onChangeText={setCustomText}
            placeholder={
              isAr
                ? 'اكتب هنا كلمتك الطيبة (أو اختر من الأفكار المقترحة بالأسفل)...'
                : 'Write your thankful words here (or pick an idea below)...'
            }
            placeholderTextColor="#8a9e96"
            multiline
            numberOfLines={3}
          />

          {/* Quick Idea Prompts */}
          <Text style={[styles.promptTitle, isAr && { textAlign: 'right' }]}>
            {isAr ? '💡 أفكار جميلة مقترحة:' : '💡 Lovely suggested ideas:'}
          </Text>
          <View style={styles.promptsList}>
            {(isAr ? selectedCategory.promptsAr : selectedCategory.promptsEn).map(
              (prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.promptChip,
                    customText === prompt && styles.promptChipSelected,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                  onPress={() => handleSelectPrompt(prompt)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="sparkles" size={14} color="#D97706" />
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Action Button: الحمد لله رب العالمين */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              !customText.trim() && styles.submitBtnDisabled,
            ]}
            onPress={handleSaveGratitude}
            disabled={!customText.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnEmoji}>🤲</Text>
            <Text style={styles.submitBtnText}>
              {isAr ? 'الحمد لله رب العالمين (تسجيل النعمة)' : 'Alhamdulillah! (Save Blessing)'}
            </Text>
            <Text style={styles.rewardHint}>+2 ⭐</Text>
          </TouchableOpacity>
        </View>

        {/* MY GRATITUDE JAR (سجل النعم والشكر) */}
        <View style={styles.jarSection}>
          <View style={styles.jarHeroCard}>
            <Image
              source={GRATITUDE_JAR_IMG}
              style={styles.jarHeroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(12, 34, 26, 0.92)']}
              style={styles.jarHeroGradient}
            >
              <View
                style={[
                  styles.jarHeroContent,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jarHeroTitle, isAr && { textAlign: 'right' }]}>
                    {isAr ? 'جرّة الشكر ونعم الله' : 'My Gratitude Jar'}
                  </Text>
                  <Text style={[styles.jarHeroSubtitle, isAr && { textAlign: 'right' }]}>
                    {isAr
                      ? 'كل نعمة تسجلها نجمة تضيء في قلبك ✨'
                      : 'Every blessing recorded is a star glowing in your heart ✨'}
                  </Text>
                </View>
                <View style={styles.jarCountPill}>
                  <Text style={styles.jarCountText}>
                    {gratitudeEntries.length} {isAr ? 'نعم مسجلة' : 'blessings'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.entriesList}>
            {gratitudeEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View
                  style={[
                    styles.entryTop,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 20 }}>{entry.emoji}</Text>
                    <Text style={styles.entryCat}>{entry.category}</Text>
                  </View>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>
                <Text
                  style={[
                    styles.entryText,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {entry.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Reward Celebration */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={2}
        gemsEarned={3}
        title={isAr ? 'الحمد لله دائماً وأبداً!' : 'Alhamdulillah Always!'}
        subtitle={
          isAr
            ? 'شكرك لله يملأ قلبك نوراً وسعادة ويزيدك من فضله العظيم!'
            : 'Gratitude brings barakah, joy, and peace into your lovely life!'
        }
        onDismiss={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffdf8',
  },
  container: {
    padding: 24,
    gap: 20,
    paddingBottom: 48,
  },
  containerDesktop: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },

  // BANNER
  banner: {
    padding: 24,
    borderRadius: 26,
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.medium,
  },
  bannerEmojiBox: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bannerEmoji: {
    fontSize: 28,
  },
  bannerAyah: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffdf86',
    textAlign: 'center',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#d6ede0',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
    maxWidth: 520,
  },

  // SECTION
  sectionRow: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#183c38',
  },

  // CATEGORIES
  catRow: {
    gap: 10,
    paddingVertical: 4,
  },
  catChip: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e8f0ea',
    ...SHADOWS.soft,
  },
  catChipActive: {
    backgroundColor: '#d8f2df',
    borderColor: '#98dba9',
  },
  catChipEmoji: {
    fontSize: 20,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#557268',
  },
  catChipTextActive: {
    color: '#1b674f',
  },

  // INPUT
  inputBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#edf1ec',
    gap: 14,
    ...SHADOWS.soft,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#183c38',
  },
  textInput: {
    backgroundColor: '#f7faf8',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d7e7dc',
    padding: 14,
    fontSize: 14,
    color: '#183c38',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  promptTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#789087',
  },
  promptsList: {
    gap: 8,
  },
  promptChip: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffdf6',
    borderWidth: 1,
    borderColor: '#faebd0',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 14,
  },
  promptChipSelected: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  promptChipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffcf5c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#d99835',
    marginTop: 6,
    ...SHADOWS.glow('#d99835'),
  },
  submitBtnDisabled: {
    backgroundColor: '#e5e7eb',
    borderBottomColor: '#d1d5db',
    opacity: 0.6,
  },
  submitBtnEmoji: {
    fontSize: 20,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#385540',
  },
  rewardHint: {
    fontSize: 12,
    fontWeight: '900',
    color: '#854d0e',
    backgroundColor: '#fef08a',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },

  // JAR ENTRIES
  jarSection: {
    marginTop: 8,
    gap: 14,
  },
  jarHeroCard: {
    borderRadius: 24,
    height: 190,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1b3b30',
    ...SHADOWS.medium,
  },
  jarHeroImage: {
    width: '100%',
    height: '100%',
  },
  jarHeroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '35%',
    justifyContent: 'flex-end',
    padding: 18,
  },
  jarHeroContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  jarHeroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  jarHeroSubtitle: {
    fontSize: 12,
    color: '#d6ede0',
    marginTop: 3,
  },
  jarCountPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    ...SHADOWS.soft,
  },
  jarCountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#20654e',
  },
  entriesList: {
    gap: 10,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf1ec',
    gap: 8,
    ...SHADOWS.soft,
  },
  entryTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCat: {
    fontSize: 12,
    fontWeight: '800',
    color: '#267960',
  },
  entryDate: {
    fontSize: 11,
    color: '#9aac9f',
    fontWeight: '600',
  },
  entryText: {
    fontSize: 14,
    color: '#294345',
    lineHeight: 22,
    fontWeight: '600',
  },
});

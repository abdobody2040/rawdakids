// Dedicated Full-Screen Kid Tasbih Route (/sunnah/tasbih)
import { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import Header from '@/components/Header';
import KidTasbihModal from '@/components/KidTasbihModal';
import { COLORS } from '@/constants/theme';

export default function TasbihScreen() {
  const router = useRouter();
  const { language } = useAppStore();
  const isAr = language === 'ar';
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sunnah');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        fallbackRoute="/sunnah"
        title={isAr ? 'مسبحة الأذكار 📿' : 'Tasbih Counter 📿'}
      />
      <View style={styles.container}>
        <KidTasbihModal
          visible={visible}
          onDismiss={handleDismiss}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
});

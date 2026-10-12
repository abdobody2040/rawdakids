// Local Notification Service for Noor Kids Daily Gentle Reminders
import { Platform } from 'react-native';

export interface KidReminder {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  timeLabel: string;
  icon: string;
}

export const DEFAULT_KID_REMINDERS: KidReminder[] = [
  {
    id: 'morning_dua',
    titleAr: '☀️ صباح النور يا بطل!',
    titleEn: '☀️ Good Morning, Hero!',
    bodyAr: 'ابدأ يومك ببسم الله ودعاء الصباح المبارك لتنال بركة يومك 🤲',
    bodyEn: 'Start your morning with Bismillah and morning Dua for a blessed day 🤲',
    timeLabel: '08:00 ص',
    icon: 'sunny',
  },
  {
    id: 'quran_garden',
    titleAr: '🌱 وقت حديقة القرآن الكريم!',
    titleEn: '🌱 Quran Garden Time!',
    bodyAr: 'بانتظارك آيات عطرة جديدة وجواهر ونجوم لتجمعها اليوم 📖',
    bodyEn: 'New blessed ayahs and glowing stars are waiting for you in the Quran Garden 📖',
    timeLabel: '04:30 م',
    icon: 'book',
  },
  {
    id: 'bedtime_adhkar',
    titleAr: '🌙 أذكار النوم الهنيء',
    titleEn: '🌙 Peaceful Bedtime Adhkar',
    bodyAr: 'استمع لسورة الملك والمعوذات لتنام في حفظ الله ورعايته 💤',
    bodyEn: 'Listen to Surah Al-Mulk and sleep peacefully under Allah’s care 💤',
    timeLabel: '08:30 م',
    icon: 'moon',
  },
];

class NotificationService {
  public async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          return true;
        }
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return true;
    } catch {
      return false;
    }
  }

  public getPermissionStatus(): string {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'granted';
  }

  public async sendNotification(title: string, body: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/assets/images/icon.png',
            badge: '/assets/images/favicon.png',
          });
          return true;
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification(title, {
              body,
              icon: '/assets/images/icon.png',
            });
            return true;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const notificationService = new NotificationService();

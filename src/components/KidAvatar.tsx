import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { Language } from '@/constants/i18n';

const AVATAR_IMAGES: Record<string, any> = {
  'av-boy1': require('../../assets/images/avatar-boy-1.jpg'),
  'avatar-boy-1': require('../../assets/images/avatar-boy-1.jpg'),
  '👦': require('../../assets/images/avatar-boy-1.jpg'),

  'av-girl1': require('../../assets/images/avatar-girl-1.jpg'),
  'avatar-girl-1': require('../../assets/images/avatar-girl-1.jpg'),
  '👧': require('../../assets/images/avatar-girl-1.jpg'),

  'av-boy2': require('../../assets/images/avatar-boy-2.jpg'),
  'avatar-boy-2': require('../../assets/images/avatar-boy-2.jpg'),
  '🧒': require('../../assets/images/avatar-boy-2.jpg'),

  'av-girl2': require('../../assets/images/avatar-girl-2.jpg'),
  'avatar-girl-2': require('../../assets/images/avatar-girl-2.jpg'),
  '🧕': require('../../assets/images/avatar-girl-2.jpg'),

  'av-boy3': require('../../assets/images/avatar-boy-3.jpg'),
  'avatar-boy-3': require('../../assets/images/avatar-boy-3.jpg'),
  'avatar-hafiz': require('../../assets/images/avatar-boy-3.jpg'),
  '📖': require('../../assets/images/avatar-boy-3.jpg'),

  'av-girl3': require('../../assets/images/avatar-girl-3.jpg'),
  'avatar-girl-3': require('../../assets/images/avatar-girl-3.jpg'),
  'avatar-zahra': require('../../assets/images/avatar-girl-3.jpg'),
  '🌸': require('../../assets/images/avatar-girl-3.jpg'),

  'av-boy4': require('../../assets/images/avatar-boy-4.jpg'),
  'avatar-boy-4': require('../../assets/images/avatar-boy-4.jpg'),
  'avatar-explorer': require('../../assets/images/avatar-boy-4.jpg'),
  '🧭': require('../../assets/images/avatar-boy-4.jpg'),

  'av-girl4': require('../../assets/images/avatar-girl-4.jpg'),
  'avatar-girl-4': require('../../assets/images/avatar-girl-4.jpg'),
  'avatar-maryam': require('../../assets/images/avatar-girl-4.jpg'),
  '📚': require('../../assets/images/avatar-girl-4.jpg'),

  'av-lantern': require('../../assets/images/mascot-noor.jpg'),
  'avatar-noor': require('../../assets/images/mascot-noor.jpg'),
  '🏮': require('../../assets/images/mascot-noor.jpg'),
  'noor': require('../../assets/images/mascot-noor.jpg'),

  'av-horse': require('../../assets/images/avatar-horse.jpg'),
  'avatar-horse': require('../../assets/images/avatar-horse.jpg'),
  '🐴': require('../../assets/images/avatar-horse.jpg'),

  'av-cat': require('../../assets/images/avatar-cat.jpg'),
  'avatar-cat': require('../../assets/images/avatar-cat.jpg'),
  '🐱': require('../../assets/images/avatar-cat.jpg'),

  'av-falcon': require('../../assets/images/avatar-falcon.jpg'),
  'avatar-falcon': require('../../assets/images/avatar-falcon.jpg'),
  '🦅': require('../../assets/images/avatar-falcon.jpg'),
};

export interface PresetAvatar {
  id: string;
  key: string;
  traitAr: string;
  traitEn: string;
  nameAr: string;
  nameEn: string;
  image: any;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'av-boy1', key: 'avatar-boy-1', traitAr: 'البطل', traitEn: 'the Champion', nameAr: 'البطل', nameEn: 'The Champion', image: AVATAR_IMAGES['av-boy1'] },
  { id: 'av-girl1', key: 'avatar-girl-1', traitAr: 'اللطيفة', traitEn: 'the Gentle', nameAr: 'اللطيفة', nameEn: 'The Gentle', image: AVATAR_IMAGES['av-girl1'] },
  { id: 'av-boy3', key: 'avatar-boy-3', traitAr: 'الحافظ', traitEn: 'the Hafiz', nameAr: 'الحافظ الصغير', nameEn: 'The Young Hafiz', image: AVATAR_IMAGES['av-boy3'] },
  { id: 'av-girl3', key: 'avatar-girl-3', traitAr: 'زهرة الروضة', traitEn: 'the Blossom', nameAr: 'الزهرة', nameEn: 'The Blossom', image: AVATAR_IMAGES['av-girl3'] },
  { id: 'av-boy2', key: 'avatar-boy-2', traitAr: 'الذكي', traitEn: 'the Brilliant', nameAr: 'الذكي', nameEn: 'The Brilliant', image: AVATAR_IMAGES['av-boy2'] },
  { id: 'av-girl2', key: 'avatar-girl-2', traitAr: 'المبدعة', traitEn: 'the Creative', nameAr: 'المبدعة', nameEn: 'The Creative', image: AVATAR_IMAGES['av-girl2'] },
  { id: 'av-boy4', key: 'avatar-boy-4', traitAr: 'المستكشف', traitEn: 'the Explorer', nameAr: 'المستكشف', nameEn: 'The Explorer', image: AVATAR_IMAGES['av-boy4'] },
  { id: 'av-girl4', key: 'avatar-girl-4', traitAr: 'القارئة', traitEn: 'the Reader', nameAr: 'القارئة الذكية', nameEn: 'The Smart Reader', image: AVATAR_IMAGES['av-girl4'] },
  { id: 'av-lantern', key: 'avatar-noor', traitAr: 'المحبوب', traitEn: 'the Beloved', nameAr: 'نور المحبوب', nameEn: 'Noor the Mascot', image: AVATAR_IMAGES['av-lantern'] },
  { id: 'av-horse', key: 'avatar-horse', traitAr: 'المهر الأصيل', traitEn: 'the Brave Foal', nameAr: 'المهر الأصيل', nameEn: 'The Noble Foal', image: AVATAR_IMAGES['av-horse'] },
  { id: 'av-cat', key: 'avatar-cat', traitAr: 'صديق مشمش', traitEn: 'Mishmish’s Friend', nameAr: 'القطة مشمش', nameEn: 'Mishmish the Cat', image: AVATAR_IMAGES['av-cat'] },
  { id: 'av-falcon', key: 'avatar-falcon', traitAr: 'الصقر الشجاع', traitEn: 'the Falcon', nameAr: 'الصقر الصغير', nameEn: 'The Brave Falcon', image: AVATAR_IMAGES['av-falcon'] },
];

export function getAvatarDisplayName(
  avatarId: string,
  childName?: string,
  language: Language = 'ar'
): string {
  const av = PRESET_AVATARS.find((a) => a.id === avatarId || a.key === avatarId);
  const trimmed = childName?.trim();

  if (!trimmed) {
    if (!av) return language === 'ar' ? 'البطل' : 'Champion';
    return language === 'ar' ? av.nameAr : av.nameEn;
  }

  if (language === 'ar') {
    switch (avatarId) {
      case 'av-boy1':
      case 'avatar-boy-1':
        return `${trimmed} البطل`;
      case 'av-girl1':
      case 'avatar-girl-1':
        return `${trimmed} اللطيفة`;
      case 'av-boy3':
      case 'avatar-boy-3':
        return `${trimmed} الحافظ`;
      case 'av-girl3':
      case 'avatar-girl-3':
        return `${trimmed} الزهرة`;
      case 'av-boy2':
      case 'avatar-boy-2':
        return `${trimmed} الذكي`;
      case 'av-girl2':
      case 'avatar-girl-2':
        return `${trimmed} المبدعة`;
      case 'av-boy4':
      case 'avatar-boy-4':
        return `${trimmed} المستكشف`;
      case 'av-girl4':
      case 'avatar-girl-4':
        return `${trimmed} القارئة`;
      case 'av-lantern':
      case 'avatar-noor':
      case 'noor':
        return `${trimmed} المحبوب`;
      case 'av-horse':
      case 'avatar-horse':
        return `${trimmed} والمهر الأصيل`;
      case 'av-cat':
      case 'avatar-cat':
        return `${trimmed} ومشمش`;
      case 'av-falcon':
      case 'avatar-falcon':
        return `${trimmed} والصقر`;
      default:
        return `${trimmed} البطل`;
    }
  } else {
    switch (avatarId) {
      case 'av-boy1':
      case 'avatar-boy-1':
        return `${trimmed} the Champion`;
      case 'av-girl1':
      case 'avatar-girl-1':
        return `${trimmed} the Gentle`;
      case 'av-boy3':
      case 'avatar-boy-3':
        return `${trimmed} the Hafiz`;
      case 'av-girl3':
      case 'avatar-girl-3':
        return `${trimmed} the Blossom`;
      case 'av-boy2':
      case 'avatar-boy-2':
        return `${trimmed} the Brilliant`;
      case 'av-girl2':
      case 'avatar-girl-2':
        return `${trimmed} the Creative`;
      case 'av-boy4':
      case 'avatar-boy-4':
        return `${trimmed} the Explorer`;
      case 'av-girl4':
      case 'avatar-girl-4':
        return `${trimmed} the Reader`;
      case 'av-lantern':
      case 'avatar-noor':
      case 'noor':
        return `${trimmed} the Beloved`;
      case 'av-horse':
      case 'avatar-horse':
        return `${trimmed} & the Noble Foal`;
      case 'av-cat':
      case 'avatar-cat':
        return `Mishmish & ${trimmed}`;
      case 'av-falcon':
      case 'avatar-falcon':
        return `${trimmed} & the Brave Falcon`;
      default:
        return `${trimmed} the Champion`;
    }
  }
}


interface KidAvatarProps {
  avatar?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
  borderWidth?: number;
}

export default function KidAvatar({
  avatar = 'av-boy1',
  size = 48,
  style,
  borderColor = '#059669',
  borderWidth = 0,
}: KidAvatarProps) {
  const isCustomUri =
    avatar.startsWith('data:') ||
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('blob:') ||
    avatar.startsWith('file://');

  const presetImg = AVATAR_IMAGES[avatar];

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth,
    borderColor,
  };

  const imgStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (isCustomUri) {
    return (
      <View style={[containerStyle, style]}>
        <Image source={{ uri: avatar }} style={imgStyle} contentFit="cover" transition={150} />
      </View>
    );
  }

  if (presetImg) {
    return (
      <View style={[containerStyle, style]}>
        <Image source={presetImg} style={imgStyle} contentFit="cover" transition={150} />
      </View>
    );
  }

  // Fallback to emoji if any
  return (
    <View style={[containerStyle, style]}>
      <Text style={{ fontSize: size * 0.55 }}>{avatar || '👦'}</Text>
    </View>
  );
}

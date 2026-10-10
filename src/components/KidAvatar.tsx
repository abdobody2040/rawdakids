import React from 'react';
import { View, Image, Text, ImageStyle, ViewStyle, StyleProp } from 'react-native';

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

  'av-lantern': require('../../assets/images/mascot-noor.jpg'),
  'avatar-noor': require('../../assets/images/mascot-noor.jpg'),
  '🏮': require('../../assets/images/mascot-noor.jpg'),
  'noor': require('../../assets/images/mascot-noor.jpg'),

  'av-cat': require('../../assets/images/avatar-cat.jpg'),
  'avatar-cat': require('../../assets/images/avatar-cat.jpg'),
  '🐱': require('../../assets/images/avatar-cat.jpg'),
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
  { id: 'av-boy2', key: 'avatar-boy-2', traitAr: 'الذكي', traitEn: 'the Brilliant', nameAr: 'الذكي', nameEn: 'The Brilliant', image: AVATAR_IMAGES['av-boy2'] },
  { id: 'av-girl2', key: 'avatar-girl-2', traitAr: 'المبدعة', traitEn: 'the Creative', nameAr: 'المبدعة', nameEn: 'The Creative', image: AVATAR_IMAGES['av-girl2'] },
  { id: 'av-lantern', key: 'avatar-noor', traitAr: 'المحبوب', traitEn: 'the Beloved', nameAr: 'المحبوب', nameEn: 'The Beloved', image: AVATAR_IMAGES['av-lantern'] },
  { id: 'av-cat', key: 'avatar-cat', traitAr: 'صديق مشمش', traitEn: 'Mishmish’s Friend', nameAr: 'القطة مشمش', nameEn: 'Mishmish the Cat', image: AVATAR_IMAGES['av-cat'] },
];

export function getAvatarDisplayName(
  avatarId: string,
  childName?: string,
  language: 'ar' | 'en' = 'ar'
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
      case 'av-boy2':
      case 'avatar-boy-2':
        return `${trimmed} الذكي`;
      case 'av-girl2':
      case 'avatar-girl-2':
        return `${trimmed} المبدعة`;
      case 'av-lantern':
      case 'avatar-noor':
      case 'noor':
        return `${trimmed} المحبوب`;
      case 'av-cat':
      case 'avatar-cat':
        return `${trimmed} ومشمش`;
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
      case 'av-boy2':
      case 'avatar-boy-2':
        return `${trimmed} the Brilliant`;
      case 'av-girl2':
      case 'avatar-girl-2':
        return `${trimmed} the Creative`;
      case 'av-lantern':
      case 'avatar-noor':
      case 'noor':
        return `${trimmed} the Beloved`;
      case 'av-cat':
      case 'avatar-cat':
        return `Mishmish & ${trimmed}`;
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
        <Image source={{ uri: avatar }} style={imgStyle} resizeMode="cover" />
      </View>
    );
  }

  if (presetImg) {
    return (
      <View style={[containerStyle, style]}>
        <Image source={presetImg} style={imgStyle} resizeMode="cover" />
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

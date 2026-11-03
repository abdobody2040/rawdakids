import { ImageSourcePropType } from 'react-native';

/**
 * Rawda Kids (روضة كيدز) — Final UI Asset Constants
 *
 * Location: assets/images/ui/
 * - WebP with transparency: tiles, hadith, header-banner
 * - PNG with transparency: learning step icons, navigation & avatar icons
 */

export const UI_TILES = {
  repeatBoy: require('../../assets/images/ui/tile-repeat-boy.webp') as ImageSourcePropType,
  repeatGirl: require('../../assets/images/ui/tile-repeat-girl.webp') as ImageSourcePropType,
  wuduBoy: require('../../assets/images/ui/tile-wudu-boy.webp') as ImageSourcePropType,
  wuduGirl: require('../../assets/images/ui/tile-wudu-girl.webp') as ImageSourcePropType,
  salahBoy: require('../../assets/images/ui/tile-salah-boy.webp') as ImageSourcePropType,
  salahGirl: require('../../assets/images/ui/tile-salah-girl.webp') as ImageSourcePropType,
  discover: require('../../assets/images/ui/tile-discover.webp') as ImageSourcePropType,
} as const;

export const UI_HADITH = {
  wudu: require('../../assets/images/ui/hadith-wudu.webp') as ImageSourcePropType,
} as const;

export const UI_BANNER = {
  header: require('../../assets/images/ui/header-banner.webp') as ImageSourcePropType,
} as const;

export const UI_STEPS = {
  listen: require('../../assets/images/ui/step-listen.png') as ImageSourcePropType,
  learn: require('../../assets/images/ui/step-learn.png') as ImageSourcePropType,
  practice: require('../../assets/images/ui/step-practice.png') as ImageSourcePropType,
} as const;

export const UI_NAV = {
  home: require('../../assets/images/ui/nav-home.png') as ImageSourcePropType,
  quran: require('../../assets/images/ui/nav-quran.png') as ImageSourcePropType,
  stories: require('../../assets/images/ui/nav-stories.png') as ImageSourcePropType,
  discover: require('../../assets/images/ui/nav-discover.png') as ImageSourcePropType,
  meBoy: require('../../assets/images/ui/nav-me.png') as ImageSourcePropType,
  meGirl: require('../../assets/images/ui/nav-me-girl.png') as ImageSourcePropType,
} as const;

/**
 * Complete map of all UI assets by exact base filename
 */
export const UI_ASSETS = {
  // WebP with transparency
  'tile-repeat-boy': UI_TILES.repeatBoy,
  'tile-repeat-girl': UI_TILES.repeatGirl,
  'tile-wudu-boy': UI_TILES.wuduBoy,
  'tile-wudu-girl': UI_TILES.wuduGirl,
  'tile-salah-boy': UI_TILES.salahBoy,
  'tile-salah-girl': UI_TILES.salahGirl,
  'tile-discover': UI_TILES.discover,
  'hadith-wudu': UI_HADITH.wudu,
  'header-banner': UI_BANNER.header,

  // PNG with transparency
  'step-listen': UI_STEPS.listen,
  'step-learn': UI_STEPS.learn,
  'step-practice': UI_STEPS.practice,
  'nav-home': UI_NAV.home,
  'nav-quran': UI_NAV.quran,
  'nav-stories': UI_NAV.stories,
  'nav-discover': UI_NAV.discover,
  'nav-me': UI_NAV.meBoy,
  'nav-me-girl': UI_NAV.meGirl,
} as const;

export type UIAssetKey = keyof typeof UI_ASSETS;

/**
 * Helper to retrieve action tile by feature and child gender
 */
export function getTileAsset(
  activity: 'repeat' | 'wudu' | 'salah' | 'discover',
  gender: 'boy' | 'girl' = 'boy'
): ImageSourcePropType {
  switch (activity) {
    case 'repeat':
      return gender === 'girl' ? UI_TILES.repeatGirl : UI_TILES.repeatBoy;
    case 'wudu':
      return gender === 'girl' ? UI_TILES.wuduGirl : UI_TILES.wuduBoy;
    case 'salah':
      return gender === 'girl' ? UI_TILES.salahGirl : UI_TILES.salahBoy;
    case 'discover':
      return UI_TILES.discover;
  }
}

/**
 * Helper to retrieve avatar navigation icon by gender
 */
export function getNavAvatarAsset(gender: 'boy' | 'girl' = 'boy'): ImageSourcePropType {
  return gender === 'girl' ? UI_NAV.meGirl : UI_NAV.meBoy;
}

/**
 * Helper to retrieve daily 3-step icon
 */
export function getStepAsset(step: 'listen' | 'learn' | 'practice'): ImageSourcePropType {
  return UI_STEPS[step];
}

export default UI_ASSETS;


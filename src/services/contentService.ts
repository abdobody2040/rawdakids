// Content Service (Stories, Manners, Duas)
import { PROPHETS_STORIES, ProphetStory } from '@/data/storiesData';
import { MANNERS_BUILDINGS, MannerBuilding } from '@/data/mannersData';
import { DUAS_DATA, KidDua } from '@/data/duasData';
import { BADGES_DATA, STICKERS_DATA, AVATAR_OPTIONS, Badge, Sticker, AvatarOption } from '@/data/badgesData';

export const contentService = {
  getProphets: (): ProphetStory[] => {
    return PROPHETS_STORIES;
  },

  getProphetById: (id: string): ProphetStory | undefined => {
    return PROPHETS_STORIES.find((p) => p.id === id);
  },

  getMannersBuildings: (): MannerBuilding[] => {
    return MANNERS_BUILDINGS;
  },

  getMannersBuildingById: (id: string): MannerBuilding | undefined => {
    return MANNERS_BUILDINGS.find((b) => b.id === id);
  },

  getDuas: (): KidDua[] => {
    return DUAS_DATA;
  },

  getBadges: (): Badge[] => {
    return BADGES_DATA;
  },

  getStickers: (): Sticker[] => {
    return STICKERS_DATA;
  },

  getAvatars: (): AvatarOption[] => {
    return AVATAR_OPTIONS;
  },
};

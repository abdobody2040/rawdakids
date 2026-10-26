// Media Assets & Illustrative Mapping for Pillars of Islam, Iman, Wudu & Prayer Simulators
// Uses vibrant 3D child-friendly illustrations while observing Islamic theological guidelines.

export const ARKAN_IMAGES = {
  // Wudu & Salah Simulators (3D Rendered Assets)
  wuduHands: require('../../assets/images/wudu-hands-3d.jpg'),
  wuduRinse: require('../../assets/images/wudu-rinse-3d.jpg'),
  wuduFeet: require('../../assets/images/wudu-feet-3d.jpg'),
  wuduMouth: require('../../assets/images/wudu-mouth-boy.jpg'),
  wuduNose: require('../../assets/images/wudu-nose-girl.jpg'),
  wuduFace: require('../../assets/images/wudu-face-boy.jpg'),
  wuduArms: require('../../assets/images/wudu-arms-child.jpg'),
  wuduHead: require('../../assets/images/wudu-head-boy.jpg'),
  wuduFeetChild: require('../../assets/images/wudu-feet-child.jpg'),
  salahTakbeer: require('../../assets/images/salah-takbeer-3d.jpg'),
  salahStanding: require('../../assets/images/salah-standing-3d.jpg'),
  salahRukoo: require('../../assets/images/salah-rukoo-3d.jpg'),
  salahSujood: require('../../assets/images/salah-sujood-3d.jpg'),
  salahSitting: require('../../assets/images/salah-sitting-3d.jpg'),
  salahTasleem: require('../../assets/images/salah-tasleem-3d.jpg'),

  // 5 Pillars of Islam (3D Illustrated Icons & Scenes)
  shahada: require('../../assets/images/sticker-crescent.jpg'),
  salahPillar: require('../../assets/images/salah-standing-3d.jpg'),
  zakah: require('../../assets/images/manner-sharing.jpg'),
  sawm: require('../../assets/images/sticker-lantern.jpg'),
  hajj: require('../../assets/images/sticker-kaaba.jpg'),

  // 6 Pillars of Iman (3D Respectful Spiritual Themes)
  imanAllah: require('../../assets/images/hero-oasis.jpg'),
  imanAngels: require('../../assets/images/icon-star-3d.jpg'),
  imanBooks: require('../../assets/images/sticker-quran.jpg'),
  imanMessengers: require('../../assets/images/prophets-caravan.jpg'),
  imanLastday: require('../../assets/images/icon-gem-3d.jpg'),
  imanQadar: require('../../assets/images/manner-cleanliness.jpg'),
};

/**
 * Returns the rich 3D illustrated media asset for a given Pillar.
 */
export function getPillarMedia(pillarId: string): any {
  switch (pillarId) {
    case 'shahada':
      return ARKAN_IMAGES.shahada;
    case 'salah':
      return ARKAN_IMAGES.salahPillar;
    case 'zakah':
      return ARKAN_IMAGES.zakah;
    case 'sawm':
      return ARKAN_IMAGES.sawm;
    case 'hajj':
      return ARKAN_IMAGES.hajj;
    case 'iman_allah':
      return ARKAN_IMAGES.imanAllah;
    case 'iman_angels':
      return ARKAN_IMAGES.imanAngels;
    case 'iman_books':
      return ARKAN_IMAGES.imanBooks;
    case 'iman_messengers':
      return ARKAN_IMAGES.imanMessengers;
    case 'iman_lastday':
      return ARKAN_IMAGES.imanLastday;
    case 'iman_qadar':
      return ARKAN_IMAGES.imanQadar;
    default:
      return ARKAN_IMAGES.salahPillar;
  }
}

/**
 * Returns the rich 3D illustrated media asset for each step in Wudu or Salah.
 */
export function getStepMedia(simMode: 'wudu' | 'prayer', stepNumber: number): any {
  if (simMode === 'wudu') {
    switch (stepNumber) {
      case 1:
        return ARKAN_IMAGES.wuduHands; // 1. النية في القلب
      case 2:
        return ARKAN_IMAGES.wuduHands; // 2. التسمية
      case 3:
        return ARKAN_IMAGES.wuduHands; // 3. غسل الكفين ثلاثاً
      case 4:
        return ARKAN_IMAGES.wuduMouth; // 4. المضمضة ثلاثاً
      case 5:
        return ARKAN_IMAGES.wuduNose; // 5. الاستنشاق والاستنثار
      case 6:
        return ARKAN_IMAGES.wuduFace; // 6. غسل الوجه (matches PDF Page 3)
      case 7:
        return ARKAN_IMAGES.wuduArms; // 7. غسل اليدين للمرفقين
      case 8:
        return ARKAN_IMAGES.wuduHead; // 8. مسح الرأس
      case 9:
        return ARKAN_IMAGES.wuduHead; // 9. مسح الأذنين
      case 10:
        return ARKAN_IMAGES.wuduFeetChild; // 10. غسل الرجلين للكعبين والدعاء
      default:
        return ARKAN_IMAGES.wuduHands;
    }
  } else {
    switch (stepNumber) {
      case 1:
        return ARKAN_IMAGES.salahTakbeer; // استقبال القبلة وتكبيرة الإحرام (نفس الطفل يرفع يديه حذو أذنيه)
      case 2:
        return ARKAN_IMAGES.salahStanding; // وضع اليد اليمنى على اليسرى وقراءة الفاتحة
      case 3:
        return ARKAN_IMAGES.salahRukoo; // الركوع وتعظيم الله
      case 4:
        return ARKAN_IMAGES.salahStanding; // الرفع من الركوع والاعتدال
      case 5:
        return ARKAN_IMAGES.salahSujood; // السجود الأول
      case 6:
        return ARKAN_IMAGES.salahSitting; // الجلوس بين السجدتين
      case 7:
        return ARKAN_IMAGES.salahSujood; // السجود الثاني
      case 8:
        return ARKAN_IMAGES.salahSitting; // التشهد الأول ورفع السبابة
      case 9:
        return ARKAN_IMAGES.salahSitting; // الصلاة الإبراهيمية
      case 10:
        return ARKAN_IMAGES.salahTasleem; // التسليم وإتمام الصلاة (نفس الطفل يلتفت لليمين مسلماً)
      default:
        return ARKAN_IMAGES.salahStanding;
    }
  }
}

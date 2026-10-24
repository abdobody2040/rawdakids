// src/services/prayerTimeService.ts
// Calculates prayer times and next prayer countdown based on City and Fiqh Madhhab (PRD §8 - PRY-3 & PRY-4)

export interface CityPrayerConfig {
  key: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  baseTimes: {
    fajr: [number, number];    // [hour, min]
    sunrise: [number, number];
    dhuhr: [number, number];
    asrShafii: [number, number];
    asrHanafi: [number, number];
    maghrib: [number, number];
    isha: [number, number];
  };
}

export const SUPPORTED_CITIES: CityPrayerConfig[] = [
  {
    key: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    baseTimes: {
      fajr: [4, 45],
      sunrise: [6, 10],
      dhuhr: [11, 55],
      asrShafii: [15, 15],
      asrHanafi: [16, 5],
      maghrib: [17, 45],
      isha: [19, 5],
    },
  },
  {
    key: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    baseTimes: {
      fajr: [5, 5],
      sunrise: [6, 25],
      dhuhr: [12, 18],
      asrShafii: [15, 38],
      asrHanafi: [16, 28],
      maghrib: [18, 12],
      isha: [19, 42],
    },
  },
  {
    key: 'madinah',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    baseTimes: {
      fajr: [5, 8],
      sunrise: [6, 28],
      dhuhr: [12, 19],
      asrShafii: [15, 40],
      asrHanafi: [16, 30],
      maghrib: [18, 11],
      isha: [19, 41],
    },
  },
  {
    key: 'alexandria',
    nameAr: 'الإسكندرية',
    nameEn: 'Alexandria',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    baseTimes: {
      fajr: [4, 50],
      sunrise: [6, 16],
      dhuhr: [12, 0],
      asrShafii: [15, 20],
      asrHanafi: [16, 10],
      maghrib: [17, 48],
      isha: [19, 10],
    },
  },
  {
    key: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    baseTimes: {
      fajr: [4, 45],
      sunrise: [6, 5],
      dhuhr: [11, 48],
      asrShafii: [15, 8],
      asrHanafi: [15, 58],
      maghrib: [17, 42],
      isha: [19, 12],
    },
  },
  {
    key: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    baseTimes: {
      fajr: [5, 5],
      sunrise: [6, 24],
      dhuhr: [12, 14],
      asrShafii: [15, 34],
      asrHanafi: [16, 24],
      maghrib: [18, 8],
      isha: [19, 28],
    },
  },
  {
    key: 'amman',
    nameAr: 'عمّان',
    nameEn: 'Amman',
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    baseTimes: {
      fajr: [4, 52],
      sunrise: [6, 18],
      dhuhr: [12, 2],
      asrShafii: [15, 22],
      asrHanafi: [16, 12],
      maghrib: [17, 50],
      isha: [19, 10],
    },
  },
  {
    key: 'jerusalem',
    nameAr: 'القدس الشريف',
    nameEn: 'Jerusalem',
    countryAr: 'فلسطين',
    countryEn: 'Palestine',
    baseTimes: {
      fajr: [4, 50],
      sunrise: [6, 16],
      dhuhr: [12, 1],
      asrShafii: [15, 21],
      asrHanafi: [16, 11],
      maghrib: [17, 49],
      isha: [19, 9],
    },
  },
];

export interface PrayerTimeSlot {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  nameEn: string;
  timeStringAr: string;
  timeStringEn: string;
  rakahs: number;
  minutesFromMidnight: number;
  isPassed: boolean;
  isNext: boolean;
}

export function formatTime12h(hours: number, minutes: number, isArabic: boolean): string {
  const periodAr = hours >= 12 ? 'م' : 'ص';
  const periodEn = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hStr = h12 < 10 ? `0${h12}` : `${h12}`;

  if (isArabic) {
    // Convert to eastern digits if helpful or keep clean Arabic format
    return `${hStr}:${mStr} ${periodAr}`;
  }
  return `${hStr}:${mStr} ${periodEn}`;
}

export function getPrayerTimesForCity(
  cityKey = 'cairo',
  madhhab: 'hanafi' | 'maliki' | 'shafii' | 'hanbali' = 'shafii',
  isArabic = true
): {
  city: CityPrayerConfig;
  slots: PrayerTimeSlot[];
  nextSlot: PrayerTimeSlot;
} {
  const city = SUPPORTED_CITIES.find((c) => c.key === cityKey) || SUPPORTED_CITIES[0];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const asrTime = madhhab === 'hanafi' ? city.baseTimes.asrHanafi : city.baseTimes.asrShafii;

  const rawSlots: {
    id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nameAr: string;
    nameEn: string;
    hours: number;
    minutes: number;
    rakahs: number;
  }[] = [
    { id: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', hours: city.baseTimes.fajr[0], minutes: city.baseTimes.fajr[1], rakahs: 2 },
    { id: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', hours: city.baseTimes.sunrise[0], minutes: city.baseTimes.sunrise[1], rakahs: 0 },
    { id: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', hours: city.baseTimes.dhuhr[0], minutes: city.baseTimes.dhuhr[1], rakahs: 4 },
    { id: 'asr', nameAr: 'العصر', nameEn: 'Asr', hours: asrTime[0], minutes: asrTime[1], rakahs: 4 },
    { id: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', hours: city.baseTimes.maghrib[0], minutes: city.baseTimes.maghrib[1], rakahs: 3 },
    { id: 'isha', nameAr: 'العشاء', nameEn: 'Isha', hours: city.baseTimes.isha[0], minutes: city.baseTimes.isha[1], rakahs: 4 },
  ];

  // Determine which prayer is next (excluding sunrise for next prayer countdown)
  let foundNext = false;
  let nextSlotIndex = 0;

  for (let i = 0; i < rawSlots.length; i++) {
    const slotMin = rawSlots[i].hours * 60 + rawSlots[i].minutes;
    if (slotMin > currentMinutes && rawSlots[i].id !== 'sunrise') {
      nextSlotIndex = i;
      foundNext = true;
      break;
    }
  }

  // If all prayers passed today, next prayer is Fajr tomorrow
  if (!foundNext) {
    nextSlotIndex = 0;
  }

  const slots: PrayerTimeSlot[] = rawSlots.map((s, idx) => {
    const slotMin = s.hours * 60 + s.minutes;
    const isPassed = currentMinutes >= slotMin;
    const isNext = idx === nextSlotIndex;

    return {
      id: s.id,
      nameAr: s.nameAr,
      nameEn: s.nameEn,
      timeStringAr: formatTime12h(s.hours, s.minutes, true),
      timeStringEn: formatTime12h(s.hours, s.minutes, false),
      rakahs: s.rakahs,
      minutesFromMidnight: slotMin,
      isPassed,
      isNext,
    };
  });

  const nextSlot = slots[nextSlotIndex] || slots[0];

  return {
    city,
    slots,
    nextSlot,
  };
}

export function isBedtimeActive(bedtimeStart = '20:00', bedtimeEnd = '06:00'): boolean {
  try {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = bedtimeStart.split(':').map(Number);
    const [endH, endM] = bedtimeEnd.split(':').map(Number);

    const startTotal = startH * 60 + (startM || 0);
    const endTotal = endH * 60 + (endM || 0);

    // Bedtime usually spans overnight (e.g. 20:00 to 06:00)
    if (startTotal > endTotal) {
      return currentMin >= startTotal || currentMin < endTotal;
    } else {
      return currentMin >= startTotal && currentMin < endTotal;
    }
  } catch {
    return false;
  }
}

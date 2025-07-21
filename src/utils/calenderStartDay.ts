import { getDaysInMonth } from './calenderUtils';

export const getBSStartDay = (
  targetYear: number,
  targetMonth: number
): number => {
  const baseYear = 1970;
  const baseMonth = 1;
  const baseDayIndex = 0;

  let dayOffset = 0;

  if (
    targetYear > baseYear ||
    (targetYear === baseYear && targetMonth > baseMonth)
  ) {
    for (let y = baseYear; y <= targetYear; y++) {
      const startMonth = y === baseYear ? baseMonth : 1;
      const endMonth = y === targetYear ? targetMonth - 1 : 12;
      for (let m = startMonth; m <= endMonth; m++) {
        dayOffset += getDaysInMonth(y, m);
      }
    }
  } else if (
    targetYear < baseYear ||
    (targetYear === baseYear && targetMonth < baseMonth)
  ) {
    for (let y = baseYear; y >= targetYear; y--) {
      const endMonth = y === baseYear ? baseMonth - 1 : 12;
      const startMonth = y === targetYear ? targetMonth : 1;
      for (let m = endMonth; m >= startMonth; m--) {
        dayOffset -= getDaysInMonth(y, m);
      }
    }
  }

  const dayIndex = (baseDayIndex + dayOffset) % 7;
  return dayIndex < 0 ? 7 + dayIndex : dayIndex;
};


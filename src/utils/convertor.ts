import type { CustomDate } from "../types/types";
import { BaseMonthDaysByYear } from "../constants/bsYear";

const bsEpoch: CustomDate = { year: 1970, month: 1, day: 1 };
const adEpoch = new Date(1913, 3, 13); // May 13, 1913 (month is 0-based)

// Calculate days difference ignoring time
function daysBetweenDates(d1: Date, d2: Date): number {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((date2.getTime() - date1.getTime()) / msPerDay);
}

export function convertADToBS(adDate: Date): CustomDate {
  const diffDays = daysBetweenDates(adEpoch, adDate);
  let bsYear = bsEpoch.year;
  let bsMonth = bsEpoch.month;
  let bsDay = bsEpoch.day;

  let remainingDays = diffDays;
  while (remainingDays > 0) {
    // Check if year data exists
    if (!BaseMonthDaysByYear[bsYear]) {
      throw new Error(
        `Year ${bsYear} is outside the supported range (1970-2099)`
      );
    }

    // Use safe month key access (months are 1-based)
    const daysInMonth = BaseMonthDaysByYear[bsYear][bsMonth];
    if (typeof daysInMonth !== "number") {
      throw new Error(
        `Invalid calendar data for year ${bsYear}, month ${bsMonth}`
      );
    }

    bsDay++;
    if (bsDay > daysInMonth) {
      bsDay = 1;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }

    remainingDays--;
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

export function convertBSToAD(bsDate: CustomDate): CustomDate {
  let bsYear = bsEpoch.year;
  let bsMonth = bsEpoch.month;
  let bsDay = bsEpoch.day;
  let adDate = new Date(adEpoch);

  while (
    bsYear !== bsDate.year ||
    bsMonth !== bsDate.month ||
    bsDay !== bsDate.day
  ) {
    if (!BaseMonthDaysByYear[bsYear]) {
      throw new Error(
        `Year ${bsYear} is outside the supported range (1970-2099)`
      );
    }

    const daysInMonth = BaseMonthDaysByYear[bsYear][bsMonth];
    if (typeof daysInMonth !== "number") {
      throw new Error(
        `Invalid calendar data for year ${bsYear}, month ${bsMonth}`
      );
    }

    bsDay++;
    adDate.setDate(adDate.getDate() + 1);

    if (bsDay > daysInMonth) {
      bsDay = 1;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
  }

  return {
    year: adDate.getFullYear(),
    month: adDate.getMonth() + 1, // JS Date months are 0-based
    day: adDate.getDate(),
  };
}

export function getTodayBS(): CustomDate {
  return convertADToBS(new Date());
}

export function getDaysInMonth(year: number, month: number): number {
  if (!BaseMonthDaysByYear[year]) {
    throw new Error(`Year ${year} is outside the supported range (1970-2099)`);
  }

  const daysInMonth = BaseMonthDaysByYear[year][month];
  if (typeof daysInMonth !== "number") {
    throw new Error(`Invalid calendar data for year ${year}, month ${month}`);
  }

  return daysInMonth;
}

export function isValidBsDate(date: CustomDate): boolean {
  try {
    const { year, month, day } = date;

    if (!BaseMonthDaysByYear[year]) return false;
    if (month < 1 || month > 12) return false;

    const daysInMonth = BaseMonthDaysByYear[year][month];
    if (typeof daysInMonth !== "number") return false;
    if (day < 1 || day > daysInMonth) return false;

    return true;
  } catch {
    return false;
  }
}

export function isDateInRange(
  date: CustomDate,
  minDate?: CustomDate,
  maxDate?: CustomDate
): boolean {
  if (!isValidBsDate(date)) return false;

  if (minDate && compareDates(date, minDate) < 0) return false;
  if (maxDate && compareDates(date, maxDate) > 0) return false;

  return true;
}

export function compareDates(a: CustomDate, b: CustomDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function getFirstDayOfMonth(bsYear: number, bsMonth: number): number {
  const bsDate: CustomDate = { year: bsYear, month: bsMonth, day: 1 };
  const adDate = convertBSToAD(bsDate);

  const jsDate = new Date(adDate.year, adDate.month - 1, adDate.day);
  return jsDate.getDay(); // 0 = Sunday, 6 = Saturday
}

export function addMonths(date: CustomDate, months: number): CustomDate {
  let { year, month, day } = date;

  month += months;
  while (month > 12) {
    month -= 12;
    year++;
  }
  while (month < 1) {
    month += 12;
    year--;
  }

  const maxDays = getDaysInMonth(year, month);
  if (day > maxDays) day = maxDays;

  return { year, month, day };
}

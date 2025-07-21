import { BaseMonthDaysByYear } from "./bsYear";

export function getDaysInMonth(year: number, month: number): number {
    return BaseMonthDaysByYear[year]?.[month] ?? 0;
}

export const availableYears: number[] = Object.keys(BaseMonthDaysByYear).map(Number);
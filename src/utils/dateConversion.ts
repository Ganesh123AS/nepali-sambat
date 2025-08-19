import { BaseMonthDaysByYear } from '../constants/bsYear';

// Reference: 1970-01-01(BS) = 1913-04-13(AD)
const BS_START_YEAR = 1970;
const AD_START_DATE = '1913-03-13';

export const convertADtoBS = (adDate: string): { year: number, month: number, day: number } | null => {
    try {
        const ad = new Date(adDate);
        const diffInDays = Math.floor((ad.getTime() - new Date(AD_START_DATE).getTime()) / 86400000);
        return calculateBSFromGivenTotalDays(diffInDays);
    } catch {
        return null;
    }
};

function calculateBSFromGivenTotalDays(daysElapsed: number) {
    let totalDays = 0;
    for (let year = BS_START_YEAR; year <= 2099; year++) {
        const months = BaseMonthDaysByYear[year];
        if (!months) continue;
        for (let month = 1; month <= 12; month++) {
            const monthDays = months[month];
            if (totalDays + monthDays > daysElapsed) {
                const day = daysElapsed - totalDays + 1;
                return { year, month, day };
            }
            totalDays += monthDays;
        }
    }
    return null;
}

export const convertBStoAD = (
    year: number,
    month: number,
    day: number
): string | null => {
    try {
        let daysCount = 0;
        for (let y = BS_START_YEAR; y <= year; y++) {
            const months = BaseMonthDaysByYear[y];
            if (!months) continue;
            if (y === year) {
                for (let m = 1; m < month; m++) {
                    daysCount += months[m] || 0;
                }
                daysCount += day - 1;
            } else {
                for (let m = 1; m <= 12; m++) {
                    daysCount += months[m] || 0;
                }
            }
        }
        const adDate = new Date(AD_START_DATE);
        adDate.setDate(adDate.getDate() + daysCount);
        const adYear = adDate.getFullYear();
        const adMonth = adDate.getMonth() + 1;
        const adDay = adDate.getDate();
        return `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
    } catch {
        return null;
    }
};

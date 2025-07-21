import React$1 from 'react';

type CalendarType = 'AD' | 'BS';
type variantType = 'outlined' | 'standard' | 'filled';
type themeType = 'light' | 'standard' | 'basic';
interface NepaliCalendarProps {
    label?: string;
    labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    name?: string;
    minYears?: string;
    disableFuture?: boolean;
    theme?: themeType;
    variant?: variantType;
    selectTodayDate?: boolean;
    dynamicDate?: CalendarType[];
    isRequired?: Boolean;
    size?: number;
    icon: any;
    formValues?: Record<string, string>;
    onChange?: (event: {
        target: {
            name: string;
            value: {
                ad: string;
                bs: string;
            };
        };
    }) => void;
}

declare const convertADtoBS: (adDate: string) => {
    year: number;
    month: number;
    day: number;
} | null;
declare const convertBStoAD: (year: number, month: number, day: number) => string | null;

declare const NepaliCalendar: React$1.FC<NepaliCalendarProps>;

export { NepaliCalendar, convertADtoBS, convertBStoAD };

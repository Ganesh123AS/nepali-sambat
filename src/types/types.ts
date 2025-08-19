export interface DynamicIconsProps {
  type?: 'calendar' | 'left' | 'right';
}

export interface CustomDate {
  year: number;
  month: number;
  day: number;
}

export type CustomDateFormatOptions = {
  format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD" | string;
  lang?: "eng" | "nep";
  separator?: string;
};

export interface DatePickerProps {
  value?: CustomDate | null;
  onChange?: (date: CustomDate) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: CustomDate;
  maxDate?: CustomDate;
  formatOptions?: CustomDateFormatOptions;
  className?: object;
  inputClassName?: string;
  calendarClassName?: string;
  position?: "bottom" | "top" | "auto";
  dayClassName?: string;
  selectedDayClassName?: string;
  todayClassName?: string;
  disabledDayClassName?: string;
  icon: any,
}

export interface CalendarProps {
  lang?: "eng" | "nep";
  selectedDate?: CustomDate | null;
  viewDate: CustomDate;
  onDateSelect: (date: CustomDate) => void;
  onViewDateChange: (date: CustomDate) => void;
  minDate?: CustomDate;
  maxDate?: CustomDate;
  calendarClassName?: string;
  dayClassName?: string;
  selectedDayClassName?: string;
  todayClassName?: string;
  disabledDayClassName?: string;
  className?: object;
}

export interface DateInputProps {
  value?: CustomDate | null;
  onChange?: (value: string) => void;
  onSelect?: (date: CustomDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
  formatOptions?: CustomDateFormatOptions;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface MonthNavigationProps {
  viewDate: CustomDate;
  onViewDateChange: (date: CustomDate) => void;
  lang?: "eng" | "nep";
  icon?: any;
}
import React, { useEffect, useRef, useState } from 'react';
import { getDaysInMonth, availableYears } from './utils/calenderUtils';
import { CalendarType, NepaliCalendarProps } from './types/types';
import { getBSStartDay } from './utils/calenderStartDay';
import { days, adDays } from './constants/days';
import { months, adMonths } from './constants/months';
import './styles.css';
import { convertADtoBS, convertBStoAD } from './utils/dateConversion';
import DynamicIcons from './comp/DynamicIcons';
import RenderCells from './comp/RenderCells';


const NepaliCalendar: React.FC<NepaliCalendarProps> = ({
    label,
    labelProps,
    isRequired,
    name = 'Date',
    minYears,
    disableFuture,
    theme = 'light',
    variant,
    selectTodayDate = false,
    dynamicDate = ["BS"],
    size = 12,
    icon,
    formValues,
    onChange,
}) => {
    const [focused, setFocused] = useState(false);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const getInitialCalendarType = (dynamicDate?: CalendarType[]): CalendarType => {
        if (dynamicDate?.includes('AD') && !dynamicDate.includes('BS')) return 'AD';
        return 'BS';
    };
    const isDynamic = dynamicDate.includes("AD") && dynamicDate.includes("BS");
    const getCurrentADDate = () => {
        const today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate(),
        };
    };

    const getCurrentBSDate = () => {
        const today = new Date();
        const gregorianDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const bsDate = convertADtoBS(gregorianDate);
        if (!bsDate) return { year: 0, month: 0, day: 0 };
        return { year: bsDate.year, month: bsDate.month, day: bsDate.day };
    };


    const currentADDate = getCurrentADDate();
    const currentBSDate = getCurrentBSDate();

    const [calendarType, setCalendarType] = useState<CalendarType>(() => getInitialCalendarType(dynamicDate));
    const [adYear, setADYear] = useState(currentADDate.year);
    const [adMonth, setADMonth] = useState(currentADDate.month);
    const [bsYear, setBSYear] = useState(currentBSDate.year);
    const [bsMonth, setBSMonth] = useState(currentBSDate.month);
    const [selectedDay, setSelectedDay] = useState<number | null>(
        selectTodayDate ? (calendarType === 'AD' ? currentADDate.day : currentBSDate.day) : null
    );
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const maxAgeObj = parseDateConstraint(minYears, calendarType === 'AD');
    const maxDateObj = disableFuture ? (calendarType === 'AD' ? getCurrentADDate() : getCurrentBSDate()) : null;

    function parseDateConstraint(constraint?: string, isAD: boolean = false) {
        if (!constraint) return null;
        if (constraint === 'futureDate') return isAD ? getCurrentADDate() : getCurrentBSDate();
        if (/^\d+$/.test(constraint)) {
            const yearsAgo = parseInt(constraint);
            const date = isAD ? getCurrentADDate() : getCurrentBSDate();
            return { year: date.year - yearsAgo, month: date.month, day: date.day };
        }
        if (constraint.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = constraint.split('-').map(Number);
            return { year, month, day };
        }
        return null;
    }

    const adYears = Array.from({ length: currentADDate.year + 20 - 1900 }, (_, i) => 1893 + i);
    const filteredYears = calendarType === 'AD'
        ? adYears.filter((y) => (!maxAgeObj || y <= maxAgeObj.year) && (!maxDateObj || y <= maxDateObj.year))
        : availableYears.filter((y) => (!maxAgeObj || y <= maxAgeObj.year) && (!maxDateObj || y <= maxDateObj.year));

    const getADDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

    useEffect(() => {
        if (selectedDay !== null) {
            let adDate = '';
            let bsDate = '';

            try {
                if (calendarType === 'AD') {
                    adDate = `${adYear}-${String(adMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                    const bsObj = convertADtoBS(adDate);
                    if (!bsObj) throw new Error('Invalid AD date');
                    bsDate = `${bsObj.year}-${String(bsObj.month).padStart(2, '0')}-${String(bsObj.day).padStart(2, '0')}`;
                    setInputValue(`${adMonths[adMonth - 1]} ${selectedDay}, ${adYear}`);
                } else {
                    bsDate = `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                    adDate = convertBStoAD(bsYear, bsMonth, selectedDay) || '';
                    setInputValue(`${months[bsMonth - 1]} ${selectedDay}, ${bsYear}`);
                }

                onChange?.({
                    target: {
                        name,
                        value: {
                            ad: dynamicDate ? adDate : '',
                            bs: bsDate,
                        },
                    },
                });
            } catch (error) {
                setInputValue('');
                onChange?.({ target: { name, value: { ad: '', bs: '' } } });
            }
        } else {
            setInputValue('');
            onChange?.({ target: { name, value: { ad: '', bs: '' } } });
        }
    }, [selectedDay, calendarType]);

    useEffect(() => {
        if (formValues) {
            const bs = formValues[name];
            if (calendarType === 'BS' && bs) {
                const [year, month, day] = bs.split('-').map(Number);
                if (year && month && day) {
                    setBSYear(year);
                    setBSMonth(month);
                    setSelectedDay(day);
                }
            }

            const ad = formValues?.date2;
            if (calendarType === 'AD' && ad) {
                const [year, month, day] = ad.split('-').map(Number);
                if (year && month && day) {
                    setADYear(year);
                    setADMonth(month);
                    setSelectedDay(day);
                }
            }
        }
        return;

    }, [calendarType, formValues]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setCalendarVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isDaySelectable = (day: number) => {
        const selectedDate = calendarType === 'AD'
            ? { year: adYear, month: adMonth, day }
            : { year: bsYear, month: bsMonth, day };

        const compare = (limit: any) => {
            if (!limit) return true;
            const { year, month, day: d } = selectedDate;
            return (
                year < limit.year ||
                (year === limit.year && month < limit.month) ||
                (year === limit.year && month === limit.month && d <= limit.day)
            );
        };

        return compare(maxAgeObj) && compare(maxDateObj);
    };

    const handleCalendarTypeChange = (newType: CalendarType) => {
        if (newType === calendarType) return;
        if (selectedDay) {
            if (newType === 'AD') {
                const ad = convertBStoAD(bsYear, bsMonth, selectedDay);
                if (ad) {
                    const [y, m, d] = ad.split('-').map(Number);
                    setADYear(y);
                    setADMonth(m);
                    setSelectedDay(d);
                }
            } else {
                const adDate = `${adYear}-${String(adMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                const bs = convertADtoBS(adDate);
                if (bs) {
                    setBSYear(bs.year);
                    setBSMonth(bs.month);
                    setSelectedDay(bs.day);
                }
            }
        } else {
            setSelectedDay(null);
        }
        setCalendarType(newType);
    };


    return (
        <div className={`calendar-wrapper lg-${size}`} ref={calendarRef}>
            <div className='calendar-wrapper-inner'>
                <div className="main-textfield">
                    {isDynamic && (
                        <div className="calendar-radio-group">
                            <label className="calendar-radio-label">
                                <input
                                    type="radio"
                                    checked={calendarType === 'BS'}
                                    onChange={() => handleCalendarTypeChange("BS")}
                                />
                                B.S.
                            </label>
                            <label className="calendar-radio-label">
                                <input
                                    type="radio"
                                    checked={calendarType === 'AD'}
                                    onChange={() => handleCalendarTypeChange("AD")}
                                />
                                A.D.
                            </label>
                        </div>
                    )}

                    <div className="calendar-input-wrapper">
                        {variant !== 'outlined' && label && <label {...(labelProps ? labelProps : { className: 'label-input' })}>
                            {label}
                            {isRequired && <span className='label-is-required'>*</span>}
                        </label>}
                        {variant === "outlined" ? (
                            <>
                                <input
                                    id={name}
                                    type="text"
                                    readOnly
                                    value={inputValue}
                                    onClick={() => setCalendarVisible((prev) => !prev)}
                                    className={`calendar-input ${variant} ${inputValue ? 'has-value' : ''}`}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                />
                                <label
                                    htmlFor={name}
                                    className={`calendar-floating-label ${variant} ${focused || inputValue ? 'float' : ''}`}
                                >
                                    {label}
                                    {isRequired && <span className="label-is-required">*</span>}
                                </label>
                                <span className="calendar-input-icon">
                                    {icon ? icon : <DynamicIcons type={'calendar'} />}
                                </span>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    readOnly
                                    value={inputValue}
                                    onClick={() => setCalendarVisible((prev) => !prev)}
                                    className={`calendar-input ${variant} ${inputValue ? 'has-value' : ''}`}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                />
                                <span className="calendar-input-icon">
                                    {icon ? icon : <DynamicIcons type={'calendar'} />}
                                </span>
                            </>
                        )}

                    </div>
                </div>
            </div>

            {isCalendarVisible && (
                <div className={`calendar-wrapper-new ${theme}`}>
                    <div className="calendar-container">
                        <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className='calender-header-button'>
                                <button
                                    type="button"
                                    className="calendar-button-arrow"
                                    onClick={() => {
                                        if (calendarType === 'AD') {
                                            if (adMonth === 1) {
                                                setADYear(adYear - 1);
                                                setADMonth(12);
                                            } else {
                                                setADMonth(adMonth - 1);
                                            }
                                        } else {
                                            if (bsMonth === 1) {
                                                setBSYear(bsYear - 1);
                                                setBSMonth(12);
                                            } else {
                                                setBSMonth(bsMonth - 1);
                                            }
                                        }
                                        setSelectedDay(null);
                                    }}
                                >
                                    {icon ? icon : <DynamicIcons type={'left'} />}
                                </button>
                                <select
                                    value={calendarType === 'AD' ? adMonth : bsMonth}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        calendarType === 'AD' ? setADMonth(value) : setBSMonth(value);
                                        setSelectedDay(null);
                                    }}
                                    className="calendar-select"
                                >
                                    {(calendarType === 'AD' ? adMonths : months).map((m, idx) => (
                                        <option key={idx} value={idx + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='calender-header-button'>
                                <select
                                    value={calendarType === 'AD' ? adYear : bsYear}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        calendarType === 'AD' ? setADYear(value) : setBSYear(value);
                                        setSelectedDay(null);
                                    }}
                                    className="calendar-select"
                                >
                                    {filteredYears.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className='calendar-button-arrow'
                                    onClick={() => {
                                        if (calendarType === 'AD') {
                                            if (adMonth === 12) {
                                                setADYear(adYear + 1);
                                                setADMonth(1);
                                            } else {
                                                setADMonth(adMonth + 1);
                                            }
                                        } else {
                                            if (bsMonth === 12) {
                                                setBSYear(bsYear + 1);
                                                setBSMonth(1);
                                            } else {
                                                setBSMonth(bsMonth + 1);
                                            }
                                        }
                                        setSelectedDay(null);
                                    }}
                                >
                                    {icon ? icon : <DynamicIcons type={'right'} />}
                                </button>
                            </div>
                        </div>

                        <div className="calendar-grid">
                            {(calendarType === 'AD' ? adDays : days).map((d, i) => (
                                <div key={i} className="calendar-day-name">{d}</div>
                            ))}
                            <RenderCells
                                year={calendarType === 'AD' ? adYear : bsYear}
                                month={calendarType === 'AD' ? adMonth : bsMonth}
                                getDays={calendarType === 'AD' ? getADDaysInMonth : getDaysInMonth}
                                startDay={calendarType === 'AD' ? new Date(adYear, adMonth - 1, 1).getDay() : getBSStartDay(bsYear, bsMonth)}
                                totalDays={
                                    calendarType === 'AD'
                                        ? getADDaysInMonth(adYear, adMonth)
                                        : getDaysInMonth(bsYear, bsMonth)
                                }
                                selectedDay={selectedDay}
                                isDaySelectable={isDaySelectable}
                                onDayClick={(day) => {
                                    setSelectedDay(day);
                                    setCalendarVisible(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { NepaliCalendar, convertADtoBS, convertBStoAD };

